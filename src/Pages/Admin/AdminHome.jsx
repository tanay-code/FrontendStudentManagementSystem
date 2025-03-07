import React from "react";
import AdminHeader from "../../components/Admin-Components/AdminHeader";
import Footer from "../../components/Global/Footer";
import landingImage from "../../assets/student-management-system.png";

const AdminHome = () => {
  return (
    <>
      <AdminHeader />
      <div className="flex items-center justify-center my-[50px]">
        <img
          src={landingImage}
          alt="Landing Page Image"
          className="h-[500px] rounded-[4px]"
        ></img>
      </div>
      <div className="">
        <Footer />
      </div>
    </>
  );
};

export default AdminHome;
