
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, useGLTF } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { Box3, CatmullRomCurve3, Quaternion, Vector3 } from "three";
import { useMemo, useRef } from "react";


type EquipmentId =
  | "feed-system"
  | "separation-unit"
  | "heat-exchanger"
  | "process-pumps"
  | "storage-tanks"
  | "wellhead-inlet"
  | "gas-treatment"
  | "compressor"
  | "power-generation"
  | "electrical-output";

type EquipmentDefinition = {
  id: EquipmentId;
  name: string;
  shape:
    | "feed"
    | "separator"
    | "exchanger"
    | "pump"
    | "tank"
    | "wellhead"
    | "treatment"
    | "compressor"
    | "generator"
    | "electrical";
};




const refiningEquipment: EquipmentDefinition[] = [
  { id: "feed-system", name: "Feed System", shape: "feed" },
  { id: "separation-unit", name: "Separation Unit", shape: "separator" },
  { id: "heat-exchanger", name: "Heat Exchanger", shape: "exchanger" },
  { id: "process-pumps", name: "Process Pumps", shape: "pump" },
  { id: "storage-tanks", name: "Storage Tanks", shape: "tank" },
];

const gasEquipment: EquipmentDefinition[] = [
  { id: "wellhead-inlet", name: "Wellhead Inlet", shape: "wellhead" },
  { id: "gas-treatment", name: "Gas Treatment", shape: "treatment" },
  { id: "compressor", name: "Compressor", shape: "compressor" },
  { id: "power-generation", name: "Power Generation", shape: "generator" },
  { id: "electrical-output", name: "Electrical Output", shape: "electrical" },
];


type FacilityScene3DProps = {
  scene: "refining" | "gas";
  equipmentNames: string[];
  selectedEquipment: string;
  onSelectEquipment: (name: string) => void;
  mode: string;
};


const refiningPositions: [number, number, number][] = [
  [-4.5, 0, -2.5],  // Feed System
  [0, 0, -2.5],     // Separation Unit
  [4.5, 0, -2.5],   // Heat Exchanger

  [-2.3, 0, 2.5],   // Process Pumps
  [2.3, 0, 2.5],    // Storage Tanks
];


const gasPositions: [number, number, number][] = [
  [-6, 0, -2.5],  // Wellhead Inlet
  [-3, 0, 2.5],   // Gas Treatment
  [0, 0, -2.5],   // Compressor
  [3, 0, 2.5],    // Power Generation
  [6, 0, -2.5],   // Electrical Output
];

function Pipe({
  start,
  end,
  color = "#71869a",
}: {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
}) {
  const startVector = new Vector3(...start);
  const endVector = new Vector3(...end);
  const direction = endVector.clone().sub(startVector);
  const midpoint = startVector.clone().add(endVector).multiplyScalar(0.5);

  const quaternion = new Quaternion().setFromUnitVectors(
    new Vector3(0, 1, 0),
    direction.clone().normalize()
  );

  return (
    <mesh
      position={[midpoint.x, midpoint.y, midpoint.z]}
      quaternion={quaternion}
    >
      <cylinderGeometry args={[0.055, 0.055, direction.length(), 10]} />
      <meshStandardMaterial
        color={color}
        metalness={0.65}
        roughness={0.3}
      />
    </mesh>
  );
}

function PipeFlange({
  position,
  color = "#c4cdd5",
  vertical = false,
  radius = 0.20,
}: {
  position: [number, number, number];
  color?: string;
  vertical?: boolean;
  radius?: number;
}) {
  return (
    <group
  position={position}
  rotation={vertical ? [0, 0, Math.PI / 2] : [0, 0, 0]}
>


{/* Four flange bolts */}
{[0, 1, 2, 3].map((i) => {
  const angle = (i * Math.PI) / 2;
const y = Math.cos(angle) * radius * 0.775;
const z = Math.sin(angle) * radius * 0.775;

  return (
    <mesh
      key={`bolt-${i}`}
      position={[0, y, z]}
      rotation={[0, 0, Math.PI / 2]}
      castShadow
    >
      <cylinderGeometry args={[0.023, 0.023, 0.13, 6]} />
      <meshStandardMaterial
        color="#e2e8f0"
        metalness={0.85}
        roughness={0.25}
      />
    </mesh>
  );
})}


      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[radius, radius, 0.09, 24]} />
        <meshStandardMaterial
          color={color}
          metalness={0.85}
          roughness={0.25}
        />
      </mesh>
    </group>
  );
}


