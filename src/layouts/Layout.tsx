import React from 'react'
import { Outlet } from "react-router";
import Header from './main/Header';
import Footer from './main/Footer';


const AppLayout = () => {
  return (
    <div className="w-full">
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default AppLayout