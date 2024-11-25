import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CardTiles = ({ icon, title, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 h-48 md:h-44 max-w-sm group"
    >
      <div className="p-6 flex flex-col items-center justify-center h-full w-full">
        <FontAwesomeIcon
          icon={icon}
          className="text-4xl text-purple-800 mb-3 transition-all duration-300 ease-in-out group-hover:-rotate-45 group-hover:scale-125"
        />
        <h3 className="text-2xl font-bold text-purple-800 mb-4 transition-all group-hover:scale-110 duration-300 ease-in-out">
          {title}
        </h3>
      </div>
    </div>
  );
};

export default CardTiles;
