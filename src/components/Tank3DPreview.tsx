import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { TankFormData } from '../types/tankTypes';

// Accessory types
type AccessoryType = 'supportLegs' | 'thermalInsulation' | 'cipSystem' | 'pressureRelief' | 'levelIndicators' | 'hatchesAndDrains';

interface AccessoryPosition {
  id: string;
  type: AccessoryType;
  position: [number, number, number];
  rotation: [number, number, number];
}

// Helper function to create tank geometry
const createCylindricalTank = (radius: number, height: number, topType: string, bottomType: string, material?: string, transparency: number = 1.0) => {
  const segments = 32;
  const group = new THREE.Group();
  
  // Material color based on steel type
  const getMaterialColor = (materialType?: string) => {
    switch (materialType) {
      case '304':
        return 0xf0f0f0; // Much brighter silver for 304 stainless steel
      case '316':
        return 0x8a9ba8; // Distinctly darker blue-gray for 316 stainless steel
      default:
        return 0xdfe3e8; // Default light gray
    }
  };
  
  // Create the main cylinder body
  const cylinderGeometry = new THREE.CylinderGeometry(radius, radius, height, segments);
  const cylinderMaterial = new THREE.MeshStandardMaterial({ 
    color: getMaterialColor(material),
    metalness: material === '304' || material === '316' ? 0.8 : 0.6,
    roughness: material === '304' || material === '316' ? 0.2 : 0.3,
    emissive: 0x101010,
    emissiveIntensity: 0.05,
    transparent: transparency < 1.0,
    opacity: transparency
  });
  const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
  cylinder.castShadow = true;
  cylinder.receiveShadow = true;
  group.add(cylinder);

  // Add top shape based on type
  if (topType === 'dome') {
    const sphereGeometry = new THREE.SphereGeometry(radius, segments, segments / 2, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(sphereGeometry, cylinderMaterial);
    dome.position.y = height / 2;
    group.add(dome);
  } else if (topType === 'cone') {
    const coneGeometry = new THREE.ConeGeometry(radius, radius, segments);
    const cone = new THREE.Mesh(coneGeometry, cylinderMaterial);
    cone.position.y = height / 2 + radius / 2;
    group.add(cone);
  }

  // Add bottom shape based on type
  if (bottomType === 'dome') {
    // Create bottom hemisphere (dished bottom) - curves upward into the tank
    const sphereGeometry = new THREE.SphereGeometry(radius, segments, segments / 2, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(sphereGeometry, cylinderMaterial);
    dome.position.y = -height / 2;  // Position at bottom of cylinder
    dome.rotation.x = Math.PI;  // Flip to curve upward into tank
    group.add(dome);
  } else if (bottomType === 'cone') {
    const coneGeometry = new THREE.ConeGeometry(radius, radius, segments);
    const cone = new THREE.Mesh(coneGeometry, cylinderMaterial);
    cone.position.y = -height / 2 - radius / 2;
    cone.rotation.x = Math.PI;  // Flip the cone to point downward
    group.add(cone);
  }

  // Add legs
  const addLegs = (numLegs: number, isHorizontal = false, currentBottomType = bottomType) => {
    const legRadius = radius * 0.05;
    
    // Calculate leg height based on bottom type to provide proper clearance
    let legHeight;
    if (currentBottomType === 'cone') {
      // Cone extends down, needs taller legs so cone doesn't touch ground
      legHeight = radius * 1.2; 
    } else if (currentBottomType === 'dome') {
      // Dome curves up into tank, but still needs taller legs for clearance
      legHeight = radius * 1.2; 
    } else {
      // Flat bottom, shorter legs
      legHeight = radius * 0.6;
    }
    
    const legGeometry = new THREE.CylinderGeometry(legRadius, legRadius, legHeight, 12);
    const legMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x64748b,
      metalness: 0.7,
      roughness: 0.4
    });
    
    for (let i = 0; i < numLegs; i++) {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      
      if (isHorizontal) {
        // For horizontal orientation: redistribute legs to support the length
        if (numLegs === 2) {
          // 2 legs: one at each end
          leg.position.x = (i === 0) ? -height * 0.4 : height * 0.4;
          leg.position.z = 0;
        } else if (numLegs === 4) {
          // 4 legs: pairs at each end
          const endPos = (i < 2) ? -height * 0.35 : height * 0.35;
          leg.position.x = endPos;
          leg.position.z = (i % 2 === 0) ? -radius * 0.6 : radius * 0.6;
        } else if (numLegs >= 6) {
          // 6+ legs: distributed along length
          const lengthPos = ((i / (numLegs - 1)) - 0.5) * height * 0.8;
          leg.position.x = lengthPos;
          leg.position.z = (i % 2 === 0) ? -radius * 0.5 : radius * 0.5;
        }
      } else {
        // Vertical orientation - circular pattern around the tank
        const angle = (i / numLegs) * Math.PI * 2;
        const legDistance = radius * 0.85;
        
        leg.position.x = Math.cos(angle) * legDistance;
        leg.position.z = Math.sin(angle) * legDistance;
      }
      
      // Position legs at the bottom
      let yPosition;
      if (isHorizontal) {
        // For horizontal tank, legs should be below the rotated tank bottom
        yPosition = -radius - legHeight / 2;
      } else {
        // For vertical tank, legs should be below tank bottom
        // Tank bottom is at -height/2, so legs center at -height/2 - legHeight/2
        yPosition = -height / 2 - legHeight / 2;
      }
      
      leg.position.y = yPosition;
      
      group.add(leg);
    }
  };

  return { group, addLegs };
};

