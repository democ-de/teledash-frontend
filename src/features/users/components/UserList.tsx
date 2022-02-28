import { Button, Spinner } from "components/Elements";
import { Badge, BadgeProps } from "components/Elements/Badge";
import { UserLink } from "features/users";
import { startCase } from "lodash";
import { Fragment } from "react";
import { GetUsersParams, User } from "types";
import { useUsers } from "..";

const availableFlags = [
  "is_deleted",
  "is_bot",
  "is_verified",
  "is_restricted",
  "is_scam",
  "is_fake",
  "is_support",
];

const UserListItem = (props: User) => {
  const propKeys = Object.keys(props) as Array<keyof typeof props>;
  const badges: BadgeProps[] = propKeys
    .filter((key) => availableFlags.includes(key) && props[key] === true)
    .map((flag) => ({ label: flag.replace("is_", ""), variant: "orange" }));

  return (
    <li>
      <div className="px-4 py-4 sm:px-6 flex items-center ">
        <div className="flex flex-col w-full space-y-1.5 lg:space-y-0 lg:grid lg:gap-4 xl:gap-6 lg:grid-cols-8">
          <div className="lg:col-span-5 xl:lg:col-span-6 lg:flex lg:items-center lg:space-x-2">
            <div>
              <UserLink user={props} className="truncate font-medium" />
            </div>
            {badges.length > 0 && (
              <div className="flex items-center space-x-2 whitespace-nowrap mt-1.5 lg:mt-0">
                {badges.map(({ label, variant }) => (
                  <Badge
                    key={label}
                    label={startCase(label)}
                    variant={variant}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center lg:col-span-2 xl:lg:col-span-1">
            {/* {props.members_count && (
              <div
                className="flex items-center space-x-1"
                title={`${props.members_count} members`}
              >
                <Icon
                  path={mdiAccountMultiple}
                  size={1}
                  className="text-gray-500"
                />
                <span className="font-medium">
                  {new Intl.NumberFormat("en-US").format(props.members_count)}
                </span>
              </div>
            )} */}
          </div>
          <div className="flex items-center justify-end">
            {/* <Button size="xs" startIcon={mdiPin} variant="secondary">
              Pin
            </Button> */}
            {/* <button
              type="button"
              className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Icon path={mdiPin} size={0.6} />
            </button> */}
          </div>
        </div>
      </div>
    </li>
  );
};

const defaultQueryParams: GetUsersParams = {
  limit: 50,
  projection: JSON.stringify({
    is_self: 0,
    is_contact: 0,
    is_mutual_contact: 0,
    status: 0,
    last_online_date: 0,
    next_offline_date: 0,
    language_code: 0,
    dc_id: 0,
    photo: 0,
    updated_at: 0,
    scraped_by: 0,
  }),
};

export const UserList = ({ queryParams }: { queryParams?: GetUsersParams }) => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useUsers({
    params: { ...defaultQueryParams, ...queryParams },
  });
  const hasResults = data && data.pages[0].data.length > 0;

  return (
    <>
      {status === "loading" ? (
        <div className="flex items-center text-gray-600">
          <Spinner size="sm" className="mr-2" />
          <div>Loading Users…</div>
        </div>
      ) : status === "error" ? (
        <div className="text-red-500">Error: {error?.message}</div>
      ) : hasResults ? (
        <div className="bg-white shadow -mx-4 sm:mx-0 sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {data?.pages.map((page, index) => (
              <Fragment key={index}>
                {page.data.map((user) => (
                  <UserListItem key={user._id} {...user} />
                ))}
              </Fragment>
            ))}
          </ul>

          {/* load more button */}
          {hasNextPage && (
            <div className="flex justify-center px-4 py-4 sm:px-6 bg-gray-50 sm:rounded-b-lg">
              <Button
                variant="secondary"
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
                size="sm"
                isLoading={isFetchingNextPage}
              >
                {isFetchingNextPage
                  ? "Loading more…"
                  : hasNextPage
                  ? "Load More"
                  : "Nothing more to load"}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div>Nothing found</div>
      )}
    </>
  );
};

/*

_id?: number;
username?: string;
first_name?: string;
last_name?: string;
is_deleted?: boolean;
is_bot?: boolean;
is_verified?: boolean;
is_restricted?: boolean;
is_scam?: boolean;
is_fake?: boolean;
is_support?: boolean;
phone_number?: string;
restrictions?: { [key: string]: unknown }[];

is_self?: boolean;
is_contact?: boolean;
is_mutual_contact?: boolean;
status?: string;
last_online_date?: string;
next_offline_date?: string;
language_code?: string;
dc_id?: number;
photo?: { [key: string]: unknown };
updated_at?: string;
scraped_by?: string;
*/
