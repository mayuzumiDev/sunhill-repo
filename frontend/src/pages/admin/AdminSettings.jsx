import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import {
  validateUsername,
  validatePassword,
} from "../../utils/form_validation/userValidation";
import HideScrollbar from "../../components/misc/HideScrollBar";
import ErrorMessage from "../../components/alert/forms/ErrorMessage";
import userThree from "../../assets/img/home/uriel.jpg"; // Ensure the path is correct

const Settings = ({ previousTab, setCurrentTab, adminData, setAdminData }) => {
  const [formData, setFormData] = useState({
    id: adminData.id,
    user_info_id: adminData.user_info_id,
    username: adminData.username,
    password: adminData.password,
    confirm_password: "",
    email: adminData.email,
    contact_no: adminData.contact_no,
    first_name: adminData.first_name,
    last_name: adminData.last_name,
  });

  const [profileImage, setProfileImage] = useState(userThree); // Default image

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (
      name === "password" ||
      name === "confirm_password" ||
      name === "username"
    ) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({
      username: "",
      password: "",
      confirm_password: "",
    });

    const usernameError = validateUsername(formData.username);
    if (usernameError) {
      setErrors((prev) => ({
        ...prev,
        username: usernameError,
      }));
      return;
    }

    const passwordErrors = validatePassword(
      formData.password,
      formData.confirm_password
    );
    if (Object.keys(passwordErrors).length > 0) {
      setErrors((prev) => ({
        ...prev,
        ...passwordErrors,
      }));
      return;
    }

    try {
      const { confirm_password, ...submitData } = formData;

      const [customUserDataResponse, userInfoDataResponse] = await Promise.all([
        axiosInstance.patch(`/user-admin/custom-user/edit/${submitData.id}/`, {
          username: submitData.username,
          ...(submitData.password && { password: submitData.password }),
          email: submitData.email,
          first_name: submitData.first_name,
          last_name: submitData.last_name,
        }),
        axiosInstance.patch(
          `/user-admin/user-info/edit/${submitData.user_info_id}/`,
          { contact_no: submitData.contact_no || null }
        ),
      ]);
      if (
        customUserDataResponse.status === 200 &&
        userInfoDataResponse.status === 200
      ) {
        setAdminData({
          ...adminData,
          ...submitData,
          password: "",
        });

        setCurrentTab(previousTab);
      }
    } catch (error) {
      console.error("Error updating admin data:", error);
    }
  };

  const handleImageUpload = (e) => {};

  return (
    <div className="p-4 mx-auto max-w-270 z-index-40 ">
      <HideScrollbar />
      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
              <h3 className="font-bold text-gray-800">Personal Information</h3>
            </div>
            <div className="p-7">
              <form onSubmit={handleSubmit}>
                {/* Username Field */}
                <div className="mb-4 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2 mr-4">
                    <label
                      className="mb-3 block text-sm font-bold text-gray-800"
                      htmlFor="username"
                    >
                      Username
                      <span className="text-meta-1 text-red-500 ml-1">*</span>
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-2  text-gray-800 transition duration-300 ease-in-out hover:shadow-lg focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-gray-800 dark:focus:border-primary"
                      type="text"
                      name="username"
                      id="username"
                      placeholder="Enter new username"
                      value={formData.username}
                      onChange={handleChange}
                      minLength={6}
                      maxLength={20}
                      required
                    />
                    {errors.username && (
                      <ErrorMessage message={errors.username} />
                    )}
                  </div>
                </div>

                <div className="mb-4 flex flex-col gap-5.5 sm:flex-row">
                  {/* Password Field */}
                  <div className="w-full sm:w-1/2 mr-4">
                    <label
                      className="mb-3 block text-sm font-bold text-gray-800"
                      htmlFor="password"
                    >
                      Password
                      <span className="text-meta-1 text-red-500 ml-1">*</span>
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-2 text-gray-800 transition duration-300 ease-in-out hover:shadow-lg focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-gray-800 dark:focus:border-primary"
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Enter new password"
                      value={formData.password}
                      onChange={handleChange}
                      minLength={8}
                      maxLength={30}
                      required
                    />
                    {errors.password && (
                      <ErrorMessage message={errors.password} />
                    )}
                  </div>
                  <div className="w-full sm:w-1/2 mt-8">
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-2 text-gray-800 transition duration-300 ease-in-out hover:shadow-lg focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-gray-800 dark:focus:border-primary"
                      type="password"
                      name="confirm_password"
                      id="confirm_password"
                      placeholder="Confirm new password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      minLength={8}
                      maxLength={30}
                      required
                    />
                    {errors.confirm_password && (
                      <ErrorMessage message={errors.confirm_password} />
                    )}
                  </div>
                </div>

                <div className="mb-4 flex flex-col gap-5.5 sm:flex-row">
                  {/* Email Address Field */}
                  <div className="w-full sm:w-1/2 mb-4 mr-4">
                    <label
                      className="mb-3 block text-sm font-bold text-gray-800"
                      htmlFor="email"
                    >
                      Email Address
                      <span className="text-meta-1 text-red-500 ml-1">*</span>
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-2 text-gray-800 transition duration-300 ease-in-out hover:shadow-lg focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-gray-800 dark:focus:border-primary"
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Enter new email address"
                      value={formData.email}
                      onChange={handleChange}
                      minLength={5}
                      maxLength={255}
                      required
                    />
                  </div>

                  {/* Contact No Field */}
                  <div className="w-full sm:w-1/2 mb-4">
                    <label
                      className="mb-3 block text-sm font-bold text-gray-800"
                      htmlFor="contact_no"
                    >
                      Contact No
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-2 text-gray-800 transition duration-300 ease-in-out hover:shadow-lg focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-gray-800 dark:focus:border-primary"
                      type="text"
                      name="contact_no"
                      id="contact_no"
                      value={formData.contact_no}
                      onChange={handleChange}
                      minLength={11}
                      maxLength={15}
                    />
                  </div>
                </div>

                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  {/* FirstName Field */}
                  <div className="w-full sm:w-1/2 mr-4">
                    <label
                      className="mb-2 block text-sm font-bold text-gray-800"
                      htmlFor="first_name"
                    >
                      First Name
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-2 text-gray-800 transition duration-300 ease-in-out hover:shadow-lg focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-gray-800 dark:focus:border-primary"
                      type="text"
                      name="first_name"
                      id="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      minLength={2}
                      maxLength={50}
                      required
                    />
                  </div>

                  <div className="w-full sm:w-1/2 mr-4">
                    <label
                      className="mb-2 block text-sm font-bold text-gray-800"
                      htmlFor="last_name"
                    >
                      Last Name
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-2 text-gray-800 transition duration-300 ease-in-out hover:shadow-lg focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-gray-800 dark:focus:border-primary"
                      type="text"
                      name="last_name"
                      id="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      minLength={2}
                      maxLength={50}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-5 mt-7">
                  <button
                    className="flex justify-center rounded border border-gray-400 py-2 px-4 md:px-6 font-bold text-gray-800 hover:shadow-md hover:bg-gray-200 transition-colors duration-200 text-sm md:text-base" // Adjusted padding and font size for responsiveness
                    type="button"
                    onClick={() => setCurrentTab(previousTab)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex justify-center rounded bg-blue-600 py-2 px-4 md:px-6 font-bold text-white hover:bg-blue-700 transition-colors duration-200 text-sm md:text-base"
                    onClick={handleSubmit}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* User Image Section */}
        <div className="col-span-5 xl:col-span-2">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
              <h3 className="font-bold text-gray-800">Your Photo</h3>
            </div>
            <div className="p-7">
              <form action="#">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-10 w-10 sm:h-20 sm:w-20 rounded-full overflow-hidden border-2 border-gray-300">
                    <img
                      src={profileImage}
                      alt="User"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="mb-1.5 text-gray-800">
                      Edit your photo
                    </span>
                    <span className="flex gap-2.5">
                      <button className="text-sm text-red-500 cursor-pointer hover:underline">
                        Delete
                      </button>
                      <button className="text-sm text-blue-500 cursor-pointer hover:underline">
                        Update
                      </button>
                    </span>
                  </div>
                </div>

                <div
                  id="FileUpload"
                  className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                    onChange={handleImageUpload}
                  />
                  <div className="flex flex-col text-gray-400 items-center justify-center space-y-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                          fill="#3C50E0"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                          fill="#3C50E0"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                          fill="#3C50E0"
                        />
                      </svg>
                    </span>
                    <span className="text-sm font-bold">Upload your photo</span>
                    <span className="text-xs">
                      Supported formats: JPEG, PNG, GIF
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
