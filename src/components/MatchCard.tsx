import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Match, Prediction } from '@/types';
import { getMatchStatus, getCountdown, formatTime } from '@/utils/matchStatus';
import { getTeamFlag } from '@/data/teams';
import { calculatePoints } from '@/utils/scoring';

interface MatchCardProps {
  match: Match;
  prediction?: Prediction;
  showPoints?: boolean;
}

export default function MatchCard({ match, prediction, showPoints = false }: MatchCardProps) {
  const status = getMatchStatus(match);
  const [countdown, setCountdown] = useState(getCountdown(match.kickoff));

  useEffect(() => {
    if (status !== 'open') return;
    const interval = setInterval(() => {
      setCountdown(getCountdown(match.kickoff));
    }, 30000);
    return () => clearInterval(interval);
  }, [match.kickoff, status]);

  const statusColors = {
    open: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    locked: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    scored: 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400',
  };

  const points = prediction && status === 'scored' ? calculatePoints(prediction, match) : null;

  return (
    <Link
      to={`/matches/${match.id}`}
      className="block bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {match.group && (
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Group {match.group}
            </span>
          )}
          {match.stage !== 'group' && (
            <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 capitalize">
              {match.stage.replace(/-/g, ' ')}
            </span>
          )}
          <span className="text-xs text-gray-400">#{match.matchNumber}</span>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[status]}`}>
          {status === 'open' ? `🔓 ${countdown}` : status === 'locked' ? '🔒 Locked' : '✅ Scored'}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1 text-right">
          <span className="text-sm mr-1">{match.homeTeam ? getTeamFlag(match.homeTeam) : '❓'}</span>
          <span className="font-medium text-sm">{match.homeTeam || 'TBD'}</span>
        </div>

        <div className="mx-3 text-center min-w-[60px]">
          {status === 'scored' ? (
            <span className="text-lg font-bold">
              {match.homeScore} – {match.awayScore}
            </span>
          ) : (
            <span className="text-xs text-gray-400">{formatTime(match.kickoff)}</span>
          )}
        </div>

        <div className="flex-1 text-left">
          <span className="font-medium text-sm">{match.awayTeam || 'TBD'}</span>
          <span className="text-sm ml-1">{match.awayTeam ? getTeamFlag(match.awayTeam) : '❓'}</span>
        </div>
      </div>

      {prediction && (
        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Your prediction: {prediction.homeScore} – {prediction.awayScore}
          </span>
          {showPoints && points !== null && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              points >= 5 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : points >= 3 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              : points >= 1 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
              : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
            }`}>
              +{points} pts
            </span>
          )}
        </div>
      )}
    </Link>
  );
}