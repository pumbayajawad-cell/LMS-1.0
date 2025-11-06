import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { Settings } from './Icons';

interface SettingsViewProps {
  user: User;
  onUpdateProfile: (updates: Partial<User> & { currentPassword?: string, newPassword?: string }) => void;
  theme: string;
  onToggleTheme: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user, onUpdateProfile, theme, onToggleTheme }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatar);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // If the user prop changes (e.g., after a successful update), reset the form fields
    setName(user.name);
    setEmail(user.email);
    setAvatar(user.avatar);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setError('');
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const updates: Partial<User> & { currentPassword?: string, newPassword?: string } = {};

    if (name !== user.name) updates.name = name;
    if (email !== user.email) updates.email = email;
    if (avatar !== user.avatar) updates.avatar = avatar;

    if (newPassword) {
      if (newPassword !== confirmNewPassword) {
        setError("New passwords do not match.");
        return;
      }
      if (!currentPassword) {
        setError("Please enter your current password to set a new one.");
        return;
      }
      updates.currentPassword = currentPassword;
      updates.newPassword = newPassword;
    }

    if (Object.keys(updates).length === 0) {
      alert("No changes to save.");
      return;
    }
    
    onUpdateProfile(updates);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (loadEvent.target && typeof loadEvent.target.result === 'string') {
          setAvatar(loadEvent.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-brand-yellow border-2 border-black rounded-lg p-4 mb-6 flex items-center">
        <div className="bg-brand-pink p-2 rounded-md border-2 border-black mr-4">
            <Settings className="h-7 w-7 text-black"/>
        </div>
        <h2 className="text-3xl font-bold font-display text-black">Profile & Settings</h2>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Details Form */}
        <form onSubmit={handleSubmit} className="bg-cream dark:bg-gray-800 rounded-lg border-2 border-black dark:border-gray-600 p-8 space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0 text-center">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                        accept="image/png, image/jpeg, image/gif"
                    />
                    <img 
                        src={avatar} 
                        alt="Profile Avatar" 
                        className="w-40 h-40 rounded-full border-4 border-black dark:border-gray-500 object-cover mx-auto cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={handleImageClick}
                        title="Click to change profile picture"
                    />
                     <button
                        type="button"
                        onClick={handleImageClick}
                        className="mt-4 bg-brand-blue text-black py-1 px-3 rounded-md border-2 border-black hover:bg-blue-300 text-center font-bold font-display text-sm transition-colors"
                    >
                        Change Picture
                    </button>
                </div>

                <div className="space-y-4 flex-grow w-full">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-black dark:text-cream mb-1">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="appearance-none block w-full px-3 py-2 border-2 border-black dark:border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow sm:text-sm bg-white dark:bg-gray-700 text-black dark:text-cream"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-black dark:text-cream mb-1">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="appearance-none block w-full px-3 py-2 border-2 border-black dark:border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow sm:text-sm bg-white dark:bg-gray-700 text-black dark:text-cream"
                        />
                    </div>
                </div>
            </div>

            <div className="border-t-2 border-black dark:border-gray-600 pt-6 space-y-4">
                <h3 className="text-xl font-semibold font-display text-black dark:text-cream">Change Password</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Leave these fields blank to keep your current password.</p>
                <div>
                    <label htmlFor="current-password" className="block text-sm font-medium text-black dark:text-cream mb-1">Current Password</label>
                    <input
                        id="current-password"
                        type="password"
                        autoComplete="current-password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border-2 border-black dark:border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow sm:text-sm bg-white dark:bg-gray-700 text-black dark:text-cream"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-black dark:text-cream mb-1">New Password</label>
                        <input
                            id="new-password"
                            type="password"
                            autoComplete="new-password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="appearance-none block w-full px-3 py-2 border-2 border-black dark:border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow sm:text-sm bg-white dark:bg-gray-700 text-black dark:text-cream"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirm-new-password" className="block text-sm font-medium text-black dark:text-cream mb-1">Confirm New Password</label>
                        <input
                            id="confirm-new-password"
                            type="password"
                            autoComplete="new-password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            className="appearance-none block w-full px-3 py-2 border-2 border-black dark:border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow sm:text-sm bg-white dark:bg-gray-700 text-black dark:text-cream"
                        />
                    </div>
                </div>
            </div>
            
            {error && <p className="text-sm text-center text-red-600 bg-brand-pink/50 border border-red-600 p-2 rounded-md">{error}</p>}
            
            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    className="w-full md:w-auto flex justify-center py-3 px-6 border-2 border-black rounded-md shadow-sm text-lg font-bold font-display text-white bg-brand-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-colors"
                >
                    Update Profile
                </button>
            </div>
        </form>

        {/* Appearance Settings */}
        <div className="bg-cream dark:bg-gray-800 rounded-lg border-2 border-black dark:border-gray-600 p-8">
            <h3 className="text-xl font-semibold font-display text-black dark:text-cream mb-4">Appearance</h3>
            <div className="flex items-center justify-between">
                <p className="text-black dark:text-cream">Toggle Dark Mode</p>
                <button
                    onClick={onToggleTheme}
                    className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors bg-gray-300 dark:bg-gray-600 border-2 border-black"
                    aria-label="Toggle dark mode"
                >
                    <span className={`inline-block w-4 h-4 transform bg-white dark:bg-brand-yellow rounded-full transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsView;
