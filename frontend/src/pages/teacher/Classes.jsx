import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import Modal from "./manageclass/Modal"; // Assuming you have a Modal component
// import { QRCodeSVG } from "qrcode.react";
import AddClassroomModal from "../../components/teacher/classroom/AddClassroomModal";
import ClassroomCard from "../../components/teacher/classroom/ClassroomCard";

const ManageLessons = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [classrooms, setClassrooms] = useState([]);

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

  // const [showManageStudentsModal, setShowManageStudentsModal] = useState(false);
  // const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  // // const [newClass, setNewClass] = useState({
  // //   grade: "",
  // //   section: "",
  // //   courseCode: "",
  // //   subject: "",
  // //   students: [],
  // // });
  // const [editingClassIndex, setEditingClassIndex] = useState(null);
  // // const [qrClassroom, setQrClassroom] = useState(null);
  // const [studentName, setStudentName] = useState("");

  // // Ref for the QR Code canvas
  // const qrCodeRef = useRef(null);

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setNewClass((prev) => ({ ...prev, [name]: value }));
  // };

  // const generateUniqueCourseCode = () => {
  //   const prefix = "sunhill-";
  //   const uniqueId = Math.floor(100000 + Math.random() * 900000);
  //   return `${prefix}${uniqueId}`;
  // };

  // const handleAddClass = () => {
  //   const uniqueCourseCode = generateUniqueCourseCode();
  //   const classToAdd = {
  //     ...newClass,
  //     courseCode: uniqueCourseCode,
  //     students: [],
  //   }; // Add students array
  //   setClassrooms((prev) => [...prev, classToAdd]);
  //   setShowModal(false);
  //   resetNewClass();
  // };

  // const handleEditClass = (index) => {
  //   const classToEdit = classrooms[index];
  //   setNewClass(classToEdit);
  //   setEditingClassIndex(index);
  //   setShowEditModal(true);
  // };

  // const handleUpdateClass = () => {
  //   setClassrooms((prev) => {
  //     const updatedClassrooms = [...prev];
  //     updatedClassrooms[editingClassIndex] = newClass;
  //     return updatedClassrooms;
  //   });
  //   setShowEditModal(false);
  //   resetNewClass();
  //   setEditingClassIndex(null);
  // };

  // const handleDeleteClass = (index) => {
  //   setClassrooms((prev) => prev.filter((_, i) => i !== index));
  // };

  // const handleDownloadClass = (classroom) => {
  //   const data = JSON.stringify(classroom);
  //   const blob = new Blob([data], { type: "application/json" });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = `${classroom.courseCode}.json`; // Change to .csv if needed
  //   a.click();
  //   URL.revokeObjectURL(url);
  // };

  // const handleShowQRCode = (classroom) => {
  //   setQrClassroom(classroom);
  //   setShowQRCodeModal(true);
  // };

  // const handleDownloadQRCode = () => {
  //   const canvas = qrCodeRef.current.querySelector("canvas");
  //   if (canvas) {
  //     const pngUrl = canvas.toDataURL("image/png");
  //     const a = document.createElement("a");
  //     a.href = pngUrl;
  //     a.download = `${qrClassroom?.courseCode}_qrcode.png`;
  //     a.click();
  //   }
  // };

  // const handleManageStudents = (index) => {
  //   setEditingClassIndex(index);
  //   setShowManageStudentsModal(true);
  // };

  // const handleAddStudent = () => {
  //   setClassrooms((prev) => {
  //     const updatedClassrooms = [...prev];
  //     updatedClassrooms[editingClassIndex].students.push(studentName);
  //     return updatedClassrooms;
  //   });
  //   setStudentName("");
  // };

  // const resetNewClass = () => {
  //   setNewClass({
  //     grade: "",
  //     section: "",
  //     courseCode: "",
  //     subject: "",
  //     students: [],
  //   });
  // };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Classroom</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
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
            />
          ))}
        </div>
      )}

      <button
        onClick={() => setShowModal(true)}
        className="mt-6 bg-white border-2 border-purple-500 text-purple-500 px-4 py-2 rounded-lg font-semibold"
      >
        + Create Classroom
      </button>

      {/* Modal for Adding Class */}
      <AddClassroomModal
        isOpen={showModal}
        isClose={() => setShowModal(false)}
      />

      {/* Modal for Editing Class */}
      {showEditModal && (
        <Modal onClose={() => setShowEditModal(false)}>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Edit Classroom</h2>
            <select
              name="grade"
              value={newClass.grade}
              onChange={handleInputChange}
              className="border border-gray-300 rounded w-full py-2 px-4 mb-4"
            >
              <option value="" disabled>
                Select Level
              </option>
              {[
                "K1",
                "K2",
                "Grade 1",
                "Grade 2",
                "Grade 3",
                "Grade 4",
                "Grade 5",
                "Grade 6",
              ].map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="section"
              value={newClass.section}
              onChange={handleInputChange}
              className="border border-gray-300 rounded w-full py-2 px-4 mb-4"
              placeholder="Section (e.g. A, B, C)"
            />
            <input
              type="text"
              name="subject"
              value={newClass.subject}
              onChange={handleInputChange}
              className="border border-gray-300 rounded w-full py-2 px-4 mb-4"
              placeholder="Subject"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleUpdateClass}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
              >
                Update Class
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal for Managing Students
      {showManageStudentsModal && (
        <Modal onClose={() => setShowManageStudentsModal(false)}>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Manage Students</h2>
            <ul className="mb-4">
              {classrooms[editingClassIndex]?.students.map((student, idx) => (
                <li key={idx} className="py-1 border-b border-gray-300">
                  {student}
                </li>
              ))}
            </ul>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="border border-gray-300 rounded w-full py-2 px-4 mb-4"
              placeholder="Add Student Name"
            />
            <button
              onClick={handleAddStudent}
              className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600"
            >
              Add Student
            </button>
          </div>
        </Modal>
      )} */}

      {/* Modal for QR Code
      {showQRCodeModal && (
        <Modal onClose={() => setShowQRCodeModal(false)}>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">
              QR Code for {qrClassroom?.courseCode}
            </h2>
            <div ref={qrCodeRef}>
              <QRCodeSVG value={qrClassroom?.courseCode} size={256} />
            </div>
            <button
              onClick={handleDownloadQRCode}
              className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
            >
              Download QR Code
            </button>
          </div>
        </Modal>
      )} */}
    </div>
  );
};

export default ManageLessons;
