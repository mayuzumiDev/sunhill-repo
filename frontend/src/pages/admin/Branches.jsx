import React, { useState } from "react";
import { FaSearch, FaMapMarkerAlt, FaPhone, FaEnvelope, FaUserTie, FaUsers, FaBook, FaChalkboardTeacher, FaCalendarAlt, FaChartLine, FaPlus, FaImage, FaTimes } from "react-icons/fa";
import sunhillBats from "../../assets/img/home/sunhill-bats.jpg";
import rosario from "../../assets/img/home/rosario.jpg";
import bauan from "../../assets/img/home/bauan.jpg";
import { toast } from 'react-toastify';

const initialBranches = [
  {
    id: 1,
    name: "BATANGAS",
    address: "123 Main Street, Batangas City",
    phone: "+63 (43) 123-4567",
    email: "batangas@sunhill.edu",
    principal: "Dr. Maria Santos",
    image: sunhillBats,
    facilities: ["Computer Lab", "Science Lab", "Library", "Playground", "Cafeteria"],
    programs: ["Regular Classes", "After-school Programs", "Summer Camps"],
    achievements: ["Best School Award 2023", "100% Graduation Rate", "Regional Math Competition Winners"],
    stats: {
      attendance: 95,
      satisfaction: 90,
      academicPerformance: 88
    }
  },
  {
    id: 2,
    name: "ROSARIO",
    address: "456 School Avenue, Rosario",
    phone: "+63 (43) 234-5678",
    email: "rosario@sunhill.edu",
    principal: "Dr. Juan Cruz",
    image: rosario,
    facilities: ["Music Room", "Art Studio", "Gymnasium", "Library", "Science Lab"],
    programs: ["Special Education", "Arts Program", "Sports Program"],
    achievements: ["Excellence in Arts 2023", "Sports Championship", "Perfect NAT Scores"],
    stats: {
      attendance: 92,
      satisfaction: 88,
      academicPerformance: 85
    }
  },
  {
    id: 3,
    name: "BAUAN",
    address: "789 Education Road, Bauan",
    phone: "+63 (43) 345-6789",
    email: "bauan@sunhill.edu",
    principal: "Dr. Ana Reyes",
    image: bauan,
    facilities: ["Innovation Hub", "Sports Complex", "Multimedia Room", "Library"],
    programs: ["STEM Focus", "Language Programs", "Leadership Training"],
    achievements: ["Innovation Award 2023", "Environmental Initiative Recognition", "Perfect Licensure Passing Rate"],
    stats: {
      attendance: 94,
      satisfaction: 92,
      academicPerformance: 90
    }
  },
  {
    id: 4,
    name: "METRO TAGAYTAY",
    address: "101 Tagaytay Ridge, Metro Tagaytay",
    phone: "+63 (43) 456-7890",
    email: "tagaytay@sunhill.edu",
    principal: "Dr. Jose Garcia",
    image: sunhillBats,
    facilities: ["Modern Labs", "Auditorium", "Sports Field", "Library"],
    programs: ["International Curriculum", "Music Program", "Tech Innovation"],
    achievements: ["Digital Excellence Award", "Community Service Recognition", "Math Olympics Champions"],
    stats: {
      attendance: 96,
      satisfaction: 94,
      academicPerformance: 92
    }
  }
];

