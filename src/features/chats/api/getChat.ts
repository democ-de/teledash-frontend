import { useQuery } from "react-query";
import { axios } from "lib/axios";
import { ExtractFnReturnType, QueryConfig } from "lib/react-query";
import { Chat } from "types";

export const getChat = ({ chatId }: { chatId: string }): Promise<Chat> => {
  return axios.get(`/chats/${chatId}`);
};

type QueryFnType = typeof getChat;

type UseChatOptions = {
  chatId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useChat = ({ chatId, config }: UseChatOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["chat", chatId],
    queryFn: () => getChat({ chatId }),
  });
};
