import React, { useState } from "react";

const Branches = () => {
  const initialBranches = [
    { id: 1, name: "Batangas", teachers: 5, students: 120, parents: 80, classes: 10 },
    { id: 2, name: "Rosario", teachers: 7, students: 150, parents: 90, classes: 15 },
    { id: 3, name: "Tagaytay", teachers: 4, students: 80, parents: 50, classes: 8 },
    { id: 4, name: "Bauan", teachers: 6, students: 100, parents: 70, classes: 12 },
  ];

  const colors = [
    "bg-blue-100",
    "bg-green-100",
    "bg-yellow-100",
    "bg-red-100",
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
      <h1 className="text-4xl text-gray-800 font-bold mb-6 font-montserrat text-left">
        Branches
      </h1>
      <input
        type="text"
        placeholder="Search branches..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded mb-4 w-full max-w-md mx-auto"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredBranches.map((branch, index) => (
          <div
            key={branch.id}
            className={`border rounded-lg shadow-lg p-6 cursor-pointer transition-transform transform hover:scale-105 ${colors[index % colors.length]}`}
            onClick={() => handleBranchClick(branch)}
          >
            <h2 className="text-2xl font-semibold mb-2">{branch.name}</h2>
            <p className="text-gray-600">Click for details</p>
          </div>
        ))}
      </div>

      {selectedBranch && (
        <div className="mt-8 p-6 border rounded-lg bg-white shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{selectedBranch.name} Report</h2>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Summary</h3>
          <p className="text-gray-700 mb-2">Here are the key details for {selectedBranch.name}:</p>
          <ul className="list-disc list-inside mb-4">
            <li>Teachers: {selectedBranch.teachers}</li>
            <li>Students: {selectedBranch.students}</li>
            <li>Parents: {selectedBranch.parents}</li>
            <li>Classes Conducted: {selectedBranch.classes}</li>
          </ul>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Additional Information</h3>
          <p className="text-gray-700">This branch has a robust teaching staff and actively engages with the parent community.</p>
          <p className="text-gray-700">Each class is tailored to meet the needs of the students, ensuring a high-quality educational experience.</p>
          <button 
            onClick={() => handleDeleteBranch(selectedBranch.id)}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete Branch
          </button>
        </div>
      )}
    </div>
  );
};

export default Branches;
