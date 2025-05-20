import React, { useEffect, useRef } from 'react';
import { PillarScore } from '../../types';
import { pillars } from '../../data/mockData';

interface MaturityRadarChartProps {
  scores: PillarScore[];
  size?: number;
}

const MaturityRadarChart: React.FC<MaturityRadarChartProps> = ({ 
  scores,
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
    const radius = Math.min(centerX, centerY) - 40; // Reduced radius to accommodate longer labels
    
    // Draw axis lines and labels
    const numAxes = pillars.length;
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
    pillars.forEach((pillar, index) => {
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
      
      // Draw pillar label with word wrapping
      const labelRadius = radius + 25;
      const labelX = centerX + labelRadius * Math.cos(angle);
      const labelY = centerY + labelRadius * Math.sin(angle);
      
      ctx.fillStyle = 'rgba(31, 41, 55, 0.8)';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Split long names into multiple lines
      const words = pillar.name.split(' ');
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
    
    // Draw current scores polygon
    if (scores.length > 0) {
      ctx.beginPath();
      
      scores.forEach((score, index) => {
        const pillarIndex = pillars.findIndex(p => p.id === score.pillarId);
        if (pillarIndex === -1) return;
        
        const angle = pillarIndex * angleStep - Math.PI / 2;
        const pointRadius = (radius * score.score) / 100;
        
        const x = centerX + pointRadius * Math.cos(angle);
        const y = centerY + pointRadius * Math.sin(angle);
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        
        // Draw points at vertices
        const currentPillar = pillars.find(p => p.id === score.pillarId);
        if (currentPillar) {
          ctx.fillStyle = currentPillar.color;
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      
      ctx.closePath();
      ctx.fillStyle = 'rgba(79, 70, 229, 0.2)';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(79, 70, 229, 0.8)';
      ctx.stroke();
    }
  }, [scores, size]);
  
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

export default MaturityRadarChart;