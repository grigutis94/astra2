import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import type { TankAccessories } from '../types/tankTypes';

// Enhanced material definitions for darker, more realistic rendering
export const createMaterials = () => {
  return {
    stainless304: new THREE.MeshStandardMaterial({
      color: 0x707070, // Darker stainless steel
      metalness: 0.8,
      roughness: 0.25,
      emissive: 0x101010,
      emissiveIntensity: 0.01,
    }),
    stainless316: new THREE.MeshStandardMaterial({
      color: 0x606060, // Darker 316 steel
      metalness: 0.8,
      roughness: 0.22,
      emissive: 0x101010,
      emissiveIntensity: 0.01,
    }),
    galvanizedSteel: new THREE.MeshStandardMaterial({
      color: 0x808080, // Darker galvanized
      metalness: 0.7,
      roughness: 0.35,
    }),
    aluminum: new THREE.MeshStandardMaterial({
      color: 0x909090, // Darker aluminum
      metalness: 0.85,
      roughness: 0.18,
    }),
    brass: new THREE.MeshStandardMaterial({
      color: 0xb8860b, // Darker brass
      metalness: 0.8,
      roughness: 0.3,
    }),
    insulation: new THREE.MeshStandardMaterial({
      color: 0xdaa520, // Darker insulation yellow
      metalness: 0.0,
      roughness: 0.9,
    }),
    insulationCover: new THREE.MeshStandardMaterial({
      color: 0xc0c0c0, // Darker cover
      metalness: 0.2,
      roughness: 0.5,
    }),
    glass: new THREE.MeshStandardMaterial({
      color: 0xf0f0f0,
      metalness: 0.0,
      roughness: 0.0,
      transparent: true,
      opacity: 0.25, // Less visible glass
    }),
    plastic: new THREE.MeshStandardMaterial({
      color: 0x2f4f4f, // Darker blue plastic
      metalness: 0.0,
      roughness: 0.4,
    }),
    rubber: new THREE.MeshStandardMaterial({
      color: 0x202020, // Darker rubber
      metalness: 0.0,
      roughness: 0.95,
    }),
    valve: new THREE.MeshStandardMaterial({
      color: 0x505050, // Darker valve material
      metalness: 0.7,
      roughness: 0.4,
    }),
  };
};

// Realistic Support Legs Implementation
export const createSupportLegs = (
  tankMesh: THREE.Object3D,
  config: TankAccessories['supportLegs']
) => {
  const materials = createMaterials();
  const legGroup = new THREE.Group();
  legGroup.name = 'supportLegs';

  const tankBounds = new THREE.Box3().setFromObject(tankMesh);
  const tankRadius = Math.max(
    tankBounds.max.x - tankBounds.min.x,
    tankBounds.max.z - tankBounds.min.z
  ) / 2;

  for (let i = 0; i < config.count; i++) {
    const legAssembly = new THREE.Group();
    
    if (config.type === 'cylindrical') {
      // Main leg tube with realistic proportions
      const legGeometry = new THREE.CylinderGeometry(0.08, 0.10, config.height, 16);
      const leg = new THREE.Mesh(legGeometry, materials.galvanizedSteel);
      
      // Base plate (foot)
      const basePlateGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.03, 16);
      const basePlate = new THREE.Mesh(basePlateGeometry, materials.galvanizedSteel);
      basePlate.position.y = -config.height / 2 - 0.015;
      
      // Top mounting flange with bolts
      const flangeGeometry = new THREE.CylinderGeometry(0.18, 0.18, 0.04, 16);
      const flange = new THREE.Mesh(flangeGeometry, materials.stainless304);
      flange.position.y = config.height / 2 + 0.02;
      
      // Bolt pattern on flange
      for (let b = 0; b < 8; b++) {
        const boltAngle = (b / 8) * Math.PI * 2;
        const boltGeometry = new THREE.CylinderGeometry(0.008, 0.008, 0.06, 8);
        const bolt = new THREE.Mesh(boltGeometry, materials.galvanizedSteel);
        bolt.position.set(
          Math.cos(boltAngle) * 0.14,
          config.height / 2 + 0.05,
          Math.sin(boltAngle) * 0.14
        );
        legAssembly.add(bolt);
      }
      
      // Reinforcement rings
      const ringGeometry = new THREE.TorusGeometry(0.085, 0.008, 8, 16);
      const ring1 = new THREE.Mesh(ringGeometry, materials.galvanizedSteel);
      const ring2 = new THREE.Mesh(ringGeometry, materials.galvanizedSteel);
      ring1.position.y = config.height * 0.25;
      ring2.position.y = -config.height * 0.25;
      
      legAssembly.add(leg, basePlate, flange, ring1, ring2);
    } else {
      // Triangular structural leg
      const legWidth = 0.12;
      const legDepth = 0.12;
      
      // Main vertical beam
      const mainBeamGeometry = new THREE.BoxGeometry(legWidth, config.height, 0.02);
      const mainBeam = new THREE.Mesh(mainBeamGeometry, materials.galvanizedSteel);
      
      // Diagonal braces
      const braceGeometry = new THREE.BoxGeometry(0.015, config.height * 0.8, 0.015);
      const brace1 = new THREE.Mesh(braceGeometry, materials.galvanizedSteel);
      const brace2 = new THREE.Mesh(braceGeometry, materials.galvanizedSteel);
      brace1.position.set(legWidth * 0.3, 0, legDepth * 0.3);
      brace2.position.set(-legWidth * 0.3, 0, legDepth * 0.3);
      brace1.rotation.x = Math.PI / 8;
      brace2.rotation.x = -Math.PI / 8;
      
      // Base plate
      const basePlateGeometry = new THREE.BoxGeometry(legWidth * 1.5, 0.03, legDepth * 1.5);
      const basePlate = new THREE.Mesh(basePlateGeometry, materials.galvanizedSteel);
      basePlate.position.y = -config.height / 2 - 0.015;
      
      legAssembly.add(mainBeam, brace1, brace2, basePlate);
    }
    
    // Position legs around tank perimeter
    const angle = (i / config.count) * Math.PI * 2;
    const distance = tankRadius * 0.85;
    
    legAssembly.position.set(
      Math.cos(angle) * distance,
      tankBounds.min.y - config.height / 2,
      Math.sin(angle) * distance
    );

    legAssembly.castShadow = true;
    legAssembly.receiveShadow = true;
    legGroup.add(legAssembly);
  }

  return legGroup;
};

