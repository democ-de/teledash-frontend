import clsx from "clsx";
import { TooltipLink } from "components/Elements";
import { Chat, ChatRef } from "types";

export const createDisplayNameFromChat = (chat: Chat | ChatRef) =>
  chat.username || chat.title || chat._id?.toString();

type ChatLinkProps = {
  chat: Chat | ChatRef;
  className?: string;
  link?: string;
};

export const ChatLink = ({ chat, className, link }: ChatLinkProps) => {
  const displayName = createDisplayNameFromChat(chat);

  return (
    <TooltipLink
      tippyProps={{
        content: (
          <div>
            <div>ID: {chat._id}</div>
          </div>
        ),
        interactive: true,
      }}
      className={clsx("hover:underline", className)}
      to={typeof link === "string" ? link : `/chat/${chat._id}`}
    >
      {displayName}
    </TooltipLink>
  );
};
