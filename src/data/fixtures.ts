import { Match } from '@/types';
import { TEAMS } from '@/data/teams';
import { v4 as uuidv4 } from 'uuid';

const venues = [
  'MetLife Stadium, NJ', 'AT&T Stadium, Dallas', 'SoFi Stadium, LA',
  'Hard Rock Stadium, Miami', 'Lumen Field, Seattle', 'Estadio Azteca, Mexico City',
  'Estadio BBVA, Monterrey', 'Estadio Akron, Guadalajara', 'Lincoln Financial Field, Philadelphia',
  'Gillette Stadium, Boston', 'Mercedes-Benz Stadium, Atlanta', 'BMO Field, Toronto',
  'BC Place, Vancouver', 'NRG Stadium, Houston',
];

function generateGroupFixtures(): Match[] {
  const matches: Match[] = [];
  let matchNumber = 1;
  const startDate = new Date('2026-06-11T16:00:00Z');
  let dayOffset = 0;

  for (const [group, teams] of Object.entries(TEAMS)) {
    // 6 matches per group: R1 (0v3,1v2), R2 (0v1,2v3), R3 (0v2,1v3)
    const pairings = [
      [0, 3], [1, 2],
      [0, 1], [2, 3],
      [0, 2], [1, 3],
    ];

    for (let i = 0; i < pairings.length; i++) {
      const [h, a] = pairings[i];
      const kickoff = new Date(startDate);
      kickoff.setDate(kickoff.getDate() + dayOffset + Math.floor(i / 2));
      kickoff.setHours(16 + (i % 3) * 3, 0, 0, 0);

      matches.push({
        id: uuidv4(),
        matchNumber,
        homeTeam: teams[h],
        awayTeam: teams[a],
        group,
        stage: 'group',
        kickoff: kickoff.toISOString(),
        venue: venues[matchNumber % venues.length],
        homeScore: null,
        awayScore: null,
        homeFromMatch: null,
        awayFromMatch: null,
        homeFromPosition: null,
        awayFromPosition: null,
      });
      matchNumber++;
    }
    dayOffset += 2;
  }

  return matches;
}

function generateKnockoutFixtures(startMatchNumber: number): Match[] {
  const matches: Match[] = [];
  let mn = startMatchNumber;
  const baseDate = new Date('2026-07-01T16:00:00Z');

  interface KnockoutDef {
    stage: Match['stage'];
    count: number;
  }

  const stages: KnockoutDef[] = [
    { stage: 'round-of-32', count: 16 },
    { stage: 'round-of-16', count: 8 },
    { stage: 'quarterfinal', count: 4 },
    { stage: 'semifinal', count: 2 },
    { stage: 'third-place', count: 1 },
    { stage: 'final', count: 1 },
  ];

  let dayOff = 0;
  for (const s of stages) {
    for (let i = 0; i < s.count; i++) {
      const kickoff = new Date(baseDate);
      kickoff.setDate(kickoff.getDate() + dayOff + Math.floor(i / 2));
      kickoff.setHours(16 + (i % 2) * 3, 0, 0, 0);

      matches.push({
        id: uuidv4(),
        matchNumber: mn,
        homeTeam: null,
        awayTeam: null,
        group: null,
        stage: s.stage,
        kickoff: kickoff.toISOString(),
        venue: venues[mn % venues.length],
        homeScore: null,
        awayScore: null,
        homeFromMatch: null,
        awayFromMatch: null,
        homeFromPosition: null,
        awayFromPosition: null,
      });
      mn++;
    }
    dayOff += Math.ceil(s.count / 2) + 1;
  }

  return matches;
}

export function generateAllFixtures(): Match[] {
  const group = generateGroupFixtures();
  const knockout = generateKnockoutFixtures(group.length + 1);
  return [...group, ...knockout];
}

// R32 third-place eligibility
export const THIRD_PLACE_SLOTS: { matchNumber: number; eligibleGroups: string[] }[] = [
  { matchNumber: 74, eligibleGroups: ['A','B','C','D','F'] },
  { matchNumber: 77, eligibleGroups: ['C','D','F','G','H'] },
  { matchNumber: 79, eligibleGroups: ['C','E','F','H','I'] },
  { matchNumber: 80, eligibleGroups: ['E','H','I','J','K'] },
  { matchNumber: 81, eligibleGroups: ['B','E','F','I','J'] },
  { matchNumber: 82, eligibleGroups: ['A','E','H','I','J'] },
  { matchNumber: 85, eligibleGroups: ['E','F','G','I','J'] },
  { matchNumber: 87, eligibleGroups: ['D','E','I','J','L'] },
];

// Knockout tree feeder structure
export const R16_FEEDERS: [number, number][] = [
  [74, 77], // M89
  [73, 75], // M90
  [76, 78], // M91
  [79, 80], // M92
  [83, 84], // M93
  [81, 82], // M94
  [86, 88], // M95
  [85, 87], // M96
];

export const QF_FEEDERS: [number, number][] = [
  [89, 90], // M97
  [93, 94], // M98
  [91, 92], // M99
  [95, 96], // M100
];

export const SF_FEEDERS: [number, number][] = [
  [97, 98], // M101
  [99, 100], // M102
];