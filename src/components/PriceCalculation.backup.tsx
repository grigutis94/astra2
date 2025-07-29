import React, { useMemo } from 'react';
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

const PriceCalculation: React.FC<PriceCalculationProps> = ({ formData }) => {
  // Helper function to calculate surface area
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

  const calculatePrice = useMemo(() => {
    const items: PriceItem[] = [];
    
    // Calculate tank volume and material
    const volume = formData.volume || 1.0;
    const surfaceArea = calculateSurfaceArea(formData);
    const materialWeight = surfaceArea * (formData.wallThickness || 3) * 0.001 * 7.9; // kg (density of stainless steel)
    
    // Material prices (EUR per kg) - realistic Lithuanian market prices
    const materialPrices: Record<string, number> = {
      '304': 8.5, // AISI 304 stainless steel
      '316': 12.0, // AISI 316 stainless steel
      '316L': 13.5, // AISI 316L stainless steel
      'duplex': 18.0, // Duplex steel
    };
    
    // Base material cost
    const materialPrice = materialPrices[formData.material || '304'] || 8.5;
    items.push({
      item: `Nerūdijantis plienas AISI ${formData.material}`,
      quantity: materialWeight,
      unit: 'kg',
      unitPrice: materialPrice,
      total: materialWeight * materialPrice,
      category: 'materials'
    });
    
    // Manufacturing costs based on complexity and volume
    const baseManufacturingCost = Math.max(800, volume * 150); // EUR
    items.push({
      item: 'Gamybos darbai (suvirinimas, apdorojimas)',
      quantity: 1,
      unit: 'vnt.',
      unitPrice: baseManufacturingCost,
      total: baseManufacturingCost,
      category: 'manufacturing'
    });
    
    // Surface treatment costs
    if (formData.innerSurface === 'polished') {
      const polishingCost = surfaceArea * 25; // EUR per m²
      items.push({
        item: 'Vidinio paviršiaus poliravimas',
        quantity: surfaceArea,
        unit: 'm²',
        unitPrice: 25,
        total: polishingCost,
        category: 'services'
      });
    }
    
    if (formData.outerSurface === 'painted') {
      const paintingCost = surfaceArea * 15; // EUR per m²
      items.push({
        item: 'Išorinio paviršiaus dažymas',
        quantity: surfaceArea,
        unit: 'm²',
        unitPrice: 15,
        total: paintingCost,
        category: 'services'
      });
    }
    
    // Accessories costs
    const accessoryPrices: Record<string, number> = {
      supportLegs: 150, // EUR per leg
      thermalInsulation: surfaceArea * 35, // EUR per m²
      cipSystem: 2500, // EUR per system
      pressureRelief: 450, // EUR per valve
      levelIndicators: 320, // EUR per indicator
      hatchesAndDrains: 180, // EUR per unit
      
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
            unitPrice: accessory === 'supportLegs' ? 150 * sizeMultiplier : finalPrice,
            total: accessory === 'supportLegs' ? (formData.legs || 3) * 150 * sizeMultiplier : finalPrice,
            category: 'accessories'
          });
        }
      });
    }
    
    // Additional costs
    const transportCost = Math.max(200, volume * 50); // EUR
    items.push({
      item: 'Transportavimas ir pristatymas',
      quantity: 1,
      unit: 'vnt.',
      unitPrice: transportCost,
      total: transportCost,
      category: 'services'
    });
    
    const installationCost = Math.max(300, volume * 80); // EUR
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
  
  const getSizeMultiplier = (size: string): number => {
    switch (size) {
      case 'small': return 0.7;
      case 'large': return 1.3;
      case 'extra-large': return 1.6;
      default: return 1.0;
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
  
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('TALPOS KAINOS SKAIČIAVIMAS', 20, 25);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Data: ${new Date().toLocaleDateString('lt-LT')}`, 20, 35);
    doc.text(`Projekto Nr.: ${Date.now().toString().slice(-6)}`, 20, 42);
    
    // Tank specifications
    doc.setFont('helvetica', 'bold');
    doc.text('TALPOS SPECIFIKACIJOS:', 20, 55);
    
    doc.setFont('helvetica', 'normal');
    const specs = [
      `Tipas: ${formData.tankType === 'cylindrical' ? 'Cilindrinis' : 'Stačiakampis'}`,
      `Tūris: ${formData.volume} m³`,
      `Aukštis: ${formData.height} mm`,
      formData.tankType === 'cylindrical' 
        ? `Skersmuo: ${formData.diameter} mm`
        : `Plotis: ${formData.width} mm`,
      `Medžiaga: AISI ${formData.material}`,
      `Sienelių storis: ${formData.wallThickness} mm`,
    ];
    
    specs.forEach((spec, index) => {
      doc.text(spec, 20, 65 + index * 7);
    });
    
    // Price table
    let startY = 65 + specs.length * 7 + 15;
    
    const tableData: any[] = [];
    Object.entries(groupedItems).forEach(([category, items]) => {
      // Category header
      tableData.push([
        { content: categoryNames[category], styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } },
        '', '', '', ''
      ]);
      
      // Items in category
      items.forEach(item => {
        tableData.push([
          item.item,
          item.quantity.toFixed(2),
          item.unit,
          `€${item.unitPrice.toFixed(2)}`,
          `€${item.total.toFixed(2)}`
        ]);
      });
      
      // Category subtotal
      tableData.push([
        { content: `${categoryNames[category]} viso:`, styles: { fontStyle: 'bold' } },
        '', '', '',
        { content: `€${subtotals[category].toFixed(2)}`, styles: { fontStyle: 'bold' } }
      ]);
      
      // Empty row for spacing
      tableData.push(['', '', '', '', '']);
    });
    
    // Remove last empty row
    tableData.pop();
    
    autoTable(doc, {
      head: [['Aprašymas', 'Kiekis', 'Vnt.', 'Vnt. kaina', 'Suma']],
      body: tableData,
      startY: startY,
      theme: 'striped',
      headStyles: { fillColor: [0, 87, 184] }, // Astra blue
      styles: { fontSize: 10 },
      columnStyles: {
        1: { halign: 'right' },
        3: { halign: 'right' },
        4: { halign: 'right' }
      }
    });
    
    // Totals
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    
    doc.setFont('helvetica', 'bold');
    doc.text(`Suma be PVM: €${totalWithoutVAT.toFixed(2)}`, 140, finalY);
    doc.text(`PVM (21%): €${vat.toFixed(2)}`, 140, finalY + 7);
    doc.setFontSize(14);
    doc.text(`VISO SU PVM: €${totalWithVAT.toFixed(2)}`, 140, finalY + 17);
    
    // Footer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('* Kainos orientacinės ir gali keistis priklausomai nuo projekto sudėtingumo', 20, finalY + 35);
    doc.text('* Galutinė kaina bus pateikta po detalaus projekto įvertinimo', 20, finalY + 42);
    
    // Save PDF
    doc.save(`talpos-kainos-skaiciavimas-${Date.now()}.pdf`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-neutral-dark">Preliminarus kainos skaičiavimas</h3>
        <button
          onClick={exportToPDF}
          className="px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-orange-hover transition-colors text-sm font-medium flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          Eksportuoti PDF
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Price breakdown */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
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
        <div className="space-y-4">
          <div className="card p-6">
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
          
          <div className="card p-4 bg-amber-50 border border-amber-200">
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
