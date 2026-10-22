"use client";

import type { ModelType } from "@/types/scene";

interface CharacterModelProps {
  modelType: ModelType;
  color?: string;
}

/**
 * Rich, stylized 3D procedural character models with anatomical proportions
 * (legs, boots, torso, arms, hands, face features, headwear, iconic props).
 * Every character is instantly recognizable and matches its name and theme.
 */
export function CharacterModel({ modelType, color }: CharacterModelProps) {
  switch (modelType) {
    case "character-robot":
      return <RobotCharacter color={color} />;
    case "character-explorer":
      return <ExplorerCharacter color={color} />;
    case "character-adventurer":
      return <AdventurerCharacter color={color} />;
    case "character-wizard":
      return <WizardCharacter color={color} />;
    case "character-knight":
      return <KnightCharacter color={color} />;
    case "character-astronaut":
      return <AstronautCharacter color={color} />;
    case "character-pirate":
      return <PirateCharacter color={color} />;
    case "character-ninja":
      return <NinjaCharacter color={color} />;
    case "character-chef":
      return <ChefCharacter color={color} />;
    case "character-mermaid":
      return <MermaidCharacter color={color} />;
    case "character-genie":
      return <GenieCharacter color={color} />;
    case "character-vampire":
      return <VampireCharacter color={color} />;
    case "character-scientist":
      return <ScientistCharacter color={color} />;
    case "character-farmer":
      return <FarmerCharacter color={color} />;
    case "character-doctor":
      return <DoctorCharacter color={color} />;
    case "character-artist":
      return <ArtistCharacter color={color} />;
    case "character-firefighter":
      return <FirefighterCharacter color={color} />;
    case "character-detective":
      return <DetectiveCharacter color={color} />;
    case "character-skier":
      return <SkierCharacter color={color} />;
    case "character-dancer":
      return <DancerCharacter color={color} />;
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// 1. ROBOT 🤖
// ---------------------------------------------------------------------------
function RobotCharacter({ color = "#6d28d9" }: { color?: string }) {
  return (
    <group>
      {/* Treads / Magnetic Feet */}
      {[-0.18, 0.18].map((x) => (
        <group key={x} position={[x, 0.1, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.2, 0.14, 0.38]} />
            <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0, -0.04, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.22, 12]} />
            <meshStandardMaterial color="#0f172a" roughness={0.8} metalness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Hydraulic Legs */}
      {[-0.18, 0.18].map((x) => (
        <group key={x} position={[x, 0.45, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.55, 12]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.1, 12]} />
            <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Hip Bearing */}
      <mesh position={[0, 0.72, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.22, 0.12, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Torso Chassis */}
      <mesh position={[0, 1.12, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.54, 0.62, 0.36]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.4} />
      </mesh>

      {/* Chest Display Screen */}
      <mesh position={[0, 1.18, 0.19]} castShadow>
        <boxGeometry args={[0.36, 0.24, 0.03]} />
        <meshStandardMaterial color="#0369a1" roughness={0.2} metalness={0.5} emissive="#0284c7" emissiveIntensity={0.6} />
      </mesh>
      {/* Chest Audio Waveform Line */}
      <mesh position={[0, 1.18, 0.21]}>
        <boxGeometry args={[0.26, 0.04, 0.01]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1} />
      </mesh>
      {/* Status Buttons */}
      <mesh position={[-0.1, 0.95, 0.19]} castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.04, 12]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0.1, 0.95, 0.19]} castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.04, 12]} />
        <meshStandardMaterial color="#eab308" emissive="#eab308" emissiveIntensity={0.8} />
      </mesh>

      {/* Mechanical Arms & Claw Hands */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.34, 1.25, 0]}>
          {/* Shoulder ball */}
          <mesh castShadow>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial color="#64748b" roughness={0.2} metalness={0.85} />
          </mesh>
          {/* Arm segment */}
          <mesh position={[side * 0.06, -0.28, 0]} rotation={[0, 0, side * 0.15]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, 0.42, 12]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.8} />
          </mesh>
          {/* Pincer Claw Hand */}
          <group position={[side * 0.12, -0.52, 0]}>
            <mesh rotation={[0, 0, side * 0.4]} castShadow>
              <boxGeometry args={[0.03, 0.14, 0.06]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.2} metalness={0.9} />
            </mesh>
            <mesh rotation={[0, 0, -side * 0.4]} castShadow>
              <boxGeometry args={[0.03, 0.14, 0.06]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.2} metalness={0.9} />
            </mesh>
          </group>
        </group>
      ))}

      {/* Neck Joint */}
      <mesh position={[0, 1.48, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.1, 16]} />
        <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Robot Head */}
      <mesh position={[0, 1.76, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.46, 0.42, 0.42]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.4} />
      </mesh>

      {/* Digital Visor / Screen */}
      <mesh position={[0, 1.78, 0.22]} castShadow>
        <boxGeometry args={[0.36, 0.18, 0.03]} />
        <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.2} emissive="#0284c7" emissiveIntensity={0.6} />
      </mesh>

      {/* Glowing Twin Eyes */}
      {[-0.08, 0.08].map((x) => (
        <mesh key={x} position={[x, 1.78, 0.24]}>
          <boxGeometry args={[0.06, 0.06, 0.01]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.5} />
        </mesh>
      ))}

      {/* Side Audio Bolts */}
      {[-0.24, 0.24].map((x) => (
        <mesh key={x} position={[x, 1.76, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.06, 12]} />
          <meshStandardMaterial color="#64748b" roughness={0.3} metalness={0.8} />
        </mesh>
      ))}

      {/* Head Antenna with Blinking Tip */}
      <mesh position={[0, 2.05, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.02, 0.2, 8]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position={[0, 2.18, 0]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.8} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 2. EXPLORER 🧑‍🚀
// ---------------------------------------------------------------------------
function ExplorerCharacter({ color = "#f43f5e" }: { color?: string }) {
  return (
    <group>
      {/* Boots & Hiking Socks */}
      {[-0.14, 0.14].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0.08, 0.04]} castShadow>
            <boxGeometry args={[0.14, 0.16, 0.28]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} metalness={0.1} />
          </mesh>
          <mesh position={[0, 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.1, 12]} />
            <meshStandardMaterial color="#fef08a" roughness={0.7} />
          </mesh>
          {/* Khaki Pants */}
          <mesh position={[0, 0.44, 0]} castShadow>
            <cylinderGeometry args={[0.085, 0.08, 0.42, 12]} />
            <meshStandardMaterial color="#ca8a04" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Safari Jacket Torso */}
      <mesh position={[0, 0.98, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.22, 0.48, 6, 16]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>

      {/* Utility Belt & Compass Pouch */}
      <mesh position={[0, 0.76, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.24, 0.08, 16]} />
        <meshStandardMaterial color="#451a03" roughness={0.6} />
      </mesh>
      <mesh position={[0.2, 0.76, 0.12]} castShadow>
        <boxGeometry args={[0.08, 0.1, 0.06]} />
        <meshStandardMaterial color="#92400e" roughness={0.7} />
      </mesh>

      {/* Backpack */}
      <mesh position={[0, 1.05, -0.24]} castShadow>
        <boxGeometry args={[0.34, 0.44, 0.18]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.32, -0.24]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.32, 12]} />
        <meshStandardMaterial color="#b45309" roughness={0.8} />
      </mesh>

      {/* Arms & Hands holding Compass */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.28, 1.15, 0]}>
          <mesh position={[side * 0.04, -0.22, 0.08]} rotation={[0.4, 0, -side * 0.15]} castShadow>
            <cylinderGeometry args={[0.06, 0.055, 0.36, 12]} />
            <meshStandardMaterial color={color} roughness={0.7} />
          </mesh>
          <mesh position={[side * 0.04, -0.4, 0.2]} castShadow>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshStandardMaterial color="#fed7aa" roughness={0.6} />
          </mesh>
        </group>
      ))}
      {/* Brass Compass held in hands */}
      <mesh position={[0, 0.76, 0.3]} rotation={[Math.PI / 3, 0, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.03, 16]} />
        <meshStandardMaterial color="#eab308" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Head & Face */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.6} />
      </mesh>
      {/* Eyes */}
      {[-0.06, 0.06].map((x) => (
        <mesh key={x} position={[x, 1.52, 0.18]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} />
        </mesh>
      ))}

      {/* Safari Pith Sun Helmet */}
      <mesh position={[0, 1.66, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.28, 0.16, 20]} />
        <meshStandardMaterial color="#fef08a" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.59, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.34, 0.03, 20]} />
        <meshStandardMaterial color="#fef08a" roughness={0.7} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 3. ADVENTURER 🎒
