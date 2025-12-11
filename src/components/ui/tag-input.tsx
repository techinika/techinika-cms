import { Info } from "lucide-react";
import React from "react";

type TagInputProps = {
  label: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  infoText?: string;
};

export const TagInput: React.FC<TagInputProps> = ({
  label,
  name,
  icon: Icon,
  value,
  onChange,
  placeholder,
  infoText,
}) => {
  const tags = value
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  return (
    <div>
      <label className="flex items-center text-sm font-semibold text-gray-700 mb-1">
        <Icon className="w-4 h-4 mr-1 text-gray-500" />
        {label}
        <span
          title={infoText}
          className="ml-2 text-gray-400 cursor-help group relative"
        >
          <Info className="w-3 h-3" />
        </span>
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm"
      />
      <div className="mt-2 flex flex-wrap gap-2 min-h-[30px]">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-primary rounded-full border border-blue-200"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};
