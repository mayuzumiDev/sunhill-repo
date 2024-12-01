import React from 'react';
import NotFoundImage from '../assets/img/home/404.png'; // Ensure your image path is correct

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-300 to-indigo-400 dark:from-gray-700 dark:to-gray-800 p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-opacity-30 bg-white dark:bg-gray-900"></div>
      
      {/* Adjusting the Image Size and Removing the Box */}
      <div className="flex flex-col items-center relative z-10 text-center">
        <div className="flex justify-center mb-8 ">
          {/* <img
            src={NotFoundImage}
            alt="Not Found Illustration"
            className="w-3/4 sm:w-2/3 md:w-1/2 lg:w-1/3 " 
          /> */}
        </div>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-red-600">404</h1> 
        <p className="mt-4 text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-300"> 
          Oops! The page you’re looking for doesn’t exist.
        </p>
        <p className="mt-2 text-sm sm:text-md text-gray-600 dark:text-gray-400">
          It might have been removed, or you may have entered the <span className="text-blue-500">wrong URL</span>.
        </p>
        <a
          href="/"
          className="mt-8 inline-block px-6 py-3 text-md font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
        >
          Go Back to Home
        </a>
      </div>

      <footer className="mt-8 text-xs sm:text-md text-center text-gray-600 dark:text-gray-400 relative z-10">
        © {new Date().getFullYear()} Sunhill Montessori Casa. All rights reserved.
      </footer>
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 h-full w-full pointer-events-none">
        <div className="absolute top-10 left-10 opacity-20 text-blue-200">★</div>
        <div className="absolute top-32 right-20 opacity-20 text-indigo-200">✦</div>
        <div className="absolute bottom-10 left-20 opacity-30 text-blue-300">✿</div>
        <div className="absolute bottom-32 right-10 opacity-20 text-indigo-300">✧</div>
        <div className="absolute top-60 left-10 opacity-20 text-blue-200">★</div>
        <div className="absolute bottom-40 left-60 opacity-30 text-blue-300">✿</div>
        <div className="absolute top-70 right-20 opacity-20 text-indigo-200">✦</div>
        <div className="absolute bottom-110 left-20 opacity-30 text-blue-300">✿</div>
        <div className="absolute bottom-60 right-60 opacity-20 text-indigo-300">✧</div>
      </div>
    </div>
  );
};

export default NotFound;
