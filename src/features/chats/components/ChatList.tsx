import { mdiAccountMultiple } from "@mdi/js";
import Icon from "@mdi/react";
import { Button, Spinner } from "components/Elements";
import { Badge } from "components/Elements/Badge";
import { ReactECharts, ReactEChartsProps } from "components/Elements/ECharts";
import { useChats } from "features/chats";
import { Fragment } from "react";
import { GetChatsParams } from "types";
import { Chat } from "types";
import { formatNumber } from "utils/formatNumber";
import { ChatLink } from ".";
import { createChatBadgesArray } from "..";

const ChatListItem = (props: Chat) => {
  const badgesArray = createChatBadgesArray(props);
  const activityLastDay: ReactEChartsProps["option"] | undefined = props.metrics
    ?.activity_last_day && {
    // dataset: {
    //   source: [
    //     ["Commodity", "Owned", "Financed"],
    //     ["Commodity 1", 4, 1],
    //     ["Commodity 2", 2, 4],
    //     ["Commodity 3", 3, 6],
    //     ["Commodity 4", 5, 3],
    //   ],
    // },
    tooltip: {
      trigger: "axis",
      formatter: "{c} messages at {b}",
    },
    // legend: {
    //   data: ["Owned", "Financed"],
    // },
    grid: {
      left: 0,
      right: 0,
      top: 5,
      bottom: 5,
      height: 30,
    },
    xAxis: {
      type: "category",
      show: false,
    },
    yAxis: {
      type: "value",
      show: false,
    },
    series: [
      {
        name: "Activity last 24 hours",
        type: "line",
        data: props.metrics.activity_last_day.data,
        smooth: true,
        connectNulls: true,
        zlevel: 1,
        symbol: "none",
        // label: {
        //   show: true,
        // },
      },
    ],
  };

  return (
    <li>
      <div className="px-4 py-2 sm:px-6 flex items-center ">
        <div className="flex flex-col w-full space-y-1.5 lg:space-y-0 lg:grid lg:gap-4 xl:gap-6 lg:grid-cols-8">
          <div className="lg:col-span-4 lg:flex lg:items-center lg:space-x-2">
            <div className="truncate">
              <ChatLink chat={props} className="font-medium" />
            </div>
            {badgesArray.length > 0 && (
              <div className="flex items-center space-x-2 whitespace-nowrap mt-1.5 lg:mt-0">
                {badgesArray.map(({ label, variant }) => (
                  <Badge key={label} label={label} variant={variant} />
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end lg:col-span-1 h-[40px]">
            {activityLastDay && <ReactECharts option={activityLastDay} />}
          </div>

          <div className="flex items-center lg:col-span-2">
            {props.members_count && (
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
                  {formatNumber(props.members_count)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

const defaultQueryParams: GetChatsParams = {
  limit: 50,
  projection: JSON.stringify({
    permissions: 0,
    linked_chat: 0,
    members: 0,
    pinned_message: 0,
    invite_link: 0,
    photo: 0,
    language_other: 0,
  }),
};

export const ChatList = ({ queryParams }: { queryParams?: GetChatsParams }) => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useChats({
    params: { ...defaultQueryParams, ...queryParams },
  });
  const hasResults = data && data.pages[0].data.length > 0;

  return (
    <>
      {status === "loading" ? (
        <div className="flex items-center text-gray-600">
          <Spinner size="sm" className="mr-2" />
          <div>Loading Chats…</div>
        </div>
      ) : status === "error" ? (
        <div className="text-red-500">Error: {error?.message}</div>
      ) : hasResults ? (
        <div className="bg-white shadow -mx-4 sm:mx-0 sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {data?.pages.map((page, index) => (
              <Fragment key={index}>
                {page.data.map((chat) => (
                  <ChatListItem key={chat._id} {...chat} />
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

// _id?: number;
// title?: string;
// username?: string; (tooltip)
// type?: components["schemas"]["ChatType"]; (badge)
// language?: string;
// is_verified?: boolean; (flags)
// is_restricted?: boolean; (flags)
// is_scam?: boolean; (flags)
// is_fake?: boolean; (flags)
// description?: string;
// members_count?: number;
// restrictions?: { [key: string]: unknown }[];
// updated_at?: string;
// scraped_at?: string;
// scraped_by?: string;

// permissions?: { [key: string]: unknown };
// linked_chat?: components["schemas"]["ChatRef"];
// members?: components["schemas"]["UserRef"][];
// pinned_message?: components["schemas"]["MessageRef"];
// invite_link?: string;
// photo?: { [key: string]: unknown };
// language_other?: string[];
