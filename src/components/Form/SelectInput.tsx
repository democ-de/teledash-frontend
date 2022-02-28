import clsx from "clsx";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { FormGroup, FormGroupPassThroughProps } from "./FormGroup";

type Option = {
  label: string;
  value?: string | number | string[];
};

type SelectInputProps = {
  id: string;
  options: Option[];
  className?: string;
  defaultValue?: string;
  placeholder?: string;
  registration: Partial<UseFormRegisterReturn>;
  error?: FieldError | undefined;
};

type SelectInputGroupProps = FormGroupPassThroughProps & SelectInputProps;

export const SelectInput = ({
  id,
  options,
  className,
  defaultValue,
  placeholder,
  registration,
  error,
}: SelectInputProps) => {
  return (
    <div className={className}>
      <select
        id={id}
        placeholder={placeholder}
        className={clsx(
          "block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 rounded-md shadow-sm",
          "focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500",
          {
            "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-100 focus:border-red-500":
              error,
          }
        )}
        defaultValue={defaultValue}
        {...registration}
      >
        {options.map(({ label, value }) => (
          <option key={label?.toString()} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

export const SelectInputGroup = (props: SelectInputGroupProps) => {
  return (
    <FormGroup
      id={props.id}
      label={props.label}
      hiddenLabel={props.hiddenLabel}
      layout={props.layout}
      className={props.className}
      error={props.error}
      description={props.description}
    >
      <SelectInput
        id={props.id}
        options={props.options}
        // className={props.className} // classname applies to FormGroup
        defaultValue={props.defaultValue}
        placeholder={props.placeholder}
        registration={props.registration}
        error={props.error}
      />
    </FormGroup>
  );
};
