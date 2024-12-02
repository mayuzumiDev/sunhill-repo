import React, { useState } from "react";
import { axiosInstance } from "../../../../utils/axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUpload } from "@fortawesome/free-solid-svg-icons";
import DotLoaderSpinner from "../../../loaders/DotLoaderSpinner";

const material_types = [
  { value: "pdf", label: "PDF Document" },
  { value: "doc", label: "Word Document" },
  { value: "ppt", label: "Presentation" },
  { value: "img", label: "Image" },
  { value: "vid", label: "Video" },
];

const UploadMaterialModal = ({
  isOpen,
  onClose,
  classroomId,
  onSuccess,
  onError,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    material_type: "",
    file: null,
  });
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 100 * 1024 * 1024) {
        onError("File size should not exceed 5MB");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        file,
      }));
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      onError("Please select a file");
      return;
    }

    if (!classroomId) {
      onError("Classroom ID is required");
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("file", formData.file);
      formDataToSubmit.append("title", formData.title || formData.file.name);
      formDataToSubmit.append("description", formData.description);
      formDataToSubmit.append("material_type", formData.material_type);
      formDataToSubmit.append("classroom", classroomId); // Make sure this is included

      const response = await axiosInstance.post(
        `/user-teacher/materials/upload/`,
        formDataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      if (response.status === 201) {
        onSuccess(response.data?.message || "Material uploaded successfully");
        handleClose();
      }
    } catch (error) {
      console.error("Error uploading material:", error);
      onError(error.response?.data?.message || "Failed to upload material");
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      material_type: "",
      file: null,
    });
    setFileName("");
    setUploadProgress(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md font-montserrat">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Upload Material</h2>
          </div>

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-100">
              <DotLoaderSpinner color="#4ade80" />
            </div>
          )}

          {/* Material Uploading Forms */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Material Type *
              </label>
              <select
                name="material_type"
                value={formData.material_type}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a type</option>
                {material_types.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {formData.material_type && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Upload File *
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-500 cursor-pointer">
                  <div className="space-y-1 text-center">
                    <FontAwesomeIcon
                      icon={faCloudUpload}
                      className="mx-auto h-12 w-12 text-gray-400"
                    />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>{fileName || "Upload a file"}</span>
                        <input
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.mp4,.avi"
                          required
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      Max file size: 100MB
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
                <div className="text-center text-sm text-gray-600 mt-1">
                  {uploadProgress}% uploaded
                </div>
              </div>
            )} */}

            {/* Buttons for Upload and Cancel */}
            <div className="flex justify-center space-x-3 mt-6">
              <button
                type="submit"
                disabled={!formData.material_type || !formData.file}
                className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-bold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UploadMaterialModal;
