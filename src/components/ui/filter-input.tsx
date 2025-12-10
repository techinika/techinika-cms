type FilterInputProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  icon?: React.ElementType;
  placeholder?: string;
};

export const FilterInput = ({
  label,
  value,
  onChange,
  type = "text",
  icon: Icon,
  placeholder,
}: FilterInputProps) => (
  <div className="flex flex-col">
    <label className="text-xs font-medium text-gray-600 mb-1">{label}</label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-primary focus:border-primary text-sm transition duration-150"
      />
      {Icon && (
        <Icon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
      )}
    </div>
  </div>
);
