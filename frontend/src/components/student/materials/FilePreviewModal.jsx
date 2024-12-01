import React, { useState, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { renderAsync } from "docx-preview";
import * as pptxPreview from "pptx-preview";
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
  const [slides, setSlides] = useState([]);
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

  const previewContainerRef = useRef(null);

  useEffect(() => {
    setIsLoading(false);
    setError(null);
    setNumPages(null);
  }, [file]);

  useEffect(() => {
    const renderDocx = async () => {
      setIsLoading(true);
      setError(null);

      if (!file?.file_url || !previewContainerRef.current) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(file.file_url, {
          signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();

        if (blob.size === 0) {
          throw new Error("Received empty file");
        }

        previewContainerRef.current.innerHTML = "";

        await renderAsync(blob, previewContainerRef.current, {
          className: "docx-preview-container",
        });

        setIsLoading(false);
      } catch (err) {
        console.error("DOCX Rendering Error:", err);
        setError(err);
        setIsLoading(false);
      }
    };

    if (file?.material_type?.toLowerCase() === "docx") {
      renderDocx();
    }
  }, [file]);

  const [pptxData, setPptxData] = useState(null);
  const [pptxSlides, setPptxSlides] = useState(0);
  const [currentPptxSlide, setCurrentPptxSlide] = useState(1);
  const [pptxError, setPptxError] = useState(null);
  const pptxContainerRef = useRef(null);

  const handlePreviousSlide = () => {
    setCurrentPptxSlide((prev) => Math.max(1, prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentPptxSlide((prev) => Math.min(pptxSlides, prev + 1));
  };

  // Enhanced PPTX loading with comprehensive error handling
  useEffect(() => {
    const loadPptx = async () => {
      // Reset states
      setPptxData(null);
      setPptxSlides(0);
      setPptxError(null);

      if (["ppt", "pptx"].includes(file?.material_type?.toLowerCase())) {
        try {
          console.log("Attempting to load PPTX from URL:", file.file_url);

          // Fetch with extended timeout and error handling
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

          const response = await fetch(file.file_url, {
            signal: controller.signal,
            method: "GET",
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              Expires: "0",
            },
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(
              `HTTP error! status: ${response.status}, ${response.statusText}`
            );
          }

          const arrayBuffer = await response.arrayBuffer();

          console.log("ArrayBuffer details:", {
            byteLength: arrayBuffer.byteLength,
            type: Object.prototype.toString.call(arrayBuffer),
          });

          if (arrayBuffer.byteLength === 0) {
            throw new Error("Received empty file");
          }

          setPptxData(arrayBuffer);
        } catch (error) {
          console.error("Comprehensive PPTX Loading Error:", {
            message: error.message,
            name: error.name,
            stack: error.stack,
          });
          setPptxError(error);
        }
      }
    };

    loadPptx();
  }, [file]);

  // Rendering PowerPoint with advanced error tracking
  useEffect(() => {
    const renderPptx = async () => {
      if (pptxData && pptxContainerRef.current) {
        try {
          // Clear previous content
          pptxContainerRef.current.innerHTML = "";

          console.log("Attempting to render PPTX slides");

          // Render PowerPoint with enhanced options
          const slides = await pptxPreview.renderSlides(pptxData, {
            container: pptxContainerRef.current,
            slideMode: true,
            renderOptions: {
              width: "100%",
              height: "600px",
            },
          });

          console.log("Slides rendered successfully:", slides.length);
          setPptxSlides(slides.length);
        } catch (error) {
          console.error("Advanced PPTX Rendering Error:", {
            message: error.message,
            name: error.name,
            stack: error.stack,
          });
          setPptxError(error);
        }
      }
    };

    renderPptx();
  }, [pptxData]);

  const renderPptxContent = () => {
    // Comprehensive error handling
    if (pptxError) {
      return (
        <div className="text-red-500 p-4 text-center">
          <p>Error loading PowerPoint:</p>
          <p className="text-sm">{pptxError.message}</p>
          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={() => window.open(file.file_url, "_blank")}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              Open Original File
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    if (!pptxData) {
      return (
        <div className="flex justify-center items-center h-full">
          <DotLoaderSpinner color="#6B21A8" />
        </div>
      );
    }
    return (
      <div className="w-full h-[80vh] relative overflow-auto bg-gray-100 p-4">
        <div className="flex flex-col items-center">
          <div
            ref={pptxContainerRef}
            className="w-full max-w-4xl pptx-preview-container"
          />

          {pptxSlides > 1 && (
            <div className="mt-4 flex items-center space-x-4">
              <button
                onClick={handlePreviousSlide}
                disabled={currentPptxSlide === 1}
                className="px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Slide {currentPptxSlide} of {pptxSlides}
              </span>
              <button
                onClick={handleNextSlide}
                disabled={currentPptxSlide === pptxSlides}
                className="px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

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

      case "docx":
        return (
          <div className="w-full h-[80vh] overflow-auto bg-gray-100 p-4">
            {isLoading && (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-purple-600"></div>
              </div>
            )}
            {error && (
              <div className="text-red-500 text-center mt-4">
                Error loading document: {error.message}
              </div>
            )}
            <div
              ref={previewContainerRef}
              className={`w-full h-full ${isLoading || error ? "hidden" : ""}`}
            />
          </div>
        );

      case "ppt":
      case "pptx":
        return renderPptxContent();

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
