import React, { useState, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { renderAsync } from "docx-preview";
import DotLoaderSpinner from "../../../components/loaders/DotLoaderSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faSearchPlus,
  faSearchMinus,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const FilePreviewModal = ({ isOpen, onClose, file }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);

  console.log("File: ", file);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "=") {
          e.preventDefault();
          setScale((prev) => Math.min(prev + 0.1, 3));
        } else if (e.key === "-") {
          e.preventDefault();
          setScale((prev) => Math.max(prev - 0.1, 0.5));
        } else if (e.key === "0") {
          e.preventDefault();
          setScale(1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.1, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.5));
  const handleResetZoom = () => setScale(1);

  // Add zoom controls component
  const ZoomControls = () => (
    <div className="fixed bottom-4 right-4 flex gap-2 bg-white rounded-lg shadow-lg p-2">
      <button
        onClick={handleZoomOut}
        className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200"
        title="Zoom Out (Ctrl -)"
      >
        <FontAwesomeIcon icon={faSearchMinus} />
      </button>
      <button
        onClick={handleResetZoom}
        className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200"
        title="Reset Zoom (Ctrl 0)"
      >
        <FontAwesomeIcon icon={faRotateLeft} />
      </button>
      <button
        onClick={handleZoomIn}
        className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200"
        title="Zoom In (Ctrl +)"
      >
        <FontAwesomeIcon icon={faSearchPlus} />
      </button>
      <span className="flex items-center px-2 text-sm text-gray-500">
        {Math.round(scale * 100)}%
      </span>
    </div>
  );

  const onDocumentLoadSuccess = ({ numPages }) => {
    setIsLoading(false);
    setNumPages(numPages);
    setError(null);
  };

  const onDocumentLoadError = (error) => {
    console.error("Error loading PDF:", error);
    setIsLoading(false);
    setError(error);
  };

  const containerRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const renderDocxContent = async () => {
      if (!file?.file_url || !isOpen || !containerRef.current) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(file.file_url);
        const blob = await response.blob();

        if (mounted && containerRef.current) {
          // Create a new div for the content
          const contentDiv = document.createElement("div");
          containerRef.current.innerHTML = ""; // Clear existing content
          containerRef.current.appendChild(contentDiv);

          await renderAsync(blob, contentDiv, contentDiv, {
            className: "docx-viewer",
          });

          if (mounted) {
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error("Error rendering DOCX:", error);
        if (mounted) {
          setError(error);
          setIsLoading(false);
        }
      }
    };

    // Reset loading state when component mounts or file changes
    setIsLoading(true);

    if (
      (file?.material_type?.toLowerCase() === "doc" ||
        file?.material_type?.toLowerCase() === "docx") &&
      isOpen
    ) {
      renderDocxContent();
    } else {
      setIsLoading(false);
    }

    return () => {
      mounted = false;
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [file, isOpen]);

  const renderFileContent = () => {
    switch (file?.material_type?.toLowerCase()) {
      case "pdf":
        return (
          <div className="w-full h-[80vh] overflow-auto bg-gray-100 p-4">
            {isLoading && (
              <div className="flex justify-center items-center h-full">
                <DotLoaderSpinner color="#6B21A8" />
              </div>
            )}
            {error && (
              <div className="text-red-500 text-center">
                <p>Error loading PDF: {error.message}</p>
                <p>Try downloading the file instead.</p>
                <a
                  href={file.file_url}
                  download
                  className="mt-2 inline-block px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                >
                  Download File
                </a>
              </div>
            )}
            <Document
              file={file.file_url}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex justify-center items-center h-full">
                  <DotLoaderSpinner color="#6B21A8" />
                </div>
              }
              className="flex flex-col items-center"
            >
              {numPages &&
                Array.from(new Array(numPages), (el, index) => (
                  <div
                    key={`page_${index + 1}`}
                    className="mb-8 shadow-lg bg-white p-2 rounded-lg"
                    style={{ transform: `scale(${scale})` }}
                  >
                    <Page
                      pageNumber={index + 1}
                      className="mb-4"
                      width={Math.min(600, window.innerWidth - 100)}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                    />
                    <p className="text-center text-sm text-gray-500">
                      Page {index + 1} of {numPages}
                    </p>
                  </div>
                ))}
            </Document>
            <ZoomControls />
          </div>
        );

      case "doc":
      case "docx":
        return (
          <div
            ref={containerRef}
            className="w-full h-[80vh] overflow-auto bg-gray-100 p-4"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top center",
            }}
          >
            {isLoading && (
              <div className="flex justify-center items-center h-full">
                <DotLoaderSpinner color="#6B21A8" />
              </div>
            )}
            <ZoomControls />
          </div>
        );

      case "image":
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return (
          <img
            src={file.file_url}
            alt={file.title}
            className="max-w-full max-h-[80vh] object-contain"
          />
        );

      case "video":
      case "mp4":
        return (
          <video controls className="max-w-full max-h-[80vh]">
            <source src={file.file_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );

      case "audio":
      case "mp3":
        return (
          <audio controls className="w-full">
            <source src={file.file_url} />
            Your browser does not support the audio tag.
          </audio>
        );

      default:
        return (
          <div className="p-4 text-center">
            <p>Preview not available. Click to download.</p>
            <a
              href={file.file_url}
              download
              className="mt-2 inline-block px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Download File
            </a>
          </div>
        );
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                  <Dialog.Title className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                    {file?.title}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200"
                  >
                    <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
                  </button>
                </div>
                {renderFileContent()}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default FilePreviewModal;
