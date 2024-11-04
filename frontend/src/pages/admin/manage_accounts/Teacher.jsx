import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { axiosInstance } from "../../../utils/axiosInstance";
import { generatePdf } from "../../../utils/pdfUtils";
import AddAccountModal from "../../../components/modal/AddAccountModal";
import GeneratedAccountModal from "../../../components/modal/GeneratedAccountModal";
import TeacherTable from "../../../components/admin/TeacherTable";
import SchawnnahJLoader from "../../../components/loaders/SchawnnahJLoader";
import BiingsAlertSuccesss from "../../../components/alert/BiingsAlertSuccess";
import BiingsAlertError from "../../../components/alert/BiingsAlertError";
import "../../../components/alert/styles/BiingsAlert.css";

const Teacher = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGeneratedModalOpen, setIsGeneratedModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [generatedAccounts, setGeneratedAccounts] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {}, [generatedAccounts]);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/user-admin/teacher-list/");

      if (response.status === 200) {
        setTeachers(response.data.teacher_list);
      }
    } catch (error) {
      console.error("An error occurred while fetching the data.");
    }
  };

  // Function to handle the generation of accounts
  const handelGenerateAccount = async (numAccounts, selectedBranch) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(
        "/user-admin/generate-account/",
        {
          account_count: numAccounts,
          role: "teacher",
          branch_name: selectedBranch,
        }
      );

      // Check if the response status indicates successful generation of accounts
      if (response.status === 201) {
        setGeneratedAccounts(response.data.accounts); // Update state with the generated accounts data
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

  // Function to handle the addition of teacher accounts
  const handleSaveAccounts = async () => {
    console.log("handleSaveAccounts: ", generatedAccounts);
    try {
      const response = await axiosInstance.post("/user-admin/create-account/", {
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
      await generatePdf("/user-admin/generate-pdf/", generatedAccounts);
    } catch (error) {
      console.error("An error occured while generating the pdf.");
    }
  };

  const handleSaveAndGenerate = async () => {
    try {
      setIsLoading(true);
      await handleSaveAccounts(); // First, attempt to save the accounts

      await handleGeneratePdf(); // if saving is successful, process with PDF generation

      setIsLoading(false);
      setIsGeneratedModalOpen(false);
      setShowSuccessAlert(true);

      const timeoutSuccess = setTimeout(() => {
        setShowSuccessAlert(false);
      }, 1000);

      fetchData();
    } catch (error) {
      console.error("An error  occurred while saving and generating the pdf.");
      setIsLoading(false);
      setIsGeneratedModalOpen(false);
      setShowErrorAlert(true);

      const timeoutError = setTimeout(() => {
        setShowErrorAlert(false);
      }, 1000);
    }
  };

  const handleOpenGenerateModal = () => {
    // Close the previous modal and open the "generated accounts" modal
    setIsModalOpen(false);
    setIsGeneratedModalOpen(true);
  };

  const handleCloseGenerateModal = () => {
    // Close the "generated accounts" modal and open the previous modal
    setIsGeneratedModalOpen(false);
    setIsModalOpen(true);
  };

  const handleSelectRow = (event, id) => {
    if (event.target.checked) {
      setSelectedTeachers([...selectedTeachers, id]);
    } else {
      setSelectedTeachers(
        selectedTeachers.filter((selectedId) => selectedId !== id)
      );
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedTeachers(teachers.map((teacher) => teacher.id));
    } else {
      setSelectedTeachers([]);
    }
  };

  const isSelected = (id) => selectedTeachers.includes(id);
  const allSelected = selectedTeachers.length === teachers.length;

  return (
    <div className="p-6 min-h-screen font-montserrat">
      <h1 className="text-4xl text-gray-800 font-bold mb-4">Manage Accounts</h1>
      <h2 className="text-lg text-gray-700 font-semibold mb-4">Teachers</h2>

      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition flex items-center"
        >
          <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
          Create Account
        </button>
        <button
          onClick={{}}
          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition flex items-center"
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

      {showSuccessAlert && (
        <div>
          <BiingsAlertSuccesss
            userType={"Teacher"}
            className={`animate-fade-in-down ${
              showSuccessAlert
                ? "opacity-100"
                : "opacity-0 transition-opacity duration-500 ease-in-out"
            }`}
          />
        </div>
      )}
      {showErrorAlert && (
        <div>
          <BiingsAlertError
            userType={"Teacher"}
            className={`animate-fade-in-down ${
              showErrorAlert
                ? "opacity-100"
                : "opacity-0 transition-opacity duration-500 ease-in-out"
            }`}
          />
        </div>
      )}

      <TeacherTable
        teacherAccounts={teachers}
        handleSelectRow={handleSelectRow}
        handleSelectAll={handleSelectAll}
        isSelected={isSelected}
        allSelected={allSelected}
      />
    </div>
  );
};

export default Teacher;
