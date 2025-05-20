import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPITrendProps {
  trend: 'up' | 'down' | 'stable';
}

const KPITrend: React.FC<KPITrendProps> = ({ trend }) => {
  const getIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} className="text-green-600" />;
      case 'down':
        return <TrendingDown size={16} className="text-red-600" />;
      case 'stable':
        return <Minus size={16} className="text-gray-600" />;
    }
  };

  return (
    <div className="flex items-center justify-center">
      {getIcon()}
    </div>
  );
};

export default KPITrend;