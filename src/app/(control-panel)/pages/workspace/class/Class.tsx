import React from "react";
import { Outlet } from "react-router-dom";
import withReducer from "../../../../../store/withReducer";
import reducer from "./store";

const Class = () => {
  return (
    <div className="flex flex-col gap-y-6 h-screen overflow-y-auto bg-white">
      <Outlet />
    </div>
  );
};

export default withReducer("courseClass", reducer)(Class);
