import clsx from "clsx";
import Icon from "@mdi/react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { FormGroup, FormGroupPassThroughProps } from "./FormGroup";

export type TextInputProps = {
  id?: string;
  type?:
    | "text"
    | "email"
    | "password"
    | "search"
    | "number"
    | "date"
    | "datetime-local"
    | "tel";
  startIcon?: string;
  placeholder?: string;
  className?: string;
  registration: Partial<UseFormRegisterReturn>;
  error?: FieldError | undefined;
};

type TextInputGroupProps = FormGroupPassThroughProps & TextInputProps;

export const TextInput = ({
  id,
  type = "text",
  startIcon,
  placeholder,
  className,
  registration,
  error,
}: TextInputProps) => {
  return (
    <div className={clsx(startIcon && "relative", className)}>
      {startIcon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon
            path={startIcon}
            size={0.9}
            aria-hidden="true"
            className="text-gray-400"
          />
        </div>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={clsx(
          "appearance-none autofill:bg-white block w-full px-3 py-2.5 rounded-md shadow-sm",
          "border border-gray-300 placeholder-gray-400",
          "focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500",
          {
            "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500":
              error,
          },
          { "pl-10": startIcon }
        )}
        {...registration}
      />
    </div>
  );
};

export const TextInputGroup = (props: TextInputGroupProps) => {
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
      <TextInput
        id={props.id}
        type={props.type}
        startIcon={props.startIcon}
        placeholder={props.placeholder}
        // className={props.className} // classname applies to FormGroup
        registration={props.registration}
        error={props.error}
      />
    </FormGroup>
  );
};
