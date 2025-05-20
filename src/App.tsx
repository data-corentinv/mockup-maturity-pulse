import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import ProductDetail from './pages/ProductDetail';
import AssessmentPage from './pages/AssessmentPage';
import StrategyView from './pages/StrategyView';
import LifecyclePage from './pages/LifecyclePage';
import HeatmapPage from './pages/HeatmapPage';
import ProductList from './components/product/ProductList';
import { Product } from './types';
import { products as initialProducts, updateProducts } from './data/mockData';

function App() {
  const { isAuthenticated, user } = useAuth();
  const [view, setView] = useState<'products' | 'product-detail' | 'assessment' | 'strategy' | 'lifecycle' | 'heatmap'>('products');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPillarId, setSelectedPillarId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleSearch = (event: Event) => {
      const customEvent = event as CustomEvent;
      setSearchQuery(customEvent.detail.query);
    };

    window.addEventListener('app-search', handleSearch);
    return () => window.removeEventListener('app-search', handleSearch);
  }, []);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesEntity = user?.role === 'admin' || product.axaEntity === user?.entity;
    
    return matchesSearch && matchesEntity;
  });

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setView('product-detail');
  };

  const handleStartAssessment = (product: Product, pillarId?: string) => {
    setSelectedProduct(product);
    setSelectedPillarId(pillarId || null);
    setView('assessment');
  };

  const handleBackToProducts = () => {
    setView('products');
    setSelectedPillarId(null);
  };

  const handleBackToProduct = () => {
    setView('product-detail');
    setSelectedPillarId(null);
  };

  const handleAssessmentComplete = (updatedProduct: Product) => {
    const updatedProducts = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    setProducts(updatedProducts);
    updateProducts(updatedProducts);
    setSelectedProduct(updatedProduct);
    setSelectedPillarId(null);
    setView('product-detail');
  };

  const handleTogglePin = (productId: string) => {
    const updatedProducts = products.map(p => 
      p.id === productId ? { ...p, isPinned: !p.isPinned } : p
    );
    setProducts(updatedProducts);
    updateProducts(updatedProducts);
  };

  const handleAddProduct = (newProduct: Omit<Product, 'id' | 'assessments'>) => {
    const product: Product = {
      ...newProduct,
      id: `product-${Date.now()}`,
      assessments: [],
      axaEntity: user?.entity || 'FR'
    };
    const updatedProducts = [...products, product];
    setProducts(updatedProducts);
    updateProducts(updatedProducts);
  };

  const renderContent = () => {
    switch (view) {
      case 'products':
        return (
          <div className="container mx-auto px-4 py-6">
            <ProductList 
              products={filteredProducts}
              onProductSelect={handleProductSelect}
              onTogglePin={handleTogglePin}
              onAddProduct={handleAddProduct}
            />
          </div>
        );
      case 'strategy':
        return <StrategyView products={filteredProducts} />;
      case 'lifecycle':
        return <LifecyclePage products={filteredProducts} />;
      case 'heatmap':
        return <HeatmapPage products={filteredProducts} />;
      case 'product-detail':
        return selectedProduct ? (
          <ProductDetail 
            product={selectedProduct}
            onBack={handleBackToProducts}
            onStartAssessment={handleStartAssessment}
            onNavigate={setView}
          />
        ) : null;
      case 'assessment':
        return selectedProduct ? (
          <AssessmentPage 
            product={selectedProduct}
            onBack={handleBackToProduct}
            onComplete={handleAssessmentComplete}
            selectedPillarId={selectedPillarId || undefined}
          />
        ) : null;
      default:
        return (
          <div className="container mx-auto px-4 py-6">
            <ProductList 
              products={filteredProducts}
              onProductSelect={handleProductSelect}
              onTogglePin={handleTogglePin}
              onAddProduct={handleAddProduct}
            />
          </div>
        );
    }
  };

  return (
    <Layout currentView={view} onNavigate={setView}>
      {renderContent()}
    </Layout>
  );
}

export default App;