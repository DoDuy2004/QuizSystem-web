import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import MainHeader from "./main/Header";
import ManageHeader from "./manage/Header";
import Footer from "./main/Footer";
import Sidebar from "./manage/Sidebar";
import FuseMessage from "../components/FuseMessage";
import ConfirmationDialog from "../dialogs/confirmation-dialog/ConfirmationDialog";
import withReducer from "../store/withReducer";
import reducer from "../store/slices/globalSlice";
import AddClassDialog from "../dialogs/add-class-dialog/AddClassDialog";
import AddMultiQuestionsDialog from "../dialogs/add-multi-questions-dialog/AddMultiQuestionsDialog";
import AddQuestionToExamDialog from "../dialogs/add-question-exam-dialog/AddQuestionToExamDialog";
import AddSubjectDialog from "../dialogs/add-subject-dialog/AddSubjectDialog";
import AddMultiStudentsDialog from "../dialogs/add-multi-students-dialog/AddMultiStudentsDialog";
import AddRoomExamDialog from "../dialogs/add-room-exam-dialog/AddRoomExamDialog";
import AddStudentsToClassDialog from "../dialogs/add-student-dialog/AddStudentsDialog";
// import Sidebar from "./admin/Sidebar";

const AppLayout = () => {
  const { pathname } = useLocation();
  const isManage = ["/my-account", "/workspace", "/personal", "/manage"].some(
    (prefix) => pathname.startsWith(prefix)
  );
  const isAuth = pathname.startsWith("/auth");

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll về đầu trang
  }, [pathname]);

  if (isAuth) {
    return (
      <div className="h-screen w-full bg-[#f1f5f9] flex justify-center items-center">
        <Outlet />
        <FuseMessage />
      </div>
    );
  }

  if (isManage) {
    return (
      <div className="flex w-full">
        <Sidebar />
        <main className="flex-1 bg-gray-50 w-full">
          <ManageHeader />
          <Outlet />
        </main>
        <FuseMessage />
        <ConfirmationDialog />
        <AddClassDialog />
        <AddMultiQuestionsDialog />
        <AddQuestionToExamDialog />
        <AddSubjectDialog />
        <AddMultiStudentsDialog />
        <AddRoomExamDialog />
        <AddStudentsToClassDialog />
      </div>
    );
  }

  // Mặc định là layout chính
  return (
    <div className="w-full">
      <MainHeader />
      <Outlet />
      <Footer />
      <FuseMessage />
    </div>
  );
};

export default withReducer("globalSlice", reducer)(AppLayout);
