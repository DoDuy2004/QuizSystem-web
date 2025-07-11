import { Children, lazy } from "react";
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
const Dashboard = lazy(() => import("./dashboard/Dashboard"));
const Student = lazy(() => import("./student/Student"));
const Teacher = lazy(() => import("./teacher/Teacher"));
const Subject = lazy(() => import("./subject/Subject"));
const SubjectList = lazy(() => import("./subject/SubjectList"));
const RoomExam = lazy(() => import("./room-exam/RoomExam"));
const StudentList = lazy(() => import("./student/StudentList"));
const TeacherList = lazy(() => import("./teacher/TeacherList"));
const RoomExamList = lazy(() => import("./room-exam/RoomExamList"));
const RoomExamDetail = lazy(
  () => import("./room-exam/room-exam-detail/RoomExamDetail")
);
const ExamResult = lazy(() => import("./exam-result/ExamResult"));
const ExamResultList = lazy(() => import("./exam-result/ExamResultList"));
const SubjectDetail = lazy(
  () => import("./subject/subject-detail/SubjectDetail")
);
const ExamResultDetail = lazy(
  () => import("./exam-result/exam-result-detail/ExamResultDetail")
);
const StudentExamDetail = lazy(
  () => import("./exam-result/student-exam-detail/StudentExamDetail")
);

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
    // {
    //   path: "dashboard",
    //   element: <Dashboard />,
    // },
    {
      path: "teacher",
      element: <Teacher />,
      children: [
        {
          path: "",
          element: <Navigate to="list" />,
        },
        {
          path: "list",
          element: <TeacherList />,
        },
        {
          path: ":id/edit",
          element: <TeacherList />,
        },
        {
          path: "new",
          element: <TeacherList />,
        },
      ],
    },
    {
      path: "student",
      element: <Student />,
      children: [
        {
          path: "",
          element: <Navigate to="list" />,
        },
        {
          path: "list",
          element: <StudentList />,
        },
        {
          path: ":id/edit",
          element: <StudentList />,
        },
        {
          path: "new",
          element: <StudentList />,
        },
      ],
    },
    {
      path: "subject",
      element: <Subject />,
      children: [
        {
          path: "",
          element: <Navigate to="list" />,
        },
        {
          path: "list",
          element: <SubjectList />,
        },

        {
          path: ":id",
          element: <SubjectDetail />,
          children: [
            {
              path: "edit",
              element: <SubjectDetail />,
            },
          ],
        },
        {
          path: "new",
          element: <SubjectList />,
        },
      ],
    },
    {
      path: "room-exam",
      element: <RoomExam />,
      children: [
        {
          path: "",
          element: <Navigate to="list" />,
        },
        {
          path: "list",
          element: <RoomExamList />,
        },
        {
          path: ":id/edit",
          element: <RoomExamList />,
        },
        {
          path: "new",
          element: <RoomExamList />,
        },
        {
          path: ":id/student-exams",
          element: <ExamResultDetail />,
          children: [],
        },
        {
          path: ":id/student-exams/:studentExamId/detail/:studentId",
          element: <StudentExamDetail />,
        },
        {
          path: ":id",
          element: <RoomExamDetail />,
        },
      ],
    },
    {
      path: "exam-result",
      element: <ExamResult />,
      children: [
        {
          path: "",
          element: <Navigate to="list" />,
        },
        {
          path: "list",
          element: <ExamResultList />,
        },
      ],
    },
  ],
};

export default WorkspaceRoute;
