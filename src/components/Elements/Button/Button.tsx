import * as React from "react";
import { Link, LinkProps } from "react-router-dom";
import clsx from "clsx";
import Icon from "@mdi/react";
import { Spinner } from "components/Elements";
import { NavLinkProps } from "react-router-dom";

// HOWTO conditional anchor or button tag: https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase/

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
  lg: "px-5 py-3 text-xl",
};

const iconSizes = {
  xs: 0.6,
  sm: 0.8,
  md: 0.9,
  lg: 1,
};

type IconProps =
  | { startIcon: string; endIcon?: never }
  | { endIcon: string; startIcon?: never }
  | { endIcon?: undefined; startIcon?: undefined };

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> &
  Partial<LinkProps> & {
    variant?: keyof typeof variants;
    size?: keyof typeof sizes;
    isLoading?: boolean;
  } & IconProps;

export const Button = React.forwardRef<
  HTMLButtonElement & HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      type = "button",
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      startIcon,
      endIcon,
      href,
      to,
      ...props
    },
    ref
  ) => {
    const content = (
      <>
        {isLoading && <Spinner size="sm" className="text-current" />}
        {!isLoading && startIcon && (
          <Icon
            path={startIcon}
            size={iconSizes[size]}
            aria-hidden="true"
            className="flex-shrink-0"
          />
        )}
        <span className="mx-2 truncate max-w-xs">{props.children}</span>
        {!isLoading && endIcon && (
          <Icon
            path={endIcon}
            size={iconSizes[size]}
            aria-hidden="true"
            className="flex-shrink-0"
          />
        )}
      </>
    );
    const classNames = clsx(
      "min-w-0 inline-flex items-center justify-center font-medium rounded-md",
      "focus:outline-none focus:ring-2 focus:ring-offset-2",
      "border",
      "disabled:opacity-70 disabled:cursor-not-allowed",
      variants[variant],
      sizes[size],
      className
    );

    if (href) {
      return (
        <a ref={ref} href={href} className={classNames} {...props}>
          {content}
        </a>
      );
    } else if (to) {
      return (
        <Link ref={ref} to={to} className={classNames} {...props}>
          {content}
        </Link>
      );
    } else {
      return (
        <button ref={ref} type={type} className={classNames} {...props}>
          {content}
        </button>
      );
    }
  }
);

Button.displayName = "Button";
