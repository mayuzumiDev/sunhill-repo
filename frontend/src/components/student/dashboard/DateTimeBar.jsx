import React, { useState, useEffect } from "react";
import { FaClock, FaCalendarAlt } from "react-icons/fa";

const DateTimeBar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 mt-6">
      <div className="bg-white/90 backdrop-blur-sm p-4 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out mb-8 flex flex-col sm:flex-row justify-between items-center gap-3 hover:bg-white">
        <div className="flex items-center text-lg sm:text-xl text-purple-600 group hover:text-purple-700 transition-colors duration-300">
          <FaClock className="mr-2 animate-pulse" />
          <span className="font-medium text-gray-600">Time:</span>
          <span className="font-bold ml-2 tracking-wide group-hover:scale-105 transition-transform duration-300">
            {formatTime(currentTime)}
          </span>
        </div>
        <div className="h-px w-full sm:h-10 sm:w-px bg-gray-200 sm:mx-3" />
        <div className="flex items-center text-lg sm:text-xl text-blue-600 group hover:text-blue-700 transition-colors duration-300">
          <FaCalendarAlt className="mr-2 hover:rotate-3 transition-transform duration-300" />
          <span className="font-medium text-gray-600">Today:</span>
          <span className="font-bold ml-2 tracking-wide group-hover:scale-105 transition-transform duration-300">
            {formatDate(currentTime)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DateTimeBar;
