type FilterSelectProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: readonly string[];
};

export const FilterSelect = ({
  label,
  value,
  onChange,
  options,
}: FilterSelectProps) => (
  <div className="flex flex-col">
    <label className="text-xs font-medium text-gray-600 mb-1">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 rounded bg-white focus:ring-primary focus:border-primary text-sm transition duration-150 appearance-none"
    >
      <option value="">All</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);
