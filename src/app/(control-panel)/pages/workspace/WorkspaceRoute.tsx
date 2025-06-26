import { lazy } from "react";
import { Navigate } from "react-router";

const Exam = lazy(() => import("./exam/Exam"));
const QuestionBankList = lazy(() => import("./question-bank/QuestionBankList"));
const QuestionBank = lazy(() => import("./question-bank/QuestionBank"));
const QuestionBankDetail = lazy(
  () => import("./question-bank/question-bank-detail/QuestionBankDetail")
);
const EditQuestionBank = lazy(
  () => import("./question-bank/edit-question-bank/EditQuestionBank")
);

const WorkspaceRoute = {
  path: "workspace",
  children: [
    {
      path: "",
      element: <Navigate to="/class" />,
    },
    {
      path: "exam",
      element: <Exam />,
      children: [
        {
          path: "list",
          element: <Exam />,
        },
      ],
    },
    {
      path: "question-bank",
      element: <QuestionBank />,
      children: [
        {
          path: "",
          element: <Navigate to="list" />,
        },
        {
          path: "list",
          element: <QuestionBankList />,
        },
        {
          path: ":id",
          element: <QuestionBankDetail />,
        },
        {
          path: ":id/edit",
          element: <EditQuestionBank />,
        },
        {
          path: "new",
          element: <EditQuestionBank />,
        },
      ],
    },
  ],
};

export default WorkspaceRoute;
