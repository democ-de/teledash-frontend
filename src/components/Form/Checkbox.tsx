import clsx from "clsx";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

type CheckboxProps = {
  id: string;
  label: string;
  defaultChecked: boolean;
  hint?: string;
  error?: FieldError | undefined;
  registration: Partial<UseFormRegisterReturn>;
};

export const Checkbox = ({
  id,
  label,
  defaultChecked,
  hint,
  registration,
  error,
}: CheckboxProps) => {
  return (
    <div className="relative flex items-start">
      <div className="flex items-center h-5">
        <input
          id={id}
          aria-describedby={`${id}-description`}
          type="checkbox"
          defaultChecked={defaultChecked}
          className={clsx(
            "focus:ring-indigo-500 h-5 w-5 mt-1.5 text-indigo-600 border-gray-300 rounded",
            { "border-red-500": error }
          )}
          {...registration}
        />
      </div>
      <div className="ml-3">
        <label htmlFor={id} className="font-medium text-gray-700">
          {label}
        </label>
        {hint && (
          <p id={`${id}-description`} className="text-gray-500 text-sm">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
};
