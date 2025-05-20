import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import PocBanner from './PocBanner';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: 'products' | 'strategy' | 'lifecycle') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        activeMenuItem={currentView}
        onNavigate={onNavigate}
      />
      
      <div className="flex-1 flex flex-col lg:pl-16">
        <PocBanner />
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Layout;