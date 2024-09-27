import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const Public = () => {
  const [publicUsers, setPublicUsers] = useState([
    { id: 1, name: "Alice Johnson", accessDate: "2024-09-24", location: "New York", device: "Tablet" },
    { id: 2, name: "Mark Smith", accessDate: "2024-09-23", location: "California", device: "Laptop" },
  ]);
  
  const [newUser, setNewUser] = useState({ name: "", email: "", location: "", device: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditUser = (user) => {
    // Implement editing functionality here
    console.log("Editing user:", user);
  };

  const handleDeleteUser = (id) => {
    setPublicUsers(publicUsers.filter(user => user.id !== id));
  };

  const handleSelfRegistration = () => {
    if (newUser.name && newUser.email && newUser.location && newUser.device) {
      const newId = publicUsers.length ? publicUsers[publicUsers.length - 1].id + 1 : 1;
      setPublicUsers([...publicUsers, { id: newId, ...newUser }]);
      setNewUser({ name: "", email: "", location: "", device: "" });
      setIsModalOpen(false);
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-4xl text-gray-800 font-bold mb-4">Manage Accounts</h1>
      <h2 className="text-lg text-gray-700 font-semibold mb-4">Public Users</h2>

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition mt-4"
      >
        Self Register
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-96">
            <h2 className="text-lg font-semibold mb-4">Register New User</h2>
            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="border rounded p-2 w-full mb-4"
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="border rounded p-2 w-full mb-4"
            />
            <input
              type="text"
              placeholder="Location"
              value={newUser.location}
              onChange={(e) => setNewUser({ ...newUser, location: e.target.value })}
              className="border rounded p-2 w-full mb-4"
            />
            <input
              type="text"
              placeholder="Device (Tablet/Laptop)"
              value={newUser.device}
              onChange={(e) => setNewUser({ ...newUser, device: e.target.value })}
              className="border rounded p-2 w-full mb-4"
            />
            <button onClick={handleSelfRegistration} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Register
            </button>
            <button onClick={() => setIsModalOpen(false)} className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 ml-2">
              Cancel
            </button>
          </div>
        </div>
      )}

      <PublicUserTable 
        users={publicUsers} 
        onEditUser={handleEditUser} 
        onDeleteUser={handleDeleteUser} 
      />

      <DeviceMonitoring devices={publicUsers} />
    </div>
  );
};

const PublicUserTable = ({ users, onEditUser, onDeleteUser }) => (
  <div className="overflow-x-auto mt-4">
    {users.length === 0 ? (
      <div className="text-center text-gray-500">No public users found.</div>
    ) : (
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="py-2 px-4 text-left">ID</th>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Access Date</th>
            <th className="py-2 px-4 text-left">Location</th>
            <th className="py-2 px-4 text-left">Device</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-100">
              <td className="py-2 px-4">{user.id}</td>
              <td className="py-2 px-4">{user.name}</td>
              <td className="py-2 px-4">{user.accessDate}</td>
              <td className="py-2 px-4">{user.location}</td>
              <td className="py-2 px-4">{user.device}</td>
              <td className="py-2 px-4 flex space-x-1">
                <button className="text-blue-500 hover:underline" onClick={() => onEditUser(user)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="text-red-500 hover:underline" onClick={() => onDeleteUser(user.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

const DeviceMonitoring = ({ devices }) => {
  const deviceCounts = devices.reduce((acc, user) => {
    acc[user.device] = (acc[user.device] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mt-8">
      <h2 className="text-lg text-gray-700 font-semibold mb-4">Device Usage Statistics</h2>
      <ul>
        {Object.entries(deviceCounts).map(([device, count]) => (
          <li key={device} className="py-1">
            {device}: {count}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Public;