// Ultra-realistic Thermal Insulation
export const createThermalInsulation = (
  tankMesh: THREE.Object3D,
  config: TankAccessories['thermalInsulation']
) => {
  if (!config.enabled) return null;

  const materials = createMaterials();
  const insulationGroup = new THREE.Group();
  insulationGroup.name = 'thermalInsulation';

  const tankBounds = new THREE.Box3().setFromObject(tankMesh);
  const tankHeight = tankBounds.max.y - tankBounds.min.y;
  const tankRadius = Math.max(
    tankBounds.max.x - tankBounds.min.x,
    tankBounds.max.z - tankBounds.min.z
  ) / 2;

  const innerRadius = tankRadius + 0.02;
  const insulationThickness = config.thickness;
  const outerRadius = innerRadius + insulationThickness;
  
  if (config.showCutaway) {
    // Cutaway view showing layers
    const segments = 48;
    const cutawayAngle = Math.PI * 1.5; // 270 degrees
    
    // Inner insulation layer (mineral wool/polyurethane)
    const insulationGeometry = new THREE.CylinderGeometry(
      outerRadius - 0.01, outerRadius - 0.01, tankHeight, segments, 1, false, 0, cutawayAngle
    );
    const insulation = new THREE.Mesh(insulationGeometry, materials.insulation);
    insulation.position.copy(tankMesh.position);
    
    // Outer protective shell
    const shellMaterial = config.outerShellMaterial === 'aluminum' 
      ? materials.aluminum 
      : materials.insulationCover;
    
    const shellGeometry = new THREE.CylinderGeometry(
      outerRadius, outerRadius, tankHeight, segments, 1, false, 0, cutawayAngle
    );
    const shell = new THREE.Mesh(shellGeometry, shellMaterial);
    shell.position.copy(tankMesh.position);
    
    // Add visible insulation texture
    for (let i = 0; i < 8; i++) {
      const fiberAngle = (i / 8) * cutawayAngle;
      const fiberGeometry = new THREE.CylinderGeometry(
        outerRadius - 0.015, outerRadius - 0.015, tankHeight * 0.1, 8
      );
      const fiber = new THREE.Mesh(fiberGeometry, materials.insulation);
      fiber.position.set(
        Math.cos(fiberAngle) * (outerRadius - 0.02),
        (i - 4) * tankHeight * 0.1,
        Math.sin(fiberAngle) * (outerRadius - 0.02)
      );
      insulationGroup.add(fiber);
    }
    
    insulationGroup.add(insulation, shell);
  } else {
    // Full insulation wrap
    const insulationGeometry = new THREE.CylinderGeometry(
      outerRadius - 0.01, outerRadius - 0.01, tankHeight, 48
    );
    const insulation = new THREE.Mesh(insulationGeometry, materials.insulation);
    insulation.position.copy(tankMesh.position);
    
    // Weather-resistant outer shell with seams
    const shellMaterial = config.outerShellMaterial === 'aluminum' 
      ? materials.aluminum 
      : materials.insulationCover;
    
    const shellGeometry = new THREE.CylinderGeometry(
      outerRadius, outerRadius, tankHeight, 48
    );
    const shell = new THREE.Mesh(shellGeometry, shellMaterial);
    shell.position.copy(tankMesh.position);
    
    // Visible panel seams
    for (let s = 0; s < 8; s++) {
      const seamAngle = (s / 8) * Math.PI * 2;
      const seamGeometry = new THREE.BoxGeometry(0.01, tankHeight, 0.02);
      const seam = new THREE.Mesh(seamGeometry, materials.galvanizedSteel);
      seam.position.set(
        Math.cos(seamAngle) * outerRadius,
        tankMesh.position.y,
        Math.sin(seamAngle) * outerRadius
      );
      insulationGroup.add(seam);
    }
    
    insulationGroup.add(insulation, shell);
  }

  return insulationGroup;
};

// Professional CIP Systems
export const createCipSystems = (
  tankMesh: THREE.Object3D,
  systems: TankAccessories['cipSystems']
) => {
  const materials = createMaterials();
  const cipGroup = new THREE.Group();
  cipGroup.name = 'cipSystems';

  systems.forEach((system, index) => {
    const systemGroup = new THREE.Group();

    if (system.type === 'rotatingHead') {
      // Professional rotating spray head
      const headRadius = system.diameter / 2;
      
      // Main housing
      const housingGeometry = new THREE.CylinderGeometry(headRadius, headRadius * 0.8, 0.1, 16);
      const housing = new THREE.Mesh(housingGeometry, materials.stainless304);
      
      // Rotating nozzle assembly
      const nozzleAssembly = new THREE.Group();
      
      // Central hub
      const hubGeometry = new THREE.SphereGeometry(headRadius * 0.3, 16, 16);
      const hub = new THREE.Mesh(hubGeometry, materials.stainless304);
      
      // Spray arms (4 arms at different angles)
      for (let arm = 0; arm < 4; arm++) {
        const armAngle = (arm / 4) * Math.PI * 2;
        const armGeometry = new THREE.CylinderGeometry(0.008, 0.012, headRadius * 1.2, 8);
        const armMesh = new THREE.Mesh(armGeometry, materials.stainless304);
        armMesh.rotation.z = Math.PI / 2;
        armMesh.position.set(Math.cos(armAngle) * headRadius * 0.6, 0, Math.sin(armAngle) * headRadius * 0.6);
        
        // Spray nozzles on each arm
        for (let nozzle = 0; nozzle < 3; nozzle++) {
          const nozzlePos = (nozzle + 1) * 0.3;
          const nozzleGeometry = new THREE.ConeGeometry(0.004, 0.01, 8);
          const nozzleMesh = new THREE.Mesh(nozzleGeometry, materials.stainless304);
          nozzleMesh.position.set(nozzlePos * headRadius, 0, 0);
          nozzleMesh.rotation.z = -Math.PI / 6; // Angled spray
          armMesh.add(nozzleMesh);
        }
        
        nozzleAssembly.add(armMesh);
      }
      
      nozzleAssembly.add(hub);
      systemGroup.add(housing, nozzleAssembly);
    } else {
      // Static spray ball with precision holes
      const ballGeometry = new THREE.SphereGeometry(system.diameter / 2, 32, 32);
      const ball = new THREE.Mesh(ballGeometry, materials.stainless304);
      
      // Spray holes in optimized pattern
      const holePattern = [
        [0, 1, 0], [0, -1, 0], // top/bottom
        [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1], // sides
        [0.7, 0.7, 0], [-0.7, 0.7, 0], [0.7, -0.7, 0], [-0.7, -0.7, 0] // diagonals
      ];
      
      holePattern.forEach(([x, y, z]) => {
        const holeGeometry = new THREE.CylinderGeometry(0.003, 0.006, 0.02, 8);
        const hole = new THREE.Mesh(holeGeometry, materials.stainless304);
        const direction = new THREE.Vector3(x, y, z).normalize();
        hole.position.copy(direction.multiplyScalar(system.diameter * 0.45));
        hole.lookAt(new THREE.Vector3(0, 0, 0));
        ball.add(hole);
      });
      
      systemGroup.add(ball);
    }

    // Professional connection assembly
    const connectionGroup = new THREE.Group();
    
    // Main connection pipe
    const pipeGeometry = new THREE.CylinderGeometry(0.025, 0.025, 0.2, 16);
    const pipe = new THREE.Mesh(pipeGeometry, materials.stainless304);
    pipe.position.y = -0.1;
    
    // Tri-clamp connection
    const clampGeometry = new THREE.TorusGeometry(0.035, 0.008, 8, 16);
    const clamp = new THREE.Mesh(clampGeometry, materials.stainless304);
    clamp.position.y = -0.18;
    
    // Gasket
    const gasketGeometry = new THREE.TorusGeometry(0.032, 0.003, 8, 16);
    const gasket = new THREE.Mesh(gasketGeometry, materials.rubber);
    gasket.position.y = -0.18;
    
    connectionGroup.add(pipe, clamp, gasket);
    systemGroup.add(connectionGroup);

    systemGroup.position.set(...system.position);
    systemGroup.castShadow = true;
    systemGroup.receiveShadow = true;
    cipGroup.add(systemGroup);
  });

  return cipGroup;
};

