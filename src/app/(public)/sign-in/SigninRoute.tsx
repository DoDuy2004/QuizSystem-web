import { lazy } from "react";
import { Navigate } from "react-router";

const Signin = lazy(() => import("./Signin"));

const SigninRoute: any = {
  path: "auth",
  //   auth: authRoles.user,
  children: [
    {
      path: "",
      element: <Navigate to="login" />,
    },
    {
      path: "login",
      element: <Signin />,
    },
  ],
};

export default SigninRoute;
