export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar: string;
  isAdmin: boolean;
  createdAt: string;
}

export type MatchStage =
  | 'group'
  | 'round-of-32'
  | 'round-of-16'
  | 'quarterfinal'
  | 'semifinal'
  | 'third-place'
  | 'final';

export interface Match {
  id: string;
  matchNumber: number;
  homeTeam: string | null;
  awayTeam: string | null;
  group: string | null;
  stage: MatchStage;
  kickoff: string; // ISO datetime
  venue: string;
  homeScore: number | null;
  awayScore: number | null;
  // For knockout: references to feeder matches
  homeFromMatch: number | null;
  awayFromMatch: number | null;
  homeFromPosition: 'winner' | 'loser' | null;
  awayFromPosition: 'winner' | 'loser' | null;
}

export interface Prediction {
  id: string;
  userId: string;
  matchId: string;
  homeScore: number;
  awayScore: number;
  points: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  matchId: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  avatar: string;
  totalPoints: number;
  exactScores: number;
  recentForm: number[];
  rank: number;
}

export interface GroupStanding {
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface ThirdPlaceSlot {
  matchNumber: number;
  eligibleGroups: string[];
  assignedTeam: string | null;
}

export type MatchStatus = 'open' | 'locked' | 'scored';