import { BadgeProps } from "components/Elements";
import { startCase } from "lodash";
import { User } from "types";

const availableFlags = [
  "is_deleted",
  "is_bot",
  "is_verified",
  "is_restricted",
  "is_scam",
  "is_fake",
  "is_support",
];

export const createUserBadgesArray = (user: User) => {
  const result: BadgeProps[] = [];

  (Object.keys(user) as Array<keyof User>).forEach((key) => {
    if (user[key] === true && availableFlags.includes(key)) {
      result.push({
        label: startCase(key.replace("is_", "")),
        variant: "orange",
      });
    }
  });

  if (user.is_bot !== true) {
    result.push({ label: "User", variant: "gray" });
  }

  return result;
};
