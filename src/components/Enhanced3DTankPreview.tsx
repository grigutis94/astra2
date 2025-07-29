import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { TankFormData } from '../types/tankTypes';

interface Enhanced3DTankPreviewProps {
  formData: TankFormData;
  transparency?: number;
}

// Accessory types
type AccessoryType = 'supportLegs' | 'thermalInsulation' | 'cipSystem' | 'pressureRelief' | 'levelIndicators' | 'hatchesAndDrains' | 'flanges' | 'agitators' | 'ladders' | 'sensors';

interface AccessoryPosition {
  id: string;
  type: AccessoryType;
  position: [number, number, number];
  rotation: [number, number, number];
}

// Paprastas Draggable 3D Accessory komponentas (nukopijuotas iš Tank3DPreview.tsx)
const DraggableAccessory = ({ accessory, onPositionChange, onDragStateChange, tankInfo, accessorySize }: {
  accessory: AccessoryPosition;
  onPositionChange: (id: string, position: [number, number, number]) => void;
  onDragStateChange: (isDragging: boolean) => void;
  tankInfo: { type: string; radius: number; height: number };
  accessorySize?: 'small' | 'normal' | 'large' | 'extra-large';
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastPositionRef = useRef<[number, number, number]>(accessory.position);

  // Create 3D geometry for each accessory type with size scaling
  const createAccessoryGeometry = (type: AccessoryType) => {
    // Get size multiplier
    const getSizeMultiplier = (size?: 'small' | 'normal' | 'large' | 'extra-large') => {
      switch (size) {
        case 'small': return 0.8;
        case 'large': return 1.2;
        case 'extra-large': return 1.5;
        case 'normal':
        default: return 1.0;
      }
    };
    
    const scale = getSizeMultiplier(accessorySize);
    
    switch (type) {
      case 'supportLegs':
        return <cylinderGeometry args={[0.15 * scale, 0.15 * scale, 1.5 * scale, 8]} />;
      case 'thermalInsulation':
        return <boxGeometry args={[1.0 * scale, 2.0 * scale, 1.0 * scale]} />;
      case 'cipSystem':
        return <sphereGeometry args={[0.5 * scale, 16, 16]} />;
      case 'pressureRelief':
        return <coneGeometry args={[0.3 * scale, 0.8 * scale, 8]} />;
      case 'levelIndicators':
        return <boxGeometry args={[0.3 * scale, 1.2 * scale, 0.3 * scale]} />;
      case 'hatchesAndDrains':
        return <cylinderGeometry args={[0.6 * scale, 0.6 * scale, 0.3 * scale, 16]} />;
      case 'flanges':
        return <cylinderGeometry args={[0.5 * scale, 0.5 * scale, 0.2 * scale, 16]} />;
      case 'agitators':
        return <cylinderGeometry args={[0.1 * scale, 0.1 * scale, 1.8 * scale, 16]} />;
      case 'ladders':
        return <boxGeometry args={[0.2 * scale, 2.0 * scale, 0.2 * scale]} />;
      case 'sensors':
        return <cylinderGeometry args={[0.12 * scale, 0.12 * scale, 0.5 * scale, 16]} />;
      default:
        return <boxGeometry args={[0.6 * scale, 0.6 * scale, 0.6 * scale]} />;
    }
  };

  const getAccessoryColor = (type: AccessoryType, isDragging: boolean, hovered: boolean) => {
    const baseColors = {
      supportLegs: 0x64748b,
      thermalInsulation: 0xfbbf24,
      cipSystem: 0x3b82f6,
      pressureRelief: 0xef4444,
      levelIndicators: 0x10b981,
      hatchesAndDrains: 0x8b5cf6,
      flanges: 0x0ea5e9,
      agitators: 0x06b6d4,
      ladders: 0xeab308,
      sensors: 0xf97316,
    };
    
    if (isDragging) return 0x00ff00; // Green when dragging
    if (hovered) return 0xff9500; // Orange when hovered
    return baseColors[type];
  };

  // Drag handling - GLOBALUS DRAGGING
  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    setIsDragging(true);
    onDragStateChange(true);
    document.body.style.cursor = 'grabbing';
    
    dragStartRef.current = {
      x: e.clientX || e.pointer?.x || 0,
      y: e.clientY || e.pointer?.y || 0
    };
    
    lastPositionRef.current = [...accessory.position];
  };

  // Global mouse move listener
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragStartRef.current || !meshRef.current) return;
      
      const currentX = e.clientX;
      const currentY = e.clientY;
      
      const deltaX = currentX - dragStartRef.current.x;
      const deltaY = currentY - dragStartRef.current.y;
      
      const sensitivity = 0.002; // Padidinu iš 0.0001 į 0.002 - optimalus jautrumas
      const basePosition = lastPositionRef.current;
      
      let newX = basePosition[0];
      let newY = basePosition[1];
      let newZ = basePosition[2];
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (tankInfo.type === 'cylindrical') {
          const currentAngle = Math.atan2(basePosition[2], basePosition[0]);
          const newAngle = currentAngle + deltaX * sensitivity * 2;
          const distance = Math.sqrt(basePosition[0] * basePosition[0] + basePosition[2] * basePosition[2]);
          
          newX = Math.cos(newAngle) * distance;
          newZ = Math.sin(newAngle) * distance;
        } else {
          newX = basePosition[0] + deltaX * sensitivity * 5;
          const maxX = tankInfo.radius + 0.3;
          newX = Math.max(-maxX, Math.min(maxX, newX));
        }
      } else {
        newY = basePosition[1] - deltaY * sensitivity * 5;
        newY = Math.max(-tankInfo.height, Math.min(tankInfo.height, newY));
      }
      
      const newPosition: [number, number, number] = [newX, newY, newZ];
      meshRef.current.position.set(newX, newY, newZ);
      lastPositionRef.current = newPosition;
    };

    const handleGlobalMouseUp = (_e: MouseEvent) => {
      if (!isDragging) return;
      
      setIsDragging(false);
      onDragStateChange(false);
      document.body.style.cursor = 'auto';
      
      if (meshRef.current) {
        const finalPosition: [number, number, number] = [
          meshRef.current.position.x,
          meshRef.current.position.y,
          meshRef.current.position.z
        ];
        onPositionChange(accessory.id, finalPosition);
      }
      
      dragStartRef.current = null;
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, tankInfo, accessory.id, onPositionChange, onDragStateChange]);

  useEffect(() => {
    if (meshRef.current && !isDragging) {
      meshRef.current.position.set(...accessory.position);
      lastPositionRef.current = [...accessory.position];
    }
  }, [accessory.position, isDragging]);

  return (
    <mesh
      ref={meshRef}
      position={accessory.position}
      rotation={accessory.rotation}
      onPointerDown={handlePointerDown}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        if (!isDragging) {
          document.body.style.cursor = 'grab';
        }
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        if (!isDragging) {
          document.body.style.cursor = 'auto';
        }
      }}
      castShadow
      receiveShadow
    >
      {createAccessoryGeometry(accessory.type)}
      <meshStandardMaterial 
        color={getAccessoryColor(accessory.type, isDragging, hovered)}
        metalness={0.7}
        roughness={0.3}
        transparent={isDragging}
        opacity={isDragging ? 0.7 : 1}
      />
      
      <Text
        position={[0, 1.0, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {accessory.type}
      </Text>
      
      {hovered && !isDragging && (
        <Text
          position={[0, 1.4, 0]}
          fontSize={0.15}
          color="yellow"
          anchorX="center"
          anchorY="middle"
        >
          Spausk ir vilk kad perkelti
        </Text>
      )}
      
      {isDragging && (
        <Text
          position={[0, 1.6, 0]}
          fontSize={0.18}
          color="lime"
          anchorX="center"
          anchorY="middle"
        >
          Vilkimas aktyvus
        </Text>
      )}
    </mesh>
  );
};

