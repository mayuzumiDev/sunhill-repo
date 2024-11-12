import React, { useState } from 'react';
import userThree from '../../assets/img/home/uriel.jpg'; // Ensure the path is correct

const Settings = () => {
  // State for form inputs
  const [formData, setFormData] = useState({
    fullName: 'Christine Faith',
    phoneNumber: '+990 3343 7865',
    emailAddress: 'faith@gmail.com',
    username: 'christinfaith24',
    bio: ''
  });

  const [message, setMessage] = useState('');
  const [profileImage, setProfileImage] = useState(userThree); // Default image

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log('Updated Form Data:', { ...formData, [name]: value }); // Debugging
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData); // Debugging
    setMessage('Changes saved successfully!'); // Example success message
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Here you can handle the file upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // Set the uploaded image as the profile image
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 mx-auto max-w-270 z-index-40">
      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
              <h3 className="font-medium text-black">Personal Information</h3>
            </div>
            <div className="p-7">
              {message && <div className="text-green-500 mb-4">{message}</div>}
              <form onSubmit={handleSubmit}>
                {/* Full Name Field */}
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black" htmlFor="fullName">
                      Full Name
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black transition duration-300 ease-in-out hover:shadow-lg focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-black dark:focus:border-primary"
                      type="text"
                      name="fullName"
                      id="fullName"
                      placeholder="Devid Jhon"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Phone Number Field */}
                  <div className="w-full sm:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black" htmlFor="phoneNumber">
                      Phone Number
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black transition duration-300 ease-in-out hover:shadow-lg focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-black dark:focus:border-primary"
                      type="text"
                      name="phoneNumber"
                      id="phoneNumber"
                      placeholder="+990 3343 7865"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Email Address Field */}
                <div className="mb-5.5">
                  <label className="mb-3 block text-sm font-medium text-black" htmlFor="emailAddress">
                    Email Address
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black transition duration-300 ease-in-out hover:shadow-lg focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-black dark:focus:border-primary"
                    type="email"
                    name="emailAddress"
                    id="emailAddress"
                    placeholder="devidjond45@gmail.com"
                    value={formData.emailAddress}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Username Field */}
                <div className="mb-5.5">
                  <label className="mb-3 block text-sm font-medium text-black" htmlFor="username">
                    Username
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black transition duration-300 ease-in-out hover:shadow-lg focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-black dark:focus:border-primary"
                    type="text"
                    name="username"
                    id="username"
                    placeholder="devidjhon24"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Bio Field */}
                <div className="mb-5.5">
                  <label className="mb-3 block text-sm font-medium text-black" htmlFor="bio">
                    Bio
                  </label>
                  <textarea
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black transition duration-300 ease-in-out hover:shadow-lg focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-black dark:focus:border-primary"
                    name="bio"
                    id="bio"
                    rows="3"
                    placeholder="Write your bio here..."
                    value={formData.bio}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="flex justify-end gap-5 mt-7">
                <button
                    className="flex justify-center rounded border border-gray-400 py-2 px-4 md:px-6 font-medium text-black hover:shadow-md hover:bg-gray-200 transition-colors duration-200 text-sm md:text-base" // Adjusted padding and font size for responsiveness
                    type="button" // Changed to "button" to prevent accidental form submission
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex justify-center rounded bg-blue-600 py-2 px-4 md:px-6 font-medium text-white hover:bg-blue-700 transition-colors duration-200 text-sm md:text-base">
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
              <h3 className="font-medium text-black">Your Photo</h3>
            </div>
            <div className="p-7">
              <form action="#">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-10 w-10 sm:h-20 sm:w-20 rounded-full overflow-hidden border-2 border-gray-300">
                    <img src={profileImage} alt="User" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <span className="mb-1.5 text-black">Edit your photo</span>
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
                    <span className="text-sm font-medium">Upload your photo</span>
                    <span className="text-xs">Supported formats: JPEG, PNG, GIF</span>
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
