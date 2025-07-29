// Tank form data types
export type TankFormData = {
  // Step 1: Purpose (type-safe keys)
  purpose: 'water' | 'food' | 'chemical';
  
  // Step 2: Core Dimensions
  tankType: 'cylindrical' | 'rectangular';
  height?: number; // mm
  diameter?: number; // mm - for cylindrical tanks
  width?: number; // mm - for rectangular tanks
  wallThickness?: number; // mm
  volume: number; // m³ - auto-calculated
  
  // Step 3: Material & Surface Finish
  material: '304' | '316' | 'duplex' | 'alloy'; // Expanded material options
  innerSurface: 'polished' | 'standard' | 'brushed';
  outerSurface: 'painted' | 'galvanized' | 'bare-steel';
  
  // Step 4: Optional Accessories (checkboxes) - EXPANDED
  accessories: {
    supportLegs: boolean;
    thermalInsulation: boolean;
    cipSystem: boolean; // Clean-In-Place
    pressureRelief: boolean; // Pressure release valve / venting
    levelIndicators: boolean; // Liquid level indicators
    hatchesAndDrains: boolean; // Hatches, clamps, drains
    // New advanced accessories
    flanges: boolean; // Connection flanges
    agitators: boolean; // Mixing systems
    ladders: boolean; // Access ladders
    sensors: boolean; // Monitoring sensors
  };
  
  // Accessory size configuration - EXPANDED
  accessorySize?: {
    supportLegs?: 'small' | 'normal' | 'large' | 'extra-large';
    thermalInsulation?: 'small' | 'normal' | 'large' | 'extra-large';
    cipSystem?: 'small' | 'normal' | 'large' | 'extra-large';
    pressureRelief?: 'small' | 'normal' | 'large' | 'extra-large';
    levelIndicators?: 'small' | 'normal' | 'large' | 'extra-large';
    hatchesAndDrains?: 'small' | 'normal' | 'large' | 'extra-large';
    // New accessory sizes
    flanges?: 'small' | 'normal' | 'large' | 'extra-large';
    agitators?: 'small' | 'normal' | 'large' | 'extra-large';
    ladders?: 'small' | 'normal' | 'large' | 'extra-large';
    sensors?: 'small' | 'normal' | 'large' | 'extra-large';
  };
  
  // Legacy fields (keeping for 3D preview compatibility)
  orientation: 'vertical' | 'horizontal';
  legs: number;
  topType: 'flat' | 'dome' | 'cone';
  bottomType: 'flat' | 'dome' | 'cone';
  flangeCount: number;
};

// Comprehensive 3D Tank Accessories Configuration
export type TankAccessories = {
  supportLegs: {
    count: number;
    type: 'cylindrical' | 'triangular';
    height: number;
    material?: string;
  };

  thermalInsulation: {
    enabled: boolean;
    thickness: number;
    material: 'mineralWool' | 'polyurethane';
    outerShellMaterial: 'steel' | 'aluminum';
    showCutaway?: boolean;
  };

  cipSystems: Array<{
    position: [number, number, number];
    type: 'rotatingHead' | 'sprayBall';
    diameter: number;
  }>;

  pressureReliefs: Array<{
    position: [number, number, number];
    type: 'springValve' | 'vacuumValve';
    diameter: number;
  }>;

  levelIndicators: Array<{
    position: [number, number, number];
    type: 'tube' | 'float' | 'radar';
    length: number;
    material?: 'glass' | 'plastic';
  }>;

  hatches: Array<{
    position: [number, number, number];
    shape: 'round' | 'square';
    diameter?: number;
    width?: number;
    height?: number;
    openable?: boolean;
  }>;

  drains: Array<{
    position: [number, number, number];
    diameter: number;
    valveType: 'ball' | 'butterfly' | 'none';
    hasFlange?: boolean;
  }>;

  flanges: Array<{
    position: [number, number, number];
    size: string; // e.g., 'DN50'
    type: 'welded' | 'threaded' | 'loose';
    boltCount?: number;
    orientation: 'horizontal' | 'vertical' | 'angled';
  }>;

  agitators: Array<{
    position: [number, number, number];
    shaftLength: number;
    motorType: 'electric' | 'pneumatic';
    impellerType: 'propeller' | 'paddle' | 'anchor';
    rotationSpeed?: number;
  }>;

  ladders: Array<{
    side: 'left' | 'right' | 'rear';
    height: number;
    withPlatform?: boolean;
    platformWidth?: number;
  }>;

  labels: Array<{
    position: [number, number, number];
    text: string;
    fontSize?: number;
    type?: 'warning' | 'info' | 'id';
  }>;

  sensors: Array<{
    position: [number, number, number];
    type: 'temperature' | 'pressure' | 'levelRadar' | 'flow';
    connectionType: 'flange' | 'thread' | 'weld';
  }>;
};

// Step definition type
export type FormStep = {
  id: string;
  label: string;
};