// Function to convert formData to accessories configuration
const convertFormDataToAccessories = (formData: TankFormData, getDefaultPosition: (type: AccessoryType, radius: number, height: number) => [number, number, number]): AccessoryPosition[] => {
  const accessories: AccessoryPosition[] = [];
  const radius = formData.tankType === 'cylindrical' 
    ? (formData.diameter || 500) / 2000
    : (formData.width || 500) / 2000;
  const height = (formData.height || 1000) / 1000;

  let accessoryIndex = 0; // Pridėjau counter unikaliam ID

  Object.entries(formData.accessories || {}).forEach(([type, isSelected]) => {
    if (isSelected) {
      // Naudojame getDefaultPosition funkciją kiekvienam priedų tipui
      const defaultPosition = getDefaultPosition(type as AccessoryType, radius, height);
      
      // Skirtingos pozicijos tam pačiam tipui, jei reikėtų kelių
      const angleOffset = accessoryIndex * 60 * (Math.PI / 180); // 60 laipsnių tarp priedų
      const adjustedPosition: [number, number, number] = [
        defaultPosition[0] * Math.cos(angleOffset) - defaultPosition[2] * Math.sin(angleOffset),
        defaultPosition[1],
        defaultPosition[0] * Math.sin(angleOffset) + defaultPosition[2] * Math.cos(angleOffset)
      ];
      
      accessories.push({
        id: `${type}-${accessoryIndex}`, // Unikalus ID su counter
        type: type as AccessoryType,
        position: adjustedPosition,
        rotation: [0, 0, 0],
      });
      
      accessoryIndex++; // Padidinami counter
    }
  });

  return accessories;
};

