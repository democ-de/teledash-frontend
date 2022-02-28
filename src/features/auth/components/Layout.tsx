import * as React from "react";

import { Link } from "components/Elements";
import { Head } from "components/Head";
import { APP_NAME } from "config";

type LayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const Layout = ({ children, title }: LayoutProps) => {
  return (
    <>
      <Head title={title} />
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center pb-16 px-4">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Link to="/">{APP_NAME}</Link>
          </div>
          <h2 className="mt-3 text-center text-3xl font-extrabold ">{title}</h2>
          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};