// ---------------------------------------------------------------------------
function AdventurerCharacter({ color = "#22c55e" }: { color?: string }) {
  return (
    <group>
      {/* Rugged Expedition Boots & Trousers */}
      {[-0.14, 0.14].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0.08, 0.04]} castShadow>
            <boxGeometry args={[0.15, 0.16, 0.3]} />
            <meshStandardMaterial color="#451a03" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.42, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.44, 12]} />
            <meshStandardMaterial color="#78350f" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Leather Jacket over Khaki Shirt */}
      <mesh position={[0, 0.96, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.23, 0.48, 6, 16]} />
        <meshStandardMaterial color={color} roughness={0.65} />
      </mesh>
      {/* Inner Shirt V-neck */}
      <mesh position={[0, 1.05, 0.18]} castShadow>
        <boxGeometry args={[0.16, 0.22, 0.04]} />
        <meshStandardMaterial color="#fef08a" roughness={0.8} />
      </mesh>

      {/* Diagonal Leather Satchel Strap & Bag */}
      <mesh position={[0, 1.0, 0.05]} rotation={[0, 0, 0.6]} castShadow>
        <boxGeometry args={[0.06, 0.65, 0.26]} />
        <meshStandardMaterial color="#451a03" roughness={0.7} />
      </mesh>
      <mesh position={[0.25, 0.74, 0.05]} castShadow>
        <boxGeometry args={[0.1, 0.2, 0.22]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>

      {/* Coiled Whip on Belt */}
      <mesh position={[-0.24, 0.74, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <torusGeometry args={[0.07, 0.02, 8, 16]} />
        <meshStandardMaterial color="#451a03" roughness={0.8} />
      </mesh>

      {/* Arms */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.28, 1.15, 0]}>
          <mesh position={[side * 0.04, -0.22, 0]} rotation={[0, 0, side * 0.1]} castShadow>
            <cylinderGeometry args={[0.06, 0.055, 0.4, 12]} />
            <meshStandardMaterial color="#92400e" roughness={0.65} />
          </mesh>
          <mesh position={[side * 0.04, -0.44, 0]} castShadow>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshStandardMaterial color="#fed7aa" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Head */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.6} />
      </mesh>
      {/* Eyes & Stubble */}
      {[-0.06, 0.06].map((x) => (
        <mesh key={x} position={[x, 1.52, 0.18]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      ))}
      <mesh position={[0, 1.4, 0.15]}>
        <boxGeometry args={[0.14, 0.08, 0.05]} />
        <meshStandardMaterial color="#9a3412" roughness={0.9} transparent opacity={0.3} />
      </mesh>

      {/* Wide-Brim Fedora Hat */}
      <mesh position={[0, 1.64, 0]} rotation={[-0.05, 0, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.34, 0.03, 24]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.76, 0]} rotation={[-0.05, 0, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.2, 0.18, 20]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.68, 0]} rotation={[-0.05, 0, 0]}>
        <cylinderGeometry args={[0.205, 0.205, 0.04, 20]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 4. WIZARD 🧙
// ---------------------------------------------------------------------------
function WizardCharacter({ color = "#7c3aed" }: { color?: string }) {
  return (
    <group>
      {/* Flowing Wizard Robes (Conical) */}
      <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.45, 1.3, 20]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>

      {/* Golden Starlight Robe Trim */}
      <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.43, 0.025, 12, 24]} />
        <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.48, 0]} castShadow>
        <sphereGeometry args={[0.19, 24, 24]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.6} />
      </mesh>

      {/* Mystic Eyes */}
      {[-0.06, 0.06].map((x) => (
        <mesh key={x} position={[x, 1.5, 0.17]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.5} />
        </mesh>
      ))}

      {/* Long Flowing White Beard & Mustache */}
      <mesh position={[0, 1.25, 0.12]} rotation={[0.1, 0, 0]} castShadow>
        <coneGeometry args={[0.16, 0.55, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.42, 0.18]} rotation={[0, 0, Math.PI]} castShadow>
        <coneGeometry args={[0.14, 0.08, 12]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.8} />
      </mesh>

      {/* Tall Pointed Wizard Hat */}
      <mesh position={[0, 1.62, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.34, 0.03, 24]} />
        <meshStandardMaterial color="#4c1d95" roughness={0.6} />
      </mesh>
      <mesh position={[-0.02, 1.88, -0.02]} rotation={[0.1, 0, -0.08]} castShadow>
        <coneGeometry args={[0.22, 0.5, 20]} />
        <meshStandardMaterial color="#4c1d95" roughness={0.6} />
      </mesh>
      <mesh position={[-0.08, 2.12, -0.08]} rotation={[0.3, 0, -0.2]} castShadow>
        <coneGeometry args={[0.12, 0.3, 16]} />
        <meshStandardMaterial color="#4c1d95" roughness={0.6} />
      </mesh>
      {/* Hat Gold Buckle */}
      <mesh position={[0, 1.66, 0.21]}>
        <boxGeometry args={[0.08, 0.08, 0.02]} />
        <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Twisted Magic Staff in Right Hand */}
      <group position={[0.42, 0, 0.1]}>
        {/* Wooden Staff */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.035, 1.8, 10]} />
          <meshStandardMaterial color="#582f0e" roughness={0.85} />
        </mesh>
        {/* Staff Headpiece */}
        <mesh position={[0, 1.8, 0]} castShadow>
          <torusGeometry args={[0.12, 0.03, 12, 20]} />
          <meshStandardMaterial color="#7f4f24" roughness={0.7} />
        </mesh>
        {/* Hovering Glowing Crystal Orb */}
        <mesh position={[0, 1.8, 0]}>
          <sphereGeometry args={[0.085, 16, 16]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} emissive="#0284c7" emissiveIntensity={1.8} transparent opacity={0.9} />
        </mesh>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 5. KNIGHT 🛡️
