import { lazy } from "react";
import { Navigate } from "react-router";

const Home = lazy(() => import("./Home"))

const HomeRoute: any = {
  path: "",
//   auth: authRoles.user,
  children: [
    {
      path: "home",
      element: <Home />,
    },
  ],
};

export default HomeRoute;