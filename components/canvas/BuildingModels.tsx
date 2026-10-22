"use client";

import type { ModelType } from "@/types/scene";

interface BuildingModelProps {
  modelType: ModelType;
  color?: string;
}

/**
 * Rich, stylized 3D architectural models for all 20 buildings in the asset library.
 * Features realistic architectural elements: roofs, doors, windows, trim, chimneys, and materials.
 */
export function BuildingModel({ modelType, color }: BuildingModelProps) {
  switch (modelType) {
    case "building-house":
      return <HouseBuilding color={color} />;
    case "building-tower":
      return <TowerBuilding color={color} />;
    case "building-bridge":
      return <BridgeBuilding color={color} />;
    case "building-fence":
      return <FenceBuilding color={color} />;
    case "building-windmill":
      return <WindmillBuilding color={color} />;
    case "building-barn":
      return <BarnBuilding color={color} />;
    case "building-lighthouse":
      return <LighthouseBuilding color={color} />;
    case "building-tent":
      return <TentBuilding color={color} />;
    case "building-well":
      return <WellBuilding color={color} />;
    case "building-castle":
      return <CastleBuilding color={color} />;
    case "building-cabin":
      return <CabinBuilding color={color} />;
    case "building-greenhouse":
      return <GreenhouseBuilding color={color} />;
    case "building-silo":
      return <SiloBuilding color={color} />;
    case "building-shed":
      return <ShedBuilding color={color} />;
    case "building-gazebo":
      return <GazeboBuilding color={color} />;
    case "building-dock":
      return <DockBuilding color={color} />;
    case "building-chimney":
      return <ChimneyBuilding color={color} />;
    case "building-gate":
      return <GateBuilding color={color} />;
    case "building-stable":
      return <StableBuilding color={color} />;
    case "building-treehouse":
      return <TreehouseBuilding color={color} />;
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// 1. HOUSE 🏠
// ---------------------------------------------------------------------------
function HouseBuilding({ color = "#f59e0b" }: { color?: string }) {
  return (
    <group>
      {/* Stone Foundation */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.3, 0.16, 1.1]} />
        <meshStandardMaterial color="#64748b" roughness={0.9} />
      </mesh>

      {/* Main Walls */}
      <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 1.0, 1.0]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>

      {/* Gabled Pitched Roof */}
      <mesh position={[0, 1.45, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.05, 0.7, 4]} />
        <meshStandardMaterial color="#991b1b" roughness={0.6} />
      </mesh>

      {/* Brick Chimney */}
      <mesh position={[0.35, 1.6, -0.2]} castShadow>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color="#7c2d12" roughness={0.8} />
      </mesh>
      {/* Smoke Puff */}
      <mesh position={[0.35, 1.95, -0.2]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#e2e8f0" transparent opacity={0.6} />
      </mesh>

      {/* Front Door */}
      <mesh position={[0, 0.45, 0.51]} castShadow>
        <boxGeometry args={[0.26, 0.6, 0.04]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>
      {/* Door Knob */}
      <mesh position={[0.08, 0.45, 0.54]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#facc15" metalness={0.9} />
      </mesh>

      {/* Windows with Shutters */}
      {[-0.38, 0.38].map((x) => (
        <group key={x} position={[x, 0.65, 0.51]}>
          <mesh castShadow>
            <boxGeometry args={[0.24, 0.26, 0.03]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.2} metalness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[0.03, 0.26, 0.01]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[0.24, 0.03, 0.01]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 2. TOWER 🏰
// ---------------------------------------------------------------------------
function TowerBuilding({ color = "#64748b" }: { color?: string }) {
  return (
    <group>
      {/* Stone Base */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.62, 0.4, 16]} />
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </mesh>

      {/* Tall Cylindrical Tower Shaft */}
      <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.48, 0.54, 2.0, 16]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>

      {/* Flared Battlements / Parapet Platform */}
      <mesh position={[0, 2.45, 0]} castShadow>
        <cylinderGeometry args={[0.62, 0.5, 0.2, 16]} />
        <meshStandardMaterial color="#475569" roughness={0.8} />
      </mesh>

      {/* Crenellations (Teeth) on Top */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i * Math.PI) / 4;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.56, 2.65, Math.sin(angle) * 0.56]} castShadow>
            <boxGeometry args={[0.16, 0.2, 0.12]} />
            <meshStandardMaterial color="#475569" roughness={0.8} />
          </mesh>
        );
      })}

      {/* Arched Arrow Slits */}
      {[0.9, 1.6].map((y) => (
        <mesh key={y} position={[0, y, 0.5]}>
          <boxGeometry args={[0.08, 0.28, 0.05]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 3. BRIDGE 🌉
// ---------------------------------------------------------------------------
function BridgeBuilding({ color = "#a8a29e" }: { color?: string }) {
  return (
    <group>
      {/* Arched Bridge Span */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 0.16, 0.8]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>

      {/* Side Stone Balustrade Railings */}
      {[-0.38, 0.38].map((z) => (
        <group key={z} position={[0, 0.65, z]}>
          <mesh castShadow>
            <boxGeometry args={[2.0, 0.34, 0.08]} />
            <meshStandardMaterial color="#78716c" roughness={0.8} />
          </mesh>
          {/* Railing Pillars */}
          {[-0.9, -0.45, 0, 0.45, 0.9].map((px) => (
            <mesh key={px} position={[px, 0.22, 0]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshStandardMaterial color="#d6d3d1" roughness={0.6} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Bridge Piers */}
      {[-0.7, 0.7].map((x) => (
        <mesh key={x} position={[x, 0.16, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.24, 0.36, 12]} />
          <meshStandardMaterial color="#57534e" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 4. FENCE 🚧
// ---------------------------------------------------------------------------
function FenceBuilding({ color = "#92400e" }: { color?: string }) {
  return (
    <group>
      {/* Fence Posts */}
      {[-0.7, 0, 0.7].map((x) => (
        <group key={x} position={[x, 0.35, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.1, 0.7, 0.1]} />
            <meshStandardMaterial color={color} roughness={0.8} />
          </mesh>
          {/* Post Cap */}
          <mesh position={[0, 0.38, 0]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[0.09, 0.08, 4]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Horizontal Cross Rails */}
      {[0.25, 0.52].map((y) => (
        <mesh key={y} position={[0, y, 0]} castShadow>
          <boxGeometry args={[1.5, 0.06, 0.04]} />
          <meshStandardMaterial color="#b45309" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 5. WINDMILL 🎐
// ---------------------------------------------------------------------------
function WindmillBuilding({ color = "#dc2626" }: { color?: string }) {
  return (
    <group>
      {/* Tapered Octagonal Tower */}
      <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.65, 2.0, 8]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.8} />
      </mesh>

      {/* Red Conical Cap */}
      <mesh position={[0, 2.25, 0]} castShadow>
        <coneGeometry args={[0.5, 0.6, 12]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>

      {/* Windmill Rotor Hub */}
      <mesh position={[0, 2.1, 0.48]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.12, 12]} />
        <meshStandardMaterial color="#451a03" roughness={0.7} />
      </mesh>

      {/* 4 Windmill Lattice Sails */}
      {[0, 1, 2, 3].map((i) => {
        const rot = (i * Math.PI) / 2;
        return (
          <group key={i} position={[0, 2.1, 0.52]} rotation={[0, 0, rot]}>
            <mesh position={[0, 0.55, 0]} castShadow>
              <boxGeometry args={[0.04, 1.1, 0.02]} />
              <meshStandardMaterial color="#78350f" roughness={0.7} />
            </mesh>
            {/* Canvas Lattice Blade */}
            <mesh position={[0.1, 0.65, 0]} castShadow>
              <boxGeometry args={[0.18, 0.8, 0.01]} />
              <meshStandardMaterial color="#fef3c7" roughness={0.6} transparent opacity={0.9} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 6. BARN 🏚️
// ---------------------------------------------------------------------------
function BarnBuilding({ color = "#b91c1c" }: { color?: string }) {
  return (
    <group>
      {/* Main Red Barn Walls */}
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1.1, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.75} />
      </mesh>

      {/* White Cross-Braced Double Barn Doors */}
      <group position={[0, 0.45, 0.61]}>
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.75, 0.03]} />
          <meshStandardMaterial color="#ffffff" roughness={0.7} />
        </mesh>
        {/* Cross braces */}
        <mesh rotation={[0, 0, 0.6]}>
          <boxGeometry args={[0.06, 0.78, 0.04]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh rotation={[0, 0, -0.6]}>
          <boxGeometry args={[0.06, 0.78, 0.04]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>

      {/* Gambrel Roof */}
      <mesh position={[0, 1.45, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.25, 0.7, 4]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>

      {/* Hayloft Window */}
      <mesh position={[0, 1.35, 0.62]}>
        <boxGeometry args={[0.22, 0.22, 0.03]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 7. LIGHTHOUSE 🗼
// ---------------------------------------------------------------------------
function LighthouseBuilding({ color = "#f8fafc" }: { color?: string }) {
  return (
    <group>
      {/* Stone Base */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.62, 0.4, 16]} />
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </mesh>

      {/* Striped Tapered Tower */}
      {[0.6, 1.0, 1.4, 1.8].map((y, idx) => (
        <mesh key={y} position={[0, y, 0]} castShadow>
          <cylinderGeometry args={[0.42 - idx * 0.03, 0.45 - idx * 0.03, 0.4, 16]} />
          <meshStandardMaterial color={idx % 2 === 0 ? "#dc2626" : "#ffffff"} roughness={0.6} />
        </mesh>
      ))}

      {/* Gallery Balcony */}
      <mesh position={[0, 2.05, 0]} castShadow>
        <cylinderGeometry args={[0.45, 0.45, 0.08, 16]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} />
      </mesh>

      {/* Glass Lantern Room with Glowing Lamp */}
      <mesh position={[0, 2.25, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.35, 12]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.1} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, 2.25, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={2.0} />
      </mesh>

      {/* Dome Roof */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <sphereGeometry args={[0.32, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 8. TENT ⛺
// ---------------------------------------------------------------------------
function TentBuilding({ color = "#0d9488" }: { color?: string }) {
  return (
    <group>
      {/* Triangular A-Frame Canvas Tent */}
      <mesh position={[0, 0.45, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.85, 0.9, 4]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>

      {/* Open Doorway Flap revealing interior warm lantern glow */}
      <mesh position={[0, 0.35, 0.48]}>
        <coneGeometry args={[0.3, 0.6, 3]} />
        <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 9. WELL 🪣
// ---------------------------------------------------------------------------
function WellBuilding({ color = "#57534e" }: { color?: string }) {
  return (
    <group>
      {/* Cobblestone Circular Well Rim */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.45, 0.6, 16]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      {/* Water inside */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.05, 16]} />
        <meshStandardMaterial color="#0284c7" roughness={0.1} />
      </mesh>

      {/* Wooden Support Posts */}
      {[-0.34, 0.34].map((x) => (
        <mesh key={x} position={[x, 0.85, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.7, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
      ))}

      {/* Wooden Winch & Hanging Bucket */}
      <mesh position={[0, 0.95, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.7, 8]} />
        <meshStandardMaterial color="#451a03" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.72, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.06, 0.12, 10]} />
        <meshStandardMaterial color="#92400e" roughness={0.8} />
      </mesh>

      {/* Pitched Tile Roof */}
      <mesh position={[0, 1.35, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.55, 0.4, 4]} />
        <meshStandardMaterial color="#991b1b" roughness={0.6} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 10. CASTLE 🏯
// ---------------------------------------------------------------------------
function CastleBuilding({ color = "#78716c" }: { color?: string }) {
  return (
    <group>
      {/* Main Stone Keep */}
      <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 1.1, 1.1]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>

      {/* 4 Corner Round Turrets */}
      {[
        [-0.55, -0.55],
        [0.55, -0.55],
        [-0.55, 0.55],
        [0.55, 0.55],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.8, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.24, 1.6, 12]} />
            <meshStandardMaterial color="#57534e" roughness={0.85} />
          </mesh>
          {/* Conical Turret Roofs */}
          <mesh position={[0, 1.8, 0]} castShadow>
            <coneGeometry args={[0.26, 0.45, 12]} />
            <meshStandardMaterial color="#1e3a8a" roughness={0.6} />
          </mesh>
          {/* Red Flag on Spire */}
          <mesh position={[0, 2.08, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.2, 6]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.8} />
          </mesh>
          <mesh position={[0.06, 2.12, 0]}>
            <boxGeometry args={[0.1, 0.06, 0.01]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
        </group>
      ))}

      {/* Portcullis Gate Entrance */}
      <mesh position={[0, 0.4, 0.56]} castShadow>
        <boxGeometry args={[0.34, 0.55, 0.04]} />
        <meshStandardMaterial color="#1c1917" roughness={0.9} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 11. CABIN 🛖
// ---------------------------------------------------------------------------
function CabinBuilding({ color = "#92400e" }: { color?: string }) {
  return (
    <group>
      {/* Log Cabin Walls (Stacked horizontal timber look) */}
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.9, 1.0]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>

      {/* Stone Chimney */}
      <mesh position={[0.42, 0.75, -0.3]} castShadow>
        <boxGeometry args={[0.22, 1.2, 0.22]} />
        <meshStandardMaterial color="#57534e" roughness={0.9} />
      </mesh>

      {/* Shingled Roof */}
      <mesh position={[0, 1.2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.0, 0.55, 4]} />
        <meshStandardMaterial color="#451a03" roughness={0.7} />
      </mesh>

      {/* Front Door */}
      <mesh position={[0, 0.38, 0.51]} castShadow>
        <boxGeometry args={[0.24, 0.55, 0.04]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 12. GREENHOUSE 🏡
// ---------------------------------------------------------------------------
function GreenhouseBuilding({ color = "#86efac" }: { color?: string }) {
  return (
    <group>
      {/* Brick Foundation Rim */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.2, 0.9]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>

      {/* Glass Walls */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[1.15, 0.7, 0.85]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.1} transparent opacity={0.4} />
      </mesh>

      {/* White Conservatory Iron Frames */}
      {[-0.55, 0, 0.55].map((x) => (
        <mesh key={x} position={[x, 0.55, 0]}>
          <boxGeometry args={[0.03, 0.72, 0.87]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.4} />
        </mesh>
      ))}

      {/* Glass Gabled Roof */}
      <mesh position={[0, 1.05, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.85, 0.45, 4]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.1} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 13. SILO 🛢️
// ---------------------------------------------------------------------------
function SiloBuilding({ color = "#94a3b8" }: { color?: string }) {
  return (
    <group>
      {/* Tall Corrugated Metal Cylinder */}
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.45, 0.45, 2.2, 16]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Domed Silver Cap */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <sphereGeometry args={[0.46, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Exterior Maintenance Ladder */}
      <mesh position={[0, 1.1, 0.47]} castShadow>
        <boxGeometry args={[0.14, 2.0, 0.02]} />
        <meshStandardMaterial color="#334155" metalness={0.9} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 14. SHED 🚪
// ---------------------------------------------------------------------------
function ShedBuilding({ color = "#57534e" }: { color?: string }) {
  return (
    <group>
      {/* Tool Shed Walls */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.85, 0.8]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>

      {/* Slanted Pent Roof */}
      <mesh position={[0, 0.98, 0]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[1.0, 0.06, 0.95]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* Wooden Door */}
      <mesh position={[0, 0.4, 0.41]} castShadow>
        <boxGeometry args={[0.3, 0.65, 0.03]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 15. GAZEBO ⛱️
// ---------------------------------------------------------------------------
function GazeboBuilding({ color = "#f8fafc" }: { color?: string }) {
  return (
    <group>
      {/* Octagonal Stone Deck */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.85, 0.16, 8]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>

      {/* 8 Ornamental Pillars */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i * Math.PI) / 4;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.68, 0.7, Math.sin(angle) * 0.68]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 1.2, 8]} />
            <meshStandardMaterial color="#ffffff" roughness={0.5} />
          </mesh>
        );
      })}

      {/* Pagoda Peaked Roof with Spire */}
      <mesh position={[0, 1.55, 0]} castShadow>
        <coneGeometry args={[0.95, 0.6, 8]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.95, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.25, 6]} />
        <meshStandardMaterial color="#facc15" metalness={0.9} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 16. DOCK ⚓
// ---------------------------------------------------------------------------
function DockBuilding({ color = "#78350f" }: { color?: string }) {
  return (
    <group>
      {/* Wooden Deck Planks */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.08, 1.8]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>

      {/* Wooden Pilings into water */}
      {[
        [-0.34, -0.7],
        [0.34, -0.7],
        [-0.34, 0],
        [0.34, 0],
        [-0.34, 0.7],
        [0.34, 0.7],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.12, z]} castShadow>
          <cylinderGeometry args={[0.045, 0.045, 0.26, 8]} />
          <meshStandardMaterial color="#451a03" roughness={0.9} />
        </mesh>
      ))}

      {/* Mooring Cleats */}
      {[-0.34, 0.34].map((x) => (
        <mesh key={x} position={[x, 0.31, 0.7]}>
          <boxGeometry args={[0.08, 0.04, 0.04]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 17. CHIMNEY 🧱
// ---------------------------------------------------------------------------
function ChimneyBuilding({ color = "#7c2d12" }: { color?: string }) {
  return (
    <group>
      {/* Brick Chimney Stack */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.42, 1.5, 0.42]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>

      {/* Corbelled Crown on Top */}
      <mesh position={[0, 1.55, 0]} castShadow>
        <boxGeometry args={[0.5, 0.1, 0.5]} />
        <meshStandardMaterial color="#451a03" roughness={0.8} />
      </mesh>

      {/* Flue Pot */}
      <mesh position={[0, 1.68, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.14, 0.18, 12]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.7} />
      </mesh>

      {/* Smoke Clouds */}
      <mesh position={[0, 1.9, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#cbd5e1" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0.08, 2.12, 0]}>
        <sphereGeometry args={[0.14, 8, 8]} />
        <meshStandardMaterial color="#e2e8f0" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 18. GATE 🚪
// ---------------------------------------------------------------------------
function GateBuilding({ color = "#44403c" }: { color?: string }) {
  return (
    <group>
      {/* Twin Stone Pillars */}
      {[-0.6, 0.6].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.26, 1.4, 0.26]} />
            <meshStandardMaterial color={color} roughness={0.85} />
          </mesh>
          <mesh position={[0, 1.45, 0]}>
            <sphereGeometry args={[0.12, 10, 10]} />
            <meshStandardMaterial color="#facc15" metalness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Archway Beam */}
      <mesh position={[0, 1.35, 0]} castShadow>
        <boxGeometry args={[1.35, 0.16, 0.22]} />
        <meshStandardMaterial color="#292524" roughness={0.85} />
      </mesh>

      {/* Wrought Iron Gate Leaves */}
      {[-0.25, 0.25].map((x) => (
        <mesh key={x} position={[x, 0.6, 0]} castShadow>
          <boxGeometry args={[0.42, 1.1, 0.03]} />
          <meshStandardMaterial color="#09090b" roughness={0.5} metalness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 19. STABLE 🐎
// ---------------------------------------------------------------------------
function StableBuilding({ color = "#92400e" }: { color?: string }) {
  return (
    <group>
      {/* Stable Timber Walls */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.95, 1.1]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>

      {/* Low Slanted Shingle Roof */}
      <mesh position={[0, 1.18, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.3, 0.5, 4]} />
        <meshStandardMaterial color="#451a03" roughness={0.7} />
      </mesh>

      {/* Split Dutch Stable Doors */}
      {[-0.4, 0.4].map((x) => (
        <mesh key={x} position={[x, 0.38, 0.56]} castShadow>
          <boxGeometry args={[0.34, 0.58, 0.03]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 20. TREEHOUSE 🌳
// ---------------------------------------------------------------------------
function TreehouseBuilding({ color = "#a16207" }: { color?: string }) {
  return (
    <group>
      {/* Thick Supporting Tree Trunk */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.3, 1.6, 12]} />
        <meshStandardMaterial color="#582f0e" roughness={0.85} />
      </mesh>

      {/* Treehouse Wooden Platform */}
      <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.08, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>

      {/* Cabin on Platform */}
      <mesh position={[-0.1, 1.65, -0.1]} castShadow>
        <boxGeometry args={[0.75, 0.7, 0.75]} />
        <meshStandardMaterial color="#92400e" roughness={0.8} />
      </mesh>
      {/* Peaked Wooden Roof */}
      <mesh position={[-0.1, 2.12, -0.1]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.65, 0.4, 4]} />
        <meshStandardMaterial color="#451a03" roughness={0.7} />
      </mesh>

      {/* Hanging Rope Ladder */}
      <mesh position={[0.4, 0.65, 0.45]} castShadow>
        <boxGeometry args={[0.14, 1.1, 0.02]} />
        <meshStandardMaterial color="#ca8a04" roughness={0.9} />
      </mesh>
    </group>
  );
}
