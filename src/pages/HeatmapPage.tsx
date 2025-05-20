import React, { useState } from 'react';
import { Product, AXAEntity, BusinessDomain, LifecycleStage } from '../types';
import { Info, Filter } from 'lucide-react';

interface HeatmapPageProps {
  products: Product[];
}

const HeatmapPage: React.FC<HeatmapPageProps> = ({ products }) => {
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

  const entities = ['FR', 'UK', 'SP', 'XL', 'GE', 'IT', 'BE', 'SW', 'JP', 'HK'];
  const domains = ['P&C Retail Claims', 'Health Claims', 'CL Underwriting', 'P&C Retail Pricing'];
  const lifecycleStages: LifecycleStage[] = ['ideation', 'poc', 'mvp', 'pilot', 'rollout', 'retire'];

  const activeFiltersCount = Object.values(filters).filter(value => value !== 'all').length;

  const getMaturityColor = (score: number): string => {
    if (score >= 80) return 'from-green-500/90 to-green-600';
    if (score >= 60) return 'from-blue-500/90 to-blue-600';
    if (score >= 40) return 'from-yellow-500/90 to-yellow-600';
    if (score >= 20) return 'from-orange-500/90 to-orange-600';
    return 'from-red-500/90 to-red-600';
  };

  const getMaturityLevel = (score: number): string => {
    if (score >= 80) return 'Level 5';
    if (score >= 60) return 'Level 4';
    if (score >= 40) return 'Level 3';
    if (score >= 20) return 'Level 2';
    return 'Level 1';
  };

  const filteredProducts = products.filter(product => {
    const matchesEntity = filters.entity === 'all' || product.axaEntity === filters.entity;
    const matchesDomain = filters.domain === 'all' || product.businessDomain === filters.domain;
    const matchesLifecycle = filters.lifecycle === 'all' || product.lifecycleStage === filters.lifecycle;
    return matchesEntity && matchesDomain && matchesLifecycle;
  });

  const getCellData = (entity: string, domain: string) => {
    const cellProducts = filteredProducts.filter(
      p => p.axaEntity === entity && p.businessDomain === domain
    );

    if (cellProducts.length === 0) return null;

    const avgMaturity = Math.round(
      cellProducts.reduce((sum, p) => {
        const latestAssessment = p.assessments[p.assessments.length - 1];
        return sum + (latestAssessment ? latestAssessment.overallScore : 0);
      }, 0) / cellProducts.length
    );

    return {
      count: cellProducts.length,
      maturity: avgMaturity,
      products: cellProducts
    };
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Maturity Heatmap</h1>
          <p className="text-gray-600">Distribution of use cases across entities and business domains</p>
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 overflow-x-auto">
        <div className="grid grid-cols-1 gap-6">
          {entities.map(entity => (
            <div key={entity} className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {entity}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {domains.map(domain => {
                  const cellData = getCellData(entity, domain);
                  const hasData = cellData !== null;
                  const gradientClass = hasData ? getMaturityColor(cellData.maturity) : 'from-gray-100 to-gray-200';
                  
                  return (
                    <div 
                      key={`${entity}-${domain}`}
                      className={`
                        relative rounded-lg overflow-hidden transition-transform hover:scale-105
                        ${hasData ? 'shadow-md' : 'border-2 border-dashed border-gray-200'}
                      `}
                    >
                      <div className={`
                        absolute inset-0 bg-gradient-to-br ${gradientClass}
                        ${hasData ? 'opacity-100' : 'opacity-50'}
                      `}></div>
                      
                      <div className="relative p-4">
                        <div className="flex items-start justify-between">
                          <span className="text-lg font-bold text-white">{domain}</span>
                          {hasData && (
                            <div className="flex flex-col items-end">
                              <span className="text-sm font-medium text-white/90">
                                {cellData.count} {cellData.count === 1 ? 'case' : 'cases'}
                              </span>
                              <span className="text-xs text-white/80">
                                {getMaturityLevel(cellData.maturity)}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {hasData ? (
                          <div className="mt-2">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-black/10 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-white/30 rounded-full transition-all"
                                  style={{ width: `${cellData.maturity}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-white">
                                {cellData.maturity}%
                              </span>
                            </div>
                            
                            <div className="mt-3 space-y-1">
                              {cellData.products.slice(0, 2).map(product => (
                                <div 
                                  key={product.id}
                                  className="text-xs text-white/80 truncate"
                                >
                                  {product.name}
                                </div>
                              ))}
                              {cellData.products.length > 2 && (
                                <div className="text-xs text-white/60">
                                  +{cellData.products.length - 2} more
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2 text-sm text-gray-500">No use cases</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start gap-2">
          <Info size={20} className="text-gray-400 mt-1" />
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Understanding the Heatmap</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Maturity Levels</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 rounded bg-gradient-to-br from-green-500/90 to-green-600"></div>
                    <span className="text-sm text-gray-600">Level 5 (80-100%)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 rounded bg-gradient-to-br from-blue-500/90 to-blue-600"></div>
                    <span className="text-sm text-gray-600">Level 4 (60-79%)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 rounded bg-gradient-to-br from-yellow-500/90 to-yellow-600"></div>
                    <span className="text-sm text-gray-600">Level 3 (40-59%)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 rounded bg-gradient-to-br from-orange-500/90 to-orange-600"></div>
                    <span className="text-sm text-gray-600">Level 2 (20-39%)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 rounded bg-gradient-to-br from-red-500/90 to-red-600"></div>
                    <span className="text-sm text-gray-600">Level 1 (0-19%)</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Card Information</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Business domain is shown in the top-left corner</li>
                  <li>• Number of use cases and maturity level in top-right</li>
                  <li>• Progress bar shows overall maturity percentage</li>
                  <li>• List of use cases (up to 2) with overflow indicator</li>
                  <li>• Hover to see card details more clearly</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapPage;