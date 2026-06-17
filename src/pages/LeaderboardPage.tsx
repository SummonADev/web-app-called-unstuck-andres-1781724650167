import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { buildLeaderboard } from '@/utils/leaderboard';
import EmptyState from '@/components/EmptyState';

export default function LeaderboardPage() {
  const { users, matches, predictions } = useAppContext();

  const leaderboard = useMemo(
    () => buildLeaderboard(users, matches, predictions),
    [users, matches, predictions]
  );

  if (leaderboard.length === 0) {
    return <EmptyState icon="🏆" title="No players yet" description="Once people join and matches are scored, the leaderboard will appear." />;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">🏆 Leaderboard</h2>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        {leaderboard.map((entry, i) => (
          <Link
            key={entry.userId}
            to={`/leaderboard/${entry.userId}`}
            className={`flex items-center px-4 py-3 border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
              i === 0 ? 'bg-accent-400/10' : ''
            }`}
          >
            <div className="w-8 text-center">
              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (
                <span className="text-sm text-gray-400 font-medium">{entry.rank}</span>
              )}
            </div>
            <span className="text-xl ml-2">{entry.avatar}</span>
            <div className="ml-3 flex-1">
              <span className="font-medium text-sm">{entry.displayName}</span>
              <div className="flex gap-1 mt-0.5">
                {entry.recentForm.map((pts, fi) => (
                  <span
                    key={fi}
                    className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                      pts >= 5 ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                      : pts >= 3 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
                      : pts >= 1 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                      : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                    }`}
                  >
                    {pts}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold">{entry.totalPoints}</span>
              <span className="text-xs text-gray-400 block">pts</span>
            </div>
            <div className="text-right ml-4">
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">{entry.exactScores}</span>
              <span className="text-xs text-gray-400 block">exact</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}