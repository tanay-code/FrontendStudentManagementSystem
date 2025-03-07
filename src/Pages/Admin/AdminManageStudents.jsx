import React, { useContext, useEffect, useState } from "react";
import AdminHeader from "../../components/Admin-Components/AdminHeader";
import axios from "axios";
import StudentHeader from "../../components/Student-Components/StudentHeader";
import InstructorHeader from "../../components/Instructor-Components/InstructorHeader";
import AppContext from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Global/Footer";

const AdminManageStudents = (props) => {
  const [studentsData, setStudentsData] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditStudentModalOpen, setIsEditStudentModalOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const { user } = useContext(AppContext);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (!isEditStudentModalOpen) {
      fetchStudents();
    }
  }, [isEditStudentModalOpen]);

  const fetchStudents = () => {
    axios
      .get("http://localhost:8001/students/getAll", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        setStudentsData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching student data!", error);
      });
  };

  // Open delete confirmation modal
  const handleDeleteClick = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
    console.log(student, ">>>>>>>>>>>>>>");
  };

  const handleEditStudentClick = (student) => {
    setEmail(student.email);
    setName(student.name);
    setSelectedStudent(student);
    setIsEditStudentModalOpen(true);
    console.log("hsaaaaaaaaaaaaa", student);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const closeEditStudentModal = () => {
    setIsEditStudentModalOpen(false);
    setSelectedStudent(null);
  };

  // Delete student
  const handleConfirmDelete = () => {
    if (!selectedStudent) return;

    axios
      .delete(
        `http://localhost:8001/students/deleteById/${selectedStudent.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then(() => {
        setStudentsData((prev) =>
          prev.filter((s) => s.id !== selectedStudent.id)
        );
        closeModal(); // Close modal after deletion
      })
      .catch((error) => {
        console.error("Error deleting student!", error);
      });
  };

  const handleEditStudent = (e) => {
    if (!selectedStudent) return;
    e.preventDefault();

    const studentData = {
      email: email,
      name: name,
      userId: user.userId,
    };

    axios
      .put(
        `http://localhost:8001/students/update/${selectedStudent.id}`,
        studentData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((response) => {
        console.log("Student added successfully:", response.data);
        closeEditStudentModal();
        // Handle success (e.g., clear form, show success message)
      })
      .catch((error) => {
        console.error("There was an error adding the student!", error);
        // Handle error (e.g., show error message)
      });
  };

  return (
    <>
      {props.isStudent ? (
        <StudentHeader />
      ) : props.isInstructor ? (
        <InstructorHeader />
      ) : (
        <AdminHeader />
      )}

      {/* <button
        onClick={() => handleEditStudentClick()}
        type="button"
        className="text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:ring-gray-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-900 focus:outline-none dark:focus:ring-gray-500 w-fit ml-[25px] mt-[50px]"
      >
        Edit Student
      </button> */}

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-[75px] mx-[25px] mt-[75px]">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Id
              </th>
              <th scope="col" className="px-6 py-3">
                Student name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              {!props.hideActionButtons && (
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {studentsData.map((student) => (
              <tr
                key={student.id}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {student.id}
                </th>
                <td className="px-6 py-4">{student.name}</td>
                <td className="px-6 py-4">{student.email}</td>
                {!props.hideActionButtons && (
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-6">
                      <button
                        onClick={() => handleEditStudentClick(student)}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(student)}
                        className="font-medium text-red-600 dark:text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirm Delete Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Confirm Delete
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Are you sure you want to delete{" "}
              <strong>{selectedStudent?.name}</strong>?
            </p>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-md mr-2 text-white"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {isEditStudentModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center"
          onClick={closeEditStudentModal}
        >
          <div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Edit Student
            </h2>
            {/* <p className="mt-2 text-gray-600 dark:text-gray-300">
              Are you sure you want to delete{" "}
              <strong>{selectedStudent?.name}</strong>?
            </p> */}

            <form className="max-w-md mx-auto">
              <div className="relative z-0 w-full mb-5 group mt-4">
                <input
                  type="email"
                  name="floating_email"
                  id="floating_email"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label
                  for="floating_email"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Email address
                </label>
              </div>

              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="text"
                    name="floating_name"
                    id="floating_name"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <label
                    for="floating_name"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Name
                  </label>
                </div>
              </div>
            </form>

            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-md mr-2 text-white"
                onClick={closeEditStudentModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                onClick={handleEditStudent}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="">
        <Footer />
      </div>
    </>
  );
};

export default AdminManageStudents;
