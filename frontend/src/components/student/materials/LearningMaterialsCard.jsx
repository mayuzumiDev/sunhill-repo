import React, { useState } from "react";
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
import FilePreviewModal from "./FilePreviewModal";
import FileOpener from "../../common/FileOpener";

const LearningMaterialsCard = ({ material, onClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <>
      <div
        onClick={() => {
          const fileOpenerButton = document.querySelector(
            `#file-opener-${material.id}`
          );
          if (fileOpenerButton) {
            fileOpenerButton.click();
          }
        }}
        className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg shadow-md hover:shadow-xl transition-all hover:scale-105 overflow-hidden cursor-pointer min-w-[280px] w-full max-w-[400px] "
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-10 -mb-10 animate-bounce"></div>

        {/* Preview Section */}
        <div className="h-32 bg-white/5 flex items-center justify-center relative">
          {material.preview_url ? (
            <img
              src={material.preview_url}
              alt={material.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <FontAwesomeIcon
              icon={getFileIcon(material.material_type)}
              className="h-16 w-16 text-white/80"
            />
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-xl text-white truncate">
              {material.title}
            </h3>
            <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full">
              {material.material_type_display}
            </span>
          </div>

          <p className="text-white/80 text-sm mb-4 line-clamp-2">
            {material.description}
          </p>

          <div className="flex justify-between items-center">
            {/* <span className="text-white/70 text-sm">
              {new Date(material.uploaded_at).toLocaleDateString()}
            </span> */}
            <FileOpener
              id={`file-opener-${material.id}`}
              fileUrl={material.file_url}
              fileType={material.material_type}
              className="opacity-0 text-white transition-colors"
            />
          </div>
        </div>
      </div>

      {/* <FilePreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        file={material}
      /> */}
    </>
  );
};

export default LearningMaterialsCard;
