import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faTrashAlt,
  faEraser,
} from "@fortawesome/free-solid-svg-icons";
import { axiosInstance } from "../../../utils/axiosInstance";
import SchawnnahJLoader from "../../../components/loaders/SchawnnahJLoader";
import AddAccountModal from "../../../components/modal/admin/AddAccountModal";
import GeneratedAccountModal from "../../../components/modal/admin/GeneratedAccountModal";
import ConfirmDeleteModal from "../../../components/modal/admin/ConfirmDeleteModal";
import BiingsAlertSuccess from "../../../components/alert/BiingsAlertSuccess";
import BiingsAlertError from "../../../components/alert/BiingsAlertError";
import DeleteSuccessAlert from "../../../components/alert/DeleteSuccessAlert";
import DeleteErrorAlert from "../../../components/alert/DeleteErrorAlert";
import SelectUserErrorAlert from "../../../components/alert/SelectUserErrorAlert";
import StudentTable from "../../../components/admin/tables/StudentTable";
import TableSearchBar from "../../../components/admin/tables/TableSearchBar";
import SortBox from "../../../components/admin/tables/SortBox";

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

  const [generatedAccounts, setGeneratedAccounts] = useState([]);
  const [students, setStudents] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchPerform, setSearchPerform] = useState(false);
  const [filterStudent, setFilterStudent] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [selectedStudents, setSelectedStudents] = useState("");

  useEffect(() => {
    fetchData();
  }, [searchTerm, filterStudent, orderBy]);

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

  const handleSearch = () => {
    // search logic
  };

  const handleFilterChange = () => {
    // filter logic
  };

  const handleOrderChange = () => {
    // order logic
  };

  const handleClearAll = () => {
    // clear all logic
  };

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/user-admin/student-list/");

      if (response.status === 200) {
        const student_list = response.data.student_list;
        setStudents(student_list);
        console.log(student_list);
      }
    } catch (error) {
      console.error("An error occured while fetching data", error);
    }
  };

  const handleGenerateAccount = () => {
    // generate account logic
  };

  const handleSaveAndGenerate = () => {
    // save and generate logic
  };

  const handleDeleteAccount = () => {
    // delete account logic
  };

  const handleCloseGenerateModal = () => {
    // close generate modal logic
  };

  return (
    <div className="p-4 md:p-6 font-montserrat">
      <h1 className="text-2xl md:text-4xl text-gray-800 font-bold mb-4">
        Manage Accounts
      </h1>
      <h2 className="text-lg text-gray-700 font-semibold mb-4">Students</h2>

      {/* Top Button Container with Create and Delete */}
      <div className="flex flex-col-reverse md:flex-row justify-between items-center mb-4">
        <div className="flex space-x-4 mb-4 md:mb-0">
          <button className="bg-blue-500 text-white font-semibold py-2 px-3 rounded-lg hover:bg-blue-600 transition flex items-center text-xs sm:text-lg sm:py-2 sm:px-4">
            <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
            Create Account
          </button>
          <button className="bg-red-500 text-white font-semibold py-2 px-3 rounded-lg hover:bg-red-600 transition flex items-center text-xs sm:text-lg sm:py-2 sm:px-4">
            <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
            Delete Account
          </button>
        </div>
      </div>

      {/* Sorting, Filtering, and Search Container */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <div className="w-full md:w-auto mb-4 md:mb-0">
          <TableSearchBar onSearch={handleSearch} searchTerm={searchTerm} />
        </div>
        <div className="flex space-x-4 items-center ml-auto text-xs sm:text-sm">
          <SortBox
            options={["Batangas", "Rosario", "Bauan", "Metro Tagaytay"]}
            label="Branch"
            onSelect={handleFilterChange}
          />
          <SortBox
            options={[
              "Grade 1",
              "Grade 2",
              "Grade 3",
              "Grade 4",
              "Grade 5",
              "Grade 6",
            ]}
            label="Grade Level"
            onSelect={handleFilterChange}
          />
          <SortBox
            options={["Newest", "Oldest", "A-Z", "Z-A"]}
            label="Sort By"
            onSelect={handleOrderChange}
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
        userType={"Student"}
      />

      <GeneratedAccountModal
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

      <div className="overflow-y-auto">
        <StudentTable
          studentAccounts={students}
          fetchData={fetchData}
          searchPerform={searchPerform}
          handleSelectRow={handleSelectRow}
          handleSelectAll={handleSelectAll}
          isSelected={isSelected}
          allSelected={allSelected}
        />
      </div>
    </div>
  );
};

export default Student;
