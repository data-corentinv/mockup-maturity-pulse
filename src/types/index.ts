export type RiskLevel = 'low' | 'intermediate' | 'high';
export type BusinessDomain = 'P&C Retail Claims' | 'Health Claims' | 'CL Underwriting' | 'P&C Retail Pricing';
export type AXAEntity = 'FR' | 'UK' | 'SP' | 'XL' | 'GE' | 'IT' | 'BE' | 'SW' | 'JP' | 'HK';
export type LifecycleStage = 'ideation' | 'poc' | 'mvp' | 'pilot' | 'rollout' | 'retire';
export type AccountabilityRole = 'model' | 'deployment' | 'data' | 'product' | 'business';

export interface KPI {
  name: string;
  target: string;
  current: string;
  trend: 'up' | 'down' | 'stable';
}

export interface AccountabilityMember {
  name: string;
  role: string;
  email: string;
  type: AccountabilityRole;
}

export interface Links {
  confluence: string;
  jira: string;
  repository: string;
  sharepoint: string;
}

export interface BusinessInfo {
  problem: string;
  domain: string;
  riskLevel: RiskLevel;
  kpis: KPI[];
  accountability: AccountabilityMember[];
  links: Links;
}

export interface PillarScore {
  pillarId: string;
  score: number;
}

export interface Assessment {
  id: string;
  date: string;
  scores: PillarScore[];
  overallScore: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  businessUnit: string;
  axaEntity: AXAEntity;
  businessDomain: BusinessDomain;
  lifecycleStage: LifecycleStage;
  businessInfo: BusinessInfo;
  assessments: Assessment[];
  isPinned?: boolean;
}

export interface Pillar {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface Question {
  id: string;
  text: string;
  pillarId: string;
  lifecycleStage: LifecycleStage;
  info?: {
    what: string;
    why: string;
    example: string;
  };
}

export type AnswerType = 'yes' | 'no' | 'unknown' | 'not-relevant';

export interface Answer {
  questionId: string;
  answer: AnswerType;
}

export interface ModelImage {
  title: string;
  description: string;
  url: string | { type: 'base64'; data: string };
}

export interface ModelPerformanceDetails {
  metrics: {
    classification: {
      train: { precision: number; recall: number; f1: number };
      validation: { precision: number; recall: number; f1: number };
      test: { precision: number; recall: number; f1: number };
    };
  };
  info: {
    version: string;
    type: string;
    hyperparameters: Record<string, string | number | boolean>;
  };
  dependencies: Array<{ name: string; version: string }>;
  images: ModelImage[];
}

export interface TrustMetric {
  name: string;
  value: number;
  description: string;
}

export interface TrustAspect {
  score: number;
  metrics: TrustMetric[];
}

export interface TrustAspects {
  transparency: TrustAspect;
  fairness: TrustAspect;
  robustness: TrustAspect;
  accountability: TrustAspect;
}