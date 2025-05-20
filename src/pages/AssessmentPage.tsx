import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Save, CheckCircle, ArrowUpRight } from 'lucide-react';
import { Product, Question, Pillar, AnswerType, Answer, LifecycleStage } from '../types';
import { questions, pillars } from '../data/mockData';
import sectionsData from '../data/sections.json';
import { useAuth } from '../context/AuthContext';
import AssessmentHeader from '../components/assessment/AssessmentHeader';
import QuestionSection from '../components/assessment/QuestionSection';
import { logAssessment } from '../utils/assessmentLogger';

interface AssessmentPageProps {
  product: Product;
  onBack: () => void;
  onComplete: (product: Product) => void;
  selectedPillarId?: string;
}

const AssessmentPage: React.FC<AssessmentPageProps> = ({ 
  product, 
  onBack,
  onComplete,
  selectedPillarId = 'p6'
}) => {
  const { user } = useAuth();
  const selectedPillar = pillars.find(p => p.id === selectedPillarId);
  const pillarQuestions = questions.filter(q => q.pillarId === selectedPillarId);
  const sections = sectionsData.sections[selectedPillarId] || [];
  
  const [answers, setAnswers] = useState<Record<string, AnswerType | null>>({});
  const [completed, setCompleted] = useState(false);
  const [stageProgress, setStageProgress] = useState<Record<LifecycleStage, number>>({
    ideation: 0,
    poc: 0,
    mvp: 0,
    pilot: 0,
    rollout: 0,
    retire: 0
  });
  
  useEffect(() => {
    const initialAnswers = pillarQuestions.reduce((acc, question) => ({
      ...acc,
      [question.id]: null
    }), {});
    
    setAnswers(initialAnswers);
  }, []);

  useEffect(() => {
    // Calculate progress for each lifecycle stage
    const stageQuestions = pillarQuestions.reduce((acc, question) => {
      acc[question.lifecycleStage] = (acc[question.lifecycleStage] || 0) + 1;
      return acc;
    }, {} as Record<LifecycleStage, number>);

    const stageAnswers = pillarQuestions.reduce((acc, question) => {
      if (answers[question.id] === 'yes') {
        acc[question.lifecycleStage] = (acc[question.lifecycleStage] || 0) + 1;
      }
      return acc;
    }, {} as Record<LifecycleStage, number>);

    const progress = Object.keys(stageQuestions).reduce((acc, stage) => {
      const total = stageQuestions[stage as LifecycleStage] || 0;
      const answered = stageAnswers[stage as LifecycleStage] || 0;
      acc[stage as LifecycleStage] = total > 0 ? Math.round((answered / total) * 100) : 0;
      return acc;
    }, {} as Record<LifecycleStage, number>);

    setStageProgress(progress);
  }, [answers]);
  
  const handleAnswerSelected = (questionId: string, value: AnswerType) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  const calculateProgress = (): number => {
    if (pillarQuestions.length === 0) return 0;
    const answeredCount = Object.values(answers).filter(answer => answer !== null).length;
    return (answeredCount / pillarQuestions.length) * 100;
  };
  
  const calculateScore = (): number => {
    const validAnswers = Object.entries(answers).filter(
      ([_, value]) => value !== 'not-relevant' && value !== 'unknown'
    );
    
    if (validAnswers.length === 0) return 0;
    
    const yesAnswers = validAnswers.filter(([_, value]) => value === 'yes');
    return Math.round((yesAnswers.length / validAnswers.length) * 100);
  };

  const getNextLifecycleStage = (currentStage: LifecycleStage): LifecycleStage | null => {
    const stages: LifecycleStage[] = ['ideation', 'poc', 'mvp', 'pilot', 'rollout', 'retire'];
    const currentIndex = stages.indexOf(currentStage);
    return currentIndex < stages.length - 1 ? stages[currentIndex + 1] : null;
  };
  
  const handleComplete = async () => {
    const score = calculateScore();
    
    // Log assessment results
    try {
      await logAssessment({
        productName: product.name,
        entity: product.axaEntity,
        businessDomain: product.businessDomain,
        pillarId: selectedPillarId,
        answers: answers as Record<string, string>,
        score,
        timestamp: new Date().toISOString(),
        user: user!
      });
    } catch (error) {
      console.error('Failed to log assessment:', error);
      // Continue with the assessment completion even if logging fails
    }

    // Check if we should advance to the next lifecycle stage
    const currentStage = product.lifecycleStage;
    const nextStage = getNextLifecycleStage(currentStage);
    const shouldAdvance = stageProgress[currentStage] >= 80 && nextStage;
    
    const existingAssessment = product.assessments.length > 0 
      ? product.assessments[product.assessments.length - 1]
      : null;
    
    const newScores = existingAssessment 
      ? existingAssessment.scores.map(s => 
          s.pillarId === selectedPillarId 
            ? { ...s, score } 
            : s
        )
      : [{ pillarId: selectedPillarId, score }];
    
    const newAssessment = {
      id: `a${new Date().getTime()}`,
      date: new Date().toISOString().split('T')[0],
      scores: newScores,
      overallScore: Math.round(
        newScores.reduce((sum, item) => sum + item.score, 0) / newScores.length
      )
    };
    
    const updatedProduct = {
      ...product,
      assessments: [...product.assessments, newAssessment],
      lifecycleStage: shouldAdvance ? nextStage : currentStage
    };
    
    onComplete(updatedProduct);
  };
  
  if (!selectedPillar) return null;

  const getQuestionsForSection = (sectionId: string): Question[] => {
    const sectionCount = sections.length;
    const questionsPerSection = Math.ceil(pillarQuestions.length / sectionCount);
    const sectionIndex = sections.findIndex(s => s.id === sectionId);
    
    return pillarQuestions.slice(
      sectionIndex * questionsPerSection,
      (sectionIndex + 1) * questionsPerSection
    );
  };

  const getLifecycleColor = (stage: LifecycleStage): string => {
    switch (stage) {
      case 'ideation': return 'bg-blue-100 text-blue-800';
      case 'poc': return 'bg-purple-100 text-purple-800';
      case 'mvp': return 'bg-indigo-100 text-indigo-800';
      case 'pilot': return 'bg-green-100 text-green-800';
      case 'rollout': return 'bg-orange-100 text-orange-800';
      case 'retire': return 'bg-red-100 text-red-800';
    }
  };
  
  return (
    <div>
      <AssessmentHeader 
        product={product}
        pillar={selectedPillar}
        onBack={onBack}
        currentStep={1}
        totalSteps={1}
      />
      
      <div className="container mx-auto px-4 py-6">
        {!completed ? (
          <div>
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                <h2 className="text-xl font-semibold text-gray-800">
                  {selectedPillar.name}
                </h2>
                
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300 ease-out" 
                      style={{ 
                        width: `${calculateProgress()}%`,
                        backgroundColor: selectedPillar.color 
                      }}
                    ></div>
                  </div>
                  <span>{Math.round(calculateProgress())}% complete</span>
                </div>
              </div>
              <p className="text-gray-600">{selectedPillar.description}</p>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {(Object.keys(stageProgress) as LifecycleStage[]).map((stage) => (
                  <div 
                    key={stage}
                    className={`p-2 rounded-lg ${getLifecycleColor(stage)} ${
                      stage === product.lifecycleStage ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium capitalize">{stage}</span>
                      <span className="text-xs font-bold">{stageProgress[stage]}%</span>
                    </div>
                    <div className="w-full bg-white/30 rounded-full h-1">
                      <div 
                        className="h-1 rounded-full bg-current transition-all duration-300"
                        style={{ width: `${stageProgress[stage]}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-8">
              {sections.map(section => (
                <QuestionSection
                  key={section.id}
                  title={section.title}
                  description={section.description}
                  questions={getQuestionsForSection(section.id)}
                  currentAnswers={answers}
                  onAnswerSelected={handleAnswerSelected}
                />
              ))}
            </div>
            
            <div className="flex justify-between mt-8">
              <button 
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                <ChevronLeft size={18} />
                <span>Cancel</span>
              </button>
              
              <button 
                onClick={() => setCompleted(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                <span>Review</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Assessment Complete!</h2>
              <p className="text-gray-600">
                You've completed the {selectedPillar.name} assessment for {product.name}.
              </p>
            </div>
            
            <div className="mb-8">
              <div 
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                style={{ borderColor: selectedPillar.color }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: selectedPillar.color }}
                  ></div>
                  <h4 className="font-medium text-gray-800">{selectedPillar.name}</h4>
                </div>
                
                <div className="text-3xl font-bold mb-2">{calculateScore()}%</div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-500 ease-out" 
                    style={{ 
                      width: `${calculateScore()}%`,
                      backgroundColor: selectedPillar.color 
                    }}
                  ></div>
                </div>

                {stageProgress[product.lifecycleStage] >= 80 && getNextLifecycleStage(product.lifecycleStage) && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800">
                      <ArrowUpRight size={20} />
                      <span className="font-medium">
                        Ready to advance to {getNextLifecycleStage(product.lifecycleStage)}!
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-green-700">
                      Your project has met the criteria to move to the next lifecycle stage.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-between">
              <button 
                onClick={() => setCompleted(false)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={18} />
                <span>Go Back</span>
              </button>
              
              <button 
                onClick={handleComplete}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                <Save size={18} />
                <span>Save Assessment</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentPage;