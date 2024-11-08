import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { axiosInstance } from "../../../utils/axiosInstance";
import { generatePdf } from "../../../utils/pdfUtils";
import AddAccountModal from "../../../components/modal/admin/AddAccountModal";
import GeneratedAccountModal from "../../../components/modal/admin/GeneratedAccountModal";
import ConfirmDeleteModal from "../../../components/modal/admin/ConfirmDeleteModal";
import TeacherTable from "../../../components/admin/TeacherTable";
import SchawnnahJLoader from "../../../components/loaders/SchawnnahJLoader";
import BiingsAlertSuccesss from "../../../components/alert/BiingsAlertSuccess";
import BiingsAlertError from "../../../components/alert/BiingsAlertError";
import "../../../components/alert/styles/BiingsAlert.css";

const Teacher = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGeneratedModalOpen, setIsGeneratedModalOpen] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [generatedAccounts, setGeneratedAccounts] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);

  useEffect(() => {
    // Fetch data when the component mounts
    fetchData();
  }, []);

  useEffect(() => {
    // Automatically hide success alert after 5 seconds
    if (showSuccessAlert) {
      const timer = setTimeout(() => setShowSuccessAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessAlert]);

  useEffect(() => {
    // Automatically hide error alert after 5 seconds
    if (showErrorAlert) {
      const timer = setTimeout(() => setShowErrorAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showErrorAlert]);

  const fetchData = async () => {
    try {
      // Fetch the list of teachers from the API
      const response = await axiosInstance.get("/user-admin/teacher-list/");
      if (response.status === 200) {
        setTeachers(response.data.teacher_list);
      }
    } catch (error) {
      console.error("An error occurred while fetching the data.");
    }
  };

  const handelGenerateAccount = async (numAccounts, selectedBranch) => {
    try {
      setIsLoading(true);
      // Request to generate teacher accounts
      const response = await axiosInstance.post(
        "/user-admin/generate-account/",
        {
          account_count: numAccounts,
          role: "teacher",
          branch_name: selectedBranch,
        }
      );
      if (response.status === 201) {
        setGeneratedAccounts(response.data.accounts);
        handleOpenGenerateModal();
      }
    } catch (error) {
      console.error(
        "An error occurred while generating teacher accounts.",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAccounts = async () => {
    try {
      // Save generated accounts to the API
      await axiosInstance.post("/user-admin/create-account/", {
        accounts: generatedAccounts,
      });
    } catch (error) {
      console.error(
        "An error occurred while creating teacher accounts.",
        error
      );
    }
  };

  const handleGeneratePdf = async () => {
    try {
      // Generate PDF for the accounts
      await generatePdf("/user-admin/generate-pdf/", generatedAccounts);
    } catch (error) {
      console.error("An error occurred while generating the PDF.");
    }
  };

  const handleSaveAndGenerate = async () => {
    try {
      setIsLoading(true);
      await handleSaveAccounts();
      await handleGeneratePdf();
      setShowSuccessAlert(true);
      fetchData(); // Refresh teacher list
    } catch (error) {
      console.error("An error occurred while saving and generating the PDF.");
      setShowErrorAlert(true);
    } finally {
      setIsLoading(false);
      setIsGeneratedModalOpen(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Request to delete selected teacher accounts
      const response = await axiosInstance.post(
        "/user-admin/custom-user/delete/",
        {
          id: selectedTeachers,
        }
      );

      if (response.status === 200) {
        setIsConfirmDelete(false);
        fetchData();
      }
    } catch (error) {
      console.error("An error occured while deleting the account.");
    }
  };

  const handleOpenGenerateModal = () => {
    setIsModalOpen(false); // Close account creation modal
    setIsGeneratedModalOpen(true); // Open generated accounts modal
  };

  const handleCloseGenerateModal = () => {
    setIsGeneratedModalOpen(false); // Close generated accounts modal
    setIsModalOpen(true); // Reopen account creation modal
  };

  const allSelected =
    teachers &&
    teachers.length > 0 &&
    selectedTeachers.length === teachers.length;

  const isSelected = (id) => selectedTeachers.includes(id); // Check if a teacher is selected

  const handleSelectRow = (event, id) => {
    // Update selected teachers based on checkbox state
    setSelectedTeachers(
      (prev) =>
        event.target.checked
          ? [...prev, id] // Add ID if checked
          : prev.filter((selectedId) => selectedId !== id) // Remove ID if unchecked
    );
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      // Select all if checking the box
      setSelectedTeachers(teachers.map((teacher) => teacher.user_id));
    } else {
      // Unselect only if all were already selected, otherwise preserve individual selections
      if (allSelected) {
        setSelectedTeachers([]);
      }
    }
  };

  return (
    <div className="p-4 md:p-6 min-h-screen font-montserrat">
      <h1 className="text-2xl md:text-4xl text-gray-800 font-bold mb-4">
        Manage Accounts
      </h1>
      <h2 className="text-lg text-gray-700 font-semibold mb-4">Teachers</h2>

      {/* Responsive Button Container */}
      <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition flex items-center mb-2 md:mb-0"
        >
          <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
          Create Account
        </button>
        <button
          onClick={() => setIsConfirmDelete(true)}
          className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition flex items-center"
        >
          <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
          Delete Account
        </button>
      </div>

      {isLoading && <SchawnnahJLoader />}

      <AddAccountModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onGenerateAccount={handelGenerateAccount}
        userType={"Teacher"}
      />

      <GeneratedAccountModal
        isModalOpen={isGeneratedModalOpen}
        setIsModalOpen={setIsGeneratedModalOpen}
        handleCloseModal={handleCloseGenerateModal}
        generatedAccounts={generatedAccounts}
        onSaveAccounts={handleSaveAndGenerate}
      />

      {isConfirmDelete && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-5 z-50">
          <ConfirmDeleteModal
            title="Are you sure you want to delete the selected accounts?"
            onConfirm={handleDeleteAccount}
            onCancel={() => setIsConfirmDelete(false)}
          />
        </div>
      )}

      {showSuccessAlert && (
        <BiingsAlertSuccesss
          userType={"Teacher"}
          className={`animate-fade-in-down ${
            showSuccessAlert
              ? "opacity-100"
              : "opacity-0 transition-opacity duration-500 ease-in-out"
          }`}
        />
      )}
      {showErrorAlert && (
        <BiingsAlertError
          userType={"Teacher"}
          className={`animate-fade-in-down ${
            showErrorAlert
              ? "opacity-100"
              : "opacity-0 transition-opacity duration-500 ease-in-out"
          }`}
        />
      )}

      {isConfirmDelete && (
        <ConfirmDeleteModal
          title="Are you sure you want to delete the selected accounts?"
          onConfirm={handleDeleteAccount}
          onCancel={() => setIsConfirmDelete(false)}
        />
      )}

      <div className="overflow-x-auto">
        <TeacherTable
          teacherAccounts={teachers}
          handleSelectRow={handleSelectRow}
          handleSelectAll={handleSelectAll}
          isSelected={isSelected}
          allSelected={allSelected}
          fetchData={fetchData}
        />
      </div>
    </div>
  );
};

export default Teacher;
