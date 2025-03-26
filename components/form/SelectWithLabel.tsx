import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type Option = {
  label: string;
  value: string;
};

type SelectWithLabelProps = {
  label?: string;
  options: Option[];
  register: UseFormRegisterReturn;
  error?: string;
};

const SelectWithLabel = ({
  label,
  options,
  register,
  error,
}: SelectWithLabelProps) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-1">{label}</label>
      )}
      <select
        {...register}
        className="w-full p-2 border border-border-input rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-primary"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default SelectWithLabel;
