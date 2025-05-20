import React from 'react';
import { Question, AnswerType } from '../../types';
import QuestionItem from './QuestionItem';

interface QuestionSectionProps {
  title: string;
  description: string;
  questions: Question[];
  currentAnswers: Record<string, AnswerType | null>;
  onAnswerSelected: (questionId: string, answer: AnswerType) => void;
}

const QuestionSection: React.FC<QuestionSectionProps> = ({
  title,
  description,
  questions,
  currentAnswers,
  onAnswerSelected
}) => {
  return (
    <div className="mb-8">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
      
      <div className="space-y-4">
        {questions.map(question => (
          <QuestionItem
            key={question.id}
            question={question}
            currentAnswer={currentAnswers[question.id] || null}
            onAnswerSelected={onAnswerSelected}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionSection;