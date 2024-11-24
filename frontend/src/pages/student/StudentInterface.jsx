import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import TopNav from "../../components/student/TopNav";
import WelcomeBanner from "../../components/student/dashboard/WelcomeBanner";
import DateTimeBar from "../../components/student/dashboard/DateTimeBar";
import SpaceBG from "../../assets/img/home/space.png";
import userThree from "../../assets/img/home/unknown.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faClipboardQuestion } from "@fortawesome/free-solid-svg-icons";
import CardTiles from "../../components/student/dashboard/CardTiles";

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState({
    name: "Loading...",
    profilePicture: userThree,
    role: "student",
  });
  const [error, setError] = useState("");

  const fetchStudentData = async () => {
    try {
      const response = await axiosInstance.get("/api/user-student/profile/");
      const data = response.data.student_profile;

      setStudentData({
        first_name: data.first_name,
        name: `${data.first_name} ${data.last_name}`.trim() || "Student",
        profilePicture: data.user_info?.profile_image || userThree,
        role: data.role || "student",
        email: data.email,
        branch: data.branch_name,
        gradeLevel: data.grade_level || "N/A",
      });
    } catch (err) {
      console.error("Error fetching student data:", err);
      setError("Failed to load student data");
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const handleLogout = () => {
    // Implement logout logic here
  };

  return (
    <div className="bg-gradient-to-r from-blue-400 to-purple-500 min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center -z-10"
        style={{
          backgroundImage: `url(${SpaceBG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.3,
        }}
      ></div>
      <div className="font-comic relative z-10">
        <TopNav
          studentData={studentData}
          onLogout={handleLogout}
          onProfileUpdate={fetchStudentData}
        />

        <main className="mt-[calc(5rem+10px)]">
          <div className="container mx-auto px-4">
            <WelcomeBanner studentName={studentData.first_name} />
            <DateTimeBar />

            {/* Main content split into two columns */}
            <div className="flex flex-col md:flex-row gap-6 mt-8">
              {/* Left Column - Cards */}
              <div className="md:w-1/3 space-y-6 xl:pl-32">
                {/* My Classroom Card */}
                <CardTiles icon={faBook} title={"Let's Learn!"} />

                {/* Quizzes Card */}
                <CardTiles icon={faClipboardQuestion} title={"Quiz Time"} />
              </div>

              {/* Right Column - Empty space for additional content */}
              <div className="md:w-2/3">
                <div className="flex justify-center 24">
                  Todo List or Rankings (TBA){" "}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
