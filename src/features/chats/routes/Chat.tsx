import { useParams } from "react-router-dom";
import { ContentLayout } from "components/Layout";
import { useCallback } from "react";
import { useChat, createDisplayNameFromChat, createChatBadgesArray } from "..";
import {
  Box,
  Button,
  Spinner,
  Badge,
  ReactECharts,
  ReactEChartsProps,
  TooltipLink,
} from "components/Elements";
import { formatNumber } from "utils/formatNumber";
import { ChatMetrics } from "types";
import { parseDate } from "lib/date";
import {
  SearchForm,
  UpdateFiltersOptions,
  useFilterStore,
} from "features/search";
import { MessageList } from "features/messages";
import { mdiLink, mdiOpenInNew } from "@mdi/js";
import { FormattedMetricNumber } from "components/Elements/FormattedMetricNumber";

const ActivityChart = ({
  metric,
}: {
  metric: ChatMetrics["activity_total"];
}) => {
  if (!metric || !metric.start_date || !metric.data) return null;

  let base = +new Date(metric.start_date);
  let oneHour = 3600 * 1000;
  let date = [];

  for (let i = 0; i < metric.data.length; i++) {
    var now = new Date((base += oneHour));
    var time = now.getHours().toString().padStart(2, "0") + ":00";
    date.push(
      [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("/") +
        " " +
        time
    );
  }

  const option: ReactEChartsProps["option"] | undefined = {
    tooltip: {
      trigger: "axis",
      formatter: "{c} messages on {b}",
      position: function (pt) {
        return [pt[0], "10%"];
      },
    },
    grid: {
      left: 30,
      top: 30,
      right: 10,
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: "none",
        },
        restore: {},
        saveAsImage: {},
      },
    },
    dataZoom: [
      {
        type: "inside",
        start: 0,
        end: 100,
      },
      {
        start: 0,
        end: 100,
      },
    ],
    xAxis: {
      type: "category",
      data: date,
    },
    yAxis: {
      type: "value",
      minInterval: 1,
    },
    series: [
      {
        name: "Activity",
        type: "line",
        data: metric.data,
        smooth: true,
        connectNulls: true,
        zlevel: 1,
      },
    ],
  };

  return <ReactECharts option={option} />;
};

const GrowthChart = ({ metric }: { metric: ChatMetrics["growth_total"] }) => {
  if (!metric || !metric.start_date || !metric.data) return null;

  let base = +parseDate(metric.start_date);
  let oneHour = 3600 * 1000;
  let date = [];

  for (let i = 0; i < metric.data.length; i++) {
    var now = new Date((base += oneHour));
    var time = now.getHours().toString().padStart(2, "0") + ":00";
    date.push(
      [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("/") +
        " " +
        time
    );
  }

  const option: ReactEChartsProps["option"] | undefined = {
    tooltip: {
      trigger: "axis",
      formatter: "{c} users on {b}",
      position: function (pt) {
        return [pt[0], "10%"];
      },
    },
    grid: {
      left: 55,
      top: 30,
      right: 10,
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: "none",
        },
        restore: {},
        saveAsImage: {},
      },
    },
    dataZoom: [
      {
        type: "inside",
        start: 0,
        end: 100,
      },
      {
        start: 0,
        end: 100,
      },
    ],
    xAxis: {
      type: "category",
      data: date,
    },
    yAxis: {
      type: "value",
      minInterval: 1,
    },
    series: [
      {
        name: "Growth",
        type: "line",
        data: metric.data,
        smooth: true,
        connectNulls: true,
        zlevel: 1,
      },
    ],
  };

  return <ReactECharts option={option} />;
};

const ChatMessages = ({ chatId }: { chatId: number }) => {
  const filterId = `chat-filter-${chatId}`;
  const filterKey = "messages";
  const createFilter = useFilterStore((state) => state.createFilter);
  const filters = useFilterStore((state) => state.filters);

  if (typeof filters[filterId] === "undefined") {
    createFilter({
      id: filterId,
      activeKey: filterKey,
      options: {
        messages: {
          chat_ids: [chatId],
        },
      },
    });
  }

  const setFilterOptions = useFilterStore((state) => state.setFilterOptions);
  const messageFilterOptions = useFilterStore(
    (state) => state.getFilterOptions(filterId).messages
  );
  const updateFilters = useCallback(
    (options: UpdateFiltersOptions) => {
      setFilterOptions(filterId, options);
    },
    [filterId, setFilterOptions]
  );

  return (
    <div className="space-y-6">
      <SearchForm
        filterKey={filterKey}
        onFilterKeyChange={(key) => null}
        filterOptions={{ messages: messageFilterOptions }}
        onFilterUpdate={updateFilters}
      />
      <MessageList queryParams={messageFilterOptions} />
    </div>
  );
};

