import { Match, MatchStatus } from '@/types';

export function getMatchStatus(match: Match): MatchStatus {
  if (match.homeScore !== null && match.awayScore !== null) return 'scored';
  const now = new Date();
  const kickoff = new Date(match.kickoff);
  if (now >= kickoff) return 'locked';
  return 'open';
}

export function getCountdown(kickoff: string): string {
  const now = new Date().getTime();
  const target = new Date(kickoff).getTime();
  const diff = target - now;
  if (diff <= 0) return 'Locked';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}