// Industrial Pressure Relief Valves
export const createPressureReliefs = (
  tankMesh: THREE.Object3D,
  reliefs: TankAccessories['pressureReliefs']
) => {
  const materials = createMaterials();
  const reliefGroup = new THREE.Group();
  reliefGroup.name = 'pressureReliefs';

  reliefs.forEach((relief, index) => {
    const valveGroup = new THREE.Group();
    const valveRadius = relief.diameter / 2;

    if (relief.type === 'springValve') {
      // Professional spring-loaded relief valve
      
      // Main valve body (casting-like appearance)
      const bodyGeometry = new THREE.CylinderGeometry(
        valveRadius * 1.2, valveRadius, valveRadius * 1.5, 16
      );
      const body = new THREE.Mesh(bodyGeometry, materials.valve);
      
      // Body flanges
      const inletFlangeGeometry = new THREE.CylinderGeometry(valveRadius * 1.8, valveRadius * 1.8, 0.03, 16);
      const inletFlange = new THREE.Mesh(inletFlangeGeometry, materials.stainless304);
      inletFlange.position.y = -valveRadius * 0.75;
      
      // Spring housing (visible through cage)
      const springHousingGeometry = new THREE.CylinderGeometry(
        valveRadius * 0.8, valveRadius * 0.8, valveRadius * 1.2, 16
      );
      const springHousing = new THREE.Mesh(springHousingGeometry, materials.valve);
      springHousing.position.y = valveRadius * 1.2;
      
      // Adjustment cap with hand wheel
      const capGeometry = new THREE.CylinderGeometry(valveRadius * 0.6, valveRadius * 0.6, 0.1, 16);
      const cap = new THREE.Mesh(capGeometry, materials.stainless304);
      cap.position.y = valveRadius * 2.2;
      
      // Hand wheel for adjustment
      const wheelGeometry = new THREE.CylinderGeometry(valveRadius * 1.2, valveRadius * 1.2, 0.05, 8);
      const wheel = new THREE.Mesh(wheelGeometry, materials.stainless304);
      wheel.position.y = valveRadius * 2.35;
      
      // Wheel spokes
      for (let s = 0; s < 8; s++) {
        const spokeAngle = (s / 8) * Math.PI * 2;
        const spokeGeometry = new THREE.BoxGeometry(valveRadius * 2, 0.02, 0.03);
        const spoke = new THREE.Mesh(spokeGeometry, materials.stainless304);
        spoke.rotation.y = spokeAngle;
        spoke.position.y = valveRadius * 2.35;
        valveGroup.add(spoke);
      }
      
      // Outlet pipe (side discharge)
      const outletGeometry = new THREE.CylinderGeometry(valveRadius * 0.8, valveRadius * 0.8, valveRadius * 1.5, 16);
      const outlet = new THREE.Mesh(outletGeometry, materials.stainless304);
      outlet.rotation.z = Math.PI / 2;
      outlet.position.set(valveRadius * 1.2, valveRadius * 0.5, 0);
      
      valveGroup.add(body, inletFlange, springHousing, cap, wheel, outlet);
    } else {
      // Vacuum relief valve (simpler, gravity-operated)
      const bodyGeometry = new THREE.CylinderGeometry(
        valveRadius, valveRadius, valveRadius * 0.8, 16
      );
      const body = new THREE.Mesh(bodyGeometry, materials.valve);
      
      // Hinged disc cover
      const discGeometry = new THREE.CylinderGeometry(valveRadius * 0.9, valveRadius * 0.9, 0.02, 16);
      const disc = new THREE.Mesh(discGeometry, materials.stainless304);
      disc.position.y = valveRadius * 0.45;
      disc.rotation.x = Math.PI / 12; // Slightly open
      
      // Hinge mechanism
      const hingeGeometry = new THREE.CylinderGeometry(0.01, 0.01, valveRadius * 1.8, 8);
      const hinge = new THREE.Mesh(hingeGeometry, materials.stainless304);
      hinge.rotation.z = Math.PI / 2;
      hinge.position.y = valveRadius * 0.4;
      
      valveGroup.add(body, disc, hinge);
    }

    valveGroup.position.set(...relief.position);
    valveGroup.castShadow = true;
    valveGroup.receiveShadow = true;
    reliefGroup.add(valveGroup);
  });

  return reliefGroup;
};

// Professional Level Indicators
export const createLevelIndicators = (
  tankMesh: THREE.Object3D,
  indicators: TankAccessories['levelIndicators']
) => {
  const materials = createMaterials();
  const indicatorGroup = new THREE.Group();
  indicatorGroup.name = 'levelIndicators';

  indicators.forEach((indicator, index) => {
    const indicatorSystem = new THREE.Group();

    // Protective chamber/housing
    const housingGeometry = new THREE.BoxGeometry(0.08, indicator.length + 0.2, 0.08);
    const housing = new THREE.Mesh(housingGeometry, materials.galvanizedSteel);
    
    // Main sight glass tube
    const tubeGeometry = new THREE.CylinderGeometry(0.025, 0.025, indicator.length, 16);
    const tubeMaterial = indicator.material === 'glass' ? materials.glass : materials.plastic;
    const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);

    // Realistic liquid simulation with meniscus
    const liquidHeight = indicator.length * 0.65;
    const liquidGeometry = new THREE.CylinderGeometry(0.023, 0.023, liquidHeight, 16);
    const liquidMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e40af,
      transparent: true,
      opacity: 0.7,
      roughness: 0.1,
    });
    const liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
    liquid.position.y = -indicator.length * 0.175;
    
    // Meniscus effect at liquid surface
    const meniscusGeometry = new THREE.TorusGeometry(0.023, 0.002, 8, 16);
    const meniscus = new THREE.Mesh(meniscusGeometry, liquidMaterial);
    meniscus.position.y = liquidHeight / 2 - indicator.length * 0.175;
    
    // Professional connection fittings with tri-clamps
    const createTriClampConnection = (yPosition: number) => {
      const fittingGroup = new THREE.Group();
      
      const fittingGeometry = new THREE.CylinderGeometry(0.035, 0.035, 0.06, 16);
      const fitting = new THREE.Mesh(fittingGeometry, materials.stainless304);
      
      const clampGeometry = new THREE.TorusGeometry(0.045, 0.008, 8, 16);
      const clamp = new THREE.Mesh(clampGeometry, materials.stainless304);
      
      const gasketGeometry = new THREE.TorusGeometry(0.032, 0.003, 8, 16);
      const gasket = new THREE.Mesh(gasketGeometry, materials.rubber);
      
      fittingGroup.add(fitting, clamp, gasket);
      fittingGroup.position.y = yPosition;
      return fittingGroup;
    };
    
    const topFitting = createTriClampConnection(indicator.length / 2 + 0.03);
    const bottomFitting = createTriClampConnection(-indicator.length / 2 - 0.03);

    // Level indicator specific features
    if (indicator.type === 'radar') {
      // Professional radar level transmitter
      const radarHousingGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.12, 16);
      const radarHousing = new THREE.Mesh(radarHousingGeometry, materials.plastic);
      radarHousing.position.y = indicator.length / 2 + 0.12;
      
      // Antenna/horn
      const antennaGeometry = new THREE.ConeGeometry(0.04, 0.08, 16);
      const antenna = new THREE.Mesh(antennaGeometry, materials.plastic);
      antenna.position.y = indicator.length / 2 + 0.2;
      
      // Control housing with display
      const controlBoxGeometry = new THREE.BoxGeometry(0.12, 0.08, 0.06);
      const controlBox = new THREE.Mesh(controlBoxGeometry, materials.plastic);
      controlBox.position.set(0.1, indicator.length / 2 + 0.12, 0);
      
      indicatorSystem.add(radarHousing, antenna, controlBox);
    } else if (indicator.type === 'float') {
      // Magnetic float level indicator
      const floatChamberGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.15, 16);
      const floatChamber = new THREE.Mesh(floatChamberGeometry, materials.stainless304);
      
      // Magnetic float
      const floatGeometry = new THREE.CylinderGeometry(0.035, 0.035, 0.08, 16);
      const float = new THREE.Mesh(floatGeometry, materials.aluminum);
      float.position.y = -indicator.length * 0.2; // At liquid level
      
      // External magnetic indicator
      const magneticTrackGeometry = new THREE.BoxGeometry(0.03, indicator.length, 0.02);
      const magneticTrack = new THREE.Mesh(magneticTrackGeometry, materials.aluminum);
      magneticTrack.position.x = 0.06;
      
      floatChamber.add(float);
      indicatorSystem.add(floatChamber, magneticTrack);
    }
    
    // Scale markings on housing
    for (let m = 0; m < 10; m++) {
      const markY = (m / 9 - 0.5) * indicator.length;
      const markGeometry = new THREE.BoxGeometry(0.02, 0.002, 0.001);
      const mark = new THREE.Mesh(markGeometry, materials.stainless304);
      mark.position.set(0.042, markY, 0);
      housing.add(mark);
    }

    indicatorSystem.add(housing, tube, liquid, meniscus, topFitting, bottomFitting);
    indicatorSystem.position.set(...indicator.position);
    indicatorSystem.castShadow = true;
    indicatorSystem.receiveShadow = true;
    indicatorGroup.add(indicatorSystem);
  });

  return indicatorGroup;
};

