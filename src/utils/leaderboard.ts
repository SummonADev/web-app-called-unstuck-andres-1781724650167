import { LeaderboardEntry, Match, Prediction, User } from '@/types';
import { calculatePoints, isExactScore } from '@/utils/scoring';

export function buildLeaderboard(
  users: User[],
  matches: Match[],
  predictions: Prediction[]
): LeaderboardEntry[] {
  const scoredMatches = matches.filter(m => m.homeScore !== null && m.awayScore !== null);
  const recentScoredMatches = scoredMatches.slice(-3);

  const entries: LeaderboardEntry[] = users.map(user => {
    const userPreds = predictions.filter(p => p.userId === user.id);
    let totalPoints = 0;
    let exactScores = 0;

    for (const pred of userPreds) {
      const match = matches.find(m => m.id === pred.matchId);
      if (!match || match.homeScore === null || match.awayScore === null) continue;
      const pts = calculatePoints(pred, match);
      totalPoints += pts;
      if (isExactScore(pred, match)) exactScores++;
    }

    const recentForm = recentScoredMatches.map(m => {
      const pred = userPreds.find(p => p.matchId === m.id);
      if (!pred) return 0;
      return calculatePoints(pred, m);
    });

    return {
      userId: user.id,
      displayName: user.displayName,
      avatar: user.avatar,
      totalPoints,
      exactScores,
      recentForm,
      rank: 0,
    };
  });

  entries.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    return b.exactScores - a.exactScores;
  });

  entries.forEach((e, i) => {
    e.rank = i + 1;
  });

  return entries;
}