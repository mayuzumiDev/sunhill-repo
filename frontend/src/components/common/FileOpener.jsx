import React from "react";
import { FiEye } from "react-icons/fi";

// Comprehensive list of file types with their handling methods
const FILE_TYPE_HANDLERS = {
  // Microsoft Office files (use Office Online Viewer)
  doc: (url) =>
    `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
      url
    )}`,
  docx: (url) =>
    `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
      url
    )}`,
  ppt: (url) =>
    `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
      url
    )}`,
  pptx: (url) =>
    `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
      url
    )}`,
  xls: (url) =>
    `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
      url
    )}`,
  xlsx: (url) =>
    `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
      url
    )}`,

  // Default handler for other file types
  default: (url) => url,
};

/**
 * Reusable component for opening files in a new tab
 * @param {Object} props
 * @param {string} props.fileUrl - URL of the file to open
 * @param {string} props.fileType - Type of the file (lowercase)
 * @param {React.ReactNode} [props.children] - Optional children to render (e.g., icon or text)
 * @param {string} [props.className] - Optional CSS classes
 */
const FileOpener = ({
  fileUrl,
  fileType,
  children = <FiEye />,
  className = "text-blue-600 hover:text-blue-800 text-xl",
  title = "View",
}) => {
  const handleOpenFile = () => {
    // Normalize file type to lowercase and use default if not found
    const normalizedType = fileType?.toLowerCase() || "";
    const handler =
      FILE_TYPE_HANDLERS[normalizedType] || FILE_TYPE_HANDLERS["default"];

    // Open file using appropriate method
    window.open(handler(fileUrl), "_blank", "noopener,noreferrer");
  };

  return (
    <button onClick={handleOpenFile} className={className} title={title}>
      {children}
    </button>
  );
};

export default FileOpener;
