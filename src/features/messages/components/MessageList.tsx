import { Button, Spinner } from "components/Elements";
import { Fragment } from "react";
import { GetMessagesParams } from "types";
import { useMessages } from "..";
import { Message } from "./Message";

const defaultQueryParams: GetMessagesParams = {
  sort_by: "date",
  order: "desc",
  limit: 50,
  projection: JSON.stringify({
    is_outgoing: 0,
    scraped_by: 0,
    mentioned: 0,
    author_signature: 0,
    message_id: 0,
    updated_at: 0,
    language: 0,
  }),
};

export const MessageList = ({
  queryParams,
}: {
  queryParams?: GetMessagesParams;
}) => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useMessages({
    params: { ...defaultQueryParams, ...queryParams },
  });
  const hasResults = data && data.pages[0].data.length > 0;

  return (
    <>
      {status === "loading" ? (
        <div className="flex items-center text-gray-600">
          <Spinner size="sm" className="mr-2" />
          <div>Loading Messages…</div>
        </div>
      ) : status === "error" ? (
        <div className="text-red-500">Error: {error?.message}</div>
      ) : hasResults ? (
        <div className="bg-white shadow -mx-4 sm:mx-0 sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {data?.pages.map((page, index) => (
              <Fragment key={index}>
                {page.data.map((message) => (
                  <li key={message._id} className="">
                    <Message {...message} />
                  </li>
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
