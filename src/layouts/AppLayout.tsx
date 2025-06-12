import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./main/Header";
import Footer from "./main/Footer";
// import Sidebar from "./admin/Sidebar";

const AppLayout = () => {
  const { pathname } = useLocation();

  const isAdmin = pathname.startsWith("/admin");
  const isAuth = pathname.startsWith("/auth");

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll về đầu trang
  }, [pathname]);

  if (isAuth) {
    return (
      <div className="h-screen w-full bg-[#f1f5f9] flex justify-center items-center">
        <Outlet />
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="flex">
        {/* <Sidebar /> */}
        <main className="flex-1 p-4 bg-gray-50">
          <Outlet />
        </main>
      </div>
    );
  }

  // Mặc định là layout chính
  return (
    <div className="w-full">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default AppLayout;
