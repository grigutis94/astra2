import React, { useMemo, useState } from 'react';
import type { TankFormData } from '../types/tankTypes';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PriceCalculationProps {
  formData: TankFormData;
}

interface PriceItem {
  item: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  category: 'materials' | 'manufacturing' | 'accessories' | 'services';
}

// Helper functions outside component
const calculateSurfaceArea = (data: TankFormData): number => {
  const height = data.height || 1000;
  const diameter = data.diameter || 500;
  const width = data.width || 500;
  
  if (data.tankType === 'cylindrical') {
    // Cylindrical tank surface area
    const radius = diameter / 2;
    const cylinderArea = 2 * Math.PI * radius * height; // Side area
    const endCapsArea = 2 * Math.PI * radius * radius; // Top and bottom
    return (cylinderArea + endCapsArea) / 1000000; // Convert mm² to m²
  } else {
    // Rectangular tank surface area
    const area = 2 * (width * height + width * width + width * height); // All 6 sides
    return area / 1000000; // Convert mm² to m²
  }
};

const getAccessoryName = (accessory: string): string => {
  const names: Record<string, string> = {
    supportLegs: 'Atraminės kojos',
    thermalInsulation: 'Šilumos izoliacija',
    cipSystem: 'CIP sistema',
    pressureRelief: 'Slėgio numetimo vožtuvas',
    levelIndicators: 'Lygio indikatoriai',
    hatchesAndDrains: 'Liukai ir nutekėjimas',
  };
  return names[accessory] || accessory;
};

const getSizeMultiplier = (size: string): number => {
  switch (size) {
    case 'small': return 0.7;
    case 'large': return 1.3;
    case 'extra-large': return 1.6;
    default: return 1.0;
  }
};

