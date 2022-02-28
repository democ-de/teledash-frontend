import { lazyImport } from "utils/lazyImport";
import { Landing } from "features/misc";
import { Navigate } from "react-router-dom";

const { AuthRoutes } = lazyImport(() => import("features/auth"), "AuthRoutes");

export const publicRoutes = [
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/auth/*",
    element: <AuthRoutes />,
  },
  { path: "*", element: <Navigate to="." /> },
];
