import React, { useState } from 'react';
import { Menu, Search, Github, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { logout, user } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Emit search event to parent components
    const searchEvent = new CustomEvent('app-search', { 
      detail: { query: searchQuery }
    });
    window.dispatchEvent(searchEvent);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/9/94/AXA_Logo.svg" 
              alt="AXA Maturity Pulse Logo" 
              className="w-6 h-6 object-contain"
            />
            <span className="text-xl font-bold text-gray-800">AXA Maturity Pulse</span>
          </div>
        </div>
        
        <form 
          onSubmit={handleSearch}
          className="relative max-w-xs w-full hidden md:block"
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#000089] focus:border-[#000089] focus:outline-none"
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        
        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{user.entity}</span>
                {user.role === 'admin' && (
                  <span className="ml-2 text-xs bg-[#000089] text-white px-2 py-0.5 rounded-full">
                    Admin
                  </span>
                )}
              </div>
              <button 
                onClick={logout}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
          <a 
            href="https://github.com/yourusername/axa-maturity-pulse"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#000089] hover:text-[#000066] transition-colors"
          >
            <Github size={20} />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;