"use client";

import { Text } from "lucide-react";
import React from "react";

export const InputField = ({
  name,
  label,
  icon: Icon = Text,
  type = "text",
  required = false,
  placeholder = "",
  className = "",
  onChange,
  value,
  disabled = false,
  maxLength,
  ...rest
}: {
  name: string;
  label: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  type?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: any;
  disabled?: boolean;
  maxLength?: number;
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
      <input
        type={type}
        name={name}
        id={name}
        required={required}
        value={value}
        onChange={onChange}
        disabled={disabled}
        maxLength={maxLength}
        className="block w-full pl-10 pr-4 py-2 border border-gray-300 bg-white focus:ring-primary focus:border-primary sm:text-sm transition duration-150 shadow-sm"
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        {...rest}
      />
    </div>
  </div>
);
