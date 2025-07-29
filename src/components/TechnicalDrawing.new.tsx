import React, { useRef, useState } from 'react';
import type { TankFormData } from '../types/tankTypes';

interface TechnicalDrawingProps {
  formData: TankFormData;
  showTitle?: boolean;
  className?: string;
}

type ViewType = 'front' | 'side' | 'top';

const TechnicalDrawing: React.FC<TechnicalDrawingProps> = ({ 
  formData, 
  showTitle = true, 
  className = "" 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [currentView, setCurrentView] = useState<ViewType>('front');

  // Export functions - improved for better visibility
  const exportAsPNG = () => {
    if (!svgRef.current) return;
    
    const svg = svgRef.current.cloneNode(true) as SVGElement;
    
    // Convert CSS variables to actual colors for export
    const elements = svg.querySelectorAll('*');
    elements.forEach(el => {
      const element = el as SVGElement;
      
      // Convert CSS variables to actual colors
      if (element.getAttribute('stroke') === 'var(--color-text-primary)') {
        element.setAttribute('stroke', '#333333');
        element.setAttribute('stroke-width', '4');
      }
      if (element.getAttribute('fill') === 'var(--color-text-primary)') {
        element.setAttribute('fill', '#333333');
      }
      if (element.getAttribute('fill') === 'var(--color-text-muted)') {
        element.setAttribute('fill', '#999999');
      }
      if (element.getAttribute('stroke') === 'var(--color-text-muted)') {
        element.setAttribute('stroke', '#999999');
      }
      if (element.getAttribute('fill') === 'var(--color-primary-blue)') {
        element.setAttribute('fill', '#0057B8');
      }
      if (element.getAttribute('stroke') === 'var(--color-primary-blue)') {
        element.setAttribute('stroke', '#0057B8');
      }
      if (element.getAttribute('fill') === 'var(--color-error)') {
        element.setAttribute('fill', '#dc2626');
      }
      if (element.getAttribute('stroke') === 'var(--color-error)') {
        element.setAttribute('stroke', '#dc2626');
        element.setAttribute('stroke-width', '3');
      }
      // Handle rgba tank fill
      if (element.getAttribute('fill') === 'rgba(245, 245, 245, 0.3)') {
        element.setAttribute('fill', '#f5f5f5');
        element.setAttribute('fill-opacity', '0.3');
      }
    });
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    // Higher resolution for export
    const exportScale = 3;
    canvas.width = svgWidth * exportScale;
    canvas.height = svgHeight * exportScale;
    
    img.onload = () => {
      if (ctx) {
        ctx.scale(exportScale, exportScale);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, svgWidth, svgHeight);
        ctx.drawImage(img, 0, 0);
        
        const link = document.createElement('a');
        link.download = `techninis-brezinys-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    };
    
    img.onerror = (e) => {
      console.error('Image loading error:', e);
      console.log('SVG Data:', svgData);
    };
    
    // Ensure proper encoding
    const encodedSvgData = btoa(unescape(encodeURIComponent(svgData)));
    img.src = 'data:image/svg+xml;base64,' + encodedSvgData;
  };

  const exportAsSVG = () => {
    if (!svgRef.current) return;
    
    const svg = svgRef.current.cloneNode(true) as SVGElement;
    
    // Convert CSS variables to actual colors for SVG export
    const elements = svg.querySelectorAll('*');
    elements.forEach(el => {
      const element = el as SVGElement;
      
      if (element.getAttribute('stroke') === 'var(--color-text-primary)') {
        element.setAttribute('stroke', '#333333');
        element.setAttribute('stroke-width', '4');
      }
      if (element.getAttribute('fill') === 'var(--color-text-primary)') {
        element.setAttribute('fill', '#333333');
      }
      if (element.getAttribute('fill') === 'var(--color-text-muted)') {
        element.setAttribute('fill', '#999999');
      }
      if (element.getAttribute('stroke') === 'var(--color-text-muted)') {
        element.setAttribute('stroke', '#999999');
      }
      if (element.getAttribute('fill') === 'var(--color-primary-blue)') {
        element.setAttribute('fill', '#0057B8');
      }
      if (element.getAttribute('stroke') === 'var(--color-primary-blue)') {
        element.setAttribute('stroke', '#0057B8');
      }
      if (element.getAttribute('fill') === 'var(--color-error)') {
        element.setAttribute('fill', '#dc2626');
      }
      if (element.getAttribute('stroke') === 'var(--color-error)') {
        element.setAttribute('stroke', '#dc2626');
        element.setAttribute('stroke-width', '3');
      }
      // Handle rgba tank fill
      if (element.getAttribute('fill') === 'rgba(245, 245, 245, 0.3)') {
        element.setAttribute('fill', '#f5f5f5');
        element.setAttribute('fill-opacity', '0.3');
      }
    });
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `techninis-brezinys-${Date.now()}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Early return if no form data
  if (!formData) {
    return (
      <div className={`bg-white rounded-xl p-6 border-2 border-gray-300 ${className}`}>
        <div className="text-center py-8">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Techninis brėžinys</h3>
          <p className="text-gray-600">Nėra duomenų brėžinio generavimui</p>
        </div>
      </div>
    );
  }

  // SVG dimensions - optimized for better visibility and export
  const svgWidth = 1200;
  const svgHeight = 800;
  const margin = 100;
  
  // Calculate drawing scale based on tank dimensions - improved for full visibility
  const getDrawingScale = () => {
    const maxHeight = formData.height || 1000;
    const maxWidth = (formData.tankType === 'cylindrical' || !formData.tankType) ? 
      (formData.diameter || 500) : (formData.width || 500);
    
    // Calculate scale to fit both dimensions with margin
    const scaleX = (svgWidth - 2 * margin - 200) / maxWidth; // Extra space for dimensions
    const scaleY = (svgHeight - 2 * margin - 150) / maxHeight; // Extra space for dimensions
    
    // Use the smaller scale to ensure everything fits
    return Math.min(scaleX, scaleY, 1.0); // Cap at 1.0 for reasonable size
  };
  
  const scale = getDrawingScale();
  
  // Convert mm to SVG units
  const toSVG = (mm: number) => mm * scale;
  
  // Tank dimensions in mm
  const height = formData.height || 1000;
  const diameter = formData.diameter || 500;
  const width = formData.width || 500;
  const wallThickness = formData.wallThickness || 5; // Default 5mm wall thickness
  
  // Calculate tank position (centered with better positioning for dimensions)
  const tankCenterX = svgWidth / 2 - 50; // Offset left to make room for right dimension
  const tankCenterY = svgHeight / 2;
  
  // Tank drawing dimensions
  const tankWidth = (formData.tankType === 'cylindrical' || !formData.tankType) ? toSVG(diameter) : toSVG(width);
  const tankHeight = toSVG(height);
  
  // Calculate tank bounds
  const tankLeft = tankCenterX - tankWidth / 2;
  const tankRight = tankCenterX + tankWidth / 2;
  const tankTop = tankCenterY - tankHeight / 2;
  const tankBottom = tankCenterY + tankHeight / 2;

  // Accessories positioning and information
  const selectedAccessories = Object.entries(formData.accessories || {})
    .filter(([, selected]) => selected)
    .map(([type]) => type);

  const accessoryPositions = selectedAccessories.map((type, index) => {
    const angle = (index / selectedAccessories.length) * 2 * Math.PI;
    const radius = Math.max(tankWidth, tankHeight) / 2 + 80;
    return {
      type,
      size: formData.accessorySize?.[type as keyof typeof formData.accessorySize] || 'normal',
      x: tankCenterX + Math.cos(angle) * radius,
      y: tankCenterY + Math.sin(angle) * radius
    };
  });

  // Accessory information
  const getAccessoryInfo = (type: string) => {
    const baseNames: Record<string, string> = {
      supportLegs: 'Atraminės kojos',
      thermalInsulation: 'Šilumos izoliacija',
      cipSystem: 'CIP sistema',
      pressureRelief: 'Slėgio numetimas',
      levelIndicators: 'Lygio indikatoriai',
      hatchesAndDrains: 'Liukai ir nutekėjimas'
    };
    
    const baseSizes: Record<string, {width: number, height: number}> = {
      supportLegs: {width: 100, height: 200},
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
    <div className={`card w-full ${className}`}>
      {showTitle && (
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-neutral-dark mb-2">Techninis brėžinys</h3>
            <p className="text-sm text-muted">Masteliai ir matmenys milimetrais</p>
            
            {/* View selection buttons */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setCurrentView('front')}
                className={`px-3 py-1 text-sm rounded border-2 transition-colors ${
                  currentView === 'front' 
                    ? 'bg-primary-blue text-white border-primary-blue' 
                    : 'bg-white text-primary-blue border-primary-blue hover:bg-blue-50'
                }`}
              >
                Priekinis vaizdas
              </button>
              <button
                onClick={() => setCurrentView('side')}
                className={`px-3 py-1 text-sm rounded border-2 transition-colors ${
                  currentView === 'side' 
                    ? 'bg-primary-blue text-white border-primary-blue' 
                    : 'bg-white text-primary-blue border-primary-blue hover:bg-blue-50'
                }`}
              >
                Šoninis vaizdas
              </button>
              <button
                onClick={() => setCurrentView('top')}
                className={`px-3 py-1 text-sm rounded border-2 transition-colors ${
                  currentView === 'top' 
                    ? 'bg-primary-blue text-white border-primary-blue' 
                    : 'bg-white text-primary-blue border-primary-blue hover:bg-blue-50'
                }`}
              >
                Viršutinis vaizdas
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportAsPNG}
              className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue-hover transition-colors text-sm font-medium"
            >
              Eksportuoti PNG
            </button>
            <button
              onClick={exportAsSVG}
              className="px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-orange-hover transition-colors text-sm font-medium"
            >
              Eksportuoti SVG
            </button>
          </div>
        </div>
      )}
      
      {/* Enhanced SVG drawing with better visibility and export support */}
      <div className="w-full mb-6 bg-white border-2 border-border-primary rounded-lg overflow-hidden shadow-lg">
        <svg 
          ref={svgRef}
          width={svgWidth} 
          height={svgHeight} 
          className="w-full h-auto max-h-[600px]"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ maxWidth: '100%' }}
        >
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
          {(formData.tankType === 'cylindrical' || !formData.tankType) ? (
            <>
              {/* Cylindrical tank */}
              {currentView === 'front' || currentView === 'side' ? (
                <>
                  {/* Front/Side view - rectangular representation */}
                  {/* Main body - outer wall */}
                  <rect
                    x={tankLeft}
                    y={tankTop}
                    width={tankWidth}
                    height={tankHeight}
                    fill="rgba(245, 245, 245, 0.3)"
                    stroke="var(--color-text-primary)"
                    strokeWidth="4"
                  />
                  
                  {/* Inner wall - showing wall thickness */}
                  <rect
                    x={tankLeft + toSVG(wallThickness)}
                    y={tankTop + toSVG(wallThickness)}
                    width={tankWidth - 2 * toSVG(wallThickness)}
                    height={tankHeight - 2 * toSVG(wallThickness)}
                    fill="none"
                    stroke="var(--color-text-primary)"
                    strokeWidth="2"
                    strokeDasharray="3,3"
                  />
                  
                  {/* Top shape */}
                  {formData.topType === 'dome' && (
                    <path
                      d={`M ${tankLeft} ${tankTop} Q ${tankCenterX} ${tankTop - tankWidth/4} ${tankRight} ${tankTop}`}
                      fill="none"
                      stroke="var(--color-text-primary)"
                      strokeWidth="4"
                    />
                  )}
                  {formData.topType === 'cone' && (
                    <path
                      d={`M ${tankLeft} ${tankTop} L ${tankCenterX} ${tankTop - tankWidth/4} L ${tankRight} ${tankTop}`}
                      fill="none"
                      stroke="var(--color-text-primary)"
                      strokeWidth="4"
                    />
                  )}
                  
                  {/* Bottom shape */}
                  {formData.bottomType === 'dome' && (
                    <path
                      d={`M ${tankLeft} ${tankBottom} Q ${tankCenterX} ${tankBottom + tankWidth/4} ${tankRight} ${tankBottom}`}
                      fill="none"
                      stroke="var(--color-text-primary)"
                      strokeWidth="4"
                    />
                  )}
                  {formData.bottomType === 'cone' && (
                    <path
                      d={`M ${tankLeft} ${tankBottom} L ${tankCenterX} ${tankBottom + tankWidth/4} L ${tankRight} ${tankBottom}`}
                      fill="none"
                      stroke="var(--color-text-primary)"
                      strokeWidth="4"
                    />
                  )}
                </>
              ) : (
                <>
                  {/* Top view - circular representation */}
                  {/* Outer circle */}
                  <circle
                    cx={tankCenterX}
                    cy={tankCenterY}
                    r={tankWidth / 2}
                    fill="rgba(245, 245, 245, 0.3)"
                    stroke="var(--color-text-primary)"
                    strokeWidth="4"
                  />
                  
                  {/* Inner circle - showing wall thickness */}
                  <circle
                    cx={tankCenterX}
                    cy={tankCenterY}
                    r={tankWidth / 2 - toSVG(wallThickness)}
                    fill="none"
                    stroke="var(--color-text-primary)"
                    strokeWidth="2"
                    strokeDasharray="3,3"
                  />
                  
                  {/* Center mark */}
                  <g>
                    <line
                      x1={tankCenterX - 20}
                      y1={tankCenterY}
                      x2={tankCenterX + 20}
                      y2={tankCenterY}
                      stroke="var(--color-text-primary)"
                      strokeWidth="2"
                    />
                    <line
                      x1={tankCenterX}
                      y1={tankCenterY - 20}
                      x2={tankCenterX}
                      y2={tankCenterY + 20}
                      stroke="var(--color-text-primary)"
                      strokeWidth="2"
                    />
                  </g>
                </>
              )}
            </>
          ) : (
            <>
              {/* Rectangular tank */}
              {currentView === 'top' ? (
                <>
                  {/* Top view - rectangular outline */}
                  {/* Outer rectangle */}
                  <rect
                    x={tankLeft}
                    y={tankCenterY - tankWidth / 2}
                    width={tankWidth}
                    height={tankWidth}
                    fill="rgba(245, 245, 245, 0.3)"
                    stroke="var(--color-text-primary)"
                    strokeWidth="4"
                  />
                  
                  {/* Inner rectangle - showing wall thickness */}
                  <rect
                    x={tankLeft + toSVG(wallThickness)}
                    y={tankCenterY - tankWidth / 2 + toSVG(wallThickness)}
                    width={tankWidth - 2 * toSVG(wallThickness)}
                    height={tankWidth - 2 * toSVG(wallThickness)}
                    fill="none"
                    stroke="var(--color-text-primary)"
                    strokeWidth="2"
                    strokeDasharray="3,3"
                  />
                  
                  {/* Center mark */}
                  <g>
                    <line
                      x1={tankCenterX - 20}
                      y1={tankCenterY}
                      x2={tankCenterX + 20}
                      y2={tankCenterY}
                      stroke="var(--color-text-primary)"
                      strokeWidth="2"
                    />
                    <line
                      x1={tankCenterX}
                      y1={tankCenterY - 20}
                      x2={tankCenterX}
                      y2={tankCenterY + 20}
                      stroke="var(--color-text-primary)"
                      strokeWidth="2"
                    />
                  </g>
                </>
              ) : (
                <>
                  {/* Front/Side view */}
                  {/* Outer wall */}
                  <rect
                    x={tankLeft}
                    y={tankTop}
                    width={tankWidth}
                    height={tankHeight}
                    fill="rgba(245, 245, 245, 0.3)"
                    stroke="var(--color-text-primary)"
                    strokeWidth="4"
                  />
                  
                  {/* Inner wall - showing wall thickness */}
                  <rect
                    x={tankLeft + toSVG(wallThickness)}
                    y={tankTop + toSVG(wallThickness)}
                    width={tankWidth - 2 * toSVG(wallThickness)}
                    height={tankHeight - 2 * toSVG(wallThickness)}
                    fill="none"
                    stroke="var(--color-text-primary)"
                    strokeWidth="2"
                    strokeDasharray="3,3"
                  />
                </>
              )}
            </>
          )}
          
          {/* Main dimensions - made more visible */}
          {currentView === 'top' ? (
            <>
              {/* Top view dimensions */}
              {/* Width dimension */}
              <g>
                <line
                  x1={tankLeft}
                  y1={tankCenterY + tankWidth/2 + 30}
                  x2={tankRight}
                  y2={tankCenterY + tankWidth/2 + 30}
                  stroke="var(--color-error)"
                  strokeWidth="3"
                />
                <line
                  x1={tankLeft}
                  y1={tankCenterY + tankWidth/2 + 20}
                  x2={tankLeft}
                  y2={tankCenterY + tankWidth/2 + 40}
                  stroke="var(--color-error)"
                  strokeWidth="3"
                />
                <line
                  x1={tankRight}
                  y1={tankCenterY + tankWidth/2 + 20}
                  x2={tankRight}
                  y2={tankCenterY + tankWidth/2 + 40}
                  stroke="var(--color-error)"
                  strokeWidth="3"
                />
                <text
                  x={tankCenterX}
                  y={tankCenterY + tankWidth/2 + 55}
                  textAnchor="middle"
                  fontSize="16"
                  fill="var(--color-error)"
                  fontFamily="Arial, sans-serif"
                  fontWeight="bold"
                >
                  {(formData.tankType === 'cylindrical' || !formData.tankType) ? 
                    `⌀${diameter}mm` : 
                    `${width}mm`
                  }
                </text>
              </g>
              
              {/* Depth dimension for rectangular tanks */}
              {(formData.tankType === 'rectangular') && (
                <g>
                  <line
                    x1={tankRight + 30}
                    y1={tankCenterY - tankWidth/2}
                    x2={tankRight + 30}
                    y2={tankCenterY + tankWidth/2}
                    stroke="var(--color-error)"
                    strokeWidth="3"
                  />
                  <line
                    x1={tankRight + 20}
                    y1={tankCenterY - tankWidth/2}
                    x2={tankRight + 40}
                    y2={tankCenterY - tankWidth/2}
                    stroke="var(--color-error)"
                    strokeWidth="3"
                  />
                  <line
                    x1={tankRight + 20}
                    y1={tankCenterY + tankWidth/2}
                    x2={tankRight + 40}
                    y2={tankCenterY + tankWidth/2}
                    stroke="var(--color-error)"
                    strokeWidth="3"
                  />
                  <text
                    x={tankRight + 55}
                    y={tankCenterY + 5}
                    textAnchor="middle"
                    fontSize="16"
                    fill="var(--color-error)"
                    fontFamily="Arial, sans-serif"
                    fontWeight="bold"
                    transform={`rotate(90, ${tankRight + 55}, ${tankCenterY + 5})`}
                  >
                    {width}mm
                  </text>
                </g>
              )}
            </>
          ) : (
            <>
              {/* Front/Side view dimensions */}
              {/* Height dimension */}
              <g>
                <line
                  x1={tankRight + 30}
                  y1={tankTop}
                  x2={tankRight + 30}
                  y2={tankBottom}
                  stroke="var(--color-error)"
                  strokeWidth="3"
                />
                <line
                  x1={tankRight + 20}
                  y1={tankTop}
                  x2={tankRight + 40}
                  y2={tankTop}
                  stroke="var(--color-error)"
                  strokeWidth="3"
                />
                <line
                  x1={tankRight + 20}
                  y1={tankBottom}
                  x2={tankRight + 40}
                  y2={tankBottom}
                  stroke="var(--color-error)"
                  strokeWidth="3"
                />
                <text
                  x={tankRight + 55}
                  y={tankCenterY + 5}
                  textAnchor="middle"
                  fontSize="16"
                  fill="var(--color-error)"
                  fontFamily="Arial, sans-serif"
                  fontWeight="bold"
                  transform={`rotate(90, ${tankRight + 55}, ${tankCenterY + 5})`}
                >
                  {height}mm
                </text>
              </g>
              
              {/* Width dimension */}
              <g>
                <line
                  x1={tankLeft}
                  y1={tankBottom + 30}
                  x2={tankRight}
                  y2={tankBottom + 30}
                  stroke="var(--color-error)"
                  strokeWidth="3"
                />
                <line
                  x1={tankLeft}
                  y1={tankBottom + 20}
                  x2={tankLeft}
                  y2={tankBottom + 40}
                  stroke="var(--color-error)"
                  strokeWidth="3"
                />
                <line
                  x1={tankRight}
                  y1={tankBottom + 20}
                  x2={tankRight}
                  y2={tankBottom + 40}
                  stroke="var(--color-error)"
                  strokeWidth="3"
                />
                <text
                  x={tankCenterX}
                  y={tankBottom + 55}
                  textAnchor="middle"
                  fontSize="16"
                  fill="var(--color-error)"
                  fontFamily="Arial, sans-serif"
                  fontWeight="bold"
                >
                  {(formData.tankType === 'cylindrical' || !formData.tankType) ? 
                    `⌀${diameter}mm` : 
                    `${width}mm`
                  }
                </text>
              </g>
            </>
          )}
          
          {/* Wall thickness dimension - only for front/side views */}
          {currentView !== 'top' && (
            <g>
              <line
                x1={tankLeft}
                y1={tankTop - 20}
                x2={tankLeft + toSVG(wallThickness)}
                y2={tankTop - 20}
                stroke="var(--color-primary-blue)"
                strokeWidth="2"
              />
              <line
                x1={tankLeft}
                y1={tankTop - 25}
                x2={tankLeft}
                y2={tankTop - 15}
                stroke="var(--color-primary-blue)"
                strokeWidth="2"
              />
              <line
                x1={tankLeft + toSVG(wallThickness)}
                y1={tankTop - 25}
                x2={tankLeft + toSVG(wallThickness)}
                y2={tankTop - 15}
                stroke="var(--color-primary-blue)"
                strokeWidth="2"
              />
              <text
                x={tankLeft + toSVG(wallThickness)/2}
                y={tankTop - 30}
                textAnchor="middle"
                fontSize="14"
                fill="var(--color-primary-blue)"
                fontFamily="Arial, sans-serif"
                fontWeight="bold"
              >
                t={wallThickness}mm
              </text>
            </g>
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
                  fill="var(--color-primary-blue)"
                  stroke="var(--color-primary-blue)"
                  strokeWidth="2"
                  opacity="0.8"
                />
                
                {/* Connection line to tank */}
                <line
                  x1={accessory.x}
                  y1={accessory.y}
                  x2={tankCenterX + (accessory.x - tankCenterX) * 0.6}
                  y2={tankCenterY + (accessory.y - tankCenterY) * 0.6}
                  stroke="var(--color-text-muted)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
                
                {/* Accessory label */}
                <text
                  x={accessory.x}
                  y={accessory.y + accHeight/2 + 18}
                  textAnchor="middle"
                  fontSize="14"
                  fill="var(--color-text-primary)"
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
                  fill="var(--color-text-muted)"
                  fontFamily="Arial, sans-serif"
                >
                  {(info.width * sizeMultiplier).toFixed(0)}×{(info.height * sizeMultiplier).toFixed(0)}mm
                </text>
                
                {/* Position coordinates */}
                <text
                  x={accessory.x}
                  y={accessory.y + accHeight/2 + 50}
                  textAnchor="middle"
                  fontSize="11"
                  fill="var(--color-primary-blue)"
                  fontFamily="Arial, sans-serif"
                  fontWeight="normal"
                >
                  X: {((accessory.x - tankLeft) / scale).toFixed(0)}mm
                </text>
                <text
                  x={accessory.x}
                  y={accessory.y + accHeight/2 + 64}
                  textAnchor="middle"
                  fontSize="11"
                  fill="var(--color-primary-blue)"
                  fontFamily="Arial, sans-serif"
                  fontWeight="normal"
                >
                  Y: {((tankBottom - accessory.y) / scale).toFixed(0)}mm
                </text>
                
                {/* Dimension lines for accessory */}
                {/* Width dimension */}
                <line
                  x1={accessory.x - accWidth/2}
                  y1={accessory.y - accHeight/2 - 15}
                  x2={accessory.x + accWidth/2}
                  y2={accessory.y - accHeight/2 - 15}
                  stroke="var(--color-primary-blue)"
                  strokeWidth="1"
                />
                <line
                  x1={accessory.x - accWidth/2}
                  y1={accessory.y - accHeight/2 - 18}
                  x2={accessory.x - accWidth/2}
                  y2={accessory.y - accHeight/2 - 12}
                  stroke="var(--color-primary-blue)"
                  strokeWidth="1"
                />
                <line
                  x1={accessory.x + accWidth/2}
                  y1={accessory.y - accHeight/2 - 18}
                  x2={accessory.x + accWidth/2}
                  y2={accessory.y - accHeight/2 - 12}
                  stroke="var(--color-primary-blue)"
                  strokeWidth="1"
                />
                <text
                  x={accessory.x}
                  y={accessory.y - accHeight/2 - 20}
                  textAnchor="middle"
                  fontSize="10"
                  fill="var(--color-primary-blue)"
                  fontFamily="Arial, sans-serif"
                >
                  {(info.width * sizeMultiplier).toFixed(0)}
                </text>
              </g>
            );
          })}
          
          {/* Title */}
          <text
            x={40}
            y={40}
            fontSize="18"
            fill="var(--color-text-primary)"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
          >
            {(formData.tankType === 'cylindrical' || !formData.tankType) ? 'CILINDRINIS TANKAS' : 'STAČIAKAMPIS TANKAS'} - {currentView.toUpperCase()} VAIZDAS
          </text>
          
          {/* Scale indicator */}
          <text
            x={svgWidth - 40}
            y={40}
            textAnchor="end"
            fontSize="14"
            fill="var(--color-text-muted)"
            fontFamily="Arial, sans-serif"
          >
            Masteliai: 1:{Math.round(1/scale)}
          </text>
        </svg>
      </div>
      
      {/* Compact technical specifications */}
      {showTitle && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold text-neutral-dark mb-3 text-base">Pagrindiniai matmenys</h4>
            <table className="w-full text-sm border-collapse border border-border-primary rounded-lg overflow-hidden">
              <tbody>
                <tr className="border-b border-border-primary bg-neutral-light/30">
                  <td className="py-2 px-3 text-neutral-dark font-medium border-r border-border-primary">Aukštis (H):</td>
                  <td className="py-2 px-3 font-mono text-right">{height} mm</td>
                </tr>
                {(formData.tankType === 'cylindrical' || !formData.tankType) ? (
                  <tr className="border-b border-border-primary">
                    <td className="py-2 px-3 text-neutral-dark font-medium border-r border-border-primary">Skersmuo (Ø):</td>
                    <td className="py-2 px-3 font-mono text-right bg-neutral-light/20">{diameter} mm</td>
                  </tr>
                ) : (
                  <tr className="border-b border-border-primary">
                    <td className="py-2 px-3 text-neutral-dark font-medium border-r border-border-primary">Plotis (W):</td>
                    <td className="py-2 px-3 font-mono text-right bg-neutral-light/20">{width} mm</td>
                  </tr>
                )}
                <tr className="border-b border-border-primary bg-neutral-light/30">
                  <td className="py-2 px-3 text-neutral-dark font-medium border-r border-border-primary">Sienelių storis (t):</td>
                  <td className="py-2 px-3 font-mono text-right">{wallThickness} mm</td>
                </tr>
                <tr className="border-b border-border-primary">
                  <td className="py-2 px-3 text-neutral-dark font-medium border-r border-border-primary">Tūris:</td>
                  <td className="py-2 px-3 font-mono text-right bg-neutral-light/20">~{formData.volume} m³</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-neutral-dark font-medium border-r border-border-primary">Kojų skaičius:</td>
                  <td className="py-2 px-3 font-mono text-right">{formData.legs || 0}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {selectedAccessories.length > 0 && (
            <div>
              <h4 className="font-bold text-neutral-dark mb-3 text-base">Aksesuarų specifikacijos</h4>
              <table className="w-full text-sm border-collapse border border-border-primary rounded-lg overflow-hidden">
                <tbody>
                  {accessoryPositions.map((accessory, index) => {
                    const info = getAccessoryInfo(accessory.type);
                    const sizeMultiplier = getSizeMultiplier(accessory.size);
                    return (
                      <tr key={index} className={`border-b border-border-primary ${index % 2 === 0 ? 'bg-neutral-light/30' : ''}`}>
                        <td className="py-2 px-3 text-neutral-dark font-medium border-r border-border-primary">{info.name}:</td>
                        <td className="py-2 px-3 font-mono text-right">
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
      )}
    </div>
  );
};

export default TechnicalDrawing;
