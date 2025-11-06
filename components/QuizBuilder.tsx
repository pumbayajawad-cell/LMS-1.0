import React, { useState } from 'react';
import { Question } from '../types';
import { Plus, Trash2 } from './Icons';

interface QuizBuilderProps {
  value: Question[];
  onChange: (questions: Question[]) => void;
}

const QuizBuilder: React.FC<QuizBuilderProps> = ({ value: questions, onChange }) => {
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [newCorrectAnswerIndex, setNewCorrectAnswerIndex] = useState(0);

  const handleAddQuestion = () => {
    if (newQuestionText.trim() === '' || newOptions.some(opt => opt.trim() === '')) {
      alert('Please fill out the question and all four options.');
      return;
    }
    const newQuestion: Question = {
      id: Date.now(),
      text: newQuestionText,
      options: newOptions,
      correctAnswerIndex: newCorrectAnswerIndex,
    };
    onChange([...questions, newQuestion]);
    setNewQuestionText('');
    setNewOptions(['', '', '', '']);
    setNewCorrectAnswerIndex(0);
  };

  const handleRemoveQuestion = (id: number) => {
    onChange(questions.filter(q => q.id !== id));
  };

  const handleOptionChange = (index: number, text: string) => {
    const updatedOptions = [...newOptions];
    updatedOptions[index] = text;
    setNewOptions(updatedOptions);
  };

  return (
    <div className="space-y-4">
      {/* List of existing questions */}
      {questions.length > 0 && (
        <div className="space-y-2">
          {questions.map((q, index) => (
            <div key={q.id} className="bg-white dark:bg-gray-600 p-3 rounded-md border-2 border-black dark:border-gray-500 flex justify-between items-start">
              <div>
                <p className="font-semibold text-black dark:text-cream">{index + 1}. {q.text}</p>
                <ul className="list-disc list-inside pl-4 mt-1 text-sm">
                  {q.options.map((opt, optIndex) => (
                    <li key={optIndex} className={`${optIndex === q.correctAnswerIndex ? 'font-bold text-brand-green' : 'text-gray-700 dark:text-gray-300'}`}>
                      {opt}
                    </li>
                  ))}
                </ul>
              </div>
              <button onClick={() => handleRemoveQuestion(q.id)} className="text-red-500 hover:text-red-700">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Form to add a new question */}
      <div className="border-2 border-dashed border-black dark:border-gray-500 rounded-lg p-4 space-y-3">
        <h4 className="font-semibold font-display text-black dark:text-cream">Add New Question</h4>
        <textarea
          placeholder="Question text..."
          value={newQuestionText}
          onChange={e => setNewQuestionText(e.target.value)}
          className="w-full p-2 border-2 border-black dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-cream"
          rows={2}
        />
        <div className="space-y-2">
          {newOptions.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="radio"
                name="correct-answer"
                checked={newCorrectAnswerIndex === index}
                onChange={() => setNewCorrectAnswerIndex(index)}
                className="form-radio h-4 w-4 text-brand-green focus:ring-brand-green"
              />
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={e => handleOptionChange(index, e.target.value)}
                className="w-full p-2 border-2 border-black dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-cream"
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleAddQuestion}
          className="w-full flex items-center justify-center bg-brand-pink text-black py-2 px-4 rounded-lg font-bold font-display border-2 border-black hover:bg-pink-300 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Question
        </button>
      </div>
    </div>
  );
};

export default QuizBuilder;