function PipeFlowIndicator({
  z = 0,
  color = "#a5f3fc",
  reverse = false,
   speed = 0.65,
}: {
  z?: number;
  color?: string;
  reverse?: boolean;
   speed?: number;
}) {
  const groupRef = useRef<import("three").Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    const elapsed = state.clock.getElapsedTime();
    const travel = (elapsed * speed) % 10;

    groupRef.current.children.forEach((child, index) => {
      const offset = (travel + index * 2) % 10;
      child.position.x = reverse ? 5 - offset : -5 + offset;
    });
  });

  return (
    <group ref={groupRef}>
      {[0, 1, 2, 3, 4].map((index) => (
        <mesh key={index} position={[-5 + index * 2, 1.13, z]}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1.5}
          />
        </mesh>
      ))}
    </group>
  );
}


function GasFlowIndicator({
  start,
  end,
  speed = 0.65,
  color = "#67e8f9",
}: {
  start: [number, number, number];
  end: [number, number, number];
  speed?: number;
  color?: string;
}) {
  const groupRef = useRef<import("three").Group>(null);

  const startPoint = useMemo(
    () => new Vector3(...start),
    [start[0], start[1], start[2]]
  );

  const endPoint = useMemo(
    () => new Vector3(...end),
    [end[0], end[1], end[2]]
  );

  useFrame((state) => {
    if (!groupRef.current) return;

    const elapsed = state.clock.getElapsedTime();
    const distance = startPoint.distanceTo(endPoint);

    if (distance === 0) return;

    groupRef.current.children.forEach((child, index) => {
      const progress = ((elapsed * speed + index * 1.1) % distance) / distance;

      child.position.copy(startPoint).lerp(endPoint, progress);
    });
  });

  return (
    <group ref={groupRef}>
      {[0, 1, 2, 3].map((index) => (
        <mesh key={index}>
          <sphereGeometry args={[0.065, 12, 12]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}


function PipeValve({
  position,
  color = "#a8bac8",
}: {
  position: [number, number, number];
  color?: string;
}) {
  return (
    <group position={position}>
      {/* Valve body */}
      <mesh castShadow>
        <sphereGeometry args={[0.13, 16, 12]} />
        <meshStandardMaterial
          color={color}
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Valve bonnet */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.085, 0.105, 0.16, 16]} />
        <meshStandardMaterial
          color="#7f93a6"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Valve stem */}
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.16, 12]} />
        <meshStandardMaterial
          color="#d5e1e8"
          metalness={0.85}
          roughness={0.2}
        />
      </mesh>

      {/* Handwheel */}
      <mesh position={[0, 0.38, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.16, 0.018, 8, 32]} />
        <meshStandardMaterial
          color="#ef4444"
          metalness={0.65}
          roughness={0.3}
        />
      </mesh>

      {/* Handwheel spokes */}
      {[0, Math.PI / 2].map((angle) => (
        <mesh
          key={angle}
          position={[0, 0.38, 0]}
          rotation={[0, angle, 0]}
        >
          <boxGeometry args={[0.32, 0.018, 0.018]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      ))}
    </group>
  );
}

function PipeElbow({
  position,
  color = "#d5e1e8",
  reverse = false,
  axis = "z",
  terminal = false,
}: {
  position: [number, number, number];
  color?: string;
  reverse?: boolean;
  axis?: "x" | "z";
  terminal?: boolean;
}) {

  const points = Array.from({ length: 17 }, (_, i) => {
    const angle = (i / 16) * (Math.PI / 2);

const horizontal = (reverse ? -1 : 1) * 0.18 * Math.sin(angle);

return new Vector3(
  axis === "x"
    ? (terminal ? -horizontal : horizontal)
    : 0,
  terminal
    ? -0.18 + 0.18 * Math.cos(angle)
    : -0.18 * Math.cos(angle),
  axis === "z" ? horizontal : 0
);

  });

  const curve = new CatmullRomCurve3(points);

  return (
    <mesh position={position} castShadow>
      <tubeGeometry args={[curve, 24, 0.055, 12, false]} />
      <meshStandardMaterial
        color={color}
        metalness={0.75}
        roughness={0.28}
      />
    </mesh>
  );
}



function FeedSystemModel() {
  const { scene } = useGLTF("/models/feed-system.glb");
  const model = scene.clone();

  const bounds = new Box3().setFromObject(model);
  const size = bounds.getSize(new Vector3());
  const center = bounds.getCenter(new Vector3());

  const maxDimension = Math.max(size.x, size.y, size.z);
  const scale = maxDimension > 0 ? 2.7 / maxDimension : 1;

  return (
    <group scale={scale} position={[0, 0.24, 0]}>
      <group position={[-center.x, -bounds.min.y, -center.z]}>
        <primitive object={model} />
      </group>
    </group>
  );
}

function SeparationUnitModel() {
  const { scene } = useGLTF("/models/separation-unit.glb");

  const model = useMemo(() => scene.clone(true), [scene]);

  const { scale, offset } = useMemo(() => {
    const bounds = new Box3().setFromObject(model);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());

    const maxDimension = Math.max(size.x, size.y, size.z);
    const scale = maxDimension > 0 ? 2.7 / maxDimension : 1;

    return {
      scale,
      offset: [-center.x, -bounds.min.y, -center.z] as [
        number,
        number,
        number
      ],
    };
  }, [model]);

  return (
    <group position={[0, 0.24, 0]} scale={scale}>
      <group position={offset}>
        <primitive object={model} />
      </group>
    </group>
  );
}

function HeatExchangerModel() {
  const { scene } = useGLTF("/models/heat-exchanger.glb");

  const model = useMemo(() => scene.clone(true), [scene]);

  const { scale, offset } = useMemo(() => {
    const bounds = new Box3().setFromObject(model);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());

    const maxDimension = Math.max(size.x, size.y, size.z);
    const scale = maxDimension > 0 ? 2.7 / maxDimension : 1;

    return {
      scale,
      offset: [
        -center.x,
        -bounds.min.y,
        -center.z,
      ] as [number, number, number],
    };
  }, [model]);

  return (
    <group position={[0, 0.24, 0]} scale={scale}>
      <group position={offset}>
        <primitive object={model} />
      </group>
    </group>
  );
}


function ProcessPumpsModel() {
  const { scene } = useGLTF("/models/process-pumps.glb");

  const model = useMemo(() => scene.clone(true), [scene]);

  const { scale, offset } = useMemo(() => {
    const bounds = new Box3().setFromObject(model);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());

    const maxDimension = Math.max(size.x, size.y, size.z);
    const scale = maxDimension > 0 ? 2.7 / maxDimension : 1;

    return {
      scale,
      offset: [
        -center.x,
        -bounds.min.y,
        -center.z,
      ] as [number, number, number],
    };
  }, [model]);

  return (
    <group position={[0, 0.24, 0]} scale={scale}>
      <group position={offset}>
        <primitive object={model} />
      </group>
    </group>
  );
}


function StorageTanksModel() {
  const { scene } = useGLTF("/models/storage-tanks.glb");

  const model = useMemo(() => scene.clone(true), [scene]);

  const { scale, offset } = useMemo(() => {
    const bounds = new Box3().setFromObject(model);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());

    const maxDimension = Math.max(size.x, size.y, size.z);
    const scale = maxDimension > 0 ? 2.7 / maxDimension : 1;

    return {
      scale,
      offset: [
        -center.x,
        -bounds.min.y,
        -center.z,
      ] as [number, number, number],
    };
  }, [model]);

  return (
    <group position={[0, 0.24, 0]} scale={scale}>
      <group position={offset}>
        <primitive object={model} />
      </group>
    </group>
  );
}

function WellheadInletModel() {
  const { scene } = useGLTF("/models/wellhead-inlet.glb");

  const model = useMemo(() => scene.clone(true), [scene]);

  const { scale, offset } = useMemo(() => {
    const bounds = new Box3().setFromObject(model);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());

    const maxDimension = Math.max(size.x, size.y, size.z);
    const scale = maxDimension > 0 ? 2.7 / maxDimension : 1;

    return {
      scale,
      offset: [
        -center.x,
        -bounds.min.y,
        -center.z,
      ] as [number, number, number],
    };
  }, [model]);

  return (
    <group position={[0, 0.24, 0]} scale={scale}>
      <group position={offset}>
        <primitive object={model} />
      </group>
    </group>
  );
}

function GasTreatmentModel() {
  const { scene } = useGLTF("/models/gas-treatment.glb");

  const model = useMemo(() => scene.clone(true), [scene]);

  const { scale, offset } = useMemo(() => {
    const bounds = new Box3().setFromObject(model);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());

    const maxDimension = Math.max(size.x, size.y, size.z);
    const scale = maxDimension > 0 ? 2.7 / maxDimension : 1;

    return {
      scale,
      offset: [
        -center.x,
        -bounds.min.y,
        -center.z,
      ] as [number, number, number],
    };
  }, [model]);

  return (
    <group position={[0, 0.24, 0]} scale={scale}>
      <group position={offset}>
        <primitive object={model} />
      </group>
    </group>
  );
}

function GasCompressorModel() {
  const { scene } = useGLTF("/models/gas-compressor.glb");

  const model = useMemo(() => scene.clone(true), [scene]);

  const { scale, offset } = useMemo(() => {
    const bounds = new Box3().setFromObject(model);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());

    const maxDimension = Math.max(size.x, size.y, size.z);
    const scale = maxDimension > 0 ? 2.7 / maxDimension : 1;

    return {
      scale,
      offset: [
        -center.x,
        -bounds.min.y,
        -center.z,
      ] as [number, number, number],
    };
  }, [model]);

  return (
    <group position={[0, 0.24, 0]} scale={scale}>
      <group position={offset}>
        <primitive object={model} />
      </group>
    </group>
  );
}

function PowerGenerationModel() {
  const { scene } = useGLTF("/models/power-generation.glb");

  const model = useMemo(() => scene.clone(true), [scene]);

  const { scale, offset } = useMemo(() => {
    const bounds = new Box3().setFromObject(model);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());

    const maxDimension = Math.max(size.x, size.y, size.z);
    const scale = maxDimension > 0 ? 2.7 / maxDimension : 1;

    return {
      scale,
      offset: [
        -center.x,
        -bounds.min.y,
        -center.z,
      ] as [number, number, number],
    };
  }, [model]);

  return (
    <group position={[0, 0.24, 0]} scale={scale}>
      <group position={offset}>
        <primitive object={model} />
      </group>
    </group>
  );
}

function ElectricalOutputModel() {
  const { scene } = useGLTF("/models/electrical-output.glb");

  const model = useMemo(() => scene.clone(true), [scene]);

  const { scale, offset } = useMemo(() => {
    const bounds = new Box3().setFromObject(model);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());

    const maxDimension = Math.max(size.x, size.y, size.z);
    const scale = maxDimension > 0 ? 2.7 / maxDimension : 1;

    return {
      scale,
      offset: [
        -center.x,
        -bounds.min.y,
        -center.z,
      ] as [number, number, number],
    };
  }, [model]);

  return (
    <group position={[0, 0.24, 0]} scale={scale}>
      <group position={offset}>
        <primitive object={model} />
      </group>
    </group>
  );
}



function StatusIndicator({
  color,
  isFault,
  isDegraded,
}: {
  color: string;
  isFault: boolean;
  isDegraded: boolean;
}) {
  const meshRef = useRef<import("three").Mesh>(null);

  const warning = isFault || isDegraded;

  const radius = isFault ? 0.20 : isDegraded ? 0.17 : 0.12;

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    if (!warning) {
      mesh.scale.setScalar(1);
      return;
    }

    const elapsed = state.clock.getElapsedTime();
    const frequency = isFault ? 4 : 2.5;

    // Pulsing effect for warning and fault states
    const pulse = (Math.sin(elapsed * frequency * Math.PI * 2) + 1) / 2;

    mesh.scale.setScalar(0.92 + pulse * 0.18);

    const material = mesh.material as import("three").MeshStandardMaterial;
    material.emissiveIntensity = 0.35 + pulse * 3.0;
  });

  return (
    <mesh ref={meshRef} position={[0, 3.15, 0]}>
      <sphereGeometry args={[radius, 20, 20]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={warning ? 1.5 : 0.6}
        toneMapped={false}
      />
    </mesh>
  );
}


function Equipment({
  name,
  index,
  position,
  shape,
  selected,
  mode,
  onSelect,
}: {
  name: string;
  index: number;
  position: [number, number, number];
  shape: EquipmentDefinition["shape"];
  selected: boolean;
  mode: string;
  onSelect: () => void;
}) {

  const currentMode = mode.toLowerCase();

const isFault = currentMode === "abnormal" && index === 2;
const isDegraded =
  (currentMode === "abnormal" || currentMode === "degraded") &&
  index === 1;

  const statusColor = isFault
    ? "#ef4444"
    : isDegraded
      ? "#f59e0b"
      : "#3b82f6";

  const metal = "#8296a9";
  const dark = "#34495e";
  const accent = statusColor;

  function handleClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    onSelect();
  }

  return (
    <group
      position={position}
      onClick={handleClick}
    >
      {/* Base platform */}
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.24, 1.45]} />
        <meshStandardMaterial color={selected ? "#284b70" : "#243447"} />
      </mesh>


      {/* Equipment models: ten distinct placeholder shapes */}



{/* Refining Equipment */}
<group scale={1.35}>
  {shape === "feed" && <FeedSystemModel />}
  {shape === "separator" && <SeparationUnitModel />}
  {shape === "exchanger" && <HeatExchangerModel />}
  {shape === "pump" && <ProcessPumpsModel />}
  {shape === "tank" && <StorageTanksModel />}
</group>

