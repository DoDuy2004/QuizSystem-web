import React from "react";
import { Outlet } from "react-router-dom";

const ExamResult = () => {
  return (
    <div className="px-8 py-4 flex flex-col gap-y-6 h-screen overflow-y-auto">
      <Outlet />
    </div>
  );
};

export default ExamResult;