// ---------------------------------------------------------------------------
function KnightCharacter({ color = "#64748b" }: { color?: string }) {
  return (
    <group>
      {/* Armored Greaves & Sabatons */}
      {[-0.15, 0.15].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0.08, 0.04]} castShadow>
            <boxGeometry args={[0.15, 0.16, 0.3]} />
            <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.42, 0]} castShadow>
            <cylinderGeometry args={[0.085, 0.08, 0.44, 12]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.25} metalness={0.85} />
          </mesh>
        </group>
      ))}

      {/* Steel Breastplate with Gold Crest */}
      <mesh position={[0, 0.98, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.25, 0.5, 6, 16]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.85} />
      </mesh>
      {/* Heraldic Gold Cross on Chest */}
      <mesh position={[0, 1.05, 0.22]} castShadow>
        <boxGeometry args={[0.05, 0.2, 0.02]} />
        <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0, 1.08, 0.22]} castShadow>
        <boxGeometry args={[0.15, 0.05, 0.02]} />
        <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Segmented Shoulder Pauldrons */}
      {[-0.3, 0.3].map((x) => (
        <mesh key={x} position={[x, 1.25, 0]} castShadow>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.25} metalness={0.85} />
        </mesh>
      ))}

      {/* Steel Helmet with Eye Slits */}
      <mesh position={[0, 1.55, 0]} castShadow>
        <cylinderGeometry args={[0.21, 0.23, 0.36, 16]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.85} />
      </mesh>
      {/* Helmet Visor Cross Slit */}
      <mesh position={[0, 1.55, 0.21]}>
        <boxGeometry args={[0.24, 0.03, 0.02]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.55, 0.21]}>
        <boxGeometry args={[0.03, 0.16, 0.02]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>

      {/* Royal Crimson Feather Plume */}
      <mesh position={[0, 1.82, -0.06]} rotation={[-0.3, 0, 0]} castShadow>
        <coneGeometry args={[0.08, 0.32, 12]} />
        <meshStandardMaterial color="#dc2626" roughness={0.7} />
      </mesh>

      {/* Steel Broadsword in Right Hand */}
      <group position={[0.42, 0.9, 0.1]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.05, 0.65, 0.02]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.15} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.2, 0.04, 0.04]} />
          <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, -0.1, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.16, 8]} />
          <meshStandardMaterial color="#451a03" roughness={0.8} />
        </mesh>
      </group>

      {/* Heater Shield in Left Hand */}
      <group position={[-0.38, 0.95, 0.15]} rotation={[0, 0.2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.34, 0.5, 0.04]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.4} />
        </mesh>
        {/* Shield Cross */}
        <mesh position={[0, 0, 0.03]}>
          <boxGeometry args={[0.06, 0.44, 0.01]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.06, 0.03]}>
          <boxGeometry args={[0.28, 0.06, 0.01]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 6. ASTRONAUT 👨‍🚀
// ---------------------------------------------------------------------------
function AstronautCharacter({ color = "#e2e8f0" }: { color?: string }) {
  return (
    <group>
      {/* Heavy Moon Boots */}
      {[-0.16, 0.16].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0.1, 0.05]} castShadow>
            <boxGeometry args={[0.18, 0.18, 0.34]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.42, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.09, 0.44, 14]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Pressurized Suit Torso */}
      <mesh position={[0, 0.98, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.28, 0.48, 6, 16]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>

      {/* Chest Telemetry Pack with Gauges */}
      <mesh position={[0, 1.05, 0.24]} castShadow>
        <boxGeometry args={[0.26, 0.22, 0.08]} />
        <meshStandardMaterial color="#0284c7" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[-0.06, 1.05, 0.29]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.02, 12]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0.06, 1.05, 0.29]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.02, 12]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.6} />
      </mesh>

      {/* Life Support PLSS Backpack */}
      <mesh position={[0, 1.08, -0.28]} castShadow>
        <boxGeometry args={[0.42, 0.54, 0.24]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Backpack Antenna */}
      <mesh position={[0.14, 1.48, -0.28]} castShadow>
        <cylinderGeometry args={[0.01, 0.015, 0.3, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} />
      </mesh>

      {/* Pressurized Space Helmet */}
      <mesh position={[0, 1.58, 0]} castShadow>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>
      {/* Reflective Golden Visor */}
      <mesh position={[0, 1.58, 0.12]} castShadow rotation={[-Math.PI / 2, 0, 0]}>
        <sphereGeometry args={[0.23, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.1} metalness={0.95} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 7. PIRATE 🏴‍☠️
// ---------------------------------------------------------------------------
function PirateCharacter({ color = "#78350f" }: { color?: string }) {
  return (
    <group>
      {/* Peg Leg (Left) & Buccaneer Boot (Right) */}
      {/* Peg Leg */}
      <group position={[-0.14, 0, 0]}>
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.04, 0.5, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.02, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.04, 12]} />
          <meshStandardMaterial color="#eab308" metalness={0.8} />
        </mesh>
      </group>
      {/* Boot */}
      <group position={[0.14, 0, 0]}>
        <mesh position={[0, 0.08, 0.04]} castShadow>
          <boxGeometry args={[0.15, 0.16, 0.3]} />
          <meshStandardMaterial color="#1c1917" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.38, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.08, 0.44, 12]} />
          <meshStandardMaterial color="#1c1917" roughness={0.7} />
        </mesh>
      </group>

      {/* Crimson Captain Coat & White Jabot */}
      <mesh position={[0, 0.98, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.24, 0.5, 6, 16]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.1, 0.18]} castShadow>
        <boxGeometry args={[0.12, 0.2, 0.04]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.7} />
      </mesh>

      {/* Gold Belt Buckle */}
      <mesh position={[0, 0.76, 0.18]} castShadow>
        <boxGeometry args={[0.1, 0.08, 0.03]} />
        <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Pirate Hook (Left Hand) */}
      <group position={[-0.32, 0.9, 0.15]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.04, 0.05, 0.1, 12]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.08, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <torusGeometry args={[0.06, 0.018, 8, 16, Math.PI * 1.3]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.2} metalness={0.9} />
        </mesh>
      </group>

      {/* Cutlass Sword (Right Hand) */}
      <group position={[0.34, 0.9, 0.1]}>
        <mesh position={[0, 0.2, 0]} rotation={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.04, 0.5, 0.02]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.85} />
        </mesh>
        <mesh position={[0, -0.05, 0]} castShadow>
          <torusGeometry args={[0.06, 0.02, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.8} />
        </mesh>
      </group>

      {/* Head */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.6} />
      </mesh>
      {/* Eye Patch & Seeing Eye */}
      <mesh position={[-0.06, 1.52, 0.18]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0.06, 1.52, 0.18]}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Pirate Beard */}
      <mesh position={[0, 1.38, 0.14]} castShadow>
        <coneGeometry args={[0.12, 0.2, 12]} />
        <meshStandardMaterial color="#1c1917" roughness={0.8} />
      </mesh>

      {/* Tricorn Captain Hat */}
      <mesh position={[0, 1.68, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.36, 0.36, 0.03, 3]} />
        <meshStandardMaterial color="#18181b" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.76, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.16, 16]} />
        <meshStandardMaterial color="#18181b" roughness={0.7} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 8. NINJA 🥷