// Enhanced Tank Model with draggable accessories using new DraggableAccessory component
const EnhancedTankModel = ({ 
  formData, 
  transparency,
  onDragStateChange,
  getDefaultPosition
}: {
  formData: TankFormData;
  transparency: number;
  onDragStateChange: (isDragging: boolean) => void;
  getDefaultPosition: (type: AccessoryType, radius: number, height: number) => [number, number, number];
}) => {
  const tankGroupRef = useRef<THREE.Group>(null);
  const [accessoryPositions, setAccessoryPositions] = useState<{[key: string]: [number, number, number]}>({});

  useEffect(() => {
    if (!tankGroupRef.current) return;

    // Clear existing tank
    while (tankGroupRef.current.children.length > 0) {
      tankGroupRef.current.remove(tankGroupRef.current.children[0]);
    }

    // Create tank geometry
    const radius = formData.tankType === 'cylindrical' 
      ? (formData.diameter || 500) / 2000
      : (formData.width || 500) / 2000;
    const height = (formData.height || 1000) / 1000;

    const tankMaterial = new THREE.MeshStandardMaterial({
      color: formData.material === '316' ? 0x808080 : 0x909090,
      metalness: 0.8,
      roughness: 0.3,
      transparent: transparency < 1.0,
      opacity: transparency,
    });

    const tankMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, height, 32),
      tankMaterial
    );

    tankMesh.castShadow = true;
    tankMesh.receiveShadow = true;
    tankGroupRef.current.add(tankMesh);

    // Generuojame naują accessory pozicijų sąrašą pagal formData
    const accessories = convertFormDataToAccessories(formData, getDefaultPosition);
    console.log('EnhancedTankModel - Generated accessories:', accessories);
    
    // Naudojame funkcinį update kad išlaikyti egzistuojančias pozicijas
    setAccessoryPositions(prev => {
      const newPositions: {[key: string]: [number, number, number]} = {};
      
      accessories.forEach((accessory) => {
        // Išsaugome seną poziciją, jei ji egzistuoja, arba naudojame naują default poziciją
        newPositions[accessory.id] = prev[accessory.id] || accessory.position;
      });
      
      console.log('EnhancedTankModel - Previous positions:', prev);
      console.log('EnhancedTankModel - New positions:', newPositions);
      console.log('EnhancedTankModel - Number of positions:', Object.keys(newPositions).length);
      
      return newPositions;
    });
  }, [formData, transparency]); // Pašalinu getDefaultPosition iš dependencies, nes funkcija nepriklauso nuo props

  return (
    <group ref={tankGroupRef}>
      {(() => {
        console.log('EnhancedTankModel - Rendering accessories. accessoryPositions:', accessoryPositions);
        console.log('EnhancedTankModel - Number of accessories to render:', Object.keys(accessoryPositions).length);
        return Object.entries(accessoryPositions).map(([id, position]) => {
          // Ištraukiame tipą iš ID (pvz. "cipSystem-0" -> "cipSystem")
          const type = id.split('-')[0] as AccessoryType;
          
          console.log(`EnhancedTankModel - Rendering accessory: ${id}, type: ${type}, position:`, position);
          
          return (
            <DraggableAccessory
              key={id}
              accessory={{ id, type, position, rotation: [0, 0, 0] }}
              onPositionChange={(id, newPosition) =>
                setAccessoryPositions((prev) => ({ ...prev, [id]: newPosition }))
              }
              onDragStateChange={onDragStateChange}
              tankInfo={{ type: formData.tankType, radius: (formData.diameter || 500) / 2000, height: (formData.height || 1000) / 1000 }}
              accessorySize="normal"
            />
          );
        });
      })()}
    </group>
  );
};