{/* Wellhead Gas Equipment */}
<group scale={1.5}>
  {shape === "wellhead" && <WellheadInletModel />}
  {shape === "treatment" && <GasTreatmentModel />}
  {shape === "compressor" && <GasCompressorModel />}
  {shape === "generator" && <PowerGenerationModel />}
  {shape === "electrical" && <ElectricalOutputModel />}
</group>


{/* Status light */}
<group position={[0, shape === "wellhead" ||
                       shape === "treatment" ||
                       shape === "compressor" ||
                       shape === "generator" ||
                       shape === "electrical" ? 0.4 : 0, 0]}>
  <StatusIndicator
    color={accent}
    isFault={isFault}
    isDegraded={isDegraded}
  />
</group>

{/* Name label */}
<Text
position={[
  0,
  ["wellhead", "treatment", "compressor", "generator", "electrical"].includes(shape)
    ? 3.85
    : 3.45,
  0,
]}
  fontSize={0.22}
  color="#f1f5f9"
  anchorX="center"
  anchorY="middle"
  outlineWidth={0.008}
  outlineColor="#0b1421"
  onClick={(event) => {
    event.stopPropagation();
    onSelect();
  }}
>
  {name || `Equipment ${index + 1}`}
</Text>


    </group>
  );
}




function Scene({
  scene,
  selectedEquipment,
  onSelectEquipment,
  mode,
}: FacilityScene3DProps) {
  const equipmentConfig = scene === "gas" ? gasEquipment : refiningEquipment;
  const positions = scene === "gas" ? gasPositions : refiningPositions;
const flowSpeed =
  mode.toLowerCase() === "abnormal"
    ? 0.15
    : mode.toLowerCase() === "degraded"
      ? 0.35
      : 0.65;

  return (

    <>
      <color attach="background" args={["#0b1421"]} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[4, 9, 6]} intensity={2.2} castShadow />
      <pointLight position={[-4, 4, -3]} intensity={0.8} color="#60a5fa" />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]} receiveShadow>
        <planeGeometry args={[22, 12]} />
        <meshStandardMaterial color="#101e2b" roughness={0.85} />
      </mesh>

      {/* Floor grid */}
      <gridHelper args={[20, 40, "#34495e", "#1d3042"]} position={[0, 0, 0]} />




{/* Gas process and electrical connections */}

