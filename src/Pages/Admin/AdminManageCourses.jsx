import React, { useContext, useEffect, useState } from "react";
import AdminHeader from "../../components/Admin-Components/AdminHeader";
import axios from "axios";
import StudentHeader from "../../components/Student-Components/StudentHeader";
import InstructorHeader from "../../components/Instructor-Components/InstructorHeader";
import AppContext from "../../context/AppContext";
import Footer from "../../components/Global/Footer";

const AdminManageCourses = (props) => {
  const [coursesData, setCoursesData] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);

  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");

  const { user } = useContext(AppContext);

  useEffect(() => {
    fetchCourses();
    fetchCoursesAssigned();
  }, []);

  useEffect(() => {
    if (!isEditCourseModalOpen && !isAddCourseModalOpen) {
      fetchCourses();
      fetchCoursesAssigned();
    }
  }, [isEditCourseModalOpen, isAddCourseModalOpen]);

  const fetchCourses = () => {
    axios
      .get("http://localhost:8001/courses/getAll", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        setCoursesData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching courses data!", error);
      });
  };

  const handleDeleteClick = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleEditCourseClick = (course) => {
    setName(course.courseName);
    setDescription(course.description);
    setDuration(course.duration);
    setSelectedCourse(course);
    setIsEditCourseModalOpen(true);
    console.log("hsaaaaaaaaaaaaa", course);
  };

  const handleAddCourseClick = () => {
    setName("");
    setDescription("");
    setDuration("");
    setIsAddCourseModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const closeEditCourseModal = () => {
    setIsEditCourseModalOpen(false);
    setSelectedCourse(null);
  };

  const closeAddCourseModal = () => {
    setIsAddCourseModalOpen(false);
  };

  // Delete student
  const handleConfirmDelete = () => {
    if (!selectedCourse) return;

    axios
      .delete(
        `http://localhost:8001/courses/deleteCourse/${selectedCourse.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then(() => {
        setCoursesData((prev) =>
          prev.filter((s) => s.id !== selectedCourse.id)
        );
        closeModal(); // Close modal after deletion
      })
      .catch((error) => {
        console.error("Error deleting course!", error);
      });
  };
  const [coursesIdAssigned, setCoursesIdAssigned] = useState([]);
  const fetchCoursesAssigned = (e) => {
    axios
      .get(
        `http://localhost:8001/instructors/byUserId/${user.userId}/courses`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((response) => {
        setCoursesIdAssigned(response.data);
        console.log(response.data, ">>>>>>>>>>>>>>>>>>>>>>");
      })
      .catch((error) => {
        console.error("Error fetching courseId Assigned!", error);
      });
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    axios
      .post(
        `http://localhost:8001/courses/addCourse`,
        {
          courseName: name,
          description: description,
          duration: duration,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then(() => {
        closeAddCourseModal();
        fetchCourses();
      })
      .catch((error) => {
        console.error("Error adding course!", error);
      });
  };

  const handleEditCourse = (e) => {
    if (!selectedCourse) return;
    e.preventDefault();
    const coursesData = {
      courseName: name,
      description: description,
      duration: duration,
    };
    debugger;
    axios
      .put(
        `http://localhost:8001/courses/updateCourse/${selectedCourse.id}`,
        coursesData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((response) => {
        console.log("Course edited successfully:", response.data);
        closeEditCourseModal();
        // Handle success (e.g., clear form, show success message)
      })
      .catch((error) => {
        console.error("There was an error editing the course!", error);
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
      {!props.hideActionButtons && (
        <button
          type="button"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 ml-[25px] mt-[30px]"
          onClick={handleAddCourseClick}
        >
          Add Course
        </button>
      )}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-[75px] mx-[25px] mt-[75px]">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Id
              </th>
              <th scope="col" className="px-6 py-3">
                Course name
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Duration
              </th>
              {!props.hideActionButtons && (
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {coursesData.map((course) => (
              <tr
                key={course.id}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {course.id}
                </th>
                <td className="px-6 py-4">
                  <span
                    className={
                      coursesIdAssigned?.includes(course.id)
                        ? "font-bold text-white"
                        : ""
                    }
                  >
                    {course.courseName}
                  </span>
                </td>
                <td className="px-6 py-4">{course.description}</td>
                <td className="px-6 py-4">{course.duration}</td>
                {!props.hideActionButtons && (
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-6">
                      <button
                        onClick={() => handleEditCourseClick(course)}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(course)}
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
              <strong>{selectedCourse?.name}</strong>?
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
      {isEditCourseModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center"
          onClick={closeEditCourseModal}
        >
          <div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Edit Course
            </h2>
            {/* <p className="mt-2 text-gray-600 dark:text-gray-300">
              Are you sure you want to delete{" "}
              <strong>{selectedStudent?.name}</strong>?
            </p> */}

            <form className="max-w-md mx-auto">
              <div className="relative z-0 w-full mb-5 group mt-4">
                <input
                  type="name"
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
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Course Name
                </label>
              </div>

              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="text"
                    name="floating_description"
                    id="floating_description"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <label
                    for="floating_description"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Description
                  </label>
                </div>
              </div>
              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="text"
                    name="floating_duration"
                    id="floating_duration"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                  <label
                    for="floating_duration"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Duration
                  </label>
                </div>
              </div>
            </form>

            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-md mr-2 text-white"
                onClick={closeEditCourseModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                onClick={handleEditCourse}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
      {isAddCourseModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center"
          onClick={closeAddCourseModal}
        >
          <div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Add Course
            </h2>
            <form className="max-w-md mx-auto" onSubmit={handleAddCourse}>
              <div className="relative z-0 w-full mb-5 group mt-4">
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
                  htmlFor="floating_name"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Course Name
                </label>
              </div>

              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="text"
                    name="floating_description"
                    id="floating_description"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <label
                    htmlFor="floating_description"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Description
                  </label>
                </div>
              </div>
              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="text"
                    name="floating_duration"
                    id="floating_duration"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                  <label
                    htmlFor="floating_duration"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Duration
                  </label>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-md mr-2 text-white"
                  onClick={closeAddCourseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="">
        <Footer />
      </div>
    </>
  );
};

export default AdminManageCourses;
