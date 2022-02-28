import { useInfiniteQuery } from "react-query";
import { axios } from "lib/axios";
import { InfiniteQueryConfig } from "lib/react-query";
import { GetUsersParams, GetUsersResponse } from "types";

export const getUsers = (
  params: GetUsersParams = {}
): Promise<GetUsersResponse> => {
  return axios.get("/users", { params });
};

type UseUsersOptions = {
  params?: GetUsersParams;
  config?: InfiniteQueryConfig<typeof getUsers>;
};

export const useUsers = ({ params, config }: UseUsersOptions) => {
  return useInfiniteQuery({
    queryKey: ["users", params],
    queryFn: ({ pageParam }) => getUsers({ ...params, ...pageParam }),
    getNextPageParam: (lastPage, pages) => {
      if (
        !lastPage.data.length ||
        lastPage.data.length < lastPage.pagination.limit
      ) {
        return undefined;
      }

      const { offset, limit } = lastPage.pagination;
      return { skip: offset + limit, limit };
    },
    ...config,
  });
};
