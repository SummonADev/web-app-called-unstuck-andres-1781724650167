import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@/types';
import { useAppContext } from '@/context/AppContext';

const EMOJIS = ['⚽', '🏆', '🦁', '🐯', '🦅', '🐲', '🌟', '🔥', '💎', '🎯', '🚀', '⭐', '🎪', '🎨', '🎵', '🌈'];

export default function LoginPage() {
  const { login } = useAppContext();
  const [step, setStep] = useState<'email' | 'profile'>('email');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [avatar, setAvatar] = useState('⚽');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    setError('');
    setStep('profile');
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setError('Please enter a display name');
      return;
    }
    const user: User = {
      id: uuidv4(),
      email: email.trim(),
      displayName: displayName.trim(),
      avatar,
      isAdmin,
      createdAt: new Date().toISOString(),
    };
    login(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-sm w-full p-8">
        <div className="text-center mb-8">
          <span className="text-5xl block mb-3">⚽</span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Unstuck Cup</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">FIFA World Cup 2026 Prediction Pool</p>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@unstucklabs.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
            />
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            <button
              type="submit"
              className="mt-4 w-full py-3 bg-brand-600 text-white rounded-lg font-semibold text-sm hover:bg-brand-700 transition-colors active:scale-95"
            >
              Continue
            </button>
          </form>
        ) : (
          <form onSubmit={handleProfileSubmit}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
            />

            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-4 mb-2">Pick an Avatar</label>
            <div className="grid grid-cols-8 gap-2">
              {EMOJIS.map(e => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setAvatar(e)}
                  className={`text-xl p-1.5 rounded-lg transition-all ${
                    avatar === e
                      ? 'bg-brand-100 dark:bg-brand-900/40 ring-2 ring-brand-500 scale-110'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 mt-4 text-sm text-gray-600 dark:text-gray-400">
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={e => setIsAdmin(e.target.checked)}
                className="rounded"
              />
              I'm an admin (can enter match results)
            </label>

            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

            <button
              type="submit"
              className="mt-4 w-full py-3 bg-brand-600 text-white rounded-lg font-semibold text-sm hover:bg-brand-700 transition-colors active:scale-95"
            >
              Join the Pool 🎉
            </button>
          </form>
        )}
      </div>
    </div>
  );
}