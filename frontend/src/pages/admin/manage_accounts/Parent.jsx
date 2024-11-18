import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faEraser,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { axiosInstance } from "../../../utils/axiosInstance";
import ConfirmDeleteModal from "../../../components/modal/admin/manage_account/ConfirmDeleteModal";
import DeleteSuccessAlert from "../../../components/alert/DeleteSuccessAlert";
import DeleteErrorAlert from "../../../components/alert/DeleteErrorAlert";
import SelectUserErrorAlert from "../../../components/alert/SelectUserErrorAlert";
import ParentTable from "../../../components/admin/tables/ParentTable";
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

const Parent = () => {
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [showSelectUserError, setShowSelectUserError] = useState(false);
  const [resetSelection, setResetSelection] = useState(false);

  const [parents, setParents] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [isOperationRunning, setIsOperationRunning] = useState(false);
  const [filters, setFilters] = useState({
    branch: "",
    grade: "",
  });
  const [orderBy, setOrderBy] = useState("");
  const [selectedParents, setSelectedParents] = useState("");

  useEffect(() => {
    fetchData();
  }, [searchTerm, filters, orderBy]);

  useEffect(() => {
    // Automatically hide success alert after 5 seconds
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
  }, [showDeleteSuccess, showDeleteError, showSelectUserError]);

  const allSelected =
    parents && parents.length > 0 && selectedParents.length === parents.length;

  const isSelected = (id) => selectedParents.includes(id);

  const handleSelectRow = (event, id) => {
    // Update selected parents based on checkbox state
    setSelectedParents(
      (prev) =>
        event.target.checked
          ? [...prev, id] // Add ID if checked
          : prev.filter((selectedId) => selectedId !== id) // Remove ID if unchecked
    );
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      // Select all if checking the box
      setSelectedParents(parents.map((parents) => parents.id));
    } else {
      // Unselect only if all were already selected, otherwise preserve individual selections
      if (allSelected) {
        setSelectedParents([]);
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
        ...(orderBy && { ordering: orderBy }),
      };

      const response = await axiosInstance.get("/user-admin/parent-list/", {
        params,
      });

      if (response.status === 200) {
        const parent_list = response.data.parent_list;
        setParents(parent_list);
        if (parent_list.length === 0 && !isOperationRunning) {
          setIsEmpty(true);
        }
      }
    } catch (error) {
      console.error("An error occured while fetching data", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (selectedParents.length === 0) {
      setShowSelectUserError(true);
      return;
    }

    try {
      // Request to delete selected teacher accounts
      const response = await axiosInstance.post(
        "/user-admin/custom-user/delete/",
        {
          id: selectedParents,
        }
      );

      if (response.status === 200) {
        setIsConfirmDelete(false);
        setShowDeleteSuccess(true);
        fetchData();
        setSelectedParents([]);
      }
    } catch (error) {
      console.error("An error occurred while deleting the account.");
      setShowDeleteError(true);
    }
  };

  return (
    <div className="p-4 md:p-6 font-montserrat">
      <h1 className="text-2xl md:text-4xl text-gray-800 font-bold mb-4">
        Manage Accounts{" "}
        <span className="text-lg text-gray-700 font-semibold mb-4">
          {" "}
          Parents
        </span>
      </h1>

      {/* Top Button Container with Create and Delete */}
      <div className="flex flex-col-reverse md:flex-row justify-between items-center mb-4">
        <div className="flex space-x-4 mb-4 md:mb-0">
          <button
            className="bg-red-500 text-white font-semibold py-2 px-3 rounded-lg hover:bg-red-600 transition flex items-center text-xs sm:text-lg sm:py-2 sm:px-4"
            onClick={() => {
              setShowSelectUserError(false);
              if (selectedParents.length > 0) {
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
      {showDeleteSuccess && <DeleteSuccessAlert userType={"Parent"} />}
      {showDeleteError && <DeleteErrorAlert userType={"Parent"} />}

      {isEmpty ? (
        <div className="text-center py-4 mt-24">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            size="2x"
            className="text-red-500 mb-2"
          />
          <p>Parent list is currently empty.</p>
        </div>
      ) : (
        <div className="overflow-y-auto">
          <ParentTable
            parentAccounts={parents}
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

export default Parent;