const createRectangularTank = (width: number, height: number, depth: number, material?: string, transparency: number = 1.0) => {
  const group = new THREE.Group();
  
  // Material color based on steel type
  const getMaterialColor = (materialType?: string) => {
    switch (materialType) {
      case '304':
        return 0xf0f0f0; // Much brighter silver for 304 stainless steel
      case '316':
        return 0x8a9ba8; // Distinctly darker blue-gray for 316 stainless steel
      default:
        return 0xdfe3e8; // Default light gray
    }
  };
  
  // Create the main box
  const boxGeometry = new THREE.BoxGeometry(width, height, depth);
  const boxMaterial = new THREE.MeshStandardMaterial({ 
    color: getMaterialColor(material),
    metalness: material === '304' || material === '316' ? 0.8 : 0.6,
    roughness: material === '304' || material === '316' ? 0.2 : 0.3,
    emissive: 0x101010,
    emissiveIntensity: 0.05,
    transparent: transparency < 1.0,
    opacity: transparency
  });
  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.castShadow = true;
  box.receiveShadow = true;
  group.add(box);

  // Add legs
  const addLegs = (numLegs: number, isHorizontal = false) => {
    const legRadius = Math.min(width, depth) * 0.05;
    const legHeight = Math.min(width, depth) * 0.6;
    const legGeometry = new THREE.CylinderGeometry(legRadius, legRadius, legHeight, 12);
    const legMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x64748b,
      metalness: 0.7,
      roughness: 0.4
    });
    
    if (isHorizontal) {
      // For horizontal rectangular tank: place legs to support the length (height becomes length)
      for (let i = 0; i < numLegs; i++) {
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        
        if (numLegs === 2) {
          // 2 legs: one at each end
          leg.position.x = (i === 0) ? -height * 0.4 : height * 0.4;
          leg.position.z = 0;
        } else if (numLegs === 4) {
          // 4 legs: pairs at each end for maximum stability
          const endPos = (i < 2) ? -height * 0.35 : height * 0.35;
          leg.position.x = endPos;
          leg.position.z = (i % 2 === 0) ? -width * 0.35 : width * 0.35;
        } else if (numLegs >= 6) {
          // 6+ legs: distributed evenly along the length
          const lengthPos = ((i / (numLegs - 1)) - 0.5) * height * 0.8;
          leg.position.x = lengthPos;
          leg.position.z = (i % 2 === 0) ? -width * 0.3 : width * 0.3;
        }
        
        // For horizontal tank, legs should touch the bottom of the rotated tank
        // The tank bottom is now at -width/2 from center
        leg.position.y = -width / 2 - legHeight / 2;
        group.add(leg);
      }
    } else {
      // Vertical orientation - corners and sides
      const positions = [];
      const inset = Math.max(legRadius * 2, Math.min(width, depth) * 0.1);
      
      if (numLegs === 4) {
        // 4 legs at corners
        positions.push([-width/2 + inset, 0, -depth/2 + inset]);
        positions.push([-width/2 + inset, 0, depth/2 - inset]);
        positions.push([width/2 - inset, 0, -depth/2 + inset]);
        positions.push([width/2 - inset, 0, depth/2 - inset]);
      } else if (numLegs === 6) {
        // 6 legs: corners + middle of long sides
        positions.push([-width/2 + inset, 0, -depth/2 + inset]);
        positions.push([-width/2 + inset, 0, depth/2 - inset]);
        positions.push([width/2 - inset, 0, -depth/2 + inset]);
        positions.push([width/2 - inset, 0, depth/2 - inset]);
        positions.push([0, 0, -depth/2 + inset]);
        positions.push([0, 0, depth/2 - inset]);
      } else if (numLegs >= 8) {
        // 8+ legs: corners + middle of all sides
        positions.push([-width/2 + inset, 0, -depth/2 + inset]);
        positions.push([-width/2 + inset, 0, depth/2 - inset]);
        positions.push([width/2 - inset, 0, -depth/2 + inset]);
        positions.push([width/2 - inset, 0, depth/2 - inset]);
        positions.push([0, 0, -depth/2 + inset]);
        positions.push([0, 0, depth/2 - inset]);
        positions.push([-width/2 + inset, 0, 0]);
        positions.push([width/2 - inset, 0, 0]);
      }
      
      const actualPositions = positions.slice(0, numLegs);
      actualPositions.forEach(([x, _, z]) => {
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.set(x, -height/2 - legHeight/2, z);
        group.add(leg);
      });
    }
  };

  return { group, addLegs };
};

