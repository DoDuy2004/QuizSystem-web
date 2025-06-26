import withReducer from "../../../../../store/withReducer";
import reducer from "./store";
import { Outlet } from "react-router-dom";

const QuestionBank = () => {
  return (
    <div className="px-8 py-4 flex flex-col gap-y-6 h-screen overflow-y-auto">
      <Outlet />
    </div>
  );
};

export default withReducer("questionBank", reducer)(QuestionBank);
