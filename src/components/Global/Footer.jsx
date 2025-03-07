import React, { useContext, useEffect } from "react";
import logo from "../../assets/college-logo.png";
import AppContext from "../../context/AppContext";

const Footer = () => {
  const { user } = useContext(AppContext);

  const paths = {
    ADMIN: {
      home: "/admin",
      instructors: "/admin/manageInstructors",
      students: "/admin/manageStudents",
      courses: "/admin/manageCourses",
    },
    STUDENT: {
      home: "/student",
      instructors: "/student/viewInstructors",
      students: "/student/viewStudents",
      courses: "/student/viewCourses",
    },
    INSTRUCTOR: {
      home: "/instructor",
      instructors: "/instructor/viewInstructors",
      students: "/instructor/viewStudents",
      courses: "/instructor/viewCourses",
    },
  };

  const userPaths = paths[user.roles] || {};

  return (
    <footer class="bg-white rounded-lg shadow-sm dark:bg-gray-800">
      <div class="w-full max-w-screen-xl mx-auto p-2 md:py-8">
        <div class="sm:flex sm:items-center sm:justify-between">
          <div class="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
            <img
              src={logo}
              class="h-8"
              alt="Flowbite Logo"
              className="rounded-[5px] h-[28px] w-[28px]"
            />
            <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Student Management System
            </span>
          </div>
          <ul class="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            {userPaths.home && (
              <li>
                <a
                  href={userPaths.home}
                  className="hover:underline me-4 md:me-6"
                >
                  Home
                </a>
              </li>
            )}
            {userPaths.instructors && (
              <li>
                <a
                  href={userPaths.instructors}
                  className="hover:underline me-4 md:me-6"
                >
                  Instructors
                </a>
              </li>
            )}
            {userPaths.students && (
              <li>
                <a
                  href={userPaths.students}
                  className="hover:underline me-4 md:me-6"
                >
                  Students
                </a>
              </li>
            )}
            {userPaths.courses && (
              <li>
                <a href={userPaths.courses} className="hover:underline">
                  Courses
                </a>
              </li>
            )}
          </ul>
        </div>
        <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span class="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2025 All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
