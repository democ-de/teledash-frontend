import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { Spinner } from "components/Elements";
import { MainLayout } from "components/Layout";
import { lazyImport } from "utils/lazyImport";
import { Search } from "features/search";
import { Chat } from "features/chats";
import { User } from "features/users";

const { Dashboard } = lazyImport(() => import("features/misc"), "Dashboard");
const { Profile } = lazyImport(() => import("features/accounts"), "Profile");

const App = () => {
  return (
    <MainLayout>
      <Suspense
        fallback={
          <div className="h-full w-full flex items-center justify-center">
            <Spinner size="xl" />
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </MainLayout>
  );
};

export const protectedRoutes = [
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/search", element: <Search /> },
      { path: "/account", element: <Profile /> },
      { path: "/chat/:chatId", element: <Chat /> },
      { path: "/user/:userId", element: <User /> },
      { path: "*", element: <Navigate to="." /> },
    ],
  },
];
