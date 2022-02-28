import { useInfiniteQuery } from "react-query";
import { axios } from "lib/axios";
import { InfiniteQueryConfig } from "lib/react-query";
import { GetChatsParams, GetChatsResponse } from "types";

export const getChats = (
  params: GetChatsParams = {}
): Promise<GetChatsResponse> => {
  return axios.get("/chats", { params });
};

type UseChatsOptions = {
  params?: GetChatsParams;
  config?: InfiniteQueryConfig<typeof getChats>;
};

export const useChats = ({ params, config }: UseChatsOptions) => {
  return useInfiniteQuery({
    queryKey: ["chats", params],
    queryFn: ({ pageParam }) => getChats({ ...params, ...pageParam }),
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
    ...config, // needs to be at the end
  });
};
