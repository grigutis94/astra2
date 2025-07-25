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
  
  // Step 4: Optional Accessories (checkboxes)
  accessories: {
    supportLegs: boolean;
    thermalInsulation: boolean;
    cipSystem: boolean; // Clean-In-Place
    pressureRelief: boolean; // Pressure release valve / venting
    levelIndicators: boolean; // Liquid level indicators
    hatchesAndDrains: boolean; // Hatches, clamps, drains
  };
  
  // Accessory size configuration
  accessorySize?: {
    supportLegs?: 'small' | 'normal' | 'large' | 'extra-large';
    thermalInsulation?: 'small' | 'normal' | 'large' | 'extra-large';
    cipSystem?: 'small' | 'normal' | 'large' | 'extra-large';
    pressureRelief?: 'small' | 'normal' | 'large' | 'extra-large';
    levelIndicators?: 'small' | 'normal' | 'large' | 'extra-large';
    hatchesAndDrains?: 'small' | 'normal' | 'large' | 'extra-large';
  };
  
  // Legacy fields (keeping for 3D preview compatibility)
  orientation: 'vertical' | 'horizontal';
  legs: number;
  topType: 'flat' | 'dome' | 'cone';
  bottomType: 'flat' | 'dome' | 'cone';
  flangeCount: number;
};

// Step definition type
export type FormStep = {
  id: string;
  label: string;
};
