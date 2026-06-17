import { useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import MatchCard from '@/components/MatchCard';
import EmptyState from '@/components/EmptyState';

export default function MyPredictionsPage() {
  const { matches, predictions, currentUser } = useAppContext();

  const myPredictions = useMemo(() => {
    if (!currentUser) return [];
    return predictions.filter(p => p.userId === currentUser.id);
  }, [predictions, currentUser]);

  const matchesWithPredictions = useMemo(() => {
    return myPredictions
      .map(p => {
        const match = matches.find(m => m.id === p.matchId);
        return match ? { match, prediction: p } : null;
      })
      .filter(Boolean) as { match: (typeof matches)[0]; prediction: (typeof myPredictions)[0] }[];
  }, [myPredictions, matches]);

  const totalPoints = useMemo(() => {
    return myPredictions.reduce((sum, p) => sum + (p.points ?? 0), 0);
  }, [myPredictions]);

  if (matchesWithPredictions.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">📝 My Predictions</h2>
        <EmptyState icon="📝" title="No predictions yet" description="Head to the Matches tab to start predicting!" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">📝 My Predictions</h2>
        <div className="text-right">
          <span className="text-2xl font-bold text-brand-600 dark:text-brand-400">{totalPoints}</span>
          <span className="text-xs text-gray-500 block">total pts</span>
        </div>
      </div>

      <div className="space-y-3">
        {matchesWithPredictions.map(({ match, prediction }) => (
          <MatchCard key={match.id} match={match} prediction={prediction} showPoints />
        ))}
      </div>
    </div>
  );
}