import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import QuizResponseTable from "../../components/teacher/scores/QuizResponseTable";
import ClassroomSelector from "../../components/teacher/scores/ClassroomSelector";

const StudentScores = () => {
  const [tableLoading, setTableLoading] = useState(false);
  const [quizResponses, setQuizResponses] = useState([]);

  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState([]);

  useEffect(() => {
    fetchClassrooms();
  }, []);

  useEffect(() => {
    if (selectedClassroom) {
      fetchQuizScores();
    }
  }, [selectedClassroom]);

  const fetchClassrooms = async () => {
    try {
      const response = await axiosInstance.get("/user-teacher/classroom/list/");

      if (response.status === 200) {
        const classroom_list = response.data.classroom_list;
        setClassrooms(classroom_list);
      }
    } catch (error) {
      console.log("An error occured fetching the classrooms.", error);
    }
  };

  const fetchQuizScores = async () => {
    setTableLoading(true);
    try {
      const response = await axiosInstance.get(
        "/user-teacher/quiz-scores/list/",
        {
          params: {
            classroom: selectedClassroom,
          },
        }
      );

      if (response.status === 200) {
        const quiz_scores = response.data.quiz_scores;
        console.log("Quiz score", quiz_scores);
        setQuizResponses(quiz_scores);
      }
    } catch (error) {
      console.error("An error occured fetching the quiz scores.", error);
    } finally {
      setTableLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Student Scores</h2>
      <ClassroomSelector
        selectedClassroom={selectedClassroom}
        classrooms={classrooms}
        onClassroomChange={setSelectedClassroom}
      />
      <QuizResponseTable responses={quizResponses} isLoading={tableLoading} />
    </div>
  );
};

export default StudentScores;
