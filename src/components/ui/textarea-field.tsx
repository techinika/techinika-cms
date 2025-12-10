import React from "react";
import { FileText } from "lucide-react";

export const TextareaField = ({
  name,
  label,
  required = false,
  rows = 4,
  placeholder = "",
  icon: Icon = FileText,
  onChange,
  value,
}: {
  name: string;
  label: string;
  required?: boolean;
  rows: number;
  placeholder: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value: any;
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-semibold text-gray-800 mb-1"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <div className="absolute top-3 left-3 flex items-start pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <textarea
        id={name}
        name={name}
        required={required}
        rows={rows}
        value={value}
        onChange={onChange}
        className="block w-full p-4 pl-10 border border-gray-300 focus:ring-primary focus:border-primary sm:text-sm transition duration-150 shadow-sm resize-y"
        placeholder={
          placeholder || `Write the detailed ${label.toLowerCase()} here...`
        }
      ></textarea>
    </div>
  </div>
);
