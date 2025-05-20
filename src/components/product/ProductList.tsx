import React, { useState } from 'react';
import { PlusCircle, Search, Pin, PinOff, Filter } from 'lucide-react';
import { Product, AXAEntity, BusinessDomain, LifecycleStage } from '../../types';
import ProductCard from './ProductCard';
import AddProductModal from './AddProductModal';

interface ProductListProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  onTogglePin: (productId: string) => void;
  onAddProduct: (product: Omit<Product, 'id' | 'assessments'>) => void;
}

const ProductList: React.FC<ProductListProps> = ({ 
  products, 
  onProductSelect,
  onTogglePin,
  onAddProduct
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<{
    entity: AXAEntity | 'all';
    domain: BusinessDomain | 'all';
    lifecycle: LifecycleStage | 'all';
  }>({
    entity: 'all',
    domain: 'all',
    lifecycle: 'all'
  });
  
  const entities: AXAEntity[] = ['FR', 'UK', 'SP', 'XL', 'GE', 'IT', 'BE', 'SW', 'JP', 'HK'];
  const domains: BusinessDomain[] = [
    'P&C Retail Claims',
    'Health Claims',
    'CL Underwriting',
    'P&C Retail Pricing'
  ];
  const lifecycleStages: LifecycleStage[] = ['ideation', 'poc', 'mvp', 'pilot', 'rollout', 'retire'];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesEntity = filters.entity === 'all' || product.axaEntity === filters.entity;
    const matchesDomain = filters.domain === 'all' || product.businessDomain === filters.domain;
    const matchesLifecycle = filters.lifecycle === 'all' || product.lifecycleStage === filters.lifecycle;
    
    return matchesSearch && matchesEntity && matchesDomain && matchesLifecycle;
  });

  const activeFiltersCount = Object.values(filters).filter(value => value !== 'all').length;
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Products</h2>
        
        <div className="flex items-center gap-3">
          <div className="relative md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#000089] focus:border-[#000089]"
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="relative inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Filter size={18} />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#000089] text-white text-xs rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#000089] hover:bg-[#000066] text-white px-4 py-2 rounded-md inline-flex items-center transition-colors"
          >
            <PlusCircle size={18} className="mr-2" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AXA Entity
              </label>
              <select
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#000089] focus:border-[#000089]"
                value={filters.entity}
                onChange={(e) => setFilters({ ...filters, entity: e.target.value as AXAEntity | 'all' })}
              >
                <option value="all">All Entities</option>
                {entities.map(entity => (
                  <option key={entity} value={entity}>{entity}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Domain
              </label>
              <select
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#000089] focus:border-[#000089]"
                value={filters.domain}
                onChange={(e) => setFilters({ ...filters, domain: e.target.value as BusinessDomain | 'all' })}
              >
                <option value="all">All Domains</option>
                {domains.map(domain => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lifecycle Stage
              </label>
              <select
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#000089] focus:border-[#000089]"
                value={filters.lifecycle}
                onChange={(e) => setFilters({ ...filters, lifecycle: e.target.value as LifecycleStage | 'all' })}
              >
                <option value="all">All Stages</option>
                {lifecycleStages.map(stage => (
                  <option key={stage} value={stage} className="capitalize">
                    {stage.charAt(0).toUpperCase() + stage.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={() => {
                setFilters({ entity: 'all', domain: 'all', lifecycle: 'all' });
              }}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
      
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <p className="text-gray-500">No products found. Try adjusting your filters or add a new product.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
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
      )}

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={onAddProduct}
      />
    </div>
  );
};

export default ProductList;