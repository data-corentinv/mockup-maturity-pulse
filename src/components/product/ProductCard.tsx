import React from 'react';
import { ChevronRight, BarChart2, Building2, Briefcase } from 'lucide-react';
import { Product } from '../../types';
import MaturityBadge from './MaturityBadge';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const latestAssessment = product.assessments.length > 0 
    ? product.assessments[product.assessments.length - 1] 
    : null;
  
  const previousAssessment = product.assessments.length > 1
    ? product.assessments[product.assessments.length - 2]
    : null;
  
  const calculateTrend = () => {
    if (!previousAssessment || !latestAssessment) return 0;
    return latestAssessment.overallScore - previousAssessment.overallScore;
  };
  
  const trend = calculateTrend();
  
  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center text-sm text-gray-600">
                <Building2 size={14} className="mr-1" />
                {product.axaEntity}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Briefcase size={14} className="mr-1" />
                {product.businessDomain}
              </div>
            </div>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </div>
        
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
        
        <div className="flex items-center justify-between">
          <div>
            {latestAssessment && (
              <div className="flex items-center gap-2">
                <MaturityBadge score={latestAssessment.overallScore} />
                {trend !== 0 && (
                  <span className={`text-xs font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {trend > 0 ? '+' : ''}{trend}%
                  </span>
                )}
              </div>
            )}
            {!latestAssessment && (
              <span className="text-sm text-gray-500">No assessments yet</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <BarChart2 size={16} className="text-indigo-500" />
            <span className="text-sm text-gray-600">
              {product.assessments.length} assessment{product.assessments.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
      
      {latestAssessment && (
        <div className="px-5 py-3 bg-gray-50 rounded-b-lg text-xs text-gray-500 border-t border-gray-200">
          Last assessed: {new Date(latestAssessment.date).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default ProductCard;