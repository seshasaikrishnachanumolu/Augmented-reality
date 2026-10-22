"use client";

import type { ModelType } from "@/types/scene";

interface NatureModelProps {
  modelType: ModelType;
  color?: string;
}

/**
 * Rich, stylized 3D environmental models for all 20 nature assets in the library.
 * Features organic shapes, foliage variation, textures, details, and vibrant palettes.
 */
export function NatureModel({ modelType, color }: NatureModelProps) {
  switch (modelType) {
    case "nature-tree":
      return <TreeNature color={color} />;
    case "nature-rock":
      return <RockNature color={color} />;
    case "nature-bush":
      return <BushNature color={color} />;
    case "nature-flower":
      return <FlowerNature color={color} />;
    case "nature-mushroom":
      return <MushroomNature color={color} />;
    case "nature-cactus":
      return <CactusNature color={color} />;
    case "nature-log":
      return <LogNature color={color} />;
    case "nature-pond":
      return <PondNature color={color} />;
    case "nature-campfire":
      return <CampfireNature color={color} />;
    case "nature-waterfall":
      return <WaterfallNature color={color} />;
    case "nature-beehive":
      return <BeehiveNature color={color} />;
    case "nature-vine":
      return <VineNature color={color} />;
    case "nature-grasstuft":
      return <GrassTuftNature color={color} />;
    case "nature-boulder":
      return <BoulderNature color={color} />;
    case "nature-palmtree":
      return <PalmTreeNature color={color} />;
    case "nature-snowpile":
      return <SnowPileNature color={color} />;
    case "nature-puddle":
      return <PuddleNature color={color} />;
    case "nature-reed":
      return <ReedNature color={color} />;
    case "nature-stump":
      return <StumpNature color={color} />;
    case "nature-berrybush":
      return <BerryBushNature color={color} />;
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// 1. TREE 🌳
// ---------------------------------------------------------------------------
function TreeNature({ color = "#22c55e" }: { color?: string }) {
  return (
    <group>
      {/* Organic Tree Trunk */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.26, 1.4, 10]} />
        <meshStandardMaterial color="#582f0e" roughness={0.85} />
      </mesh>

      {/* Tiered Puffy Foliage Canopy */}
      <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.65, 14, 14]} scale={[1, 0.85, 1]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0.2, 1.9, 0.1]} castShadow>
        <sphereGeometry args={[0.48, 12, 12]} />
        <meshStandardMaterial color="#16a34a" roughness={0.7} />
      </mesh>
      <mesh position={[-0.2, 1.85, -0.1]} castShadow>
        <sphereGeometry args={[0.52, 12, 12]} />
        <meshStandardMaterial color="#15803d" roughness={0.7} />
      </mesh>
      <mesh position={[0, 2.2, 0]} castShadow>
        <sphereGeometry args={[0.4, 10, 10]} />
        <meshStandardMaterial color="#4ade80" roughness={0.7} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 2. ROCK 🪨
// ---------------------------------------------------------------------------
function RockNature({ color = "#a8a29e" }: { color?: string }) {
  return (
    <group>
      {/* Primary Chiseled Boulder */}
      <mesh position={[0, 0.35, 0]} rotation={[0.2, 0.4, 0]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.48, 1]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>

      {/* Secondary Flanking Stone */}
      <mesh position={[0.38, 0.2, 0.15]} rotation={[-0.3, 0.2, 0.4]} castShadow>
        <dodecahedronGeometry args={[0.28, 1]} />
        <meshStandardMaterial color="#78716c" roughness={0.9} />
      </mesh>
      <mesh position={[-0.32, 0.16, -0.1]} rotation={[0.4, -0.3, 0]} castShadow>
        <dodecahedronGeometry args={[0.24, 1]} />
        <meshStandardMaterial color="#57534e" roughness={0.9} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 3. BUSH 🌿
// ---------------------------------------------------------------------------
function BushNature({ color = "#16a34a" }: { color?: string }) {
  return (
    <group>
      {/* Cluster of Dense Foliage Spheres */}
      <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.42, 14, 14]} scale={[1.2, 0.8, 1]} />
        <meshStandardMaterial color={color} roughness={0.75} />
      </mesh>
      <mesh position={[0.22, 0.38, 0.1]} castShadow>
        <sphereGeometry args={[0.3, 10, 10]} />
        <meshStandardMaterial color="#22c55e" roughness={0.75} />
      </mesh>
      <mesh position={[-0.2, 0.36, -0.08]} castShadow>
        <sphereGeometry args={[0.28, 10, 10]} />
        <meshStandardMaterial color="#15803d" roughness={0.75} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 4. FLOWER 🌸
// ---------------------------------------------------------------------------
function FlowerNature({ color = "#ec4899" }: { color?: string }) {
  return (
    <group>
      {/* Green Stem */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.03, 0.6, 8]} />
        <meshStandardMaterial color="#15803d" roughness={0.7} />
      </mesh>

      {/* Stem Leaves */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.08, 0.22, 0]} rotation={[0, 0, side * 0.6]}>
          <boxGeometry args={[0.14, 0.03, 0.06]} />
          <meshStandardMaterial color="#22c55e" roughness={0.6} />
        </mesh>
      ))}

      {/* Center Pistil Disc */}
      <mesh position={[0, 0.62, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#facc15" roughness={0.5} />
      </mesh>

      {/* Ring of Radial Petals */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i * Math.PI) / 3;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.15, 0.62, Math.sin(angle) * 0.15]}
            rotation={[0, angle, 0]}
            castShadow
          >
            <sphereGeometry args={[0.08, 10, 10]} scale={[1.4, 0.4, 0.8]} />
            <meshStandardMaterial color={color} roughness={0.5} />
          </mesh>
        );
      })}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 5. MUSHROOM 🍄
