import React from 'react';
import { AlertTriangle } from 'lucide-react';

const PocBanner: React.FC = () => {
  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-2 text-amber-800">
        <AlertTriangle size={16} />
        <span className="text-sm font-medium">
          Mockup - Demo Application
        </span>
      </div>
    </div>
  );
};

export default PocBanner;