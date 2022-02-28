import * as React from "react";
import clsx from "clsx";
import Icon from "@mdi/react";

import { Spinner } from "components/Elements/Spinner";

const variants = {
  primary:
    "text-white border-transparent bg-indigo-600 shadow-md shadow-indigo-500/20 hover:bg-indigo-700 focus:ring-indigo-500",
  secondary:
    "text-gray-700 border-gray-300 bg-white shadow-sm hover:bg-gray-50 focus:ring-indigo-500",
  secondaryActive:
    "text-indigo-600 border-gray-300 bg-white shadow-sm hover:bg-gray-50 focus:ring-indigo-500",
  danger:
    "bg-red-600 text-white border-transparent hover:bg-red-50:text-red-600",
};

const sizes = {
  xs: "px-2.5 py-1.5 text-xs",
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-base",
  lg: "px-6 py-3 text-base",
};

type IconProps =
  | { startIcon: string; endIcon?: never }
  | { endIcon: string; startIcon?: never }
  | { endIcon?: undefined; startIcon?: undefined };

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  isLoading?: boolean;
} & IconProps;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = "button",
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      startIcon,
      endIcon,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={clsx(
          "inline-flex items-center justify-center font-medium rounded-md",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "border",
          "disabled:opacity-70 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Spinner size="sm" className="text-current" />}
        {!isLoading && startIcon && (
          <Icon path={startIcon} size={0.9} aria-hidden="true" />
        )}
        <span className="mx-2">{props.children}</span>{" "}
        {!isLoading && endIcon && (
          <Icon path={endIcon} size={0.9} aria-hidden="true" />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
