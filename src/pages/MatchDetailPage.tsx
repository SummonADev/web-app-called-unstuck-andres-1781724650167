import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from '@/context/AppContext';
import { getMatchStatus, formatDate, formatTime, getCountdown } from '@/utils/matchStatus';
import { getTeamFlag } from '@/data/teams';
import { calculatePoints } from '@/utils/scoring';
import PredictionForm from '@/components/PredictionForm';
import EmptyState from '@/components/EmptyState';

export default function MatchDetailPage() {
  const { matchId } = useParams<{ matchId: string }>();
  const { matches, predictions, currentUser, comments, addComment, users } = useAppContext();
  const match = matches.find(m => m.id === matchId);
  const [commentText, setCommentText] = useState('');

  if (!match) {
    return <EmptyState icon="❓" title="Match not found" description="This match doesn't exist." />;
  }

  const status = getMatchStatus(match);
  const myPrediction = predictions.find(
    p => p.matchId === match.id && p.userId === currentUser?.id
  );
  const matchComments = comments.filter(c => c.matchId === match.id)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const matchPredictions = predictions.filter(p => p.matchId === match.id);

  const handleComment = () => {
    if (!commentText.trim() || !currentUser) return;
    addComment({
      id: uuidv4(),
      matchId: match.id,
      userId: currentUser.id,
      text: commentText.trim(),
      createdAt: new Date().toISOString(),
    });
    setCommentText('');
  };

  return (
    <div className="space-y-6">
      <Link to="/matches" className="text-sm text-brand-600 dark:text-brand-400 hover:underline">
        ← Back to matches
      </Link>

      {/* Match header */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {match.group ? `Group ${match.group}` : match.stage.replace(/-/g, ' ')} · #{match.matchNumber}
          </span>
          <span className="text-xs text-gray-400">{match.venue}</span>
        </div>
        <div className="text-xs text-gray-400 mb-4">
          {formatDate(match.kickoff)} · {formatTime(match.kickoff)}
          {status === 'open' && <span className="ml-2 text-green-600 dark:text-green-400">🔓 {getCountdown(match.kickoff)}</span>}
          {status === 'locked' && <span className="ml-2 text-amber-600 dark:text-amber-400">🔒 Locked</span>}
        </div>

        <div className="flex items-center justify-center gap-6">
          <div className="text-center">
            <span className="text-3xl block mb-1">{match.homeTeam ? getTeamFlag(match.homeTeam) : '❓'}</span>
            <span className="font-semibold text-sm">{match.homeTeam || 'TBD'}</span>
          </div>
          <div className="text-center">
            {status === 'scored' ? (
              <span className="text-3xl font-bold">{match.homeScore} – {match.awayScore}</span>
            ) : (
              <span className="text-xl text-gray-300 dark:text-gray-600">vs</span>
            )}
          </div>
          <div className="text-center">
            <span className="text-3xl block mb-1">{match.awayTeam ? getTeamFlag(match.awayTeam) : '❓'}</span>
            <span className="font-semibold text-sm">{match.awayTeam || 'TBD'}</span>
          </div>
        </div>
      </div>

      {/* Prediction form */}
      <PredictionForm match={match} existing={myPrediction} />

      {/* Everyone's predictions (visible after lock) */}
      {status !== 'open' && matchPredictions.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4">
          <h3 className="text-sm font-semibold mb-3">Everyone's Predictions</h3>
          <div className="space-y-2">
            {matchPredictions.map(p => {
              const user = users.find(u => u.id === p.userId);
              const pts = status === 'scored' ? calculatePoints(p, match) : null;
              return (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span>{user?.avatar || '?'}</span>
                    <span className="font-medium">{user?.displayName || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 dark:text-gray-400">{p.homeScore} – {p.awayScore}</span>
                    {pts !== null && (
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                        pts >= 5 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : pts >= 1 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        +{pts}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Comments */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4">
        <h3 className="text-sm font-semibold mb-3">💬 Match Chat</h3>
        {matchComments.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">No comments yet. Start the trash talk! 🗣️</p>
        ) : (
          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
            {matchComments.map(c => {
              const user = users.find(u => u.id === c.userId);
              return (
                <div key={c.id} className="text-sm">
                  <div className="flex items-center gap-1.5">
                    <span>{user?.avatar || '?'}</span>
                    <span className="font-medium text-xs">{user?.displayName || 'Unknown'}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(c.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 ml-6 text-xs">{c.text}</p>
                </div>
              );
            })}
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            placeholder="Drop your take..."
            onKeyDown={e => e.key === 'Enter' && handleComment()}
            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            onClick={handleComment}
            className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}