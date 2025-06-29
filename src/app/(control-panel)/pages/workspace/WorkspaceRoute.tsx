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
const Class = lazy(() => import("./class/Class"));
const ClassList = lazy(() => import("./class/ClassList"));
const ClassDetail = lazy(() => import("./class/class-detail/ClassDetail"));
const ExamList = lazy(() => import("./exam/ExamList"));
const ExamDetail = lazy(() => import("./exam/exam-detail/ExamDetail"));
const EditExam = lazy(() => import("./exam/edit-exam/EditExam"));

const WorkspaceRoute = {
  path: "workspace",
  children: [
    {
      path: "",
      element: <Navigate to="class" />,
    },
    {
      path: "exam",
      element: <Exam />,
      children: [
        {
          path: "",
          element: <Navigate to="list" />,
        },  
        {
          path: "list",
          element: <ExamList />,
        },
        {
          path: ":id",
          element: <ExamDetail />,
        },
        {
          path: ":id/edit",
          element: <EditExam />,
        },
        {
          path: "new",
          element: <EditExam />,
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
    {
      path: "class",
      element: <Class />,
      children: [
        {
          path: "",
          element: <Navigate to="list" />,
        },
        {
          path: "list",
          element: <ClassList />,
        },
        {
          path: ":id/edit",
          element: <ClassList />,
        },
        {
          path: ":id",
          element: <ClassDetail />,
        },
        {
          path: "new",
          element: <ClassList />,
        },
      ],
    },
  ],
};

export default WorkspaceRoute;
