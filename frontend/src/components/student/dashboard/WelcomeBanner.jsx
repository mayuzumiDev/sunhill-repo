import React from "react";

const WelcomeBanner = ({ studentName = "Student" }) => {
  return (
    <div
      className="relative overflow-hidden rounded-xl bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 p-6 
    shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out
    hover:scale-[1.02]"
    >
      {/* Decorative circles in the background */}
      <div
        className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-yellow-200 opacity-50 animate-pulse 
      group-hover:animate-ping"
      ></div>
      <div
        className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-pink-200 opacity-50 animate-pulse delay-100
      group-hover:animate-ping"
      ></div>
      {/* Additional decorative circles */}
      <div className="absolute top-1/2 -right-8 h-20 w-20 rounded-full bg-purple-200 opacity-30 animate-pulse delay-150"></div>
      <div className="absolute top-1/4 -left-6 h-12 w-12 rounded-full bg-indigo-200 opacity-40 animate-pulse delay-200"></div>
      <div className="absolute -bottom-6 right-1/4 h-14 w-14 rounded-full bg-blue-200 opacity-40 animate-pulse delay-300"></div>
      <div className="absolute top-8 right-1/3 h-10 w-10 rounded-full bg-pink-200 opacity-30 animate-pulse delay-75"></div>
      <div className="absolute -top-6 left-1/3 h-16 w-16 rounded-full bg-purple-100 opacity-40 animate-pulse delay-200"></div>

      <div className="relative">
        {/* Main greeting with wave animation */}
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-bold text-gray-700 transition-colors duration-300 hover:text-purple-700">
            Hello{" "}
            <span className="text-purple-600 hover:text-purple-800 transition-colors duration-300">
              {studentName}
            </span>
            !
          </h1>
        </div>

        {/* Subtitle with bounce animation */}
        <p
          className="mt-2 text-lg text-gray-600 animate-[bounce_3s_ease-in-out_infinite] 
        hover:text-purple-600 transition-colors duration-300"
        >
          Let's learn something new today!
        </p>
      </div>
    </div>
  );
};

export default WelcomeBanner;
