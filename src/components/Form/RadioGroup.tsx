import clsx from "clsx";
import { RadioGroup as HeadlessRadioGroup } from "@headlessui/react";
import Icon from "@mdi/react";

type RadioGroupOption = {
  label: string;
  value: string | number;
  disabled?: boolean;
  icon?: string;
};

type RadioGroupProps = {
  label: string;
  hiddenLabel?: boolean;
  value: string;
  options: RadioGroupOption[];
  onChange: (...event: any[]) => void;
};

export const RadioGroup = ({
  label,
  hiddenLabel = false,
  value,
  options,
  onChange,
}: RadioGroupProps) => {
  const lastOptionIndex = options.length - 1;

  return (
    <HeadlessRadioGroup value={value} onChange={onChange}>
      <HeadlessRadioGroup.Label
        className={clsx("block font-medium text-gray-700", {
          "sr-only": hiddenLabel,
        })}
      >
        {label}
      </HeadlessRadioGroup.Label>

      <div className="mt-1 relative z-0 inline-flex">
        {options.map((option, index) => (
          <HeadlessRadioGroup.Option
            key={option.label}
            value={option.value}
            className={({ active, checked }) =>
              clsx(
                "inline-flex items-center py-3 px-3",
                "text-sm font-medium uppercase",
                "focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500",
                "bg-white hover:bg-gray-50 border shadow-sm",
                index === 0 && "rounded-tl-md rounded-bl-md",
                index === lastOptionIndex && "rounded-tr-md rounded-br-md",
                active ? "z-10 " : "",
                checked
                  ? " border-indigo-500 text-indigo-600"
                  : " border-gray-300 text-gray-900",
                option.disabled
                  ? "opacity-25 cursor-not-allowed"
                  : "cursor-pointer"
              )
            }
            disabled={option.disabled}
          >
            <HeadlessRadioGroup.Label as="p">
              {option.label}
            </HeadlessRadioGroup.Label>
            {option.icon && (
              <Icon
                path={option.icon}
                size={0.8}
                aria-hidden="true"
                className="ml-1"
              />
            )}
          </HeadlessRadioGroup.Option>
        ))}
      </div>
    </HeadlessRadioGroup>
  );
};
