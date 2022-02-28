import { useParams } from "react-router-dom";
import { ContentLayout } from "components/Layout";
import { useCallback } from "react";
import { useChat, createDisplayNameFromChat, createChatBadgesArray } from "..";
import { Spinner } from "components/Elements";
import { Badge } from "components/Elements/Badge";
import { ReactNode } from "react";
import { formatNumber } from "utils/formatNumber";
import { ReactECharts, ReactEChartsProps } from "components/Elements/ECharts";
import { ChatMetrics } from "types";
import { parseDate } from "lib/date";
import {
  SearchForm,
  UpdateFiltersOptions,
  useFilterStore,
} from "features/search";
import { MessageList } from "features/messages";

const Container = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <div className="bg-white shadow -mx-4 sm:mx-0 sm:rounded-lg p-4 sm:p-6">
      <div className="text-gray-500 text-sm font-medium mb-1">{title}</div>
      {children}
    </div>
  );
};

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
      formatter: "{c} messages on {b}",
      position: function (pt) {
        return [pt[0], "10%"];
      },
    },
    // legend: {
    //   data: ["Owned", "Financed"],
    // },
    grid: {
      left: "5%",
      top: 30,
      right: "5%",
      // bottom: 30,
      // height: 30,
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
      // show: false,
    },
    yAxis: {
      type: "value",
      // show: false,
    },
    series: [
      {
        name: "Activity",
        type: "line",
        data: metric.data,
        smooth: true,
        connectNulls: true,
        zlevel: 1,
        // symbol: "none",
        // label: {
        //   show: true,
        // },
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
      formatter: "{c} new members on {b}",
      position: function (pt) {
        return [pt[0], "10%"];
      },
    },
    // legend: {
    //   data: ["Owned", "Financed"],
    // },
    grid: {
      left: "5%",
      top: 30,
      right: "5%",
      // bottom: 30,
      // height: 30,
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
      // show: false,
    },
    yAxis: {
      type: "value",
      // show: false,
    },
    series: [
      {
        name: "Growth",
        type: "line",
        data: metric.data,
        smooth: true,
        connectNulls: true,
        zlevel: 1,
        // symbol: "none",
        // label: {
        //   show: true,
        // },
      },
    ],
  };

  return <ReactECharts option={option} />;
};

const ChatMessages = ({ chatId }: { chatId: number }) => {
  const filterId = `chat-filter-${chatId}`;
  const filterKey = "messages";
  const createFilter = useFilterStore((state) => state.createFilter);
  createFilter({
    id: filterId,
    activeKey: filterKey,
    options: {
      messages: {
        "chat_ids[]": [chatId],
      },
    },
  });
  const setFilterOptions = useFilterStore((state) => state.setFilterOptions);
  const filterOptions = useFilterStore((state) =>
    state.getFilterOptions(filterId)
  );
  const updateFilters = useCallback(
    (options: UpdateFiltersOptions) => {
      setFilterOptions("search", options);
    },
    [setFilterOptions]
  );

  return (
    <div className="space-y-6">
      <SearchForm
        filterKey={filterKey}
        onFilterKeyChange={(key) => null}
        filterOptions={filterOptions}
        onFilterUpdate={updateFilters}
      />
      <MessageList queryParams={filterOptions.messages} />
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
          <div>Loading Chats…</div>
        </div>
      </ContentLayout>
    );
  }

  if (!chatQuery.data) return null;

  const chat = chatQuery.data;
  const badgesArray = createChatBadgesArray(chat);
  const messageCountLastDay = chat.metrics?.activity_last_day?.sum || 0;
  const messageCountTotal = chat.metrics?.activity_total?.sum || 0;
  const membersGrowthLastDay = chat.metrics?.growth_last_day?.sum || 0;
  const membersCountTotal = chat.members_count || 0;

  return (
    <ContentLayout title={createDisplayNameFromChat(chat)}>
      {badgesArray.length > 0 && (
        <div className="flex items-center space-x-2 whitespace-nowrap mt-1.5 lg:mt-0">
          {badgesArray.map(({ label, variant }) => (
            <Badge key={label} label={label} variant={variant} />
          ))}
        </div>
      )}

      <div className="mt-4 space-y-4 xl:space-y-0 xl:grid xl:grid-cols-2 xl:gap-4">
        {/* descriptions */}
        <Container title="Description">
          <div className="whitespace-pre-wrap">
            Wir geben jeder Patriotin und jedem Patrioten eine Stimme und werden
            sie oder ihn so gut wie möglich unterstützen. Wenn wir alle
            zusammenhalten, dann ist es bald geschafft. Gruppenregeln: /rules
            Probleme? @admin im Chat tippen.
          </div>
        </Container>

        {/* meta info */}
        <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4 xl:flex xl:items-start">
          {/* message count */}
          <Container title="Activity last 24h">
            <div className="text-3xl">
              {messageCountLastDay > 0 ? (
                <span className="text-green-600">
                  +{formatNumber(messageCountLastDay)}
                </span>
              ) : (
                0
              )}
            </div>
            <div className="text-sm text-gray-500">
              {formatNumber(messageCountTotal)} saved
            </div>
          </Container>

          {/* members count */}
          <Container title="Growth last 24h">
            <div className="text-3xl">
              {membersGrowthLastDay > 0 ? (
                <span className="text-green-600">
                  +{formatNumber(membersGrowthLastDay)}
                </span>
              ) : (
                0
              )}
            </div>
            <div className="text-sm text-gray-500">
              {formatNumber(membersCountTotal)} total
            </div>
          </Container>
        </div>

        {/* Activity graph */}
        <Container title="Activity">
          <div className="h-80">
            <ActivityChart metric={chat.metrics?.activity_total} />
          </div>
        </Container>

        {/* Growth graph */}
        <Container title="Growth">
          <div className="h-80">
            <GrowthChart metric={chat.metrics?.growth_total} />
          </div>
        </Container>
      </div>

      {/* Message */}
      <div className="mt-6">
        <h2 className="text-xl font-bold leading-7 sm:text-2xl mb-6">
          Messages
        </h2>
        <ChatMessages chatId={parseInt(chatId)} />
      </div>
    </ContentLayout>
  );
};
