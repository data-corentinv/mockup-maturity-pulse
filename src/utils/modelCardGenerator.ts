import { Product, ModelPerformanceDetails } from '../types';

interface ModelCardData {
  product: Omit<Product, 'id' | 'assessments'>;
  modelPerformance: ModelPerformanceDetails;
}

function generateModelCard(data: ModelCardData): string {
  const { product, modelPerformance } = data;
  const timestamp = new Date().toISOString();

  const formatImageUrl = (image: ModelImage) => {
    if (typeof image.url === 'string') {
      return image.url;
    }
    return `data:image/png;base64,${image.url.data}`;
  };

  return `# ${product.name}

## Overview

${product.description}

**Business Unit:** ${product.businessUnit}
**Domain:** ${product.businessInfo.domain}

## Business Context

### Problem Statement

${product.businessInfo.problem}

### Risk Level

**Level:** ${product.businessInfo.riskLevel}

### Key Performance Indicators

${product.businessInfo.kpis.map(kpi => `
- **${kpi.name}**
  - Target: ${kpi.target}
  - Current: ${kpi.current}
  - Trend: ${kpi.trend}
`).join('')}

## Model Information

### Model Type
${modelPerformance.info.type} (v${modelPerformance.info.version})

### Performance Metrics

#### Classification Performance

| Metric | Training | Validation | Test |
|--------|----------|------------|------|
| Precision | ${(modelPerformance.metrics.classification.train.precision * 100).toFixed(1)}% | ${(modelPerformance.metrics.classification.validation.precision * 100).toFixed(1)}% | ${(modelPerformance.metrics.classification.test.precision * 100).toFixed(1)}% |
| Recall | ${(modelPerformance.metrics.classification.train.recall * 100).toFixed(1)}% | ${(modelPerformance.metrics.classification.validation.recall * 100).toFixed(1)}% | ${(modelPerformance.metrics.classification.test.recall * 100).toFixed(1)}% |
| F1 Score | ${(modelPerformance.metrics.classification.train.f1 * 100).toFixed(1)}% | ${(modelPerformance.metrics.classification.validation.f1 * 100).toFixed(1)}% | ${(modelPerformance.metrics.classification.test.f1 * 100).toFixed(1)}% |

### Hyperparameters

\`\`\`json
${JSON.stringify(modelPerformance.info.hyperparameters, null, 2)}
\`\`\`

### Dependencies

${modelPerformance.dependencies.map(dep => `- ${dep.name}: ${dep.version}`).join('\n')}

## Accountability

${product.businessInfo.accountability.map(member => `
### ${member.role}
- **Name:** ${member.name}
- **Email:** ${member.email}
- **Type:** ${member.type}
`).join('\n')}

## Links

${Object.entries(product.businessInfo.links)
  .filter(([_, value]) => value)
  .map(([key, value]) => `- **${key.charAt(0).toUpperCase() + key.slice(1)}:** ${value}`)
  .join('\n')}

## Model Visualizations

${modelPerformance.images.map(image => `
### ${image.title}
${image.description}

![${image.title}](${formatImageUrl(image)})
`).join('\n')}

---
Generated on: ${new Date(timestamp).toLocaleString()}
`;
}

export async function createAndCommitModelCard(
  product: Omit<Product, 'id' | 'assessments'>,
  modelPerformance: ModelPerformanceDetails,
  existingContent?: string
): Promise<string> {
  // Generate the model card content
  const modelCardContent = existingContent || generateModelCard({ product, modelPerformance });
  
  // Create a timestamp for the filename
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `${product.name.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.md`;
  
  // Store the model card content in localStorage for persistence
  const modelCards = JSON.parse(localStorage.getItem('modelCards') || '{}');
  modelCards[fileName] = modelCardContent;
  localStorage.setItem('modelCards', JSON.stringify(modelCards));
  
  // Return a local identifier for the model card
  return fileName;
}