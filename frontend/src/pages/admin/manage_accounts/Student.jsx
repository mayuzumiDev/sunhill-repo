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
import SchawnnahJLoader from "../../../components/loaders/SchawnnahJLoader";
import AddStudentModal from "../../../components/modal/admin/manage_account/AddStudentModal";
import GeneratedStudentModal from "../../../components/modal/admin/manage_account/GeneratedStudentModal";
import ConfirmDeleteModal from "../../../components/modal/admin/manage_account/ConfirmDeleteModal";
import BiingsAlertSuccess from "../../../components/alert/BiingsAlertSuccess";
import BiingsAlertError from "../../../components/alert/BiingsAlertError";
import DeleteSuccessAlert from "../../../components/alert/DeleteSuccessAlert";
import DeleteErrorAlert from "../../../components/alert/DeleteErrorAlert";
import SelectUserErrorAlert from "../../../components/alert/SelectUserErrorAlert";
import StudentTable from "../../../components/admin/tables/StudentTable";
import TableSearchBar from "../../../components/admin/tables/TableSearchBar";
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

const Student = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGeneratedModalOpen, setIsGeneratedModalOpen] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [showSelectUserError, setShowSelectUserError] = useState(false);
  const [resetSelection, setResetSelection] = useState(false);

  const [generatedAccounts, setGeneratedAccounts] = useState([]);
  const [students, setStudents] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [isOperationRunning, setIsOperationRunning] = useState(false);
  const [filters, setFilters] = useState({
    branch: "",
    grade: "",
    specialNeeds: "",
  });
  const [orderBy, setOrderBy] = useState("");
  const [selectedStudents, setSelectedStudents] = useState("");

  useEffect(() => {
    fetchData();
  }, [searchTerm, filters, orderBy]);

  useEffect(() => {
    // Automatically hide success alert after 5 seconds
    if (showSuccessAlert) {
      // Play the error sound when the alert is triggered
      const audio = new Audio(Success);
      audio.play();

      const timer = setTimeout(() => {
        audio.pause();
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

  const allSelected =
    students &&
    students.length > 0 &&
    selectedStudents.length === students.length;

  const isSelected = (id) => selectedStudents.includes(id);

  const handleSelectRow = (event, id) => {
    // Update selected students based on checkbox state
    setSelectedStudents(
      (prev) =>
        event.target.checked
          ? [...prev, id] // Add ID if checked
          : prev.filter((selectedId) => selectedId !== id) // Remove ID if unchecked
    );
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      // Select all if checking the box
      setSelectedStudents(students.map((students) => students.id));
    } else {
      // Unselect only if all were already selected, otherwise preserve individual selections
      if (allSelected) {
        setSelectedStudents([]);
      }
    }
  };

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

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));

    if (value !== "") {
      setIsOperationRunning(true);
    } else {
      setIsOperationRunning(false);
    }
  };

  const handleOrderChange = (selectedOrder) => {
    setOrderBy(orderByOptionsMap[selectedOrder] || "");
  };

  const handleClearAll = () => {
    setFilters("");
    setOrderBy("");
    setResetSelection((prev) => !prev);
  };

  const fetchData = async () => {
    try {
      setIsEmpty(false);

      const params = {
        ...(searchTerm && { search: searchTerm }),
        ...(filters.branch && { branch_name: filters.branch }),
        ...(filters.grade && { grade_level: filters.grade }),
        ...(filters.specialNeeds !== "" && {
          has_special_needs: filters.specialNeeds,
        }),
        ...(orderBy && { ordering: orderBy }),
      };

      const response = await axiosInstance.get("/user-admin/student-list/", {
        params,
      });

      if (response.status === 200) {
        const student_list = response.data.student_list;
        console.log(student_list);
        setStudents(student_list);

        if (student_list.length === 0 && !isOperationRunning) {
          setIsEmpty(true);
        }
      }
    } catch (error) {
      console.error("An error occured while fetching data", error);
    }
  };

  const handleGenerateAccount = async (numAccounts, selectedBranch) => {
    try {
      setIsLoading(true);

      const response = await axiosInstance.post(
        "/user-admin/generate-account/",
        {
          account_count: numAccounts,
          role: "student",
          branch_name: selectedBranch,
        }
      );

      if (response.status === 201) {
        setGeneratedAccounts(response.data.accounts);
        handleOpenGenerateModal();
      }
    } catch (error) {
      console.error(
        "An error occured while generating teacher accounts",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAccounts = async () => {
    try {
      await axiosInstance.post("/user-admin/create-account/", {
        accounts: generatedAccounts,
      });
    } catch (error) {
      console.error("An error occured while saving accounts", error);
    }
  };

  const handleGeneratePdf = async () => {
    try {
      await generatePdf("/user-admin/generate-pdf/student/", generatedAccounts);
    } catch (error) {
      console.error("An error occured while generating pdf", error);
    }
  };

  const handleSaveAndGenerate = async () => {
    try {
      setIsLoading(true);

      await handleSaveAccounts();
      await handleGeneratePdf();

      setShowSuccessAlert(true);
      fetchData();
    } catch (error) {
      console.error("An error occured while saving and generating", error);
    } finally {
      setIsLoading(false);
      setIsGeneratedModalOpen(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (selectedStudents.length === 0) {
      setShowSelectUserError(true);
      return;
    }

    try {
      // Request to delete selected teacher accounts
      const response = await axiosInstance.post(
        "/user-admin/custom-user/delete/",
        {
          id: selectedStudents,
        }
      );

      if (response.status === 200) {
        setIsConfirmDelete(false);
        setShowDeleteSuccess(true);
        fetchData();
        setSelectedStudents([]);
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

  return (
    <div className="p-3 sm:p-6 font-montserrat">
      <h1 className="text-2xl md:text-4xl text-gray-800 font-bold mb-4">
        Manage Accounts{" "}
        <span className="text-lg text-gray-700 font-semibold mb-4">
          {" "}
          Students
        </span>
      </h1>

      {/* Top Button Container with Create and Delete */}
      <div className="flex flex-col-reverse md:flex-row justify-between items-center mb-4">
        <div className="flex space-x-4 mb-4 md:mb-0">
          <button
            className="bg-blue-500 text-white font-semibold py-2 px-3 rounded-lg hover:bg-blue-600 transition flex items-center text-xs sm:text-lg sm:py-2 sm:px-4"
            onClick={() => setIsModalOpen(true)}
          >
            <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
            Create Account
          </button>
          <button
            className="bg-red-500 text-white font-semibold py-2 px-3 rounded-lg hover:bg-red-600 transition flex items-center text-xs sm:text-lg sm:py-2 sm:px-4"
            onClick={() => {
              setShowSelectUserError(false);
              if (selectedStudents.length > 0) {
                setIsConfirmDelete(true); // Show confirmation modal only if users are selected
              } else {
                setShowSelectUserError(true); // Show error alert if no users are selected
              }
            }}
          >
            <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
            Delete Account
          </button>
        </div>
      </div>

      {/* Sorting, Filtering, and Search Container */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        {/* Search Bar */}
        <div className="w-full md:w-auto mb-4 md:mb-0">
          <TableSearchBar onSearch={handleSearch} searchTerm={searchTerm} />
        </div>

        {/* Sort and Filter Options */}
        <div className="flex  md:flex-row space-y-2 md:space-x-4  md:space-y-1 items-center text-xs sm:text-sm  ">
          <SortBox
            options={["Batangas", "Rosario", "Bauan", "Metro Tagaytay"]}
            label="Branch"
            onSelect={handleFilterChange}
            resetSelection={resetSelection}
            filterType={"branch"}
          />
          <SortBox
            options={[
              "Nursery",
              "Casa 1",
              "Casa 2",
              "Grade 1",
              "Grade 2",
              "Grade 3",
              "Grade 4",
              "Grade 5",
              "Grade 6",
            ]}
            label="Grade Level"
            onSelect={handleFilterChange}
            resetSelection={resetSelection}
            filterType={"grade"}
          />
          <SortBox
            options={["Yes", "No"]}
            label="Special Needs"
            onSelect={(_, value) =>
              handleFilterChange(
                "specialNeeds",
                value === "Yes" ? "true" : "false"
              )
            }
            resetSelection={resetSelection}
            filterType={"specialNeeds"}
          />
          <SortBox
            options={["Newest", "Oldest", "A-Z", "Z-A"]}
            label="Sort By"
            onSelect={handleOrderChange}
            resetSelection={resetSelection}
            filterType={null}
          />
          <button
            className="text-gray-700 text-xs sm:text-sm flex items-center mt-2 md:mt-0"
            onClick={handleClearAll}
          >
            <FontAwesomeIcon icon={faEraser} className="mr-1" /> Clear All
          </button>
        </div>
      </div>

      {isLoading && <SchawnnahJLoader />}

      <AddStudentModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onGenerateAccount={handleGenerateAccount}
      />

      <GeneratedStudentModal
        isModalOpen={isGeneratedModalOpen}
        setIsModalOpen={setIsGeneratedModalOpen}
        handleCloseModal={handleCloseGenerateModal}
        generatedAccounts={generatedAccounts}
        onSaveAccounts={handleSaveAndGenerate}
      />
      {showSuccessAlert && (
        <BiingsAlertSuccess
          userType={"Student"}
          className={`animate-fade-in-down ${
            showSuccessAlert
              ? "opacity-100"
              : "opacity-0 transition-opacity duration-500 ease-in-out"
          }`}
        />
      )}
      {showErrorAlert && (
        <BiingsAlertError
          userType={"Student"}
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
      {showDeleteSuccess && <DeleteSuccessAlert userType={"Student"} />}
      {showDeleteError && <DeleteErrorAlert userType={"Student"} />}

      {isEmpty ? (
        <div className="text-center py-4 mt-24">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            size="2x"
            className="text-red-500 mb-2"
          />
          <p>Student list is currently empty.</p>
        </div>
      ) : (
        <div className="overflow-y-auto">
          <StudentTable
            studentAccounts={students}
            fetchData={fetchData}
            isOperationRunning={isOperationRunning}
            handleSelectRow={handleSelectRow}
            handleSelectAll={handleSelectAll}
            isSelected={isSelected}
            allSelected={allSelected}
          />
        </div>
      )}
    </div>
  );
};

export default Student;
