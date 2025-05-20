import React, { useState } from 'react';
import { ArrowLeft, PlusCircle, Calendar, Link as LinkIcon, ChevronDown, ChevronUp, ArrowUpRight } from 'lucide-react';
import { Product, AssessmentSummary, ModelPerformanceDetails } from '../types';
import { pillars } from '../data/mockData';
import modelPerformanceData from '../data/model-performance.json';
import trustAspectsData from '../data/trust-aspects.json';
import mlopsAspectsData from '../data/mlops-aspects.json';
import governanceAspectsData from '../data/governance-aspects.json';
import MaturityBadge from '../components/product/MaturityBadge';
import PillarScoreCard from '../components/assessment/PillarScoreCard';
import PillarDetailChart from '../components/charts/PillarDetailChart';
import CodeQualityChart from '../components/charts/CodeQualityChart';
import KPITrend from '../components/KPITrend';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onStartAssessment: (product: Product, pillarId?: string) => void;
  onNavigate: (view: 'lifecycle') => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  onBack,
  onStartAssessment,
  onNavigate
}) => {
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentSummary | null>(
    product.assessments.length > 0 ? product.assessments[product.assessments.length - 1] : null
  );
  
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);
  const [isBusinessOverviewExpanded, setIsBusinessOverviewExpanded] = useState(false);
  const [expandedAspect, setExpandedAspect] = useState<string | null>(null);

  const modelPerformance: ModelPerformanceDetails = modelPerformanceData.products[product.id] || {
    metrics: {
      classification: {
        train: { precision: 0, recall: 0, f1: 0 },
        validation: { precision: 0, recall: 0, f1: 0 },
        test: { precision: 0, recall: 0, f1: 0 }
      }
    },
    info: {
      version: "1.0.0",
      type: "Unknown",
      hyperparameters: {}
    },
    dependencies: [],
    images: []
  };

  const getAssessmentHistory = (pillarId: string) => {
    const sortedAssessments = [...product.assessments].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const initialAssessment = sortedAssessments[sortedAssessments.length - 1];
    const lastTwoAssessments = sortedAssessments.slice(0, 2);
    
    const scores = [
      ...lastTwoAssessments.map(a => 
        a.scores.find(s => s.pillarId === pillarId)?.score ?? 0
      ),
      initialAssessment.scores.find(s => s.pillarId === pillarId)?.score ?? 0
    ];

    return scores.filter((score, index, self) => 
      index === self.findIndex(s => s === score)
    );
  };

  const getMlopsAspects = () => {
    const mlopsData = mlopsAspectsData.products[product.id];
    if (!mlopsData) return [];

    const currentData = mlopsData.current;
    const historyData = mlopsData.history[0];

    return [
      { 
        name: 'Fundamentals', 
        score: currentData.fundamentals.score,
        previousScore: historyData?.fundamentals.score
      },
      { 
        name: 'Reliability', 
        score: currentData.reliability.score,
        previousScore: historyData?.reliability.score
      },
      { 
        name: 'Repeatability', 
        score: currentData.repeatability.score,
        previousScore: historyData?.repeatability.score
      },
      { 
        name: 'Scalability', 
        score: currentData.scalability.score,
        previousScore: historyData?.scalability.score
      }
    ];
  };

  const getGovernanceAspects = () => {
    const govData = governanceAspectsData.products[product.id];
    if (!govData) return [];

    const currentData = govData.current;
    const historyData = govData.history?.[0];

    return [
      { 
        name: 'Strategic Alignment', 
        score: currentData.strategic_alignment.score,
        previousScore: historyData?.strategic_alignment?.score
      },
      { 
        name: 'Governance & Organization', 
        score: currentData.governance_organization.score,
        previousScore: historyData?.governance_organization?.score
      },
      { 
        name: 'Inventory & Documentation', 
        score: currentData.inventory_documentation.score,
        previousScore: historyData?.inventory_documentation?.score
      },
      { 
        name: 'Risk Management', 
        score: currentData.risk_management.score,
        previousScore: historyData?.risk_management?.score
      },
      { 
        name: 'Tooling', 
        score: currentData.tooling.score,
        previousScore: historyData?.tooling?.score
      },
      { 
        name: 'Culture & People', 
        score: currentData.culture_people.score,
        previousScore: historyData?.culture_people?.score
      }
    ];
  };

  const getAiTrustAspects = () => {
    const trustAspects = trustAspectsData.products[product.id] || {
      transparency: { score: 0, metrics: [] },
      fairness: { score: 0, metrics: [] },
      robustness: { score: 0, metrics: [] },
      accountability: { score: 0, metrics: [] }
    };

    return [
      { 
        name: 'Transparency',
        score: trustAspects.transparency.score,
        description: 'Model interpretability and decision explanation capabilities',
        metrics: trustAspects.transparency.metrics,
        image: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg'
      },
      { 
        name: 'Fairness',
        score: trustAspects.fairness.score,
        description: 'Bias detection and mitigation measures',
        metrics: trustAspects.fairness.metrics,
        image: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg'
      },
      { 
        name: 'Robustness',
        score: trustAspects.robustness.score,
        description: 'Model stability and resilience to adversarial attacks',
        metrics: trustAspects.robustness.metrics,
        image: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg'
      },
      { 
        name: 'Accountability',
        score: trustAspects.accountability.score,
        description: 'Clear ownership and responsibility assignment',
        metrics: trustAspects.accountability.metrics,
        image: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg'
      }
    ];
  };

  const getModelPerformanceAspects = () => [
    { name: 'Model Cards', score: 75 },
    { name: 'Metrics', score: 85 },
    { name: 'Hyperparameters', score: 70 },
    { name: 'Artifacts', score: 65 },
    { name: 'Versioning', score: 80 }
  ];

  const getCodeQualityAspects = () => [
    { name: 'Vulnerabilities', score: 80 },
    { name: 'Bugs', score: 75 },
    { name: 'Code Smells', score: 12 },
    { name: 'Coverage', score: 85 },
    { name: 'Hotspots', score: 65 }
  ];

  const getEngineeringExcellenceAspects = () => [
    { name: 'Development', score: 75 },
    { name: 'Delivery', score: 70 },
    { name: 'Operations', score: 80 },
    { name: 'Quality', score: 85 },
    { name: 'Infrastructure', score: 75 }
  ];

  const getPillarAspects = (pillarId: string) => {
    switch (pillarId) {
      case 'p1': return getMlopsAspects();
      case 'p2': return getGovernanceAspects();
      case 'p3': return getAiTrustAspects();
      case 'p4': return getModelPerformanceAspects();
      case 'p5': return getCodeQualityAspects();
      case 'p6': return getEngineeringExcellenceAspects();
      default: return [];
    }
  };

  const handlePillarClick = (pillarId: string) => {
    setSelectedPillar(selectedPillar === pillarId ? null : pillarId);
    setExpandedAspect(null);
  };

  const handleStartPillarAssessment = (pillarId: string) => {
    onStartAssessment(product, pillarId);
  };

  const renderAITrustContent = () => {
    const aspects = getAiTrustAspects();
    
    return (
      <div className="space-y-4">
        <PillarDetailChart 
          pillarId={selectedPillar!}
          aspects={aspects}
          size={350}
        />
        
        <div className="mt-8 space-y-4">
          {aspects.map((aspect) => (
            <div key={aspect.name} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <button
                className="w-full px-6 py-4 flex items-center justify-between text-left"
                onClick={() => setExpandedAspect(expandedAspect === aspect.name ? null : aspect.name)}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium text-gray-800">{aspect.name}</h3>
                    <span className="text-sm font-medium text-gray-500">{aspect.score}%</span>
                  </div>
                  <p className="text-sm text-gray-600">{aspect.description}</p>
                </div>
                {expandedAspect === aspect.name ? (
                  <ChevronUp size={20} className="text-gray-500" />
                ) : (
                  <ChevronDown size={20} className="text-gray-500" />
                )}
              </button>
              
              {expandedAspect === aspect.name && (
                <div className="px-6 pb-6">
                  <div className="space-y-4">
                    {aspect.metrics?.map((metric, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-700">{metric.name}</span>
                          <span className="text-sm font-medium text-gray-600">{metric.value}%</span>
                        </div>
                        <p className="text-sm text-gray-600">{metric.description}</p>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-blue-600"
                            style={{ width: `${metric.value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <img 
                    src={aspect.image} 
                    alt={`${aspect.name} visualization`}
                    className="w-full rounded-lg mt-4"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderModelPerformanceContent = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            {Object.entries(modelPerformance.metrics.classification).map(([dataset, metrics]) => (
              <div key={dataset} className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 capitalize">{dataset} Set</h4>
                <div className="space-y-2">
                  {Object.entries(metrics).map(([metric, value]) => (
                    <div key={metric} className="flex items-center">
                      <span className="w-24 text-sm text-gray-600 capitalize">{metric}:</span>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-blue-600"
                            style={{ width: `${value * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="ml-3 text-sm font-medium">{(value * 100).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Model Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-sm text-gray-600">Version:</span>
              <span className="ml-2 font-medium">{modelPerformance.info.version}</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Type:</span>
              <span className="ml-2 font-medium">{modelPerformance.info.type}</span>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Hyperparameters</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(modelPerformance.info.hyperparameters).map(([param, value]) => (
                  <div key={param} className="flex items-center">
                    <span className="text-sm text-gray-600">{param}:</span>
                    <span className="ml-2 text-sm font-mono">{value.toString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Library Dependencies</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {modelPerformance.dependencies.map((dep) => (
              <div key={dep.name} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <span className="text-sm font-medium">{dep.name}</span>
                <span className="text-sm text-gray-600">{dep.version}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Model Visualizations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modelPerformance.images.map((image, index) => (
              <div 
                key={index}
                className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
              >
                <img 
                  src={typeof image.url === 'string' ? image.url : `data:image/png;base64,${image.url.data}`}
                  alt={image.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-medium text-gray-800 mb-1">{image.title}</h4>
                  <p className="text-sm text-gray-600">{image.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderPillarContent = () => {
    if (selectedPillar === 'p5') {
      return (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-800">
              Code Quality Metrics
            </h4>
            <button 
              onClick={() => setSelectedPillar(null)}
              className="text-sm text-[#000089] hover:text-[#000066]"
            >
              Back to Overview
            </button>
          </div>
          <CodeQualityChart projectKey={product.id} />
        </div>
      );
    }

    if (selectedPillar === 'p4') {
      return (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-800">
              Model Performance Details
            </h4>
            <button 
              onClick={() => setSelectedPillar(null)}
              className="text-sm text-[#000089] hover:text-[#000066]"
            >
              Back to Overview
            </button>
          </div>
          {renderModelPerformanceContent()}
        </div>
      );
    }

    if (selectedPillar === 'p3') {
      return (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-800">
              {pillars.find(p => p.id === selectedPillar)?.name} Details
            </h4>
            <button 
              onClick={() => setSelectedPillar(null)}
              className="text-sm text-[#000089] hover:text-[#000066]"
            >
              Back to Overview
            </button>
          </div>
          {renderAITrustContent()}
        </div>
      );
    }

    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-gray-800">
            {pillars.find(p => p.id === selectedPillar)?.name} Details
          </h4>
          <button 
            onClick={() => setSelectedPillar(null)}
            className="text-sm text-[#000089] hover:text-[#000066]"
          >
            Back to Overview
          </button>
        </div>
        <PillarDetailChart 
          pillarId={selectedPillar!}
          aspects={getPillarAspects(selectedPillar!)}
          size={350}
        />
      </div>
    );
  };

  const getLifecycleColor = (stage: string): string => {
    switch (stage) {
      case 'ideation': return 'bg-blue-100 text-blue-800';
      case 'poc': return 'bg-purple-100 text-purple-800';
      case 'mvp': return 'bg-indigo-100 text-indigo-800';
      case 'pilot': return 'bg-green-100 text-green-800';
      case 'rollout': return 'bg-orange-100 text-orange-800';
      case 'retire': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="container mx-auto">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="mr-4 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <button 
              className="w-full px-6 py-4 flex items-center justify-between text-left"
              onClick={() => setIsBusinessOverviewExpanded(!isBusinessOverviewExpanded)}
            >
              <h2 className="text-xl font-semibold text-gray-800">Business Overview</h2>
              {isBusinessOverviewExpanded ? (
                <ChevronUp size={20} className="text-gray-500" />
              ) : (
                <ChevronDown size={20} className="text-gray-500" />
              )}
            </button>
            
            {isBusinessOverviewExpanded && (
              <div className="px-6 pb-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Problem Statement</h3>
                    <p className="text-gray-600">{product.businessInfo.problem}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-700 mb-1">Domain</h4>
                      <p className="text-gray-600">{product.businessInfo.domain}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-700 mb-1">Business Unit</h4>
                      <p className="text-gray-600">{product.businessUnit}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-700 mb-1">Risk Level</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${product.businessInfo.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                          product.businessInfo.riskLevel === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'}`}>
                        {product.businessInfo.riskLevel}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Business KPIs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {product.businessInfo.kpis.map((kpi, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-700 mb-2">{kpi.name}</h4>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm text-gray-500">Target: {kpi.target}</div>
                              <div className="text-sm text-gray-500">Current: {kpi.current}</div>
                            </div>
                            <KPITrend trend={kpi.trend} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Accountability</h3>
                    <div className="space-y-4">
                      {product.businessInfo.accountability?.map((member, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <div className="text-sm text-gray-500">Name</div>
                              <div className="font-medium">{member.name}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Role</div>
                              <div className="font-medium">{member.role}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Email</div>
                              <a 
                                href={`mailto:${member.email}`}
                                className="text-[#000089] hover:text-[#000066]"
                              >
                                {member.email}
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Useful Links</h3>
                    <div className="space-y-2">
                      {Object.entries(product.businessInfo.links).map(([key, value]) => (
                        value && (
                          <a
                            key={key}
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-[#000089] hover:text-[#000066]"
                          >
                            <LinkIcon size={16} />
                            <span className="capitalize">{key}</span>
                          </a>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Maturity Assessment</h2>
                <p className="text-gray-600">{product.description}</p>
              </div>
              
              <div className="flex items-center gap-3">
                {selectedAssessment && (
                  <MaturityBadge score={selectedAssessment.overallScore} />
                )}
                <button
                  onClick={() => onNavigate('lifecycle')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${getLifecycleColor(product.lifecycleStage)} hover:opacity-90 transition-opacity`}
                >
                  <span className="capitalize">{product.lifecycleStage}</span>
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
            
            {selectedAssessment ? (
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Assessment from {new Date(selectedAssessment.date).toLocaleDateString()}
                </h3>
                
                {selectedPillar ? (
                  renderPillarContent()
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedAssessment.scores.map(score => {
                      const pillar = pillars.find(p => p.id === score.pillarId);
                      if (!pillar) return null;

                      return (
                        <div
                          key={score.pillarId}
                          className="relative group"
                        >
                          <div 
                            onClick={() => handlePillarClick(score.pillarId)}
                            className="cursor-pointer transition-transform hover:scale-105 hover:shadow-lg"
                          >
                            <PillarScoreCard 
                              pillarScore={score}
                              previousScores={getAssessmentHistory(score.pillarId)}
                              showHistory={true}
                            />
                          </div>
                          <button
                            onClick={() => handleStartPillarAssessment(score.pillarId)}
                            className="absolute top-2 right-2 p-1 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
                            title={`Start new ${pillar.name} assessment`}
                          >
                            <PlusCircle size={16} className="text-gray-600" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No assessment data available.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pillars.map(pillar => (
                    <button 
                      key={pillar.id}
                      onClick={() => handleStartPillarAssessment(pillar.id)}
                      className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed hover:border-solid border-gray-300 hover:border-[#000089] hover:bg-[#000089]/5 transition-all"
                      style={{ borderColor: pillar.color }}
                    >
                      <PlusCircle size={18} style={{ color: pillar.color }} />
                      <span className="font-medium" style={{ color: pillar.color }}>
                        Start {pillar.name} Assessment
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Assessment History</h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                {pillars.map(pillar => (
                  <button 
                    key={pillar.id}
                    onClick={() => handleStartPillarAssessment(pillar.id)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm"
                    style={{ color: pillar.color }}
                  >
                    <PlusCircle size={16} />
                    <span>New {pillar.name} Assessment</span>
                  </button>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                {product.assessments
                  .slice()
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map(assessment =>
                    <button 
                      key={assessment.id}
                      className={`w-full flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors
                                ${selectedAssessment?.id === assessment.id 
                                  ? 'bg-indigo-50 border border-indigo-200' 
                                  : 'hover:bg-gray-50 border border-gray-200'}`}
                      onClick={() => setSelectedAssessment(assessment)}
                    >
                      <div className="flex items-center">
                        <Calendar size={16} className="text-gray-500 mr-2" />
                        <span className="text-sm">
                          {new Date(assessment.date).toLocaleDateString()}
                        </span>
                      </div>
                      <MaturityBadge score={assessment.overallScore} />
                    </button>
                  )
                }
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Pillars</h2>
            
            <div className="space-y-3">
              {pillars.map(pillar => (
                <div 
                  key={pillar.id} 
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                  onClick={() => handlePillarClick(pillar.id)}
                >
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

export default ProductDetail;