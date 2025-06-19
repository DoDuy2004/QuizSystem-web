import { lazy } from "react";
import { Navigate } from "react-router";

const Profile = lazy(() => import("./profile/Profile"));
const User = lazy(() => import('./User'))
const ChangePassword = lazy(() => import("./change-password/ChangePassword"))

const UserRoute = {
  path: "my-account",
  element: <User />,
  children: [
    {
      path: "",
      element: <Navigate to="profile" />
    },
    {
      path: "profile",
      element: <Profile />
    },
    {
      path: "change-password",
      element: <ChangePassword />
    }
  ]
};

export default UserRoute;
