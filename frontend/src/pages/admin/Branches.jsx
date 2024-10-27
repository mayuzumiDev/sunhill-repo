import React, { useState } from "react";
import sunhillBats from "../../assets/img/home/sunhill-bats.jpg"; // Importing the image
import rosario from "../../assets/img/home/rosario.jpg"; // Importing the image
import bauan from "../../assets/img/home/bauan.jpg"; // Importing the image

const Branches = () => {
  const initialBranches = [
    { id: 1, name: "Batangas", teachers: 5, students: 120, parents: 80, classes: 10, image: sunhillBats },
    { id: 2, name: "Rosario", teachers: 7, students: 150, parents: 90, classes: 15, image: rosario },
    { id: 4, name: "Bauan", teachers: 6, students: 100, parents: 70, classes: 12, image: bauan },
  ];

  const [branches, setBranches] = useState(initialBranches);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleBranchClick = (branch) => {
    setSelectedBranch(branch);
  };

  const handleDeleteBranch = (id) => {
    setBranches(branches.filter(branch => branch.id !== id));
    setSelectedBranch(null);
  };

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl sm:text-4xl text-gray-800 font-bold mb-6 font-montserrat text-left">
        Branches
      </h1>
      <input
        type="text"
        placeholder="Search branches..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded mb-7 w-full max-w-md mx-auto"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBranches.map((branch) => (
          <div
            key={branch.id}
            className="border rounded-lg shadow-2xl cursor-pointer transition-all transform hover:scale-105 relative overflow-hidden"
            onClick={() => handleBranchClick(branch)}
            style={{
              backgroundImage: `url(${branch.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '200px', // Smaller height for smaller screens
            }}
          >
            <div
              className="absolute inset-0 transition-transform duration-700 hover:scale-110"
              style={{
                backgroundImage: `url(${branch.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(1px)',
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-75 rounded-lg"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 tracking-wide drop-shadow-lg">{branch.name}</h2>
              <p className="text-sm sm:text-lg font-medium drop-shadow-lg">Click for details</p>
            </div>
          </div>
        ))}
      </div>

      {selectedBranch && (
        <div className="mt-8 p-6 border rounded-lg bg-white shadow-lg max-w-full lg:max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">{selectedBranch.name} Report</h2>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">Summary</h3>
          <p className="text-gray-700 mb-2">Here are the key details for {selectedBranch.name}:</p>
          <ul className="list-disc list-inside mb-4">
            <li>Teachers: {selectedBranch.teachers}</li>
            <li>Students: {selectedBranch.students}</li>
            <li>Parents: {selectedBranch.parents}</li>
            <li>Classes Conducted: {selectedBranch.classes}</li>
          </ul>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">Additional Information</h3>
          <p className="text-gray-700">This branch has a robust teaching staff and actively engages with the parent community.</p>
          <p className="text-gray-700">Each class is tailored to meet the needs of the students, ensuring a high-quality educational experience.</p>
          <button 
            onClick={() => handleDeleteBranch(selectedBranch.id)}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full sm:w-auto"
          >
            Delete Branch
          </button>
        </div>
      )}
    </div>
  );
};

export default Branches;
