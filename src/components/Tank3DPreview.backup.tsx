import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import type { TankFormData } from '../types/tankTypes';

// Helper function to create tank geometry
const createCylindricalTank = (radius: number, height: number, hasTopDome: boolean, hasBottomCone: boolean) => {
  const segments = 32;
  const group = new THREE.Group();
  
  // Create the main cylinder body
  const cylinderGeometry = new THREE.CylinderGeometry(radius, radius, height, segments);
  const cylinderMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xcccccc,
    metalness: 0.7,
    roughness: 0.2,
  });
  const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
  group.add(cylinder);

  // Add top dome if needed
  if (hasTopDome) {
    const sphereGeometry = new THREE.SphereGeometry(radius, segments, segments / 2, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(sphereGeometry, cylinderMaterial);
    dome.position.y = height / 2;
    dome.rotation.x = Math.PI;
    group.add(dome);
  }

  // Add bottom cone if needed
  if (hasBottomCone) {
    const coneGeometry = new THREE.ConeGeometry(radius, radius, segments);
    const cone = new THREE.Mesh(coneGeometry, cylinderMaterial);
    cone.position.y = -height / 2 - radius / 2;
    group.add(cone);
  }

  // Add legs
  const addLegs = (numLegs: number) => {
    const legRadius = radius * 0.05;
    const legHeight = radius * 0.6;
    const legGeometry = new THREE.CylinderGeometry(legRadius, legRadius, legHeight, 8);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x999999 });
    
    for (let i = 0; i < numLegs; i++) {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      const angle = (i / numLegs) * Math.PI * 2;
      const legDistance = radius * 0.8;
      
      leg.position.x = Math.cos(angle) * legDistance;
      leg.position.z = Math.sin(angle) * legDistance;
      
      // Position the legs at the bottom of the tank
      const bottomOffset = hasBottomCone ? -height / 2 - radius : -height / 2;
      leg.position.y = bottomOffset - legHeight / 2;
      
      group.add(leg);
    }
  };

  return { group, addLegs };
};

const createRectangularTank = (width: number, height: number, depth: number) => {
  const group = new THREE.Group();
  
  // Create the main box
  const boxGeometry = new THREE.BoxGeometry(width, height, depth);
  const boxMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xcccccc,
    metalness: 0.7,
    roughness: 0.2,
  });
  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  group.add(box);

  // Add legs
  const addLegs = (numLegs: number) => {
    const legRadius = Math.min(width, depth) * 0.05;
    const legHeight = Math.min(width, depth) * 0.3;
    const legGeometry = new THREE.CylinderGeometry(legRadius, legRadius, legHeight, 8);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x999999 });
    
    // For rectangular tanks, place legs at corners and sides if more than 4 legs
    const positions = [];
    
    if (numLegs === 4) {
      // Just corners
      positions.push([-width/2 + legRadius, 0, -depth/2 + legRadius]);
      positions.push([-width/2 + legRadius, 0, depth/2 - legRadius]);
      positions.push([width/2 - legRadius, 0, -depth/2 + legRadius]);
      positions.push([width/2 - legRadius, 0, depth/2 - legRadius]);
    } else if (numLegs === 6) {
      // Corners + middle of long sides
      positions.push([-width/2 + legRadius, 0, -depth/2 + legRadius]);
      positions.push([-width/2 + legRadius, 0, depth/2 - legRadius]);
      positions.push([width/2 - legRadius, 0, -depth/2 + legRadius]);
      positions.push([width/2 - legRadius, 0, depth/2 - legRadius]);
      positions.push([0, 0, -depth/2 + legRadius]);
      positions.push([0, 0, depth/2 - legRadius]);
    } else if (numLegs >= 8) {
      // Corners + middle of all sides
      positions.push([-width/2 + legRadius, 0, -depth/2 + legRadius]);
      positions.push([-width/2 + legRadius, 0, depth/2 - legRadius]);
      positions.push([width/2 - legRadius, 0, -depth/2 + legRadius]);
      positions.push([width/2 - legRadius, 0, depth/2 - legRadius]);
      positions.push([0, 0, -depth/2 + legRadius]);
      positions.push([0, 0, depth/2 - legRadius]);
      positions.push([-width/2 + legRadius, 0, 0]);
      positions.push([width/2 - legRadius, 0, 0]);
    }
    
    // Only use as many positions as we have legs
    const actualPositions = positions.slice(0, numLegs);
    
    actualPositions.forEach(([x, _, z]) => {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(x, -height/2 - legHeight/2, z);
      group.add(leg);
    });
  };

  return { group, addLegs };
};

// Simple cube for error state
const ErrorCube = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.5;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.2;
    }
  });
  
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

// Tank model component
const TankModel: React.FC<{ formData: TankFormData }> = ({ formData }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    if (!groupRef.current) return;
    
    try {
      // Clear existing children
      while(groupRef.current.children.length > 0) {
        const object = groupRef.current.children[0];
        groupRef.current.remove(object);
      }
      
      let tankGroup: THREE.Group | undefined;
      
      // Calculate dimensions based on volume
      // Volume (L) = π * r² * h * 0.001 for cylindrical tanks
      const volume = formData?.volume || 100; // Default to 100L if not set
      
      if (!formData || !formData.tankType) {
        // Default to a simple cylinder if no form data is available
        const defaultTank = createCylindricalTank(2, 5, false, false);
        defaultTank.addLegs(4);
        tankGroup = defaultTank.group;
      } else if (formData.tankType === 'cylindrical') {
        // Continue with existing cylindrical tank code
      } else if (formData.tankType === 'rectangular') {
        // Continue with existing rectangular tank code
      }
    
    if (formData.tankType === 'cylindrical') {
      const idealRatio = formData.orientation === 'vertical' ? 3 : 1/2; // Height:Diameter ratio
      const radius = Math.pow((volume * 1000) / (Math.PI * idealRatio), 1/3) / 10;
      const height = radius * 2 * idealRatio;
      
      const hasTopDome = formData.topType === 'dome';
      const hasBottomCone = formData.bottomType === 'cone';
      
      const { group, addLegs } = createCylindricalTank(radius, height, hasTopDome, hasBottomCone);
      addLegs(Number(formData.legs) || 4);
      
      // Rotate tank if horizontal
      if (formData.orientation === 'horizontal') {
        group.rotation.z = Math.PI / 2;
      }
      
      tankGroup = group;
    } else {
      // Rectangular tank
      const depth = Math.pow(volume * 1000, 1/3) / 10;
      const width = depth;
      let height = volume * 1000 / (width * depth) / 10;
      
      // Adjust dimensions for orientation
      let tankResult;
      if (formData.orientation === 'horizontal') {
        // For horizontal, swap height and depth
        tankResult = createRectangularTank(width, depth, height);
      } else {
        // For vertical, use dimensions as calculated
        tankResult = createRectangularTank(width, height, depth);
      }
      
      tankResult.addLegs(Number(formData.legs) || 4);
      tankGroup = tankResult.group;
    }
    
    groupRef.current.add(tankGroup);
  }, [formData]);
  
  // Gentle rotation animation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.2;
    }
  });
  
  return (
    <group ref={groupRef} />
  );
};

// The main 3D tank preview component
interface TankPreviewProps {
  formData: TankFormData;
}

const Tank3DPreview: React.FC<TankPreviewProps> = ({ formData = {} as TankFormData }) => {
  return (
    <div className="h-80 w-full rounded-lg overflow-hidden bg-gradient-to-b from-gray-700 to-gray-900 shadow-lg">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <OrbitControls enableZoom={true} enablePan={false} />
        
        <ambientLight intensity={0.5} />
        <directionalLight
          intensity={1}
          position={[5, 10, 5]}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-5, -5, 5]} intensity={0.5} />
        
        <TankModel formData={formData} />
      </Canvas>
    </div>
  );
};

export default Tank3DPreview;
