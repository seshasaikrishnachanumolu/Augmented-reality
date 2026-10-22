"use client";

import type { ModelType } from "@/types/scene";

interface AnimalModelProps {
  modelType: ModelType;
  color?: string;
}

/**
 * Rich, stylized 3D models for all 20 animals in the asset library.
 * Features distinctive anatomy, head shapes, ears, limbs, tails, and expressive eyes.
 */
export function AnimalModel({ modelType, color }: AnimalModelProps) {
  switch (modelType) {
    case "animal-fox":
      return <FoxModel color={color} />;
    case "animal-bird":
      return <BirdModel color={color} />;
    case "animal-cat":
      return <CatModel color={color} />;
    case "animal-rabbit":
      return <RabbitModel color={color} />;
    case "animal-turtle":
      return <TurtleModel color={color} />;
    case "animal-dog":
      return <DogModel color={color} />;
    case "animal-owl":
      return <OwlModel color={color} />;
    case "animal-fish":
      return <FishModel color={color} />;
    case "animal-frog":
      return <FrogModel color={color} />;
    case "animal-elephant":
      return <ElephantModel color={color} />;
    case "animal-panda":
      return <PandaModel color={color} />;
    case "animal-squirrel":
      return <SquirrelModel color={color} />;
    case "animal-penguin":
      return <PenguinModel color={color} />;
    case "animal-deer":
      return <DeerModel color={color} />;
    case "animal-bear":
      return <BearModel color={color} />;
    case "animal-sheep":
      return <SheepModel color={color} />;
    case "animal-horse":
      return <HorseModel color={color} />;
    case "animal-snail":
      return <SnailModel color={color} />;
    case "animal-butterfly":
      return <ButterflyModel color={color} />;
    case "animal-bee":
      return <BeeModel color={color} />;
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// 1. FOX 🦊
// ---------------------------------------------------------------------------
function FoxModel({ color = "#fb923c" }: { color?: string }) {
  return (
    <group>
      {/* 4 Paws */}
      {[
        [-0.14, 0.15],
        [0.14, 0.15],
        [-0.14, -0.2],
        [0.14, -0.2],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.15, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.035, 0.3, 8]} />
            <meshStandardMaterial color={color} roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.04, 0.02]} castShadow>
            <boxGeometry args={[0.08, 0.08, 0.12]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Body */}
      <mesh position={[0, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.18, 0.45, 6, 14]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* White Chest */}
      <mesh position={[0, 0.38, 0.18]} rotation={[0.4, 0, 0]} castShadow>
        <sphereGeometry args={[0.14, 12, 12]} scale={[1, 1.2, 0.8]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.8} />
      </mesh>

      {/* Head & Snout */}
      <group position={[0, 0.55, 0.32]}>
        <mesh castShadow>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        {/* Snout with black nose */}
        <mesh position={[0, -0.04, 0.14]} rotation={[0.2, 0, 0]} castShadow>
          <coneGeometry args={[0.08, 0.18, 8]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.01, 0.22]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Pointed Ears */}
        {[-0.09, 0.09].map((ex) => (
          <group key={ex} position={[ex, 0.16, 0]} rotation={[0, 0, ex > 0 ? -0.3 : 0.3]}>
            <mesh castShadow>
              <coneGeometry args={[0.06, 0.16, 4]} />
              <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
            <mesh position={[0, 0, 0.02]}>
              <coneGeometry args={[0.035, 0.12, 4]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.8} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Bushy Tail with White Tip */}
      <group position={[0, 0.38, -0.28]} rotation={[-0.6, 0, 0]}>
        <mesh position={[0, 0, -0.18]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <capsuleGeometry args={[0.12, 0.32, 6, 12]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0, -0.42]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <coneGeometry args={[0.1, 0.2, 8]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 2. BIRD 🐦
// ---------------------------------------------------------------------------
function BirdModel({ color = "#38bdf8" }: { color?: string }) {
  return (
    <group position={[0, 0.25, 0]}>
      {/* Wooden Perch */}
      <mesh position={[0, -0.22, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} />
      </mesh>
      {/* Little Feet */}
      {[-0.06, 0.06].map((x) => (
        <mesh key={x} position={[x, -0.16, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.12, 6]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.6} />
        </mesh>
      ))}

      {/* Plump Body */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.22, 18, 18]} scale={[0.9, 1, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Light Belly */}
      <mesh position={[0, -0.06, 0.1]} castShadow>
        <sphereGeometry args={[0.16, 16, 16]} scale={[0.8, 0.9, 0.9]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.7} />
      </mesh>

      {/* Head */}
      <group position={[0, 0.18, 0.14]}>
        <mesh castShadow>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
        {/* Yellow Beak */}
        <mesh position={[0, 0, 0.16]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <coneGeometry args={[0.04, 0.12, 6]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.4} />
        </mesh>
        {/* Eyes */}
        {[-0.07, 0.07].map((x) => (
          <mesh key={x} position={[x, 0.04, 0.09]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        ))}
      </group>

      {/* Wings */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.18, 0.02, -0.02]} rotation={[0.2, 0, side * 0.3]} castShadow>
          <boxGeometry args={[0.04, 0.14, 0.26]} />
          <meshStandardMaterial color="#0284c7" roughness={0.5} />
        </mesh>
      ))}

      {/* Tail Feathers */}
      <mesh position={[0, 0.04, -0.28]} rotation={[-0.4, 0, 0]} castShadow>
        <boxGeometry args={[0.12, 0.02, 0.22]} />
        <meshStandardMaterial color="#0284c7" roughness={0.5} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 3. CAT 🐱
// ---------------------------------------------------------------------------
function CatModel({ color = "#78716c" }: { color?: string }) {
  return (
    <group>
      {/* 4 Paws */}
      {[
        [-0.12, 0.12],
        [0.12, 0.12],
        [-0.12, -0.16],
        [0.12, -0.16],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.12, 0]} castShadow>
            <cylinderGeometry args={[0.035, 0.03, 0.24, 8]} />
            <meshStandardMaterial color={color} roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.03, 0.02]} castShadow>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshStandardMaterial color="#f5f5f4" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Body */}
      <mesh position={[0, 0.28, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.16, 0.38, 6, 12]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>

      {/* Head */}
      <group position={[0, 0.46, 0.26]}>
        <mesh castShadow>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        {/* Pointed Cat Ears */}
        {[-0.08, 0.08].map((x) => (
          <group key={x} position={[x, 0.14, 0]} rotation={[0, 0, x > 0 ? -0.2 : 0.2]}>
            <mesh castShadow>
              <coneGeometry args={[0.05, 0.12, 4]} />
              <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
            <mesh position={[0, 0, 0.02]}>
              <coneGeometry args={[0.03, 0.08, 4]} />
              <meshStandardMaterial color="#f472b6" roughness={0.6} />
            </mesh>
          </group>
        ))}
        {/* Green Cat Eyes */}
        {[-0.06, 0.06].map((x) => (
          <mesh key={x} position={[x, 0.02, 0.13]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial color="#22c55e" roughness={0.2} emissive="#22c55e" emissiveIntensity={0.4} />
          </mesh>
        ))}
        {/* Pink Nose */}
        <mesh position={[0, -0.04, 0.15]}>
          <coneGeometry args={[0.02, 0.02, 3]} />
          <meshStandardMaterial color="#f472b6" />
        </mesh>
      </group>

      {/* Upright Arched Tail */}
      <group position={[0, 0.32, -0.24]} rotation={[0.4, 0, 0]}>
        <mesh position={[0, 0.16, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.32, 8]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.34, 0.04]} rotation={[0.5, 0, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.03, 0.16, 8]} />
          <meshStandardMaterial color="#f5f5f4" roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 4. RABBIT 🐰
// ---------------------------------------------------------------------------
function RabbitModel({ color = "#f5f5f4" }: { color?: string }) {
  return (
    <group>
      {/* Paws */}
      {[-0.1, 0.1].map((x) => (
        <mesh key={x} position={[x, 0.05, 0.12]} castShadow>
          <boxGeometry args={[0.08, 0.08, 0.16]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
      ))}
      {[-0.14, 0.14].map((x) => (
        <mesh key={x} position={[x, 0.08, -0.08]} castShadow>
          <sphereGeometry args={[0.1, 10, 10]} scale={[0.8, 1, 1.4]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
      ))}

      {/* Chubby Body */}
      <mesh position={[0, 0.26, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.22, 16, 16]} scale={[1, 1.1, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>

      {/* Head */}
      <group position={[0, 0.48, 0.16]}>
        <mesh castShadow>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial color={color} roughness={0.85} />
        </mesh>
        {/* Long Upright Ears */}
        {[-0.07, 0.07].map((x) => (
          <group key={x} position={[x, 0.22, 0]} rotation={[0, 0, x > 0 ? -0.15 : 0.15]}>
            <mesh castShadow>
              <capsuleGeometry args={[0.045, 0.32, 4, 8]} />
              <meshStandardMaterial color={color} roughness={0.85} />
            </mesh>
            <mesh position={[0, 0, 0.02]}>
              <capsuleGeometry args={[0.025, 0.24, 4, 8]} />
              <meshStandardMaterial color="#fbcfe8" roughness={0.7} />
            </mesh>
          </group>
        ))}
        {/* Eyes & Nose */}
        {[-0.07, 0.07].map((x) => (
          <mesh key={x} position={[x, 0.02, 0.14]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        ))}
        <mesh position={[0, -0.04, 0.16]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#f472b6" />
        </mesh>
      </group>

      {/* Fluffy Cotton Ball Tail */}
      <mesh position={[0, 0.22, -0.24]} castShadow>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 5. TURTLE 🐢
// ---------------------------------------------------------------------------
function TurtleModel({ color = "#4ade80" }: { color?: string }) {
  return (
    <group>
      {/* 4 Flippers / Stumpy Legs */}
      {[
        [-0.2, 0.16],
        [0.2, 0.16],
        [-0.18, -0.16],
        [0.18, -0.16],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.06, z]} rotation={[0, 0, x > 0 ? -0.3 : 0.3]} castShadow>
          <sphereGeometry args={[0.08, 10, 10]} scale={[1.4, 0.5, 1]} />
          <meshStandardMaterial color="#22c55e" roughness={0.7} />
        </mesh>
      ))}

      {/* Domed Carapace Shell */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.3, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Shell Rim */}
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.05, 16]} />
        <meshStandardMaterial color="#166534" roughness={0.6} />
      </mesh>

      {/* Turtle Head */}
      <group position={[0, 0.16, 0.34]}>
        <mesh castShadow>
          <sphereGeometry args={[0.11, 14, 14]} scale={[0.9, 0.9, 1.2]} />
          <meshStandardMaterial color="#4ade80" roughness={0.6} />
        </mesh>
        {[-0.06, 0.06].map((x) => (
          <mesh key={x} position={[x, 0.04, 0.08]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 6. DOG 🐶
// ---------------------------------------------------------------------------
function DogModel({ color = "#d97706" }: { color?: string }) {
  return (
    <group>
      {/* 4 Paws & Legs */}
      {[
        [-0.14, 0.16],
        [0.14, 0.16],
        [-0.14, -0.18],
        [0.14, -0.18],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.16, z]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.32, 8]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      ))}

      {/* Body */}
      <mesh position={[0, 0.36, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.18, 0.44, 6, 12]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>

      {/* Head & Floppy Ears */}
      <group position={[0, 0.58, 0.3]}>
        <mesh castShadow>
          <sphereGeometry args={[0.17, 16, 16]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        {/* Snout with Wet Black Nose */}
        <mesh position={[0, -0.04, 0.14]} castShadow>
          <boxGeometry args={[0.12, 0.1, 0.16]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.01, 0.22]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Floppy Ears hanging down */}
        {[-0.16, 0.16].map((x) => (
          <mesh key={x} position={[x, 0.02, 0]} rotation={[0, 0, x > 0 ? -0.4 : 0.4]} castShadow>
            <capsuleGeometry args={[0.045, 0.2, 4, 8]} />
            <meshStandardMaterial color="#92400e" roughness={0.7} />
          </mesh>
        ))}
      </group>

      {/* Wagging Tail */}
      <mesh position={[0, 0.45, -0.28]} rotation={[-0.8, 0, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.04, 0.28, 8]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 7. OWL 🦉
// ---------------------------------------------------------------------------
function OwlModel({ color = "#92400e" }: { color?: string }) {
  return (
    <group position={[0, 0.35, 0]}>
      {/* Wooden Perch */}
      <mesh position={[0, -0.3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.6, 8]} />
        <meshStandardMaterial color="#582f0e" roughness={0.8} />
      </mesh>
      {/* Talons */}
      {[-0.08, 0.08].map((x) => (
        <mesh key={x} position={[x, -0.24, 0.04]} castShadow>
          <sphereGeometry args={[0.04, 8, 8]} scale={[1, 0.6, 1.5]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>
      ))}

      {/* Plump Owl Body */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.24, 0.38, 6, 16]} />
        <meshStandardMaterial color={color} roughness={0.75} />
      </mesh>
      {/* Speckled Chest */}
      <mesh position={[0, -0.04, 0.16]} castShadow>
        <sphereGeometry args={[0.18, 14, 14]} scale={[0.8, 1, 0.6]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.8} />
      </mesh>

      {/* Big Round Owl Disc Eyes */}
      {[-0.1, 0.1].map((x) => (
        <group key={x} position={[x, 0.18, 0.2]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.02, 16]} />
            <meshStandardMaterial color="#fef3c7" />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshStandardMaterial color="#eab308" emissive="#eab308" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[0, 0, 0.04]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>
      ))}

      {/* Hooked Beak */}
      <mesh position={[0, 0.12, 0.24]} rotation={[0.4, 0, 0]} castShadow>
        <coneGeometry args={[0.04, 0.1, 6]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.3} />
      </mesh>

      {/* Feathery Ear Tufts */}
      {[-0.14, 0.14].map((x) => (
        <mesh key={x} position={[x, 0.42, 0.05]} rotation={[0, 0, x > 0 ? -0.3 : 0.3]} castShadow>
          <coneGeometry args={[0.06, 0.18, 4]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 8. FISH 🐠
// ---------------------------------------------------------------------------
function FishModel({ color = "#0ea5e9" }: { color?: string }) {
  return (
    <group position={[0, 0.45, 0]}>
      {/* Streamlined Body */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.26, 16, 16]} scale={[0.5, 1, 1.4]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Yellow Belly / Side Stripes */}
      <mesh position={[0, -0.06, 0.04]} scale={[0.52, 0.7, 1.1]}>
        <sphereGeometry args={[0.22, 14, 14]} />
        <meshStandardMaterial color="#facc15" roughness={0.4} />
      </mesh>

      {/* Dorsal Fin on Top */}
      <mesh position={[0, 0.28, -0.05]} rotation={[-0.3, 0, 0]} castShadow>
        <boxGeometry args={[0.02, 0.16, 0.28]} />
        <meshStandardMaterial color="#f97316" roughness={0.4} transparent opacity={0.85} />
      </mesh>

      {/* Flared Caudal Tail Fin */}
      <mesh position={[0, 0, -0.38]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.02, 0.32, 0.2]} />
        <meshStandardMaterial color="#f97316" roughness={0.4} transparent opacity={0.85} />
      </mesh>

      {/* Pectoral Side Fins */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.14, -0.05, 0.08]} rotation={[0.4, side * 0.5, 0]}>
          <boxGeometry args={[0.02, 0.08, 0.14]} />
          <meshStandardMaterial color="#facc15" roughness={0.4} transparent opacity={0.85} />
        </mesh>
      ))}

      {/* Eyes */}
      {[-0.14, 0.14].map((x) => (
        <mesh key={x} position={[x, 0.08, 0.22]}>
          <sphereGeometry args={[0.035, 10, 10]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
      {[-0.15, 0.15].map((x) => (
        <mesh key={x} position={[x, 0.08, 0.24]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 9. FROG 🐸
// ---------------------------------------------------------------------------
function FrogModel({ color = "#65a30d" }: { color?: string }) {
  return (
    <group>
      {/* Crouched Hind Legs */}
      {[-0.18, 0.18].map((x) => (
        <group key={x} position={[x, 0.08, -0.08]}>
          <mesh rotation={[0.4, 0, x > 0 ? 0.3 : -0.3]} castShadow>
            <capsuleGeometry args={[0.07, 0.22, 4, 8]} />
            <meshStandardMaterial color="#4d7c0f" roughness={0.6} />
          </mesh>
          <mesh position={[x > 0 ? 0.08 : -0.08, -0.05, 0.1]}>
            <boxGeometry args={[0.12, 0.03, 0.14]} />
            <meshStandardMaterial color="#4d7c0f" />
          </mesh>
        </group>
      ))}

      {/* Chubby Frog Body */}
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.22, 16, 16]} scale={[1.2, 0.85, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Pale Green Belly */}
      <mesh position={[0, 0.12, 0.08]} scale={[1.1, 0.7, 1.0]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color="#bef264" roughness={0.7} />
      </mesh>

      {/* Big Bulging Frog Eyes on Top */}
      {[-0.1, 0.1].map((x) => (
        <group key={x} position={[x, 0.32, 0.12]}>
          <mesh castShadow>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial color={color} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.01, 0.05]}>
            <sphereGeometry args={[0.045, 10, 10]} />
            <meshStandardMaterial color="#facc15" />
          </mesh>
          <mesh position={[0, 0.01, 0.08]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 10. ELEPHANT 🐘
// ---------------------------------------------------------------------------
function ElephantModel({ color = "#94a3b8" }: { color?: string }) {
  return (
    <group>
      {/* 4 Heavy Pillar Legs */}
      {[
        [-0.22, 0.22],
        [0.22, 0.22],
        [-0.22, -0.22],
        [0.22, -0.22],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.24, z]} castShadow>
          <cylinderGeometry args={[0.09, 0.1, 0.48, 12]} />
          <meshStandardMaterial color="#64748b" roughness={0.8} />
        </mesh>
      ))}

      {/* Massive Body */}
      <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.34, 0.55, 6, 16]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>

      {/* Head with Giant Ears & Curved Trunk */}
      <group position={[0, 0.72, 0.44]}>
        <mesh castShadow>
          <sphereGeometry args={[0.26, 16, 16]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
        {/* Curled Trunk */}
        <group position={[0, -0.06, 0.22]}>
          <mesh position={[0, -0.16, 0.06]} rotation={[0.4, 0, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.09, 0.32, 10]} />
            <meshStandardMaterial color={color} roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.32, 0.2]} rotation={[1.1, 0, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.07, 0.24, 10]} />
            <meshStandardMaterial color={color} roughness={0.8} />
          </mesh>
        </group>
        {/* White Ivory Tusks */}
        {[-0.12, 0.12].map((x) => (
          <mesh key={x} position={[x, -0.14, 0.24]} rotation={[0.5, 0, x > 0 ? -0.2 : 0.2]} castShadow>
            <coneGeometry args={[0.03, 0.24, 8]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
        ))}
        {/* Giant Flapping Ears */}
        {[-0.32, 0.32].map((x) => (
          <mesh key={x} position={[x, 0.05, -0.05]} rotation={[0, x > 0 ? -0.3 : 0.3, 0]} castShadow>
            <boxGeometry args={[0.03, 0.44, 0.34]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 11. PANDA 🐼
// ---------------------------------------------------------------------------
function PandaModel({ color = "#f8fafc" }: { color?: string }) {
  return (
    <group>
      {/* Black Limbs */}
      {[
        [-0.16, 0.14],
        [0.16, 0.14],
        [-0.16, -0.16],
        [0.16, -0.16],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.16, z]} castShadow>
          <cylinderGeometry args={[0.07, 0.065, 0.32, 10]} />
          <meshStandardMaterial color="#18181b" roughness={0.8} />
        </mesh>
      ))}

      {/* Body with Black Shoulder Band */}
      <mesh position={[0, 0.38, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.22, 0.4, 6, 14]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.4, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.23, 0.23, 0.18, 14]} />
        <meshStandardMaterial color="#18181b" roughness={0.8} />
      </mesh>

      {/* Big White Panda Head */}
      <group position={[0, 0.6, 0.3]}>
        <mesh castShadow>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.85} />
        </mesh>
        {/* Black Round Ears */}
        {[-0.14, 0.14].map((x) => (
          <mesh key={x} position={[x, 0.18, 0]} castShadow>
            <sphereGeometry args={[0.07, 10, 10]} />
            <meshStandardMaterial color="#18181b" />
          </mesh>
        ))}
        {/* Black Eye Patches */}
        {[-0.08, 0.08].map((x) => (
          <mesh key={x} position={[x, 0.04, 0.16]} rotation={[0, 0, x > 0 ? -0.4 : 0.4]}>
            <sphereGeometry args={[0.045, 8, 8]} scale={[1, 1.3, 0.5]} />
            <meshStandardMaterial color="#18181b" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 12. SQUIRREL 🐿️
// ---------------------------------------------------------------------------
function SquirrelModel({ color = "#b45309" }: { color?: string }) {
  return (
    <group>
      {/* Little Paws holding an Acorn */}
      <mesh position={[0, 0.28, 0.16]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} />
      </mesh>

      {/* Sitting Body */}
      <mesh position={[0, 0.24, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.14, 0.26, 6, 12]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* White Chest */}
      <mesh position={[0, 0.24, 0.1]} scale={[0.8, 1, 0.6]}>
        <sphereGeometry args={[0.12, 10, 10]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.8} />
      </mesh>

      {/* Head */}
      <group position={[0, 0.44, 0.1]}>
        <mesh castShadow>
          <sphereGeometry args={[0.12, 14, 14]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
        {/* Perky Ears */}
        {[-0.06, 0.06].map((x) => (
          <mesh key={x} position={[x, 0.12, 0]} castShadow>
            <coneGeometry args={[0.03, 0.1, 4]} />
            <meshStandardMaterial color={color} roughness={0.8} />
          </mesh>
        ))}
      </group>

      {/* Giant Bushy Curled Tail */}
      <group position={[0, 0.2, -0.16]}>
        <mesh position={[0, 0.18, -0.12]} rotation={[0.6, 0, 0]} castShadow>
          <capsuleGeometry args={[0.14, 0.38, 6, 12]} />
          <meshStandardMaterial color="#92400e" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.44, 0.02]} rotation={[-0.4, 0, 0]} castShadow>
          <capsuleGeometry args={[0.12, 0.28, 6, 12]} />
          <meshStandardMaterial color="#92400e" roughness={0.85} />
        </mesh>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 13. PENGUIN 🐧
// ---------------------------------------------------------------------------
function PenguinModel({ color = "#1e293b" }: { color?: string }) {
  return (
    <group>
      {/* Orange Webbed Feet */}
      {[-0.1, 0.1].map((x) => (
        <mesh key={x} position={[x, 0.03, 0.08]} castShadow>
          <boxGeometry args={[0.1, 0.03, 0.16]} />
          <meshStandardMaterial color="#f97316" roughness={0.5} />
        </mesh>
      ))}

      {/* Upright Oval Tuxedo Body */}
      <mesh position={[0, 0.34, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.18, 0.36, 6, 16]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Crisp White Belly */}
      <mesh position={[0, 0.32, 0.08]} scale={[0.85, 1, 0.7]}>
        <capsuleGeometry args={[0.14, 0.3, 4, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.7} />
      </mesh>

      {/* Yellow Neck Feathers */}
      <mesh position={[0, 0.52, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.1, 0.03, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#eab308" />
      </mesh>

      {/* Orange Beak */}
      <mesh position={[0, 0.54, 0.22]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.04, 0.12, 6]} />
        <meshStandardMaterial color="#f97316" roughness={0.4} />
      </mesh>

      {/* Side Flippers */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.2, 0.34, 0]} rotation={[0, 0, side * 0.3]} castShadow>
          <boxGeometry args={[0.03, 0.3, 0.12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 14. DEER 🦌
// ---------------------------------------------------------------------------
function DeerModel({ color = "#a16207" }: { color?: string }) {
  return (
    <group>
      {/* 4 Long Slender Legs */}
      {[
        [-0.14, 0.2],
        [0.14, 0.2],
        [-0.14, -0.2],
        [0.14, -0.2],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.3, z]} castShadow>
          <cylinderGeometry args={[0.035, 0.025, 0.6, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
      ))}

      {/* Slender Deer Body */}
      <mesh position={[0, 0.62, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.18, 0.48, 6, 14]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>

      {/* Graceful Neck & Head */}
      <group position={[0, 0.82, 0.28]}>
        <mesh position={[0, 0.12, 0]} rotation={[-0.3, 0, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 0.32, 10]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.3, 0.1]} castShadow>
          <sphereGeometry args={[0.14, 14, 14]} scale={[0.8, 0.9, 1.3]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>

        {/* Branching Antlers */}
        {[-0.1, 0.1].map((x) => (
          <group key={x} position={[x, 0.44, 0.05]} rotation={[0, 0, x > 0 ? 0.3 : -0.3]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.015, 0.02, 0.34, 6]} />
              <meshStandardMaterial color="#fef3c7" roughness={0.6} />
            </mesh>
            <mesh position={[x > 0 ? 0.06 : -0.06, 0.1, 0]} rotation={[0, 0, x > 0 ? 0.6 : -0.6]} castShadow>
              <cylinderGeometry args={[0.012, 0.015, 0.18, 6]} />
              <meshStandardMaterial color="#fef3c7" roughness={0.6} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 15. BEAR 🐻
// ---------------------------------------------------------------------------
function BearModel({ color = "#5b3a1e" }: { color?: string }) {
  return (
    <group>
      {/* 4 Sturdy Paws */}
      {[
        [-0.2, 0.22],
        [0.2, 0.22],
        [-0.2, -0.22],
        [0.2, -0.22],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.2, z]} castShadow>
          <cylinderGeometry args={[0.09, 0.085, 0.4, 10]} />
          <meshStandardMaterial color="#451a03" roughness={0.8} />
        </mesh>
      ))}

      {/* Bulky Bear Torso */}
      <mesh position={[0, 0.52, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.3, 0.55, 6, 16]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>

      {/* Bear Head with Snout & Round Ears */}
      <group position={[0, 0.68, 0.38]}>
        <mesh castShadow>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
        {/* Snout */}
        <mesh position={[0, -0.05, 0.18]} castShadow>
          <boxGeometry args={[0.15, 0.12, 0.16]} />
          <meshStandardMaterial color="#92400e" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.01, 0.26]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Round Ears */}
        {[-0.16, 0.16].map((x) => (
          <mesh key={x} position={[x, 0.18, 0]} castShadow>
            <sphereGeometry args={[0.07, 10, 10]} />
            <meshStandardMaterial color={color} roughness={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 16. SHEEP 🐑
// ---------------------------------------------------------------------------
function SheepModel({ color = "#f5f5f4" }: { color?: string }) {
  return (
    <group>
      {/* 4 Little Black Legs */}
      {[
        [-0.14, 0.16],
        [0.14, 0.16],
        [-0.14, -0.16],
        [0.14, -0.16],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.12, z]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.24, 8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
      ))}

      {/* Fluffy Woolly Cloud Body (Cluster of Spheres) */}
      <group position={[0, 0.38, 0]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.28, 16, 16]} scale={[1, 0.9, 1.3]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
        {/* Puffy Cloud bumps */}
        {[
          [0.18, 0.1, 0.1],
          [-0.18, 0.1, 0.1],
          [0, 0.22, 0],
          [0.16, 0.05, -0.18],
          [-0.16, 0.05, -0.18],
        ].map(([bx, by, bz], i) => (
          <mesh key={i} position={[bx, by, bz]} castShadow>
            <sphereGeometry args={[0.14, 10, 10]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Dark Face & Floppy Ears */}
      <group position={[0, 0.44, 0.38]}>
        <mesh castShadow>
          <sphereGeometry args={[0.13, 14, 14]} scale={[0.85, 0.9, 1.2]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        {[-0.14, 0.14].map((x) => (
          <mesh key={x} position={[x, 0.02, -0.04]} rotation={[0, 0, x > 0 ? -0.5 : 0.5]} castShadow>
            <boxGeometry args={[0.12, 0.04, 0.08]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 17. HORSE 🐴
// ---------------------------------------------------------------------------
function HorseModel({ color = "#78350f" }: { color?: string }) {
  return (
    <group>
      {/* 4 Strong Legs with Black Hooves */}
      {[
        [-0.18, 0.26],
        [0.18, 0.26],
        [-0.18, -0.26],
        [0.18, -0.26],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.26, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.04, 0.52, 10]} />
            <meshStandardMaterial color={color} roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.03, 0.01]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.06, 10]} />
            <meshStandardMaterial color="#1c1917" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Powerful Torso */}
      <mesh position={[0, 0.68, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.26, 0.62, 6, 16]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>

      {/* Arched Neck & Head */}
      <group position={[0, 0.92, 0.38]}>
        <mesh position={[0, 0.18, 0.05]} rotation={[-0.4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.16, 0.44, 12]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        {/* Equine Head */}
        <mesh position={[0, 0.4, 0.2]} rotation={[0.3, 0, 0]} castShadow>
          <boxGeometry args={[0.18, 0.22, 0.38]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        {/* Dark Flowing Mane */}
        <mesh position={[0, 0.32, -0.04]} rotation={[-0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.06, 0.45, 0.1]} />
          <meshStandardMaterial color="#1c1917" roughness={0.8} />
        </mesh>
      </group>

      {/* Long Flowing Tail */}
      <mesh position={[0, 0.62, -0.42]} rotation={[-0.4, 0, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, 0.48, 8]} />
        <meshStandardMaterial color="#1c1917" roughness={0.8} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 18. SNAIL 🐌
// ---------------------------------------------------------------------------
function SnailModel({ color = "#a3855c" }: { color?: string }) {
  return (
    <group>
      {/* Slug Foot on Ground */}
      <mesh position={[0, 0.06, 0.05]} castShadow receiveShadow>
        <capsuleGeometry args={[0.1, 0.5, 4, 12]} />
        <meshStandardMaterial color="#fef08a" roughness={0.5} />
      </mesh>

      {/* Spiral Coiled Shell */}
      <group position={[0, 0.3, -0.06]}>
        <mesh rotation={[0, Math.PI / 2, 0]} castShadow>
          <torusGeometry args={[0.18, 0.09, 12, 24]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.16, 16]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
      </group>

      {/* Eye Stalks */}
      {[-0.05, 0.05].map((x) => (
        <group key={x} position={[x, 0.2, 0.28]} rotation={[-0.3, 0, x > 0 ? -0.1 : 0.1]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.2, 8]} />
            <meshStandardMaterial color="#fef08a" />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 19. BUTTERFLY 🦋
// ---------------------------------------------------------------------------
function ButterflyModel({ color = "#f472b6" }: { color?: string }) {
  return (
    <group position={[0, 0.45, 0]}>
      {/* Slender Insect Body */}
      <mesh castShadow>
        <capsuleGeometry args={[0.03, 0.28, 4, 10]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>
      {/* Antennae */}
      {[-0.04, 0.04].map((x) => (
        <mesh key={x} position={[x, 0.18, 0.04]} rotation={[0.4, 0, x > 0 ? -0.3 : 0.3]}>
          <cylinderGeometry args={[0.005, 0.005, 0.12, 6]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      ))}

      {/* Upper Wings */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.22, 0.1, 0]} rotation={[0, side * 0.25, 0]} castShadow>
          <boxGeometry args={[0.38, 0.32, 0.01]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} transparent opacity={0.9} />
        </mesh>
      ))}
      {/* Lower Wings */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.16, -0.1, 0]} rotation={[0, side * 0.25, 0]} castShadow>
          <boxGeometry args={[0.26, 0.22, 0.01]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.3} metalness={0.2} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 20. BEE 🐝
// ---------------------------------------------------------------------------
function BeeModel({ color = "#facc15" }: { color?: string }) {
  return (
    <group position={[0, 0.4, 0]}>
      {/* Fuzzy Striped Bee Body */}
      <mesh castShadow receiveShadow>
        <capsuleGeometry args={[0.16, 0.28, 6, 14]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Black Stripes */}
      {[-0.06, 0.06].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[0.165, 0.165, 0.045, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
      ))}
      {/* Black Stinger */}
      <mesh position={[0, -0.22, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.04, 0.1, 8]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Translucent Wings */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.16, 0.12, 0.08]} rotation={[-0.4, 0, side * 0.4]}>
          <boxGeometry args={[0.22, 0.14, 0.01]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} transparent opacity={0.7} />
        </mesh>
      ))}

      {/* Big Cute Bee Eyes */}
      {[-0.08, 0.08].map((x) => (
        <mesh key={x} position={[x, 0.16, 0.12]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      ))}
    </group>
  );
}
