import React, { useContext, useEffect, useState } from "react";
import StudentHeader from "../../components/Student-Components/StudentHeader";
import CourseCard from "../../components/Student-Components/CourseCard";
import axios from "axios";
import AppContext from "../../context/AppContext";
import Footer from "../../components/Global/Footer";

const StudentHome = () => {
  const [coursesData, setCoursesData] = useState([]);

  const { user } = useContext(AppContext);

  useEffect(() => {
    fetchCourses();
  }, []);

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

  return (
    <>
      <StudentHeader />
      <div
        id="container"
        className="flex flex-row flex-wrap justify-around gap-x-[20px] gap-y-[40px] mt-[100px] mb-[50px]"
      >
        {coursesData.map((course) => (
          <CourseCard
            key={course.id}
            courseId={course.id}
            courseName={course.courseName}
            description={course.description}
          />
        ))}
      </div>
      <div className="">
        <Footer />
      </div>
    </>
  );
};

export default StudentHome;
