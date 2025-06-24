import React, { useState } from 'react';
import { Search, ExternalLink, Book, Code, BarChart3, Shield, Eye, Scale, Zap, Users, Filter, ChevronDown, ChevronUp, Star, Github, Globe } from 'lucide-react';

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
  category: 'bias' | 'fairness' | 'explainability' | 'robustness' | 'privacy';
}

const TrustworthyAIPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'transparency' | 'fairness' | 'robustness' | 'accountability'>('transparency');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

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

  const metrics: Record<string, Metric[]> = {
    transparency: [
      {
        name: 'SHAP Values',
        description: 'SHapley Additive exPlanations - Unified approach to explain model predictions',
        interpretation: 'Higher absolute values indicate more important features. Positive values increase prediction, negative decrease it.',
        category: 'explainability',
        difficulty: 'intermediate',
        references: ['https://papers.nips.cc/paper/7062-a-unified-approach-to-interpreting-model-predictions']
      },
      {
        name: 'LIME Score',
        description: 'Local Interpretable Model-agnostic Explanations for individual predictions',
        interpretation: 'Explains individual predictions by learning local interpretable models around predictions.',
        category: 'explainability',
        difficulty: 'beginner',
        references: ['https://arxiv.org/abs/1602.04938']
      },
      {
        name: 'Feature Importance',
        description: 'Measures the contribution of each feature to model predictions',
        interpretation: 'Higher values indicate more important features for the model\'s decision-making process.',
        category: 'explainability',
        difficulty: 'beginner'
      },
      {
        name: 'Permutation Importance',
        description: 'Measures feature importance by observing prediction changes when feature values are permuted',
        interpretation: 'Higher values indicate features that significantly impact model performance when removed.',
        category: 'explainability',
        difficulty: 'intermediate'
      }
    ],
    fairness: [
      {
        name: 'Demographic Parity',
        description: 'Measures if positive prediction rates are equal across groups',
        formula: 'P(Ŷ=1|A=0) = P(Ŷ=1|A=1)',
        interpretation: 'Values close to 0 indicate better demographic parity. Perfect parity = 0.',
        category: 'fairness',
        difficulty: 'beginner'
      },
      {
        name: 'Equal Opportunity',
        description: 'Measures if true positive rates are equal across groups',
        formula: 'P(Ŷ=1|Y=1,A=0) = P(Ŷ=1|Y=1,A=1)',
        interpretation: 'Values close to 0 indicate better equal opportunity. Perfect equality = 0.',
        category: 'fairness',
        difficulty: 'intermediate'
      },
      {
        name: 'Equalized Odds',
        description: 'Combines equal opportunity and equal false positive rates',
        formula: 'TPR and FPR equal across groups',
        interpretation: 'Both true positive and false positive rates should be equal across protected groups.',
        category: 'fairness',
        difficulty: 'intermediate'
      },
      {
        name: 'Calibration',
        description: 'Measures if predicted probabilities match actual outcomes across groups',
        interpretation: 'Well-calibrated models have predicted probabilities that match observed frequencies.',
        category: 'fairness',
        difficulty: 'advanced'
      }
    ],
    robustness: [
      {
        name: 'Adversarial Accuracy',
        description: 'Model accuracy under adversarial attacks',
        interpretation: 'Higher values indicate better robustness to adversarial examples.',
        category: 'robustness',
        difficulty: 'advanced'
      },
      {
        name: 'Certified Robustness',
        description: 'Provable bounds on model robustness within specified perturbation budgets',
        interpretation: 'Provides mathematical guarantees about model behavior under bounded perturbations.',
        category: 'robustness',
        difficulty: 'advanced'
      },
      {
        name: 'Distribution Shift Detection',
        description: 'Measures model performance degradation under data distribution changes',
        interpretation: 'Lower degradation indicates better robustness to distribution shifts.',
        category: 'robustness',
        difficulty: 'intermediate'
      },
      {
        name: 'Input Gradient Norm',
        description: 'Measures sensitivity of model outputs to input changes',
        interpretation: 'Lower gradient norms indicate more stable and robust predictions.',
        category: 'robustness',
        difficulty: 'intermediate'
      }
    ],
    accountability: [
      {
        name: 'Model Lineage Tracking',
        description: 'Comprehensive tracking of model development, training, and deployment history',
        interpretation: 'Complete lineage enables full accountability and reproducibility.',
        category: 'performance',
        difficulty: 'beginner'
      },
      {
        name: 'Audit Trail Completeness',
        description: 'Percentage of model decisions with complete audit trails',
        interpretation: 'Higher percentages indicate better accountability and traceability.',
        category: 'performance',
        difficulty: 'beginner'
      },
      {
        name: 'Compliance Score',
        description: 'Adherence to regulatory requirements and internal policies',
        interpretation: 'Higher scores indicate better compliance with governance frameworks.',
        category: 'performance',
        difficulty: 'intermediate'
      }
    ]
  };

  const tools: Record<string, Tool[]> = {
    transparency: [
      {
        name: 'SHAP',
        description: 'Python library for explaining machine learning models using Shapley values',
        type: 'library',
        language: ['Python'],
        url: 'https://shap.readthedocs.io/',
        github: 'https://github.com/slundberg/shap',
        documentation: 'https://shap.readthedocs.io/',
        category: 'explainability',
        popularity: 5,
        license: 'MIT',
        lastUpdated: '2024-01-15'
      },
      {
        name: 'LIME',
        description: 'Local Interpretable Model-agnostic Explanations',
        type: 'library',
        language: ['Python', 'R'],
        url: 'https://lime-ml.readthedocs.io/',
        github: 'https://github.com/marcotcr/lime',
        category: 'explainability',
        popularity: 4,
        license: 'BSD-2-Clause',
        lastUpdated: '2023-11-20'
      },
      {
        name: 'InterpretML',
        description: 'Microsoft\'s library for interpretable machine learning',
        type: 'library',
        language: ['Python'],
        url: 'https://interpret.ml/',
        github: 'https://github.com/interpretml/interpret',
        category: 'explainability',
        popularity: 4,
        license: 'MIT',
        lastUpdated: '2024-02-01'
      },
      {
        name: 'Alibi',
        description: 'Algorithms for explaining machine learning models',
        type: 'library',
        language: ['Python'],
        url: 'https://docs.seldon.io/projects/alibi/',
        github: 'https://github.com/SeldonIO/alibi',
        category: 'explainability',
        popularity: 3,
        license: 'Apache-2.0',
        lastUpdated: '2024-01-10'
      }
    ],
    fairness: [
      {
        name: 'Fairlearn',
        description: 'Microsoft\'s toolkit for assessing and improving fairness in machine learning',
        type: 'library',
        language: ['Python'],
        url: 'https://fairlearn.org/',
        github: 'https://github.com/fairlearn/fairlearn',
        category: 'fairness',
        popularity: 5,
        license: 'MIT',
        lastUpdated: '2024-01-20'
      },
      {
        name: 'AIF360',
        description: 'IBM\'s comprehensive toolkit for fairness in AI',
        type: 'library',
        language: ['Python', 'R'],
        url: 'https://aif360.mybluemix.net/',
        github: 'https://github.com/Trusted-AI/AIF360',
        category: 'fairness',
        popularity: 4,
        license: 'Apache-2.0',
        lastUpdated: '2024-01-25'
      },
      {
        name: 'Themis',
        description: 'Library for fairness-aware machine learning',
        type: 'library',
        language: ['Python'],
        url: 'https://github.com/cosmicBboy/themis-ml',
        github: 'https://github.com/cosmicBboy/themis-ml',
        category: 'fairness',
        popularity: 2,
        license: 'MIT',
        lastUpdated: '2023-08-15'
      }
    ],
    robustness: [
      {
        name: 'Adversarial Robustness Toolbox',
        description: 'IBM\'s library for adversarial attacks and defenses',
        type: 'library',
        language: ['Python'],
        url: 'https://adversarial-robustness-toolbox.readthedocs.io/',
        github: 'https://github.com/Trusted-AI/adversarial-robustness-toolbox',
        category: 'robustness',
        popularity: 4,
        license: 'MIT',
        lastUpdated: '2024-02-10'
      },
      {
        name: 'CleverHans',
        description: 'Library for benchmarking vulnerability of machine learning systems',
        type: 'library',
        language: ['Python'],
        url: 'https://cleverhans.readthedocs.io/',
        github: 'https://github.com/cleverhans-lab/cleverhans',
        category: 'robustness',
        popularity: 4,
        license: 'MIT',
        lastUpdated: '2023-12-05'
      },
      {
        name: 'Foolbox',
        description: 'Python toolbox to create adversarial examples',
        type: 'library',
        language: ['Python'],
        url: 'https://foolbox.readthedocs.io/',
        github: 'https://github.com/bethgelab/foolbox',
        category: 'robustness',
        popularity: 3,
        license: 'MIT',
        lastUpdated: '2024-01-08'
      }
    ],
    accountability: [
      {
        name: 'MLflow',
        description: 'Platform for managing the ML lifecycle including experimentation and deployment',
        type: 'framework',
        language: ['Python', 'R', 'Java'],
        url: 'https://mlflow.org/',
        github: 'https://github.com/mlflow/mlflow',
        category: 'monitoring',
        popularity: 5,
        license: 'Apache-2.0',
        lastUpdated: '2024-02-15'
      },
      {
        name: 'DVC',
        description: 'Data Version Control for machine learning projects',
        type: 'tool',
        language: ['Python'],
        url: 'https://dvc.org/',
        github: 'https://github.com/iterative/dvc',
        category: 'monitoring',
        popularity: 4,
        license: 'Apache-2.0',
        lastUpdated: '2024-02-12'
      },
      {
        name: 'Weights & Biases',
        description: 'Platform for experiment tracking and model management',
        type: 'service',
        language: ['Python', 'R'],
        url: 'https://wandb.ai/',
        category: 'monitoring',
        popularity: 5,
        license: 'Commercial',
        lastUpdated: '2024-02-20'
      }
    ]
  };

  const examples: Record<string, Example[]> = {
    transparency: [
      {
        title: 'SHAP Feature Importance',
        description: 'Calculate and visualize SHAP values for model explanations',
        language: 'python',
        category: 'explainability',
        code: `import shap
import pandas as pd
from sklearn.ensemble import RandomForestClassifier

# Train your model
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Create SHAP explainer
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)

# Visualize feature importance
shap.summary_plot(shap_values[1], X_test, feature_names=feature_names)

# Get feature importance for a single prediction
shap.force_plot(explainer.expected_value[1], shap_values[1][0], X_test.iloc[0])`
      },
      {
        title: 'LIME Local Explanations',
        description: 'Explain individual predictions using LIME',
        language: 'python',
        category: 'explainability',
        code: `from lime import lime_tabular
import numpy as np

# Create LIME explainer
explainer = lime_tabular.LimeTabularExplainer(
    X_train.values,
    feature_names=feature_names,
    class_names=['Class 0', 'Class 1'],
    mode='classification'
)

# Explain a single instance
instance_idx = 0
explanation = explainer.explain_instance(
    X_test.iloc[instance_idx].values,
    model.predict_proba,
    num_features=10
)

# Show explanation
explanation.show_in_notebook(show_table=True)`
      }
    ],
    fairness: [
      {
        title: 'Demographic Parity Check',
        description: 'Measure demographic parity across protected groups',
        language: 'python',
        category: 'fairness',
        code: `from fairlearn.metrics import demographic_parity_difference
import pandas as pd

# Calculate demographic parity difference
dp_diff = demographic_parity_difference(
    y_true=y_test,
    y_pred=y_pred,
    sensitive_features=sensitive_features
)

print(f"Demographic Parity Difference: {dp_diff:.3f}")

# Detailed analysis by group
results = pd.DataFrame({
    'Group': sensitive_features.unique(),
    'Positive_Rate': [
        (y_pred[sensitive_features == group] == 1).mean()
        for group in sensitive_features.unique()
    ]
})
print(results)`
      },
      {
        title: 'Fairness Metrics Dashboard',
        description: 'Comprehensive fairness evaluation using Fairlearn',
        language: 'python',
        category: 'fairness',
        code: `from fairlearn.metrics import MetricFrame
from sklearn.metrics import accuracy_score, precision_score, recall_score

# Create metric frame for comprehensive analysis
metric_frame = MetricFrame(
    metrics={
        'accuracy': accuracy_score,
        'precision': precision_score,
        'recall': recall_score
    },
    y_true=y_test,
    y_pred=y_pred,
    sensitive_features=sensitive_features
)

# Display results
print("Overall metrics:")
print(metric_frame.overall)
print("\\nBy group:")
print(metric_frame.by_group)
print("\\nDifferences:")
print(metric_frame.difference())`
      }
    ],
    robustness: [
      {
        title: 'Adversarial Attack Testing',
        description: 'Test model robustness against adversarial examples',
        language: 'python',
        category: 'robustness',
        code: `from art.attacks.evasion import FastGradientMethod
from art.estimators.classification import SklearnClassifier
import numpy as np

# Wrap your model
classifier = SklearnClassifier(model=model)

# Create adversarial attack
attack = FastGradientMethod(estimator=classifier, eps=0.1)

# Generate adversarial examples
X_test_adv = attack.generate(x=X_test)

# Evaluate robustness
clean_accuracy = model.score(X_test, y_test)
adv_accuracy = model.score(X_test_adv, y_test)

print(f"Clean Accuracy: {clean_accuracy:.3f}")
print(f"Adversarial Accuracy: {adv_accuracy:.3f}")
print(f"Robustness Drop: {clean_accuracy - adv_accuracy:.3f}")`
      }
    ],
    accountability: [
      {
        title: 'MLflow Experiment Tracking',
        description: 'Track model experiments and lineage with MLflow',
        language: 'python',
        category: 'monitoring',
        code: `import mlflow
import mlflow.sklearn
from sklearn.metrics import accuracy_score

# Start MLflow run
with mlflow.start_run():
    # Log parameters
    mlflow.log_param("n_estimators", 100)
    mlflow.log_param("max_depth", 10)
    
    # Train model
    model.fit(X_train, y_train)
    
    # Make predictions and calculate metrics
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    # Log metrics
    mlflow.log_metric("accuracy", accuracy)
    
    # Log model
    mlflow.sklearn.log_model(model, "model")
    
    # Log artifacts
    mlflow.log_artifact("feature_importance.png")`
      }
    ]
  };

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
      {/* <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
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
      </div> */}
    </div>
  );
};

export default TrustworthyAIPage;