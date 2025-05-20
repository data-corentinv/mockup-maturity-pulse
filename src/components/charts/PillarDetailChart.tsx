import React, { useEffect, useRef } from 'react';

interface PillarDetailChartProps {
  pillarId: string;
  aspects: Array<{
    name: string;
    score: number;
    previousScore?: number;
  }>;
  size?: number;
}

const PillarDetailChart: React.FC<PillarDetailChartProps> = ({ 
  pillarId,
  aspects,
  size = 300
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 60; // Reduced to make room for legend
    
    // Draw axis lines and labels
    const numAxes = aspects.length;
    const angleStep = (Math.PI * 2) / numAxes;
    
    // Draw background circles
    const steps = 5; // 0%, 20%, 40%, 60%, 80%, 100%
    for (let i = 1; i <= steps; i++) {
      const stepRadius = (radius * i) / steps;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, stepRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(209, 213, 219, 0.5)';
      ctx.stroke();
      
      // Label percentage only on the top vertical axis
      if (i < steps) {
        const percentage = i * 20;
        ctx.fillStyle = 'rgba(107, 114, 128, 0.7)';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${percentage}%`, centerX, centerY - stepRadius - 5);
      }
    }
    
    // Draw axes and labels
    aspects.forEach((aspect, index) => {
      const angle = index * angleStep - Math.PI / 2;
      
      // Draw axis line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + radius * Math.cos(angle),
        centerY + radius * Math.sin(angle)
      );
      ctx.strokeStyle = 'rgba(209, 213, 219, 0.7)';
      ctx.stroke();
      
      // Draw aspect label with word wrapping
      const labelRadius = radius + 25;
      const labelX = centerX + labelRadius * Math.cos(angle);
      const labelY = centerY + labelRadius * Math.sin(angle);
      
      ctx.fillStyle = 'rgba(31, 41, 55, 0.8)';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Split long names into multiple lines
      const words = aspect.name.split(' ');
      let line = '';
      let lines = [];
      
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        if (testLine.length > 15 && n > 0) {
          lines.push(line);
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);
      
      // Draw each line of text
      lines.forEach((line, i) => {
        const lineOffset = (i - (lines.length - 1) / 2) * 15;
        ctx.fillText(
          line.trim(),
          labelX,
          labelY + lineOffset
        );
      });
    });

    // Function to draw a complete polygon
    const drawPolygon = (
      points: Array<{ x: number; y: number }>, 
      fillStyle: string, 
      strokeStyle: string,
      lineWidth: number,
      pointRadius: number,
      pointFillStyle: string
    ) => {
      if (points.length < 3) return;

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      
      // Draw lines between points
      points.forEach((point, i) => {
        if (i === 0) return;
        ctx.lineTo(point.x, point.y);
      });
      
      // Connect back to the first point
      ctx.lineTo(points[0].x, points[0].y);
      
      // Fill and stroke the polygon
      ctx.fillStyle = fillStyle;
      ctx.fill();
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = strokeStyle;
      ctx.stroke();
      
      // Draw points at vertices
      points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, pointRadius, 0, Math.PI * 2);
        ctx.fillStyle = pointFillStyle;
        ctx.fill();
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    };
    
    // Draw previous scores polygon if available
    const hasPreviousScores = aspects.some(aspect => aspect.previousScore !== undefined);
    
    if (hasPreviousScores) {
      const previousPoints = aspects
        .filter(aspect => aspect.previousScore !== undefined)
        .map((aspect, index) => {
          const angle = index * angleStep - Math.PI / 2;
          const pointRadius = (radius * (aspect.previousScore || 0)) / 100;
          
          return {
            x: centerX + pointRadius * Math.cos(angle),
            y: centerY + pointRadius * Math.sin(angle)
          };
        });

      drawPolygon(
        previousPoints,
        'rgba(209, 213, 219, 0.2)',
        'rgba(209, 213, 219, 0.8)',
        1,
        4,
        'rgba(209, 213, 219, 0.8)'
      );
    }
    
    // Draw current scores polygon
    if (aspects.length > 0) {
      const currentPoints = aspects.map((aspect, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const pointRadius = (radius * aspect.score) / 100;
        
        return {
          x: centerX + pointRadius * Math.cos(angle),
          y: centerY + pointRadius * Math.sin(angle)
        };
      });

      drawPolygon(
        currentPoints,
        'rgba(79, 70, 229, 0.2)',
        'rgba(79, 70, 229, 0.8)',
        2,
        5,
        'rgba(79, 70, 229, 0.8)'
      );
    }

    // Draw legend
    const legendY = canvas.height - 30;
    const legendSpacing = 150;
    
    // Current assessment
    ctx.beginPath();
    ctx.arc(centerX - legendSpacing/2, legendY, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(79, 70, 229, 0.8)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(79, 70, 229, 0.8)';
    ctx.stroke();
    
    ctx.fillStyle = 'rgba(31, 41, 55, 0.8)';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Current Assessment', centerX - legendSpacing/2 + 15, legendY);

    // Previous assessment
    if (hasPreviousScores) {
      ctx.beginPath();
      ctx.arc(centerX + legendSpacing/2, legendY, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(209, 213, 219, 0.8)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(209, 213, 219, 0.8)';
      ctx.stroke();
      
      ctx.fillStyle = 'rgba(31, 41, 55, 0.8)';
      ctx.fillText('Previous Assessment', centerX + legendSpacing/2 + 15, legendY);
    }

  }, [aspects, size]);
  
  return (
    <div className="relative flex items-center justify-center">
      <canvas 
        ref={canvasRef} 
        width={size} 
        height={size}
        className="max-w-full"
      />
    </div>
  );
};

export default PillarDetailChart;