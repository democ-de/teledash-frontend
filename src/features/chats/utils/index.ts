import { BadgeProps } from "components/Elements/Badge";
import { startCase } from "lodash";
import { Chat } from "types";

const availableFlags = ["is_verified", "is_restricted", "is_scam", "is_fake"];

export const createChatBadgesArray = (chat: Chat) => {
  const propKeys = Object.keys(chat) as Array<keyof Chat>;
  const badges: BadgeProps[] = propKeys
    .filter((key) => availableFlags.includes(key) && chat[key] === true)
    .map((flag) => ({
      label: startCase(flag.replace("is_", "")),
      variant: "orange",
    }));

  if (chat.type) {
    badges.unshift({ label: startCase(chat.type), variant: "gray" });
  }

  return badges;
};
