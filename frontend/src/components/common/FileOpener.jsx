import React from "react";
import { FiEye } from "react-icons/fi";

// Comprehensive list of file types with their handling methods
const FILE_TYPE_HANDLERS = {
  // Microsoft Office files with multiple fallback strategies
  doc: (url) => [
    `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
      url
    )}`,
    `https://docs.google.com/viewer?url=${encodeURIComponent(
      url
    )}&embedded=true`,
    url,
  ],
  docx: (url) => [
    `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
      url
    )}`,
    `https://docs.google.com/viewer?url=${encodeURIComponent(
      url
    )}&embedded=true`,
    url,
  ],
  ppt: (url) => [
    `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
      url
    )}`,
    `https://docs.google.com/viewer?url=${encodeURIComponent(
      url
    )}&embedded=true`,
    url,
  ],
  pptx: (url) => [
    `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
      url
    )}`,
    `https://docs.google.com/viewer?url=${encodeURIComponent(
      url
    )}&embedded=true`,
    url,
  ],
  xls: (url) => [
    `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
      url
    )}`,
    `https://docs.google.com/viewer?url=${encodeURIComponent(
      url
    )}&embedded=true`,
    url,
  ],
  xlsx: (url) => [
    `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
      url
    )}`,
    `https://docs.google.com/viewer?url=${encodeURIComponent(
      url
    )}&embedded=true`,
    url,
  ],

  // Default handler for other file types
  default: (url) => [url],
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
  id,
}) => {
  const handleOpenFile = () => {
    // Normalize file type to lowercase and use default if not found
    const normalizedType = fileType?.toLowerCase() || "";
    const urlOptions =
      FILE_TYPE_HANDLERS[normalizedType] || FILE_TYPE_HANDLERS["default"];

    // Try opening files with multiple strategies
    const tryOpenFile = (urls) => {
      if (urls.length === 0) {
        console.log(fileUrl);
        console.error("Unable to open file");
        return;
      }

      const url = urls[0];
      const newWindow = window.open(url, "_blank", "noopener,noreferrer");

      // If first method fails, try next URL
      if (
        !newWindow ||
        newWindow.closed ||
        typeof newWindow.closed == "undefined"
      ) {
        tryOpenFile(urls.slice(1));
      }
    };

    tryOpenFile(urlOptions(fileUrl));
  };

  return (
    <button
      onClick={handleOpenFile}
      className={className}
      title={title}
      id={id}
    >
      {children}
    </button>
  );
};

export default FileOpener;
