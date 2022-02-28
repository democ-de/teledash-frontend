import { ContentLayout } from "components/Layout";
import { useCallback } from "react";
import { SearchForm } from "../components/SearchForm";
import { UpdateFiltersOptions } from "features/search";
import { startCase } from "lodash";
import { MessageList } from "features/messages";
import { ChatList } from "features/chats";
import { useFilterStore } from "../stores";
import { UserList } from "features/users";

export const Search = () => {
  const filterKey = useFilterStore((state) => state.getActiveKey("search"));
  const filterOptions = useFilterStore((state) =>
    state.getFilterOptions("search")
  );
  const setActiveKey = useFilterStore((state) => state.setActiveKey);
  const setFilterOptions = useFilterStore((state) => state.setFilterOptions);
  const updateFilters = useCallback(
    (options: UpdateFiltersOptions) => {
      setActiveKey("search", options.key);
      setFilterOptions("search", options);
    },
    [setActiveKey, setFilterOptions]
  );

  console.count("render");

  return (
    <ContentLayout title={"Search for " + startCase(filterKey)}>
      <div className="space-y-6">
        <SearchForm
          filterKey={filterKey}
          onFilterKeyChange={(key) => setActiveKey("search", key)}
          filterOptions={filterOptions}
          onFilterUpdate={updateFilters}
        />

        {filterKey === "chats" && (
          <ChatList queryParams={filterOptions.chats} />
        )}

        {filterKey === "messages" && (
          <MessageList queryParams={filterOptions.messages} />
        )}

        {filterKey === "users" && (
          <UserList queryParams={filterOptions.users} />
        )}
      </div>
    </ContentLayout>
  );
};
