// Dynamically import all *ConfigConfig.tsx files from the app folder
// import { FuseRouteConfigType, FuseRoutesType } from "@fuse/utils/FuseUtils";
import { Navigate } from "react-router";
import ErrorBoundary from "../pages/error/ErrorBoundary";
import App from "../App";
import Error401Page from "../pages/error/Error401Page";
import Error404Page from "../pages/error/Error404Page";
import Home from "../pages/home/Home";
import Signin from "../pages/sign-in/Signin";

const configModules: Record<string, unknown> = import.meta.glob(
  "/src/pages/**/*Route.tsx",
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
