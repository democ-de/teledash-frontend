import { mdiPaperclip, mdiShare } from "@mdi/js";
import Icon from "@mdi/react";
import clsx from "clsx";
import { ChatLink } from "features/chats";
import { createDisplayNameFromUser, UserLink } from "features/users";
import { formatDate, formatDateDistance, parseDate } from "lib/date";
import { Message as MessageType } from "types";
import { Attachment } from ".";

export const Message = (props: MessageType) => {
  const messageText = props.text || props.caption;
  const reply = props.reply_to_message;
  const replyText = reply?.text || reply?.caption;
  const forward = props.forward;
  let forwardName;
  let fromUserOrChat;

  if (forward) {
    if (forward.sender_name) {
      // sender_name (str, optional) – For messages forwarded from users who have hidden their accounts, name of the user.
      forwardName = forward.sender_name;
    } else if (forward.from_chat) {
      forwardName = <ChatLink chat={forward.from_chat} />;
    } else if (forward.from_user) {
      forwardName = <UserLink user={forward.from_user} />;
    }
  }

  if (props.from_user) {
    fromUserOrChat = <UserLink user={props.from_user} />;
  } else if (props.sender_chat) {
    fromUserOrChat = <ChatLink chat={props.sender_chat} />;
  }

  return (
    <div className="flex flex-col max-w-prose p-4">
      {/* forward info */}
      {forwardName && (
        <div className="flex items-center text-xs sm:text-sm pl-2">
          <Icon path={mdiShare} size={0.8} className="text-gray-500" />
          <span className="text-gray-500 mr-1 whitespace-nowrap">
            Forwarded from
          </span>
          <span className="font-medium whitespace-nowrap truncate">
            {forwardName}
          </span>
        </div>
      )}

      {/* Username & Chat info */}
      <div className="flex items-center text-xs sm:text-sm mb-1.5 pl-2">
        {fromUserOrChat && (
          <span className="font-medium whitespace-nowrap">
            {fromUserOrChat}
          </span>
        )}
        {props.chat && (
          <>
            <span className={clsx("text-gray-500 mx-1")}>in</span>
            <span className="font-medium truncate">
              <ChatLink chat={props.chat} />
            </span>
          </>
        )}
      </div>

      {/* Message container */}
      <div className="p-2 rounded-tl rounded-r-2xl rounded-bl-2xl border border-gray-200">
        {/* Reply */}
        {reply && (
          <div className="flex justify-between mb-2 py-2 px-3 sm:py-3 text-xs sm:text-sm bg-gray-100 rounded-tl rounded-tr-xl rounded-b border-l-[3px] border-gray-300">
            <div className="min-w-0 flex flex-col justify-center">
              {reply.user && (
                <div className="font-medium">
                  {createDisplayNameFromUser(reply.user)}
                </div>
              )}
              <div className="line-clamp-2">
                {replyText ? (
                  replyText
                ) : reply.has_attachment ? (
                  <i>Attachment</i>
                ) : (
                  <i>No content</i>
                )}
              </div>
            </div>
            {reply.has_attachment && (
              <div className="flex items-center ml-2 -my-2 -mr-3 sm:-my-3 p-3 rounded-tr-xl rounded-br bg-gray-200">
                <Icon path={mdiPaperclip} size={1} />
              </div>
            )}
          </div>
        )}

        {/* Attachment */}
        {props.attachment && <Attachment {...props} />}

        {messageText && (
          <div className="px-1 whitespace-pre-wrap truncate text-sm sm:text-base">
            {messageText}
          </div>
        )}

        {/* Date */}
        {(props.date || props.edit_date) && (
          <div className="flex pr-1 justify-end text-gray-500 text-xs sm:text-sm">
            <span title={props.date && formatDate(parseDate(props.date))}>
              {props.edit_date
                ? "Edited: " + formatDateDistance(parseDate(props.edit_date))
                : props.date && formatDateDistance(parseDate(props.date))}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

/**
_id
from_user
chat
date
forward
reply_to_message
edit_date
text
caption

attachment
is_empty
views
service_info
entities
caption_entities

is_outgoing
scraped_by
mentioned
author_signature
sender_chat
message_id
updated_at
language
 */