// Professional Industrial Hatches
export const createHatches = (
  tankMesh: THREE.Object3D,
  hatches: TankAccessories['hatches']
) => {
  const materials = createMaterials();
  const hatchGroup = new THREE.Group();
  hatchGroup.name = 'hatches';

  hatches.forEach((hatch, index) => {
    const hatchSystem = new THREE.Group();

    if (hatch.shape === 'round') {
      // Professional round manhole with pressure rating
      const radius = hatch.diameter! / 2;
      
      // Main hatch cover with dished design
      const coverGeometry = new THREE.CylinderGeometry(radius, radius * 0.95, 0.08, 32);
      const cover = new THREE.Mesh(coverGeometry, materials.stainless304);
      
      // Reinforcement ribs on cover
      for (let rib = 0; rib < 4; rib++) {
        const ribAngle = (rib / 4) * Math.PI * 2;
        const ribGeometry = new THREE.BoxGeometry(radius * 1.8, 0.02, 0.03);
        const ribMesh = new THREE.Mesh(ribGeometry, materials.stainless304);
        ribMesh.rotation.y = ribAngle;
        ribMesh.position.y = 0.05;
        cover.add(ribMesh);
      }
      
      // Davit arm for lifting (professional feature)
      const davitGeometry = new THREE.CylinderGeometry(0.02, 0.02, radius * 1.5, 8);
      const davit = new THREE.Mesh(davitGeometry, materials.galvanizedSteel);
      davit.rotation.z = Math.PI / 3;
      davit.position.set(radius * 0.8, 0.1, 0);
      
      // Swing bolt clamps (6-8 around perimeter)
      const clampCount = Math.max(6, Math.floor(radius * 12));
      for (let i = 0; i < clampCount; i++) {
        const clampAngle = (i / clampCount) * Math.PI * 2;
        
        // Clamp bracket
        const bracketGeometry = new THREE.BoxGeometry(0.04, 0.06, 0.02);
        const bracket = new THREE.Mesh(bracketGeometry, materials.stainless304);
        bracket.position.set(
          Math.cos(clampAngle) * radius * 0.95,
          0.03,
          Math.sin(clampAngle) * radius * 0.95
        );
        
        // Swing bolt
        const boltGeometry = new THREE.CylinderGeometry(0.008, 0.008, 0.08, 8);
        const bolt = new THREE.Mesh(boltGeometry, materials.galvanizedSteel);
        bolt.rotation.x = Math.PI / 2;
        bolt.position.z = 0.04;
        
        // Wing nut
        const nutGeometry = new THREE.BoxGeometry(0.03, 0.015, 0.015);
        const nut = new THREE.Mesh(nutGeometry, materials.galvanizedSteel);
        nut.position.z = 0.08;
        bolt.add(nut);
        
        bracket.add(bolt);
        cover.add(bracket);
      }
      
      // Gasket groove
      const gasketGeometry = new THREE.TorusGeometry(radius * 0.85, 0.008, 8, 32);
      const gasket = new THREE.Mesh(gasketGeometry, materials.rubber);
      gasket.position.y = -0.04;
      
      // Nozzle neck extending into tank
      const neckGeometry = new THREE.CylinderGeometry(radius * 0.9, radius * 0.9, 0.15, 32);
      const neck = new THREE.Mesh(neckGeometry, materials.stainless304);
      neck.position.y = -0.12;
      
      hatchSystem.add(cover, davit, gasket, neck);
    } else {
      // Rectangular access hatch with hinges
      const width = hatch.width!;
      const height = hatch.height!;
      
      // Main cover plate
      const coverGeometry = new THREE.BoxGeometry(width, height, 0.06);
      const cover = new THREE.Mesh(coverGeometry, materials.stainless304);
      
      // Frame around opening
      const frameThickness = 0.04;
      const frameGeometry = new THREE.BoxGeometry(
        width + frameThickness * 2, 
        height + frameThickness * 2, 
        frameThickness
      );
      const frame = new THREE.Mesh(frameGeometry, materials.stainless304);
      frame.position.y = -frameThickness / 2 - 0.03;
      
      // Heavy-duty hinges
      const hingeCount = Math.max(2, Math.floor(height / 0.3));
      for (let h = 0; h < hingeCount; h++) {
        const hingeY = (h / (hingeCount - 1) - 0.5) * height * 0.8;
        
        // Hinge pin
        const pinGeometry = new THREE.CylinderGeometry(0.01, 0.01, width * 0.15, 8);
        const pin = new THREE.Mesh(pinGeometry, materials.galvanizedSteel);
        pin.rotation.z = Math.PI / 2;
        pin.position.set(-width / 2 - 0.02, hingeY, 0);
        
        // Hinge leaves
        const leafGeometry = new THREE.BoxGeometry(0.05, 0.08, 0.02);
        const leaf1 = new THREE.Mesh(leafGeometry, materials.stainless304);
        const leaf2 = new THREE.Mesh(leafGeometry, materials.stainless304);
        leaf1.position.set(-width / 2 - 0.025, hingeY, 0.01);
        leaf2.position.set(-width / 2 - 0.025, hingeY, -0.01);
        
        hatchSystem.add(pin, leaf1, leaf2);
      }
      
      // Locking mechanism
      const lockGeometry = new THREE.BoxGeometry(0.08, 0.04, 0.03);
      const lock = new THREE.Mesh(lockGeometry, materials.brass);
      lock.position.set(width / 2 - 0.04, 0, 0.04);
      
      hatchSystem.add(cover, frame, lock);
    }

    hatchSystem.position.set(...hatch.position);
    hatchSystem.castShadow = true;
    hatchSystem.receiveShadow = true;
    hatchGroup.add(hatchSystem);
  });

  return hatchGroup;
};

