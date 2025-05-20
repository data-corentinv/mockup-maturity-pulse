import React, { useState } from 'react';
import { CheckCircle, XCircle, HelpCircle, Slash, Info, LifeBuoy } from 'lucide-react';
import { Question, AnswerType } from '../../types';

interface QuestionItemProps {
  question: Question;
  currentAnswer: AnswerType | null;
  onAnswerSelected: (questionId: string, answer: AnswerType) => void;
}

const QuestionItem: React.FC<QuestionItemProps> = ({ 
  question, 
  currentAnswer, 
  onAnswerSelected 
}) => {
  const [showInfo, setShowInfo] = useState(false);

  const answerOptions: { value: AnswerType; label: string; icon: React.ReactNode; color: string }[] = [
    { 
      value: 'yes', 
      label: 'Yes', 
      icon: <CheckCircle size={20} />,
      color: 'text-green-600 border-green-600 bg-green-50 hover:bg-green-100' 
    },
    { 
      value: 'no', 
      label: 'No', 
      icon: <XCircle size={20} />,
      color: 'text-red-600 border-red-600 bg-red-50 hover:bg-red-100' 
    },
    { 
      value: 'unknown', 
      label: 'I don\'t know', 
      icon: <HelpCircle size={20} />,
      color: 'text-amber-600 border-amber-600 bg-amber-50 hover:bg-amber-100' 
    },
    { 
      value: 'not-relevant', 
      label: 'Not relevant', 
      icon: <Slash size={20} />,
      color: 'text-gray-600 border-gray-600 bg-gray-50 hover:bg-gray-100' 
    },
  ];

  const getLifecycleColor = (stage: string): string => {
    switch (stage) {
      case 'ideation': return 'bg-blue-100 text-blue-800';
      case 'poc': return 'bg-purple-100 text-purple-800';
      case 'mvp': return 'bg-indigo-100 text-indigo-800';
      case 'pilot': return 'bg-green-100 text-green-800';
      case 'rollout': return 'bg-orange-100 text-orange-800';
      case 'retire': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-6 transition-all">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getLifecycleColor(question.lifecycleStage)}`}>
              <LifeBuoy size={12} className="mr-1" />
              {question.lifecycleStage}
            </span>
          </div>
          <h3 className="text-lg font-medium text-gray-800">{question.text}</h3>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          title="Show more information"
        >
          <Info size={20} className="text-gray-500" />
        </button>
      </div>

      {showInfo && question.info && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-blue-900">What is this?</h4>
              <p className="text-sm text-blue-800">{question.info.what}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-900">Why is it important?</h4>
              <p className="text-sm text-blue-800">{question.info.why}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-900">Example</h4>
              <p className="text-sm text-blue-800">{question.info.example}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {answerOptions.map((option) => (
          <button
            key={option.value}
            className={`flex items-center justify-center sm:justify-start gap-2 py-3 px-4 rounded-lg border transition-colors ${
              currentAnswer === option.value 
                ? `${option.color} border-2` 
                : 'border-gray-300 hover:border-gray-400 text-gray-700'
            }`}
            onClick={() => onAnswerSelected(question.id, option.value)}
          >
            <span className={currentAnswer === option.value ? '' : 'text-gray-500'}>
              {option.icon}
            </span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionItem;