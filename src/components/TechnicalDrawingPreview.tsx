import React from 'react';
import type { TankFormData } from '../types/tankTypes';

interface TechnicalDrawingPreviewProps {
  formData: TankFormData;
  className?: string;
}

const TechnicalDrawingPreview: React.FC<TechnicalDrawingPreviewProps> = ({ 
  formData, 
  className = "" 
}) => {
  // Early return if no form data
  if (!formData) {
    return (
      <div className={`bg-neutral-light rounded-lg p-4 border border-border-primary ${className}`}>
        <div className="text-center py-4">
          <h4 className="text-sm font-medium text-neutral-dark mb-1">Techninis brėžinys</h4>
          <p className="text-xs text-muted">Nėra duomenų</p>
        </div>
      </div>
    );
  }

  // Compact SVG dimensions
  const svgWidth = 300;
  const svgHeight = 200;
  const margin = 20;
  
  // Simple scale calculation for preview
  const getDrawingScale = () => {
    const maxHeight = formData.height || 1000;
    const maxWidth = (formData.tankType === 'cylindrical' || !formData.tankType) ? 
      (formData.diameter || 500) : (formData.width || 500);
    
    const scaleX = (svgWidth - 2 * margin) / maxWidth;
    const scaleY = (svgHeight - 2 * margin) / maxHeight;
    
    return Math.min(scaleX, scaleY, 0.3);
  };
  
  const scale = getDrawingScale();
  const toSVG = (mm: number) => mm * scale;
  
  // Tank dimensions
  const height = formData.height || 1000;
  const diameter = formData.diameter || 500;
  const width = formData.width || 500;
  
  // Tank position
  const tankCenterX = svgWidth / 2;
  const tankCenterY = svgHeight / 2;
  
  // Tank drawing dimensions
  const tankWidth = (formData.tankType === 'cylindrical' || !formData.tankType) ? toSVG(diameter) : toSVG(width);
  const tankHeight = toSVG(height);
  
  // Tank bounds
  const tankLeft = tankCenterX - tankWidth / 2;
  const tankRight = tankCenterX + tankWidth / 2;
  const tankTop = tankCenterY - tankHeight / 2;
  const tankBottom = tankCenterY + tankHeight / 2;

  return (
    <div className={`bg-white rounded-lg border border-border-primary overflow-hidden ${className}`}>
      <div className="p-3 border-b border-border-primary">
        <h4 className="text-sm font-medium text-neutral-dark">Techninis brėžinys</h4>
        <p className="text-xs text-muted">Peržiūra</p>
      </div>
      
      <div className="p-2">
        <svg 
          width={svgWidth} 
          height={svgHeight} 
          className="w-full h-auto border rounded"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        >
          {/* Simple grid */}
          <defs>
            <pattern id="previewGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="0.5"/>
            </pattern>
          </defs>
          
          <rect width="100%" height="100%" fill="url(#previewGrid)"/>
          
          {/* Tank outline */}
          <rect
            x={tankLeft}
            y={tankTop}
            width={tankWidth}
            height={tankHeight}
            fill="none"
            stroke="var(--color-text-primary)"
            strokeWidth="2"
          />
          
          {/* Simple dimensions */}
          <text
            x={tankCenterX}
            y={tankBottom + 15}
            textAnchor="middle"
            fontSize="10"
            fill="var(--color-text-muted)"
            fontFamily="Arial, sans-serif"
          >
            {(formData.tankType === 'cylindrical' || !formData.tankType) ? `Ø${diameter}` : `W=${width}`}
          </text>
          
          <text
            x={tankRight + 15}
            y={tankCenterY}
            fontSize="10"
            fill="var(--color-text-muted)"
            fontFamily="Arial, sans-serif"
          >
            H={height}
          </text>
        </svg>
        
        {/* Quick specs */}
        <div className="mt-2 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-muted">Tūris:</span>
            <span className="font-mono">{formData.volume} m³</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Tipas:</span>
            <span className="capitalize">{formData.tankType || 'cylindrical'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalDrawingPreview;
