import { GetChatsParams, GetMessagesParams, GetUsersParams } from "types";

export type FilterKeys = "chats" | "messages" | "users";

export type FilterValues<T> = T extends "chats"
  ? GetChatsParams
  : T extends "messages"
  ? GetMessagesParams
  : T extends "users"
  ? GetUsersParams
  : never;

export type UpdateFiltersOptions =
  | { key: "chats"; params: GetChatsParams | undefined }
  | { key: "messages"; params: GetMessagesParams | undefined }
  | { key: "users"; params: GetUsersParams | undefined };

export type SearchFormInputs = {
  chats: GetChatsParams;
  messages: GetMessagesParams & {
    from_user_ids?: { value: number | undefined }[]; // react-hook-form doesn't support flat arrays
    chat_ids?: { value: number | undefined }[]; // react-hook-form doesn't support flat arrays
  };
  users: GetUsersParams;
};
