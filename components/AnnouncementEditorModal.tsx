import React, { useState } from 'react';
import { Announcement, User, UserRole } from '../types';
import { courses } from '../data';
import { X } from './Icons';

interface AnnouncementEditorModalProps {
  announcement: Announcement | null;
  user: User;
  onClose: () => void;
  onSave: (announcement: Omit<Announcement, 'id'> & { id?: number }) => void;
}

const AnnouncementEditorModal: React.FC<AnnouncementEditorModalProps> = ({ announcement, user, onClose, onSave }) => {
  const [title, setTitle] = useState(announcement?.title || '');
  const [content, setContent] = useState(announcement?.content || '');
  const [target, setTarget] = useState(announcement?.courseId?.toString() || 'system');

  const instructorCourses = courses.filter(c => c.instructor.includes(user.name));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
        alert('Please fill in both title and content.');
        return;
    }

    const savedAnnouncement = {
      id: announcement?.id,
      title,
      content,
      authorId: user.id,
      date: new Date().toISOString().split('T')[0],
      courseId: target !== 'system' ? parseInt(target, 10) : undefined,
    };
    onSave(savedAnnouncement);
  };

  const renderTargetSelector = () => {
    if (user.role === UserRole.Admin) {
      return (
        <select
          id="target"
          value={target}
          onChange={e => setTarget(e.target.value)}
          className="w-full p-2 border-2 border-black dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-cream"
        >
          <option value="system">System-Wide</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.title}</option>
          ))}
        </select>
      );
    }
    if (user.role === UserRole.Instructor) {
      return (
        <select
          id="target"
          value={target}
          onChange={e => setTarget(e.target.value)}
          className="w-full p-2 border-2 border-black dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-cream"
        >
          {instructorCourses.map(course => (
            <option key={course.id} value={course.id}>{course.title}</option>
          ))}
        </select>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
      <form onSubmit={handleSubmit} className="bg-cream dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg flex flex-col border-2 border-black dark:border-gray-600">
        <header className="p-4 border-b-2 border-black dark:border-gray-600 flex justify-between items-center bg-brand-yellow">
          <h2 className="text-xl font-bold font-display text-black">
            {announcement ? 'Edit Announcement' : 'Create Announcement'}
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
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-black dark:text-cream mb-1">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full p-2 border-2 border-black dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-cream"
              rows={5}
              required
            />
          </div>
          <div>
            <label htmlFor="target" className="block text-sm font-medium text-black dark:text-cream mb-1">Audience</label>
            {renderTargetSelector()}
          </div>
        </main>

        <footer className="p-4 border-t-2 border-black dark:border-gray-600 flex justify-end space-x-2 bg-gray-100 dark:bg-gray-900 rounded-b-lg">
          <button type="button" onClick={onClose} className="bg-gray-300 dark:bg-gray-600 text-black dark:text-cream py-2 px-4 rounded-lg font-bold font-display border-2 border-black dark:border-gray-500 hover:bg-gray-400 dark:hover:bg-gray-500">
            Cancel
          </button>
          <button type="submit" className="bg-brand-green text-white py-2 px-4 rounded-lg font-bold font-display border-2 border-black hover:bg-green-700">
            Save Announcement
          </button>
        </footer>
      </form>
    </div>
  );
};

export default AnnouncementEditorModal;