import React from 'react';

const Tile = ({ title, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:scale-105 transform transition-all">
      <div className="text-5xl text-center mb-4">{icon}</div>
      <div className="text-lg font-bold text-center">{title}</div>
    </div>
  );
};

export default Tile;
