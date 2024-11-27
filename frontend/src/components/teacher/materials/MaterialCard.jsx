import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilePdf,
  faFileImage,
  faFileWord,
  faFileExcel,
  faFilePowerpoint,
  faFileVideo,
  faFileAudio,
  faFileCode,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FiTrash2, FiEdit2 } from "react-icons/fi";
import FileOpener from "../../../components/common/FileOpener";

const MaterialCard = ({ material, onDelete, onEdit }) => {
  const getFileIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "image":
        return faFileImage;
      case "pdf":
        return faFilePdf;
      case "doc":
      case "docx":
        return faFileWord;
      case "xls":
      case "xlsx":
        return faFileExcel;
      case "ppt":
      case "pptx":
        return faFilePowerpoint;
      case "video":
        return faFileVideo;
      case "audio":
        return faFileAudio;
      case "code":
        return faFileCode;
      default:
        return faFileAlt;
    }
  };

  if (!material) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Preview Section */}
      <div className="h-40 bg-gray-100 flex items-center justify-center">
        {material.preview_url ? (
          <img
            src={material.preview_url}
            alt={material.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <FontAwesomeIcon
            icon={getFileIcon(material.material_type)}
            className="h-20 w-20 text-gray-400"
          />
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg truncate">{material.title}</h3>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
            {material.material_type_display}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {material.description}
        </p>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {new Date(material.uploaded_at).toLocaleDateString()}
          </span>
          <div className="flex gap-4">
            <FileOpener
              fileUrl={material.cloudinary_url}
              fileType={material.material_type}
            />
            {/* <button
              className="text-blue-600 hover:text-blue-800 text-xl"
              onClick={onEdit}
              title="Edit"
            >
              <FiEdit2 />
            </button> */}
            <button
              className="text-red-600 hover:text-red-800 text-xl"
              onClick={onDelete}
              title="Delete"
            >
              <FiTrash2 />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialCard;
