import React, { useState } from 'react';
import { Plus, ArrowRight, Pin, PinOff } from 'lucide-react';
import { products as allProducts, pillars } from '../data/mockData';
import { Product } from '../types';
import ProductCard from '../components/product/ProductCard';
import MaturityBadge from '../components/product/MaturityBadge';
import PillarScoreCard from '../components/assessment/PillarScoreCard';

interface DashboardProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  onStartAssessment: (product: Product) => void;
  onTogglePin: (productId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  products, 
  onProductSelect, 
  onStartAssessment,
  onTogglePin
}) => {
  const [view, setView] = useState<'dashboard' | 'products'>('dashboard');
  const [highlightedProduct, setHighlightedProduct] = useState<Product | null>(
    products.find(p => p.isPinned) || (products.length > 0 ? products[0] : null)
  );

  const pinnedProducts = products.filter(p => p.isPinned);
  
  const recentAssessments = products
    .flatMap(product => 
      product.assessments.map(assessment => ({ 
        product, 
        assessment,
        date: new Date(assessment.date)
      }))
    )
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 3);

  if (view === 'products') {
    return (
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">All Products</h1>
          <button 
            onClick={() => setView('dashboard')}
            className="text-[#000089] hover:text-[#000066] flex items-center"
          >
            Back to Dashboard
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="relative">
              <button
                onClick={() => onTogglePin(product.id)}
                className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white shadow-md hover:bg-gray-50"
              >
                {product.isPinned ? (
                  <PinOff size={16} className="text-[#000089]" />
                ) : (
                  <Pin size={16} className="text-gray-400" />
                )}
              </button>
              <ProductCard 
                product={product}
                onClick={() => onProductSelect(product)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
    
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

          {/* Pinned Products */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Pinned Products</h2>
            {pinnedProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <p className="text-gray-500">No pinned products. Pin your most important products for quick access.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pinnedProducts.map(product => (
                  <div key={product.id} className="relative">
                    <button
                      onClick={() => onTogglePin(product.id)}
                      className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white shadow-md hover:bg-gray-50"
                    >
                      <PinOff size={16} className="text-[#000089]" />
                    </button>
                    <ProductCard 
                      product={product}
                      onClick={() => onProductSelect(product)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Featured Product */}
          {highlightedProduct && highlightedProduct.assessments.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{highlightedProduct.name}</h2>
                  <p className="text-gray-600">{highlightedProduct.description}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    className="text-[#000089] hover:text-[#000066] flex items-center"
                    onClick={() => onProductSelect(highlightedProduct)}
                  >
                    <span>View Details</span>
                    <ArrowRight size={16} className="ml-1" />
                  </button>
                  
                  <button 
                    className="bg-[#000089] hover:bg-[#000066] text-white px-4 py-2 rounded-md flex items-center transition-colors"
                    onClick={() => onStartAssessment(highlightedProduct)}
                  >
                    <Plus size={18} className="mr-2" />
                    <span>New Assessment</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {highlightedProduct.assessments[highlightedProduct.assessments.length - 1].scores
                  .slice(0, 3)
                  .map(score => (
                    <PillarScoreCard 
                      key={score.pillarId} 
                      pillarScore={score} 
                      previousScore={
                        highlightedProduct.assessments.length > 1 
                          ? highlightedProduct.assessments[highlightedProduct.assessments.length - 2].scores
                              .find(s => s.pillarId === score.pillarId)?.score
                          : undefined
                      }
                    />
                  ))
                }
              </div>
            </div>
          )}

          {/* Recent Assessments */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Assessments</h2>
            
            {recentAssessments.length === 0 ? (
              <p className="text-gray-500">No assessment history found.</p>
            ) : (
              <div className="space-y-4">
                {recentAssessments.map(({ product, assessment, date }) => (
                  <div 
                    key={assessment.id} 
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-100 cursor-pointer"
                    onClick={() => onProductSelect(product)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800">{product.name}</span>
                      <span className="text-sm text-gray-500">{date.toLocaleDateString()}</span>
                    </div>
                    <MaturityBadge score={assessment.overallScore} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Access</h2>
            
            <div className="space-y-2">
              <button 
                onClick={() => setView('products')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-left"
              >
                <span className="font-medium">View All Products</span>
                <ArrowRight size={16} className="text-gray-500" />
              </button>
              
              <button 
                onClick={() => onStartAssessment(products[0])}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-left"
              >
                <span className="font-medium">Start New Assessment</span>
                <Plus size={16} className="text-gray-500" />
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Pillars Overview</h2>
            
            <div className="space-y-3">
              {pillars.map(pillar => (
                <div key={pillar.id} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: pillar.color }}
                  ></div>
                  <span className="text-sm text-gray-700">{pillar.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;