// Professional Drain Systems
export const createDrains = (
  tankMesh: THREE.Object3D,
  drains: TankAccessories['drains']
) => {
  const materials = createMaterials();
  const drainGroup = new THREE.Group();
  drainGroup.name = 'drains';

  drains.forEach((drain, index) => {
    const drainSystem = new THREE.Group();
    const drainRadius = drain.diameter / 2;

    // Drain nozzle with sloped bottom connection
    const nozzleGeometry = new THREE.CylinderGeometry(drainRadius, drainRadius * 1.2, 0.2, 16);
    const nozzle = new THREE.Mesh(nozzleGeometry, materials.stainless304);
    
    // Reinforcement pad around nozzle
    const padGeometry = new THREE.CylinderGeometry(drainRadius * 2, drainRadius * 2, 0.01, 16);
    const pad = new THREE.Mesh(padGeometry, materials.stainless304);
    pad.position.y = 0.105;

    if (drain.hasFlange) {
      // Professional flanged connection
      const flangeGeometry = new THREE.CylinderGeometry(drainRadius * 2.5, drainRadius * 2.5, 0.04, 16);
      const flange = new THREE.Mesh(flangeGeometry, materials.stainless304);
      flange.position.y = -0.14;
      
      // Flange bolts
      const boltCount = Math.max(4, Math.floor(drainRadius * 16));
      for (let b = 0; b < boltCount; b++) {
        const boltAngle = (b / boltCount) * Math.PI * 2;
        const boltGeometry = new THREE.CylinderGeometry(0.006, 0.006, 0.08, 8);
        const bolt = new THREE.Mesh(boltGeometry, materials.galvanizedSteel);
        bolt.position.set(
          Math.cos(boltAngle) * drainRadius * 2.2,
          -0.14,
          Math.sin(boltAngle) * drainRadius * 2.2
        );
        
        // Hex nut
        const nutGeometry = new THREE.CylinderGeometry(0.012, 0.012, 0.008, 6);
        const nut = new THREE.Mesh(nutGeometry, materials.galvanizedSteel);
        nut.position.y = -0.04;
        bolt.add(nut);
        
        drainSystem.add(bolt);
      }
      
      // Gasket
      const gasketGeometry = new THREE.TorusGeometry(drainRadius * 2.2, 0.003, 8, 16);
      const gasket = new THREE.Mesh(gasketGeometry, materials.rubber);
      gasket.position.y = -0.12;
      
      drainSystem.add(flange, gasket);
    }

    // Valve assembly based on type
    if (drain.valveType === 'ball') {
      // Professional ball valve with full port
      const bodyGeometry = new THREE.SphereGeometry(drainRadius * 1.8, 16, 16);
      const body = new THREE.Mesh(bodyGeometry, materials.valve);
      body.position.y = -0.25;
      
      // Ball inside (visible through body)
      const ballGeometry = new THREE.SphereGeometry(drainRadius * 1.2, 16, 16);
      const ball = new THREE.Mesh(ballGeometry, materials.stainless304);
      ball.position.y = -0.25;
      
      // Valve stem and handle
      const stemGeometry = new THREE.CylinderGeometry(0.008, 0.008, 0.08, 8);
      const stem = new THREE.Mesh(stemGeometry, materials.stainless304);
      stem.position.set(0, -0.15, 0);
      
      // Lever handle
      const handleGeometry = new THREE.BoxGeometry(drainRadius * 4, 0.02, 0.04);
      const handle = new THREE.Mesh(handleGeometry, materials.galvanizedSteel);
      handle.position.y = -0.12;
      handle.rotation.z = Math.PI / 6; // Partially open position
      
      // Handle grip
      const gripGeometry = new THREE.CylinderGeometry(0.015, 0.015, drainRadius * 3.5, 8);
      const grip = new THREE.Mesh(gripGeometry, materials.rubber);
      grip.rotation.z = Math.PI / 2;
      handle.add(grip);
      
      drainSystem.add(body, ball, stem, handle);
    } else if (drain.valveType === 'butterfly') {
      // Butterfly valve with wafer design
      const bodyGeometry = new THREE.CylinderGeometry(drainRadius * 1.5, drainRadius * 1.5, 0.12, 16);
      const body = new THREE.Mesh(bodyGeometry, materials.valve);
      body.position.y = -0.22;
      
      // Butterfly disc
      const discGeometry = new THREE.CircleGeometry(drainRadius * 1.4, 32);
      const discMaterial = new THREE.MeshStandardMaterial({ 
        ...materials.stainless304,
        side: THREE.DoubleSide 
      });
      const disc = new THREE.Mesh(discGeometry, discMaterial);
      disc.position.y = -0.22;
      disc.rotation.z = Math.PI / 4; // Partially open
      
      // Actuator and shaft
      const shaftGeometry = new THREE.CylinderGeometry(0.01, 0.01, drainRadius * 3, 8);
      const shaft = new THREE.Mesh(shaftGeometry, materials.stainless304);
      shaft.rotation.z = Math.PI / 2;
      shaft.position.y = -0.22;
      
      // Actuator housing
      const actuatorGeometry = new THREE.BoxGeometry(0.08, 0.12, 0.06);
      const actuator = new THREE.Mesh(actuatorGeometry, materials.aluminum);
      actuator.position.set(drainRadius * 1.8, -0.22, 0);
      
      drainSystem.add(body, disc, shaft, actuator);
    }

    drainSystem.add(nozzle, pad);
    drainSystem.position.set(...drain.position);
    drainSystem.castShadow = true;
    drainSystem.receiveShadow = true;
    drainGroup.add(drainSystem);
  });

  return drainGroup;
};

// Industrial Flanges with Professional Details
export const createFlanges = (
  tankMesh: THREE.Object3D,
  flanges: TankAccessories['flanges']
) => {
  const materials = createMaterials();
  const flangeGroup = new THREE.Group();
  flangeGroup.name = 'flanges';

  flanges.forEach((flange, index) => {
    const flangeSystem = new THREE.Group();

    // Parse DN size and determine dimensions
    const nominalSize = parseInt(flange.size.replace('DN', ''));
    const innerDiameter = nominalSize / 1000; // Convert to meters
    const outerDiameter = innerDiameter * 2.2; // Standard ratio
    const thickness = Math.max(0.02, innerDiameter * 0.1);
    
    // Main flange body with proper proportions
    const flangeGeometry = new THREE.CylinderGeometry(
      outerDiameter / 2, outerDiameter / 2, thickness, 32
    );
    const flangeMesh = new THREE.Mesh(flangeGeometry, materials.stainless304);
    
    // Raised face (for sealing)
    const raisedFaceGeometry = new THREE.CylinderGeometry(
      innerDiameter * 0.8, innerDiameter * 0.8, 0.003, 32
    );
    const raisedFace = new THREE.Mesh(raisedFaceGeometry, materials.stainless304);
    raisedFace.position.y = thickness / 2 + 0.0015;
    
    // Bolt circle and bolts
    const boltCount = flange.boltCount || Math.max(4, Math.floor(nominalSize / 25) * 4);
    const boltCircleDiameter = outerDiameter * 0.85;
    
    for (let i = 0; i < boltCount; i++) {
      const angle = (i / boltCount) * Math.PI * 2;
      
      // Bolt hole
      const holeGeometry = new THREE.CylinderGeometry(0.008, 0.008, thickness * 1.1, 8);
      const hole = new THREE.Mesh(holeGeometry, materials.stainless304);
      hole.position.set(
        Math.cos(angle) * boltCircleDiameter / 2,
        0,
        Math.sin(angle) * boltCircleDiameter / 2
      );
      
      // Actual bolt with head and threading
      const boltGeometry = new THREE.CylinderGeometry(0.006, 0.006, thickness + 0.04, 8);
      const bolt = new THREE.Mesh(boltGeometry, materials.galvanizedSteel);
      bolt.position.set(
        Math.cos(angle) * boltCircleDiameter / 2,
        thickness / 2 + 0.02,
        Math.sin(angle) * boltCircleDiameter / 2
      );
      
      // Hex bolt head
      const headGeometry = new THREE.CylinderGeometry(0.012, 0.012, 0.008, 6);
      const head = new THREE.Mesh(headGeometry, materials.galvanizedSteel);
      head.position.y = thickness / 2 + 0.04;
      bolt.add(head);
      
      // Washer
      const washerGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.002, 16);
      const washer = new THREE.Mesh(washerGeometry, materials.galvanizedSteel);
      washer.position.y = thickness / 2 + 0.035;
      bolt.add(washer);
      
      flangeSystem.add(hole, bolt);
    }
    
    // Weld preparation groove
    const weldGrooveGeometry = new THREE.TorusGeometry(innerDiameter * 0.6, 0.003, 8, 32);
    const weldGroove = new THREE.Mesh(weldGrooveGeometry, materials.stainless304);
    weldGroove.position.y = -thickness / 2 - 0.001;
    
    // Pipe stub for welded flanges
    if (flange.type === 'welded') {
      const stubGeometry = new THREE.CylinderGeometry(
        innerDiameter / 2, innerDiameter / 2, 0.15, 32
      );
      const stub = new THREE.Mesh(stubGeometry, materials.stainless304);
      stub.position.y = -thickness / 2 - 0.075;
      flangeSystem.add(stub);
    }
    
    // Identification marking
    const markingCanvas = document.createElement('canvas');
    const markingContext = markingCanvas.getContext('2d')!;
    markingCanvas.width = 128;
    markingCanvas.height = 32;
    markingContext.fillStyle = '#000000';
    markingContext.font = '12px Arial';
    markingContext.fillText(`${flange.size} ${flange.type.toUpperCase()}`, 10, 20);
    
    const markingTexture = new THREE.CanvasTexture(markingCanvas);
    const markingMaterial = new THREE.MeshBasicMaterial({ map: markingTexture });
    const markingGeometry = new THREE.PlaneGeometry(0.1, 0.025);
    const marking = new THREE.Mesh(markingGeometry, markingMaterial);
    marking.position.set(0, thickness / 2 + 0.001, outerDiameter * 0.3);
    marking.rotation.x = -Math.PI / 2;

    // Orientation adjustment
    if (flange.orientation === 'vertical') {
      flangeSystem.rotation.x = Math.PI / 2;
    } else if (flange.orientation === 'angled') {
      flangeSystem.rotation.x = Math.PI / 4;
      flangeSystem.rotation.z = Math.PI / 6;
    }

    flangeSystem.add(flangeMesh, raisedFace, weldGroove, marking);
    flangeSystem.position.set(...flange.position);
    flangeSystem.castShadow = true;
    flangeSystem.receiveShadow = true;
    flangeGroup.add(flangeSystem);
  });

  return flangeGroup;
};