// ---------------------------------------------------------------------------
function MushroomNature({ color = "#ef4444" }: { color?: string }) {
  return (
    <group>
      {/* Main Toadstool White Stalk */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.14, 0.5, 12]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.7} />
      </mesh>

      {/* Red Domed Mushroom Cap */}
      <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.34, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>

      {/* White Polka Dots on Cap */}
      {[
        [0, 0.72, 0],
        [0.2, 0.62, 0.12],
        [-0.18, 0.62, 0.14],
        [0.16, 0.62, -0.16],
        [-0.16, 0.62, -0.14],
      ].map(([dx, dy, dz], i) => (
        <mesh key={i} position={[dx, dy, dz]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* Baby Little Mushroom Beside */}
      <group position={[0.26, 0, 0.18]}>
        <mesh position={[0, 0.12, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.06, 0.24, 8]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[0, 0.24, 0]} castShadow>
          <sphereGeometry args={[0.14, 10, 10, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
          <meshStandardMaterial color={color} roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 6. CACTUS 🌵
// ---------------------------------------------------------------------------
function CactusNature({ color = "#15803d" }: { color?: string }) {
  return (
    <group>
      {/* Central Ribbed Stem */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.14, 0.14, 1.5, 12]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.14, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>

      {/* Right Arm */}
      <group position={[0.24, 0.7, 0]}>
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.28, 10]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        <mesh position={[0.12, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.5, 10]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      </group>

      {/* Left Arm */}
      <group position={[-0.22, 0.95, 0]}>
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.26, 10]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        <mesh position={[-0.1, 0.22, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.44, 10]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      </group>

      {/* Pink Desert Flower on Top */}
      <mesh position={[0, 1.62, 0]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color="#ec4899" roughness={0.5} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 7. LOG 🪵
// ---------------------------------------------------------------------------
function LogNature({ color = "#78350f" }: { color?: string }) {
  return (
    <group>
      {/* Fallen Tree Trunk */}
      <mesh position={[0, 0.18, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.18, 1.5, 12]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>

      {/* Cut End Faces with Tree Growth Rings */}
      {[-0.76, 0.76].map((x) => (
        <mesh key={x} position={[x, 0.18, 0]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.17, 0.17, 0.02, 12]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.7} />
        </mesh>
      ))}

      {/* Moss Patch on Top */}
      <mesh position={[0, 0.36, 0]}>
        <boxGeometry args={[0.6, 0.04, 0.18]} />
        <meshStandardMaterial color="#4ade80" roughness={0.9} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 8. POND 💧
// ---------------------------------------------------------------------------
function PondNature({ color = "#0ea5e9" }: { color?: string }) {
  return (
    <group>
      {/* Stone Rim of Pebbles */}
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.9, 0.95, 0.08, 16]} />
        <meshStandardMaterial color="#78716c" roughness={0.85} />
      </mesh>

      {/* Reflective Translucent Water */}
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.82, 0.82, 0.04, 16]} />
        <meshStandardMaterial color={color} roughness={0.1} metalness={0.1} transparent opacity={0.85} />
      </mesh>

      {/* Floating Lily Pads */}
      {[
        [0.2, 0.1, 0.2],
        [-0.25, 0.1, -0.15],
      ].map(([lx, ly, lz], i) => (
        <mesh key={i} position={[lx, ly, lz]} rotation={[0, i * 1.5, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.01, 10]} />
          <meshStandardMaterial color="#16a34a" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 9. CAMPFIRE 🔥
// ---------------------------------------------------------------------------
function CampfireNature({ color = "#f97316" }: { color?: string }) {
  return (
    <group>
      {/* Stone Ring around fire */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i * Math.PI) / 4;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.38, 0.06, Math.sin(angle) * 0.38]} castShadow>
            <dodecahedronGeometry args={[0.07, 0]} />
            <meshStandardMaterial color="#57534e" roughness={0.9} />
          </mesh>
        );
      })}

      {/* Crossed Charred Logs */}
      {[0, Math.PI / 3, (2 * Math.PI) / 3].map((rot, i) => (
        <mesh key={i} position={[0, 0.08, 0]} rotation={[0, rot, 0.2]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.6, 8]} />
          <meshStandardMaterial color="#451a03" roughness={0.9} />
        </mesh>
      ))}

      {/* Glowing Embers Base */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.06, 12]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.5} />
      </mesh>

      {/* Vibrant Stylized Flame Tongues */}
      <mesh position={[0, 0.32, 0]} castShadow>
        <coneGeometry args={[0.18, 0.45, 8]} />
        <meshStandardMaterial color={color} emissive="#f97316" emissiveIntensity={2.0} transparent opacity={0.95} />
      </mesh>
      <mesh position={[0, 0.38, 0]}>
        <coneGeometry args={[0.1, 0.35, 6]} />
        <meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={2.5} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 10. WATERFALL 💦
// ---------------------------------------------------------------------------
function WaterfallNature({ color = "#38bdf8" }: { color?: string }) {
  return (
    <group>
      {/* Rocky Cliff Shelf */}
      <mesh position={[0, 0.65, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 1.3, 0.6]} />
        <meshStandardMaterial color="#57534e" roughness={0.85} />
      </mesh>

      {/* Cascading Flowing Water Sheet */}
      <mesh position={[0, 0.65, 0.12]} rotation={[0.1, 0, 0]} castShadow>
        <boxGeometry args={[0.8, 1.25, 0.04]} />
        <meshStandardMaterial color={color} roughness={0.1} emissive="#0284c7" emissiveIntensity={0.5} transparent opacity={0.85} />
      </mesh>

      {/* Splash Mist Pool at Base */}
      <mesh position={[0, 0.06, 0.25]}>
        <cylinderGeometry args={[0.55, 0.6, 0.1, 16]} />
        <meshStandardMaterial color="#e0f2fe" roughness={0.2} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 11. BEEHIVE 🍯
// ---------------------------------------------------------------------------
function BeehiveNature({ color = "#eab308" }: { color?: string }) {
  return (
    <group>
      {/* Branch Support */}
      <mesh position={[0, 1.1, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.9, 8]} />
        <meshStandardMaterial color="#582f0e" roughness={0.85} />
      </mesh>

      {/* Concentric Ribbed Golden Hive */}
      {[0.95, 0.82, 0.68, 0.54].map((y, idx) => (
        <mesh key={y} position={[0, y, 0]} castShadow>
          <cylinderGeometry args={[0.18 + idx * 0.04, 0.22 + idx * 0.03, 0.14, 14]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      ))}

      {/* Entrance Hole */}
      <mesh position={[0, 0.72, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.02, 10]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 12. VINE 🌱
// ---------------------------------------------------------------------------
function VineNature({ color = "#15803d" }: { color?: string }) {
  return (
    <group>
      {/* Twisting Vine Tendril */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1.2, 8]} />
        <meshStandardMaterial color="#166534" roughness={0.7} />
      </mesh>

      {/* Clustered Vine Leaves */}
      {[0.2, 0.45, 0.7, 0.95].map((y, i) => (
        <mesh key={y} position={[i % 2 === 0 ? 0.08 : -0.08, y, 0]} rotation={[0, 0, i % 2 === 0 ? 0.4 : -0.4]}>
          <boxGeometry args={[0.14, 0.03, 0.08]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 13. GRASS TUFT 🌾
// ---------------------------------------------------------------------------
function GrassTuftNature({ color = "#4ade80" }: { color?: string }) {
  return (
    <group>
      {/* Cluster of Arching Grass Blades */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const angle = (i * Math.PI) / 3.5;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.12, 0.25, Math.sin(angle) * 0.12]}
            rotation={[0.2, angle, 0.1]}
            castShadow
          >
            <coneGeometry args={[0.03, 0.5, 4]} />
            <meshStandardMaterial color={color} roughness={0.7} />
          </mesh>
        );
      })}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 14. BOULDER ⛰️
// ---------------------------------------------------------------------------
function BoulderNature({ color = "#78716c" }: { color?: string }) {
  return (
    <group>
      {/* Monumental Mountain Crag Boulder */}
      <mesh position={[0, 0.6, 0]} rotation={[0.1, 0.3, 0.1]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 15. PALM TREE 🌴
// ---------------------------------------------------------------------------
function PalmTreeNature({ color = "#16a34a" }: { color?: string }) {
  return (
    <group>
      {/* Curved Segmented Coconut Palm Trunk */}
      <mesh position={[0.15, 1.0, 0]} rotation={[0, 0, -0.15]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 2.0, 10]} />
        <meshStandardMaterial color="#78350f" roughness={0.85} />
      </mesh>

      {/* Crown of Arching Palm Fronds */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i * 2 * Math.PI) / 5;
        return (
          <group key={i} position={[0.3, 2.0, 0]} rotation={[0, angle, -0.4]}>
            <mesh position={[0.5, 0, 0]} castShadow>
              <boxGeometry args={[1.0, 0.03, 0.26]} />
              <meshStandardMaterial color={color} roughness={0.6} />
            </mesh>
          </group>
        );
      })}

      {/* Coconuts */}
      {[-0.05, 0.05].map((cx, i) => (
        <mesh key={i} position={[0.3 + cx, 1.9, 0.08]} castShadow>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#451a03" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 16. SNOW PILE ❄️
// ---------------------------------------------------------------------------
function SnowPileNature({ color = "#f1f5f9" }: { color?: string }) {
  return (
    <group>
      {/* Soft Sculpted Mound of Fresh Snow */}
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.65, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2.2]} scale={[1.2, 0.6, 1.1]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.05} />
      </mesh>
      <mesh position={[0.25, 0.12, 0.15]} scale={[0.8, 0.5, 0.8]}>
        <sphereGeometry args={[0.4, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 17. PUDDLE 🌊
// ---------------------------------------------------------------------------
function PuddleNature({ color = "#7dd3fc" }: { color?: string }) {
  return (
    <group>
      {/* Muddy Shallow Depression */}
      <mesh position={[0, 0.015, 0]} receiveShadow>
        <cylinderGeometry args={[0.6, 0.64, 0.03, 16]} />
        <meshStandardMaterial color="#57534e" roughness={0.9} />
      </mesh>
      {/* Reflective Water Surface */}
      <mesh position={[0, 0.035, 0]}>
        <cylinderGeometry args={[0.54, 0.54, 0.015, 16]} />
        <meshStandardMaterial color={color} roughness={0.05} metalness={0.2} transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 18. REED 🎋
// ---------------------------------------------------------------------------
function ReedNature({ color = "#65a30d" }: { color?: string }) {
  return (
    <group>
      {/* Aquatic Cattails */}
      {[-0.12, 0, 0.12].map((x, i) => (
        <group key={i} position={[x, 0, i % 2 === 0 ? 0.05 : -0.05]}>
          {/* Stalk */}
          <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.02, 1.0, 8]} />
            <meshStandardMaterial color={color} roughness={0.7} />
          </mesh>
          {/* Brown Cylindrical Cattail Head */}
          <mesh position={[0, 0.85, 0]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.28, 10]} />
            <meshStandardMaterial color="#451a03" roughness={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 19. STUMP 🪵
// ---------------------------------------------------------------------------
function StumpNature({ color = "#92400e" }: { color?: string }) {
  return (
    <group>
      {/* Freshly Sawn Tree Stump with Bark */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.38, 0.44, 0.5, 16]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>

      {/* Top Face showing Growth Rings */}
      <mesh position={[0, 0.505, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.01, 16]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.7} />
      </mesh>

      {/* Green Shoot Sprout */}
      <mesh position={[0.22, 0.4, 0.15]} rotation={[0, 0, -0.4]}>
        <cylinderGeometry args={[0.01, 0.01, 0.16, 6]} />
        <meshStandardMaterial color="#4ade80" />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 20. BERRY BUSH 🫐
// ---------------------------------------------------------------------------
function BerryBushNature({ color = "#166534" }: { color?: string }) {
  return (
    <group>
      {/* Dark Green Bush */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.45, 14, 14]} scale={[1.2, 0.9, 1]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>

      {/* Dotted Ripe Berries */}
      {[
        [0.2, 0.4, 0.3],
        [-0.2, 0.45, 0.28],
        [0.35, 0.3, 0.15],
        [-0.32, 0.3, 0.18],
        [0, 0.58, 0.2],
        [0.15, 0.35, -0.3],
        [-0.18, 0.38, -0.28],
      ].map(([bx, by, bz], i) => (
        <mesh key={i} position={[bx, by, bz]} castShadow>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshStandardMaterial color="#3b82f6" roughness={0.3} metalness={0.2} />
        </mesh>
      ))}
    </group>
  );
}
