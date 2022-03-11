import axios, { AxiosError } from "axios";
import {
  QueryClient,
  UseQueryOptions,
  UseMutationOptions,
  DefaultOptions,
  UseInfiniteQueryOptions,
} from "react-query";
import { PromiseValue } from "type-fest";

const queryConfig: DefaultOptions = {
  queries: {
    // don't catch 404 errors with error boundaries
    useErrorBoundary: (error) =>
      axios.isAxiosError(error) &&
      error.response &&
      error.response.status === 404
        ? false
        : true,
    refetchOnWindowFocus: false,
    retry: false,
  },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });

export type ExtractFnReturnType<FnType extends (...args: any) => any> =
  PromiseValue<ReturnType<FnType>>;

export type QueryConfig<QueryFnType extends (...args: any) => any> = Omit<
  UseQueryOptions<ExtractFnReturnType<QueryFnType>>,
  "queryKey" | "queryFn"
>;

export type InfiniteQueryConfig<FetcherFnType extends (...args: any) => any> =
  UseInfiniteQueryOptions<PromiseValue<ReturnType<FetcherFnType>>, AxiosError>;

export type MutationConfig<MutationFnType extends (...args: any) => any> =
  UseMutationOptions<
    ExtractFnReturnType<MutationFnType>,
    AxiosError,
    Parameters<MutationFnType>[0]
  >;
