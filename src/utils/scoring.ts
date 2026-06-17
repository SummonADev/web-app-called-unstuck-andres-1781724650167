import { Match, Prediction, MatchStage } from '@/types';
import { SCORING } from '@/config/scoring';

function isKnockout(stage: MatchStage): boolean {
  return stage !== 'group';
}

export function calculatePoints(prediction: Prediction, match: Match): number {
  if (match.homeScore === null || match.awayScore === null) return 0;

  const pH = prediction.homeScore;
  const pA = prediction.awayScore;
  const aH = match.homeScore;
  const aA = match.awayScore;

  const multiplier = isKnockout(match.stage) ? SCORING.KNOCKOUT_MULTIPLIER : 1;

  // Exact score
  if (pH === aH && pA === aA) {
    return SCORING.EXACT_SCORE * multiplier;
  }

  // Determine results
  const predResult = pH > pA ? 'home' : pH < pA ? 'away' : 'draw';
  const actualResult = aH > aA ? 'home' : aH < aA ? 'away' : 'draw';

  if (predResult !== actualResult) {
    return SCORING.WRONG;
  }

  // Correct result + correct GD
  const predGD = pH - pA;
  const actualGD = aH - aA;
  if (predGD === actualGD) {
    return SCORING.CORRECT_RESULT_AND_GD * multiplier;
  }

  // Correct result only
  return SCORING.CORRECT_RESULT_ONLY * multiplier;
}

export function isExactScore(prediction: Prediction, match: Match): boolean {
  if (match.homeScore === null || match.awayScore === null) return false;
  return prediction.homeScore === match.homeScore && prediction.awayScore === match.awayScore;
}