import React from 'react';

interface MaturityBadgeProps {
  score: number;
}

const MaturityBadge: React.FC<MaturityBadgeProps> = ({ score }) => {
  let color = '';
  let level = '';
  
  if (score >= 80) {
    color = 'bg-green-100 text-green-800 border-green-200';
    level = 'Level 5';
  } else if (score >= 60) {
    color = 'bg-blue-100 text-blue-800 border-blue-200';
    level = 'Level 4';
  } else if (score >= 40) {
    color = 'bg-yellow-100 text-yellow-800 border-yellow-200';
    level = 'Level 3';
  } else if (score >= 20) {
    color = 'bg-orange-100 text-orange-800 border-orange-200';
    level = 'Level 2';
  } else {
    color = 'bg-red-100 text-red-800 border-red-200';
    level = 'Level 1';
  }
  
  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${color}`}>
      <span className="mr-1">{level}</span>
      <span className="font-bold">{score}%</span>
    </div>
  );
};

export default MaturityBadge;