import React from 'react';
import { Product } from '../types';
import { pillars } from '../data/mockData';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import MaturityBadge from '../components/product/MaturityBadge';

interface StrategyViewProps {
  products: Product[];
}

const StrategyView: React.FC<StrategyViewProps> = ({ products }) => {
  const getLatestAssessment = (product: Product) => {
    return product.assessments.length > 0 
      ? product.assessments[product.assessments.length - 1] 
      : null;
  };

  const getPreviousAssessment = (product: Product) => {
    return product.assessments.length > 1 
      ? product.assessments[product.assessments.length - 2] 
      : null;
  };

  const getPillarScore = (product: Product, pillarId: string) => {
    const assessment = getLatestAssessment(product);
    return assessment?.scores.find(s => s.pillarId === pillarId)?.score ?? 0;
  };

  const getPillarTrend = (product: Product, pillarId: string) => {
    const latest = getLatestAssessment(product);
    const previous = getPreviousAssessment(product);

    if (!latest || !previous) return null;

    const latestScore = latest.scores.find(s => s.pillarId === pillarId)?.score ?? 0;
    const previousScore = previous.scores.find(s => s.pillarId === pillarId)?.score ?? 0;
    
    const difference = latestScore - previousScore;
    return {
      direction: difference > 0 ? 'up' : difference < 0 ? 'down' : 'stable',
      value: Math.abs(difference)
    };
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Strategy Matrix</h1>
        <p className="text-gray-600">Current maturity status across all pillars</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-sm border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800 border-b">
                Product Name
              </th>
              {pillars.map(pillar => (
                <th 
                  key={pillar.id} 
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-800 border-b"
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: pillar.color }}
                    ></div>
                    {pillar.name}
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800 border-b">
                Overall
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
              const latestAssessment = getLatestAssessment(product);
              const previousAssessment = getPreviousAssessment(product);
              
              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b">
                    <div>
                      <div className="font-medium text-gray-800">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.businessUnit}</div>
                    </div>
                  </td>
                  {pillars.map(pillar => {
                    const score = getPillarScore(product, pillar.id);
                    const trend = getPillarTrend(product, pillar.id);
                    
                    return (
                      <td key={pillar.id} className="px-6 py-4 border-b">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{
                                backgroundColor: score >= 80 ? '#22c55e' :
                                               score >= 60 ? '#3b82f6' :
                                               score >= 40 ? '#eab308' :
                                               score >= 20 ? '#f97316' :
                                                           '#ef4444'
                              }}
                            />
                            <span className="font-medium">{score}%</span>
                          </div>
                          {trend && (
                            <div className="flex items-center gap-1">
                              {trend.direction === 'up' ? (
                                <TrendingUp size={16} className="text-green-500" />
                              ) : trend.direction === 'down' ? (
                                <TrendingDown size={16} className="text-red-500" />
                              ) : (
                                <Minus size={16} className="text-gray-500" />
                              )}
                              {trend.value > 0 && (
                                <span className={`text-xs font-medium ${
                                  trend.direction === 'up' ? 'text-green-500' : 
                                  trend.direction === 'down' ? 'text-red-500' : 
                                  'text-gray-500'
                                }`}>
                                  {trend.direction === 'up' ? '+' : ''}{trend.value}%
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-6 py-4 border-b">
                    <div className="flex items-center justify-between">
                      {latestAssessment && (
                        <>
                          <MaturityBadge score={latestAssessment.overallScore} />
                          {previousAssessment && (
                            <div className="flex items-center gap-1">
                              {latestAssessment.overallScore > previousAssessment.overallScore ? (
                                <TrendingUp size={16} className="text-green-500" />
                              ) : latestAssessment.overallScore < previousAssessment.overallScore ? (
                                <TrendingDown size={16} className="text-red-500" />
                              ) : (
                                <Minus size={16} className="text-gray-500" />
                              )}
                              <span className={`text-xs font-medium ${
                                latestAssessment.overallScore > previousAssessment.overallScore ? 'text-green-500' :
                                latestAssessment.overallScore < previousAssessment.overallScore ? 'text-red-500' :
                                'text-gray-500'
                              }`}>
                                {latestAssessment.overallScore > previousAssessment.overallScore ? '+' : ''}
                                {Math.abs(latestAssessment.overallScore - previousAssessment.overallScore)}%
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Legend</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Overall Maturity</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MaturityBadge score={85} />
                <span className="text-sm text-gray-600">Level 5 (80-100%)</span>
              </div>
              <div className="flex items-center gap-2">
                <MaturityBadge score={65} />
                <span className="text-sm text-gray-600">Level 4 (60-79%)</span>
              </div>
              <div className="flex items-center gap-2">
                <MaturityBadge score={45} />
                <span className="text-sm text-gray-600">Level 3 (40-59%)</span>
              </div>
              <div className="flex items-center gap-2">
                <MaturityBadge score={25} />
                <span className="text-sm text-gray-600">Level 2 (20-39%)</span>
              </div>
              <div className="flex items-center gap-2">
                <MaturityBadge score={15} />
                <span className="text-sm text-gray-600">Level 1 (0-19%)</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Pillar Indicators</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm text-gray-600">Level 5 (80-100%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-sm text-gray-600">Level 4 (60-79%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className="text-sm text-gray-600">Level 3 (40-59%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-sm text-gray-600">Level 2 (20-39%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-sm text-gray-600">Level 1 (0-19%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyView;