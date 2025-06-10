import { lazy } from "react";
import { Navigate } from "react-router";

const Contact = lazy(() => import("./Contact"));

const HomeRoute: any = {
  path: "contact",
  //   auth: authRoles.user,
  element: <Contact />,
};

export default HomeRoute;
