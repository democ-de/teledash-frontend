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
  const propKeys = Object.keys(user) as Array<keyof typeof user>;
  const badges: BadgeProps[] = propKeys
    .filter((key) => availableFlags.includes(key) && user[key] === true)
    .map((flag) => ({
      label: startCase(flag.replace("is_", "")),
      variant: "orange",
    }));

  return badges;
};
