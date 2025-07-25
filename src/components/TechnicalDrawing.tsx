import React from 'react';
import type { TankFormData } from '../types/tankTypes';

interface TechnicalDrawingProps {
  formData: TankFormData;
}

const TechnicalDrawing: React.FC<TechnicalDrawingProps> = ({ formData }) => {
  // Early return if no form data
  if (!formData) {
    return (
      <div className="bg-white rounded-xl p-6 border-2 border-gray-300">
        <div className="text-center py-8">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Techninis brėžinys</h3>
          <p className="text-gray-600">Nėra duomenų brėžinio generavimui</p>
        </div>
      </div>
    );
  }

  // SVG dimensions - much larger for better visibility
  const svgWidth = 1000;
  const svgHeight = 700;
  const margin = 80;
  
  // Calculate drawing scale based on tank dimensions
  const getDrawingScale = () => {
    const maxDimension = Math.max(
      formData.height || 1000,
      formData.tankType === 'cylindrical' ? (formData.diameter || 500) : (formData.width || 500)
    );
    return Math.min((svgWidth - 2 * margin) / maxDimension, (svgHeight - 2 * margin) / maxDimension) * 1000;
  };
  
  const scale = getDrawingScale();
  
  // Convert mm to SVG units
  const toSVG = (mm: number) => mm * scale;
  
  // Tank dimensions in mm
  const height = formData.height || 1000;
  const diameter = formData.diameter || 500;
  const width = formData.width || 500;
  
  // Calculate tank position (centered)
  const tankCenterX = svgWidth / 2;
  const tankCenterY = svgHeight / 2;
  
  // Tank drawing dimensions
  const tankWidth = formData.tankType === 'cylindrical' ? toSVG(diameter) : toSVG(width);
  const tankHeight = toSVG(height);
  
  // Calculate tank bounds
  const tankLeft = tankCenterX - tankWidth / 2;
  const tankRight = tankCenterX + tankWidth / 2;
  const tankTop = tankCenterY - tankHeight / 2;
  const tankBottom = tankCenterY + tankHeight / 2;
  
  // Get selected accessories
  const selectedAccessories = Object.entries(formData.accessories || {})
    .filter(([_, selected]) => selected && _ !== 'supportLegs')
    .map(([type, _]) => type);
  
  // Calculate accessory positions around tank
  const getAccessoryPositions = () => {
    const positions: Array<{type: string, x: number, y: number, size: string}> = [];
    
    selectedAccessories.forEach((accessoryType, index) => {
      // Position accessories around the tank perimeter
      const angleOffset = (index * 60) * (Math.PI / 180); // 60 degrees apart
      const distance = tankWidth / 2 + 40; // More distance from tank for larger drawing
      
      const x = tankCenterX + Math.cos(angleOffset) * distance;
      const y = tankCenterY + Math.sin(angleOffset) * distance;
      
      // Type-safe access to accessory size
      const size = formData.accessorySize?.[accessoryType as keyof typeof formData.accessorySize] || 'normal';
      
      positions.push({
        type: accessoryType,
        x: Math.max(40, Math.min(svgWidth - 40, x)),
        y: Math.max(40, Math.min(svgHeight - 40, y)),
        size
      });
    });
    
    return positions;
  };
  
  const accessoryPositions = getAccessoryPositions();
  
  // Get accessory display info
  const getAccessoryInfo = (type: string) => {
    const baseNames: Record<string, string> = {
      thermalInsulation: 'Šilum. izol.',
      cipSystem: 'CIP sistema',
      pressureRelief: 'Slėg. vožt.',
      levelIndicators: 'Lyg. indik.',
      hatchesAndDrains: 'Liukai/dren.'
    };
    
    const baseSizes: Record<string, {width: number, height: number}> = {
      thermalInsulation: {width: 600, height: 1600},
      cipSystem: {width: 300, height: 300},
      pressureRelief: {width: 200, height: 600},
      levelIndicators: {width: 200, height: 800},
      hatchesAndDrains: {width: 400, height: 200}
    };
    
    return {
      name: baseNames[type] || type,
      ...baseSizes[type] || {width: 400, height: 400}
    };
  };
  
  // Get accessory size multiplier
  const getSizeMultiplier = (size: string) => {
    switch (size) {
      case 'small': return 0.8;
      case 'large': return 1.2;
      case 'extra-large': return 1.5;
      default: return 1.0;
    }
  };

  return (
    <div className="card w-full">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-neutral-dark mb-2">Techninis brėžinys</h3>
        <p className="text-sm text-muted">Masteliai ir matmenys milimetrais</p>
      </div>
      
      {/* Large SVG drawing */}
      <div className="w-full overflow-x-auto mb-6">
        <svg width={svgWidth} height={svgHeight} className="border-2 border-border-primary bg-white mx-auto shadow-lg">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
            </pattern>
            <pattern id="fineGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f3f4f6" strokeWidth="0.5"/>
            </pattern>
          </defs>
          
          <rect width="100%" height="100%" fill="url(#fineGrid)"/>
          <rect width="100%" height="100%" fill="url(#grid)"/>
          
          {/* Tank outline */}
          {formData.tankType === 'cylindrical' ? (
            <>
              {/* Cylindrical tank - side view */}
              {/* Main body */}
              <rect
                x={tankLeft}
                y={tankTop}
                width={tankWidth}
                height={tankHeight}
                fill="none"
                stroke="var(--color-neutral-dark)"
                strokeWidth="3"
              />
              
              {/* Top shape */}
              {formData.topType === 'dome' && (
                <path
                  d={`M ${tankLeft} ${tankTop} Q ${tankCenterX} ${tankTop - tankWidth/4} ${tankRight} ${tankTop}`}
                  fill="none"
                  stroke="#1f2937"
                  strokeWidth="3"
                />
              )}
              {formData.topType === 'cone' && (
                <path
                  d={`M ${tankLeft} ${tankTop} L ${tankCenterX} ${tankTop - tankWidth/4} L ${tankRight} ${tankTop}`}
                  fill="none"
                  stroke="#1f2937"
                  strokeWidth="3"
                />
              )}
              
              {/* Bottom shape */}
              {formData.bottomType === 'dome' && (
                <path
                  d={`M ${tankLeft} ${tankBottom} Q ${tankCenterX} ${tankBottom + tankWidth/4} ${tankRight} ${tankBottom}`}
                  fill="none"
                  stroke="#1f2937"
                  strokeWidth="3"
                />
              )}
              {formData.bottomType === 'cone' && (
                <path
                  d={`M ${tankLeft} ${tankBottom} L ${tankCenterX} ${tankBottom + tankWidth/4} L ${tankRight} ${tankBottom}`}
                  fill="none"
                  stroke="#1f2937"
                  strokeWidth="3"
                />
              )}
            </>
          ) : (
            <>
              {/* Rectangular tank */}
              <rect
              x={tankLeft}
              y={tankTop}
              width={tankWidth}
              height={tankHeight}
              fill="none"
              stroke="#1f2937"
              strokeWidth="3"
            />
            </>
          )}
          
          {/* Support legs */}
          {Number(formData.legs) > 0 && (
            <>
              {Array.from({length: Number(formData.legs)}, (_, i) => {
                const legAngle = (i / Number(formData.legs)) * 2 * Math.PI;
                const legRadius = tankWidth / 2 * 0.85;
                const legX = tankCenterX + Math.cos(legAngle) * legRadius;
                const legY = tankBottom;
                const legHeight = toSVG(200); // Larger leg height for visibility
                
                return (
                  <rect
                    key={`leg-${i}`}
                    x={legX - 3}
                    y={legY}
                    width="6"
                    height={legHeight}
                    fill="#6b7280"
                    stroke="#374151"
                    strokeWidth="2"
                  />
                );
              })}
            </>
          )}
          
          {/* Accessories */}
          {accessoryPositions.map((accessory, index) => {
            const info = getAccessoryInfo(accessory.type);
            const sizeMultiplier = getSizeMultiplier(accessory.size);
            const accWidth = toSVG(info.width * sizeMultiplier) * 0.15; // Larger for visibility
            const accHeight = toSVG(info.height * sizeMultiplier) * 0.15;
            
            return (
              <g key={`accessory-${index}`}>
                {/* Accessory symbol */}
                <rect
                  x={accessory.x - accWidth/2}
                  y={accessory.y - accHeight/2}
                  width={accWidth}
                  height={accHeight}
                  fill="#0057B8"
                  stroke="#003d82"
                  strokeWidth="2"
                  opacity="0.8"
                />
                
                {/* Connection line to tank */}
                <line
                  x1={accessory.x}
                  y1={accessory.y}
                  x2={tankCenterX + (accessory.x - tankCenterX) * 0.6}
                  y2={tankCenterY + (accessory.y - tankCenterY) * 0.6}
                  stroke="#6b7280"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
                
                {/* Accessory label */}
                <text
                  x={accessory.x}
                  y={accessory.y + accHeight/2 + 18}
                  textAnchor="middle"
                  fontSize="14"
                  fill="#374151"
                  fontFamily="Arial, sans-serif"
                  fontWeight="bold"
                >
                  {info.name}
                </text>
                
                {/* Size label */}
                <text
                  x={accessory.x}
                  y={accessory.y + accHeight/2 + 34}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#6b7280"
                  fontFamily="Arial, sans-serif"
                >
                  {(info.width * sizeMultiplier).toFixed(0)}×{(info.height * sizeMultiplier).toFixed(0)}mm
                </text>
              </g>
            );
          })}
          
          {/* Main dimensions */}
          {/* Height dimension */}
          <g>
            <line
              x1={tankRight + 30}
              y1={tankTop}
              x2={tankRight + 30}
              y2={tankBottom}
              stroke="#dc2626"
              strokeWidth="2"
            />
            <line
              x1={tankRight + 20}
              y1={tankTop}
              x2={tankRight + 40}
              y2={tankTop}
              stroke="#dc2626"
              strokeWidth="2"
            />
            <line
              x1={tankRight + 20}
              y1={tankBottom}
              x2={tankRight + 40}
              y2={tankBottom}
              stroke="#dc2626"
              strokeWidth="2"
            />
            <text
              x={tankRight + 50}
              y={tankCenterY + 5}
              fontSize="16"
              fill="#dc2626"
              fontFamily="Arial, sans-serif"
              fontWeight="bold"
            >
              H={height}mm
            </text>
          </g>
          
          {/* Width dimension */}
          <g>
            <line
              x1={tankLeft}
              y1={tankBottom + 30}
              x2={tankRight}
              y2={tankBottom + 30}
              stroke="#dc2626"
              strokeWidth="2"
            />
            <line
              x1={tankLeft}
              y1={tankBottom + 20}
              x2={tankLeft}
              y2={tankBottom + 40}
              stroke="#dc2626"
              strokeWidth="2"
            />
            <line
              x1={tankRight}
              y1={tankBottom + 20}
              x2={tankRight}
              y2={tankBottom + 40}
              stroke="#dc2626"
              strokeWidth="2"
            />
            <text
              x={tankCenterX}
              y={tankBottom + 55}
              textAnchor="middle"
              fontSize="16"
              fill="#dc2626"
              fontFamily="Arial, sans-serif"
              fontWeight="bold"
            >
              {formData.tankType === 'cylindrical' ? `Ø${diameter}mm` : `W=${width}mm`}
            </text>
          </g>
          
          {/* Title */}
          <text
            x={40}
            y={40}
            fontSize="18"
            fill="#1f2937"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
          >
            {formData.tankType === 'cylindrical' ? 'CILINDRINIS TANKAS' : 'STAČIAKAMPIS TANKAS'}
          </text>
          
          {/* Scale indicator */}
          <text
            x={svgWidth - 40}
            y={40}
            textAnchor="end"
            fontSize="14"
            fill="#6b7280"
            fontFamily="Arial, sans-serif"
          >
            Masteliai: 1:{Math.round(1000/scale)}
          </text>
        </svg>
      </div>
      
      {/* Technical specifications table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h4 className="font-bold text-neutral-dark mb-4 text-lg">Pagrindiniai matmenys</h4>
          <table className="w-full text-base border-collapse border border-border-primary">
            <tbody>
              <tr className="border-b border-border-primary">
                <td className="py-3 px-4 text-neutral-dark font-medium border-r border-border-primary">Aukštis (H):</td>
                <td className="py-3 px-4 font-mono font-bold text-right bg-neutral-light">{height} mm</td>
              </tr>
              {formData.tankType === 'cylindrical' ? (
                <tr className="border-b border-border-primary">
                  <td className="py-3 px-4 text-neutral-dark font-medium border-r border-border-primary">Skersmuo (Ø):</td>
                  <td className="py-3 px-4 font-mono font-bold text-right bg-neutral-light">{diameter} mm</td>
                </tr>
              ) : (
                <tr className="border-b border-border-primary">
                  <td className="py-3 px-4 text-neutral-dark font-medium border-r border-border-primary">Plotis (W):</td>
                  <td className="py-3 px-4 font-mono font-bold text-right bg-neutral-light">{width} mm</td>
                </tr>
              )}
              <tr className="border-b border-border-primary">
                <td className="py-3 px-4 text-neutral-dark font-medium border-r border-border-primary">Tūris:</td>
                <td className="py-3 px-4 font-mono font-bold text-right bg-neutral-light">{formData.volume} L</td>
              </tr>
              <tr className="border-b border-border-primary">
                <td className="py-3 px-4 text-neutral-dark font-medium border-r border-border-primary">Kojų skaičius:</td>
                <td className="py-3 px-4 font-mono font-bold text-right bg-neutral-light">{formData.legs || 0}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {selectedAccessories.length > 0 && (
          <div>
            <h4 className="font-bold text-neutral-dark mb-4 text-lg">Aksesuarų specifikacijos</h4>
            <table className="w-full text-base border-collapse border border-border-primary">
              <tbody>
                {accessoryPositions.map((accessory, index) => {
                  const info = getAccessoryInfo(accessory.type);
                  const sizeMultiplier = getSizeMultiplier(accessory.size);
                  return (
                    <tr key={index} className="border-b border-border-primary">
                      <td className="py-3 px-4 text-neutral-dark font-medium border-r border-border-primary">{info.name}:</td>
                      <td className="py-3 px-4 font-mono text-right bg-neutral-light">
                        {(info.width * sizeMultiplier).toFixed(0)}×{(info.height * sizeMultiplier).toFixed(0)} mm
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnicalDrawing;
