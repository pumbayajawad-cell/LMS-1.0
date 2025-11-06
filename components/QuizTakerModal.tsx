import React, { useState } from 'react';
import { Module, QuizSubmission } from '../types';
import { X } from './Icons';

interface QuizTakerModalProps {
  module: Module;
  onClose: () => void;
  onSubmit: (result: Omit<QuizSubmission, 'id' | 'timestamp' | 'studentId'>) => void;
}

const QuizTakerModal: React.FC<QuizTakerModalProps> = ({ module, onClose, onSubmit }) => {
  const { questions } = module;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  if (!questions || questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
        <div className="bg-cream dark:bg-gray-800 rounded-lg p-8 border-2 border-black dark:border-gray-600">
          <p className="text-black dark:text-cream">This quiz has no questions.</p>
          <button onClick={onClose} className="mt-4 bg-brand-blue text-black font-bold font-display py-2 px-4 rounded border-2 border-black">Close</button>
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionIndex,
    });
  };

  const handleSubmit = () => {
    const finalScore = questions.reduce((acc, question) => {
      return selectedAnswers[question.id] === question.correctAnswerIndex ? acc + 1 : acc;
    }, 0);

    setScore(finalScore);
    onSubmit({
      moduleId: module.id,
      score: finalScore,
      totalQuestions: questions.length,
    });
    setShowResults(true);
  };


  const currentQuestion = questions[currentQuestionIndex];

  const renderQuestion = () => (
    <>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Question {currentQuestionIndex + 1} of {questions.length}</p>
      <h3 className="text-2xl font-semibold font-display text-black dark:text-cream mb-6">{currentQuestion.text}</h3>
      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(currentQuestion.id, index)}
            className={`w-full text-left p-3 border-2 border-black dark:border-gray-600 rounded-lg transition-all text-black dark:text-cream font-medium ${
              selectedAnswers[currentQuestion.id] === index
                ? 'bg-brand-purple text-white dark:text-black'
                : 'bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </>
  );

  const renderResults = () => (
    <>
        <h3 className="text-3xl font-bold font-display text-black dark:text-cream text-center">Quiz Completed!</h3>
        <div className="my-4 text-center">
            <p className="text-lg text-gray-700 dark:text-gray-300">Your Score:</p>
            <p className="text-6xl font-extrabold font-display text-brand-green">
                {Math.round((score / questions.length) * 100)}%
            </p>
            <p className="text-gray-600 dark:text-gray-400">({score} out of {questions.length} correct)</p>
        </div>
        <div className="space-y-4 max-h-64 overflow-y-auto pr-2 border-2 border-black dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700">
            {questions.map((q, index) => {
                const userAnswer = selectedAnswers[q.id];
                const isCorrect = userAnswer === q.correctAnswerIndex;
                return (
                    <div key={q.id} className={`p-3 rounded-lg border-2 border-black dark:border-gray-600 ${isCorrect ? 'bg-brand-green/30' : 'bg-brand-pink/50'}`}>
                        <p className="font-semibold text-black dark:text-cream">{index + 1}. {q.text}</p>
                        <p className={`text-sm mt-1 font-bold ${isCorrect ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                            {isCorrect ? 'Correct!' : `Correct Answer: ${q.options[q.correctAnswerIndex]}`}
                        </p>
                        {userAnswer !== undefined && !isCorrect && (
                            <p className="text-sm text-red-800 dark:text-red-300">Your Answer: {q.options[userAnswer]}</p>
                        )}
                    </div>
                );
            })}
        </div>
    </>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
      <div className="bg-cream dark:bg-gray-800 rounded-lg shadow-xl border-2 border-black dark:border-gray-600 w-full max-w-2xl flex flex-col">
        <header className="p-4 border-b-2 border-black dark:border-gray-600 flex justify-between items-center bg-brand-yellow">
          <h2 className="text-xl font-bold font-display text-black">{module.title}</h2>
          <button onClick={onClose} className="text-black hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </header>

        <main className="p-8">
          {showResults ? renderResults() : renderQuestion()}
        </main>

        <footer className="p-4 border-t-2 border-black dark:border-gray-600 flex justify-between items-center bg-gray-100 dark:bg-gray-900 rounded-b-lg">
            {!showResults && (
                <>
                    <button
                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                        className="bg-gray-300 dark:bg-gray-600 text-black dark:text-cream py-2 px-4 rounded-lg font-bold font-display border-2 border-black dark:border-gray-500 hover:bg-gray-400 dark:hover:bg-gray-500 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    {currentQuestionIndex < questions.length - 1 ? (
                        <button
                            onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                            className="bg-brand-blue text-black py-2 px-4 rounded-lg font-bold font-display border-2 border-black hover:bg-blue-300"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="bg-brand-pink text-black py-2 px-4 rounded-lg font-bold font-display border-2 border-black hover:bg-pink-300"
                        >
                            Submit
                        </button>
                    )}
                </>
            )}
            {showResults && (
                 <button onClick={onClose} className="w-full bg-brand-blue text-black py-2 px-4 rounded-lg font-bold font-display border-2 border-black hover:bg-blue-300">
                    Close
                </button>
            )}
        </footer>
      </div>
    </div>
  );
};

export default QuizTakerModal;