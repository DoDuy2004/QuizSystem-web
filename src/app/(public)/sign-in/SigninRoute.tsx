import { lazy } from "react";
import { Navigate } from "react-router";

const Signin = lazy(() => import("./Signin"));
const ForgotPassword = lazy(() => import("../forgot-password/ForgotPassword"));

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
    {
      path: "forgot-password",
      element: <ForgotPassword />,
    },
  ],
};

export default SigninRoute;
