import { useState, useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import MatchCard from '@/components/MatchCard';
import StageFilter from '@/components/StageFilter';
import EmptyState from '@/components/EmptyState';
import { formatDate } from '@/utils/matchStatus';

export default function MatchesPage() {
  const { matches, predictions, currentUser } = useAppContext();
  const [stageFilter, setStageFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');

  const filtered = useMemo(() => {
    let result = [...matches];
    if (stageFilter !== 'all') {
      result = result.filter(m => m.stage === stageFilter);
    }
    if (groupFilter !== 'all' && stageFilter === 'group') {
      result = result.filter(m => m.group === groupFilter);
    }
    result.sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());
    return result;
  }, [matches, stageFilter, groupFilter]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const m of filtered) {
      const key = formatDate(m.kickoff);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(m);
    }
    return map;
  }, [filtered]);

  const groups = ['all', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Matches</h2>

      <StageFilter active={stageFilter} onChange={setStageFilter} />

      {stageFilter === 'group' && (
        <div className="flex gap-1.5 overflow-x-auto pb-2 mt-2 scrollbar-hide">
          {groups.map(g => (
            <button
              key={g}
              onClick={() => setGroupFilter(g)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                groupFilter === g
                  ? 'bg-accent-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {g === 'all' ? 'All Groups' : `Group ${g}`}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState icon="📅" title="No matches found" description="Adjust your filters to see matches." />
      ) : (
        <div className="mt-4 space-y-6">
          {Array.from(grouped.entries()).map(([date, dayMatches]) => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 sticky top-14 bg-gray-50 dark:bg-gray-950 py-1 z-10">
                {date}
              </h3>
              <div className="space-y-3">
                {dayMatches.map(m => {
                  const pred = predictions.find(
                    p => p.matchId === m.id && p.userId === currentUser?.id
                  );
                  return <MatchCard key={m.id} match={m} prediction={pred} showPoints />;
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}