// ---------------------------------------------------------------------------
function NinjaCharacter({ color = "#18181b" }: { color?: string }) {
  return (
    <group>
      {/* Shinobi Tabi Boots & Leg Wraps */}
      {[-0.14, 0.14].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0.06, 0.04]} castShadow>
            <boxGeometry args={[0.13, 0.12, 0.26]} />
            <meshStandardMaterial color="#09090b" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.38, 0]} castShadow>
            <cylinderGeometry args={[0.075, 0.07, 0.44, 12]} />
            <meshStandardMaterial color="#18181b" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Dark Shinobi Gi */}
      <mesh position={[0, 0.96, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.22, 0.48, 6, 16]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>

      {/* Red Shinobi Sash Belt */}
      <mesh position={[0, 0.74, 0]} castShadow>
        <cylinderGeometry args={[0.23, 0.23, 0.08, 16]} />
        <meshStandardMaterial color="#dc2626" roughness={0.6} />
      </mesh>

      {/* Crossed Twin Katanas on Back */}
      <group position={[0, 1.05, -0.22]}>
        <mesh rotation={[0, 0, 0.7]} castShadow>
          <boxGeometry args={[0.04, 0.8, 0.03]} />
          <meshStandardMaterial color="#09090b" roughness={0.5} />
        </mesh>
        <mesh rotation={[0, 0, -0.7]} castShadow>
          <boxGeometry args={[0.04, 0.8, 0.03]} />
          <meshStandardMaterial color="#09090b" roughness={0.5} />
        </mesh>
      </group>

      {/* Arms holding Shuriken */}
      <group position={[0.3, 0.95, 0.15]}>
        {/* Shuriken Star */}
        <mesh rotation={[0, 0, Math.PI / 4]} castShadow>
          <boxGeometry args={[0.12, 0.02, 0.12]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.2} metalness={0.9} />
        </mesh>
      </group>

      {/* Masked Head & Cowl */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshStandardMaterial color="#18181b" roughness={0.7} />
      </mesh>
      {/* Fierce Exposed Eyes Strip */}
      <mesh position={[0, 1.52, 0.17]} castShadow>
        <boxGeometry args={[0.18, 0.05, 0.03]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.6} />
      </mesh>
      {[-0.05, 0.05].map((x) => (
        <mesh key={x} position={[x, 1.52, 0.19]}>
          <boxGeometry args={[0.03, 0.02, 0.01]} />
          <meshStandardMaterial color="#09090b" />
        </mesh>
      ))}

      {/* Red Forehead Protector Headband */}
      <mesh position={[0, 1.62, 0]} castShadow>
        <cylinderGeometry args={[0.205, 0.205, 0.05, 20]} />
        <meshStandardMaterial color="#dc2626" roughness={0.6} />
      </mesh>
      {/* Metal Clan Plate */}
      <mesh position={[0, 1.62, 0.2]}>
        <boxGeometry args={[0.1, 0.04, 0.02]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.85} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 9. CHEF 👨‍🍳
// ---------------------------------------------------------------------------
function ChefCharacter({ color = "#f8fafc" }: { color?: string }) {
  return (
    <group>
      {/* Black Kitchen Shoes & Trousers */}
      {[-0.14, 0.14].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0.06, 0.04]} castShadow>
            <boxGeometry args={[0.14, 0.12, 0.28]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.075, 0.44, 12]} />
            <meshStandardMaterial color="#334155" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* White Double-Breasted Chef Jacket */}
      <mesh position={[0, 0.98, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.23, 0.48, 6, 16]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Double Column Buttons */}
      {[-0.06, 0.06].map((x) =>
        [0.85, 0.98, 1.11].map((y) => (
          <mesh key={`${x}-${y}`} position={[x, y, 0.21]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.01, 8]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        ))
      )}

      {/* Red Chef Neckerchief Scarf */}
      <mesh position={[0, 1.3, 0]} castShadow>
        <torusGeometry args={[0.18, 0.04, 10, 20]} />
        <meshStandardMaterial color="#dc2626" roughness={0.6} />
      </mesh>

      {/* Frying Pan (Left Hand) & Rolling Pin (Right Hand) */}
      <group position={[-0.34, 0.9, 0.15]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.12, 0.05, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0, -0.16]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.22, 8]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>
      <group position={[0.34, 0.95, 0.1]}>
        <mesh rotation={[0.4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.4, 12]} />
          <meshStandardMaterial color="#d97706" roughness={0.7} />
        </mesh>
      </group>

      {/* Head */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.6} />
      </mesh>
      {/* Eyes */}
      {[-0.06, 0.06].map((x) => (
        <mesh key={x} position={[x, 1.52, 0.18]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      ))}

      {/* Tall Pleated Toque Blanche Chef Hat */}
      <mesh position={[0, 1.82, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.2, 0.4, 18]} />
        <meshStandardMaterial color="#ffffff" roughness={0.7} />
      </mesh>
      <mesh position={[0, 2.05, 0]} castShadow>
        <sphereGeometry args={[0.24, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.7} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 10. MERMAID 🧜
// ---------------------------------------------------------------------------
function MermaidCharacter({ color = "#0891b2" }: { color?: string }) {
  return (
    <group>
      {/* Iridescent Fish Tail curving gracefully */}
      <mesh position={[0, 0.5, 0]} rotation={[0.1, 0, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.26, 0.95, 16]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.4} />
      </mesh>
      {/* Sweeping Dual Caudal Tail Flukes */}
      <mesh position={[0, 0.04, -0.06]} rotation={[Math.PI / 3, 0, 0]} castShadow>
        <boxGeometry args={[0.42, 0.03, 0.22]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.5} />
      </mesh>

      {/* Human Torso */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <capsuleGeometry args={[0.2, 0.44, 6, 16]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.6} />
      </mesh>

      {/* Purple Pearl Seashell Bikini Top */}
      {[-0.08, 0.08].map((x) => (
        <mesh key={x} position={[x, 1.22, 0.17]} castShadow>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color="#a855f7" roughness={0.3} metalness={0.3} />
        </mesh>
      ))}

      {/* Arms in graceful pose */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.28, 1.15, 0.05]} rotation={[0.2, 0, side * 0.3]} castShadow>
          <cylinderGeometry args={[0.045, 0.04, 0.44, 12]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.6} />
        </mesh>
      ))}

      {/* Head */}
      <mesh position={[0, 1.58, 0]} castShadow>
        <sphereGeometry args={[0.19, 24, 24]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.6} />
      </mesh>
      {/* Eyes */}
      {[-0.06, 0.06].map((x) => (
        <mesh key={x} position={[x, 1.6, 0.17]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshStandardMaterial color="#0891b2" />
        </mesh>
      ))}

      {/* Long Flowing Teal Hair & Starfish Clip */}
      <mesh position={[0, 1.58, -0.06]} castShadow>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#06b6d4" roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.25, -0.16]} castShadow>
        <coneGeometry args={[0.2, 0.6, 12]} />
        <meshStandardMaterial color="#06b6d4" roughness={0.4} />
      </mesh>
      {/* Starfish Clip */}
      <mesh position={[0.18, 1.65, 0.08]} rotation={[0, 0, 0.4]}>
        <coneGeometry args={[0.06, 0.02, 5]} />
        <meshStandardMaterial color="#ec4899" roughness={0.5} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 11. GENIE 🧞
// ---------------------------------------------------------------------------
function GenieCharacter({ color = "#0ea5e9" }: { color?: string }) {
  return (
    <group>
      {/* Golden Magic Oil Lamp on ground */}
      <group position={[0, 0.08, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.16, 16, 16]} scale={[1.4, 0.6, 0.9]} />
          <meshStandardMaterial color="#facc15" roughness={0.2} metalness={0.85} />
        </mesh>
        <mesh position={[0.22, 0.04, 0]} rotation={[0, 0, -0.6]} castShadow>
          <coneGeometry args={[0.04, 0.16, 12]} />
          <meshStandardMaterial color="#facc15" roughness={0.2} metalness={0.85} />
        </mesh>
      </group>

      {/* Swirling Smoke Tornado emerging from lamp */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <coneGeometry args={[0.36, 1.0, 16, 1, true]} />
        <meshStandardMaterial color={color} roughness={0.2} transparent opacity={0.85} emissive="#0284c7" emissiveIntensity={0.5} />
      </mesh>

      {/* Muscular Blue Torso with Gold Open Vest */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <capsuleGeometry args={[0.26, 0.42, 6, 16]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      {/* Open Gold-Trimmed Purple Vest */}
      <mesh position={[0, 1.25, 0.02]} castShadow>
        <torusGeometry args={[0.27, 0.06, 12, 20]} />
        <meshStandardMaterial color="#7c3aed" roughness={0.5} />
      </mesh>

      {/* Arms with Golden Torcs */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.32, 1.25, 0]}>
          <mesh position={[side * 0.04, -0.2, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.06, 0.38, 12]} />
            <meshStandardMaterial color={color} roughness={0.5} />
          </mesh>
          <mesh position={[side * 0.04, -0.15, 0]}>
            <torusGeometry args={[0.075, 0.02, 8, 16]} />
            <meshStandardMaterial color="#facc15" roughness={0.2} metalness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Head */}
      <mesh position={[0, 1.68, 0]} castShadow>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      {/* Curled Beard & Mustache */}
      <mesh position={[0, 1.55, 0.16]} castShadow>
        <coneGeometry args={[0.06, 0.14, 10]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Purple & Gold Turban with Sapphire Jewel */}
      <mesh position={[0, 1.84, 0]} castShadow>
        <sphereGeometry args={[0.24, 18, 18, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
        <meshStandardMaterial color="#581c87" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.82, 0.22]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 12. VAMPIRE 🧛
// ---------------------------------------------------------------------------
function VampireCharacter({ color = "#4c0519" }: { color?: string }) {
  return (
    <group>
      {/* Victorian Dress Trousers & Shoes */}
      {[-0.14, 0.14].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0.06, 0.04]} castShadow>
            <boxGeometry args={[0.13, 0.12, 0.28]} />
            <meshStandardMaterial color="#09090b" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.075, 0.07, 0.44, 12]} />
            <meshStandardMaterial color="#18181b" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Tuxedo Tailcoat & Crimson Waistcoat */}
      <mesh position={[0, 0.98, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.22, 0.48, 6, 16]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.05, 0.18]} castShadow>
        <boxGeometry args={[0.14, 0.22, 0.03]} />
        <meshStandardMaterial color="#991b1b" roughness={0.4} />
      </mesh>

      {/* Dramatic Bat-Wing High Collar & Cape */}
      <mesh position={[0, 0.9, -0.22]} rotation={[0.1, 0, 0]} castShadow>
        <coneGeometry args={[0.44, 1.2, 4]} />
        <meshStandardMaterial color="#09090b" roughness={0.5} />
      </mesh>
      {/* High Red Collar Flaps */}
      <mesh position={[0, 1.52, -0.08]} rotation={[-0.2, 0, 0]} castShadow>
        <coneGeometry args={[0.28, 0.35, 12, 1, true]} />
        <meshStandardMaterial color="#991b1b" side={1} roughness={0.4} />
      </mesh>

      {/* Pale Head & Red Glowing Eyes */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.19, 24, 24]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
      </mesh>
      {[-0.06, 0.06].map((x) => (
        <mesh key={x} position={[x, 1.52, 0.18]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.2} />
        </mesh>
      ))}
      {/* Vampire Fangs */}
      {[-0.04, 0.04].map((x) => (
        <mesh key={x} position={[x, 1.4, 0.18]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.015, 0.04, 6]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 13. SCIENTIST 🧑‍🔬
// ---------------------------------------------------------------------------
function ScientistCharacter({ color = "#e2e8f0" }: { color?: string }) {
  return (
    <group>
      {/* Trousers & Shoes */}
      {[-0.14, 0.14].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0.06, 0.04]} castShadow>
            <boxGeometry args={[0.14, 0.12, 0.28]} />
            <meshStandardMaterial color="#334155" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.075, 0.44, 12]} />
            <meshStandardMaterial color="#475569" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* White Lab Coat */}
      <mesh position={[0, 0.98, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.24, 0.5, 6, 16]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Lab Coat Lapels */}
      <mesh position={[0, 1.05, 0.19]} castShadow>
        <boxGeometry args={[0.14, 0.25, 0.03]} />
        <meshStandardMaterial color="#0284c7" roughness={0.5} />
      </mesh>

      {/* Chemical Flask in Hand with Glowing Liquid */}
      <group position={[0.34, 0.85, 0.15]}>
        <mesh castShadow>
          <coneGeometry args={[0.1, 0.2, 12]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} transparent opacity={0.5} />
        </mesh>
        <mesh position={[0, -0.04, 0]}>
          <coneGeometry args={[0.08, 0.12, 12]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1.5} />
        </mesh>
      </group>

      {/* Head */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.6} />
      </mesh>

      {/* Safety Goggles */}
      <group position={[0, 1.53, 0.16]}>
        {[-0.07, 0.07].map((x) => (
          <mesh key={x} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.045, 0.015, 8, 16]} />
            <meshStandardMaterial color="#eab308" metalness={0.8} />
          </mesh>
        ))}
      </group>

      {/* Wild Einstein White Hair */}
      <mesh position={[0, 1.62, -0.04]} castShadow>
        <sphereGeometry args={[0.25, 14, 14]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.9} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 14. FARMER 🧑‍🌾
// ---------------------------------------------------------------------------
function FarmerCharacter({ color = "#ca8a04" }: { color?: string }) {
  return (
    <group>
      {/* Muddy Work Boots */}
      {[-0.14, 0.14].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0.08, 0.04]} castShadow>
            <boxGeometry args={[0.15, 0.16, 0.3]} />
            <meshStandardMaterial color="#451a03" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.085, 0.08, 0.44, 12]} />
            <meshStandardMaterial color="#1d4ed8" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Denim Overalls over Flannel Shirt */}
      <mesh position={[0, 0.98, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.24, 0.5, 6, 16]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Overalls Bib & Straps */}
      <mesh position={[0, 0.95, 0.18]} castShadow>
        <boxGeometry args={[0.26, 0.3, 0.04]} />
        <meshStandardMaterial color="#1d4ed8" roughness={0.8} />
      </mesh>

      {/* Wooden Pitchfork in Right Hand */}
      <group position={[0.4, 0.9, 0.1]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.02, 0.02, 1.8, 8]} />
          <meshStandardMaterial color="#92400e" roughness={0.8} />
        </mesh>
        {/* Tines */}
        {[-0.08, 0, 0.08].map((tine) => (
          <mesh key={tine} position={[tine, 0.95, 0]} castShadow>
            <cylinderGeometry args={[0.008, 0.008, 0.28, 6]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>
        ))}
      </group>

      {/* Head */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.6} />
      </mesh>

      {/* Wide-Brim Woven Straw Hat */}
      <mesh position={[0, 1.64, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.03, 24]} />
        <meshStandardMaterial color="#fef08a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.76, 0]} castShadow>
        <coneGeometry args={[0.2, 0.22, 16]} />
        <meshStandardMaterial color="#fef08a" roughness={0.8} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 15. DOCTOR 🩺
// ---------------------------------------------------------------------------
function DoctorCharacter({ color = "#f1f5f9" }: { color?: string }) {
  return (
    <group>
      {/* Hospital Shoes & Scrubs */}
      {[-0.14, 0.14].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0.06, 0.04]} castShadow>
            <boxGeometry args={[0.14, 0.12, 0.28]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.075, 0.44, 12]} />
            <meshStandardMaterial color="#0284c7" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* White Doctor Coat over Scrubs */}
      <mesh position={[0, 0.98, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.23, 0.48, 6, 16]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>

      {/* Stethoscope around Neck */}
      <mesh position={[0, 1.15, 0.16]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.15, 0.02, 10, 20]} />
        <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.98, 0.24]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.02, 12]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
      </mesh>

      {/* Medical Clipboard in Hand */}
      <mesh position={[0.32, 0.9, 0.15]} rotation={[0.4, 0.3, 0]} castShadow>
        <boxGeometry args={[0.16, 0.24, 0.02]} />
        <meshStandardMaterial color="#b45309" roughness={0.7} />
      </mesh>

      {/* Head with Head-Mirror Reflector */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.62, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.015, 16]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 16. ARTIST 🎨
