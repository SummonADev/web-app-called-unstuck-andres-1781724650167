import { useState } from 'react';
import { Match, Prediction } from '@/types';
import { useAppContext } from '@/context/AppContext';
import { getMatchStatus } from '@/utils/matchStatus';
import { v4 as uuidv4 } from 'uuid';

interface PredictionFormProps {
  match: Match;
  existing?: Prediction;
}

export default function PredictionForm({ match, existing }: PredictionFormProps) {
  const { currentUser, savePrediction } = useAppContext();
  const status = getMatchStatus(match);
  const [homeScore, setHomeScore] = useState(existing?.homeScore ?? 0);
  const [awayScore, setAwayScore] = useState(existing?.awayScore ?? 0);
  const [saved, setSaved] = useState(false);

  if (!currentUser || status !== 'open') return null;

  const handleSave = () => {
    const pred: Prediction = {
      id: existing?.id || uuidv4(),
      userId: currentUser.id,
      matchId: match.id,
      homeScore,
      awayScore,
      points: null,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    savePrediction(pred);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-brand-50 dark:bg-brand-900/20 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-brand-700 dark:text-brand-300 mb-3">Your Prediction</h3>
      <div className="flex items-center justify-center gap-4">
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{match.homeTeam || 'Home'}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHomeScore(Math.max(0, homeScore - 1))}
              className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-sm text-lg font-bold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700"
            >−</button>
            <span className="text-2xl font-bold w-8 text-center">{homeScore}</span>
            <button
              onClick={() => setHomeScore(homeScore + 1)}
              className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-sm text-lg font-bold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700"
            >+</button>
          </div>
        </div>

        <span className="text-xl font-bold text-gray-400">–</span>

        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{match.awayTeam || 'Away'}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAwayScore(Math.max(0, awayScore - 1))}
              className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-sm text-lg font-bold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700"
            >−</button>
            <span className="text-2xl font-bold w-8 text-center">{awayScore}</span>
            <button
              onClick={() => setAwayScore(awayScore + 1)}
              className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-sm text-lg font-bold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700"
            >+</button>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className={`mt-4 w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${
          saved
            ? 'bg-green-500 text-white'
            : 'bg-brand-600 text-white hover:bg-brand-700 active:scale-95'
        }`}
      >
        {saved ? '✅ Saved!' : existing ? 'Update Prediction' : 'Save Prediction'}
      </button>
    </div>
  );
}