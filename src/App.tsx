import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import Layout from '@/components/Layout';
import LoginPage from '@/pages/LoginPage';
import MatchesPage from '@/pages/MatchesPage';
import MatchDetailPage from '@/pages/MatchDetailPage';
import LeaderboardPage from '@/pages/LeaderboardPage';
import MyPredictionsPage from '@/pages/MyPredictionsPage';
import AdminPage from '@/pages/AdminPage';
import ProfilePage from '@/pages/ProfilePage';
import BracketPage from '@/pages/BracketPage';
import UserHistoryPage from '@/pages/UserHistoryPage';

export default function App() {
  const { currentUser } = useAppContext();

  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/matches" replace />} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route path="/matches/:matchId" element={<MatchDetailPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/leaderboard/:userId" element={<UserHistoryPage />} />
        <Route path="/predictions" element={<MyPredictionsPage />} />
        <Route path="/bracket" element={<BracketPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/matches" replace />} />
      </Routes>
    </Layout>
  );
}