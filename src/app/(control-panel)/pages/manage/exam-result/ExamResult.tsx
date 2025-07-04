import React from "react";
import { Outlet } from "react-router-dom";

const ExamResult = () => {
  return (
    <div className="flex flex-col gap-y-6 h-screen overflow-y-auto bg-white">
      <Outlet />
    </div>
  );
};

export default ExamResult;
