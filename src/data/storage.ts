import { User, Match, Prediction, Comment } from '@/types';
import { generateAllFixtures } from '@/data/fixtures';

const KEYS = {
  USERS: 'unstuck_cup_users',
  MATCHES: 'unstuck_cup_matches',
  PREDICTIONS: 'unstuck_cup_predictions',
  COMMENTS: 'unstuck_cup_comments',
  CURRENT_USER: 'unstuck_cup_current_user',
} as const;

function get<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch { /* ignore */ }
  return fallback;
}

function set<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Initialize matches on first load
export function initializeData(): void {
  if (!localStorage.getItem(KEYS.MATCHES)) {
    set(KEYS.MATCHES, generateAllFixtures());
  }
}

// Users
export function getUsers(): User[] {
  return get<User[]>(KEYS.USERS, []);
}
export function saveUser(user: User): void {
  const users = getUsers().filter(u => u.id !== user.id);
  users.push(user);
  set(KEYS.USERS, users);
}
export function getUserById(id: string): User | undefined {
  return getUsers().find(u => u.id === id);
}

// Current user
export function getCurrentUser(): User | null {
  return get<User | null>(KEYS.CURRENT_USER, null);
}
export function setCurrentUser(user: User | null): void {
  set(KEYS.CURRENT_USER, user);
}

// Matches
export function getMatches(): Match[] {
  return get<Match[]>(KEYS.MATCHES, []);
}
export function saveMatches(matches: Match[]): void {
  set(KEYS.MATCHES, matches);
}
export function getMatchById(id: string): Match | undefined {
  return getMatches().find(m => m.id === id);
}
export function updateMatch(updated: Match): void {
  const matches = getMatches().map(m => m.id === updated.id ? updated : m);
  saveMatches(matches);
}

// Predictions
export function getPredictions(): Prediction[] {
  return get<Prediction[]>(KEYS.PREDICTIONS, []);
}
export function savePrediction(pred: Prediction): void {
  const preds = getPredictions().filter(p => !(p.userId === pred.userId && p.matchId === pred.matchId));
  preds.push(pred);
  set(KEYS.PREDICTIONS, preds);
}
export function getUserPredictions(userId: string): Prediction[] {
  return getPredictions().filter(p => p.userId === userId);
}
export function getMatchPredictions(matchId: string): Prediction[] {
  return getPredictions().filter(p => p.matchId === matchId);
}
export function savePredictions(preds: Prediction[]): void {
  set(KEYS.PREDICTIONS, preds);
}

// Comments
export function getComments(): Comment[] {
  return get<Comment[]>(KEYS.COMMENTS, []);
}
export function getMatchComments(matchId: string): Comment[] {
  return getComments().filter(c => c.matchId === matchId);
}
export function addComment(comment: Comment): void {
  const comments = getComments();
  comments.push(comment);
  set(KEYS.COMMENTS, comments);
}