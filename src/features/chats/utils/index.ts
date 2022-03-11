import { BadgeProps } from "components/Elements";
import { startCase } from "lodash";
import { Chat } from "types";

const availableFlags = ["is_verified", "is_restricted", "is_scam", "is_fake"];

export const createChatBadgesArray = (chat: Chat) => {
  const result: BadgeProps[] = [];

  if (chat.type) {
    result.push({ label: startCase(chat.type), variant: "gray" });
  }

  (Object.keys(chat) as Array<keyof Chat>).forEach((key) => {
    if (chat[key] === true && availableFlags.includes(key)) {
      result.push({
        label: startCase(key.replace("is_", "")),
        variant: "orange",
      });
    }
  });

  if (chat.language_other) {
    chat.language_other.forEach((key) => {
      result.push({ label: key.toUpperCase(), variant: "blue" });
    });
  }

  if (chat.language) {
    result.push({ label: chat.language.toUpperCase(), variant: "blue" });
  }

  return result;
};
