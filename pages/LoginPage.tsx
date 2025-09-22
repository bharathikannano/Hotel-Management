import React, { useState } from 'react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
  users: User[];
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, users }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === username);
    if (user) {
      // In a real app, you'd check the password. Here we'll just log in.
      onLogin(user);
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-neutral-50 dark:bg-neutral-800 rounded-2xl shadow-solid-light dark:shadow-solid-dark">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-neutral-900 dark:text-white">
            Zenith Grand Hotel
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400">
            Sign in to your account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <Input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
            {/* The label is visually hidden but available to screen readers in a real app you might show it */}
            <div className="pt-4">
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (any password works)"
              />
            </div>
          </div>
          {error && <p className="text-danger-500 text-sm">{error}</p>}
          <div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </div>
        </form>
        <div className="text-xs text-center text-neutral-500 dark:text-neutral-400">
            <p className="font-bold">Demo Logins:</p>
            <p>Username: admin</p>
            <p>Username: manager</p>
            <p>Username: frontdesk</p>
            <p>Username: housekeeping</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;