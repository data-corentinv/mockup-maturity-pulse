import React from 'react';
import { Box, TrendingUp, LifeBuoy, Grid, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  activeMenuItem: string;
  onNavigate: (view: 'products' | 'strategy' | 'lifecycle' | 'heatmap' | 'trustworthy-ai') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeMenuItem, onNavigate }) => {
  const { user } = useAuth();
  
  const menuItems = [
    { id: 'products', name: 'All Products', icon: <Box size={18} /> },
    { id: 'strategy', name: 'Strategy View', icon: <TrendingUp size={18} /> },
    { id: 'lifecycle', name: 'AI Lifecycle', icon: <LifeBuoy size={18} /> },
    { 
      id: 'heatmap', 
      name: 'Heatmap', 
      icon: <Grid size={18} />,
      adminOnly: true
    },
    { 
      id: 'trustworthy-ai', 
      name: 'Trustworthy AI', 
      icon: <Shield size={18} />
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    !item.adminOnly || user?.role === 'admin'
  );

  return (
    <aside 
      className={`fixed top-0 left-0 h-full bg-[#000089] text-white transition-all duration-300 ease-in-out z-20 
                 ${isOpen ? 'w-64' : 'w-0 lg:w-16'} lg:translate-x-0 
                 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="h-full flex flex-col">
        <div className="h-14 flex items-center px-4 border-b border-opacity-20 border-white">
          {isOpen && (
            <div className="flex items-center gap-2">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/9/94/AXA_Logo.svg" 
                alt="AXA Maturity Pulse Logo" 
                className="w-5 h-5 object-contain"
              />
              <span className="font-semibold">AXA Maturity Pulse</span>
            </div>
          )}
        </div>
        
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            {filteredMenuItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`w-full flex items-center px-4 py-2.5 hover:bg-[#000066] transition-colors
                             ${activeMenuItem === item.id ? 'bg-[#000066] border-l-4 border-white' : ''}`}
                  onClick={() => onNavigate(item.id as 'products' | 'strategy' | 'lifecycle' | 'heatmap')}
                >
                  <span className="flex items-center">
                    {item.icon}
                  </span>
                  {isOpen && (
                    <span className="ml-3">{item.name}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;