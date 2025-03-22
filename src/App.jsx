import { Route, Routes } from "react-router-dom";
import AdminHome from "./Pages/Admin/AdminHome";
import LoginPage from "./Pages/Auth/LoginPage";
import AdminManageInstructors from "./Pages/Admin/AdminManageInstructors";
import AdminManageStudents from "./Pages/Admin/AdminManageStudents";
import RegisterPage from "./Pages/Auth/RegisterPageStudent";
import StudentHome from "./Pages/Student/StudentHome";
import CourseDetails from "./Pages/Student/CourseDetails";
import AdminManageCourses from "./Pages/Admin/AdminManageCourses";
import InstructorHome from "./Pages/Instructor/InstructorHome";
import RegisterPageStudent from "./Pages/Auth/RegisterPageStudent";
import UnauthorizedPage from "./Pages/Auth/UnauthorizedPage";
import ProtectedRoute from "./components/Global/ProtectedRoute";
import Footer from "./components/Global/Footer";

function App() {
  return (
    <>
      <Routes>
        {/* admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manageInstructors"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminManageInstructors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manageStudents"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminManageStudents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manageCourses"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminManageCourses />
            </ProtectedRoute>
          }
        />
        <Route path="/register" element={<RegisterPageStudent />} />

        {/* student routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute requiredRole="STUDENT">
              <StudentHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/viewInstructors"
          element={
            <ProtectedRoute requiredRole="STUDENT">
              <AdminManageInstructors
                hideActionButtons={true}
                isStudent={true}
                isInstructor={false}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/viewStudents"
          element={
            <ProtectedRoute requiredRole="STUDENT">
              <AdminManageStudents
                hideActionButtons={true}
                isStudent={true}
                isInstructor={false}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/viewCourses"
          element={
            <ProtectedRoute requiredRole="STUDENT">
              <AdminManageCourses
                hideActionButtons={true}
                isStudent={true}
                isInstructor={false}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/courseDetails/:courseId"
          element={
            <ProtectedRoute requiredRole="STUDENT">
              <CourseDetails />
            </ProtectedRoute>
          }
        />

        {/* instructor routes */}
        <Route
          path="/instructor"
          element={
            <ProtectedRoute requiredRole="INSTRUCTOR">
              <InstructorHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/viewInstructors"
          element={
            <ProtectedRoute requiredRole="INSTRUCTOR">
              <AdminManageInstructors
                hideActionButtons={true}
                isInstructor={true}
                isStudent={false}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/viewStudents"
          element={
            <ProtectedRoute requiredRole="INSTRUCTOR">
              <AdminManageStudents
                hideActionButtons={true}
                isInstructor={true}
                isStudent={false}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/viewCourses"
          element={
            <ProtectedRoute requiredRole="INSTRUCTOR">
              <AdminManageCourses
                hideActionButtons={true}
                isInstructor={true}
                isStudent={false}
              />
            </ProtectedRoute>
          }
        />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