{scene === "gas" && (
  <group>
    {gasPositions.slice(0, -1).map((position, index) => {
      const next = gasPositions[index + 1];

      const startX = position[0] + 1.15;
      const endX = next[0] - 1.15;

      const startZ = position[2];
      const endZ = next[2];

      const middleX = (startX + endX) / 2;

      const color =
        index === 2
          ? "#d3a34b"
          : index === 3
            ? "#60a5fa"
            : "#d5e1e8";

 

return (
  <group key={`gas-connection-${index}`}>
    {index === 3 ? (
      <>
        {/* Electrical cable tray: three connected sections */}
        {[
          {
            x: (startX + middleX) / 2,
            z: startZ,
            length: Math.abs(middleX - startX),
            alongZ: false,
          },
          {
            x: middleX,
            z: (startZ + endZ) / 2,
            length: Math.abs(endZ - startZ),
            alongZ: true,
          },
          {
            x: (middleX + endX) / 2,
            z: endZ,
            length: Math.abs(endX - middleX),
            alongZ: false,
          },
        ].map((section, sectionIndex) => (
          <group
            key={`cable-tray-${sectionIndex}`}
            position={[section.x, 0.72, section.z]}
            rotation={[0, section.alongZ ? 0 : Math.PI / 2, 0]}
          >
            {/* Tray bottom */}
            <mesh castShadow>
              <boxGeometry args={[0.36, 0.035, section.length]} />
              <meshStandardMaterial color="#8296a9" metalness={0.8} roughness={0.3} />
            </mesh>

            {/* Side rails */}
            {[-0.17, 0.17].map((x) => (
              <mesh key={`rail-${x}`} position={[x, 0.10, 0]} castShadow>
                <boxGeometry args={[0.025, 0.20, section.length]} />
                <meshStandardMaterial color="#b5c4ce" metalness={0.8} roughness={0.3} />
              </mesh>
            ))}

            {/* Three electrical cables */}
            {[-0.10, 0, 0.10].map((x) => (
              <mesh key={`cable-${x}`} position={[x, 0.052, 0]}>
                <boxGeometry args={[0.045, 0.045, section.length]} />
                <meshStandardMaterial color="#2563eb" roughness={0.55} />
              </mesh>
            ))}
          </group>
        ))}

{/* Animated electrical power transmission */}
<GasFlowIndicator
  start={[startX, 0.84, startZ]}
  end={[middleX, 0.84, startZ]}
  speed={flowSpeed}
  color="#38bdf8"
/>

<GasFlowIndicator
  start={[middleX, 0.84, startZ]}
  end={[middleX, 0.84, endZ]}
  speed={flowSpeed}
  color="#38bdf8"
/>

<GasFlowIndicator
  start={[middleX, 0.84, endZ]}
  end={[endX, 0.84, endZ]}
  speed={flowSpeed}
  color="#38bdf8"
/>


        {/* Cable tray joint plate */}
        <mesh
          position={[middleX, 0.72, (startZ + endZ) / 2]}
          castShadow
        >
          <boxGeometry args={[0.42, 0.055, 0.18]} />
          <meshStandardMaterial color="#60a5fa" metalness={0.65} roughness={0.3} />
        </mesh>

        {/* Two electrical cable tray supports */}
        {[0.30, 0.70].map((ratio, supportIndex) => (
          <group
            key={`electrical-support-${supportIndex}`}
            position={[
              middleX,
              0,
              startZ + (endZ - startZ) * ratio,
            ]}
          >
            <mesh position={[0, 0.06, 0]} castShadow>
              <boxGeometry args={[0.46, 0.12, 0.46]} />
              <meshStandardMaterial color="#596775" roughness={0.8} />
            </mesh>

            <mesh position={[0, 0.36, 0]} castShadow>
              <boxGeometry args={[0.12, 0.48, 0.12]} />
              <meshStandardMaterial color="#71869a" metalness={0.8} roughness={0.3} />
            </mesh>

            <mesh position={[0, 0.625, 0]} castShadow>
              <boxGeometry args={[0.48, 0.05, 0.28]} />
              <meshStandardMaterial color="#c5d0d8" metalness={0.8} roughness={0.25} />
            </mesh>
          </group>
        ))}
      </>
    ) : (
      <>
        {/* Gas process pipelines */}
        <Pipe
          start={[startX, 0.65, startZ]}
          end={[middleX, 0.65, startZ]}
          color={color}
        />
        <Pipe
          start={[middleX, 0.65, startZ]}
          end={[middleX, 0.65, endZ]}
          color={color}
        />
        <Pipe
          start={[middleX, 0.65, endZ]}
          end={[endX, 0.65, endZ]}
          color={color}
        />

{/* Animated gas flow - first pipeline only */}
{index < 3 && (
  <>
    <GasFlowIndicator
      start={[startX, 0.74, startZ]}
      end={[middleX, 0.74, startZ]}
      speed={flowSpeed}
    />

    <GasFlowIndicator
      start={[middleX, 0.74, startZ]}
      end={[middleX, 0.74, endZ]}
      speed={flowSpeed}
    />

    <GasFlowIndicator
      start={[middleX, 0.74, endZ]}
      end={[endX, 0.74, endZ]}
      speed={flowSpeed}
    />
  </>
)}

        {/* Gas pipeline elbows */}
        {[startZ, endZ].map((z, elbowIndex) => (
          <mesh
            key={`gas-elbow-${elbowIndex}`}
            position={[middleX, 0.65, z]}
            castShadow
          >
            <sphereGeometry args={[0.085, 16, 12]} />
            <meshStandardMaterial
              color={color}
              metalness={0.8}
              roughness={0.28}
            />
          </mesh>
        ))}

        {/* One flange at the center */}
        <group
          position={[middleX, 0.65, (startZ + endZ) / 2]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <PipeFlange
            position={[0, 0, 0]}
            color={color}
            radius={0.32}
          />
        </group>

        {/* Two gas pipeline supports */}
        {[0.30, 0.70].map((ratio, supportIndex) => (
          <group
            key={`pipe-support-${index}-${supportIndex}`}
            position={[
              middleX,
              0,
              startZ + (endZ - startZ) * ratio,
            ]}
          >
            {/* Concrete foundation */}
            <mesh position={[0, 0.06, 0]} castShadow>
              <boxGeometry args={[0.42, 0.12, 0.42]} />
              <meshStandardMaterial
                color="#596775"
                metalness={0.15}
                roughness={0.8}
              />
            </mesh>

            {/* Steel base plate */}
            <mesh position={[0, 0.135, 0]} castShadow>
              <boxGeometry args={[0.32, 0.03, 0.32]} />
              <meshStandardMaterial
                color="#9caebd"
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>

            {/* Vertical support column */}
            <mesh position={[0, 0.36, 0]} castShadow>
              <boxGeometry args={[0.12, 0.42, 0.12]} />
              <meshStandardMaterial
                color="#71869a"
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>

            {/* Pipe support saddle */}
            <mesh position={[0, 0.595, 0]} castShadow>
              <boxGeometry args={[0.26, 0.05, 0.24]} />
              <meshStandardMaterial
                color="#c5d0d8"
                metalness={0.8}
                roughness={0.25}
              />
            </mesh>
          </group>
        ))}
      </>
    )}
  </group>
);


    })}
  </group>
)}

{scene === "refining" && (
  <group>


    {/* Central pipe rack structural supports */}
    {[-5, -3.0, 0.7, 3.0, 5].map((x) => (
      <group key={`rack-support-${x}`}>
        {/* Vertical support columns */}
        <mesh position={[x, 0.43, -0.42]} castShadow>
          <boxGeometry args={[0.12, 0.86, 0.12]} />
          <meshStandardMaterial
            color="#a8bac8"
            metalness={0.8}
            roughness={0.35}
          />
        </mesh>

        <mesh position={[x, 0.43, 0.42]} castShadow>
          <boxGeometry args={[0.12, 0.86, 0.12]} />
          <meshStandardMaterial
            color="#a8bac8"
            metalness={0.8}
            roughness={0.25}
          />
        </mesh>

        {/* Horizontal crossbeam */}
        <mesh position={[x, 0.88, 0]} castShadow>
          <boxGeometry args={[0.16, 0.12, 1.05]} />
          <meshStandardMaterial
            color="#c5d0d8"
            metalness={0.8}
            roughness={0.25}
          />
        </mesh>

        {/* Base plates */}
        {[-0.42, 0.42].map((z) => (
          <mesh key={z} position={[x, 0.035, z]}>
            <boxGeometry args={[0.24, 0.07, 0.24]} />
            <meshStandardMaterial
              color="#d0d9df"
              metalness={0.85}
              roughness={0.3}
            />
          </mesh>
        ))}
      </group>
    ))}


    {/* Central process pipe rack */}

{/* Animated flow on silver pipeline */}
<PipeFlowIndicator
  speed={flowSpeed}
/>

{/* Animated flow on yellow pipeline */}
<PipeFlowIndicator
  z={0.28}
  color="#fbbf24"
  reverse
  speed={flowSpeed}
/>


{/* Animated flow on blue pipeline */}
<PipeFlowIndicator
  z={-0.28}
  color="#60a5fa"
  reverse
  speed={flowSpeed}
/>


    <Pipe start={[-5.62, 1.03, 0]} end={[5.62, 1.03, 0]} color="#d5e1e8" />

{/* Main silver pipeline valve */}
<PipeValve
  position={[-3.2, 1.03, 0]}
/>

{/* Yellow pipeline valve */}
<PipeValve
  position={[1.2, 1.03, 0.28]}
  color="#d3a34b"
/>

{/* Blue pipeline valve */}
<PipeValve
  position={[3.8, 1.03, -0.28]}
  color="#60a5fa"
/>

{/* Flanges on main silver pipeline */}
{[-4, -1.5, 1.5, 4].map((x) => (
  <PipeFlange
    key={`main-flange-${x}`}
    position={[x, 1.03, 0]}
  />
))}


{/* Flanges on yellow pipeline */}
{[-3.4, -0.9, 2.1, 4.6].map((x) => (
  <PipeFlange
    key={`yellow-flange-${x}`}
    position={[x, 1.03, 0.28]}
    color="#d3a34b"
  />
))}

{/* Flanges on blue pipeline */}
{[-4.6, -2.1, 0.9, 3.4].map((x) => (
  <PipeFlange
    key={`blue-flange-${x}`}
    position={[x, 1.03, -0.28]}
    color="#60a5fa"
  />
))}

{/* Secondary parallel process pipeline */}
<Pipe
  start={[-5.62, 1.03, 0.28]}
  end={[5.62, 1.03, 0.28]}
  color="#d3a34b"
/>

{/* Third parallel process pipeline */}
<Pipe
  start={[-5.62, 1.03, -0.28]}
  end={[5.62, 1.03, -0.28]}
  color="#60a5fa"
/>


{/* Pipe rack terminal downcomers */}
{[
  { z: 0, color: "#d5e1e8" },
  { z: 0.28, color: "#d3a34b" },
  { z: -0.28, color: "#60a5fa" },
].map(({ z, color }) => (
  <group key={`terminal-${z}`}>

{/* Left vertical downcomer */}
<Pipe
  start={[-5.8, 0.85, z]}
  end={[-5.8, 0.25, z]}
  color={color}
/>


{/* Left 90-degree elbow */}
<PipeElbow
  position={[-5.62, 1.03, z]}
  color={color}
  axis="x"
  terminal
/>

{/* Right 90-degree elbow */}
<PipeElbow
  position={[5.62, 1.03, z]}
  color={color}
  axis="x"
  reverse
  terminal
/>

{/* Right vertical downcomer */}
<Pipe
  start={[5.8, 0.85, z]}
  end={[5.8, 0.25, z]}
  color={color}
/>


{/* Terminal connection flanges */}
<PipeFlange
  position={[-5.8, 0.25, z]}
  color={color}
  vertical
  radius={0.13}
/>

<PipeFlange
  position={[5.8, 0.25, z]}
  color={color}
  vertical
  radius={0.13}
/>

  </group>
))}






{/* Feed System: horizontal pipe */}
<Pipe
  start={[-4.5, 0.65, -1.8]}
  end={[-4.5, 0.65, -0.18]}
  color="#d5e1e8"
/>

{/* Feed System: 90-degree elbow */}
<PipeElbow
  position={[-4.5, 0.83, -0.18]}
  color="#d5e1e8"
/>

{/* Feed System: vertical riser */}
<Pipe
  start={[-4.5, 0.83, 0]}
  end={[-4.5, 1.03, 0]}
  color="#d5e1e8"
/>


{/* Separation Unit connection */}

{/* Separation Unit: horizontal pipe */}
<Pipe
  start={[0, 0.65, -1.8]}
  end={[0, 0.65, -0.18]}
  color="#d5e1e8"
/>

{/* Separation Unit: 90-degree elbow */}
<PipeElbow
  position={[0, 0.83, -0.18]}
  color="#d5e1e8"
/>

{/* Separation Unit: vertical riser */}
<Pipe
  start={[0, 0.83, 0]}
  end={[0, 1.03, 0]}
  color="#d5e1e8"
/>


{/* Heat Exchanger connects to yellow pipeline */}

{/* Heat Exchanger: horizontal pipe */}
<Pipe
  start={[4.5, 0.65, -1.8]}
  end={[4.5, 0.65, 0.10]}
  color="#d3a34b"
/>

{/* Heat Exchanger: 90-degree elbow */}
<PipeElbow
  position={[4.5, 0.83, 0.10]}
  color="#d3a34b"
/>

{/* Heat Exchanger: vertical riser */}
<Pipe
  start={[4.5, 0.83, 0.28]}
  end={[4.5, 1.03, 0.28]}
  color="#d3a34b"
/>


{/* Process Pumps connects to blue pipeline */}

{/* Process Pumps: horizontal pipe */}
<Pipe
  start={[-2.3, 0.65, 1.8]}
  end={[-2.3, 0.65, -0.10]}
  color="#60a5fa"
/>

{/* Process Pumps: reverse 90-degree elbow */}
<PipeElbow
  position={[-2.3, 0.83, -0.10]}
  color="#60a5fa"
  reverse
/>

{/* Process Pumps: vertical riser */}
<Pipe
  start={[-2.3, 0.83, -0.28]}
  end={[-2.3, 1.03, -0.28]}
  color="#60a5fa"
/>



{/* Storage Tanks connects to yellow pipeline */}

{/* Storage Tanks: horizontal pipe */}
<Pipe
  start={[2.3, 0.65, 1.8]}
  end={[2.3, 0.65, 0.46]}
  color="#d3a34b"
/>

{/* Storage Tanks: reverse 90-degree elbow */}
<PipeElbow
  position={[2.3, 0.83, 0.46]}
  color="#d3a34b"
  reverse
/>

{/* Storage Tanks: vertical riser */}
<Pipe
  start={[2.3, 0.83, 0.28]}
  end={[2.3, 1.03, 0.28]}
  color="#d3a34b"
/>


  </group>
)}


      {equipmentConfig.map((item, index) => (
        <Equipment
          key={item.id}
          name={item.name}
          index={index}
          position={positions[index]}
          shape={item.shape}
          selected={selectedEquipment === item.name}
          mode={mode}
          onSelect={() => onSelectEquipment(item.name)}
        />
      ))}

<OrbitControls
  makeDefault
  enableDamping
  minDistance={7}
  maxDistance={scene === "gas" ? 30 : 19}
  maxPolarAngle={Math.PI / 2.05}
  target={[0, 0.7, 0]}
/>

    </>
  );
}

export default function FacilityScene3D(props: FacilityScene3DProps) {
  return (
    <div style={{ width: "100%", height: "440px", overflow: "hidden", borderRadius: 12 }}>

<Canvas
  camera={{
    position:
      props.scene === "gas"
        ? [8, 11, 19]
        : [4.55, 5.64, 8.17],
    fov: 45,
  }}
  shadows
  dpr={[1, 1.5]}
>

        <Scene {...props} />
      </Canvas>
    </div>
  );
}
