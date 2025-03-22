import React, { useContext, useEffect, useState } from "react";
import InstructorHeader from "../../components/Instructor-Components/InstructorHeader";
import axios from "axios";
import AppContext from "../../context/AppContext";

const InstructorHome = () => {
  const { user } = useContext(AppContext);

  const [assignedCourseId, setAssignedCourseId] = useState([]);
  const [gradeFilteredByCourseId, setGradeFilteredByCourseId] = useState([]);
  const [studentDetails, setStudentDetails] = useState([]);

  const [name, setName] = useState("");
  const [IsEditStudentGradeModalOpen, setIsEditStudentGradeModalOpen] =
    useState(false);
  const [number, setNumber] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);

  useEffect(() => {
    fetchData();
  }, [user.token, user.userId]);

  const fetchData = async () => {
    try {
      const courseIds = await fetchCourseIdAssignedToInstructor();
      const grades = await fetchGradeFilterByCourseId(courseIds);
      const students = await fetchAllStudents();
      setStudentDetails(students);
      setGradeFilteredByCourseId(grades);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchCourseIdAssignedToInstructor = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8001/instructors/byUserId/${user.userId}/courses`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setAssignedCourseId(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching course IDs!", error);
    }
  };

  const fetchGradeFilterByCourseId = async (courseIds) => {
    try {
      const response = await axios.get(
        `http://localhost:8001/grade/filterByCourseIds`,
        {
          params: {
            courseIds: courseIds.join(","),
          },
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching grades!", error);
    }
  };

  const fetchAllStudents = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8001/students/getAll`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching student details!", error);
    }
  };

  const getStudentNameById = (studentId) => {
    const student = studentDetails.find((student) => student.id === studentId);
    return student ? student.name : "Unknown";
  };

  const handleEditStudentGradeClick = (grade) => {
    setName(getStudentNameById(grade.studentId));
    setNumber(grade.marks); // Set the current marks
    setSelectedGrade(grade);
    setIsEditStudentGradeModalOpen(true);
  };

  const closeEditStudentGradeModal = () => {
    setIsEditStudentGradeModalOpen(false);
    setSelectedGrade(null);
    setName("");
    setNumber(null);
  };

  const handleEditStudentGrade = async () => {
    if (!selectedGrade) return;

    if (
      number === "" ||
      number < 0 ||
      number > 100 ||
      isNaN(number) ||
      /^0[0-9]+/.test(number)
    ) {
      alert(
        "Please enter a valid number between 0 and 100 without leading zeros."
      );
      return;
    }

    try {
      await axios.put(
        `http://localhost:8001/grade/updateStudentGrade`,
        {
          id: selectedGrade.id,
          studentId: selectedGrade.studentId,
          courseId: selectedGrade.courseId,
          marks: number,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      // Update the grade in the local state
      // setGradeFilteredByCourseId((prevGrades) =>
      //   prevGrades.map((grade) =>
      //     grade.id === selectedGrade.id ? { ...grade, marks: number } : grade
      //   )
      // );
      fetchData();

      closeEditStudentGradeModal();
    } catch (error) {
      console.error("Error updating student grade:", error);
    }
  };

  return (
    <>
      <InstructorHeader />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-[75px] mx-[25px] mt-[75px]">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Student name
              </th>
              <th scope="col" className="px-6 py-3">
                Marks
              </th>
              <th scope="col" className="px-6 py-3">
                Assigned Marks
              </th>
            </tr>
          </thead>
          <tbody>
            {gradeFilteredByCourseId.map((grade) => (
              <tr
                key={grade.id}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
              >
                <td className="px-6 py-4">
                  {getStudentNameById(grade.studentId)}
                </td>
                <td className="px-6 py-4">{grade.marks}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => handleEditStudentGradeClick(grade)}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {IsEditStudentGradeModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center"
          onClick={closeEditStudentGradeModal}
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
              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="number"
                    name="floating_number"
                    id="floating_number"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                  />
                  <label
                    for="floating_number"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Number
                  </label>
                </div>
              </div>
            </form>

            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-md mr-2 text-white"
                onClick={closeEditStudentGradeModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                onClick={handleEditStudentGrade}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstructorHome;
