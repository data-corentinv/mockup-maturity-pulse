import React from 'react';
import useSWR from 'swr';
import { AlertTriangle } from 'lucide-react';
import codeQualityData from '../../data/code-quality.json';

interface CodeQualityMetrics {
  bugs: number;
  vulnerabilities: number;
  codeSmells: number;
  coverage: number;
  duplications: number;
  securityHotspots: number;
  links: {
    sonarcloud: string;
    coverage: string;
    bugs: string;
    vulnerabilities: string;
    codeSmells: string;
    securityHotspots: string;
  };
}

interface CodeQualityChartProps {
  projectKey: string;
}

const fetcher = async (projectKey: string): Promise<CodeQualityMetrics | null> => {
  try {
    // Get data from code-quality.json
    const data = codeQualityData.products[projectKey];
    if (!data) {
      throw new Error('No code quality data found for project');
    }
    return data;
  } catch (error) {
    console.error('Error fetching code quality metrics:', error);
    return null;
  }
};

const CodeQualityChart: React.FC<CodeQualityChartProps> = ({ projectKey }) => {
  const { data, error, isLoading } = useSWR<CodeQualityMetrics | null>(
    `/api/code-quality/${projectKey}`,
    () => fetcher(projectKey)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#000089]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-700">
          <AlertTriangle size={20} />
          <span>Failed to load code quality metrics</span>
        </div>
      </div>
    );
  }

  const metrics = [
    { name: 'Bugs', value: data?.bugs ?? 0, color: 'bg-red-500', target: 0, isGood: (v: number) => v === 0 },
    { name: 'Vulnerabilities', value: data?.vulnerabilities ?? 0, color: 'bg-orange-500', target: 0, isGood: (v: number) => v === 0 },
    { name: 'Code Smells', value: data?.codeSmells ?? 0, color: 'bg-yellow-500', target: "A", isGood: (v: number) => v < 10 },
    { name: 'Coverage', value: data?.coverage ?? 0, color: 'bg-green-500', isPercentage: true, target: 80, isGood: (v: number) => v >= 80 },
    { name: 'Duplications', value: data?.duplications ?? 0, color: 'bg-blue-500', isPercentage: true, target: 3, isGood: (v: number) => v < 3 },
    { name: 'Security Hotspots', value: data?.securityHotspots ?? 0, color: 'bg-purple-500', target: 0, isGood: (v: number) => v === 0 }
  ];

  return (
    <div className="space-y-4">
      {metrics.map((metric) => {
        const isGood = metric.isGood(metric.value);
        
        return (
          <div key={metric.name} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-700">{metric.name}</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${isGood ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.isPercentage ? `${metric.value}%` : metric.value}
                </span>
                <span className="text-xs text-gray-500">
                  Target: {metric.isPercentage ? `${metric.target}%` : metric.target}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${metric.color} transition-all duration-300`}
                style={{
                  width: metric.isPercentage ? 
                    `${metric.value}%` : 
                    `${Math.min((metric.value / (metric.target * 2)) * 100, 100)}%`
                }}
              ></div>
            </div>
          </div>
        );
      })}

      {data?.links && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <a 
              href={data.links.sonarcloud}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#000089] hover:text-[#000066] font-medium"
            >
              View on SonarCloud →
            </a>
          </div>
          <p className="text-xs text-gray-500">
            Data sourced from SonarCloud. Metrics are updated automatically with each code analysis.
          </p>
        </div>
      )}
    </div>
  );
};

export default CodeQualityChart;