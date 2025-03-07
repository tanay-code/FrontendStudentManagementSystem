import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import StudentHeader from "../../components/Student-Components/StudentHeader";
import cardImage from "../../assets/image.jpg";
import AppContext from "../../context/AppContext";

const CourseDetails = () => {
  const [courseData, setCourseData] = useState({});
  const [studentData, setStudentData] = useState({});
  const { courseId } = useParams();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const { user } = useContext(AppContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentDetails = await fetchStudentDetails(); // Step 1: Fetch student details
        await fetchCourseDetails(); // Step 2: Fetch course details
        await isStudentEnrolled(studentDetails); // Step 3: Check enrollment
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [courseId, user.token, user.userId]); // Add dependencies if needed

  const isStudentEnrolled = async (studentDetails) => {
    try {
      const response = await axios.get(
        `http://localhost:8001/courses/${courseId}/isStudentEnrolled/${studentDetails.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setIsEnrolled(response.data);
    } catch (error) {
      console.error("Error fetching enrollment status", error);
    }
  };

  const fetchStudentDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8001/students/getByUserId/${user.userId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setStudentData(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching student details!", error);
    }
  };

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8001/courses/getById/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setCourseData(response.data);
    } catch (error) {
      console.error("Error fetching course data!", error);
    }
  };

  const handleEnroll = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8001/courses/enroll/${courseId}/${studentData.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(response.data);
      setIsEnrolled(true); // Update the enrollment status
      await fetchCourseDetails(); // Re-fetch course details to reflect changes
    } catch (error) {
      console.error("Error enrolling student to course!", error);
    }
  };

  return (
    <>
      <StudentHeader />
      <section className="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased lg:h-[89vh]">
        <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
            <div className="shrink-0 max-w-md lg:max-w-lg mx-auto lg:my-auto">
              <img className="w-full dark:hidden" src={cardImage} alt="" />
              <img
                className="w-full hidden dark:block"
                src={cardImage}
                alt=""
              />
            </div>

            <div className="mt-6 sm:mt-8 lg:mt-0">
              <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
                {courseData.courseName}
              </h1>
              <div className="mt-4">
                <p className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                  {`Duration : ${courseData.duration}`}
                </p>
              </div>
              <div className="mt-4">
                <p className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                  Students Enrolled:{" "}
                  {courseData.studentsEnrolled
                    ? courseData.studentsEnrolled.length
                    : "NA"}
                </p>
              </div>

              <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
                <button
                  href="#"
                  title=""
                  className="flex items-center justify-center py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-gray-300 rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  onClick={handleEnroll}
                  disabled={isEnrolled}
                >
                  {isEnrolled ? "Already Enrolled" : "Enroll Now"}
                </button>
              </div>

              <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />

              <p className="mb-6 text-gray-500 dark:text-gray-400">
                {courseData.description}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CourseDetails;