export const Chat = () => {
  let { chatId } = useParams() as { chatId: string };
  const chatQuery = useChat({ chatId });

  if (chatQuery.isLoading) {
    return (
      <ContentLayout>
        <div className="flex items-center text-gray-600">
          <Spinner size="sm" className="mr-2" />
          <div>Loading Chat…</div>
        </div>
      </ContentLayout>
    );
  }

  if (chatQuery.isError) {
    return (
      <ContentLayout title="Chat not found 😒">
        No data has been collected for the chat with the ID{" "}
        <strong>{chatId}</strong> yet.
      </ContentLayout>
    );
  }

  if (!chatQuery.data) return null;

  const chat = chatQuery.data;
  const badgesArray = createChatBadgesArray(chat);
  const messageCountLastDay = chat.metrics?.activity_last_day?.sum || 0;
  const messageCountTotal = chat.metrics?.activity_total?.sum || 0;
  const membersGrowthLastDay = chat.metrics?.growth_last_day?.diff || 0;
  const membersCountTotal = chat.members_count || 0;

  return (
    <ContentLayout title={createDisplayNameFromChat(chat)}>
      {badgesArray.length > 0 && (
        <div className="flex items-center flex-nowrap space-x-2 mt-1.5 lg:mt-0">
          {badgesArray.map(({ label, variant }) => (
            <Badge key={label} label={label} variant={variant} size="md" />
          ))}
        </div>
      )}
      {(chat.username || chat.linked_chat) && (
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:flex-nowrap sm:space-y-0 sm:space-x-2 mt-4">
          {chat.username && (
            <Button
              variant="secondary"
              size="sm"
              startIcon={mdiOpenInNew}
              href={"https://t.me/" + chat.username}
              rel="noopener noreferrer"
              target="_blank"
            >
              @{chat.username}
            </Button>
          )}
          {chat.linked_chat && (
            <Button
              variant="secondary"
              size="sm"
              startIcon={mdiLink}
              disabled
              to={"../chat/" + chat.linked_chat._id}
            >
              Linked Chat ({createDisplayNameFromChat(chat.linked_chat)})
            </Button>
          )}
        </div>
      )}

      <div className="mt-4 space-y-4 xl:space-y-0 xl:grid xl:grid-cols-2 xl:gap-4">
        {/* descriptions */}
        <Box title="Description">
          <div className="whitespace-pre-wrap">
            {chat.description ? (
              chat.description
            ) : (
              <span className="italic text-gray-500">No description</span>
            )}
          </div>
        </Box>

        {/* meta info */}
        <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4 xl:flex xl:items-start">
          {/* message count */}
          <Box title="Activity (last 24h)">
            <div className="text-3xl">
              <FormattedMetricNumber value={messageCountLastDay} />
            </div>
            <div className="text-sm text-gray-500">
              {formatNumber(messageCountTotal)} messages saved
            </div>
          </Box>

          {/* members count */}
          <Box title="Growth (last 24h)">
            <div className="text-3xl">
              <FormattedMetricNumber value={membersGrowthLastDay} />
            </div>
            <div className="text-sm text-gray-500">
              {formatNumber(membersCountTotal)} users total
            </div>
          </Box>
        </div>

        {/* Activity graph */}
        <Box title="Activity">
          <div className="h-80">
            <ActivityChart metric={chat.metrics?.activity_total} />
          </div>
        </Box>

        {/* Growth graph */}
        <Box title="Growth">
          <div className="h-80">
            <GrowthChart metric={chat.metrics?.growth_total} />
          </div>
        </Box>
      </div>

      {/* Messages */}
      <div className="mt-8">
        <h2 className="text-xl font-bold leading-7 sm:text-2xl mb-6">
          Messages
        </h2>
        <ChatMessages chatId={parseInt(chatId)} />
      </div>
    </ContentLayout>
  );
};
