import React, { useState } from 'react';
import { ScheduleEvent, User, Course } from '../types';
import { X } from './Icons';

interface ScheduleEditorModalProps {
  schedule: ScheduleEvent | null;
  user: User;
  instructorCourses: Course[];
  onClose: () => void;
  onSave: (event: Omit<ScheduleEvent, 'id'> & { id?: number }) => void;
}

const ScheduleEditorModal: React.FC<ScheduleEditorModalProps> = ({ schedule, user, instructorCourses, onClose, onSave }) => {
  const [title, setTitle] = useState(schedule?.title || '');
  const [type, setType] = useState<ScheduleEvent['type']>(schedule?.type || 'Class');
  const [courseId, setCourseId] = useState<string>(schedule?.courseId?.toString() || instructorCourses[0]?.id.toString() || '');
  const [description, setDescription] = useState(schedule?.description || '');
  
  const formatDateTimeLocal = (isoString: string | undefined) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    // Adjust for timezone offset to display correctly in local time input
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - timezoneOffset);
    return localDate.toISOString().slice(0, 16);
  };

  const [startTime, setStartTime] = useState(formatDateTimeLocal(schedule?.startTime));
  const [endTime, setEndTime] = useState(formatDateTimeLocal(schedule?.endTime));


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !courseId || !startTime || !endTime || !description.trim()) {
      alert('Please fill in all fields.');
      return;
    }
    if (new Date(startTime) >= new Date(endTime)) {
      alert('End time must be after start time.');
      return;
    }

    const savedEvent = {
      id: schedule?.id,
      title,
      type,
      courseId: parseInt(courseId, 10),
      instructorId: user.id,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      description,
    };
    onSave(savedEvent);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
      <form onSubmit={handleSubmit} className="bg-cream dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg flex flex-col border-2 border-black dark:border-gray-600">
        <header className="p-4 border-b-2 border-black dark:border-gray-600 flex justify-between items-center bg-brand-yellow">
          <h2 className="text-xl font-bold font-display text-black">
            {schedule ? 'Edit Schedule' : 'Create Schedule'}
          </h2>
          <button type="button" onClick={onClose} className="text-black hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </header>

        <main className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-black dark:text-cream mb-1">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-2 border-2 border-black dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-cream"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
              <div>
                 <label htmlFor="type" className="block text-sm font-medium text-black dark:text-cream mb-1">Type</label>
                 <select id="type" value={type} onChange={e => setType(e.target.value as 'Class' | 'Exam')} className="w-full p-2 border-2 border-black dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-cream">
                    <option value="Class">Class</option>
                    <option value="Exam">Exam</option>
                 </select>
              </div>
               <div>
                 <label htmlFor="course" className="block text-sm font-medium text-black dark:text-cream mb-1">Course</label>
                 <select id="course" value={courseId} onChange={e => setCourseId(e.target.value)} className="w-full p-2 border-2 border-black dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-cream">
                    {instructorCourses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                 </select>
              </div>
          </div>
           <div className="grid grid-cols-2 gap-4">
              <div>
                 <label htmlFor="start-time" className="block text-sm font-medium text-black dark:text-cream mb-1">Start Time</label>
                 <input type="datetime-local" id="start-time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full p-2 border-2 border-black dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-cream" required />
              </div>
               <div>
                 <label htmlFor="end-time" className="block text-sm font-medium text-black dark:text-cream mb-1">End Time</label>
                 <input type="datetime-local" id="end-time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full p-2 border-2 border-black dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-cream" required />
              </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-black dark:text-cream mb-1">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-2 border-2 border-black dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-cream"
              rows={3}
              required
            />
          </div>
        </main>

        <footer className="p-4 border-t-2 border-black dark:border-gray-600 flex justify-end space-x-2 bg-gray-100 dark:bg-gray-900 rounded-b-lg">
          <button type="button" onClick={onClose} className="bg-gray-300 dark:bg-gray-600 text-black dark:text-cream py-2 px-4 rounded-lg font-bold font-display border-2 border-black dark:border-gray-500 hover:bg-gray-400 dark:hover:bg-gray-500">
            Cancel
          </button>
          <button type="submit" className="bg-brand-green text-white py-2 px-4 rounded-lg font-bold font-display border-2 border-black hover:bg-green-700">
            Save Schedule
          </button>
        </footer>
      </form>
    </div>
  );
};

export default ScheduleEditorModal;