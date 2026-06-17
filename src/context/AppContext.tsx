import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { User, Match, Prediction, Comment } from '@/types';
import * as storage from '@/data/storage';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  matches: Match[];
  predictions: Prediction[];
  comments: Comment[];
  darkMode: boolean;
  login: (user: User) => void;
  logout: () => void;
  refreshData: () => void;
  savePrediction: (pred: Prediction) => void;
  updateMatch: (match: Match) => void;
  addComment: (comment: Comment) => void;
  toggleDarkMode: () => void;
  rescoreAll: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useAppContext(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  const refreshData = useCallback(() => {
    setUsers(storage.getUsers());
    setMatches(storage.getMatches());
    setPredictions(storage.getPredictions());
    setComments(storage.getComments());
  }, []);

  useEffect(() => {
    storage.initializeData();
    const user = storage.getCurrentUser();
    setCurrentUser(user);
    refreshData();

    const saved = localStorage.getItem('unstuck_cup_dark_mode');
    if (saved === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, [refreshData]);

  const login = useCallback((user: User) => {
    storage.saveUser(user);
    storage.setCurrentUser(user);
    setCurrentUser(user);
    refreshData();
  }, [refreshData]);

  const logout = useCallback(() => {
    storage.setCurrentUser(null);
    setCurrentUser(null);
  }, []);

  const savePrediction = useCallback((pred: Prediction) => {
    storage.savePrediction(pred);
    refreshData();
  }, [refreshData]);

  const updateMatchFn = useCallback((match: Match) => {
    storage.updateMatch(match);
    refreshData();
  }, [refreshData]);

  const addCommentFn = useCallback((comment: Comment) => {
    storage.addComment(comment);
    refreshData();
  }, [refreshData]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('unstuck_cup_dark_mode', String(next));
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  }, []);

  const rescoreAll = useCallback(() => {
    const allPreds = storage.getPredictions();
    const allMatches = storage.getMatches();
    const { calculatePoints: calc } = require('@/utils/scoring');
    const updated = allPreds.map(p => {
      const m = allMatches.find(mm => mm.id === p.matchId);
      if (!m || m.homeScore === null || m.awayScore === null) {
        return { ...p, points: null };
      }
      return { ...p, points: calc(p, m) };
    });
    storage.savePredictions(updated);
    refreshData();
  }, [refreshData]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        matches,
        predictions,
        comments,
        darkMode,
        login,
        logout,
        refreshData,
        savePrediction,
        updateMatch: updateMatchFn,
        addComment: addCommentFn,
        toggleDarkMode,
        rescoreAll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}