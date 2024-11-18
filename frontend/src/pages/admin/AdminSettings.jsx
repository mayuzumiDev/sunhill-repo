import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import {
  validateUsername,
  validatePassword,
} from "../../utils/form_validation/userValidation";
import PhotoUpload from "../../components/admin/settings/PhotoUpload";
import HideScrollbar from "../../components/misc/HideScrollBar";
import ErrorMessage from "../../components/alert/forms/ErrorMessage";

const Settings = ({ previousTab, setCurrentTab, adminData, setAdminData }) => {
  const [formData, setFormData] = useState({
    id: adminData.id,
    user_info_id: adminData.user_info_id,
    username: adminData.username,
    password: "",
    confirm_password: "",
    email: adminData.email,
    contact_no: adminData.contact_no,
    first_name: adminData.first_name,
    last_name: adminData.last_name,
  });

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

  return (
    <div className="p-4 mx-auto max-w-270 z-index-40 ">
      <HideScrollbar />
      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
              <h3 className="font-meduim text-black">Personal Information</h3>
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
                      className="w-full rounded border text-xs sm:text-sm border-stroke bg-gray py-3 px-2  text-gray-800 transition duration-300 ease-in-out hover:shadow-lg focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-gray-800 dark:focus:border-primary"
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
                      className="w-full rounded border text-xs sm:text-sm border-stroke bg-gray py-3 px-2 text-gray-800 transition duration-300 ease-in-out hover:shadow-lg focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-gray-800 dark:focus:border-primary"
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
                      className="w-full rounded border text-xs sm:text-sm border-stroke bg-gray py-3 px-2 text-gray-800 transition duration-300 ease-in-out hover:shadow-lg focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-gray-800 dark:focus:border-primary"
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
                      className="w-full rounded text-xs sm:text-sm border border-stroke bg-gray py-3 px-2 text-gray-800 transition duration-300 ease-in-out hover:shadow-lg focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-gray-800 dark:focus:border-primary"
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
                      className="w-full rounded text-xs sm:text-sm border border-stroke bg-gray py-3 px-2 text-gray-800 transition duration-300 ease-in-out hover:shadow-lg focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-gray-800 dark:focus:border-primary"
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
                      className="w-full  text-xs sm:text-sm rounded border border-stroke bg-gray py-3 px-2 text-gray-800 transition duration-300 ease-in-out hover:shadow-lg focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-gray-800 dark:focus:border-primary"
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
                      className="w-full  text-xs sm:text-sm rounded border border-stroke bg-gray py-3 px-2 text-gray-800 transition duration-300 ease-in-out hover:shadow-lg focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-gray-800 dark:focus:border-primary"
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
          <PhotoUpload />
        </div>
      </div>
    </div>
  );
};

export default Settings;
