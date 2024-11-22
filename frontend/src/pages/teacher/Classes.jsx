import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { axiosInstance } from "../../utils/axiosInstance";
import AddClassroomModal from "../../components/teacher/classroom/AddClassroomModal";
import EditClassroomModal from "../../components/modal/teacher/classroom/EditClassroomModal";
import ClassroomCard from "../../components/teacher/classroom/ClassroomCard";
import ConfirmDeleteModal from "../../components/modal/teacher/ConfirmDeleteModal";
import AddStudentModal from "../../components/modal/teacher/classroom/AddStudentModal";

const ManageLessons = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);

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
        console.log("Classroom list: ", classroomList);
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

      // Optionally refresh the classroom data
      fetchClassroom();
    } catch (error) {
      console.error("Error adding students to classroom:", error);
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Classroom</h1>

      {/* Button for creating classroom */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-white border-2 border-purple-500 text-purple-500 px-4 py-2 rounded-lg font-semibold mb-6"
      >
        <FontAwesomeIcon icon={faPlus} className="text-sm mr-2" />
        Create Classroom
      </button>

      {/* Grid List for classroom */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-400"></div>
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
            />
          ))}
        </div>
      )}

      {/* Modal for Adding Classroom */}
      <AddClassroomModal
        isOpen={showModal}
        isClose={() => setShowModal(false)}
      />

      {/* Modal for Editing CLassroom */}
      <EditClassroomModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={(formData) => handleEditClassroom(selectedClassroom, formData)}
        classroomData={selectedClassroom}
      />

      {/* Modal for Adding Student to Classroom */}
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
