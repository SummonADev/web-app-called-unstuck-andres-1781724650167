import { MatchStage } from '@/types';

const stages: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'group', label: 'Groups' },
  { value: 'round-of-32', label: 'R32' },
  { value: 'round-of-16', label: 'R16' },
  { value: 'quarterfinal', label: 'QF' },
  { value: 'semifinal', label: 'SF' },
  { value: 'third-place', label: '3rd' },
  { value: 'final', label: 'Final' },
];

interface StageFilterProps {
  active: string;
  onChange: (value: string) => void;
}

export default function StageFilter({ active, onChange }: StageFilterProps) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
      {stages.map(s => (
        <button
          key={s.value}
          onClick={() => onChange(s.value)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
            active === s.value
              ? 'bg-brand-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}