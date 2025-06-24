import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, Book, Code, BarChart3, Shield, Eye, Scale, Zap, Users, Filter, ChevronDown, ChevronUp, Star, Github, Globe } from 'lucide-react';
import metricsData from '../data/trustworthy-ai-metrics.json';
import toolsData from '../data/trustworthy-ai-tools.json';

interface Metric {
  name: string;
  description: string;
  formula?: string;
  interpretation: string;
  category: 'bias' | 'fairness' | 'explainability' | 'robustness' | 'privacy' | 'performance';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  references?: string[];
}

interface Tool {
  name: string;
  description: string;
  type: 'library' | 'framework' | 'service' | 'tool';
  language: string[];
  url: string;
  github?: string;
  documentation?: string;
  category: 'bias' | 'fairness' | 'explainability' | 'robustness' | 'privacy' | 'monitoring';
  popularity: number; // 1-5 stars
  license: string;
  lastUpdated: string;
}

interface Example {
  title: string;
  description: string;
  code: string;
  language: 'python' | 'r' | 'javascript';
  category: 'bias' | 'fairness' | 'explainability' | 'robustness' | 'privacy' | 'monitoring';
}

export const metrics = metricsData;
export const tools = toolsData;

const TrustworthyAIPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'transparency' | 'fairness' | 'robustness' | 'accountability'>('transparency');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [examples, setExamples] = useState<Record<string, Example[]>>({
    transparency: [],
    fairness: [],
    robustness: [],
    accountability: []
  });

  useEffect(() => {
    // Load examples from markdown file
    const loadExamples = async () => {
      const response = await fetch('/src/data/trustworthy-ai-examples.md');
      const markdownContent = await response.text();
        
      // Parse markdown content to extract examples
      const parsedExamples = parseMarkdownExamples(markdownContent);
      setExamples(parsedExamples);
    };

    loadExamples();
  }, []);

  const parseMarkdownExamples = (markdown: string): Record<string, Example[]> => {
    const examples: Record<string, Example[]> = {
      transparency: [],
      fairness: [],
      robustness: [],
      accountability: []
    };

    // Split by main sections
    const sections = markdown.split(/^## /m).slice(1); // Remove empty first element

    sections.forEach(section => {
      const lines = section.split('\n');
      const sectionTitle = lines[0].trim();
      
      let currentPrinciple = '';
      if (sectionTitle.includes('Transparency')) currentPrinciple = 'transparency';
      else if (sectionTitle.includes('Fairness')) currentPrinciple = 'fairness';
      else if (sectionTitle.includes('Robustness')) currentPrinciple = 'robustness';
      else if (sectionTitle.includes('Accountability')) currentPrinciple = 'accountability';

      if (!currentPrinciple) return;

      // Split by subsections (###)
      const subsections = section.split(/^### /m).slice(1);
      
      subsections.forEach(subsection => {
        const subLines = subsection.split('\n');
        const title = subLines[0].trim();
        
        let description = '';
        let code = '';
        let inCodeBlock = false;
        let codeLines: string[] = [];

        for (let i = 1; i < subLines.length; i++) {
          const line = subLines[i];
          
          if (line.startsWith('```python')) {
            inCodeBlock = true;
            continue;
          } else if (line.startsWith('```') && inCodeBlock) {
            inCodeBlock = false;
            code = codeLines.join('\n');
            break;
          } else if (inCodeBlock) {
            codeLines.push(line);
          } else if (!description && line.trim() && !line.startsWith('```')) {
            description = line.trim();
          }
        }

        if (title && description && code) {
          examples[currentPrinciple as keyof typeof examples].push({
            title,
            description,
            code,
            language: 'python',
            category: currentPrinciple === 'transparency' ? 'explainability' :
                     currentPrinciple === 'fairness' ? 'fairness' :
                     currentPrinciple === 'robustness' ? 'robustness' :
                     'monitoring'
          });
        }
      });
    });

    return examples;
  };

  const principles = [
    {
      id: 'transparency',
      name: 'Transparency & Explainability',
      icon: Eye,
      color: 'bg-blue-500',
      description: 'Making AI decisions interpretable and understandable'
    },
    {
      id: 'fairness',
      name: 'Fairness & Non-discrimination',
      icon: Scale,
      color: 'bg-green-500',
      description: 'Ensuring equitable treatment across different groups'
    },
    {
      id: 'robustness',
      name: 'Robustness & Security',
      icon: Shield,
      color: 'bg-red-500',
      description: 'Building resilient and secure AI systems'
    },
    {
      id: 'accountability',
      name: 'Accountability & Governance',
      icon: Users,
      color: 'bg-purple-500',
      description: 'Establishing clear responsibility and oversight'
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const filteredTools = tools[activeTab]?.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesType = selectedType === 'all' || tool.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  }) || [];

  const filteredMetrics = metrics[activeTab]?.filter(metric => {
    const matchesSearch = metric.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         metric.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || metric.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const filteredExamples = examples[activeTab]?.filter(example => {
    const matchesSearch = example.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         example.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || example.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Trustworthy AI Resources</h1>
        <p className="text-gray-600">
          Comprehensive guide to metrics, tools, and examples for implementing trustworthy AI principles
        </p>
      </div>

      {/* Principle Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {principles.map(principle => {
            const Icon = principle.icon;
            return (
              <button
                key={principle.id}
                onClick={() => setActiveTab(principle.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === principle.id
                    ? `${principle.color} text-white`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{principle.name}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-600">
            {principles.find(p => p.id === activeTab)?.description}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search metrics, tools, or examples..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="explainability">Explainability</option>
              <option value="fairness">Fairness</option>
              <option value="robustness">Robustness</option>
              <option value="privacy">Privacy</option>
              <option value="monitoring">Monitoring</option>
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="library">Library</option>
              <option value="framework">Framework</option>
              <option value="service">Service</option>
              <option value="tool">Tool</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {/* Metrics Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <button
            onClick={() => toggleSection('metrics')}
            className="w-full px-6 py-4 flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <BarChart3 size={20} className="text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">Metrics & Measurements</h2>
              <span className="text-sm text-gray-500">({filteredMetrics.length})</span>
            </div>
            {expandedSections.metrics ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {expandedSections.metrics && (
            <div className="px-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMetrics.map((metric, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">{metric.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(metric.difficulty)}`}>
                        {metric.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{metric.description}</p>
                    {metric.formula && (
                      <div className="mb-3">
                        <span className="text-xs font-medium text-gray-500">Formula:</span>
                        <code className="block mt-1 p-2 bg-gray-100 rounded text-xs font-mono">
                          {metric.formula}
                        </code>
                      </div>
                    )}
                    <div className="mb-3">
                      <span className="text-xs font-medium text-gray-500">Interpretation:</span>
                      <p className="text-xs text-gray-600 mt-1">{metric.interpretation}</p>
                    </div>
                    {metric.references && (
                      <div className="flex flex-wrap gap-1">
                        {metric.references.map((ref, refIndex) => (
                          <a
                            key={refIndex}
                            href={ref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <Book size={12} />
                            Reference
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tools Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <button
            onClick={() => toggleSection('tools')}
            className="w-full px-6 py-4 flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <Code size={20} className="text-green-600" />
              <h2 className="text-xl font-semibold text-gray-800">Tools & Libraries</h2>
              <span className="text-sm text-gray-500">({filteredTools.length})</span>
            </div>
            {expandedSections.tools ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {expandedSections.tools && (
            <div className="px-6 pb-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredTools.map((tool, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">{tool.name}</h3>
                      <div className="flex items-center gap-1">
                        {renderStars(tool.popularity)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500">Type:</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {tool.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500">Languages:</span>
                        <div className="flex gap-1">
                          {tool.language.map((lang, langIndex) => (
                            <span key={langIndex} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500">License:</span>
                        <span className="text-xs text-gray-600">{tool.license}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Globe size={12} />
                        Website
                      </a>
                      {tool.github && (
                        <a
                          href={tool.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-gray-600 hover:text-gray-800 flex items-center gap-1"
                        >
                          <Github size={12} />
                          GitHub
                        </a>
                      )}
                      {tool.documentation && (
                        <a
                          href={tool.documentation}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-green-600 hover:text-green-800 flex items-center gap-1"
                        >
                          <Book size={12} />
                          Docs
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Examples Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <button
            onClick={() => toggleSection('examples')}
            className="w-full px-6 py-4 flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <Zap size={20} className="text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-800">Code Examples</h2>
              <span className="text-sm text-gray-500">({filteredExamples.length})</span>
            </div>
            {expandedSections.examples ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {expandedSections.examples && (
            <div className="px-6 pb-6">
              <div className="space-y-4">
                {filteredExamples.map((example, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">{example.title}</h3>
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                        {example.language}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{example.description}</p>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm text-gray-100">
                        <code>{example.code}</code>
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Start Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {principles.map((principle, index) => {
            const Icon = principle.icon;
            return (
              <div key={principle.id} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-2 rounded-lg ${principle.color} bg-opacity-10`}>
                    <Icon className={principle.color.replace('bg-', 'text-')} size={20} />
                  </div>
                  <span className="font-medium text-gray-800">Step {index + 1}</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{principle.name}</h3>
                <p className="text-xs text-gray-600">{principle.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrustworthyAIPage;