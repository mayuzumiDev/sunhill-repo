import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faTrashAlt,
  faEraser,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { axiosInstance } from "../../../utils/axiosInstance";
import { generatePdf } from "../../../utils/pdfUtils";
import AddAccountModal from "../../../components/modal/admin/manage_account/AddAccountModal";
import GeneratedAccountModal from "../../../components/modal/admin/manage_account/GeneratedAccountModal";
import ConfirmDeleteModal from "../../../components/modal/admin/manage_account/ConfirmDeleteModal";
import SchawnnahJLoader from "../../../components/loaders/SchawnnahJLoader";
import BiingsAlertSuccesss from "../../../components/alert/BiingsAlertSuccess";
import BiingsAlertError from "../../../components/alert/BiingsAlertError";
import DeleteSuccessAlert from "../../../components/alert/DeleteSuccessAlert";
import DeleteErrorAlert from "../../../components/alert/DeleteErrorAlert";
import SelectUserErrorAlert from "../../../components/alert/SelectUserErrorAlert";
import TableSearchBar from "../../../components/admin/tables/TableSearchBar";
import TeacherTable from "../../../components/admin/tables/TeacherTable";
import SortBox from "../../../components/admin/tables/SortBox";
import Error from "../../../assets/img/home/error-5.mp3";
import Success from "../../../assets/img/home/success-1.mp3";
import "../../../components/alert/styles/BiingsAlert.css";
import debounce from "lodash.debounce";

const orderByOptionsMap = {
  Newest: "-date_joined",
  Oldest: "date_joined",
  "A-Z": "first_name",
  "Z-A": "-first_name",
};

const Teacher = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGeneratedModalOpen, setIsGeneratedModalOpen] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [generatedAccounts, setGeneratedAccounts] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [showSelectUserError, setShowSelectUserError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOperationRunning, setIsOperationRunning] = useState(false);
  const [branchFilter, setBranchFilter] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [resetSelection, setResetSelection] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    // Fetch data when the component mounts
    fetchData();
  }, [searchTerm, orderBy, branchFilter]);

  useEffect(() => {
    // Automatically hide success alert after 5 seconds
    if (showSuccessAlert) {
      // Play the error sound when the alert is triggered
      const audio = new Audio(Success);
      audio.play();

      // Set a timer to stop the audio
      const timer = setTimeout(() => {
        audio.pause(); // Stop the audio after 5 seconds
        audio.currentTime = 0;
        setShowSuccessAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }

    if (showErrorAlert) {
      const audio = new Audio(Error);
      audio.play();

      const timer = setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
        setShowErrorAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }

    if (showDeleteSuccess) {
      const audio = new Audio(Success);
      audio.play();

      // Set a timer to stop the audio
      const timer = setTimeout(() => {
        audio.pause(); // Stop the audio after 5 seconds
        audio.currentTime = 0;
        setShowDeleteSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }

    if (showDeleteError) {
      const audio = new Audio(Error);
      audio.play();

      // Set a timer to stop the audio
      const timer = setTimeout(() => {
        audio.pause(); // Stop the audio after 5 seconds
        audio.currentTime = 0;
        setShowDeleteError(false);
      }, 5000);
      return () => clearTimeout(timer);
    }

    if (showSelectUserError) {
      // Play the error sound when the alert is triggered
      const audio = new Audio(Error);
      audio.play();

      // Set a timer to stop the audio
      const timer = setTimeout(() => {
        audio.pause(); // Stop the audio after 5 seconds
        audio.currentTime = 0;
        setShowSelectUserError(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [
    showSuccessAlert,
    showErrorAlert,
    showDeleteSuccess,
    showDeleteError,
    showSelectUserError,
  ]);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setIsOperationRunning(value.length >= 2);
    }, 500),
    []
  );

  const handleSearch = (inputValue) => {
    setSearchTerm(inputValue);
    debouncedSearch(inputValue);
  };

  const handleOrderChange = (selectedOrder) => {
    setOrderBy(orderByOptionsMap[selectedOrder] || "");
  };

  const handleBranchChange = (selectedBranch) => {
    setBranchFilter(selectedBranch);

    if (selectedBranch !== "") {
      setIsOperationRunning(true);
    } else {
      setIsOperationRunning(false);
    }
  };

  const handleClearAll = () => {
    setBranchFilter("");
    setOrderBy("");
    setResetSelection((prev) => !prev);
  };

  const fetchData = async () => {
    try {
      setIsEmpty(false);

      const params = {
        ...(searchTerm && { search: searchTerm }),
        ...(branchFilter && { branch_name: branchFilter }),
        ...(orderBy && { ordering: orderBy }),
      };
      // Fetch the list of teachers from the API
      const response = await axiosInstance.get("/user-admin/teacher-list/", {
        params,
      });
      if (response.status === 200) {
        const teacher_list = response.data.teacher_list;
        setTeachers(teacher_list);

        if (teacher_list.length === 0 && !isOperationRunning) {
          setIsEmpty(true);
        }
      }
    } catch (error) {
      console.error("An error occurred while fetching the data.");
    }
  };

  const handleGenerateAccount = async (numAccounts, selectedBranch) => {
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
    if (selectedTeachers.length === 0) {
      setShowSelectUserError(true);
      return;
    }

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
        setShowDeleteSuccess(true);
        fetchData();
        setSelectedTeachers([]); // Clear selected teachers after successful deletion
      }
    } catch (error) {
      console.error("An error occurred while deleting the account.");
      setShowDeleteError(true);
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
      setSelectedTeachers(teachers.map((teacher) => teacher.id));
    } else {
      // Unselect only if all were already selected, otherwise preserve individual selections
      if (allSelected) {
        setSelectedTeachers([]);
      }
    }
  };

  return (
    <div className="p-3 sm:p-6 font-montserrat">
      <h1 className="text-2xl md:text-4xl text-gray-800 font-bold mb-4">
        Manage Accounts{" "}
        <span className="text-lg text-gray-700 font-semibold mb-4">
          {" "}
          Teachers
        </span>
      </h1>

      {/* Top Button Container with Create and Delete */}
      <div className="flex flex-col-reverse md:flex-row justify-between items-center mb-4">
        <div className="flex space-x-4 mb-4 md:mb-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white font-semibold py-2 px-3 rounded-lg hover:bg-blue-600 transition flex items-center text-xs sm:text-lg sm:py-2 sm:px-4"
          >
            <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
            Create Account
          </button>
          <button
            onClick={() => {
              setShowSelectUserError(false);
              if (selectedTeachers.length > 0) {
                setIsConfirmDelete(true); // Show confirmation modal only if users are selected
              } else {
                setShowSelectUserError(true);
              }
            }}
            className="bg-red-500 text-white font-semibold py-2 px-3 rounded-lg hover:bg-red-600 transition flex items-center text-xs sm:text-lg sm:py-2 sm:px-4"
          >
            <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
            Delete Account
          </button>
        </div>
      </div>

      {/* Sorting and Search Container */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        {/* Left-aligned Search */}
        <div className="w-full md:w-auto mb-4 md:mb-0">
          <TableSearchBar onSearch={handleSearch} searchTerm={searchTerm} />
        </div>

        {/* Right-aligned SortBox and Clear All */}
        <div className="flex space-x-4 items-center ml-auto text-xs sm:text-sm">
          <SortBox
            options={["Batangas", "Rosario", "Bauan", "Metro Tagaytay"]}
            label="Branch"
            onSelect={handleBranchChange}
            resetSelection={resetSelection}
            filterType={null}
          />
          <SortBox
            options={["Newest", "Oldest", "A-Z", "Z-A"]}
            label="Sort By"
            onSelect={handleOrderChange}
            resetSelection={resetSelection}
            filterType={null}
          />
          <button
            className="text-gray-700 text-xs sm:text-sm"
            onClick={handleClearAll}
          >
            <FontAwesomeIcon icon={faEraser} /> Clear All
          </button>
        </div>
      </div>

      {isLoading && <SchawnnahJLoader />}

      <AddAccountModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onGenerateAccount={handleGenerateAccount}
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
        <BiingsAlertSuccesss
          userType={"Teacher"}
          className={`animate-fade-in-down ${
            showSuccessAlert ? "opacity-100" : "opacity-0"
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
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-5 z-50">
          <ConfirmDeleteModal
            title="Are you sure you want to delete the selected accounts?"
            onConfirm={handleDeleteAccount}
            onCancel={() => setIsConfirmDelete(false)}
          />
        </div>
      )}
      {showSelectUserError && <SelectUserErrorAlert />}
      {showDeleteSuccess && <DeleteSuccessAlert userType={"Teacher"} />}
      {showDeleteError && <DeleteErrorAlert userType={"Teacher"} />}

      {isEmpty ? (
        <div className="text-center py-4 mt-24">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            size="2x"
            className="text-red-500 mb-2"
          />
          <p>Teacher list is currently empty.</p>
        </div>
      ) : (
        <div className="overflow-y-auto">
          <TeacherTable
            teacherAccounts={teachers}
            handleSelectRow={handleSelectRow}
            handleSelectAll={handleSelectAll}
            isSelected={isSelected}
            allSelected={allSelected}
            fetchData={fetchData}
            isOperationRunning={isOperationRunning}
          />
        </div>
      )}
    </div>
  );
};

export default Teacher;
