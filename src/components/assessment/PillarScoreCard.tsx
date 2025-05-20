import React from 'react';
import { PillarScore } from '../../types';
import { pillars } from '../../data/mockData';

interface PillarScoreCardProps {
  pillarScore: PillarScore;
  previousScores?: number[];
  showHistory?: boolean;
}

const PillarScoreCard: React.FC<PillarScoreCardProps> = ({ 
  pillarScore, 
  previousScores = [],
  showHistory = false
}) => {
  const pillar = pillars.find(p => p.id === pillarScore.pillarId);
  
  if (!pillar) return null;

  const renderScoreHistory = () => {
    if (!showHistory || previousScores.length === 0) return null;

    return (
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-500 mb-2">Assessment History</div>
        <div className="flex items-center gap-2">
          {previousScores.map((score, index) => {
            const label = index === 0 ? 'Current' : 
                         index === previousScores.length - 1 ? 'Initial' : 
                         `Previous ${index}`;
            const scoreDiff = index < previousScores.length - 1 
              ? score - previousScores[index + 1]
              : score;

            return (
              <div key={index} className="flex-1">
                <div className="text-xs text-gray-500 mb-1">{label}</div>
                <div className="text-sm font-medium mb-1">{score}%</div>
                {scoreDiff !== 0 && (
                  <div className={`text-xs font-medium ${
                    scoreDiff > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {scoreDiff > 0 ? '+' : ''}{scoreDiff}%
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-2">
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: pillar.color }}
        ></div>
        <h3 className="font-medium text-gray-800">{pillar.name}</h3>
      </div>
      
      <div className="flex items-end justify-between mb-3">
        <div className="text-3xl font-bold">{pillarScore.score}%</div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="h-2 rounded-full transition-all duration-500 ease-out" 
          style={{ 
            width: `${pillarScore.score}%`,
            backgroundColor: pillar.color 
          }}
        ></div>
      </div>
      
      <p className="text-xs text-gray-500 mt-3">{pillar.description}</p>

      {renderScoreHistory()}
    </div>
  );
};

export default PillarScoreCard;