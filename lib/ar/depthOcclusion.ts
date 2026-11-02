import * as THREE from "three";

/**
 * Real depth-sensing occlusion for the WebXR AR view, using the W3C WebXR
 * Depth Sensing API (https://www.w3.org/TR/webxr-depth-sensing-1/). On
 * supported hardware (Android Chrome, phones with a depth-capable camera
 * via ARCore), this lets a real object — a hand reaching in front of the
 * placed model, for example — correctly occlude the model instead of the
 * model always rendering on top of the entire camera feed. That's what
 * makes a touch look real rather than like a flat sticker.
 *
 * This is a real, standardized browser feature, not AI-generated content:
 * it only ever makes rendering *order* correct (what's in front of what).
 * It has no effect on whether the model "knows" it was touched.
 *
 * IMPORTANT CAVEATS:
 *  - Support is narrow even among Android devices: it needs a depth
 *    sensor/estimation pipeline (ARCore's Depth API) and a browser build
 *    that exposes "depth-sensing" with "gpu-optimized" usage. Most
 *    desktop and iOS browsers have no WebXR immersive-ar support at all,
 *    so this code path never runs there (same ceiling as the rest of the
 *    WebXR viewer).
 *  - This has not been verified against a physical depth-capable device —
 *    there's no way to test real WebXR depth-sensing hardware in this
 *    environment. The implementation follows the spec and the reference
 *    occlusion technique Google documents for ARCore's depth API, but if
 *    the occlusion looks inverted, offset, or doesn't appear on a real
 *    device, that's the most likely place to debug first.
 */

const occlusionState = new WeakMap<
  THREE.Material,
  {
    uDepthTexture: { value: THREE.Texture | null };
    uDepthUvTransform: { value: THREE.Matrix4 };
    uViewportSize: { value: THREE.Vector2 };
    uRawValueToMeters: { value: number };
    uDepthEnabled: { value: number };
  }
>();

/** Requests an XRWebGLBinding for depth-sensing, or null if unsupported/unavailable. */
export function setupDepthOcclusion(session: XRSession, gl: WebGLRenderingContext | WebGL2RenderingContext): {
  binding: XRWebGLBinding;
  depthTexture: THREE.ExternalTexture;
} | null {
  if (typeof XRWebGLBinding === "undefined") return null;

  try {
    // Reading `.depthUsage` throws (not just "undefined") on sessions
    // that never requested the "depth-sensing" feature at all — this
    // must be guarded, not just checked with !==, or every session
    // without depth-sensing crashes here.
    // Only the GPU-optimized usage mode is wired up here — it's the mode
    // meant for full-screen occlusion shaders. CPU-optimized depth exists
    // for point-sampling use cases (hit-testing, physics), not this.
    if (session.depthUsage !== "gpu-optimized") return null;
  } catch {
    return null;
  }

  try {
    const binding = new XRWebGLBinding(session, gl);
    // Constructed once and reused every frame — only its .sourceTexture
    // reference gets swapped out as new depth frames arrive.
    const depthTexture = new THREE.ExternalTexture(null);
    return { binding, depthTexture };
  } catch {
    return null;
  }
}

/**
 * Patches a material (once) so it discards fragments that are behind
 * real-world geometry according to the current depth texture. Safe to
 * call on every material of a placed model; a no-op if called twice on
 * the same material. When depth data isn't available this frame (or on
 * devices without depth-sensing), the injected check is disabled via a
 * uniform rather than branching in JS, so materials don't need patching
 * twice.
 */
export function enableDepthOcclusion(material: THREE.Material): void {
  if (occlusionState.has(material)) return;

  const uniforms = {
    uDepthTexture: { value: null as THREE.Texture | null },
    uDepthUvTransform: { value: new THREE.Matrix4() },
    uViewportSize: { value: new THREE.Vector2(1, 1) },
    uRawValueToMeters: { value: 1 },
    uDepthEnabled: { value: 0 },
  };
  occlusionState.set(material, uniforms);

  const previousOnBeforeCompile = material.onBeforeCompile?.bind(material);

  material.onBeforeCompile = (shader, renderer) => {
    previousOnBeforeCompile?.(shader, renderer);

    Object.assign(shader.uniforms, uniforms);

    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying float vOcclusionViewZ;")
      .replace(
        "#include <project_vertex>",
        "#include <project_vertex>\nvOcclusionViewZ = -mvPosition.z;"
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
        varying float vOcclusionViewZ;
        uniform sampler2D uDepthTexture;
        uniform mat4 uDepthUvTransform;
        uniform vec2 uViewportSize;
        uniform float uRawValueToMeters;
        uniform float uDepthEnabled;

        // ARCore/Chrome's "luminance-alpha" depth format packs a 16-bit
        // raw depth value across the red (low byte) and alpha (high
        // byte) channels; uRawValueToMeters (from
        // XRWebGLDepthInformation.rawValueToMeters, device-dependent)
        // converts that raw integer into real-world meters.
        float sampleRealWorldDepthMeters(vec2 uv) {
          vec2 packed = texture2D(uDepthTexture, uv).ra;
          float raw = dot(packed, vec2(255.0, 255.0 * 256.0));
          return raw * uRawValueToMeters;
        }`
      )
      .replace(
        "#include <dithering_fragment>",
        `#include <dithering_fragment>
        if (uDepthEnabled > 0.5) {
          vec2 screenUv = gl_FragCoord.xy / uViewportSize;
          vec4 depthUv4 = uDepthUvTransform * vec4(screenUv, 0.0, 1.0);
          vec2 depthUv = depthUv4.xy;
          if (depthUv.x >= 0.0 && depthUv.x <= 1.0 && depthUv.y >= 0.0 && depthUv.y <= 1.0) {
            float realMeters = sampleRealWorldDepthMeters(depthUv);
            if (realMeters > 0.01 && realMeters < vOcclusionViewZ) {
              discard;
            }
          }
        }`
      );
  };

  // Materials with injected shader variants need a distinct program cache
  // key, otherwise three.js may reuse a compiled program from a material
  // that didn't get this patch.
  material.customProgramCacheKey = () => "depth-occlusion-v1";
  material.needsUpdate = true;
}

/**
 * Call once per frame, per view, with the latest depth texture — updates
 * every occlusion-enabled material's uniforms in one pass. Pass `null` for
 * depthInfo when depth data isn't available this frame (e.g. unsupported
 * device) to disable the occlusion check cleanly rather than leaving stale
 * data bound.
 */
export function updateDepthOcclusion(
  materials: THREE.Material[],
  depthInfo: XRWebGLDepthInformation | null,
  depthTexture: THREE.ExternalTexture,
  viewportWidth: number,
  viewportHeight: number
): void {
  for (const material of materials) {
    const uniforms = occlusionState.get(material);
    if (!uniforms) continue;

    if (!depthInfo) {
      uniforms.uDepthEnabled.value = 0;
      continue;
    }

    depthTexture.sourceTexture = depthInfo.texture;
    depthTexture.needsUpdate = true;

    uniforms.uDepthTexture.value = depthTexture;
    uniforms.uDepthUvTransform.value.fromArray(depthInfo.normDepthBufferFromNormView.matrix);
    uniforms.uViewportSize.value.set(viewportWidth, viewportHeight);
    uniforms.uRawValueToMeters.value = depthInfo.rawValueToMeters;
    uniforms.uDepthEnabled.value = 1;
  }
}
