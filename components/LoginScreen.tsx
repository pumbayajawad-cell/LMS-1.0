import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Logo } from './Logo';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  onRegister: (newUser: Omit<User, 'id' | 'avatar'>) => void;
  users: User[];
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onRegister, users }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.Learner);
  const [error, setError] = useState('');

  const clearForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setRole(UserRole.Learner);
    setError('');
  };

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'register' : 'login');
    clearForm();
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      // Special "master" user credentials
      if (email.toLowerCase() === 'jawadpumbaya@gmail.com' && password === 'jawad07') {
        const userForRole = users.find(u => u.role === role);
        if (userForRole) {
          onLogin(userForRole);
        } else {
          setError(`No sample user found for the '${role}' role.`);
        }
        return;
      }

      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role);

      if (user && user.password === password) {
        onLogin(user);
      } else {
        setError('Invalid credentials or role. Please check your input.');
      }
    } else { // Register mode
      if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        setError('An account with this email already exists.');
        return;
      }
      onRegister({ name, email, password, role });
    }
  };
  
  const RoleButton = ({ value, children, disabled = false }: { value: UserRole, children: React.ReactNode, disabled?: boolean }) => (
    <button
      type="button"
      onClick={() => setRole(value)}
      disabled={disabled}
      className={`w-full py-2 px-4 rounded-md font-display font-bold border-2 border-black transition-colors duration-200 ${
        role === value
          ? 'bg-brand-yellow text-black shadow-md'
          : 'bg-cream dark:bg-gray-700 dark:text-cream text-black hover:bg-brand-yellow dark:hover:bg-brand-yellow dark:hover:text-black'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-brand-green dark:bg-gray-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block mb-4 bg-cream border-4 border-black rounded-full p-2">
              <Logo className="h-24 w-24" />
          </div>
          <h1 className="text-4xl font-bold font-display text-black dark:text-cream">Learning Module System</h1>
          <p className="text-black dark:text-gray-300 mt-2">
            {mode === 'login' ? 'Sign in to continue your learning journey.' : 'Create an account to get started.'}
          </p>
        </div>
        <div className="bg-cream dark:bg-gray-800 p-8 rounded-xl border-2 border-black dark:border-gray-600 shadow-[4px_4px_0px_#000]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-black dark:text-gray-300 mb-2">I am a...</label>
              {/* FIX: The `RoleButton` component requires a `children` prop for the button's text content. Added text for each button. */}
              <div className="grid grid-cols-3 gap-2">
                <RoleButton value={UserRole.Learner}>Learner</RoleButton>
                <RoleButton value={UserRole.Instructor}>Instructor</RoleButton>
                <RoleButton value={UserRole.Admin} disabled={mode === 'register'}>Admin</RoleButton>
              </div>
               {mode === 'register' && <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-center">Admin accounts cannot be created here.</p>}
            </div>
            
            {mode === 'register' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-black dark:text-gray-300">Full Name</label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border-2 border-black dark:border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow sm:text-sm bg-white dark:bg-gray-700 text-black dark:text-cream"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black dark:text-gray-300">Email Address</label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border-2 border-black dark:border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow sm:text-sm bg-white dark:bg-gray-700 text-black dark:text-cream"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black dark:text-gray-300">Password</label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border-2 border-black dark:border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow sm:text-sm bg-white dark:bg-gray-700 text-black dark:text-cream"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border-2 border-black rounded-md shadow-sm text-lg font-bold font-display text-white bg-brand-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-colors"
              >
                {mode === 'login' ? 'Sign in' : 'Create Account'}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <button onClick={toggleMode} className="text-sm font-medium text-black dark:text-gray-300 hover:underline transition-colors">
              {mode === 'login' ? "Don't have an account? Register" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;