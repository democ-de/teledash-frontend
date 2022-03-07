import { useQuery } from "react-query";
import { axios } from "lib/axios";
import { ExtractFnReturnType, QueryConfig } from "lib/react-query";
import { User } from "types";

export const getUser = ({ userId }: { userId: string }): Promise<User> => {
  return axios.get(`/users/${userId}`);
};

type QueryFnType = typeof getUser;

type UseUserOptions = {
  userId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useUser = ({ userId, config }: UseUserOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["user", userId],
    queryFn: () => getUser({ userId }),
  });
};
