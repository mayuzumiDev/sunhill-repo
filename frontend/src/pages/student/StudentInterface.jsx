import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import TopNav from "../../components/student/TopNav";
import WelcomeBanner from "../../components/student/dashboard/WelcomeBanner";
import DateTimeBar from "../../components/student/dashboard/DateTimeBar";
import CardTiles from "../../components/student/dashboard/CardTiles";
import ClassroomCard from "../../components/student/classrooms/ClassroomCard";
import LearningMaterialsCard from "../../components/student/materials/LearningMaterialsCard";
import QuizCard from "../../components/student/quizzes/QuizCard";
import QuizDetailCard from "../../components/student/quizzes/QuizDetailedCard";
import HideScrollBar from "../../components/misc/HideScrollBar";
import {
  TodoQuizCard,
  EmptyTodoCard,
} from "../../components/student/dashboard/TodoTiles";
import DotLoaderSpinner from "../../components/loaders/DotLoaderSpinner";
import SpaceBG from "../../assets/img/home/space.png";
import userThree from "../../assets/img/home/unknown.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faGraduationCap,
  faListCheck,
  faGamepad,
} from "@fortawesome/free-solid-svg-icons";
import { FaArrowLeft } from "react-icons/fa";

const StudentDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(false);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(false);
  const [showClassrooms, setShowClassrooms] = useState(false);
  const [showQuizzes, setShowQuizzes] = useState(false);

  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isQuizStarted, setIsQuizStarted] = useState(false);

  const [studentData, setStudentData] = useState({
    name: "Loading...",
    profilePicture: userThree,
    role: "student",
  });

  const [classrooms, setClassrooms] = useState([]);
  const [learningMaterials, setLearningMaterials] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    if (selectedClassroom) {
      fetchMaterials(selectedClassroom.classroom_id);
    }
  }, [selectedClassroom]);

  useEffect(() => {
    fetchStudentData();
    fetchClassrooms();
    fetchQuizzes();
  }, []);

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
    }
  };

  const fetchClassrooms = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        "/api/user-student/classrooms/list/"
      );

      if (response.status === 200) {
        const classroom_list = response.data.student_classrooms;
        setClassrooms(classroom_list);
      }
    } catch (error) {
      console.error("An error occured fetching the classrooms.", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMaterials = async (classroomId) => {
    try {
      setIsLoadingMaterials(true);
      const response = await axiosInstance.get(
        "/api/user-student/classroom/materials/",
        {
          params: {
            classroom: classroomId,
          },
        }
      );

      if (response.status === 200) {
        const materialList = response.data.materials_list;
        setLearningMaterials(materialList);
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
      console.log("Error details:", error.response);
    } finally {
      setIsLoadingMaterials(false);
    }
  };

  const fetchQuizzes = async () => {
    setIsLoadingQuizzes(true);
    console.log("fetchQuizzes is running");
    try {
      const response = await axiosInstance.get("/api/user-student/quizzes/");

      if (response.status === 200) {
        const student_quizzes = response.data.student_quizzes;
        console.log("Student Quiz", student_quizzes);
        setQuizzes(student_quizzes);
      }
    } catch (error) {
      console.error("An erro occured fetching the quizzes");
    } finally {
      setIsLoadingQuizzes(false);
    }
  };

  const handleMaterialClick = (material) => {
    console.log("Material is Click");
  };

  const handleLogout = () => {
    // Implement logout logic here
  };

  return (
    <div className="bg-gradient-to-r from-blue-400 to-purple-500 min-h-screen relative overflow-hidden scrollbar-hide">
      <HideScrollBar />
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${SpaceBG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.3,
        }}
      ></div>
      <div className="font-comic relative z-10 h-screen overflow-y-auto scrollbar-hide">
        <TopNav
          studentData={studentData}
          onLogout={handleLogout}
          onProfileUpdate={fetchStudentData}
        />

        <main className="mt-[calc(5rem+10px)]">
          <div className="container mx-auto px-4 pb-8">
            {!showClassrooms && !showQuizzes ? (
              // Initial content
              <>
                <WelcomeBanner studentName={studentData.first_name} />
                <DateTimeBar />

                {/* Main content split into two columns */}
                <div className="flex flex-col md:flex-row gap-6 mt-8">
                  {/* Left Column - To Do List */}
                  <div className="md:w-2/3">
                    <div className="flex justify-center items-center h-full">
                      <div className="w-full max-w-2xl">
                        {/* To Do List Header Card */}
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 shadow-lg mb-6 relative overflow-hidden">
                          {/* Background decoration */}
                          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white rounded-full opacity-10" />
                          <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-white rounded-full opacity-10" />

                          <h2 className="text-2xl font-bold text-white mb-2 relative">
                            My To Do List
                          </h2>
                          <p className="text-purple-100 text-sm relative">
                            Keep track of your learning journey!
                          </p>
                        </div>

                        {/* Quiz Cards Container */}
                        <div className="space-y-4">
                          {isLoadingQuizzes ? (
                            <div className="flex justify-center items-center min-h-[200px]">
                              <DotLoaderSpinner color="#6B21A8" />
                            </div>
                          ) : quizzes.filter((quiz) => !quiz.has_submitted)
                              .length > 0 ? (
                            quizzes
                              .filter((quiz) => !quiz.has_submitted)
                              .map((quiz, index) => (
                                <TodoQuizCard
                                  key={quiz.id}
                                  quiz={quiz}
                                  index={index}
                                  onClick={() => {
                                    setSelectedQuiz(quiz);
                                    setShowQuizzes(true);
                                  }}
                                />
                              ))
                          ) : (
                            <EmptyTodoCard />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Cards */}
                  <div className="md:w-1/3 space-y-6">
                    {/* My Classroom Card */}
                    <CardTiles
                      icon={faBook}
                      title={"Let's Learn!"}
                      onClick={() => setShowClassrooms(true)}
                    />

                    {/* Quizzes Card */}
                    <CardTiles
                      icon={faListCheck}
                      title={"My Quizzes"}
                      onClick={() => setShowQuizzes(true)}
                    />
                  </div>
                </div>
              </>
            ) : (
              // Classroom or Quiz content
              <div className="p-4">
                {!selectedClassroom && (
                  <button
                    onClick={() => {
                      setShowClassrooms(false);
                      setShowQuizzes(false);
                      setSelectedClassroom(false);
                      setSelectedQuiz(false);
                    }}
                    className="mb-6 flex items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    Let's Go Back!
                  </button>
                )}

                {showClassrooms && (
                  <div className="bg-white p-6 rounded-lg shadow-lg overflow-hidden scrollbar-hide">
                    {!selectedClassroom ? (
                      <>
                        <h2 className="text-3xl font-bold text-purple-800 mb-4">
                          My Classrooms
                        </h2>
                        <p className="text-gray-600 text-lg mb-6">
                          Welcome to your virtual classrooms! Here you can find
                          all your learning materials.
                        </p>
                        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center overflow-hidden scrollbar-hide">
                          {isLoading ? (
                            <div className="col-span-3 flex justify-center items-center min-h-[300px]">
                              <DotLoaderSpinner color="#6B21A8" />
                            </div>
                          ) : classrooms.length > 0 ? (
                            classrooms.map((classroom) => (
                              <ClassroomCard
                                key={classroom.id}
                                classroomData={classroom}
                                onSelect={() => setSelectedClassroom(classroom)}
                              />
                            ))
                          ) : (
                            <p className="text-gray-500 col-span-3 text-center">
                              No classrooms available. Please contact your
                              administrator.
                            </p>
                          )}
                        </div>
                      </>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-2xl font-bold text-purple-800">
                            Learning Materials
                          </h2>
                          <button
                            onClick={() => setSelectedClassroom(null)}
                            className="flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                          >
                            <span>Back to Classrooms</span>
                          </button>
                        </div>
                        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center overflow-hidden scrollbar-hide">
                          {isLoadingMaterials ? (
                            <div className="col-span-3 flex justify-center items-center min-h-[300px]">
                              <DotLoaderSpinner color="#6B21A8" />
                            </div>
                          ) : learningMaterials &&
                            learningMaterials.length > 0 ? (
                            learningMaterials.map((material) => (
                              <LearningMaterialsCard
                                key={material.id}
                                material={material}
                                onClick={() => {
                                  handleMaterialClick(material);
                                }}
                              />
                            ))
                          ) : (
                            <p className="text-gray-500 col-span-3 text-center">
                              No learning materials available for this
                              classroom.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {showQuizzes && (
                  <div className="bg-white p-6 rounded-lg shadow-lg overflow-hidden scrollbar-hide">
                    <h2 className="text-3xl font-bold text-purple-800 mb-4">
                      {selectedQuiz ? selectedQuiz.title : "Your Quiz Journey"}
                    </h2>
                    {!selectedQuiz && (
                      <p className="text-gray-600 text-lg mb-6">
                        Here you can see all your quizzes - both the ones you
                        need to take and the ones you've completed!
                      </p>
                    )}
                    <div className="flex flex-col space-y-2 px-4 overflow-hidden scrollbar-hide">
                      {isLoadingQuizzes ? (
                        <div className="col-span-3 flex justify-center items-center min-h-[300px]">
                          <DotLoaderSpinner color="#6B21A8" />
                        </div>
                      ) : selectedQuiz ? (
                        <QuizDetailCard
                          quizData={selectedQuiz}
                          isQuizStarted={isQuizStarted}
                          onStartQuiz={() => {
                            setIsQuizStarted(true);
                          }}
                          onBack={() => {
                            setSelectedQuiz(null);
                            setIsQuizStarted(false);
                          }}
                        />
                      ) : quizzes && quizzes.length > 0 ? (
                        [...quizzes]
                          .sort((a, b) => {
                            if (a.has_submitted === b.has_submitted) {
                              return a.id - b.id;
                            }
                            return a.has_submitted ? 1 : -1;
                          })
                          .map((quiz) => (
                            <QuizCard
                              key={quiz.id}
                              quizData={quiz}
                              onSelect={setSelectedQuiz}
                            />
                          ))
                      ) : (
                        <>
                          <p className="text-gray-500 col-span-3 text-center">
                            No Quizzes Right Now!
                          </p>
                          <p className="text-gray-600 col-span-3 text-center">
                            Time to take a break and come back later for some
                            fun quiz challenges!
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
