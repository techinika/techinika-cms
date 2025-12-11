import { Zap } from "lucide-react";

export const CheckboxToggle = ({
  name,
  label,
  checked,
  onChange,
  icon: Icon = Zap,
}: {
  name: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) => (
  <div className="flex items-center justify-between p-3 bg-white border border-gray-300 shadow-sm">
    <label
      htmlFor={name}
      className="text-sm font-semibold text-gray-800 flex items-center cursor-pointer"
    >
      <Icon className="w-4 h-4 mr-2 text-primary" />
      {label}
    </label>
    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
      <input
        type="checkbox"
        name={name}
        id={name}
        checked={checked}
        onChange={onChange}
        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition duration-300 ease-in-out"
      />
      <label
        htmlFor={name}
        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition duration-300 ease-in-out ${
          checked ? "bg-primary" : "bg-gray-300"
        }`}
      ></label>
    </div>
  </div>
);