// Main Enhanced 3D Tank Preview Component with improved OrbitControls
const Enhanced3DTankPreview: React.FC<Enhanced3DTankPreviewProps> = ({ 
  formData, 
  transparency = 1.0
}) => {
  const orbitControlsRef = useRef<any>(null);

  // Debug: log what accessories we receive
  useEffect(() => {
    console.log('Enhanced3DTankPreview received formData:', formData);
    console.log('Enhanced3DTankPreview accessories:', formData.accessories);
    
    // Debug convertFormDataToAccessories rezultatą
    const accessories = convertFormDataToAccessories(formData, getAccessoryDefaultPosition);
    console.log('Converted accessories:', accessories);
    console.log('Number of accessories:', accessories.length);
    
    accessories.forEach((acc, index) => {
      console.log(`Accessory ${index}:`, acc.id, acc.type, acc.position);
    });
  }, [formData]);

  // Handle global drag state to disable camera controls
  const handleGlobalDragState = (isDragging: boolean) => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.enabled = !isDragging;
    }
  };

  // Calculate camera position based on tank size
  const tankHeight = (formData.height || 1000) / 1000;
  const tankRadius = formData.tankType === 'cylindrical' 
    ? (formData.diameter || 500) / 2000
    : (formData.width || 500) / 2000;
  
  const maxDimension = Math.max(tankHeight, tankRadius * 2);
  const cameraDistance = Math.max(maxDimension * 2.5, 3);
  const cameraHeight = Math.max(maxDimension * 0.8, 1.5);

  // Funkcija, kuri generuoja priedo poziciją pagal tipą ir tanko matmenis
  function getAccessoryDefaultPosition(type: AccessoryType, radius: number, height: number): [number, number, number] {
    switch (type) {
      case 'supportLegs':
        // Šone tanko, ne per žemai - kad matytųsi
        return [radius + 0.8, -height / 4, 0];
      case 'thermalInsulation':
        // Šone tanko, centre - didesnis atstumas
        return [radius + 1.0, 0, 0];
      case 'cipSystem':
        // Viršuje, bet ne per aukštai
        return [0, height / 2 + 0.3, 0];
      case 'pressureRelief':
        // Šone, viršutinėje dalyje
        return [radius + 0.8, height / 3, 0];
      case 'levelIndicators':
        // Šone, centre
        return [radius + 0.9, 0, 0];
      case 'hatchesAndDrains':
        // Viršuje, centre
        return [0, height / 2 + 0.2, 0];
      case 'flanges':
        // Šone, žemiau centro
        return [radius + 0.7, -height / 4, 0];
      case 'agitators':
        // Viršuje, centre
        return [0, height / 2 + 0.4, 0];
      case 'ladders':
        // Už tanko, centre
        return [0, 0, radius + 1.0];
      case 'sensors':
        // Šone, aukščiau centro
        return [radius + 0.8, height / 6, 0];
      default:
        // Šone, centre
        return [radius + 0.8, 0, 0];
    }
  }

  return (
    <div className="h-[500px] w-full rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 relative shadow-xl border border-slate-600">
      {/* 3D Visualization Status */}
      <div className="absolute top-4 right-4 z-10 flex items-center px-3 py-2 bg-slate-800/80 backdrop-blur-md rounded-xl shadow-md border border-slate-600">
        <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse mr-2"></div>
        <span className="text-xs text-green-400 font-semibold tracking-wide">Interactive 3D</span>
      </div>

      {/* Drag instruction */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center px-3 py-2 bg-slate-100/80 backdrop-blur-md rounded-xl shadow-md border border-slate-600">
        <svg className="w-4 h-4 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
        </svg>
        <span className="text-xs text-blue-400 font-medium">Vilkite priedus norint keisti poziciją</span>
      </div>

      <Canvas shadows dpr={[1, 2]}>
        <color attach="background" args={['#1e293b']} />
        
        {/* Camera with full control */}
        <PerspectiveCamera 
          makeDefault 
          position={[cameraDistance, cameraHeight, cameraDistance]} 
          fov={35} 
        />
        
        {/* Improved OrbitControls - optimized for drag interaction */}
        <OrbitControls 
          ref={orbitControlsRef}
          enableZoom={true} 
          enablePan={true} 
          enableRotate={true}
          minDistance={maxDimension * 0.5} 
          maxDistance={maxDimension * 8} 
          target={[0, 0, 0]}
          enableDamping={true}
          dampingFactor={0.05}
          // Disable controls when dragging accessories
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN
          }}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
          }}
        />
        
        {/* Darker lighting setup */}
        <ambientLight intensity={0.4} />
        <hemisphereLight intensity={0.6} color="#ffffff" groundColor="#334155" />
        
        {/* Main directional light - reduced intensity */}
        <directionalLight
          intensity={1.2}
          position={[maxDimension * 2, maxDimension * 3, maxDimension * 2]}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={maxDimension * 10}
          shadow-camera-left={-maxDimension * 3}
          shadow-camera-right={maxDimension * 3}
          shadow-camera-top={maxDimension * 3}
          shadow-camera-bottom={-maxDimension * 3}
        />
        
        {/* Reduced fill lights */}
        <directionalLight intensity={0.4} position={[-maxDimension, maxDimension, -maxDimension]} />
        <pointLight position={[maxDimension, maxDimension * 2, 0]} intensity={0.3} />
        <pointLight position={[-maxDimension, maxDimension * 2, 0]} intensity={0.3} />
        
        {/* Darker floor */}
        <group position={[0, -tankHeight / 2 - 0.5, 0]}>
          <mesh rotation-x={-Math.PI / 2} receiveShadow>
            <planeGeometry args={[maxDimension * 8, maxDimension * 8]} />
            <meshStandardMaterial color="#475569" roughness={0.8} metalness={0.1} />
          </mesh>
          
          {/* Darker grid */}
          <gridHelper 
            args={[maxDimension * 8, 50, '#64748b', '#475569']} 
            position={[0, 0.001, 0]} 
          />
        </group>
        
        {/* Enhanced Tank Model with draggable accessories */}
        <EnhancedTankModel 
          formData={formData}
          transparency={transparency}
          onDragStateChange={handleGlobalDragState}
          getDefaultPosition={getAccessoryDefaultPosition}
        />
        
        {/* TESTAS: Paprastas raudonas kubas, kad pamatytume ar 3D scena veikia */}
        <mesh position={[3, 2, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="red" />
        </mesh>
        
        {/* TESTAS: Žalias rutuliukas */}
        <mesh position={[-3, 2, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="green" />
        </mesh>
      </Canvas>
    </div>
  );
};

export default Enhanced3DTankPreview;