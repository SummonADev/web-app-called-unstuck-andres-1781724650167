import { GroupStanding, Prediction, Match } from '@/types';

export function computeGroupStandings(
  group: string,
  matches: Match[],
  predictions: Prediction[],
  useActualScores: boolean = false
): GroupStanding[] {
  const groupMatches = matches.filter(m => m.group === group && m.stage === 'group');
  const teamSet = new Set<string>();
  groupMatches.forEach(m => {
    if (m.homeTeam) teamSet.add(m.homeTeam);
    if (m.awayTeam) teamSet.add(m.awayTeam);
  });

  const standings = new Map<string, GroupStanding>();
  teamSet.forEach(team => {
    standings.set(team, {
      team,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    });
  });

  for (const match of groupMatches) {
    let homeScore: number | null = null;
    let awayScore: number | null = null;

    if (useActualScores) {
      homeScore = match.homeScore;
      awayScore = match.awayScore;
    } else {
      const pred = predictions.find(p => p.matchId === match.id);
      if (pred) {
        homeScore = pred.homeScore;
        awayScore = pred.awayScore;
      }
    }

    if (homeScore === null || awayScore === null) continue;
    if (!match.homeTeam || !match.awayTeam) continue;

    const home = standings.get(match.homeTeam)!;
    const away = standings.get(match.awayTeam)!;

    home.played++;
    away.played++;
    home.goalsFor += homeScore;
    home.goalsAgainst += awayScore;
    away.goalsFor += awayScore;
    away.goalsAgainst += homeScore;

    if (homeScore > awayScore) {
      home.won++;
      home.points += 3;
      away.lost++;
    } else if (homeScore < awayScore) {
      away.won++;
      away.points += 3;
      home.lost++;
    } else {
      home.drawn++;
      away.drawn++;
      home.points += 1;
      away.points += 1;
    }

    home.goalDifference = home.goalsFor - home.goalsAgainst;
    away.goalDifference = away.goalsFor - away.goalsAgainst;
  }

  const arr = Array.from(standings.values());
  arr.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.team.localeCompare(b.team);
  });

  return arr;
}