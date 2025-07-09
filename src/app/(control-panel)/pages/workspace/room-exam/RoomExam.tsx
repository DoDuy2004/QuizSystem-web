import React from "react";
import { Outlet } from "react-router-dom";
import reducer from "./store";
import withReducer from "../../../../../store/withReducer";

const RoomExam = () => {
  return (
    <div className="px-8 py-4 flex flex-col gap-y-6 h-screen overflow-y-auto mb-10">
      <Outlet />
    </div>
  );
};

export default withReducer("roomExams", reducer)(RoomExam);