const Branches = () => {
  const [branches, setBranches] = useState(initialBranches);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBranch, setNewBranch] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    principal: "",
    image: null,
    facilities: [],
    programs: [],
    achievements: [],
    stats: {
      attendance: 0,
      satisfaction: 0,
      academicPerformance: 0
    }
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBranch(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBranch = () => {
    if (!newBranch.name || !newBranch.address || !newBranch.image) {
      toast.error("Please fill in all required fields (Name, Address, and Image)");
      return;
    }

    const newId = Math.max(...branches.map(b => b.id)) + 1;
    const branchToAdd = {
      ...newBranch,
      id: newId,
      facilities: [],
      programs: [],
      achievements: []
    };

    setBranches([...branches, branchToAdd]);
    toast.success('Branch created successfully');
    setShowAddModal(false);
    setNewBranch({
      name: "",
      address: "",
      phone: "",
      email: "",
      principal: "",
      image: null,
      facilities: [],
      programs: [],
      achievements: [],
      stats: {
        attendance: 0,
        satisfaction: 0,
        academicPerformance: 0
      }
    });
  };

  const handleBranchClick = (branch) => {
    setSelectedBranch(branch);
    setActiveTab("overview");
  };

  const handleDeleteBranch = (id) => {
    if (window.confirm("Are you sure you want to delete this branch? This action cannot be undone.")) {
      setBranches(branches.filter(branch => branch.id !== id));
      setSelectedBranch(null);
      toast.success('Branch deleted successfully');
    }
  };

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderTabContent = () => {
    if (!selectedBranch) return null;

    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Contact Information</h3>
                <div className="space-y-2">
                  <p className="flex items-center text-gray-600"><FaMapMarkerAlt className="mr-2" /> {selectedBranch.address}</p>
                  <p className="flex items-center text-gray-600"><FaPhone className="mr-2" /> {selectedBranch.phone}</p>
                  <p className="flex items-center text-gray-600"><FaEnvelope className="mr-2" /> {selectedBranch.email}</p>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Leadership</h3>
                <p className="flex items-center text-gray-600"><FaUserTie className="mr-2" /> Principal: {selectedBranch.principal}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <FaUsers className="mr-2" /> Population
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li>Teachers: {selectedBranch.stats.attendance}%</li>
                  <li>Students: {selectedBranch.stats.satisfaction}%</li>
                  <li>Parents: {selectedBranch.stats.academicPerformance}%</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                  <FaChartLine className="mr-2" /> Performance
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li>Attendance: {selectedBranch.stats.attendance}%</li>
                  <li>Satisfaction: {selectedBranch.stats.satisfaction}%</li>
                  <li>Academic: {selectedBranch.stats.academicPerformance}%</li>
                </ul>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                  <FaBook className="mr-2" /> Education
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li>Classes: {selectedBranch.programs.length}</li>
                  <li>Student-Teacher Ratio: {Math.round(selectedBranch.students / selectedBranch.teachers)}:1</li>
                </ul>
              </div>
            </div>
          </div>
        );
      case "facilities":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Available Facilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedBranch.facilities.map((facility, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow border">
                  <h4 className="font-semibold text-gray-800">{facility}</h4>
                </div>
              ))}
            </div>
          </div>
        );
      case "programs":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Educational Programs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedBranch.programs.map((program, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow border">
                  <h4 className="font-semibold text-gray-800">{program}</h4>
                </div>
              ))}
            </div>
          </div>
        );
      case "achievements":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Achievements</h3>
            <div className="space-y-4">
              {selectedBranch.achievements.map((achievement, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow border">
                  <h4 className="font-semibold text-gray-800">{achievement}</h4>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl sm:text-4xl text-gray-800 font-bold font-montserrat">
            Branches
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
          >
            <FaPlus className="mr-2" /> Add Branch
          </button>
        </div>
        
        <div className="relative mb-7">
          <input
            type="text"
            placeholder="Search branches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredBranches.map((branch) => (
            <div
              key={branch.id}
              className="relative group cursor-pointer rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105"
              onClick={() => handleBranchClick(branch)}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${branch.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
              <div className="relative p-6 flex flex-col h-[200px] justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{branch.name}</h2>
                  <p className="text-gray-200 text-sm">
                    <FaMapMarkerAlt className="inline mr-1" /> {branch.address}
                  </p>
                </div>
                <div className="text-white text-sm space-y-1">
                  <p><FaUsers className="inline mr-1" /> {branch.stats.attendance}% Attendance</p>
                  <p><FaChalkboardTeacher className="inline mr-1" /> {branch.stats.satisfaction}% Satisfaction</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedBranch && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
                {selectedBranch.name} Branch
              </h2>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleDeleteBranch(selectedBranch.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete Branch
                </button>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex space-x-4 border-b">
                {["overview", "facilities", "programs", "achievements"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 font-medium transition-colors ${
                      activeTab === tab
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              {renderTabContent()}
            </div>
          </div>
        )}
      </div>

      {/* Add Branch Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Add New Branch</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Image Upload */}
              <div className="flex flex-col items-center space-y-4">
                <div 
                  className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer overflow-hidden relative"
                  style={{
                    backgroundImage: newBranch.image ? `url(${newBranch.image})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {!newBranch.image && (
                    <div className="flex flex-col items-center">
                      <FaImage className="text-4xl text-gray-400" />
                      <p className="text-sm text-gray-500 mt-2">Click to upload cover photo</p>
                      <p className="text-xs text-gray-400 mt-1">(Required)</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Branch Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newBranch.name}
                    onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newBranch.address}
                    onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={newBranch.phone}
                    onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={newBranch.email}
                    onChange={(e) => setNewBranch({ ...newBranch, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Teachers</label>
                  <input
                    type="number"
                    value={newBranch.teachers}
                    onChange={(e) => setNewBranch({ ...newBranch, teachers: parseInt(e.target.value) || 0 })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Students</label>
                  <input
                    type="number"
                    value={newBranch.students}
                    onChange={(e) => setNewBranch({ ...newBranch, students: parseInt(e.target.value) || 0 })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Classes</label>
                  <input
                    type="number"
                    value={newBranch.classes}
                    onChange={(e) => setNewBranch({ ...newBranch, classes: parseInt(e.target.value) || 0 })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBranch}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add Branch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Branches;