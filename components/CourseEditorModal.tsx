import React, { useState, useCallback } from 'react';
import { Course, Module, Question } from '../types';
import { X, UploadCloud, FileText, Film, Presentation, ClipboardList, Trash2 } from './Icons';
import QuizBuilder from './QuizBuilder';

interface CourseEditorModalProps {
  course: Course;
  onClose: () => void;
  onSave: (course: Course) => void;
}

const CourseEditorModal: React.FC<CourseEditorModalProps> = ({ course, onClose, onSave }) => {
  const [title, setTitle] = useState(course.title);
  const [modules, setModules] = useState<Module[]>(course.modules);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleType, setNewModuleType] = useState<Module['type']>('Video');
  const [newModuleDuration, setNewModuleDuration] = useState('');
  const [fileName, setFileName] = useState('');
  const [newQuizQuestions, setNewQuizQuestions] = useState<Question[]>([]);


  const renderModuleIcon = useCallback((type: Module['type']) => {
    const className = "h-5 w-5 text-black";
    switch (type) {
      case 'PDF': return <div className="p-1 bg-brand-pink border border-black rounded-sm"><FileText className={className} /></div>;
      case 'Video': return <div className="p-1 bg-brand-blue border border-black rounded-sm"><Film className={className} /></div>;
      case 'PPT': return <div className="p-1 bg-brand-yellow border border-black rounded-sm"><Presentation className={className} /></div>;
      case 'Quiz': return <div className="p-1 bg-brand-purple border border-black rounded-sm"><ClipboardList className={className} /></div>;
      default: return null;
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };
  
  const handleRemoveModule = (moduleId: number) => {
    setModules(modules.filter(m => m.id !== moduleId));
  };

  const handleAddModule = () => {
    if (!newModuleTitle || !newModuleDuration) {
      alert("Please fill in the module title and duration.");
      return;
    }
    
    let newModule: Module;
    const baseModule = {
      id: Date.now(), // simple unique id
      title: newModuleTitle,
      type: newModuleType,
      duration: parseInt(newModuleDuration, 10),
      completed: false,
    };

    if (newModuleType === 'Quiz') {
      if (newQuizQuestions.length === 0) {
        alert("Please add at least one question to the quiz.");
        return;
      }
      newModule = { ...baseModule, questions: newQuizQuestions };
    } else {
      if (!fileName) {
        alert("Please select a file to upload.");
        return;
      }
      newModule = baseModule;
    }

    setModules([...modules, newModule]);
    // Reset form
    setNewModuleTitle('');
    setNewModuleType('Video');
    setNewModuleDuration('');
    setFileName('');
    setNewQuizQuestions([]);
  };
  
  const handleSaveChanges = () => {
    if (!title.trim()) {
      alert("Course title cannot be empty.");
      return;
    }
    onSave({ ...course, title, modules });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
      <div className="bg-cream dark:bg-gray-800 rounded-lg border-2 border-black dark:border-gray-600 shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <header className="p-4 border-b-2 border-black dark:border-gray-600 flex justify-between items-center bg-brand-yellow">
          <h2 className="text-xl font-bold font-display text-black">
            {course.id !== 0 ? `Manage Course: ${course.title}` : 'Create New Course'}
          </h2>
          <button onClick={onClose} className="text-black hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </header>

        <main className="p-6 overflow-y-auto space-y-6">
          <div>
            <label htmlFor="course-title" className="block text-sm font-medium text-black dark:text-cream mb-1">Course Title</label>
            <input
              id="course-title"
              type="text"
              placeholder="e.g., Introduction to Accounting"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-2 border-2 border-black dark:border-gray-600 rounded-md shadow-sm focus:ring-brand-yellow focus:border-brand-yellow bg-white dark:bg-gray-700 text-black dark:text-cream"
            />
          </div>

          {/* Existing Modules */}
          <div>
            <h3 className="text-lg font-semibold font-display text-black dark:text-cream mb-3">Modules</h3>
            {modules.length > 0 ? (
              <ul className="space-y-2">
                {modules.map(module => (
                  <li key={module.id} className="flex items-center justify-between bg-white dark:bg-gray-700 p-3 rounded-md border-2 border-black dark:border-gray-600">
                    <div className="flex items-center">
                      {renderModuleIcon(module.type)}
                      <span className="ml-3 font-medium text-black dark:text-cream">{module.title}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <span>{module.duration} mins</span>
                      <button onClick={() => handleRemoveModule(module.id)} className="ml-4 text-red-600 hover:text-red-800" title="Remove Module">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
                <p className="text-center text-gray-600 dark:text-gray-400 py-4">No modules have been added yet.</p>
            )}
          </div>

          {/* Add New Module */}
          <div className="border-t-2 border-black dark:border-gray-600 pt-6">
            <h3 className="text-lg font-semibold font-display text-black dark:text-cream mb-3">Add New Module</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Module Title" value={newModuleTitle} onChange={e => setNewModuleTitle(e.target.value)} className="w-full p-2 border-2 border-black dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-cream" />
              <select value={newModuleType} onChange={e => setNewModuleType(e.target.value as Module['type'])} className="w-full p-2 border-2 border-black dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-cream">
                <option value="Video">Video</option>
                <option value="PDF">PDF</option>
                <option value="PPT">PPT</option>
                <option value="Quiz">Quiz</option>
              </select>
               <input type="number" placeholder="Duration (minutes)" value={newModuleDuration} onChange={e => setNewModuleDuration(e.target.value)} className="w-full p-2 border-2 border-black dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-cream" />
              <div></div> {/*- empty cell for grid layout */}
            </div>
             <div className="mt-4">
                {newModuleType === 'Quiz' ? (
                    <QuizBuilder value={newQuizQuestions} onChange={setNewQuizQuestions} />
                ) : (
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-brand-blue hover:text-blue-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-blue">
                        <div className="w-full border-2 border-dashed border-black dark:border-gray-500 rounded-lg p-6 text-center">
                            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                                {fileName ? `Selected: ${fileName}` : 'Drag & drop or click to upload'}
                            </p>
                            <span className="text-xs text-gray-600 dark:text-gray-400">Video, PDF, PPT files</span>
                        </div>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                    </label>
                )}
            </div>
             <button onClick={handleAddModule} className="mt-4 w-full bg-brand-pink text-black py-2 px-4 rounded-lg font-bold font-display border-2 border-black hover:bg-pink-300 transition-colors">
                Add Module
            </button>
          </div>
        </main>

        <footer className="p-4 border-t-2 border-black dark:border-gray-600 flex justify-end space-x-2 bg-gray-100 dark:bg-gray-900 rounded-b-lg">
          <button onClick={onClose} className="bg-gray-300 dark:bg-gray-600 text-black dark:text-cream py-2 px-4 rounded-lg font-bold font-display border-2 border-black dark:border-gray-500 hover:bg-gray-400 dark:hover:bg-gray-500">
            Cancel
          </button>
          <button 
            onClick={handleSaveChanges} 
            className="bg-brand-green text-white py-2 px-4 rounded-lg font-bold font-display border-2 border-black hover:bg-green-700 disabled:opacity-50"
            disabled={!title.trim()}
          >
            Save Changes
          </button>
        </footer>
      </div>
    </div>
  );
};

export default CourseEditorModal;