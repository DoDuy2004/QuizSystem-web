// import React from "react";
import { Outlet } from "react-router-dom";
import withReducer from "../../../../../store/withReducer";
import reducer from "./store";

const Student = () => {
  return (
    <div className="md:px-8 px-4 py-4 flex flex-col gap-y-6 h-screen overflow-y-auto">
      <Outlet />
    </div>
  );
};

export default withReducer("students", reducer)(Student);