const PriceCalculation: React.FC<PriceCalculationProps> = ({ formData }) => {
  const [loading, setLoading] = useState(false);

  const calculatePrice = useMemo(() => {
    const items: PriceItem[] = [];
    
    // Calculate tank volume and material
    const volume = formData.volume || 1.0;
    const surfaceArea = calculateSurfaceArea(formData);
    const materialWeight = surfaceArea * (formData.wallThickness || 3) * 0.001 * 7.9; // kg (density of stainless steel)
    
    // Material prices (EUR per kg) - REALISTIŠKAI ATNAUJINTOS LIETUVOS RINKOS KAINOS
    const materialPrices: Record<string, number> = {
      '304': 18.5, // AISI 304 stainless steel - padidintos nuo 12.5
      '316': 24.0, // AISI 316 stainless steel - padidintos nuo 16.0  
      '316L': 26.5, // AISI 316L stainless steel - padidintos nuo 17.5
      'duplex': 32.0, // Duplex steel - padidintos nuo 22.0
    };
    
    // Base material cost
    const materialPrice = materialPrices[formData.material || '304'] || 18.5;
    items.push({
      item: `Nerūdijantis plienas AISI ${formData.material}`,
      quantity: materialWeight,
      unit: 'kg',
      unitPrice: materialPrice,
      total: materialWeight * materialPrice,
      category: 'materials'
    });
    
    // Manufacturing costs based on complexity and volume - ŽYMIAI PADIDINTOS
    const baseManufacturingCost = Math.max(2200, volume * 480); // EUR - padidintos nuo 1200/250
    items.push({
      item: 'Gamybos darbai (suvirinimas, apdorojimas)',
      quantity: 1,
      unit: 'vnt.',
      unitPrice: baseManufacturingCost,
      total: baseManufacturingCost,
      category: 'manufacturing'
    });
    
    // Surface treatment costs - padidintos
    if (formData.innerSurface === 'polished') {
      const polishingCost = surfaceArea * 65; // EUR per m² - padidintos nuo 45
      items.push({
        item: 'Vidinio paviršiaus poliravimas',
        quantity: surfaceArea,
        unit: 'm²',
        unitPrice: 65,
        total: polishingCost,
        category: 'services'
      });
    }
    
    if (formData.outerSurface === 'painted') {
      const paintingCost = surfaceArea * 35; // EUR per m² - padidintos nuo 25
      items.push({
        item: 'Išorinio paviršiaus dažymas',
        quantity: surfaceArea,
        unit: 'm²',
        unitPrice: 35,
        total: paintingCost,
        category: 'services'
      });
    }
    
    // Accessories costs - ŽYMIAI PADIDINTOS REALISTIŠKAI
    const accessoryPrices: Record<string, number> = {
      supportLegs: 680, // EUR per leg - padidintos nuo 420
      thermalInsulation: surfaceArea * 280, // EUR per m² - padidintos nuo 180
      cipSystem: 18500, // EUR per system - padidintos nuo 12500
      pressureRelief: 1950, // EUR per valve - padidintos nuo 1350
      levelIndicators: 2650, // EUR per indicator - padidintos nuo 1850
      hatchesAndDrains: 1450, // EUR per unit - padidintos nuo 950
      flanges: 750, // EUR per flange - nauja pozicija
      agitators: 4500, // EUR per agitator - nauja pozicija
      ladders: 1200, // EUR per ladder - nauja pozicija
      sensors: 850, // EUR per sensor - nauja pozicija
    };
    
    if (formData.accessories) {
      Object.entries(formData.accessories).forEach(([accessory, selected]) => {
        if (selected) {
          const price = accessoryPrices[accessory] || 0;
          const sizeMultiplier = getSizeMultiplier(formData.accessorySize?.[accessory as keyof typeof formData.accessorySize] || 'normal');
          const finalPrice = price * sizeMultiplier;
          
          items.push({
            item: getAccessoryName(accessory),
            quantity: accessory === 'supportLegs' ? (formData.legs || 3) : 1,
            unit: accessory === 'supportLegs' ? 'vnt.' : accessory === 'thermalInsulation' ? 'm²' : 'vnt.',
            unitPrice: accessory === 'supportLegs' ? 420 * sizeMultiplier : finalPrice, // padidintos nuo 250
            total: accessory === 'supportLegs' ? (formData.legs || 3) * 420 * sizeMultiplier : finalPrice,
            category: 'accessories'
          });
        }
      });
    }
    
    // Additional costs - padidintos
    const transportCost = Math.max(450, volume * 95); // EUR - padidintos nuo 350/75
    items.push({
      item: 'Transportavimas ir pristatymas',
      quantity: 1,
      unit: 'vnt.',
      unitPrice: transportCost,
      total: transportCost,
      category: 'services'
    });
    
    const installationCost = Math.max(750, volume * 180); // EUR - padidintos nuo 500/120
    items.push({
      item: 'Montavimo darbai',
      quantity: 1,
      unit: 'vnt.',
      unitPrice: installationCost,
      total: installationCost,
      category: 'services'
    });
    
    return items;
  }, [formData]);
  
  const groupedItems = calculatePrice.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, PriceItem[]>);
  
  const subtotals = Object.keys(groupedItems).reduce((acc, category) => {
    acc[category] = groupedItems[category].reduce((sum, item) => sum + item.total, 0);
    return acc;
  }, {} as Record<string, number>);
  
  const totalWithoutVAT = Object.values(subtotals).reduce((sum, subtotal) => sum + subtotal, 0);
  const vat = totalWithoutVAT * 0.21; // 21% VAT in Lithuania
  const totalWithVAT = totalWithoutVAT + vat;
  
  const categoryNames: Record<string, string> = {
    materials: 'Medžiagos',
    manufacturing: 'Gamyba',
    accessories: 'Aksesuarai',
    services: 'Paslaugos',
  };
  
  const exportToPDF = async () => {
    setLoading(true);
    const doc = new jsPDF();
    
    // Add logo to PDF
    const addLogo = async () => {
      try {
        // Convert logo to base64
        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';
        
        return new Promise((resolve) => {
          logoImg.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = logoImg.width;
            canvas.height = logoImg.height;
            ctx?.drawImage(logoImg, 0, 0);
            const logoData = canvas.toDataURL('image/png');
            
            // Add logo to PDF (top right corner)
            doc.addImage(logoData, 'PNG', 150, 10, 40, 15);
            resolve(logoData);
          };
          logoImg.onerror = () => resolve(null);
          logoImg.src = '/assets/images/logo.png';
        });
      } catch (error) {
        console.warn('Nepavyko įkelti logotipo:', error);
        return null;
      }
    };

    await addLogo();
    
    // Professional header with proper encoding for Lithuanian
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 87, 184); // Astra blue
    doc.text('TALPOS SPECIFIKACIJA', 20, 25);
    
    doc.setFontSize(18);
    doc.setTextColor(255, 140, 0); // Astra orange
    doc.text('IR KAINOS SKAICIAVIMAS', 20, 35);
    
    // Reset color
    doc.setTextColor(0, 0, 0);
    
    // Professional document info box
    doc.setFillColor(245, 245, 245);
    doc.rect(20, 45, 170, 25, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Dokumento data: ${new Date().toLocaleDateString('lt-LT')}`, 25, 52);
    doc.text(`Projekto numeris: AST-${Date.now().toString().slice(-6)}`, 25, 58);
    doc.text(`Klientas: Potencialus klientas`, 25, 64);
    
    // Tank specifications section - using ASCII replacements
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 87, 184);
    doc.text('1. TALPOS TECHNINES SPECIFIKACIJOS', 20, 85);
    doc.setTextColor(0, 0, 0);
    
    // Specifications table with ASCII characters
    const specs = [
      ['Parametras', 'Reiksme', 'Vienetas'],
      ['Talpos tipas', formData.tankType === 'cylindrical' ? 'Cilindrine' : 'Staciakampe', '-'],
      ['Turis', formData.volume?.toString() || '0', 'm3'],
      ['Aukstis', formData.height?.toString() || '0', 'mm'],
      [formData.tankType === 'cylindrical' ? 'Skersmuo' : 'Plotis', 
       (formData.tankType === 'cylindrical' ? formData.diameter : formData.width)?.toString() || '0', 'mm'],
      ['Medziaga', `AISI ${formData.material}`, '-'],
      ['Sieneliu storis', formData.wallThickness?.toString() || '3', 'mm'],
      ['Vidinis pavirsus', getFinishName(formData.innerSurface), '-'],
      ['Isorinis pavirsus', getFinishName(formData.outerSurface), '-'],
      ['Orientacija', formData.orientation === 'horizontal' ? 'Horizontali' : 'Vertikali', '-'],
      ['Koju skaicius', formData.legs?.toString() || '0', 'vnt.'],
    ];
    
    autoTable(doc, {
      head: [specs[0]],
      body: specs.slice(1),
      startY: 90,
      theme: 'grid',
      headStyles: { 
        fillColor: [0, 87, 184],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: { 
        fontSize: 9,
        cellPadding: 3
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 },
        1: { cellWidth: 80 },
        2: { cellWidth: 30, halign: 'center' }
      }
    });
    
    // Accessories section if any
    if (formData.accessories && Object.values(formData.accessories).some(Boolean)) {
      let currentY = (doc as any).lastAutoTable.finalY + 15;
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 87, 184);
      doc.text('2. PAPILDOMI PRIEDAI', 20, currentY);
      doc.setTextColor(0, 0, 0);
      
      const selectedAccessories = Object.entries(formData.accessories)
        .filter(([_, selected]) => selected)
        .map(([key, _], index) => [
          (index + 1).toString(),
          getAccessoryNameAscii(key),
          'Taip',
          getAccessorySizeAscii(formData.accessorySize?.[key as keyof typeof formData.accessorySize])
        ]);
      
      if (selectedAccessories.length > 0) {
        autoTable(doc, {
          head: [['Nr.', 'Priedas', 'Itrauktas', 'Dydis']],
          body: selectedAccessories,
          startY: currentY + 5,
          theme: 'grid',
          headStyles: { 
            fillColor: [255, 140, 0],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          },
          styles: { fontSize: 9 }
        });
      }
    }
    
    // Add new page for 3D views
    doc.addPage();
    await addLogo();
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 87, 184);
    doc.text('3. 3D VIZUALIZACIJOS', 20, 25);
    doc.setTextColor(0, 0, 0);
    
    // Completely rewritten 3D camera rotation system with actual orbit controls manipulation
    const capture3DView = async (viewName: string, azimuthDegrees: number, polarDegrees: number = 45) => {
      try {
        console.log(`Capturing 3D view: ${viewName} at azimuth ${azimuthDegrees}°, polar ${polarDegrees}°`);
        
        const canvas3D = document.querySelector('canvas') as HTMLCanvasElement;
        if (!canvas3D) {
          console.warn('3D Canvas not found');
          return null;
        }

        // Get canvas center point
        const rect = canvas3D.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate much larger movement distances for significant rotation
        const dragDistance = 200; // Increased drag distance
        const azimuthRadians = (azimuthDegrees * Math.PI) / 180;
        const polarRadians = (polarDegrees * Math.PI) / 180;
        
        // Calculate drag endpoints for significant camera movement
        const deltaX = Math.cos(azimuthRadians) * dragDistance;
        const deltaY = Math.sin(polarRadians) * dragDistance / 2; // Reduced Y movement
        
        const startX = centerX - deltaX / 2;
        const startY = centerY - deltaY / 2;
        const endX = centerX + deltaX / 2;
        const endY = centerY + deltaY / 2;

        console.log(`Dragging from (${startX}, ${startY}) to (${endX}, ${endY})`);

        // Simulate extended mouse drag sequence
        const mouseDown = new MouseEvent('mousedown', {
          clientX: startX,
          clientY: startY,
          button: 0,
          buttons: 1,
          bubbles: true,
          cancelable: true
        });
        
        canvas3D.dispatchEvent(mouseDown);
        await new Promise(resolve => setTimeout(resolve, 100));

        // Multiple intermediate moves for smoother rotation
        const steps = 10;
        for (let i = 1; i <= steps; i++) {
          const progress = i / steps;
          const currentX = startX + (endX - startX) * progress;
          const currentY = startY + (endY - startY) * progress;
          
          const mouseMove = new MouseEvent('mousemove', {
            clientX: currentX,
            clientY: currentY,
            button: 0,
            buttons: 1,
            bubbles: true,
            cancelable: true
          });
          
          canvas3D.dispatchEvent(mouseMove);
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        const mouseUp = new MouseEvent('mouseup', {
          clientX: endX,
          clientY: endY,
          button: 0,
          buttons: 0,
          bubbles: true,
          cancelable: true
        });
        
        canvas3D.dispatchEvent(mouseUp);
        
        // Wait longer for animation to complete
        await new Promise(resolve => setTimeout(resolve, 1000));

        const imgData = canvas3D.toDataURL('image/png', 1.0);
        if (imgData && imgData !== 'data:,' && !imgData.includes('data:,')) {
          console.log(`Successfully captured 3D view: ${viewName}`);
          return imgData;
        }
        
        console.warn(`Failed to capture valid image data for ${viewName}`);
        return null;
      } catch (error) {
        console.warn(`Failed to capture 3D view (${viewName}):`, error);
        return null;
      }
    };
    
    // Fixed technical drawing capture that properly waits for SVG updates
    const captureTechnicalDrawing = async (viewType: string, viewName: string) => {
      try {
        console.log(`Capturing technical drawing: ${viewName} (${viewType})`);
        
        // Find technical drawing component (not 3D canvas)
        const technicalDrawingContainer = document.querySelector('svg[data-technical-drawing]')?.closest('div');
        if (!technicalDrawingContainer) {
          console.warn('Technical drawing container not found');
          return null;
        }
        
        // Find and click the view button within technical drawing section
        const viewButton = technicalDrawingContainer.querySelector(`button[data-view="${viewType}"]`) as HTMLButtonElement;
        if (viewButton) {
          console.log(`Clicking view button for: ${viewType}`);
          viewButton.click();
          
          // Wait for DOM to update
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Get the updated SVG
          const updatedSvg = document.querySelector('svg[data-technical-drawing]') as SVGSVGElement;
          if (updatedSvg && updatedSvg.getAttribute('data-technical-drawing') === viewType) {
            console.log(`Found updated SVG for view: ${viewType}`);
            
            // Convert SVG to canvas
            const svgData = new XMLSerializer().serializeToString(updatedSvg);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (ctx) {
              canvas.width = 1200;
              canvas.height = 800;
              
              return new Promise<string | null>((resolve) => {
                const img = new Image();
                
                img.onload = () => {
                  ctx.fillStyle = 'white';
                  ctx.fillRect(0, 0, canvas.width, canvas.height);
                  ctx.drawImage(img, 0, 0);
                  
                  const imgData = canvas.toDataURL('image/png', 1.0);
                  console.log(`Successfully captured technical drawing: ${viewName}`);
                  resolve(imgData);
                };
                
                img.onerror = (error) => {
                  console.warn(`Failed to convert SVG to image for ${viewType}:`, error);
                  resolve(null);
                };
                
                // Clean SVG data and encode
                const cleanedSvgData = svgData.replace(/var\(--[^)]+\)/g, (match) => {
                  // Replace CSS variables with actual colors
                  if (match.includes('--color-text-primary')) return '#333333';
                  if (match.includes('--color-primary-blue')) return '#0057B8';
                  if (match.includes('--color-error')) return '#dc2626';
                  if (match.includes('--color-text-muted')) return '#999999';
                  return '#000000';
                });
                
                const encodedSvgData = btoa(unescape(encodeURIComponent(cleanedSvgData)));
                img.src = 'data:image/svg+xml;base64,' + encodedSvgData;
              });
            }
          } else {
            console.warn(`SVG not updated properly for view: ${viewType}`);
          }
        } else {
          console.warn(`View button not found for: ${viewType}`);
        }
        
        return null;
      } catch (error) {
        console.warn(`Failed to capture technical drawing (${viewName}):`, error);
        return null;
      }
    };
    
    // Capture 6 different 3D views with much more dramatic rotations
    const view1 = await capture3DView('Priekinis', 0, 45); // Front view
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const view2 = await capture3DView('Kairys sonas', 90, 45); // Left side (90°)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const view3 = await capture3DView('Nugara', 180, 45); // Back view (180°)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const view4 = await capture3DView('Desinys sonas', 270, 45); // Right side (270°)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const view5 = await capture3DView('Virsutinis', 0, 15); // Top view (low polar angle)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const view6 = await capture3DView('Apatinis', 0, 75); // Bottom view (high polar angle)
    
    const viewNames = [
      'Priekinis vaizdas', 
      'Kairys soninis vaizdas', 
      'Nugaros vaizdas',
      'Desinys soninis vaizdas', 
      'Virsutinis vaizdas', 
      'Apatinis vaizdas'
    ];
    const views = [view1, view2, view3, view4, view5, view6];
    
    // Add 3D views in 3x2 grid
    for (let i = 0; i < views.length; i++) {
      const view = views[i];
      const viewName = viewNames[i];
      
      if (view) {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 20 + col * 60;
        const y = 45 + row * 75;
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(`3.${i + 1} ${viewName}`, x, y - 5);
        
        doc.addImage(view, 'PNG', x, y, 55, 65);
      } else {
        // Fallback if view capture failed
        if (i === 0) {
          doc.setFontSize(12);
          doc.setFont('helvetica', 'normal');
          doc.text('3D vizualizacija generuojama automatiskai pagal', 20, 50);
          doc.text('jusu nurodytas specifikacijas is 6 skirtingu kampu:', 20, 65);
          doc.text('• Priekinis vaizdas', 25, 80);
          doc.text('• Kairys soninis vaizdas', 25, 90);
          doc.text('• Nugaros vaizdas', 25, 100);
          doc.text('• Desinys soninis vaizdas', 25, 110);
          doc.text('• Virsutinis vaizdas', 25, 120);
          doc.text('• Apatinis vaizdas', 25, 130);
          doc.text('', 20, 145);
          doc.text('Interaktyvus 3D modelis prieinamas tik internetineje versijoje.', 20, 155);
          break;
        }
      }
    }
    
    // Add explanatory text
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Pastaba: 3D modelis leidzia interaktyviai keisti perziuros kampa,', 20, 200);
    doc.text('priartinti bei nustatyti talpos skaidruma detalesnei analizei.', 20, 210);
    
    // Add new page for technical drawings
    doc.addPage();
    await addLogo();
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 87, 184);
    doc.text('4. TECHNINIAI BREZINIAI', 20, 25);
    doc.setTextColor(0, 0, 0);
    
    // Capture technical drawings from all 6 views with proper view switching
    const tech1 = await captureTechnicalDrawing('front', 'Priekinis brėžinys');
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const tech2 = await captureTechnicalDrawing('side', 'Šoninis brėžinys');
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const tech3 = await captureTechnicalDrawing('top', 'Viršutinis brėžinys');
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const tech4 = await captureTechnicalDrawing('back', 'Nugaros brėžinys');
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const tech5 = await captureTechnicalDrawing('left', 'Kairysis brėžinys');
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const tech6 = await captureTechnicalDrawing('bottom', 'Apatinis brėžinys');
    
    const techViewNames = [
      'Priekinis brėžinys', 
      'Šoninis brėžinys', 
      'Viršutinis brėžinys',
      'Nugaros brėžinys',
      'Kairysis brėžinys', 
      'Apatinis brėžinys'
    ];
    const techViews = [tech1, tech2, tech3, tech4, tech5, tech6];
    
    // Add technical drawings from all views in 3x2 grid
    for (let i = 0; i < techViews.length; i++) {
      const techView = techViews[i];
      const techViewName = techViewNames[i];
      
      if (techView) {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 20 + col * 60;
        const y = 45 + row * 85;
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(`4.${i + 1} ${techViewName}`, x, y - 5);
        
        doc.addImage(techView, 'PNG', x, y, 55, 75);
        
        // Add page break after first 3 views
        if (i === 2) {
          doc.addPage();
          await addLogo();
          doc.setFontSize(18);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 87, 184);
          doc.text('4. TECHNINIAI BREZINIAI (tęsinys)', 20, 25);
          doc.setTextColor(0, 0, 0);
        }
      } else {
        // Fallback for missing technical drawings
        if (i === 0) {
          doc.setFontSize(12);
          doc.setFont('helvetica', 'normal');
          doc.text('Techniniai breziniai generuojami automatiskai pagal', 20, 45);
          doc.text('jusu nurodytas specifikacijas ir rodomi is visu kampu:', 20, 55);
          doc.text('• Priekinis vaizdas - standartine projekcija', 25, 70);
          doc.text('• Soninis vaizdas - sonine projekcija', 25, 80);
          doc.text('• Virsutinis vaizdas - vaizdas is virsaus', 25, 90);
          doc.text('• Nugaros vaizdas - galine projekcija', 25, 100);
          doc.text('• Kairysis vaizdas - kaire projekcija', 25, 110);
          doc.text('• Apatinis vaizdas - vaizdas is apacios', 25, 120);
          doc.text('', 20, 135);
          doc.text('Detalus gamybiniai breziniai bus pateikti kartu su', 20, 145);
          doc.text('galutine kainu specifikacija.', 20, 155);
          break;
        }
      }
    }
    
    // Technical drawing specifications after views
    const finalDrawingY = 45 + 2 * 85 + 10; // After 2 rows
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Pastaba: Breziniai pateikti orientacinio mastelio ir rodo tankas', 20, finalDrawingY);
    doc.text('is 6 skirtingu kampu su visais matmenimis ir specifikacijomis.', 20, finalDrawingY + 10);
    doc.text('Galutiniai gamybiniai breziniai bus pateikti patvirtinus uzsakyma.', 20, finalDrawingY + 20);
    
    // Try to capture technical drawings from all views - improved method
    try {
      // Remove this old section since we already captured technical drawings above
      // This section is now redundant
    } catch (error) {
      console.warn('Nepavyko ikelti techniniu breziniju:', error);
      // Keep fallback text
    }
    
    // Add new page for detailed price calculation
    doc.addPage();
    await addLogo();
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 87, 184);
    doc.text('5. DETALUS KAINOS SKAICIAVIMAS', 20, 25);
    doc.setTextColor(0, 0, 0);
    
    // Professional price table with ASCII characters
    const tableData: any[] = [];
    let itemNumber = 1;
    
    Object.entries(groupedItems).forEach(([category, items]) => {
      // Category header
      tableData.push([
        { content: `${getCategoryNameAscii(category).toUpperCase()}`, 
          styles: { fontStyle: 'bold', fillColor: [230, 230, 230], textColor: [0, 87, 184] },
          colSpan: 6 
        }
      ]);
      
      // Items in category
      items.forEach(item => {
        tableData.push([
          itemNumber.toString(),
          convertToAscii(item.item),
          item.quantity.toFixed(2),
          item.unit,
          `${item.unitPrice.toFixed(2)} EUR`,
          `${item.total.toFixed(2)} EUR`
        ]);
        itemNumber++;
      });
      
      // Category subtotal
      tableData.push([
        '', 
        { content: `${getCategoryNameAscii(category)} suma:`, styles: { fontStyle: 'bold' } },
        '', '', '',
        { content: `${subtotals[category].toFixed(2)} EUR`, styles: { fontStyle: 'bold', fillColor: [245, 245, 245] } }
      ]);
    });
    
    autoTable(doc, {
      head: [['Nr.', 'Aprasymas', 'Kiekis', 'Vnt.', 'Vnt. kaina', 'Suma']],
      body: tableData,
      startY: 35,
      theme: 'grid',
      headStyles: { 
        fillColor: [0, 87, 184],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: { 
        fontSize: 8,
        cellPadding: 2
      },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' },
        1: { cellWidth: 80 },
        2: { cellWidth: 20, halign: 'right' },
        3: { cellWidth: 15, halign: 'center' },
        4: { cellWidth: 25, halign: 'right' },
        5: { cellWidth: 25, halign: 'right' }
      }
    });
    
    // Professional totals section - better balanced size and positioning
    const finalY = (doc as any).lastAutoTable.finalY + 25;
    
    // Properly sized totals box - not too big
    doc.setFillColor(245, 245, 245);
    doc.rect(70, finalY, 110, 60, 'F'); // Reduced from 120x70 to 110x60
    doc.setDrawColor(0, 87, 184);
    doc.setLineWidth(2);
    doc.rect(70, finalY, 110, 60);
    
    // Intermediate sum with proper spacing
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Tarpine suma:`, 75, finalY + 12);
    doc.text(`${totalWithoutVAT.toFixed(2)} EUR`, 145, finalY + 12); // Better position
    
    // VAT with proper spacing
    doc.text(`PVM (21%):`, 75, finalY + 25);
    doc.text(`${vat.toFixed(2)} EUR`, 145, finalY + 25);
    
    // Separator line
    doc.setDrawColor(0, 87, 184);
    doc.setLineWidth(1);
    doc.line(75, finalY + 33, 175, finalY + 33); // Adjusted line
    
    // Final total - properly sized
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`GALUTINE SUMA:`, 75, finalY + 47);
    doc.text(`${totalWithVAT.toFixed(2)} EUR`, 145, finalY + 47);
    
    // Professional footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    
    const footerY = finalY + 45;
    doc.text('SVARBU:', 20, footerY);
    doc.text('• Kainos yra orientacines ir galioja 30 dienu nuo dokumento datos', 20, footerY + 8);
    doc.text('• Galutine kaina bus pateikta po detalaus projekto ivertinimo', 20, footerY + 16);
    doc.text('• Kainoje nera iskaiciuoti transportavimo ir montavimo darbai', 20, footerY + 24);
    doc.text('• Mes pasiliekame teise koreguoti kainas del medziagu kainu svyravimu', 20, footerY + 32);
    
    // Document footer
    doc.setFontSize(6);
    doc.text(`Dokumentas sugeneruotas ${new Date().toLocaleString('lt-LT')}`, 20, 280);
    doc.text('Astra UAB | El. pastas: info@astra.lt | Tel.: +370 5 XXX XXXX', 20, 285);
    
    // Save PDF with proper name
    const fileName = `Astra_Talpos_Specifikacija_${new Date().toISOString().slice(0, 10)}_${Date.now().toString().slice(-4)}.pdf`;
    doc.save(fileName);
    setLoading(false);
  };
  
  // Helper functions for ASCII conversion
  const convertToAscii = (text: string) => {
    return text
      .replace(/ā/g, 'a').replace(/Ā/g, 'A')
      .replace(/ē/g, 'e').replace(/Ē/g, 'E')
      .replace(/ī/g, 'i').replace(/Ī/g, 'I')
      .replace(/ō/g, 'o').replace(/Ō/g, 'O')
      .replace(/ū/g, 'u').replace(/Ū/g, 'U')
      .replace(/ą/g, 'a').replace(/Ą/g, 'A')
      .replace(/ę/g, 'e').replace(/Ę/g, 'E')
      .replace(/į/g, 'i').replace(/Į/g, 'I')
      .replace(/ų/g, 'u').replace(/Ų/g, 'U')
      .replace(/č/g, 'c').replace(/Č/g, 'C')
      .replace(/š/g, 's').replace(/Š/g, 'S')
      .replace(/ž/g, 'z').replace(/Ž/g, 'Z')
      .replace(/ė/g, 'e').replace(/Ė/g, 'E');
  };
  
  const getAccessoryNameAscii = (accessory: string) => {
    const names: Record<string, string> = {
      supportLegs: 'Atramines kojos',
      thermalInsulation: 'Silumos izoliacija',
      cipSystem: 'CIP sistema',
      pressureRelief: 'Slegio numetimo voztuvas',
      levelIndicators: 'Lygio indikatoriai',
      hatchesAndDrains: 'Liukai ir nutekejimas',
    };
    return convertToAscii(names[accessory] || accessory);
  };
  
  const getAccessorySizeAscii = (size?: string) => {
    const sizes: Record<string, string> = {
      'small': 'Mazas',
      'normal': 'Standartinis', 
      'large': 'Didelis',
      'extra-large': 'Labai didelis'
    };
    return convertToAscii(sizes[size || 'normal'] || 'Standartinis');
  };
  
  const getCategoryNameAscii = (category: string) => {
    const names: Record<string, string> = {
      materials: 'Medziagos',
      manufacturing: 'Gamyba',
      accessories: 'Aksesuarai',
      services: 'Paslaugos',
    };
    return convertToAscii(names[category] || category);
  };
  
  // Helper functions for better translations
  const getFinishName = (finish?: string) => {
    const finishes: Record<string, string> = {
      'standard': 'Standartinis',
      'polished': 'Poliruotas',
      'brushed': 'Šlifuotas',
      'painted': 'Dažytas',
      'galvanized': 'Cinkuotas',
      'bare-steel': 'Natūralus plienas'
    };
    return convertToAscii(finishes[finish || 'standard'] || 'Standartinis');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-neutral-dark">Preliminarus kainos skaičiavimas</h3>
        <button
          onClick={exportToPDF}
          className="px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-orange-hover transition-colors text-sm font-medium flex items-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v16a8 8 0 01-8-8z"></path>
              </svg>
              Generuojama...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Eksportuoti PDF
            </>
          )}
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Price breakdown */}
        <div className="w-full">
          <div className="bg-white border border-border-primary rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary-blue text-white">
                    <th className="px-4 py-3 text-left text-sm font-semibold">Aprašymas</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">Kiekis</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">Vnt.</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">Vnt. kaina</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">Suma</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(groupedItems).map(([category, items]) => (
                    <React.Fragment key={category}>
                      <tr className="bg-neutral-light">
                        <td colSpan={5} className="px-4 py-2 font-semibold text-neutral-dark border-t border-border-primary">
                          {categoryNames[category]}
                        </td>
                      </tr>
                      {items.map((item, index) => (
                        <tr key={`${category}-${index}`} className="border-b border-border-secondary hover:bg-neutral-light/50">
                          <td className="px-4 py-3 text-sm text-neutral-dark">{item.item}</td>
                          <td className="px-4 py-3 text-sm text-center font-mono">{item.quantity.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-center">{item.unit}</td>
                          <td className="px-4 py-3 text-sm text-right font-mono">€{item.unitPrice.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-right font-mono font-semibold">€{item.total.toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr className="bg-neutral-light/70">
                        <td colSpan={4} className="px-4 py-2 text-sm font-semibold text-right">{categoryNames[category]} viso:</td>
                        <td className="px-4 py-2 text-sm text-right font-bold">€{subtotals[category].toFixed(2)}</td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Price summary */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white border border-border-primary rounded-lg shadow-sm p-6">
            <h4 className="text-lg font-bold text-neutral-dark mb-4">Kainos suvestinė</h4>
            
            <div className="space-y-3">
              {Object.entries(subtotals).map(([category, amount]) => (
                <div key={category} className="flex justify-between items-center py-2 border-b border-border-secondary">
                  <span className="text-sm text-muted">{categoryNames[category]}:</span>
                  <span className="font-mono font-semibold">€{amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-border-primary">
              <div className="flex justify-between items-center py-2">
                <span className="font-semibold text-neutral-dark">Suma be PVM:</span>
                <span className="font-mono font-bold text-lg">€{totalWithoutVAT.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted">PVM (21%):</span>
                <span className="font-mono text-sm">€{vat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-3 mt-3 pt-3 border-t border-border-primary bg-primary-blue text-white rounded-lg px-4">
                <span className="font-bold text-lg">VISO SU PVM:</span>
                <span className="font-mono font-bold text-xl">€{totalWithVAT.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <div>
                <p className="text-sm font-semibold text-amber-800 mb-1">Pastaba</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Kainos yra orientacinės ir gali keistis priklausomai nuo projekto sudėtingumo, 
                  medžiagų kainų svyravimų ir papildomų reikalavimų. Galutinė kaina bus pateikta 
                  po detalaus projekto įvertinimo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceCalculation;
