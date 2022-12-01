import * as API from "./api";

export type GetChatsParams = API.paths["/chats"]["get"]["parameters"]["query"];
export type GetChatsResponse =
  API.paths["/chats"]["get"]["responses"]["200"]["content"]["application/json"];
export type Chat = API.components["schemas"]["ChatOut"];
export type ChatRef = API.components["schemas"]["ChatRef"];
export type ChatMetrics = API.components["schemas"]["ChatMetrics"];

export type GetMessagesParams =
  API.paths["/messages"]["get"]["parameters"]["query"];
export type GetMessagesResponse =
  API.paths["/messages"]["get"]["responses"]["200"]["content"]["application/json"];
export type Message = API.components["schemas"]["MessageOut"];
export type MessageForward = API.components["schemas"]["MessageForward"];
export type MessageRef = API.components["schemas"]["MessageRef"];
export type MessageAttachment = API.components["schemas"]["MessageAttachment"];
export type MessageAttachmentType =
  API.components["schemas"]["MessageAttachmentType"];
export type MessageAttachmentStorageRef =
  API.components["schemas"]["MessageAttachmentStorageRef"];
export type MessageEntity = API.components["schemas"]["MessageEntity"];

export type GetUsersParams = API.paths["/users"]["get"]["parameters"]["query"];
export type GetUsersResponse =
  API.paths["/users"]["get"]["responses"]["200"]["content"]["application/json"];
export type User = API.components["schemas"]["UserOut"];
export type UserRef = API.components["schemas"]["UserRef"];
export type UserMetrics = API.components["schemas"]["UserMetrics"];
