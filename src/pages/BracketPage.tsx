import { useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { getTeamFlag } from '@/data/teams';
import type { Match } from '@/types';

interface BracketMatchProps {
  match: Match;
}

function BracketMatch({ match }: BracketMatchProps) {
  const homeLabel = match.homeTeam ? `${getTeamFlag(match.homeTeam)} ${match.homeTeam}` : 'TBD';
  const awayLabel = match.awayTeam ? `${getTeamFlag(match.awayTeam)} ${match.awayTeam}` : 'TBD';
  const hasScore = match.homeScore !== null && match.awayScore !== null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-3 min-w-[200px]">
      <div className="text-[10px] text-gray-400 mb-1">#{match.matchNumber} · {match.stage.replace(/-/g, ' ')}</div>
      <div className="flex items-center justify-between text-sm">
        <span className={`font-medium ${hasScore && match.homeScore! > match.awayScore! ? 'text-green-600 dark:text-green-400' : ''}`}>
          {homeLabel}
        </span>
        <span className="font-bold ml-2">{hasScore ? match.homeScore : '-'}</span>
      </div>
      <div className="flex items-center justify-between text-sm mt-1">
        <span className={`font-medium ${hasScore && match.awayScore! > match.homeScore! ? 'text-green-600 dark:text-green-400' : ''}`}>
          {awayLabel}
        </span>
        <span className="font-bold ml-2">{hasScore ? match.awayScore : '-'}</span>
      </div>
    </div>
  );
}

export default function BracketPage() {
  const { matches } = useAppContext();

  const stages = useMemo(() => {
    const knockoutStages = ['round-of-32', 'round-of-16', 'quarterfinal', 'semifinal', 'third-place', 'final'] as const;
    const grouped: Record<string, Match[]> = {};
    for (const stage of knockoutStages) {
      grouped[stage] = matches
        .filter(m => m.stage === stage)
        .sort((a, b) => a.matchNumber - b.matchNumber);
    }
    return grouped;
  }, [matches]);

  const stageLabels: Record<string, string> = {
    'round-of-32': 'Round of 32',
    'round-of-16': 'Round of 16',
    'quarterfinal': 'Quarter-Finals',
    'semifinal': 'Semi-Finals',
    'third-place': '3rd Place',
    'final': 'Final',
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">🌳 Knockout Bracket</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Follow the knockout stage from the Round of 32 to the Final.
      </p>

      <div className="space-y-8">
        {Object.entries(stages).map(([stage, stageMatches]) => {
          if (stageMatches.length === 0) return null;
          return (
            <div key={stage}>
              <h3 className="text-sm font-bold text-brand-600 dark:text-brand-400 mb-3">
                {stageLabels[stage] || stage}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {stageMatches.map(m => (
                  <BracketMatch key={m.id} match={m} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
