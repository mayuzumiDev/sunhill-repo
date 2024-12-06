import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../../utils/axiosInstance";
import MaterialCard from "./MaterialCard";
import EditMaterialModal from "../../modal/teacher/materials/EditMaterialModal";
import ConfirmDeleteModal from "../../modal/teacher/ConfirmDeleteModal";
import UploadMaterialModal from "../../modal/teacher/materials/UploadMaterialModal";
import CustomAlert from "../../alert/teacher/CustomAlert";
import DotLoaderSpinner from "../../loaders/DotLoaderSpinner";

const ClassroomMaterials = ({ classroomId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const fetchMaterials = async () => {
    if (!classroomId) return;

    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        "/user-teacher/materials/list/",
        {
          params: {
            classroom: classroomId,
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data.materials_list);
        setMaterials(response.data.materials_list || []);
      }
    } catch (error) {
      console.error("An error occurred fetching the materials.", error);
      setMaterials([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = async (message) => {
    setAlertType("success");
    setAlertMessage(message);
    setShowAlert(true);
    await fetchMaterials();
  };

  const handleUploadError = (message) => {
    setAlertType("error");
    setAlertMessage(message);
    setShowAlert(true);
  };

  useEffect(() => {
    fetchMaterials();
  }, [classroomId]);

  if (!classroomId) {
    return <div>No classroom selected</div>;
  }

  return (
    <div className="w-full">
      <div className="flex justify-start mb-4">
        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-500 border border-transparent rounded-md shadow-sm hover:bg-green-600 transition-all duration-300 ease-in-out transform hover:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Upload Material
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <DotLoaderSpinner color="#4ade80" />
        </div>
      ) : (
        <>
          {materials && materials.length > 0 ? (
            <div className="flex flex-col space-y-4">
              {materials.map((material) => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  onDelete={() => {
                    setShowDeleteModal(true);
                    setSelectedMaterial(material.id);
                  }}
                  onEdit={() => {
                    setSelectedMaterial(material);
                    setShowEditModal(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600 py-4">
              No materials available for this classroom
            </div>
          )}

          <UploadMaterialModal
            isOpen={showUploadModal}
            onClose={() => setShowUploadModal(false)}
            classroomId={classroomId}
            onSuccess={handleUploadSuccess}
            onError={handleUploadError}
          />

          <EditMaterialModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            classroomId={classroomId}
            initialData={selectedMaterial}
            onSuccess={handleUploadSuccess}
            onError={handleUploadError}
          />

          {showDeleteModal && (
            <ConfirmDeleteModal
              isOpen={showDeleteModal}
              onClose={() => setShowDeleteModal(false)}
              onConfirm={async () => {
                try {
                  await axiosInstance.delete(
                    `/user-teacher/materials/delete/${selectedMaterial}/`
                  );
                  handleUploadSuccess("Material deleted successfully");
                  setShowDeleteModal(false);
                } catch (error) {
                  console.error("Error deleting material:", error);
                  handleUploadError("Error deleting material");
                }
              }}
              title="Delete Material"
              message="Are you sure you want to delete this material?"
            />
          )}

          {showAlert && (
            <CustomAlert
              message={alertMessage}
              type={alertType}
              isVisible={showAlert}
              onClose={() => setShowAlert(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ClassroomMaterials;
