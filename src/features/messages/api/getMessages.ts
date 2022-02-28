import { useInfiniteQuery } from "react-query";
import { axios } from "lib/axios";
import { InfiniteQueryConfig } from "lib/react-query";
import { GetMessagesParams, GetMessagesResponse } from "types";

export const getMessages = (
  params: GetMessagesParams = {}
): Promise<GetMessagesResponse> => {
  return axios.get("/messages", { params });
};

type UseMessagesOptions = {
  params?: GetMessagesParams;
  config?: InfiniteQueryConfig<typeof getMessages>;
};

export const useMessages = ({ params, config }: UseMessagesOptions) => {
  return useInfiniteQuery({
    queryKey: ["messages", params],
    queryFn: ({ pageParam }) => getMessages({ ...params, ...pageParam }),
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
