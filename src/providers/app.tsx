import * as React from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { HelmetProvider } from "react-helmet-async";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom"; // see: https://github.com/remix-run/react-router/issues/8264#issuecomment-991271554

import history from "lib/history";
import { Button, Spinner } from "components/Elements";
import { Notifications } from "components/Notifications/Notifications";
import { AuthProvider } from "lib/auth";
import { queryClient } from "lib/react-query";

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  // Handle in app errors that happen in the React tree
  // see: https://github.com/alan2207/bulletproof-react/blob/master/docs/error-handling.md#in-app-errors
  return (
    <div
      className="w-screen h-screen flex flex-col justify-center items-center"
      role="alert"
    >
      <div className="text-red-500 text-sm font-semibold uppercase tracking-wide">
        {error.message}
      </div>
      <div className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
        Something went wrong.
      </div>
      <div className="mt-2 text-base text-gray-500 max-w-prose">
        Refresh this page and try again. If the problem persists, contact the
        administrator.
      </div>
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 max-w-4xl max-h-96 overflow-y-scroll font-mono text-sm whitespace-pre-wrap bg-gray-100">
          {JSON.stringify(error, null, 2)}
        </div>
      )}
      <Button
        className="mt-6"
        onClick={() => window.location.assign(window.location.origin)}
      >
        Refresh
      </Button>
    </div>
  );
};

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center w-screen h-screen">
          <Spinner size="xl" />
        </div>
      }
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            {process.env.NODE_ENV !== "test" && <ReactQueryDevtools />}
            <Notifications />
            <AuthProvider>
              <HistoryRouter history={history}>{children}</HistoryRouter>
            </AuthProvider>
          </QueryClientProvider>
        </HelmetProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
};
