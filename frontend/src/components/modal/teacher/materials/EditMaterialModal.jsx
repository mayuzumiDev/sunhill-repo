import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../../../utils/axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUpload, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import DotLoaderSpinner from "../../../loaders/DotLoaderSpinner";

const material_types = [
  { value: "pdf", label: "PDF Document" },
  { value: "doc", label: "Word Document" },
  { value: "ppt", label: "Presentation" },
  { value: "img", label: "Image" },
  { value: "vid", label: "Video" },
];

const EditMaterialModal = ({
  isOpen,
  onClose,
  classroomId,
  materialId,
  initialData,
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
  const [hasFileChanged, setHasFileChanged] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        material_type: initialData.material_type || "",
        file: null,
      });
      setFileName(initialData.file_name || "");
    }
  }, [initialData, isOpen]);

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
      setFormData((prev) => ({
        ...prev,
        file,
      }));
      setFileName(file.name);
      setHasFileChanged(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSubmit = new FormData();
    const dataToSubmit = { ...formData, classroom: classroomId };

    Object.entries(dataToSubmit).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        if (key === "file" && !hasFileChanged) return;
        formDataToSubmit.append(key, value);
      }
    });

    setIsLoading(true);
    try {
      const response = await axiosInstance.patch(
        `/user-teacher/materials/edit/${initialData.id}/`,
        formDataToSubmit
      );

      if (response.status === 200) {
        onSuccess(response.data?.message || "Material updated successfully");
        handleClose();
      }
    } catch (error) {
      console.error("An error occurred while updating the material.", error);
      onError(error.response?.data?.message || "Failed to update material");
    } finally {
      setIsLoading(false);
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
    setHasFileChanged(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md font-montserrat">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Edit Material</h2>
            <FontAwesomeIcon icon={faPencilAlt} className="text-blue-600" />
          </div>

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-100">
              <DotLoaderSpinner color="#4ade80" />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Material Type
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
                Title
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
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Update File (Optional)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-500 cursor-pointer">
                <div className="space-y-1 text-center">
                  <FontAwesomeIcon
                    icon={faCloudUpload}
                    className="mx-auto h-12 w-12 text-gray-400"
                  />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>{fileName || "Choose a new file"}</span>
                      <input
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    Click to select a new file (optional)
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-3 mt-6">
              <button
                type="submit"
                className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Update Material
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

export default EditMaterialModal;
