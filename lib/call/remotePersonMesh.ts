import * as THREE from "three";

/**
 * Creates (and updates) the Three.js object that represents the remote
 * caller inside the local AR scene: a billboard-style plane textured with
 * the background-removed, alpha-masked canvas from useSelfieSegmentation.
 * Because the background is punched out via alpha, only the real person's
 * silhouette renders — so they appear to be "standing" in the room rather
 * than inside a video rectangle.
 */
/**
 * A soft radial-gradient shadow disc, laid flat on the ground under the
 * person's feet. This single grounding cue does more to sell "someone is
 * standing here" than mask-edge cleanup alone — without it, even a
 * perfectly-cut billboard reads as a flat cutout floating in space rather
 * than a person present in the room.
 */
function createContactShadow(): THREE.Mesh {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(0,0,0,0.4)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  const geometry = new THREE.PlaneGeometry(0.9, 0.9).rotateX(-Math.PI / 2);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });
  const shadow = new THREE.Mesh(geometry, material);
  shadow.renderOrder = 9;
  return shadow;
}

export function createRemotePersonMesh(): THREE.Mesh {
  const geometry = new THREE.PlaneGeometry(1, 1.78); // roughly portrait aspect for a standing person
  const material = new THREE.MeshBasicMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.visible = false;
  mesh.renderOrder = 10;
  mesh.add(createContactShadow());
  return mesh;
}

/**
 * Feeds a new frame from the segmented canvas into the mesh's texture, and
 * keeps the plane's aspect ratio matched to the canvas so the person isn't
 * stretched. Call this once per animation frame while a call is active.
 */
export function updateRemotePersonMesh(
  mesh: THREE.Mesh,
  sourceCanvas: HTMLCanvasElement,
  options: { distance?: number; heightMeters?: number } = {}
): void {
  const material = mesh.material as THREE.MeshBasicMaterial;
  const { distance = 1.6, heightMeters = 1.7 } = options;

  if (sourceCanvas.width === 0 || sourceCanvas.height === 0) {
    mesh.visible = false;
    return;
  }

  if (!material.map) {
    material.map = new THREE.CanvasTexture(sourceCanvas);
    material.map.colorSpace = THREE.SRGBColorSpace;
  } else {
    material.map.needsUpdate = true;
  }

  const aspect = sourceCanvas.width / sourceCanvas.height;
  const height = heightMeters;
  const width = height * aspect;
  mesh.geometry.dispose();
  mesh.geometry = new THREE.PlaneGeometry(width, height);

  // Position the "person" a fixed distance in front of wherever the camera
  // is currently looking, standing on the ground plane (y = height / 2 so
  // their feet line up near y = 0, matching the hit-test reticle's floor).
  mesh.position.set(0, height / 2, -distance);

  // Keep the contact shadow pinned at the mesh's feet (local y = -height/2,
  // i.e. the ground) and scaled roughly to the person's width.
  const shadow = mesh.children[0];
  if (shadow) {
    shadow.position.set(0, -height / 2 + 0.01, 0);
    shadow.scale.setScalar(width * 1.1);
  }

  mesh.visible = true;
}

export function disposeRemotePersonMesh(mesh: THREE.Mesh): void {
  const material = mesh.material as THREE.MeshBasicMaterial;
  material.map?.dispose();
  material.dispose();
  mesh.geometry.dispose();

  const shadow = mesh.children[0] as THREE.Mesh | undefined;
  if (shadow) {
    const shadowMaterial = shadow.material as THREE.MeshBasicMaterial;
    shadowMaterial.map?.dispose();
    shadowMaterial.dispose();
    shadow.geometry.dispose();
  }
}
