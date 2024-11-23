import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";

const CustomAlert = ({
  message,
  type = "success",
  isVisible,
  onClose,
  autoClose = true,
  duration = 3000,
}) => {
  useEffect(() => {
    if (autoClose && isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose]);

  if (!isVisible) return null;

  const alertStyles = {
    success: {
      bg: "bg-emerald-500",
      text: "text-white",
      icon: faCheckCircle,
    },
    error: {
      bg: "bg-rose-500",
      text: "text-white",
      icon: faExclamationCircle,
    },
  };

  const style = alertStyles[type];

  return (
    <div className="fixed top-8 left-1/2 z-[9999]">
      <div
        className={`flex items-center gap-2 px-4 py-3 rounded-lg border shadow-lg transition-all duration-300 ease-in-out transform opacity-100 -translate-x-1/2 ${style.bg} ${style.text} ${style.border}`}
        style={{
          animation: "0.3s ease-out 0s 1 normal none running slideIn",
        }}
      >
        <FontAwesomeIcon icon={style.icon} className="h-5 w-5" />
        <p className="text-sm font-medium">{message}</p>
      </div>
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translate(-50%, -100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default CustomAlert;