// ---------------------------------------------------------------------------
function ArtistCharacter({ color = "#a855f7" }: { color?: string }) {
  return (
    <group>
      {/* Trousers & Shoes */}
      {[-0.14, 0.14].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0.06, 0.04]} castShadow>
            <boxGeometry args={[0.14, 0.12, 0.28]} />
            <meshStandardMaterial color="#78350f" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.075, 0.44, 12]} />
            <meshStandardMaterial color="#334155" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Striped Breton Shirt & Smock */}
      <mesh position={[0, 0.98, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.23, 0.48, 6, 16]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>

      {/* Painter's Wooden Palette with Color Dollops (Left Hand) */}
      <group position={[-0.34, 0.95, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.16, 0.16, 0.02, 16]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.6} />
        </mesh>
        {/* Paint Dots */}
        {[
          { color: "#ef4444", pos: [-0.08, 0.02, -0.05] },
          { color: "#3b82f6", pos: [-0.02, 0.02, -0.09] },
          { color: "#eab308", pos: [0.05, 0.02, -0.07] },
          { color: "#22c55e", pos: [0.09, 0.02, -0.02] },
        ].map((dot, i) => (
          <mesh key={i} position={dot.pos as [number, number, number]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial color={dot.color} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Paintbrush in Right Hand */}
      <group position={[0.34, 0.95, 0.15]}>
        <mesh rotation={[0.4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.35, 8]} />
          <meshStandardMaterial color="#d97706" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.2, 0.08]}>
          <coneGeometry args={[0.025, 0.06, 8]} />
          <meshStandardMaterial color="#ef4444" roughness={0.4} />
        </mesh>
      </group>

      {/* Head */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.6} />
      </mesh>

      {/* Tilted French Beret */}
      <mesh position={[0.04, 1.68, 0]} rotation={[0.2, 0, 0.2]} castShadow>
        <sphereGeometry args={[0.22, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
        <meshStandardMaterial color="#991b1b" roughness={0.7} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 17. FIREFIGHTER 🧑‍🚒
// ---------------------------------------------------------------------------
function FirefighterCharacter({ color = "#dc2626" }: { color?: string }) {
  return (
    <group>
      {/* Heavy Boots & Turnout Gear */}
      {[-0.14, 0.14].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0.08, 0.04]} castShadow>
            <boxGeometry args={[0.15, 0.16, 0.3]} />
            <meshStandardMaterial color="#0f172a" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.09, 0.085, 0.44, 12]} />
            <meshStandardMaterial color="#ca8a04" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Bunker Coat with Reflective Stripes */}
      <mesh position={[0, 0.98, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.26, 0.5, 6, 16]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Neon Reflective Stripes */}
      <mesh position={[0, 0.95, 0.22]}>
        <boxGeometry args={[0.38, 0.06, 0.02]} />
        <meshStandardMaterial color="#eab308" emissive="#eab308" emissiveIntensity={0.6} />
      </mesh>

      {/* Oxygen Tank on Back */}
      <mesh position={[0, 1.05, -0.24]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.44, 12]} />
        <meshStandardMaterial color="#eab308" metalness={0.7} />
      </mesh>

      {/* Fire Rescue Axe in Right Hand */}
      <group position={[0.38, 0.95, 0.1]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.7, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.3, 0.06]} castShadow>
          <boxGeometry args={[0.05, 0.14, 0.18]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} metalness={0.6} />
        </mesh>
      </group>

      {/* Head */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.6} />
      </mesh>

      {/* Firefighter Helmet with Shield */}
      <mesh position={[0, 1.66, 0]} castShadow>
        <sphereGeometry args={[0.26, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#eab308" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Neck Shield Flap */}
      <mesh position={[0, 1.52, -0.15]} rotation={[-0.3, 0, 0]} castShadow>
        <boxGeometry args={[0.3, 0.2, 0.03]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 18. DETECTIVE 🕵️
// ---------------------------------------------------------------------------
function DetectiveCharacter({ color = "#57534e" }: { color?: string }) {
  return (
    <group>
      {/* Trousers & Oxford Brogues */}
      {[-0.14, 0.14].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0.06, 0.04]} castShadow>
            <boxGeometry args={[0.14, 0.12, 0.28]} />
            <meshStandardMaterial color="#451a03" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.075, 0.44, 12]} />
            <meshStandardMaterial color="#44403c" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Belted Khaki Trench Coat */}
      <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.24, 0.52, 6, 16]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Trench Coat Belt */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.06, 16]} />
        <meshStandardMaterial color="#78716c" roughness={0.7} />
      </mesh>

      {/* Large Brass Magnifying Glass in Hand */}
      <group position={[0.32, 0.98, 0.18]} rotation={[Math.PI / 3, 0, 0]}>
        <mesh castShadow>
          <torusGeometry args={[0.09, 0.018, 8, 16]} />
          <meshStandardMaterial color="#facc15" roughness={0.2} metalness={0.9} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.085, 0.085, 0.01, 16]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} transparent opacity={0.4} />
        </mesh>
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.14, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
      </group>

      {/* Head */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.6} />
      </mesh>

      {/* Deerstalker Houndstooth Cap */}
      <mesh position={[0, 1.66, 0]} castShadow>
        <sphereGeometry args={[0.23, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#78716c" roughness={0.8} />
      </mesh>
      {/* Front & Rear Bills */}
      <mesh position={[0, 1.62, 0.18]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.24, 0.03, 0.12]} />
        <meshStandardMaterial color="#57534e" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.62, -0.18]} rotation={[-0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.24, 0.03, 0.12]} />
        <meshStandardMaterial color="#57534e" roughness={0.8} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 19. SKIER ⛷️
