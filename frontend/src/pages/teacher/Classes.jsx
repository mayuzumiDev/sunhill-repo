import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { axiosInstance } from "../../utils/axiosInstance";
import AddClassroomModal from "../../components/teacher/classroom/AddClassroomModal";
import EditClassroomModal from "../../components/modal/teacher/classroom/EditClassroomModal";
import ClassroomCard from "../../components/teacher/classroom/ClassroomCard";
import ClassroomActions from "../../components/teacher/ClassroomActions";
import ConfirmDeleteModal from "../../components/modal/teacher/ConfirmDeleteModal";
import AddStudentModal from "../../components/modal/teacher/classroom/AddStudentModal";
import DotLoaderSpinner from "../../components/loaders/DotLoaderSpinner";
import HideScrollBar from "../../components/misc/HideScrollBar";

const ManageLessons = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);

  useEffect(() => {
    fetchClassroom();
  }, []);

  const fetchClassroom = async () => {
    try {
      setIsLoading(true);

      const response = await axiosInstance.get("/user-teacher/classroom/list/");

      if (response.status === 200) {
        const classroomList = response.data.classroom_list;
        setClassrooms(classroomList);
      }
    } catch (error) {
      console.error("An error occured fetching the classroom list.", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClassroom = async (classroom, formData) => {
    try {
      const response = await axiosInstance.patch(
        `/user-teacher/classroom/edit/${classroom.id}/`,
        formData
      );

      if (response.status === 200) {
        await fetchClassroom();
      }
    } catch (error) {
      console.error("An error occured editing the classroom.", error);
    }
  };

  const handleAddStudent = async (data) => {
    try {
      const addPromises = data.students.map(({ student }) =>
        axiosInstance.post(`/user-teacher/classroom/add-student/`, {
          classroom: selectedClassroom,
          student: student,
        })
      );

      await Promise.all(addPromises);
      setShowAddStudent(false);
    } catch (error) {
      console.error("Error adding students to classroom:", error);

      const errorMessage =
        error.response?.data?.errors?.error?.[0] ||
        "Error adding students to classroom";

      setShowAddStudent(true);
      return errorMessage;
    }
  };

  const handleDeleteClassroom = async (classroomID) => {
    try {
      const response = await axiosInstance.delete(
        `/user-teacher/classroom/delete/${classroomID}/`
      );

      if (response.status === 200) {
        setSelectedClassroom(null);
        await fetchClassroom();
      }
    } catch (error) {
      console.error("An error occured deleting the classroom.", error);
    }
  };

  const handleClassroomCreated = async (newClassroom) => {
    if (!newClassroom) return;

    // Format classroom data to match the list structure
    const formattedClassroom = {
      id: newClassroom.id,
      grade_level: newClassroom.grade_level,
      class_section: newClassroom.class_section,
      subject_name: newClassroom.subject_name,
      students: [], // New classrooms start with no students
      student_count: 0, // Initialize student count to 0
    };

    await fetchClassroom();
    /* 
    setClassrooms((prevClassrooms) => [...prevClassrooms, formattedClassroom]);
    setShowModal(false); */
  };

  return (
    <div className="p-6">
      <HideScrollBar />
      <h1 className="text-2xl font-bold mb-4 text-gray-500">Classroom</h1>
      {showActions && selectedClassroom ? (
        <ClassroomActions
          key={selectedClassroom.id}
          classroomData={selectedClassroom}
          onClose={() => {
            setShowActions(false);
            setSelectedClassroom(null);
          }}
        />
      ) : (
        <>
          {/* Button for creating classroom */}
          <button
            onClick={() => setShowModal(true)}
            className="group bg-white border-2 border-green-500 hover:bg-green-500 text-green-500 hover:text-white px-6 py-2.5 rounded-lg font-semibold mb-6 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
          >
            <FontAwesomeIcon
              icon={faPlus}
              className="text-sm transition-transform duration-300 group-hover:rotate-90"
            />
            <span>Create Classroom</span>
          </button>

          {/* Grid List for classroom */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <DotLoaderSpinner color="#4ade80" />
            </div>
          ) : classrooms.length === 0 ? (
            <p className="text-gray-600">
              No classroom available. Please create a classroom.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classrooms.map((classroom, index) => (
                <ClassroomCard
                  key={classroom.id || index}
                  classroomData={classroom}
                  onEdit={() => {
                    setShowEditModal(true);
                    setSelectedClassroom(classroom);
                  }}
                  onDelete={() => {
                    setShowDeleteModal(true);
                    setSelectedClassroom(classroom.id);
                  }}
                  addStudent={() => {
                    setShowAddStudent(true);
                    setSelectedClassroom(classroom.id);
                  }}
                  onView={() => {
                    console.log("Selecting classroom:", classroom);
                    setSelectedClassroom(classroom);
                    setShowActions(true);
                  }}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal for Adding Classroom */}
      <AddClassroomModal
        isOpen={showModal}
        isClose={() => setShowModal(false)}
        onSuccess={handleClassroomCreated}
      />

      {/* Modal for Editing CLassroom */}
      <EditClassroomModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={(formData) => handleEditClassroom(selectedClassroom, formData)}
        classroomData={selectedClassroom}
      />

      <AddStudentModal
        isOpen={showAddStudent}
        onClose={() => setShowAddStudent(false)}
        onAdd={handleAddStudent}
      />

      {/* Modal for confirm delete */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => handleDeleteClassroom(selectedClassroom)}
        message={"Are you sure to delete this classroom?"}
      />
    </div>
  );
};

export default ManageLessons;
