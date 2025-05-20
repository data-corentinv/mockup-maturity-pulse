import React from 'react';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { Product, Pillar } from '../../types';

interface AssessmentHeaderProps {
  product: Product;
  pillar: Pillar;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

const AssessmentHeader: React.FC<AssessmentHeaderProps> = ({ 
  product, 
  pillar,
  onBack, 
  currentStep, 
  totalSteps 
}) => {
  const progressPercentage = (currentStep / totalSteps) * 100;
  
  return (
    <div className="bg-white shadow-sm border-b border-gray-200 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 flex items-center"
          >
            <ArrowLeft size={20} className="mr-1" />
            <span>Back to Product</span>
          </button>
          
          <button className="text-indigo-600 hover:text-indigo-800 flex items-center">
            <HelpCircle size={18} className="mr-1" />
            <span>Help</span>
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              {product.name} - {pillar.name} Assessment
            </h1>
            <p className="text-gray-600">Step {currentStep} of {totalSteps}</p>
          </div>
          
          <div className="w-full md:w-1/3">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-300 ease-out"
                style={{ 
                  width: `${progressPercentage}%`,
                  backgroundColor: pillar.color
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentHeader;