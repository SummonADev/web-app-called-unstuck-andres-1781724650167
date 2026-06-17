import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { calculatePoints } from '@/utils/scoring';
import { getMatchStatus } from '@/utils/matchStatus';
import { getTeamFlag } from '@/data/teams';
import EmptyState from '@/components/EmptyState';

export default function UserHistoryPage() {
  const { userId } = useParams<{ userId: string }>();
  const { users, matches, predictions } = useAppContext();
  const user = users.find(u => u.id === userId);

  if (!user) {
    return <EmptyState icon="👤" title="User not found" description="" />;
  }

  const userPreds = predictions.filter(p => p.userId === user.id);
  const scoredPreds = userPreds.filter(p => {
    const m = matches.find(mm => mm.id === p.matchId);
    return m && getMatchStatus(m) === 'scored';
  });

  return (
    <div>
      <Link to="/leaderboard" className="text-sm text-brand-600 dark:text-brand-400 hover:underline">
        ← Back to leaderboard
      </Link>

      <div className="flex items-center gap-3 mt-4 mb-6">
        <span className="text-4xl">{user.avatar}</span>
        <div>
          <h2 className="text-xl font-bold">{user.displayName}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{scoredPreds.length} scored predictions</p>
        </div>
      </div>

      {scoredPreds.length === 0 ? (
        <EmptyState icon="📊" title="No scored predictions yet" description="Check back after matches are played." />
      ) : (
        <div className="space-y-2">
          {scoredPreds.map(p => {
            const m = matches.find(mm => mm.id === p.matchId)!;
            const pts = calculatePoints(p, m);
            return (
              <div key={p.id} className="bg-white dark:bg-gray-900 rounded-xl p-3 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="text-sm">
                  <span>{m.homeTeam ? getTeamFlag(m.homeTeam) : '❓'} {m.homeTeam}</span>
                  <span className="mx-2 text-gray-400">{m.homeScore}–{m.awayScore}</span>
                  <span>{m.awayTeam} {m.awayTeam ? getTeamFlag(m.awayTeam) : '❓'}</span>
                </div>
                <div className="text-right text-sm">
                  <span className="text-gray-500 dark:text-gray-400 mr-2">{p.homeScore}–{p.awayScore}</span>
                  <span className={`font-bold ${
                    pts >= 5 ? 'text-green-600' : pts >= 3 ? 'text-blue-600' : pts >= 1 ? 'text-amber-600' : 'text-gray-400'
                  }`}>+{pts}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}