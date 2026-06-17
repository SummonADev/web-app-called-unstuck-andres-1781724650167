import { GroupStanding } from '@/types';
import { getTeamFlag } from '@/data/teams';

interface GroupStandingsTableProps {
  group: string;
  standings: GroupStanding[];
}

export default function GroupStandingsTable({ group, standings }: GroupStandingsTableProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="px-4 py-2.5 bg-brand-50 dark:bg-brand-900/20 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-bold text-brand-700 dark:text-brand-300">Group {group}</h3>
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
            <th className="text-left px-4 py-2">#</th>
            <th className="text-left py-2">Team</th>
            <th className="text-center py-2">P</th>
            <th className="text-center py-2">W</th>
            <th className="text-center py-2">D</th>
            <th className="text-center py-2">L</th>
            <th className="text-center py-2">GD</th>
            <th className="text-center py-2 pr-4">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s, i) => (
            <tr
              key={s.team}
              className={`border-b border-gray-50 dark:border-gray-800/50 ${
                i < 2 ? 'bg-green-50/50 dark:bg-green-900/10' : i === 2 ? 'bg-amber-50/50 dark:bg-amber-900/10' : ''
              }`}
            >
              <td className="px-4 py-2 font-medium">{i + 1}</td>
              <td className="py-2">
                <span className="mr-1">{getTeamFlag(s.team)}</span>
                {s.team}
              </td>
              <td className="text-center py-2">{s.played}</td>
              <td className="text-center py-2">{s.won}</td>
              <td className="text-center py-2">{s.drawn}</td>
              <td className="text-center py-2">{s.lost}</td>
              <td className="text-center py-2">{s.goalDifference > 0 ? `+${s.goalDifference}` : s.goalDifference}</td>
              <td className="text-center py-2 pr-4 font-bold">{s.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}