// Simple Error Cube - shown when there's an error rendering the tank
const ErrorCube = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime();
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.5;
    }
  });
  
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
      <Text position={[0, 2, 0]} fontSize={0.5} color="white">
        Error rendering tank
      </Text>
    </mesh>
  );
};


// Supaprastintas Draggable 3D Accessory komponentas
const DraggableAccessory = ({ accessory, tankBounds, onPositionChange, onDragStateChange, tankInfo }: {
  accessory: AccessoryPosition;
  tankBounds: { width: number; height: number; depth: number };
  onPositionChange: (id: string, position: [number, number, number]) => void;
  onDragStateChange: (isDragging: boolean) => void;
  tankInfo: { type: string; radius: number; height: number }; // Add tank info prop
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Create 3D geometry for each accessory type
  const createAccessoryGeometry = (type: AccessoryType) => {
    switch (type) {
      case 'supportLegs':
        return <cylinderGeometry args={[0.1, 0.1, 1.0, 8]} />;
      case 'thermalInsulation':
        return <boxGeometry args={[0.6, 1.6, 0.6]} />;
      case 'cipSystem':
        return <sphereGeometry args={[0.3, 16, 16]} />;
      case 'pressureRelief':
        return <coneGeometry args={[0.2, 0.6, 8]} />;
      case 'levelIndicators':
        return <boxGeometry args={[0.2, 0.8, 0.2]} />;
      case 'hatchesAndDrains':
        return <cylinderGeometry args={[0.4, 0.4, 0.2, 16]} />;
      default:
        return <boxGeometry args={[0.4, 0.4, 0.4]} />;
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
    };
    
    if (isDragging) return 0x00ff00; // Green when dragging
    if (hovered) return 0xff9500; // Orange when hovered
    return baseColors[type];
  };

  // Paprastas mouse handling - dragging tik laikant mygtuką
  const handleMouseDown = (e: any) => {
    e.stopPropagation();
    console.log('Mouse down on accessory:', accessory.id);
    setIsDragging(true);
    onDragStateChange(true);
    document.body.style.cursor = 'grabbing';

    // Išsaugome pradinę pelės poziciją
    let lastMouseX = 0;
    let lastMouseY = 0;
    let isFirstMove = true;

    // Pridėti global mouse event listeners
    const handleGlobalMouseMove = (moveEvent: MouseEvent) => {
      if (meshRef.current) {
        // Pirmo judėjimo metu išsaugome pradinę poziciją
        if (isFirstMove) {
          lastMouseX = moveEvent.clientX;
          lastMouseY = moveEvent.clientY;
          isFirstMove = false;
          return;
        }

        // Apskaičiuojame pelės judėjimo deltą
        const deltaX = moveEvent.clientX - lastMouseX;
        const deltaY = moveEvent.clientY - lastMouseY;

        // Dabartinė objekto pozicija
        const currentPos = meshRef.current.position;

        // Surface-locked movement system: accessories move along tank surface
        const sensitivity = 0.02;
        
        // Get tank information from props
        const tankRadius = tankInfo.radius;
        const tankType = tankInfo.type;
        
        // Calculate new position based on mouse movement
        const rawNewY = currentPos.y - deltaY * sensitivity; // Inverted for natural feel
        
        let newPosition: [number, number, number];
        
        if (tankType === 'cylindrical') {
          // For cylindrical tanks: project position onto cylinder surface
          // Keep Y movement free (up/down along tank height)
          // Project X,Z onto circular cross-section
          
          const targetDistance = tankRadius + 0.3; // Small offset from tank surface
          
          // Calculate angle for rotation around tank
          let angle = Math.atan2(currentPos.z, currentPos.x);
          angle += deltaX * sensitivity * 2; // Rotate around tank with mouse X movement
          
          const projectedX = Math.cos(angle) * targetDistance;
          const projectedZ = Math.sin(angle) * targetDistance;
          
          newPosition = [projectedX, rawNewY, projectedZ];
        } else {
          // For rectangular tanks: project onto rectangular surface
          // Determine which face of the rectangle the accessory is closest to
          const distToLeft = Math.abs(currentPos.x + tankRadius);
          const distToRight = Math.abs(currentPos.x - tankRadius);
          const distToFront = Math.abs(currentPos.z + tankRadius);
          const distToBack = Math.abs(currentPos.z - tankRadius);
          
          const minDist = Math.min(distToLeft, distToRight, distToFront, distToBack);
          
          if (minDist === distToLeft) {
            // Left face
            newPosition = [-tankRadius - 0.3, rawNewY, currentPos.z + deltaX * sensitivity];
          } else if (minDist === distToRight) {
            // Right face  
            newPosition = [tankRadius + 0.3, rawNewY, currentPos.z + deltaX * sensitivity];
          } else if (minDist === distToFront) {
            // Front face
            newPosition = [currentPos.x + deltaX * sensitivity, rawNewY, -tankRadius - 0.3];
          } else {
            // Back face
            newPosition = [currentPos.x + deltaX * sensitivity, rawNewY, tankRadius + 0.3];
          }
        }

        // Allow full 3D movement with reasonable bounds
        const constrainedPosition: [number, number, number] = [
          Math.max(-tankBounds.width/2, Math.min(tankBounds.width/2, newPosition[0])),
          Math.max(-tankBounds.height/2, Math.min(tankBounds.height, newPosition[1])), // Allow movement from below floor to reasonable height
          Math.max(-tankBounds.depth/2, Math.min(tankBounds.depth/2, newPosition[2]))
        ];

        console.log(`Constraining accessory position: original=[${newPosition[0].toFixed(2)}, ${newPosition[1].toFixed(2)}, ${newPosition[2].toFixed(2)}], constrained=[${constrainedPosition[0].toFixed(2)}, ${constrainedPosition[1].toFixed(2)}, ${constrainedPosition[2].toFixed(2)}], tankBounds=[${tankBounds.width.toFixed(2)}, ${tankBounds.height.toFixed(2)}, ${tankBounds.depth.toFixed(2)}]`);

        meshRef.current.position.set(...constrainedPosition);
        onPositionChange(accessory.id, constrainedPosition);

        // Atnaujinti paskutinę pelės poziciją kitam judėjimui
        lastMouseX = moveEvent.clientX;
        lastMouseY = moveEvent.clientY;
      }
    };

    const handleGlobalMouseUp = () => {
      console.log('Mouse up on accessory:', accessory.id);
      setIsDragging(false);
      onDragStateChange(false);
      document.body.style.cursor = 'auto';

      // Pašalinti global event listeners
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };

    // Pridėti global event listeners
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
  };

  return (
    <mesh
      ref={meshRef}
      position={accessory.position}
      rotation={accessory.rotation}
      onPointerDown={handleMouseDown}
      onPointerOver={() => {
        setHovered(true);
        if (!isDragging) {
          document.body.style.cursor = 'grab';
        }
      }}
      onPointerOut={() => {
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
      
      {/* Accessory label */}
      <Text
        position={[0, 1.0, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {accessory.type}
      </Text>
      
      {/* Movement instructions when hovered */}
      {hovered && (
        <Text
          position={[0, 1.4, 0]}
          fontSize={0.15}
          color="yellow"
          anchorX="center"
          anchorY="middle"
        >
          Drag to slide along tank surface
        </Text>
      )}
    </mesh>
  );
};

// Enhanced Tank Model with Accessories
const TankModelWithAccessories = ({ formData, accessories, transparency, onAccessoryPositionChange, onDragStateChange }: {
  formData: TankFormData;
  accessories: AccessoryPosition[];
  transparency: number;
  onAccessoryPositionChange: (id: string, position: [number, number, number]) => void;
  onDragStateChange: (isDragging: boolean) => void;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hasError, setHasError] = useState(false);
  const [tankBounds, setTankBounds] = useState({ width: 2, height: 2, depth: 2 });
  const [tankInfo, setTankInfo] = useState({ type: 'cylindrical', radius: 0.5, height: 1 });

  // Debug: log accessories received by TankModelWithAccessories
  useEffect(() => {
    console.log('TankModelWithAccessories received accessories:', accessories);
  }, [accessories]);

  // Calculate tank info for surface-locked movement
  useEffect(() => {
    if (formData) {
      const heightInMm = formData.height || 1000;
      const height = heightInMm / 1000;
      
      let radius = 0.5;
      if (formData.tankType === 'cylindrical') {
        const diameterInMm = formData.diameter || 500;
        radius = (diameterInMm / 1000) / 2;
      } else if (formData.tankType === 'rectangular') {
        const widthInMm = formData.width || 500;
        radius = (widthInMm / 1000) / 2; // Use width/2 as "radius" for rectangular tanks
      }
      
      setTankInfo({
        type: formData.tankType || 'cylindrical',
        radius: radius,
        height: height
      });
    }
  }, [formData]);

  // Function to control dragging state globally - now uses the callback from parent
  const setGlobalDragging = (dragging: boolean) => {
    onDragStateChange(dragging);
  };

  // Calculate tank bounds for accessory constraints - expand beyond tank to allow accessories outside
  useEffect(() => {
    if (formData) {
      const heightInMm = formData.height || 1000;
      const height = heightInMm / 1000;
      
      if (formData.tankType === 'cylindrical') {
        const diameterInMm = formData.diameter || 500;
        const diameter = diameterInMm / 1000;
        // Expand bounds significantly beyond tank to allow accessories to be positioned outside
        const expandedSize = diameter * 3; // 3x tank diameter for movement area
        setTankBounds({ width: expandedSize, height: height * 2, depth: expandedSize });
        console.log(`Tank bounds set for cylindrical tank: width=${expandedSize.toFixed(2)}, height=${(height * 2).toFixed(2)}, depth=${expandedSize.toFixed(2)} (tank diameter: ${diameter.toFixed(2)})`);
      } else {
        const widthInMm = formData.width || 500;
        const width = widthInMm / 1000;
        // Expand bounds significantly beyond tank to allow accessories to be positioned outside
        const expandedSize = width * 3; // 3x tank width for movement area
        setTankBounds({ width: expandedSize, height: height * 2, depth: expandedSize });
        console.log(`Tank bounds set for rectangular tank: width=${expandedSize.toFixed(2)}, height=${(height * 2).toFixed(2)}, depth=${expandedSize.toFixed(2)} (tank width: ${width.toFixed(2)})`);
      }
    }
  }, [formData]);

  // Position the entire group above the grid floor
  useEffect(() => {
    if (groupRef.current && formData) {
      const heightInMm = formData.height || 1000;
      const height = heightInMm / 1000;
      const floorY = Math.min(-8, -(height / 2) - 2);
      
      // Calculate leg height based on tank dimensions and orientation
      let legHeight;
      let effectiveHeight = height; // Height for positioning calculation
      
      if (formData.tankType === 'cylindrical') {
        const diameterInMm = formData.diameter || 500;
        const radius = (diameterInMm / 2) / 1000;
        const bottomType = formData.bottomType || 'flat';
        
        // Calculate leg height based on bottom type
        if (bottomType === 'cone') {
          legHeight = radius * 1.2; // Taller legs for cone clearance
        } else if (bottomType === 'dome') {
          legHeight = radius * 1.2; // Same tall legs for dome clearance
        } else {
          legHeight = radius * 0.6; // Standard legs for flat bottom
        }
        
        // For horizontal orientation, effective height is the diameter
        if (formData.orientation === 'horizontal') {
          effectiveHeight = radius * 2; // diameter
        }
      } else {
        const widthInMm = formData.width || 500;
        const width = widthInMm / 1000;
        legHeight = width * 0.6;
        
        // For horizontal orientation, effective height is the width
        if (formData.orientation === 'horizontal') {
          effectiveHeight = width;
        }
      }
      
      // Position tank so the legs touch the floor
      // Tank center should be at floor level + half effective height + leg height
      groupRef.current.position.y = floorY + effectiveHeight / 2 + legHeight;
    }
  }, [formData]);
  
  useEffect(() => {
    if (!groupRef.current) return;
    
    try {
      // Clear existing children
      while(groupRef.current.children.length > 0) {
        const object = groupRef.current.children[0];
        groupRef.current.remove(object);
      }
      
      // Default tank if no form data
      if (!formData || !formData.tankType) {
        const { group, addLegs } = createCylindricalTank(2, 5, 'flat', 'flat', formData?.material, transparency);
        addLegs(4);
        groupRef.current.add(group);
        
        // Position default tank properly on floor
        const defaultHeight = 5;
        const defaultRadius = 2;
        const defaultLegHeight = defaultRadius * 0.6;
        const floorY = Math.min(-8, -(defaultHeight / 2) - 2);
        groupRef.current.position.y = floorY + defaultHeight / 2 + defaultLegHeight;
        return;
      }
      
      // Calculate dimensions based on form inputs
      const heightInMm = formData.height || 1000;
      
      if (formData.tankType === 'cylindrical') {
        const diameterInMm = formData.diameter || 500;
        
        // Convert from mm to 3D units with better scaling for large tanks
        // Use 1000 as divisor to handle larger tanks properly
        const radius = (diameterInMm / 2) / 1000;
        const height = heightInMm / 1000;
        
        // Get top/bottom configuration from form data
        const topType = formData.topType || 'flat';
        const bottomType = formData.bottomType || 'flat';
        
        // Create the tank
        const tankObj = createCylindricalTank(radius, height, topType, bottomType, formData.material, transparency);
        
        // Add legs - ensure we convert string to number
        const numLegs = Number(formData.legs) || 4;
        const isHorizontal = formData.orientation === 'horizontal';
        tankObj.addLegs(numLegs, isHorizontal);
        
        // Rotate tank if horizontal - only rotate the tank parts, legs are already positioned correctly
        if (formData.orientation === 'horizontal') {
          tankObj.group.children.forEach(child => {
            if (child instanceof THREE.Mesh && 
                child.material instanceof THREE.MeshStandardMaterial && 
                child.material.color.getHex() !== 0x64748b) {
              // This is a tank part (not a leg) - rotate it
              child.rotation.z = Math.PI / 2;
            }
          });
        }
        
        groupRef.current.add(tankObj.group);
      } else if (formData.tankType === 'rectangular') {
        const widthInMm = formData.width || 500;
        
        // Convert from mm to 3D units with better scaling for large tanks
        // Use 1000 as divisor to handle larger tanks properly
        const width = widthInMm / 1000;
        const height = heightInMm / 1000;
        const depth = widthInMm / 1000; // Use width for depth to make it square
        
        // Create appropriate tank based on orientation
        const tankObj = createRectangularTank(width, height, depth, formData.material, transparency);
        
        // Add legs - ensure we convert string to number
        const numLegs = Number(formData.legs) || 4;
        const isHorizontal = formData.orientation === 'horizontal';
        tankObj.addLegs(numLegs, isHorizontal);
        
        // For horizontal orientation, rotate only the tank parts, legs are already positioned correctly
        if (formData.orientation === 'horizontal') {
          tankObj.group.children.forEach(child => {
            if (child instanceof THREE.Mesh && 
                child.material instanceof THREE.MeshStandardMaterial && 
                child.material.color.getHex() !== 0x64748b) {
              // This is a tank part (not a leg) - rotate it
              child.rotation.z = Math.PI / 2;
            }
          });
        }
        
        groupRef.current.add(tankObj.group);
      }
      
      setHasError(false);
    } catch (error) {
      console.error("Error creating tank model:", error);
      setHasError(true);
    }
  }, [formData, transparency]);
  
  // This animation is now handled in the combined useFrame below
  
  // Add hover effect and selection highlight
  useFrame(({ clock, mouse, viewport }) => {
    if (groupRef.current && !hasError) {
      // Gentle idle animation
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.2;
      
      // Subtle mouse follow - tank slightly rotates to follow mouse position
      const mouseX = (mouse.x * viewport.width) / 20;
      const mouseY = (mouse.y * viewport.height) / 20;
      
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x || 0,
        mouseY * 0.02,
        0.05
      );
      
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y || 0,
        Math.sin(clock.getElapsedTime() * 0.2) * 0.2 + mouseX * 0.02,
        0.05
      );
    }
  });
  
  return hasError ? <ErrorCube /> : (
    <>
      {/* Tank group with rotation animations */}
      <group ref={groupRef}>
        {/* Tank is rendered here but accessories are moved outside */}
      </group>
      
      {/* Accessories group - separate from tank so they don't rotate with it */}
      <group>
        {accessories.map((accessory) => {
          console.log('Rendering accessory:', accessory.id, accessory.type, 'at position:', accessory.position);
          return (
            <DraggableAccessory
              key={accessory.id}
              accessory={accessory}
              tankBounds={tankBounds}
              tankInfo={tankInfo}
              onPositionChange={onAccessoryPositionChange}
              onDragStateChange={setGlobalDragging}
            />
          );
        })}
      </group>
    </>
  );
};

// The main 3D tank preview component
interface TankPreviewProps {
  formData: TankFormData;
  transparency?: number;
}

const Tank3DPreview = ({ formData, transparency = 1.0 }: TankPreviewProps) => {
  const [accessories, setAccessories] = useState<AccessoryPosition[]>([]);
  const [isDraggingAccessory, setIsDraggingAccessory] = useState(false);
  const orbitControlsRef = useRef<any>(null);

  // Debug: log when Tank3DPreview receives new props
  useEffect(() => {
    console.log('Tank3DPreview received formData:', formData);
  }, [formData]);

  // Handle global dragging state from accessories
  const handleGlobalDragStateChange = (isDragging: boolean) => {
    setIsDraggingAccessory(isDragging);
    // Disable OrbitControls when dragging accessories
    if (orbitControlsRef.current) {
      orbitControlsRef.current.enabled = !isDragging;
    }
  };

  // Convert selected accessories from form to 3D accessories
  useEffect(() => {
    console.log('useEffect triggered - formData.accessories:', formData.accessories);
    
    if (formData.accessories) {
      const newAccessories: AccessoryPosition[] = [];
      let accessoryIndex = 0;

      Object.entries(formData.accessories).forEach(([type, isSelected]) => {
        console.log(`Accessory ${type}: ${isSelected}`);
        if (isSelected) {
          // Calculate default position based on tank dimensions and accessory type
          const heightInMm = formData.height || 1000;
          const height = heightInMm / 1000;
          
          // Calculate tank radius/width to position accessories outside the tank
          let tankRadius = 0.5; // default radius
          if (formData.tankType === 'cylindrical') {
            const diameterInMm = formData.diameter || 500;
            tankRadius = (diameterInMm / 1000) / 2;
          } else if (formData.tankType === 'rectangular') {
            const widthInMm = formData.width || 500;
            tankRadius = (widthInMm / 1000) / 2;
          }
          
          console.log(`Tank dimensions - type: ${formData.tankType}, radius: ${tankRadius}, height: ${height}`);
          
          // Position accessories close to the tank with minimal spacing
          // Use a small distance to place them right next to the tank
          const spacing = Math.max(tankRadius * 0.3, 0.2); // Just slightly outside the tank
          const accessoryDistance = tankRadius + spacing;
          
          // Distribute accessories around the tank to avoid overlap
          const angleOffset = (accessoryIndex * 60) * (Math.PI / 180); // 60 degrees apart
          const x = Math.cos(angleOffset) * accessoryDistance;
          const z = Math.sin(angleOffset) * accessoryDistance;
          
          console.log(`Accessory ${type} positioned at: x=${x.toFixed(2)}, z=${z.toFixed(2)}, distance=${accessoryDistance.toFixed(2)}, tankRadius=${tankRadius.toFixed(2)}`);
          
          // Position accessories on the tank surface at mid-height
          // Calculate tank center Y position (where the tank is positioned)
          const floorY = Math.min(-8, -(height / 2) - 2);
          let legHeight = tankRadius * 0.6; // Default leg height
          const tankCenterY = floorY + height / 2 + legHeight; // Tank center position
          const accessoryY = tankCenterY; // Place accessory at tank center height (mid-tank)
          
          console.log(`Tank center Y: ${tankCenterY.toFixed(2)}, placing accessory at Y=${accessoryY.toFixed(2)}`);
          
          let defaultPosition: [number, number, number];
          
          switch (type as AccessoryType) {
            case 'supportLegs':
              defaultPosition = [x, accessoryY, z]; // Tank surface level, beside tank
              break;
            case 'thermalInsulation':
              defaultPosition = [x, accessoryY, z]; // Tank surface level, beside tank
              break;
            case 'cipSystem':
              defaultPosition = [x, accessoryY, z]; // Tank surface level, beside tank
              break;
            case 'pressureRelief':
              defaultPosition = [x, accessoryY, z]; // Tank surface level, beside tank
              break;
            case 'levelIndicators':
              defaultPosition = [x, accessoryY, z]; // Tank surface level, beside tank
              break;
            case 'hatchesAndDrains':
              defaultPosition = [x, accessoryY, z]; // Tank surface level, beside tank
              break;
          }

          console.log(`Final position for ${type}: [${defaultPosition[0].toFixed(2)}, ${defaultPosition[1].toFixed(2)}, ${defaultPosition[2].toFixed(2)}]`);

          newAccessories.push({
            id: `${type}-${accessoryIndex++}`,
            type: type as AccessoryType,
            position: defaultPosition,
            rotation: [0, 0, 0],
          });
        }
      });

      setAccessories(newAccessories);
      console.log('Generated accessories from form data:', newAccessories);
    }
  }, [formData]);

  const handleAccessoryPositionChange = (id: string, position: [number, number, number]) => {
    setAccessories(prev => 
      prev.map(acc => 
        acc.id === id ? { ...acc, position } : acc
      )
    );
  };

  // Calculate camera position based on tank size
  const getTankDimensions = () => {
    if (!formData) return { maxDimension: 5, height: 5, tankCenterY: 0 };
    
    const heightInMm = formData.height || 1000;
    const height = heightInMm / 1000;
    
    let maxDimension = 5; // default
    let legHeight = 0;
    
    if (formData.tankType === 'cylindrical') {
      const diameterInMm = formData.diameter || 500;
      const diameter = diameterInMm / 1000;
      const radius = diameter / 2;
      legHeight = radius * 0.6;
      maxDimension = Math.max(diameter, height);
    } else if (formData.tankType === 'rectangular') {
      const widthInMm = formData.width || 500;
      const width = widthInMm / 1000;
      legHeight = width * 0.6;
      maxDimension = Math.max(width, height);
    }
    
    // Calculate tank center position (where camera should look)
    const floorY = Math.min(-8, -(height / 2) - 2);
    const tankCenterY = floorY + height / 2 + legHeight;
    
    return { maxDimension, height, tankCenterY };
  };
  
  const { maxDimension, height, tankCenterY } = getTankDimensions();
  
  // Dynamic camera positioning based on tank size - closer for better view
  const cameraDistance = Math.max(maxDimension * 2, 8); // Even closer for small tanks
  const cameraHeight = Math.max(maxDimension * 1.2, tankCenterY + maxDimension * 0.5); // Lower camera height
  const cameraPosition: [number, number, number] = [cameraDistance, cameraHeight, cameraDistance];
  
  // Camera target should be the tank center
  const cameraTarget: [number, number, number] = [0, tankCenterY, 0];
  
  // Dynamic floor position - place floor below the tank
  const floorY = Math.min(-8, -(height / 2) - 2);
  
  return (
    <div className="h-[450px] w-full rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg relative">
      {/* Interactive 3D Controls */}
      <div className="absolute top-4 left-4 z-20 bg-white/90 dark:bg-gray-800/90 rounded-xl p-3 shadow-lg border border-gray-200 dark:border-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            3D Preview
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Live tank visualization
        </p>
      </div>

      {/* Dark theme status indicator */}
      <div className="absolute top-4 right-4 z-10 flex items-center px-3 py-2 bg-slate-800/80 backdrop-blur-md rounded-xl shadow-md border border-slate-600">
        <div className="h-2 w-2 rounded-full bg-astra-soft animate-pulse mr-2"></div>
        <span className="text-xs text-astra-soft font-semibold tracking-wide">Realaus laiko peržiūra</span>
      </div>

      <Canvas shadows dpr={[1, 2]}>
        <color attach="background" args={['#f8fafc']} />
        <PerspectiveCamera makeDefault position={cameraPosition} fov={35} />
        <OrbitControls 
          ref={orbitControlsRef}
          enableZoom={true} 
          enablePan={true} 
          enabled={!isDraggingAccessory}
          minDistance={Math.max(maxDimension * 0.8, 3)} 
          maxDistance={Math.max(maxDimension * 8, 60)} 
          target={cameraTarget}
          enableDamping={true}
          dampingFactor={0.05}
        />
        
        {/* Enhanced lighting setup for better materials without HDR */}
        <ambientLight intensity={0.6} />
        <hemisphereLight intensity={0.7} color="#ffffff" groundColor="#e2e8f0" />
        
        {/* Key light - main directional light - positioned relative to tank size */}
        <directionalLight
          intensity={1.0}
          position={[maxDimension * 2, maxDimension * 4, maxDimension * 2]}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={Math.max(50, maxDimension * 10)}
          shadow-camera-left={-maxDimension * 4}
          shadow-camera-right={maxDimension * 4}
          shadow-camera-top={maxDimension * 4}
          shadow-camera-bottom={-maxDimension * 4}
          target-position={cameraTarget}
        />
        
        {/* Fill light - softer secondary light */}
        <directionalLight 
          intensity={0.5} 
          position={[-maxDimension * 2, maxDimension, -maxDimension]} 
        />
        
        {/* Rim light - for edge highlights */}
        <pointLight 
          position={[0, maxDimension * 2, -maxDimension * 2]} 
          intensity={0.3} 
          color="#e0e7ff" 
        />
        
        {/* Additional point lights for better highlights */}
        <pointLight position={[maxDimension, maxDimension, maxDimension]} intensity={0.2} />
        <pointLight position={[-maxDimension, maxDimension * 0.6, -maxDimension]} intensity={0.1} />
        
        {/* Floor with grid that aligns with the bottom of tanks */}
        <group position={[0, floorY, 0]}>
          {/* Main floor plane with subtle gradient */}
          <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[Math.max(100, maxDimension * 10), Math.max(100, maxDimension * 10)]} />
            <meshStandardMaterial 
              color="#f8fafc" 
              roughness={0.8}
              metalness={0.1}
            />
          </mesh>
          
          {/* Primary grid lines - scale with tank size */}
          <gridHelper args={[Math.max(100, maxDimension * 10), 100, '#e2e8f0', '#e2e8f0']} />
          
          {/* Accent grid for visual cues */}
          <gridHelper args={[Math.max(20, maxDimension * 2), 20, '#94a3b8', '#e2e8f0']} position={[0, 0.002, 0]} />
          
          {/* Center highlight */}
          <mesh rotation-x={-Math.PI / 2} position={[0, 0.001, 0]}>
            <circleGeometry args={[Math.max(5, maxDimension), 36]} />
            <meshBasicMaterial color="#f1f5f9" transparent opacity={0.5} />
          </mesh>
          
          {/* Shadow catcher */}
          <mesh rotation-x={-Math.PI / 2} position={[0, 0.002, 0]} receiveShadow>
            <planeGeometry args={[Math.max(20, maxDimension * 2), Math.max(20, maxDimension * 2)]} />
            <shadowMaterial transparent opacity={0.2} />
          </mesh>
        </group>
        
        <TankModelWithAccessories 
          formData={formData} 
          accessories={accessories}
          transparency={transparency}
          onAccessoryPositionChange={handleAccessoryPositionChange}
          onDragStateChange={handleGlobalDragStateChange}
        />
      </Canvas>
    </div>
  );
};

export default Tank3DPreview;
