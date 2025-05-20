import React, { useState, useRef } from 'react';
import { X, Plus, Upload, ChevronDown, ChevronUp } from 'lucide-react';
import { Product, RiskLevel, BusinessInfo, AccountabilityRole, AccountabilityMember, ModelPerformanceDetails } from '../../types';
import { createAndCommitModelCard } from '../../utils/modelCardGenerator';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: Omit<Product, 'id' | 'assessments'>) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [step, setStep] = useState<'upload' | 'manual'>('upload');
  const [showManualEntry, setShowManualEntry] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [modelCardContent, setModelCardContent] = useState<string>('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    businessUnit: '',
    businessInfo: {
      problem: '',
      domain: '',
      riskLevel: 'low' as RiskLevel,
      kpis: [{ name: '', target: '', current: '', trend: 'stable' as const }],
      accountability: [] as AccountabilityMember[],
      links: {
        confluence: '',
        jira: '',
        repository: '',
        sharepoint: ''
      }
    }
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      
      // Read the content of the first markdown file
      const file = files[0];
      if (file.type === 'text/markdown' || file.name.endsWith('.md')) {
        const content = await file.text();
        setModelCardContent(content);
        setUploadStatus('success');
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      setSelectedFiles(files);
      
      // Read the content of the first markdown file
      const file = files[0];
      if (file.type === 'text/markdown' || file.name.endsWith('.md')) {
        const content = await file.text();
        setModelCardContent(content);
        setUploadStatus('success');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const modelPerformance: ModelPerformanceDetails = {
        metrics: {
          classification: {
            train: { precision: 0.92, recall: 0.89, f1: 0.90 },
            validation: { precision: 0.88, recall: 0.85, f1: 0.86 },
            test: { precision: 0.87, recall: 0.84, f1: 0.85 }
          }
        },
        info: {
          version: "1.0.0",
          type: "RandomForestClassifier",
          hyperparameters: {
            n_estimators: 100,
            max_depth: 10,
            min_samples_split: 2,
            min_samples_leaf: 1,
            max_features: "sqrt",
            bootstrap: true
          }
        },
        dependencies: [
          { name: "scikit-learn", version: "1.2.2" },
          { name: "pandas", version: "2.0.1" },
          { name: "numpy", version: "1.24.3" }
        ],
        images: [
          {
            title: "Feature Importance",
            description: "SHAP values showing the impact of each feature on model predictions",
            url: "https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg"
          },
          {
            title: "Confusion Matrix",
            description: "Visualization of model's classification performance",
            url: "https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg"
          }
        ]
      };

      // If a model card file was uploaded, use its content
      if (modelCardContent) {
        await createAndCommitModelCard(formData, modelPerformance, modelCardContent);
      } else {
        // Otherwise, generate and commit a new model card
        await createAndCommitModelCard(formData, modelPerformance);
      }
      
      // Add product
      onAdd({
        ...formData,
        isPinned: false
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating product:', error);
      setUploadStatus('error');
    }
  };

  const addKPI = () => {
    setFormData(prev => ({
      ...prev,
      businessInfo: {
        ...prev.businessInfo,
        kpis: [...prev.businessInfo.kpis, { name: '', target: '', current: '', trend: 'stable' }]
      }
    }));
  };

  const removeKPI = (index: number) => {
    setFormData(prev => ({
      ...prev,
      businessInfo: {
        ...prev.businessInfo,
        kpis: prev.businessInfo.kpis.filter((_, i) => i !== index)
      }
    }));
  };

  const addAccountabilityMember = () => {
    setFormData(prev => ({
      ...prev,
      businessInfo: {
        ...prev.businessInfo,
        accountability: [
          ...prev.businessInfo.accountability,
          { name: '', role: '', email: '', type: 'model' }
        ]
      }
    }));
  };

  const removeAccountabilityMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      businessInfo: {
        ...prev.businessInfo,
        accountability: prev.businessInfo.accountability.filter((_, i) => i !== index)
      }
    }));
  };

  const updateAccountabilityMember = (index: number, field: keyof AccountabilityMember, value: string) => {
    setFormData(prev => {
      const newAccountability = [...prev.businessInfo.accountability];
      newAccountability[index] = {
        ...newAccountability[index],
        [field]: value
      };
      return {
        ...prev,
        businessInfo: {
          ...prev.businessInfo,
          accountability: newAccountability
        }
      };
    });
  };

  if (!isOpen) return null;

  const accountabilityTypes: { value: AccountabilityRole; label: string }[] = [
    { value: 'model', label: 'Model (Data Scientist)' },
    { value: 'deployment', label: 'Deployment (ML Engineer)' },
    { value: 'data', label: 'Data (Analytics Engineer)' },
    { value: 'product', label: 'Product (Product Manager)' },
    { value: 'business', label: 'Business (Business Owner)' }
  ];

  if (step === 'upload') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Add New Product</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Upload Model Card Files</h3>
              <p className="text-gray-600">
                Upload your model card files for automated assessment. We support markdown (.md) files.
              </p>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
                ${uploadStatus === 'error' ? 'border-red-300 bg-red-50' :
                  uploadStatus === 'success' ? 'border-green-300 bg-green-50' :
                  'border-gray-300'}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".md"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {selectedFiles.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center">
                    <Upload size={24} className={
                      uploadStatus === 'success' ? 'text-green-600' :
                      uploadStatus === 'error' ? 'text-red-600' :
                      'text-gray-600'
                    } />
                  </div>
                  <p className="font-medium text-gray-800">
                    {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {selectedFiles.map((file, index) => (
                      <li key={index} className="flex items-center justify-center gap-2">
                        <span>{file.name}</span>
                        {uploadStatus === 'success' && (
                          <span className="text-green-600 text-xs">Selected</span>
                        )}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFiles([]);
                      setUploadStatus('idle');
                      setModelCardContent('');
                    }}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Clear selection
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#000089] text-white rounded-md hover:bg-[#000066] mb-3"
                  >
                    <Upload size={18} />
                    Select Files
                  </button>
                  <p className="text-sm text-gray-500">or drag and drop your files here</p>
                </div>
              )}

              {uploadStatus === 'error' && (
                <p className="mt-3 text-sm text-red-600">
                  Error selecting files. Please try again.
                </p>
              )}
            </div>

            <div className="mt-8">
              <button
                type="button"
                onClick={() => setShowManualEntry(!showManualEntry)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                {showManualEntry ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                <span>Manual Entry (if no model card files available)</span>
              </button>

              {showManualEntry && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-4">
                    If you don't have model card files, you can manually enter the product information.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStep('manual')}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
                  >
                    Continue to Manual Entry
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              {selectedFiles.length > 0 && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-[#000089] text-white rounded-md hover:bg-[#000066]"
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">Add New Product</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#000089] focus:border-[#000089]"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#000089] focus:border-[#000089]"
                rows={3}
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Unit
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#000089] focus:border-[#000089]"
                  value={formData.businessUnit}
                  onChange={e => setFormData(prev => ({ ...prev, businessUnit: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Domain
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#000089] focus:border-[#000089]"
                  value={formData.businessInfo.domain}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    businessInfo: { ...prev.businessInfo, domain: e.target.value }
                  }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Problem
              </label>
              <textarea
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#000089] focus:border-[#000089]"
                rows={3}
                value={formData.businessInfo.problem}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  businessInfo: { ...prev.businessInfo, problem: e.target.value }
                }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Risk Level
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#000089] focus:border-[#000089]"
                value={formData.businessInfo.riskLevel}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  businessInfo: { ...prev.businessInfo, riskLevel: e.target.value as RiskLevel }
                }))}
              >
                <option value="low">Low</option>
                <option value="intermediate">Intermediate</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  KPIs
                </label>
                <button
                  type="button"
                  onClick={addKPI}
                  className="text-sm text-[#000089] hover:text-[#000066]"
                >
                  + Add KPI
                </button>
              </div>
              <div className="space-y-3">
                {formData.businessInfo.kpis.map((kpi, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#000089] focus:border-[#000089]"
                        value={kpi.name}
                        onChange={e => {
                          const newKpis = [...formData.businessInfo.kpis];
                          newKpis[index] = { ...kpi, name: e.target.value };
                          setFormData(prev => ({
                            ...prev,
                            businessInfo: { ...prev.businessInfo, kpis: newKpis }
                          }));
                        }}
                      />
                      <input
                        type="text"
                        required
                        placeholder="Target"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#000089] focus:border-[#000089]"
                        value={kpi.target}
                        onChange={e => {
                          const newKpis = [...formData.businessInfo.kpis];
                          newKpis[index] = { ...kpi, target: e.target.value };
                          setFormData(prev => ({
                            ...prev,
                            businessInfo: { ...prev.businessInfo, kpis: newKpis }
                          }));
                        }}
                      />
                      <input
                        type="text"
                        required
                        placeholder="Current"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#000089] focus:border-[#000089]"
                        value={kpi.current}
                        onChange={e => {
                          const newKpis = [...formData.businessInfo.kpis];
                          newKpis[index] = { ...kpi, current: e.target.value };
                          setFormData(prev => ({
                            ...prev,
                            businessInfo: { ...prev.businessInfo, kpis: newKpis }
                          }));
                        }}
                      />
                      <select
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#000089] focus:border-[#000089]"
                        value={kpi.trend}
                        onChange={e => {
                          const newKpis = [...formData.businessInfo.kpis];
                          newKpis[index] = { ...kpi, trend: e.target.value as 'up' | 'down' | 'stable' };
                          setFormData(prev => ({
                            ...prev,
                            businessInfo: { ...prev.businessInfo, kpis: newKpis }
                          }));
                        }}
                      >
                        <option value="up">Trending Up</option>
                        <option value="down">Trending Down</option>
                        <option value="stable">Stable</option>
                      </select>
                    </div>
                    {formData.businessInfo.kpis.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeKPI(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-800">Accountability</h3>
                <button
                  type="button"
                  onClick={addAccountabilityMember}
                  className="text-sm text-[#000089] hover:text-[#000066] flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add Member
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.businessInfo.accountability.map((member, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg relative">
                    <button
                      type="button"
                      onClick={() => removeAccountabilityMember(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type
                        </label>
                        <select
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#000089] focus:border-[#000089]"
                          value={member.type}
                          onChange={e => updateAccountabilityMember(index, 'type', e.target.value as AccountabilityRole)}
                        >
                          {accountabilityTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#000089] focus:border-[#000089]"
                          value={member.name}
                          onChange={e => updateAccountabilityMember(index, 'name', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Role
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#000089] focus:border-[#000089]"
                          value={member.role}
                          onChange={e => updateAccountabilityMember(index, 'role', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#000089] focus:border-[#000089]"
                          value={member.email}
                          onChange={e => updateAccountabilityMember(index, 'email', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {formData.businessInfo.accountability.length === 0 && (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500">No accountability members added yet.</p>
                    <button
                      type="button"
                      onClick={addAccountabilityMember}
                      className="mt-2 text-[#000089] hover:text-[#000066] flex items-center gap-1 mx-auto"
                    >
                      <Plus size={16} />
                      Add First Member
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confluence
                  </label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#000089] focus:border-[#000089]"
                    value={formData.businessInfo.links.confluence}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      businessInfo: {
                        ...prev.businessInfo,
                        links: { ...prev.businessInfo.links, confluence: e.target.value }
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jira
                  </label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#000089] focus:border-[#000089]"
                    value={formData.businessInfo.links.jira}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      businessInfo: {
                        ...prev.businessInfo,
                        links: { ...prev.businessInfo.links, jira: e.target.value }
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Repository
                  </label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#000089] focus:border-[#000089]"
                    value={formData.businessInfo.links.repository}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      businessInfo: {
                        ...prev.businessInfo,
                        links: { ...prev.businessInfo.links, repository: e.target.value }
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SharePoint
                  </label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#000089] focus:border-[#000089]"
                    value={formData.businessInfo.links.sharepoint}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      businessInfo: {
                        ...prev.businessInfo,
                        links: { ...prev.businessInfo.links, sharepoint: e.target.value }
                      }
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#000089] text-white rounded-md hover:bg-[#000066]"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;