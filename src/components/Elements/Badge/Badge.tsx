import clsx from "clsx";

const variants = {
  indigo: "bg-indigo-100 text-indigo-800",
  orange: "bg-orange-200 text-orange-800",
  gray: "bg-gray-200 text-gray-800",
  red: "bg-red-100 text-red-800",
  yellow: "bg-yellow-100 text-yellow-800",
  green: "bg-green-100 text-green-800",
  blue: "bg-blue-100 text-blue-800",
  purple: "bg-purple-100 text-purple-800",
  pink: "bg-pink-100 text-pink-800",
};

const variantsBorder = {
  indigo: "border border-indigo-300",
  orange: "border border-orange-300",
  gray: "border border-gray-300",
  red: "border border-red-300",
  yellow: "border border-yellow-300",
  green: "border border-green-300",
  blue: "border border-blue-300",
  purple: "border border-purple-300",
  pink: "border border-pink-300",
};

const closeButtonVariants = {
  indigo:
    "text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:bg-indigo-500 focus:text-white",
  orange:
    "text-orange-400 hover:bg-orange-200 hover:text-orange-500 focus:bg-orange-500 focus:text-white",
  gray: "text-gray-400 hover:bg-gray-200 hover:text-gray-500 focus:bg-gray-500 focus:text-white",
  red: "text-red-400 hover:bg-red-200 hover:text-red-500 focus:bg-red-500 focus:text-white",
  yellow:
    "text-yellow-400 hover:bg-yellow-200 hover:text-yellow-500 focus:bg-yellow-500 focus:text-white",
  green:
    "text-green-400 hover:bg-green-200 hover:text-green-500 focus:bg-green-500 focus:text-white",
  blue: "text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:bg-blue-500 focus:text-white",
  purple:
    "text-purple-400 hover:bg-purple-200 hover:text-purple-500 focus:bg-purple-500 focus:text-white",
  pink: "text-pink-400 hover:bg-pink-200 hover:text-pink-500 focus:bg-pink-500 focus:text-white",
};

const closeButtonSizes = {
  sm: "h-4 w-4 ml-0.5 -mr-1",
  md: "h-4 w-4 ml-0.5 -mr-1.5",
  lg: "h-6 w-6 ml-1 -mr-2.5",
};
const closeButtonIconSizes = {
  sm: "h-2 w-2",
  md: "h-2 w-2",
  lg: "h-2.5 w-2.5",
};

const sizes = {
  sm: "px-2.5 py-0.5 text-xs",
  md: "px-3 py-0.5 text-sm",
  lg: "px-5 py-2 text-base",
};

export type BadgeProps = {
  label: string;
  size?: keyof typeof sizes;
  variant?: keyof typeof variants;
  hasBorder?: boolean;
  onClose?: () => void;
  className?: string;
};

export const Badge = ({
  label,
  size = "sm",
  variant = "orange",
  hasBorder = false,
  onClose,
  className,
}: BadgeProps) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center font-medium rounded-full",
        sizes[size],
        variants[variant],
        { [variantsBorder[variant]]: hasBorder },
        className
      )}
    >
      {label}
      {onClose && (
        <button
          type="button"
          className={clsx(
            "flex-shrink-0 rounded-full inline-flex items-center justify-center focus:outline-none",
            closeButtonVariants[variant],
            closeButtonSizes[size]
          )}
          onClick={onClose}
        >
          <span className="sr-only">Remove</span>
          <svg
            className={closeButtonIconSizes[size]}
            stroke="currentColor"
            fill="none"
            viewBox="0 0 8 8"
          >
            <path
              strokeLinecap="round"
              strokeWidth="1.5"
              d="M1 1l6 6m0-6L1 7"
            />
          </svg>
        </button>
      )}
    </span>
  );
};
