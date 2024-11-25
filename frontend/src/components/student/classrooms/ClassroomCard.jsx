import React, { useState } from "react";

const ClassroomCard = ({ classroomData, onSelect }) => {
  return (
    <>
      <div
        onClick={() => onSelect(classroomData)}
        className="bg-gradient-to-r from-purple-700 to-purple-400 rounded-lg p-8 shadow-md cursor-pointer transition-all hover:shadow-xl hover:scale-105 relative overflow-hidden min-w-[280px] w-full max-w-[400px] min-h-[200px] flex flex-col"
      >
        {/* Circle shapes */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full -mr-12 -mt-12 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/20 rounded-full -ml-10 -mb-10 animate-bounce"></div>

        {/* Triangle shape */}
        <div
          className="absolute top-1/4 right-1/4 w-16 h-16 bg-white/20 animate-ping"
          style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
        ></div>

        {/* Diamond shape */}
        <div
          className="absolute bottom-1/4 right-1/3 w-14 h-14 bg-white/20 animate-spin"
          style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
        ></div>

        {/* Hexagon shape */}
        <div
          className="absolute top-1/3 left-1/4 w-16 h-16 bg-white/10 animate-bounce"
          style={{
            clipPath:
              "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
          }}
        ></div>

        {/* Star shape */}
        <div
          className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-white/20 animate-pulse"
          style={{
            clipPath:
              "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
          }}
        ></div>

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex-grow">
            <h2 className="font-bold text-2xl md:text-3xl text-white mb-4">
              {`${classroomData.grade_level} - ${classroomData.class_section}`}
            </h2>

            <p className="text-white/80 text-lg md:text-xl">
              Subject:{" "}
              <span className="font-bold text-white">
                {classroomData.subject_display}
              </span>
            </p>
          </div>

          <div className="mt-auto">
            <p className="text-white/70 text-base md:text-lg italic">
              Teacher:{" "}
              <span className="font-semibold text-white">
                {classroomData.instructor.full_name}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClassroomCard;
