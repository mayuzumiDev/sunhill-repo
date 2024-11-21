import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import { validateUsername } from "../../utils/form_validation/userValidation";
import PhotoUpload from "../../components/parent/settings/PhotoUpload";
import HideScrollbar from "../../components/misc/HideScrollBar";
import ErrorMessage from "../../components/alert/forms/ErrorMessage";
import { FaSpinner, FaCheckCircle } from "react-icons/fa";

const ParentSettings = ({ previousTab, setCurrentTab, parentData, setParentData }) => {
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
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  // Fetch parent data on component mount
  useEffect(() => {
    const fetchParentData = async () => {
      try {
        setIsLoading(true);
        setApiError("");
        console.log('Fetching parent data...');
        const response = await axiosInstance.get('/user-parent/profile/');
        console.log('Parent data response:', response);

        if (!response || !response.data) {
          throw new Error('No response data received');
        }

        console.log('Parent data response data:', response.data);

        if (response.data.message === 'Parent profile retrieved successfully') {
          const profile = response.data.parent_profile;
          console.log('Profile data:', profile);
          
          if (!profile) {
            throw new Error('No profile data received');
          }

          // Update form data
          const newFormData = {
            id: profile.id,
            user_info_id: profile.user_info?.id,
            parent_info_id: profile.parent_info_id,
            username: profile.username,
            email: profile.email,
            contact_no: profile.user_info?.contact_no || '',
            first_name: profile.first_name,
            last_name: profile.last_name,
            branch_name: profile.branch_name,
            profile_image: profile.user_info?.profile_image
          };

          console.log('Setting form data:', newFormData);
          setFormData(newFormData);
          
          // Update student info
          if (Array.isArray(profile.student_info)) {
            console.log('Setting student info:', profile.student_info);
            setStudentInfo(profile.student_info);
          } else {
            console.log('No student info or invalid format:', profile.student_info);
            setStudentInfo([]);
          }
          
          // Update parent data in context
          console.log('Setting parent data:', profile);
          setParentData(profile);
        } else {
          console.error('Invalid response format:', response.data);
          throw new Error(response.data.error || 'Failed to load parent data');
        }
      } catch (error) {
        console.error('Error fetching parent data:', error);
        setApiError(error.response?.data?.error || error.message || 'Failed to load parent data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchParentData();
  }, [setParentData]);

  // Update form data when parentData prop changes
  useEffect(() => {
    if (parentData) {
      console.log('ParentData changed, updating form:', parentData);
      setFormData(prevForm => ({
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
        profile_image: parentData.user_info?.profile_image || prevForm.profile_image,
      }));
      
      if (parentData.student_info) {
        console.log('Updating student info:', parentData.student_info);
        setStudentInfo(parentData.student_info);
      }
    }
  }, [parentData]);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Invalid email format";
    return "";
  };

  const validateContactNo = (contact) => {
    if (!contact) return "";
    const contactRegex = /^\+?[0-9]{11,15}$/;
    if (!contactRegex.test(contact)) return "Invalid contact number format";
    return "";
  };

  const validateName = (name, field) => {
    if (!name) return `${field} is required`;
    if (name.length < 2) return `${field} must be at least 2 characters`;
    if (name.length > 50) return `${field} cannot exceed 50 characters`;
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
    setApiError("");
  };

  const validateForm = () => {
    const newErrors = {
      username: validateUsername(formData.username),
      email: validateEmail(formData.email),
      contact_no: validateContactNo(formData.contact_no),
      first_name: validateName(formData.first_name, "First name"),
      last_name: validateName(formData.last_name, "Last name"),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShowSuccess(false);
    setApiError("");

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      console.log('Submitting form data:', formData);
      const [customUserResponse, userInfoResponse] = await Promise.all([
        axiosInstance.patch(`/user-parent/custom-user/edit/${formData.id}/`, {
          username: formData.username,
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
        }),
        axiosInstance.patch(
          `/user-parent/user-info/edit/${formData.user_info_id}/`,
          { contact_no: formData.contact_no || null }
        ),
      ]);

      console.log('Update responses:', { customUserResponse, userInfoResponse });

      if (customUserResponse.status === 200 && userInfoResponse.status === 200) {
        const updatedParentData = {
          ...parentData,
          ...formData,
          user_info: {
            ...parentData.user_info,
            contact_no: formData.contact_no,
          },
        };
        
        console.log('Setting updated parent data:', updatedParentData);
        setParentData(updatedParentData);

        // Dispatch custom event for TopNavbar update
        const event = new CustomEvent('USER_INFO_UPDATED', {
          detail: {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            username: formData.username,
            contact_no: formData.contact_no
          }
        });
        window.dispatchEvent(event);
        
        setShowSuccess(true);
        setTimeout(() => {
          setCurrentTab(previousTab);
        }, 1500);
      }
    } catch (error) {
      console.error("Error updating parent data:", error);
      setApiError(error.response?.data?.error || "Failed to update settings. Please try again.");
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
              <h3 className="font-medium text-black dark:text-white">Parent Information</h3>
            </div>
            <div className="p-7">
              {/* Error Message */}
              {apiError && (
                <div className="mb-4 rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{apiError}</h3>
                    </div>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      First Name
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="First Name"
                      />
                      {errors.first_name && <ErrorMessage message={errors.first_name} />}
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Last Name
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Last Name"
                      />
                      {errors.last_name && <ErrorMessage message={errors.last_name} />}
                    </div>
                  </div>
                </div>

                <div className="mb-5.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Username"
                    />
                    {errors.username && <ErrorMessage message={errors.username} />}
                  </div>
                </div>

                <div className="mb-5.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                    />
                    {errors.email && <ErrorMessage message={errors.email} />}
                  </div>
                </div>

                <div className="mb-5.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Contact Number
                  </label>
                  <div className="relative">
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="contact_no"
                      value={formData.contact_no}
                      onChange={handleChange}
                      placeholder="Contact Number"
                    />
                    {errors.contact_no && <ErrorMessage message={errors.contact_no} />}
                  </div>
                </div>

                <div className="flex justify-end gap-4.5">
                  <button
                    className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                    onClick={() => setCurrentTab(previousTab)}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <FaSpinner className="animate-spin" />
                    ) : showSuccess ? (
                      <FaCheckCircle />
                    ) : (
                      'Save'
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
              <h3 className="font-medium text-black dark:text-white">Connected Students</h3>
            </div>
            <div className="p-7">
              {studentInfo.length > 0 ? (
                <div className="space-y-4">
                  {studentInfo.map((student) => (
                    <div key={student.student_info_id} className="rounded-sm border border-stroke p-4 dark:border-strokedark">
                      <h4 className="text-lg font-medium text-black dark:text-white">
                        {student.first_name} {student.last_name}
                      </h4>
                      <p className="text-sm text-black dark:text-white">Grade Level: {student.grade_level}</p>
                      <p className="text-sm text-black dark:text-white">Email: {student.email}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">No students connected</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentSettings;
