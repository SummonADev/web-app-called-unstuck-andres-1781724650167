import { type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';

const navItems = [
  { to: '/matches', label: 'Matches', icon: '⚽' },
  { to: '/leaderboard', label: 'Board', icon: '🏆' },
  { to: '/predictions', label: 'Mine', icon: '📝' },
  { to: '/bracket', label: 'Bracket', icon: '🌳' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { currentUser, darkMode, toggleDarkMode } = useAppContext();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-brand-600 dark:bg-brand-800 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚽</span>
            <h1 className="text-lg font-bold tracking-tight">Unstuck Cup</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            {currentUser?.isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `text-xs px-2 py-1 rounded font-medium ${isActive ? 'bg-white text-brand-700' : 'bg-white/20 hover:bg-white/30'}`
                }
              >
                Admin
              </NavLink>
            )}
            {currentUser && (
              <span className="text-sm">{currentUser.avatar}</span>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-4 pb-24">
        {children}
      </main>

      {/* Bottom nav (mobile-first) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50 safe-bottom">
        <div className="max-w-5xl mx-auto flex">
          {navItems.map(item => {
            const isActive = location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex-1 flex flex-col items-center py-2 text-xs transition-colors ${
                  isActive
                    ? 'text-brand-600 dark:text-brand-400 font-semibold'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}