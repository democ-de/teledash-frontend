import clsx from "clsx";
import { User, UserRef } from "types";
import { TooltipLink } from "components/Elements";

const stringHasLetters = (text: string) => /\p{Letter}/gu.test(text);

export const createDisplayNameFromUser = (user: UserRef | User) => {
  const result = [];

  if (user.first_name && stringHasLetters(user.first_name)) {
    result.push(user.first_name);
  }

  if (user.last_name && stringHasLetters(user.last_name)) {
    result.push(user.last_name);
  }

  if (result.length) {
    return result.join(" ");
  }

  if (user.username && stringHasLetters(user.username)) {
    return user.username;
  }

  return user._id?.toString() || "Unknown";
};

type UserLinkProps = {
  user: User | UserRef;
  className?: string;
  link?: string;
};

export const UserLink = ({ user, className, link }: UserLinkProps) => {
  const displayName = createDisplayNameFromUser(user);

  return (
    <TooltipLink
      tippyProps={{
        content: (
          <div>
            <div>ID: {user._id}</div>
          </div>
        ),
        interactive: true,
      }}
      className={clsx("hover:underline", className)}
      to={typeof link === "string" ? link : `/user/${user._id}`}
    >
      {displayName}
    </TooltipLink>
  );
};
