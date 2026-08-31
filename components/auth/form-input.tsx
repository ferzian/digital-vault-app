import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

export function FormInput({ label, icon, className, ...props }: FormInputProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={`w-full rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 ${
            icon ? "pl-10" : "pl-3.5"
          } pr-3.5 py-2.5 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all ${
            className || ""
          }`}
        />
      </div>
    </div>
  );
}
