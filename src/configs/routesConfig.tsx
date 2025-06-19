import { Navigate } from "react-router";
import ErrorBoundary from "../app/(public)/error/ErrorBoundary";
import App from "../app/App";
import Error401Page from "../app/(public)/error/Error401Page";
import Error404Page from "../app/(public)/error/Error404Page";
import Home from "../app/(public)/home/Home";
// import Signin from "../app/pages/sign-in/Signin";

const configModules: Record<string, unknown> = import.meta.glob(
  "/src/app/**/*Route.tsx",
  {
    eager: true,
  }
);

const mainRoutes: any = Object.keys(configModules)
  .map((modulePath) => {
    const moduleConfigs = (
      configModules[modulePath] as {
        default: any;
      }
    ).default;
    return Array.isArray(moduleConfigs) ? moduleConfigs : [moduleConfigs];
  })
  .flat();

const routes: any = [
  {
    path: "/",
    element: <App />,
    // auth: settingsConfig.defaultAuth,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        // auth: authRoles.user,
        element: <Home />,
      },
      //   {
      //     path: "/",
      //     auth: authRoles.onlyGuest,
      //     element: <Navigate to="/sign-in" />,
      //   },
      //   {
      //     path: "loading",
      //     element: <FuseLoading />,
      //     settings: { layout: layoutConfigOnlyMain },
      //   },
      {
        path: "401",
        element: <Error401Page />,
      },
      ...mainRoutes,
      {
        path: "404",
        element: <Error404Page />,
        // settings: { layout: layoutConfigOnlyMain },
        auth: null,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/404" />,
  },
];

export default routes;
