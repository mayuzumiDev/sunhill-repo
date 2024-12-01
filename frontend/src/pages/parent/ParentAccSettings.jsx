import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import PhotoUpload from "../../components/parent/settings/PhotoUpload";
import HideScrollbar from "../../components/misc/HideScrollBar";
import { FaSpinner, FaCheckCircle } from "react-icons/fa";

const ParentSettings = ({
  previousTab,
  setCurrentTab,
  parentData,
  setParentData,
}) => {
  const [formData, setFormData] = useState({
    id: "",
    user_info_id: "",
    parent_info_id: "",
    username: "",
    email: "",
    contact_no: "",
    first_name: "",
    last_name: "",
    branch_name: "",
    profile_image: null,
  });

  const [studentInfo, setStudentInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch parent data on component mount
  useEffect(() => {
    const fetchParentData = async () => {
      try {
        setIsLoading(true);
        setApiError("");
        const response = await axiosInstance.get(
          "/api/user-parent/current-parent/"
        );

        if (!response || !response.data) {
          throw new Error("No response data received");
        }

        if (response.data.status === "success") {
          const profile = response.data.data;

          if (!profile) {
            throw new Error("No profile data received");
          }

          // Update form data
          const newFormData = {
            id: profile.id,
            user_info_id: profile.user_info?.id,
            parent_info_id: profile.parent_info?.id,
            username: profile.username || "",
            email: profile.email || "",
            contact_no: profile.user_info?.contact_no || "",
            first_name: profile.first_name || "",
            last_name: profile.last_name || "",
            branch_name: profile.branch_name || "",
            profile_image: profile.user_info?.profile_image || null,
          };

          setFormData(newFormData);

          // Update student info
          if (Array.isArray(profile.student_info)) {
            setStudentInfo(profile.student_info);
          } else {
            setStudentInfo([]);
          }

          // Update parent data in context
          setParentData(profile);
        } else {
          throw new Error(response.data.error || "Failed to load parent data");
        }
      } catch (error) {
        console.error("Error fetching parent data:", error);
        setApiError(
          error.response?.data?.error ||
            error.message ||
            "Failed to load parent data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchParentData();
  }, [setParentData]);

  // Update form data when parentData prop changes
  useEffect(() => {
    if (parentData) {
      setFormData((prevForm) => ({
        ...prevForm,
        id: parentData.id || prevForm.id,
        user_info_id: parentData.user_info?.id || prevForm.user_info_id,
        parent_info_id: parentData.parent_info_id || prevForm.parent_info_id,
        username: parentData.username || prevForm.username,
        email: parentData.email || prevForm.email,
        contact_no: parentData.user_info?.contact_no || prevForm.contact_no,
        first_name: parentData.first_name || prevForm.first_name,
        last_name: parentData.last_name || prevForm.last_name,
        branch_name: parentData.branch_name || prevForm.branch_name,
        profile_image:
          parentData.user_info?.profile_image || prevForm.profile_image,
      }));

      if (parentData.student_info) {
        setStudentInfo(parentData.student_info);
      }
    }
  }, [parentData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShowSuccess(false);
    setApiError("");
    setSuccessMessage("");

    try {
      // Update user information
      const customUserResponse = await axiosInstance.patch(
        `/api/user-parent/custom-user/edit/${formData.id}/`,
        {
          username: formData.username,
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
        }
      );

      // Update contact information
      const userInfoResponse = await axiosInstance.patch(
        `/api/user-parent/user-info/edit/${formData.user_info_id}/`,
        { contact_no: formData.contact_no || null }
      );

      if (
        customUserResponse.status === 200 &&
        userInfoResponse.status === 200
      ) {
        // Fetch updated data
        const updatedResponse = await axiosInstance.get(
          "/api/user-parent/current-parent/"
        );
        if (updatedResponse.data.status === "success") {
          const updatedProfile = updatedResponse.data.data;
          setParentData(updatedProfile);

          // Dispatch custom event for TopNavbar update
          const event = new CustomEvent("USER_INFO_UPDATED", {
            detail: {
              first_name: formData.first_name,
              last_name: formData.last_name,
              email: formData.email,
              username: formData.username,
              contact_no: formData.contact_no,
            },
          });
          window.dispatchEvent(event);

          setShowSuccess(true);
          setSuccessMessage("Profile updated successfully!");
        }
      }
    } catch (error) {
      console.error("Error updating parent data:", error);
      setApiError(
        error.response?.data?.error ||
          "Failed to update settings. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 mx-auto max-w-270 z-index-40">
      <HideScrollbar />
      <div className="grid grid-cols-5 gap-8">
        {/* Left Column - Parent Information */}
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
              <h3 className="font-medium text-black">
                Parent Information  
              </h3>
            </div>
            <div className="p-7">
              {/* Success Message */}
              {successMessage && (
                <div className="mb-4 rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        {successMessage}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {apiError && (
                <div className="mb-4 rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        {apiError}
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black ">
                      First Name
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="First Name"
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black ">
                      Last Name
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Last Name"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-5.5 mt-5">
                  <label className="mb-3 block text-sm font-medium text-black ">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Username"
                    />
                  </div>
                </div>

                <div className="mb-5.5 mt-5">
                  <label className="mb-3 block text-sm font-medium text-black ">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                    />
                  </div>
                </div>

                <div className="mb-5.5 mt-5">
                  <label className="mb-3 block text-sm font-medium text-black ">
                    Contact Number
                  </label>
                  <div className="relative">
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
                      type="text"
                      name="contact_no"
                      value={formData.contact_no}
                      onChange={handleChange}
                      placeholder="Contact Number"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-7 mt-10">
                  <button
                    className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark "
                    onClick={() => setCurrentTab(previousTab)}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="flex justify-center rounded bg-blue-500 py-2 px-6 font-medium text-white hover:shadow-1"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <FaSpinner className="animate-spin" />
                    ) : showSuccess ? (
                      <FaCheckCircle />
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column - Student Information */}
        <div className="col-span-5 xl:col-span-2">
          {/* Photo Upload Section */}
          <div className="mb-8">
            <PhotoUpload
              parentData={parentData}
              refreshParentData={(newData) => setParentData(newData)}
            />
          </div>

          {/* Connected Students Section */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-black ">
                  Connected Students
                </h3>
                <span className="inline-flex items-center justify-center rounded-full bg-blue-100 px-3 py-1 text-xs  truncate font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {studentInfo.length}{" "}
                  {studentInfo.length === 1 ? "Student" : "Students"}
                </span>
              </div>
            </div>
            <div className="p-7">
              {studentInfo.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                  {studentInfo.map((student) => (
                    <div
                      key={student.student_info_id}
                      className="relative rounded-sm border border-stroke bg-white p-5 shadow-default transition duration-300 hover:shadow-lg dark:border-strokedark dark:bg-boxdark"
                    >
                      <div className="flex flex-col sm:flex-row items-start justify-between space-y-4 sm:space-y-0">
                        <div className="flex items-start space-x-4 w-full sm:w-auto">
                          <div className="h-16 w-16 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                            {student.user_info?.profile_image ? (
                              <img
                                src={student.user_info.profile_image}
                                alt={`${student.first_name} ${student.last_name}`}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  console.error(
                                    "Student image failed to load:",
                                    e
                                  );
                                  e.target.style.display = "none";
                                  e.target.parentElement.querySelector(
                                    "span"
                                  ).style.display = "flex";
                                }}
                              />
                            ) : (
                              <span className="text-xl font-semibold text-blue-600 flex items-center justify-center h-full w-full">
                                {student.first_name[0]}
                                {student.last_name[0]}
                              </span>
                            )}
                          </div>
                          <div className="flex-grow min-w-0">
                            <h4 className="text-lg sm:text-lg lg:text-xl font-semibold text-black truncate">
                              {student.first_name} {student.last_name}
                            </h4>
                            <div className="mt-2 sm:mt-3 flex flex-col space-y-2">
                              <div className="flex items-center text-sm sm:text-base lg:text-lg text-gray-500 dark:text-gray-400">
                                <svg
                                  className="mr-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                </svg>
                                <span className="font-medium whitespace-nowrap  truncate">
                                  {student.grade_level}
                                </span>
                              </div>
                              <div className="flex items-center text-sm sm:text-base lg:text-lg text-gray-500 dark:text-gray-400 min-w-0">
                                <svg
                                  className="mr-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                <span className="font-medium truncate block">
                                  {student.email}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                    <svg
                      className="h-8 w-8 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 ">
                    No Students Connected
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Contact your school administrator to connect students to
                    your account.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentSettings;