// ---------------------------------------------------------------------------
function SkierCharacter({ color = "#2563eb" }: { color?: string }) {
  return (
    <group>
      {/* Snow Skis on Ground */}
      {[-0.16, 0.16].map((x) => (
        <group key={x} position={[x, 0, 0.1]}>
          <mesh position={[0, 0.02, 0]} castShadow>
            <boxGeometry args={[0.1, 0.025, 1.1]} />
            <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.4} />
          </mesh>
          {/* Curved Ski Tip */}
          <mesh position={[0, 0.06, 0.54]} rotation={[-0.4, 0, 0]} castShadow>
            <boxGeometry args={[0.1, 0.02, 0.12]} />
            <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Puffer Ski Jacket */}
      <mesh position={[0, 0.98, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.26, 0.5, 6, 16]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>

      {/* Ski Poles in Both Hands */}
      {[-0.34, 0.34].map((x) => (
        <group key={x} position={[x, 0.9, 0.1]}>
          <mesh rotation={[0.2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 1.0, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>
          <mesh position={[0, -0.4, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.06, 0.01, 8, 16]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>
      ))}

      {/* Head with Beanie & Iridescent Ski Goggles */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.6} />
      </mesh>
      {/* Pompom Beanie */}
      <mesh position={[0, 1.65, 0]} castShadow>
        <sphereGeometry args={[0.22, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
        <meshStandardMaterial color="#dc2626" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.88, 0]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      {/* Mirrored Ski Goggles */}
      <mesh position={[0, 1.54, 0.18]} castShadow>
        <boxGeometry args={[0.3, 0.08, 0.06]} />
        <meshStandardMaterial color="#06b6d4" roughness={0.1} metalness={0.9} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 20. DANCER 💃
// ---------------------------------------------------------------------------
function DancerCharacter({ color = "#db2777" }: { color?: string }) {
  return (
    <group>
      {/* Slender Ballet Legs & Pointe Slippers with Ribbons */}
      {[-0.1, 0.1].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0.08, 0.02]} castShadow>
            <boxGeometry args={[0.1, 0.16, 0.2]} />
            <meshStandardMaterial color="#f472b6" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.44, 0]} castShadow>
            <cylinderGeometry args={[0.065, 0.06, 0.5, 12]} />
            <meshStandardMaterial color="#fed7aa" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Flared Ballerina Tutu Skirt */}
      <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.48, 0.22, 0.1, 24]} />
        <meshStandardMaterial color="#f472b6" roughness={0.5} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, 0.74, 0]}>
        <cylinderGeometry args={[0.42, 0.22, 0.08, 20]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} transparent opacity={0.8} />
      </mesh>

      {/* Fitted Leotard Torso */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <capsuleGeometry args={[0.19, 0.44, 6, 16]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>

      {/* Graceful Arched Ballet Arms (Fifth Position / En Haut) */}
      <group position={[0, 1.25, 0]}>
        <mesh position={[-0.24, 0.18, 0]} rotation={[0, 0, 0.8]} castShadow>
          <cylinderGeometry args={[0.04, 0.035, 0.42, 10]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.6} />
        </mesh>
        <mesh position={[0.24, 0.18, 0]} rotation={[0, 0, -0.8]} castShadow>
          <cylinderGeometry args={[0.04, 0.035, 0.42, 10]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.6} />
        </mesh>
      </group>

      {/* Head */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.6} />
      </mesh>

      {/* Ballet Hair Bun & Golden Tiara */}
      <mesh position={[0, 1.7, -0.06]} castShadow>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#451a03" roughness={0.8} />
      </mesh>
      {/* Tiara */}
      <mesh position={[0, 1.66, 0.08]}>
        <torusGeometry args={[0.1, 0.015, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#facc15" roughness={0.2} metalness={0.9} />
      </mesh>
    </group>
  );
}
