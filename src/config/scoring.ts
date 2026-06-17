// Scoring constants — tune these as needed
export const SCORING = {
  EXACT_SCORE: 5,
  CORRECT_RESULT_AND_GD: 3,
  CORRECT_RESULT_ONLY: 1,
  WRONG: 0,
  KNOCKOUT_MULTIPLIER: 2,
  BONUS_TOURNAMENT_WINNER: 15,
  BONUS_TOP_SCORER: 10,
} as const;

export type ScoringConfig = typeof SCORING;