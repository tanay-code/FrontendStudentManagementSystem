import React, { useContext, useEffect, useState } from "react";
import AdminHeader from "../../components/Admin-Components/AdminHeader";
import axios from "axios";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import StudentHeader from "../../components/Student-Components/StudentHeader";
import InstructorHeader from "../../components/Instructor-Components/InstructorHeader";
import AppContext from "../../context/AppContext";
import Footer from "../../components/Global/Footer";

const AdminManageInstructors = (props) => {
  const [instructorsData, setInstructorsData] = useState([]);
  const [coursesData, setCoursesData] = useState([]);
  const [courseMap, setCourseMap] = useState(new Map());

  const [selectedInstructor, setSelectedInstructor] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditInstructorModalOpen, setIsEditInstructorModalOpen] =
    useState(false);

  const { user } = useContext(AppContext);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (!isEditInstructorModalOpen) {
      fetchCourses();
    }
  }, [isEditInstructorModalOpen]);

  const handleDeleteClick = (instructor) => {
    console.log(instructor, ">>>>>>>>>>>>>>>");
    setSelectedInstructor(instructor);
    setIsModalOpen(true);
  };

  const handleEditInstructorClick = (instructor) => {
    setEmail(instructor.email);
    setName(instructor.name);
    setSelectedInstructor(instructor);
    setIsEditInstructorModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInstructor(null);
  };

  const closeEditInstructorModal = () => {
    setIsEditInstructorModalOpen(false);
    setSelectedInstructor(null);
  };

  const handleEditInstructor = (e) => {
    if (!selectedInstructor) return;
    e.preventDefault();

    const instructorData = {
      email: email,
      name: name,
    };

    axios
      .put(
        `http://localhost:8001/instructors/update/${selectedInstructor.id}`,
        instructorData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((response) => {
        console.log("Instructor edited successfully:", response.data);
        closeEditInstructorModal();
        // Handle success (e.g., clear form, show success message)
      })
      .catch((error) => {
        console.error("There was an error editing the instructor!", error);
        // Handle error (e.g., show error message)
      });
  };

  const handleConfirmDelete = () => {
    if (!selectedInstructor) return;
    axios
      .delete(
        `http://localhost:8001/instructors/deleteById/${selectedInstructor.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then(() => {
        console.log("did we reach herer");
        setInstructorsData((prev) =>
          prev.filter((s) => s.id !== selectedInstructor.id)
        );
        closeModal(); // Close modal after deletion
      })
      .catch((error) => {
        console.error("Error deleting student!", error);
      });
    console.log("did we reach herer");
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:8001/courses/getAll", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setCoursesData(response.data);

      // Create a map for quick lookup
      const courseMapping = new Map(
        response.data.map((course) => [course.id, course.courseName])
      );
      setCourseMap(courseMapping);

      // After fetching courses, fetch instructors
      fetchInstructors(courseMapping);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchInstructors = async (courseMapping) => {
    try {
      const response = await axios.get(
        "http://localhost:8001/instructors/getAll",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(response.data);
      // Replace course IDs with names using courseMap
      const updatedInstructors = response.data.map((instructor) => ({
        ...instructor,
        assignedCourses: instructor.assignedCourses.map(
          (courseId) => courseMapping.get(courseId) || "Unknown Course"
        ),
      }));

      setInstructorsData(updatedInstructors);
    } catch (error) {
      console.error("Error fetching instructors:", error);
    }
  };

  const handleAssignCourse = async (courseId, instructorId) => {
    const instructor = instructorsData.find((item) => item.id === instructorId);
    const course = courseMap.get(courseId);
    if (instructor.assignedCourses.includes(course)) {
      alert("Already added");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8001/instructors/assign/${instructorId}/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      console.log("Course assigned successfully", response.data);

      // Update the assignedCourses with names instead of IDs
      setInstructorsData((prevData) =>
        prevData.map((instructor) =>
          instructor.id === instructorId
            ? {
                ...instructor,
                assignedCourses: [
                  ...instructor.assignedCourses,
                  courseMap.get(courseId) || "Unknown Course",
                ],
              }
            : instructor
        )
      );
    } catch (error) {
      console.error("Error assigning course!", error);
    }
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
        // onClick={() => handleEditStudentClick()}
        type="button"
        className="text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:ring-gray-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-900 focus:outline-none dark:focus:ring-gray-500 w-fit ml-[25px] mt-[25px]"
      >
        Add Instructor
      </button> */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-[75px] mx-[25px] mt-[20px]">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Id
              </th>
              <th scope="col" className="px-6 py-3">
                instructor name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Assigned Courses
              </th>
              {!props.hideActionButtons && (
                <>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Assign Course
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {instructorsData.map((instructor) => (
              <tr
                key={instructor.id}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {instructor.id}
                </th>
                <td className="px-6 py-4">{instructor.name}</td>
                <td className="px-6 py-4">{instructor.email}</td>
                <td className="px-6 py-4">
                  {instructor.assignedCourses.join(", ")}
                </td>
                {!props.hideActionButtons && (
                  <>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-6">
                        <button
                          onClick={() => handleEditInstructorClick(instructor)}
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(instructor)}
                          className="font-medium text-red-600 dark:text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        <div>
                          <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50">
                            Options
                            <ChevronDownIcon
                              aria-hidden="true"
                              className="-mr-1 size-5 text-gray-400"
                            />
                          </MenuButton>
                        </div>

                        <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in">
                          <div className="py-1">
                            {coursesData.map((item) => (
                              <MenuItem key={item.id}>
                                <button
                                  onClick={() =>
                                    handleAssignCourse(item.id, instructor.id)
                                  }
                                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                >
                                  {item.courseName}
                                </button>
                              </MenuItem>
                            ))}
                          </div>
                        </MenuItems>
                      </Menu>
                    </td>
                  </>
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
              <strong>{selectedInstructor?.name}</strong>?
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
      {isEditInstructorModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center"
          onClick={closeEditInstructorModal}
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
                onClick={closeEditInstructorModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                onClick={handleEditInstructor}
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

export default AdminManageInstructors;
