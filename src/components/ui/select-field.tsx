import { Blocks } from "lucide-react";
import React from "react";

export const SelectField = ({
  name,
  label,
  icon: Icon = Blocks,
  options,
  required = false,
  placeholder = "Select an option",
  className = "",
  value,
  onChange,
}: {
  name: string;
  label: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  options: any[] | readonly string[];
  required: boolean;
  placeholder?: string;
  className?: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <div className={className}>
    <label
      htmlFor={name}
      className="block text-sm font-semibold text-gray-800 mb-1"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <select
        id={name}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        className="block w-full pl-10 pr-10 py-2 border border-gray-300 bg-white focus:ring-primary focus:border-primary sm:text-sm transition duration-150 shadow-sm appearance-none"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="absolute right-0 top-0 h-full w-10 text-gray-400 flex items-center justify-center pointer-events-none border-l border-gray-300">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </span>
    </div>
  </div>
);
