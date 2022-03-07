import { ReactNode } from "react";

export const Box = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <div className="bg-white shadow -mx-4 sm:mx-0 sm:rounded-lg p-4 sm:p-6">
      <div className="text-gray-500 text-sm font-medium mb-1">{title}</div>
      {children}
    </div>
  );
};
