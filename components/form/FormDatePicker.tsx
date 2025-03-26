import React from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type FormDatePickerProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  placeholder?: string;
  label?: string;
  className?: string;
  minDate?: Date;
};

const FormDatePicker = <T extends FieldValues>({
  control,
  name,
  placeholder,
  label,
  className = "",
  minDate,
}: FormDatePickerProps<T>) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-1">{label}</label>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <DatePicker
            selected={field.value}
            onChange={(date) => field.onChange(date)}
            className={`w-full p-2 border border-border-input rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-primary ${className}`}
            dateFormat="dd/MM/yyyy"
            placeholderText={placeholder ?? "DD/MM/YYYY"}
            minDate={minDate}
          />
        )}
      />
    </div>
  );
};

export default FormDatePicker;
