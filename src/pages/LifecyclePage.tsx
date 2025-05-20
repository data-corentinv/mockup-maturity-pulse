import React from 'react';
import { Product } from '../types';
import { ArrowRight, Beaker, Rocket, Target, Users, Power, Archive } from 'lucide-react';
import MaturityBadge from '../components/product/MaturityBadge';

interface LifecyclePageProps {
  products: Product[];
}

const LifecyclePage: React.FC<LifecyclePageProps> = ({ products }) => {
  const lifecycleStages = [
    { id: 'ideation', name: 'Ideation/Framing', icon: Target, color: 'bg-blue-500' },
    { id: 'poc', name: 'POC/POV', icon: Beaker, color: 'bg-purple-500' },
    { id: 'mvp', name: 'MVP', icon: Rocket, color: 'bg-indigo-500' },
    { id: 'pilot', name: 'Pilot', icon: Users, color: 'bg-green-500' },
    { id: 'rollout', name: 'Rollout', icon: Power, color: 'bg-orange-500' },
    { id: 'retire', name: 'Retire/Decommission', icon: Archive, color: 'bg-red-500' }
  ];

  const getStageProducts = (stageId: string) => {
    return products.filter(product => product.lifecycleStage === stageId);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">AI Lifecycle</h1>
        <p className="text-gray-600">Track products across different stages of the AI lifecycle</p>
      </div>

      <div className="relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 relative z-10">
          {lifecycleStages.map((stage, index) => {
            const stageProducts = getStageProducts(stage.id);
            const Icon = stage.icon;
            
            return (
              <div key={stage.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`p-2 rounded-lg ${stage.color} bg-opacity-10`}>
                    <Icon className={stage.color.replace('bg-', 'text-')} size={20} />
                  </div>
                  <h3 className="font-medium text-gray-800">{stage.name}</h3>
                </div>

                <div className="space-y-3">
                  {stageProducts.map(product => (
                    <div 
                      key={product.id}
                      className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-medium text-gray-800 mb-1">{product.name}</h4>
                          <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                        </div>
                        {product.assessments.length > 0 && (
                          <MaturityBadge 
                            score={product.assessments[product.assessments.length - 1].overallScore} 
                          />
                        )}
                      </div>
                    </div>
                  ))}

                  {stageProducts.length === 0 && (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      No products in this stage
                    </div>
                  )}
                </div>

                {index < lifecycleStages.length - 1 && (
                  <div className="hidden xl:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <ArrowRight className="text-gray-400" size={24} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LifecyclePage;