// Professional Agitator Systems
export const createAgitators = (
  tankMesh: THREE.Object3D,
  agitators: TankAccessories['agitators']
) => {
  const materials = createMaterials();
  const agitatorGroup = new THREE.Group();
  agitatorGroup.name = 'agitators';

  agitators.forEach((agitator, index) => {
    const agitatorSystem = new THREE.Group();

    // Professional motor housing with cooling fins
    const motorGeometry = new THREE.CylinderGeometry(0.25, 0.22, 0.4, 16);
    const motor = new THREE.Mesh(motorGeometry, materials.aluminum);
    motor.position.y = 0.2;
    
    // Cooling fins around motor
    for (let fin = 0; fin < 12; fin++) {
      const finAngle = (fin / 12) * Math.PI * 2;
      const finGeometry = new THREE.BoxGeometry(0.02, 0.35, 0.003);
      const finMesh = new THREE.Mesh(finGeometry, materials.aluminum);
      finMesh.position.set(
        Math.cos(finAngle) * 0.26,
        0.2,
        Math.sin(finAngle) * 0.26
      );
      agitatorSystem.add(finMesh);
    }
    
    // Motor nameplate
    const nameplateGeometry = new THREE.BoxGeometry(0.15, 0.08, 0.002);
    const nameplate = new THREE.Mesh(nameplateGeometry, materials.aluminum);
    nameplate.position.set(0.27, 0.2, 0);
    
    // Gearbox (for high-torque applications)
    const gearboxGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.3);
    const gearbox = new THREE.Mesh(gearboxGeometry, materials.valve);
    gearbox.position.y = -0.1;
    
    // Shaft with proper mechanical seal
    const shaftGeometry = new THREE.CylinderGeometry(0.03, 0.03, agitator.shaftLength, 16);
    const shaft = new THREE.Mesh(shaftGeometry, materials.stainless304);
    shaft.position.y = -agitator.shaftLength / 2 - 0.2;
    
    // Mechanical seal housing
    const sealHousingGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.12, 16);
    const sealHousing = new THREE.Mesh(sealHousingGeometry, materials.stainless304);
    sealHousing.position.y = -0.26;
    
    // Shaft bearing supports along length
    const bearingCount = Math.max(1, Math.floor(agitator.shaftLength / 1.5));
    for (let b = 0; b < bearingCount; b++) {
      const bearingY = -0.4 - (b / bearingCount) * agitator.shaftLength * 0.8;
      const bearingGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.08, 16);
      const bearing = new THREE.Mesh(bearingGeometry, materials.galvanizedSteel);
      bearing.position.y = bearingY;
      agitatorSystem.add(bearing);
    }

    // Impeller assembly based on type
    const impellerY = -agitator.shaftLength - 0.3;
    let impellerAssembly: THREE.Group;

    if (agitator.impellerType === 'propeller') {
      // Marine-type propeller with hydrodynamic design
      impellerAssembly = new THREE.Group();
      
      const hubGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.15, 16);
      const hub = new THREE.Mesh(hubGeometry, materials.stainless304);
      
      // Three blades with proper pitch
      for (let blade = 0; blade < 3; blade++) {
        const bladeAngle = (blade / 3) * Math.PI * 2;
        
        // Blade with twisted geometry for efficiency
        const bladeGeometry = new THREE.BoxGeometry(0.6, 0.02, 0.15);
        const bladeMesh = new THREE.Mesh(bladeGeometry, materials.stainless304);
        bladeMesh.position.set(Math.cos(bladeAngle) * 0.3, 0, Math.sin(bladeAngle) * 0.3);
        bladeMesh.rotation.y = bladeAngle;
        bladeMesh.rotation.x = Math.PI / 6; // Pitch angle for thrust
        
        // Blade reinforcement
        const reinforcementGeometry = new THREE.BoxGeometry(0.5, 0.04, 0.02);
        const reinforcement = new THREE.Mesh(reinforcementGeometry, materials.stainless304);
        reinforcement.position.x = 0.2;
        bladeMesh.add(reinforcement);
        
        impellerAssembly.add(bladeMesh);
      }
      
      impellerAssembly.add(hub);
    } else if (agitator.impellerType === 'paddle') {
      // Flat blade turbine with multiple paddles
      impellerAssembly = new THREE.Group();
      
      const hubGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.06, 16);
      const hub = new THREE.Mesh(hubGeometry, materials.stainless304);
      
      // 6 flat paddles for high shear
      for (let paddle = 0; paddle < 6; paddle++) {
        const paddleAngle = (paddle / 6) * Math.PI * 2;
        const paddleGeometry = new THREE.BoxGeometry(0.8, 0.25, 0.02);
        const paddleMesh = new THREE.Mesh(paddleGeometry, materials.stainless304);
        paddleMesh.position.set(Math.cos(paddleAngle) * 0.4, 0, Math.sin(paddleAngle) * 0.4);
        paddleMesh.rotation.y = paddleAngle;
        impellerAssembly.add(paddleMesh);
      }
      
      impellerAssembly.add(hub);
    } else { // anchor
      // Anchor impeller for high viscosity fluids
      impellerAssembly = new THREE.Group();
      
      // Central shaft extension
      const anchorShaftGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8);
      const anchorShaft = new THREE.Mesh(anchorShaftGeometry, materials.stainless304);
      
      // Anchor arms following tank contour
      const armGeometry = new THREE.TorusGeometry(0.6, 0.03, 8, 16, Math.PI * 1.8);
      const arm = new THREE.Mesh(armGeometry, materials.stainless304);
      
      // Vertical scraper blades
      for (let scraper = 0; scraper < 4; scraper++) {
        const scraperAngle = (scraper / 4) * Math.PI * 2;
        const scraperGeometry = new THREE.BoxGeometry(0.02, 0.4, 0.01);
        const scraperMesh = new THREE.Mesh(scraperGeometry, materials.stainless304);
        scraperMesh.position.set(
          Math.cos(scraperAngle) * 0.6,
          0,
          Math.sin(scraperAngle) * 0.6
        );
        impellerAssembly.add(scraperMesh);
      }
      
      impellerAssembly.add(anchorShaft, arm);
    }

    impellerAssembly.position.y = impellerY;
    
    agitatorSystem.add(motor, nameplate, gearbox, shaft, sealHousing, impellerAssembly);
    agitatorSystem.position.set(...agitator.position);
    agitatorSystem.castShadow = true;
    agitatorSystem.receiveShadow = true;
    agitatorGroup.add(agitatorSystem);
  });

  return agitatorGroup;
};

// Industrial Access Ladders
export const createLadders = (
  tankMesh: THREE.Object3D,
  ladders: TankAccessories['ladders']
) => {
  const materials = createMaterials();
  const ladderGroup = new THREE.Group();
  ladderGroup.name = 'ladders';

  const tankBounds = new THREE.Box3().setFromObject(tankMesh);
  const tankRadius = Math.max(
    tankBounds.max.x - tankBounds.min.x,
    tankBounds.max.z - tankBounds.min.z
  ) / 2;

  ladders.forEach((ladder, index) => {
    const ladderSystem = new THREE.Group();

    // Professional ladder rails with proper spacing
    const railGeometry = new THREE.CylinderGeometry(0.025, 0.025, ladder.height, 8);
    const leftRail = new THREE.Mesh(railGeometry, materials.galvanizedSteel);
    const rightRail = new THREE.Mesh(railGeometry, materials.galvanizedSteel);
    
    leftRail.position.set(-0.2, ladder.height / 2, 0);
    rightRail.position.set(0.2, ladder.height / 2, 0);

    // Rungs with anti-slip surface
    const rungSpacing = 0.3; // 300mm spacing per OSHA standards
    const rungCount = Math.floor(ladder.height / rungSpacing);
    
    for (let i = 0; i < rungCount; i++) {
      const rungY = (i / (rungCount - 1)) * ladder.height;
      
      // Main rung
      const rungGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8);
      const rung = new THREE.Mesh(rungGeometry, materials.galvanizedSteel);
      rung.rotation.z = Math.PI / 2;
      rung.position.y = rungY;
      
      // Anti-slip serrations
      for (let s = 0; s < 8; s++) {
        const serrationGeometry = new THREE.BoxGeometry(0.42, 0.003, 0.01);
        const serration = new THREE.Mesh(serrationGeometry, materials.galvanizedSteel);
        serration.position.set(0, (s - 4) * 0.005, 0.022);
        serration.rotation.z = Math.PI / 2;
        rung.add(serration);
      }
      
      ladderSystem.add(rung);
    }

    // Safety cage (for ladders over 6m)
    if (ladder.height > 6) {
      const cageHeight = ladder.height - 2.5; // Start 2.5m from bottom
      const cageGeometry = new THREE.CylinderGeometry(0.8, 0.8, cageHeight, 8, 1, true);
      const cage = new THREE.Mesh(cageGeometry, materials.galvanizedSteel);
      cage.position.y = cageHeight / 2 + 2.5;
      
      // Cage hoops every 1.5m
      const hoopCount = Math.floor(cageHeight / 1.5);
      for (let h = 0; h < hoopCount; h++) {
        const hoopY = (h / hoopCount) * cageHeight + 2.5;
        const hoopGeometry = new THREE.TorusGeometry(0.8, 0.02, 8, 16);
        const hoop = new THREE.Mesh(hoopGeometry, materials.galvanizedSteel);
        hoop.position.y = hoopY;
        ladderSystem.add(hoop);
      }
      
      ladderSystem.add(cage);
    }

    // Platform with safety features
    if (ladder.withPlatform) {
      const platformWidth = ladder.platformWidth || 1.2;
      const platformDepth = 0.8;
      
      // Main platform deck with drainage holes
      const platformGeometry = new THREE.BoxGeometry(platformWidth, 0.06, platformDepth);
      const platform = new THREE.Mesh(platformGeometry, materials.galvanizedSteel);
      platform.position.y = ladder.height + 0.03;
      
      // Drainage holes
      for (let dx = 0; dx < 5; dx++) {
        for (let dz = 0; dz < 3; dz++) {
          const holeGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.07, 8);
          const hole = new THREE.Mesh(holeGeometry, materials.galvanizedSteel);
          hole.position.set(
            (dx - 2) * platformWidth * 0.2,
            ladder.height + 0.03,
            (dz - 1) * platformDepth * 0.25
          );
          ladderSystem.add(hole);
        }
      }
      
      // Safety railings with proper height (1100mm minimum)
      const railingHeight = 1.1;
      const railingGeometry = new THREE.CylinderGeometry(0.025, 0.025, railingHeight, 8);
      
      // Corner posts
      const corners = [
        [platformWidth / 2, platformDepth / 2],
        [-platformWidth / 2, platformDepth / 2],
        [platformWidth / 2, -platformDepth / 2],
        [-platformWidth / 2, -platformDepth / 2]
      ];
      
      corners.forEach(([x, z]) => {
        const post = new THREE.Mesh(railingGeometry, materials.galvanizedSteel);
        post.position.set(x, ladder.height + railingHeight / 2, z);
        ladderSystem.add(post);
      });
      
      // Top rail
      const topRailGeometry = new THREE.CylinderGeometry(0.02, 0.02, platformWidth + 0.1, 8);
      const topRailFront = new THREE.Mesh(topRailGeometry, materials.galvanizedSteel);
      const topRailBack = new THREE.Mesh(topRailGeometry, materials.galvanizedSteel);
      topRailFront.rotation.z = Math.PI / 2;
      topRailBack.rotation.z = Math.PI / 2;
      topRailFront.position.set(0, ladder.height + railingHeight, platformDepth / 2);
      topRailBack.position.set(0, ladder.height + railingHeight, -platformDepth / 2);
      
      // Mid rail for additional safety
      const midRailFront = topRailFront.clone();
      const midRailBack = topRailBack.clone();
      midRailFront.position.y = ladder.height + railingHeight / 2;
      midRailBack.position.y = ladder.height + railingHeight / 2;
      
      // Kick plate (toe board)
      const kickPlateGeometry = new THREE.BoxGeometry(platformWidth, 0.15, 0.02);
      const kickPlateFront = new THREE.Mesh(kickPlateGeometry, materials.galvanizedSteel);
      const kickPlateBack = new THREE.Mesh(kickPlateGeometry, materials.galvanizedSteel);
      kickPlateFront.position.set(0, ladder.height + 0.15, platformDepth / 2);
      kickPlateBack.position.set(0, ladder.height + 0.15, -platformDepth / 2);
      
      ladderSystem.add(
        platform, topRailFront, topRailBack, midRailFront, midRailBack, 
        kickPlateFront, kickPlateBack
      );
    }

    // Position based on side
    let xPos = 0;
    let zPos = tankRadius + 0.3;
    if (ladder.side === 'left') {
      xPos = -tankRadius - 0.3;
      zPos = 0;
    } else if (ladder.side === 'right') {
      xPos = tankRadius + 0.3;
      zPos = 0;
    }

    ladderSystem.add(leftRail, rightRail);
    ladderSystem.position.set(xPos, tankBounds.min.y, zPos);
    ladderSystem.castShadow = true;
    ladderSystem.receiveShadow = true;
    ladderGroup.add(ladderSystem);
  });

  return ladderGroup;
};

