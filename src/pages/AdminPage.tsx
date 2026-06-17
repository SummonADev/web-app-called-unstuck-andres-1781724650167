import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { getTeamFlag } from '@/data/teams';
import { calculatePoints } from '@/utils/scoring';
import EmptyState from '@/components/EmptyState';
import StageFilter from '@/components/StageFilter';

export default function AdminPage() {
  const { currentUser, matches, predictions, updateMatch, refreshData } = useAppContext();
  const [stageFilter, setStageFilter] = useState('all');
  const [editingMatch, setEditingMatch] = useState<string | null>(null);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);

  if (!currentUser?.isAdmin) {
    return <EmptyState icon="🔒" title="Admin only" description="You need admin access to view this page." />;
  }

  const filtered = matches
    .filter(m => stageFilter === 'all' || m.stage === stageFilter)
    .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());

  const handleSaveScore = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    const updated = { ...match, homeScore, awayScore };
    updateMatch(updated);

    // Rescore predictions for this match
    const matchPreds = predictions.filter(p => p.matchId === matchId);
    const { savePredictions, getPredictions } = require('@/data/storage');
    const allPreds = getPredictions();
    const newPreds = allPreds.map((p: typeof predictions[0]) => {
      if (p.matchId !== matchId) return p;
      return { ...p, points: calculatePoints(p, updated) };
    });
    savePredictions(newPreds);
    refreshData();

    setEditingMatch(null);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">⚙️ Admin Panel</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Enter match results to trigger scoring.</p>

      <StageFilter active={stageFilter} onChange={setStageFilter} />

      <div className="mt-4 space-y-3">
        {filtered.map(m => (
          <div key={m.id} className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                #{m.matchNumber} · {m.group ? `Group ${m.group}` : m.stage.replace(/-/g, ' ')}
              </span>
              {m.homeScore !== null && (
                <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">Scored</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {m.homeTeam ? `${getTeamFlag(m.homeTeam)} ${m.homeTeam}` : 'TBD'}
              </span>
              {editingMatch === m.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={homeScore}
                    onChange={e => setHomeScore(parseInt(e.target.value) || 0)}
                    className="w-12 text-center px-1 py-1 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-sm"
                  />
                  <span className="text-gray-400">–</span>
                  <input
                    type="number"
                    min={0}
                    value={awayScore}
                    onChange={e => setAwayScore(parseInt(e.target.value) || 0)}
                    className="w-12 text-center px-1 py-1 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-sm"
                  />
                </div>
              ) : (
                <span className="text-lg font-bold">
                  {m.homeScore !== null ? `${m.homeScore} – ${m.awayScore}` : '– vs –'}
                </span>
              )}
              <span className="text-sm font-medium">
                {m.awayTeam ? `${m.awayTeam} ${getTeamFlag(m.awayTeam)}` : 'TBD'}
              </span>
            </div>

            <div className="mt-3 flex gap-2">
              {editingMatch === m.id ? (
                <>
                  <button
                    onClick={() => handleSaveScore(m.id)}
                    className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                  >
                    ✅ Save Score
                  </button>
                  <button
                    onClick={() => setEditingMatch(null)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setEditingMatch(m.id);
                    setHomeScore(m.homeScore ?? 0);
                    setAwayScore(m.awayScore ?? 0);
                  }}
                  className="flex-1 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700"
                >
                  {m.homeScore !== null ? 'Edit Score' : 'Enter Score'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}