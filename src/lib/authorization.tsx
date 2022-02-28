import * as React from "react";

// import { Account } from "features/accounts";

import { useAuth } from "./auth";

export enum ROLES {
  ADMIN = "ADMIN",
  USER = "USER",
}

type RoleTypes = keyof typeof ROLES;

export const POLICIES = {
  /**
   * Use like this:
   * <Authorization policyCheck={POLICIES['comment:delete'](user as User, comment)}> ... </Authorization>
   */
  // 'comment:delete': (user: Account, comment: Comment) => {
  //   if (user.role === 'ADMIN') {
  //     return true;
  //   }
  //   if (user.role === 'USER' && comment.authorId === user.id) {
  //     return true;
  //   }
  //   return false;
  // },
};

export const useAuthorization = () => {
  const { user } = useAuth();

  if (!user) {
    throw Error("User does not exist!");
  }

  const checkAccess = React.useCallback(
    ({ allowedRoles }: { allowedRoles: RoleTypes[] }) => {
      if (allowedRoles && allowedRoles.length > 0) {
        // return allowedRoles?.includes(user.role);

        // TODO: better role management
        if (allowedRoles?.includes(ROLES.ADMIN) && user.is_superuser === true) {
          return true;
        } else if (allowedRoles?.includes(ROLES.USER)) {
          return true;
        }
        return false;
      }

      return true;
    },
    [user.is_superuser]
  );

  return { checkAccess };
};

type AuthorizationProps = {
  forbiddenFallback?: React.ReactNode;
  children: React.ReactNode;
} & (
  | {
      allowedRoles: RoleTypes[];
      policyCheck?: never;
    }
  | {
      allowedRoles?: never;
      policyCheck: boolean;
    }
);

export const Authorization = ({
  policyCheck,
  allowedRoles,
  forbiddenFallback = null,
  children,
}: AuthorizationProps) => {
  const { checkAccess } = useAuthorization();

  let canAccess = false;

  if (allowedRoles) {
    canAccess = checkAccess({ allowedRoles });
  }

  if (typeof policyCheck !== "undefined") {
    canAccess = policyCheck;
  }

  return <>{canAccess ? children : forbiddenFallback}</>;
};
