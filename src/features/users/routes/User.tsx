import { useParams } from "react-router-dom";
import { ContentLayout } from "components/Layout";
import { useCallback } from "react";
import { useUser, createUserBadgesArray, createDisplayNameFromUser } from "..";
import { Box, Button, Spinner } from "components/Elements";
import { Badge, ReactECharts, ReactEChartsProps } from "components/Elements";
import { formatNumber } from "utils/formatNumber";
import { UserMetrics } from "types";
import {
  SearchForm,
  UpdateFiltersOptions,
  useFilterStore,
} from "features/search";
import { MessageList } from "features/messages";
import { mdiOpenInNew } from "@mdi/js";
import { FormattedMetricNumber } from "components/Elements/FormattedMetricNumber";

const ActivityChart = ({
  metric,
}: {
  metric: UserMetrics["activity_total"];
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

const UserMessages = ({ userId }: { userId: number }) => {
  const filterId = `user-filter-${userId}`;
  const filterKey = "messages";
  const createFilter = useFilterStore((state) => state.createFilter);
  const filters = useFilterStore((state) => state.filters);

  if (typeof filters[filterId] === "undefined") {
    createFilter({
      id: filterId,
      activeKey: filterKey,
      options: {
        messages: {
          from_user_ids: [userId],
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

export const User = () => {
  let { userId } = useParams() as { userId: string };
  const userQuery = useUser({ userId });

  if (userQuery.isLoading) {
    return (
      <ContentLayout>
        <div className="flex items-center text-gray-600">
          <Spinner size="sm" className="mr-2" />
          <div>Loading User…</div>
        </div>
      </ContentLayout>
    );
  }

  if (!userQuery.data) return null;

  const user = userQuery.data;
  const badgesArray = createUserBadgesArray(user);
  const messageCountLastDay = user.metrics?.activity_last_day?.sum || 0;
  const messageCountTotal = user.metrics?.activity_total?.sum || 0;

  return (
    <ContentLayout title={createDisplayNameFromUser(user)}>
      {badgesArray && (
        <div className="flex items-center space-x-2 whitespace-nowrap mt-1.5 lg:mt-0">
          {user.username && (
            <Button
              variant="secondary"
              size="xs"
              startIcon={mdiOpenInNew}
              href={"https://t.me/" + user.username}
              target="_blank"
            >
              @{user.username}
            </Button>
          )}
          {badgesArray.map(({ label, variant }) => (
            <Badge key={label} label={label} variant={variant} />
          ))}
        </div>
      )}

      <div className="mt-4 space-y-4 xl:space-y-0 xl:grid xl:grid-cols-2 xl:gap-4">
        <Box title="Activity">
          <div className="h-80">
            <ActivityChart metric={user.metrics?.activity_total} />
          </div>
        </Box>

        <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4 xl:flex xl:items-start">
          {/* message count */}
          <Box title="Activity last 24h">
            <div className="text-3xl">
              <FormattedMetricNumber value={messageCountLastDay} />
            </div>
            <div className="text-sm text-gray-500">
              {formatNumber(messageCountTotal)} saved
            </div>
          </Box>
        </div>
      </div>

      {/* Messages */}
      <div className="mt-8">
        <h2 className="text-xl font-bold leading-7 sm:text-2xl mb-6">
          Messages
        </h2>
        <UserMessages userId={parseInt(userId)} />
      </div>
    </ContentLayout>
  );
};
