import { useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { calculatePoints, isExactScore } from '@/utils/scoring';

export default function ProfilePage() {
  const { currentUser, matches, predictions, logout } = useAppContext();

  const stats = useMemo(() => {
    if (!currentUser) return { total: 0, exact: 0, predicted: 0, bestDay: 0 };
    const myPreds = predictions.filter(p => p.userId === currentUser.id);
    let total = 0;
    let exact = 0;
    const dayPoints = new Map<string, number>();

    for (const p of myPreds) {
      const m = matches.find(mm => mm.id === p.matchId);
      if (!m || m.homeScore === null || m.awayScore === null) continue;
      const pts = calculatePoints(p, m);
      total += pts;
      if (isExactScore(p, m)) exact++;

      const day = new Date(m.kickoff).toDateString();
      dayPoints.set(day, (dayPoints.get(day) ?? 0) + pts);
    }

    const bestDay = dayPoints.size > 0 ? Math.max(...dayPoints.values()) : 0;

    return { total, exact, predicted: myPreds.length, bestDay };
  }, [currentUser, matches, predictions]);

  if (!currentUser) return null;

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">👤 Profile</h2>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 text-center">
        <span className="text-5xl block mb-3">{currentUser.avatar}</span>
        <h3 className="text-xl font-bold">{currentUser.displayName}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{currentUser.email}</p>
        {currentUser.isAdmin && (
          <span className="inline-block mt-2 text-xs bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 px-2 py-0.5 rounded-full font-medium">
            Admin
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 text-center">
          <span className="text-2xl font-bold text-brand-600 dark:text-brand-400 block">{stats.total}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Total Points</span>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 text-center">
          <span className="text-2xl font-bold text-green-600 dark:text-green-400 block">{stats.exact}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Exact Scores</span>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 text-center">
          <span className="text-2xl font-bold block">{stats.predicted}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Predictions</span>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 text-center">
          <span className="text-2xl font-bold text-accent-500 block">{stats.bestDay}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Best Matchday</span>
        </div>
      </div>

      <button
        onClick={logout}
        className="mt-6 w-full py-3 bg-red-500 text-white rounded-xl font-semibold text-sm hover:bg-red-600 transition-colors active:scale-95"
      >
        Sign Out
      </button>
    </div>
  );
}