// Labels Implementation
export const createLabels = (
  tankMesh: THREE.Object3D,
  labels: TankAccessories['labels']
) => {
  const labelGroup = new THREE.Group();
  labelGroup.name = 'labels';

  labels.forEach((label, index) => {
    // Create canvas for text rendering
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 256;
    canvas.height = 128;

    // Style based on label type
    let bgColor = '#ffffff';
    let textColor = '#000000';
    let borderColor = '#cccccc';

    if (label.type === 'warning') {
      bgColor = '#fbbf24';
      textColor = '#000000';
      borderColor = '#f59e0b';
    } else if (label.type === 'info') {
      bgColor = '#3b82f6';
      textColor = '#ffffff';
      borderColor = '#2563eb';
    }

    // Draw label background
    context.fillStyle = bgColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw border
    context.strokeStyle = borderColor;
    context.lineWidth = 4;
    context.strokeRect(0, 0, canvas.width, canvas.height);

    // Draw text
    context.fillStyle = textColor;
    context.font = `${label.fontSize || 16}px Arial`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(label.text, canvas.width / 2, canvas.height / 2);

    // Create texture and material
    const texture = new THREE.CanvasTexture(canvas);
    const labelMaterial = new THREE.MeshBasicMaterial({ 
      map: texture,
      transparent: true,
    });

    // Create label geometry
    const labelGeometry = new THREE.PlaneGeometry(0.3, 0.15);
    const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);
    
    labelMesh.position.set(...label.position);
    labelMesh.lookAt(0, label.position[1], 0); // Face camera
    labelGroup.add(labelMesh);
  });

  return labelGroup;
};

// Sensors Implementation
export const createSensors = (
  tankMesh: THREE.Object3D,
  sensors: TankAccessories['sensors']
) => {
  const materials = createMaterials();
  const sensorGroup = new THREE.Group();
  sensorGroup.name = 'sensors';

  sensors.forEach((sensor, index) => {
    const sensorSystem = new THREE.Group();

    // Sensor body based on type
    let sensorGeometry: THREE.BufferGeometry;
    let sensorMesh: THREE.Mesh;

    switch (sensor.type) {
      case 'temperature':
        sensorGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.15, 8);
        sensorMesh = new THREE.Mesh(sensorGeometry, materials.stainless304);
        break;
      case 'pressure':
        sensorGeometry = new THREE.BoxGeometry(0.05, 0.05, 0.08);
        sensorMesh = new THREE.Mesh(sensorGeometry, materials.stainless304);
        break;
      case 'levelRadar':
        sensorGeometry = new THREE.ConeGeometry(0.03, 0.1, 8);
        sensorMesh = new THREE.Mesh(sensorGeometry, materials.plastic);
        break;
      case 'flow':
        sensorGeometry = new THREE.CylinderGeometry(0.025, 0.025, 0.1, 8);
        sensorMesh = new THREE.Mesh(sensorGeometry, materials.stainless304);
        break;
      default:
        sensorGeometry = new THREE.BoxGeometry(0.03, 0.03, 0.03);
        sensorMesh = new THREE.Mesh(sensorGeometry, materials.plastic);
    }

    // Connection based on type
    if (sensor.connectionType === 'flange') {
      const flangeGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.01, 16);
      const flange = new THREE.Mesh(flangeGeometry, materials.stainless304);
      flange.position.z = -0.05;
      sensorSystem.add(flange);
    } else if (sensor.connectionType === 'thread') {
      const threadGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.03, 8);
      const thread = new THREE.Mesh(threadGeometry, materials.stainless304);
      thread.position.z = -0.02;
      sensorSystem.add(thread);
    }

    // Cable connection
    const cableGeometry = new THREE.CylinderGeometry(0.005, 0.005, 0.5, 8);
    const cable = new THREE.Mesh(cableGeometry, materials.rubber);
    cable.position.set(0.05, 0, 0);
    cable.rotation.z = Math.PI / 2;

    sensorSystem.add(sensorMesh, cable);
    sensorSystem.position.set(...sensor.position);
    sensorSystem.castShadow = true;
    sensorSystem.receiveShadow = true;
    sensorGroup.add(sensorSystem);
  });

  return sensorGroup;
};

// Main function to add all accessories to tank
export const addAccessories = (
  tankMesh: THREE.Object3D,
  accessories: TankAccessories
): THREE.Group => {
  const accessoryGroup = new THREE.Group();
  accessoryGroup.name = 'tankAccessories';

  // Add each accessory type
  const supportLegs = createSupportLegs(tankMesh, accessories.supportLegs);
  if (supportLegs) accessoryGroup.add(supportLegs);

  const thermalInsulation = createThermalInsulation(tankMesh, accessories.thermalInsulation);
  if (thermalInsulation) accessoryGroup.add(thermalInsulation);

  const cipSystems = createCipSystems(tankMesh, accessories.cipSystems);
  if (cipSystems) accessoryGroup.add(cipSystems);

  const pressureReliefs = createPressureReliefs(tankMesh, accessories.pressureReliefs);
  if (pressureReliefs) accessoryGroup.add(pressureReliefs);

  const levelIndicators = createLevelIndicators(tankMesh, accessories.levelIndicators);
  if (levelIndicators) accessoryGroup.add(levelIndicators);

  const hatches = createHatches(tankMesh, accessories.hatches);
  if (hatches) accessoryGroup.add(hatches);

  const drains = createDrains(tankMesh, accessories.drains);
  if (drains) accessoryGroup.add(drains);

  const flanges = createFlanges(tankMesh, accessories.flanges);
  if (flanges) accessoryGroup.add(flanges);

  const agitators = createAgitators(tankMesh, accessories.agitators);
  if (agitators) accessoryGroup.add(agitators);

  const ladders = createLadders(tankMesh, accessories.ladders);
  if (ladders) accessoryGroup.add(ladders);

  const labels = createLabels(tankMesh, accessories.labels);
  if (labels) accessoryGroup.add(labels);

  const sensors = createSensors(tankMesh, accessories.sensors);
  if (sensors) accessoryGroup.add(sensors);

  // Add the accessory group to the tank
  tankMesh.add(accessoryGroup);

  return accessoryGroup;
};

// Helper function to toggle individual accessories
export const toggleAccessory = (
  accessoryGroup: THREE.Group,
  accessoryName: keyof TankAccessories,
  visible: boolean
): void => {
  const accessory = accessoryGroup.getObjectByName(accessoryName);
  if (accessory) {
    accessory.visible = visible;
  }
};

// Helper function to update accessory properties dynamically
export const updateAccessoryProperties = (
  accessoryGroup: THREE.Group,
  accessoryName: keyof TankAccessories,
  properties: Partial<TankAccessories[keyof TankAccessories]>
): void => {
  const accessory = accessoryGroup.getObjectByName(accessoryName);
  if (accessory) {
    // This would require more specific implementation based on accessory type
    // For now, we'll just update visibility and scale as examples
    if ('enabled' in properties && typeof properties.enabled === 'boolean') {
      accessory.visible = properties.enabled;
    }
  }
};