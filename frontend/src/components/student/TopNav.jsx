import React, { useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { FaChevronDown, FaUser, FaSignOutAlt,FaGraduationCap, FaBars, FaBell, FaEdit, FaSave, FaCamera } from 'react-icons/fa';
import SunhillLogo from '../../assets/img/home/sunhill.jpg';
import './student.css';
import StudentProfile from './StudentProfile';
import Logout from './Logout';
import { AnimatePresence } from 'framer-motion';

const TopNav = ({ student, onLogout, onOpenProfile, onOpenSettings, onOpenHelp, onOpenNotifications, onStartTutorial, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setIsProfileOpen(true);
  };

  const handleSave = (updatedStudent) => {
    onUpdateProfile(updatedStudent);
    setIsEditing(false);
    setIsProfileOpen(false);
  };

  const handleToggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsEditing(false);
  };

  const handleCloseProfile = () => {
    setIsProfileOpen(false);
    setIsEditing(false);
  };

  const handleLogout = () => {
    setIsLogoutOpen(true);
  };

  const handleCancelLogout = () => {
    setIsLogoutOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-2 lg:p-3">
        {/* Sunhill LMS Logo */}
        <div className="flex items-center">
          <img 
            src={SunhillLogo} 
            alt="Sunhill LMS Logo" 
            className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 mr-2 rounded-full shadow-lg hover:scale-110 transition-transform duration-200" 
          />
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
            Sunhill LMS
          </h1>
        </div>

        {/* Student Profile and Notifications */}
        <div className="flex items-center">
          {/* Notification Button */}
          <button
            onClick={onOpenNotifications}
            className="text-white mr-4 hover:text-yellow-300 transition-colors duration-200"
          >
            <FaBell className="w-5 h-5" />
          </button>
          <div className="hidden sm:block text-white text-right mr-2 lg:mr-3">
            <p className="text-sm lg:text-base font-semibold">{student.name}</p>
            <p className="text-xs flex items-center justify-end">
              <FaGraduationCap className="mr-1" /> Student
            </p>
          </div>
          <Menu as="div" className="relative">
            {({ open }) => (
              <>
                <Menu.Button className="flex items-center space-x-1 lg:space-x-2 bg-white rounded-full p-1 hover:bg-yellow-300 transition-all duration-200">
                  <img
                    src={student.profilePicture}
                    alt={`${student.name}'s profile`}
                    className="w-6 h-6 sm:w-8 sm:h-8 lg:w-9 lg:h-9 rounded-full object-cover border-2 border-purple-300"
                  />
                  <FaChevronDown className="text-purple-600 hidden sm:block" />
                  <FaBars className="text-purple-600 sm:hidden" />
                </Menu.Button>

                {/* Dropdown Menu */}
                <Transition
                  show={open}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items static className="absolute right-0 mt-2 w-44 sm:w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50">
                    <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 sm:hidden">
                      <p className="text-sm font-medium text-gray-800">{student.name}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <FaGraduationCap className="mr-1" /> Student
                      </p>
                    </div>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleToggleProfile}
                          className={`${
                            active ? 'bg-blue-100' : ''
                          } flex items-center w-full px-3 py-2 text-blue-700 text-left text-sm`}
                        >
                          <FaEdit className="mr-2 text-blue-500" /> Edit Profile
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${
                            active ? 'bg-blue-100' : ''
                          } flex items-center w-full px-3 py-2 text-blue-700 text-left text-sm`}
                        >
                          <FaSignOutAlt className="mr-2 text-blue-500" /> Log Out
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>
        </div>
      </div>
      <AnimatePresence>
        {isProfileOpen && (
          <StudentProfile 
            student={student} 
            onUpdateProfile={handleSave} 
            isEditing={isEditing} 
            setIsEditing={setIsEditing} 
            onLogout={handleLogout}
            onClose={handleCloseProfile} 
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isLogoutOpen && (
          <Logout 
            onLogout={onLogout} 
            onCancel={handleCancelLogout}
            student={student}
          />
        )}
      </AnimatePresence>
    </header>
  );
};

export default TopNav;
