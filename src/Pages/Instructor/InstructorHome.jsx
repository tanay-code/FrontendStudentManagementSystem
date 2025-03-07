import React, { useContext, useEffect, useState } from "react";
import InstructorHeader from "../../components/Instructor-Components/InstructorHeader";
import axios from "axios";
import AppContext from "../../context/AppContext";

const InstructorHome = () => {
  const { user } = useContext(AppContext);

  const [assignedCourseId, setAssignedCourseId] = useState([]);
  const [gradeFilteredByCourseId, setGradeFilteredByCourseId] = useState([]);
  const [studentDetails, setStudentDetails] = useState([]);

  useEffect(() => {
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

    fetchData();
  }, [user.token, user.userId]);

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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default InstructorHome;
