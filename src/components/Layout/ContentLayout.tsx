import * as React from "react";

import { Head } from "../Head";

type ContentLayoutProps = {
  children: React.ReactNode;
  title?: string;
};

export const ContentLayout = ({ children, title }: ContentLayoutProps) => {
  return (
    <>
      <Head title={title} />
      <div className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {title && (
            <h1 className="text-2xl font-bold leading-7 sm:text-3xl sm:truncate mb-6">
              {title}
            </h1>
          )}
          <div>{children}</div>
        </div>
      </div>
    </>
  );
};
