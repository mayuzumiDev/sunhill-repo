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
  faDownload,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import FileOpener from "../../common/FileOpener";

const LearningMaterialsCard = ({ material, onClick }) => {
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
    <div
      onClick={() => {
        const fileOpenerButton = document.querySelector(
          `#file-opener-${material.id}`
        );
        if (fileOpenerButton) {
          fileOpenerButton.click();
        }
      }}
      className="bg-gradient-to-r from-blue-500 to-blue-400 rounded-3xl p-6 shadow-lg cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02] relative overflow-hidden w-full group"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20 transition-transform duration-500 group-hover:scale-110"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full -ml-16 -mb-16 transition-transform duration-500 group-hover:scale-110"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center gap-6">
        {/* File Icon Section */}
        <div className="bg-white/20 p-6 rounded-2xl shrink-0">
          <FontAwesomeIcon
            icon={getFileIcon(material.material_type)}
            className="h-12 w-12 text-white"
          />
        </div>

        {/* Information Section */}
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-bold text-2xl text-white truncate">
              {material.title}
            </h3>
            <span className="px-3 py-1 bg-white/20 rounded-full text-white/90 text-sm font-medium shrink-0">
              {material.material_type_display}
            </span>
          </div>

          {material.description && (
            <p className="text-white/90 text-base line-clamp-2 mb-3">
              {material.description}
            </p>
          )}

          <div className="flex items-center">
            <div className="text-white text-base font-medium bg-white/20 px-6 py-2 rounded-full hover:bg-white/30 transition-colors">
              Click me!
            </div>
          </div>

          {/* <div className="flex items-center gap-6">
            <div className="flex items-center text-white/80 text-sm">
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 h-4 w-4" />
              {new Date(material.uploaded_at).toLocaleDateString()}
            </div>
            <div className="flex items-center text-white/80 text-sm bg-white/10 px-4 py-2 rounded-full">
              <FontAwesomeIcon icon={faDownload} className="mr-2 h-4 w-4" />
              Click to open!
            </div>
          </div> */}
        </div>
      </div>

      {/* Hidden File Opener */}
      <FileOpener
        id={`file-opener-${material.id}`}
        fileUrl={material.cloudinary_url}
        fileType={material.material_type}
        className="hidden"
      />

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-3xl"></div>
    </div>
  );
};

export default LearningMaterialsCard;
