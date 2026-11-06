import { Users } from 'lucide-react';

interface RoomFiltersProps {
  minCapacity: number;
  equipmentOptions: string[];
  selectedEquipment: string[];
  onMinCapacityChange: (value: number) => void;
  onToggleEquipment: (item: string) => void;
  onClear: () => void;
}

export default function RoomFilters({
  minCapacity,
  equipmentOptions,
  selectedEquipment,
  onMinCapacityChange,
  onToggleEquipment,
  onClear,
}: RoomFiltersProps) {
  const isFiltered = minCapacity > 0 || selectedEquipment.length > 0;

  return (
    <div className="mb-4 space-y-4 rounded-xl border border-slate-200 bg-white p-4">
      <div className="grid gap-4 sm:grid-cols-[160px_1fr] sm:items-start">
        <div className="flex flex-col gap-1">
          <label htmlFor="min-capacity" className="flex items-center gap-1 text-sm font-medium text-slate-600">
            <Users size={14} /> Min. capacity
          </label>
          <input
            id="min-capacity"
            type="number"
            min={0}
            value={minCapacity}
            onChange={(e) => onMinCapacityChange(Math.max(0, Number(e.target.value)))}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-600">Required equipment</span>
          <div className="flex flex-wrap gap-2">
            {equipmentOptions.map((item) => {
              const isSelected = selectedEquipment.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onToggleEquipment(item)}
                  className={[
                    'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                    isSelected
                      ? 'border-teal-600 bg-teal-600 text-white'
                      : 'border-slate-300 bg-white text-slate-600 hover:border-teal-300 hover:text-teal-700',
                  ].join(' ')}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {isFiltered && (
        <button
          type="button"
          onClick={onClear}
          className="text-sm font-medium text-teal-700 underline-offset-2 hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
