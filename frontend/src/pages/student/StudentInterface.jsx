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
// import userThree from "../../assets/img/home/unknown.jpg";
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
  const [hasQuizScore, setHasQuizScore] = useState(false);

  const [studentData, setStudentData] = useState({
    name: "Loading...",
    profilePicture: null,
    role: "student",
  });

  const [classrooms, setClassrooms] = useState([]);
  const [learningMaterials, setLearningMaterials] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [activeFilter, setActiveFilter] = useState("quiz");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
        profilePicture: data.user_info?.profile_image || null,
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

  const handleQuizComplete = (completed) => {
    if (completed && selectedQuiz) {
      // Update the status of the completed quiz in the quizzes array
      setQuizzes((prevQuizzes) =>
        prevQuizzes.map((quiz) =>
          quiz.id === selectedQuiz.id ? { ...quiz, has_submitted: true } : quiz
        )
      );
      // // Reset quiz states
      // setIsQuizStarted(false);
      // setSelectedQuiz(null);
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
      <div className="font-sans md:font-comic relative z-10 h-screen overflow-y-auto scrollbar-hide">
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
                            My To-Do List
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
                          ) : quizzes.filter(
                              (quiz) =>
                                !quiz.has_submitted &&
                                Date.parse(quiz.due_date) > Date.now()
                            ).length > 0 ? (
                            quizzes
                              .filter(
                                (quiz) =>
                                  !quiz.has_submitted &&
                                  Date.parse(quiz.due_date) > Date.now()
                              )
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
                      title={"My Quizzes & Activities"}
                      onClick={() => setShowQuizzes(true)}
                    />
                  </div>
                </div>
              </>
            ) : (
              // Classroom or Quiz content
              <div className="p-4">
                {!selectedClassroom && !hasQuizScore && !isQuizStarted && (
                  <button
                    onClick={() => {
                      setShowClassrooms(false);
                      setShowQuizzes(false);
                      setSelectedClassroom(false);
                      setSelectedQuiz(false);
                      setHasQuizScore(false);
                      setIsQuizStarted(false);
                    }}
                    className="mb-6 flex items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    Let's Go Back!
                  </button>
                )}

                {showClassrooms && (
                  <div className="bg-white p-6 rounded-lg shadow-lg overflow-hidden scrollbar-hide lg:max-w-[1000px] xl:max-w-[1200px] mx-auto">
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
                        <div className="flex flex-col space-y-4 overflow-hidden scrollbar-hide max-w-4xl mx-auto">
                          {isLoadingMaterials ? (
                            <div className="flex justify-center items-center min-h-[300px]">
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
                            <div className="flex flex-col items-center justify-center py-10">
                              <div className="text-6xl mb-4">📚</div>
                              <h3 className="text-xl font-semibold text-purple-800 mb-2">
                                No Learning Materials Yet
                              </h3>
                              <p className="text-gray-600 text-center">
                                No learning materials available for this
                                classroom.
                                <br />
                                Check back later for updates!
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {showQuizzes && (
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg overflow-hidden scrollbar-hide lg:max-w-[1000px] xl:max-w-[1200px] mx-auto">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-800 truncate">
                        {selectedQuiz
                          ? selectedQuiz.title
                          : "Your Quizzes & Activities"}
                      </h2>
                      {!selectedQuiz && (
                        <div className="relative bg-purple-100 rounded-full p-1 min-w-[200px]">
                          <div
                            className={`absolute top-1 ${
                              activeFilter === "quiz"
                                ? "left-1"
                                : "left-[102px]"
                            } w-[96px] h-8 bg-purple-600 rounded-full transition-all duration-300 ease-in-out`}
                          />
                          <div className="relative flex justify-between">
                            <button
                              onClick={() => setActiveFilter("quiz")}
                              className={`w-24 h-8 rounded-full font-medium text-sm transition-colors duration-300 ${
                                activeFilter === "quiz"
                                  ? "text-white"
                                  : "text-purple-600"
                              }`}
                            >
                              Quizzes
                            </button>
                            <button
                              onClick={() => setActiveFilter("activity")}
                              className={`w-24 h-8 rounded-full font-medium text-sm transition-colors duration-300 ${
                                activeFilter === "activity"
                                  ? "text-white"
                                  : "text-purple-600"
                              }`}
                            >
                              Activities
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {!selectedQuiz && (
                      <>
                        <div className="flex items-center justify-between mb-6">
                          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                            Here you can see all your quizzes or activities -
                            both the ones you need to take and the ones you've
                            completed!
                          </p>
                        </div>
                      </>
                    )}

                    <div className="flex flex-col space-y-2 px-2 sm:px-4 overflow-hidden scrollbar-hide">
                      {isLoadingQuizzes ? (
                        <div className="col-span-3 flex justify-center items-center min-h-[200px] sm:min-h-[300px]">
                          <DotLoaderSpinner color="#6B21A8" />
                        </div>
                      ) : selectedQuiz ? (
                        <QuizDetailCard
                          quizData={selectedQuiz}
                          isQuizStarted={isQuizStarted}
                          onQuizComplete={handleQuizComplete}
                          onQuizScoreChange={setHasQuizScore}
                          onStartQuiz={() => {
                            setIsQuizStarted(true);
                          }}
                          onBack={() => {
                            setSelectedQuiz(null);
                            setIsQuizStarted(false);
                            setHasQuizScore(false);
                          }}
                        />
                      ) : quizzes && quizzes.length > 0 ? (
                        <>
                          {[...quizzes]
                            .filter(
                              (quiz) =>
                                activeFilter === "all" ||
                                quiz.type_of === activeFilter
                            )
                            .sort((a, b) => {
                              if (a.has_submitted === b.has_submitted) {
                                return a.id - b.id;
                              }
                              return a.has_submitted ? 1 : -1;
                            })
                            .slice(
                              (currentPage - 1) * itemsPerPage,
                              currentPage * itemsPerPage
                            )
                            .map((quiz) => (
                              <QuizCard
                                key={quiz.id}
                                quizData={quiz}
                                onSelect={setSelectedQuiz}
                              />
                            ))}
                          {/* Pagination Controls */}
                          <div className="mt-6 sm:mt-8 border-t border-purple-200"></div>
                          <div className="flex justify-between sm:justify-center items-center space-x-4 mt-6 sm:mt-8 mb-4 sm:mb-6">
                            <button
                              onClick={() =>
                                setCurrentPage((prev) => Math.max(1, prev - 1))
                              }
                              disabled={currentPage === 1}
                              className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base transition-all duration-300 ${
                                currentPage === 1
                                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                  : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transform hover:scale-105"
                              }`}
                            >
                              Previous
                            </button>
                            <span className="text-gray-600 text-sm sm:text-base font-medium">
                              Page {currentPage} of{" "}
                              {Math.ceil(
                                quizzes.filter(
                                  (quiz) =>
                                    activeFilter === "all" ||
                                    quiz.type_of === activeFilter
                                ).length / itemsPerPage
                              )}
                            </span>
                            <button
                              onClick={() =>
                                setCurrentPage((prev) =>
                                  Math.min(
                                    Math.ceil(
                                      quizzes.filter(
                                        (quiz) =>
                                          activeFilter === "all" ||
                                          quiz.type_of === activeFilter
                                      ).length / itemsPerPage
                                    ),
                                    prev + 1
                                  )
                                )
                              }
                              disabled={
                                currentPage >=
                                Math.ceil(
                                  quizzes.filter(
                                    (quiz) =>
                                      activeFilter === "all" ||
                                      quiz.type_of === activeFilter
                                  ).length / itemsPerPage
                                )
                              }
                              className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base transition-all duration-300 ${
                                currentPage >=
                                Math.ceil(
                                  quizzes.filter(
                                    (quiz) =>
                                      activeFilter === "all" ||
                                      quiz.type_of === activeFilter
                                  ).length / itemsPerPage
                                )
                                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                  : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transform hover:scale-105"
                              }`}
                            >
                              Next
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center mt-8">
                          <p className="text-gray-500 text-sm sm:text-base">
                            No{" "}
                            {activeFilter === "quiz" ? "Quizzes" : "Activities"}{" "}
                            Right Now!
                          </p>
                          <p className="text-gray-600 text-sm sm:text-base">
                            Time to take a break and come back later for some
                            fun quiz/activity challenges!
                          </p>
                        </div>
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
