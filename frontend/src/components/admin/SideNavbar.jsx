import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import sunhillLogo from "../../assets/img/home/sunhill.jpg";
import {
  HomeIcon as HomeOutline,
  AcademicCapIcon as TeacherOutline,
  UsersIcon as UsersOutline,
  UserIcon as UserOutline,
  BuildingOfficeIcon as BuildingOutline,
  DocumentCheckIcon as ClipboardOutline,
  BellIcon as BellOutline,
  EnvelopeIcon as MailOutline,
  MagnifyingGlassIcon as SearchOutline,
  QuestionMarkCircleIcon as QuestionOutline,
} from "@heroicons/react/24/outline";

// Tooltip component
function Tooltip({ name, position, isVisible }) {
  if (!isVisible) return null;

  const style = {
    top: position.top + 8 + "px",
    left: position.left + 9 + "px",
    zIndex: 1000,
    whiteSpace: "nowrap",
  };

  return createPortal(
    <div
      className="absolute bg-black text-white text-xs rounded py-1 px-2"
      style={style}
    >
      {name}
    </div>,
    document.body
  );
}

const SideNavbar = ({
  currentTab,
  setCurrentTab,
  toggleSidebar,
  isSidebarOpen,
}) => {
  const [tooltip, setTooltip] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const handleTabClick = useCallback(
    (tab) => {
      if (tab !== currentTab) {
        setCurrentTab(tab);
        if (window.innerWidth < 1024) {
          toggleSidebar();
        }
      }
    },
    [setCurrentTab, currentTab, toggleSidebar]
  );

  const mainTabs = [
    { name: "Dashboard", icon: <HomeOutline className="h-5 w-5" /> },
    { name: "Teachers", icon: <UserOutline className="h-5 w-5" /> },
    { name: "Students", icon: <TeacherOutline className="h-5 w-5" /> },
    { name: "Parents", icon: <UsersOutline className="h-5 w-5" /> },
    { name: "Public", icon: <BuildingOutline className="h-5 w-5" /> },
    // { name: "Branches", icon: <ClipboardOutline className="h-5 w-5" /> },
    { name: "Events", icon: <BellOutline className="h-5 w-5" /> },
  ];

  const additionalTabs = [
    // { name: "Messages", icon: <MailOutline className="h-5 w-5" /> },
    { name: "SpecialED", icon: <SearchOutline className="h-5 w-5" /> },
    { name: "FAQ", icon: <QuestionOutline className="h-5 w-5" /> },
  ];

  return (
    <div>
      <style>
        {`
          @keyframes rotate {
            0% {
              transform: rotate(0deg);
            }
            50% {
              transform: rotate(180deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          /* Apply hover animations to the entire Link element */
          .link-hover:hover {
            background-color: #3b82f6; /* blue-700 */
            transform: scale(1.0); /* Slight scaling for the whole item */
            transition: all 0.2s ease-in-out;
          }
          .link-hover:hover .rotate-on-hover {
            animation: rotate 0.6s ease-in-out;
          }
        `}
      </style>

      <div
        className={`fixed top-0 left-0 h-full ${
          isSidebarOpen ? "w-64" : "w-16"
        } ${
          window.innerWidth < 1024 && !isSidebarOpen ? "hidden" : ""
        } bg-[#1B2430] transition-width duration-300 text-white shadow-lg`}
      >
        <div className="flex flex-col items-center justify-center mt-4 mb-5 h-20 border-b border-gray-200">
          <div className="flex items-center p-4">
            {/* <img
              src={sunhillLogo}
              alt="Sunhill Logo"
              className={`rounded-full shadow-md ${isSidebarOpen ? "h-12 w-12" : "h-8 w-8"}`}
            /> */}
            {isSidebarOpen && (
              <div className="flex flex-col ml-2">
                <h1 className="font-semibold text-lg">
                  <span className="text-red-400">S</span>
                  <span className="text-orange-400">u</span>
                  <span className="text-green-400">n</span>
                  <span className="text-teal-400">h</span>
                  <span className="text-blue-400">i</span>
                  <span className="text-purple-400">l</span>
                  <span className="text-orange-400">l</span>
                  <span className="text-white-500"> LMS</span>
                </h1>
                <p className="text-xs italic">
                  Educating the Leaders of the Future...Today!
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-4rem)] scrollbar-hidden">
          <nav className="mt-4">
            <ul className="flex flex-col space-y-1">
              {isSidebarOpen && (
                <li className="w-full text-left text-gray-400 ml-3 mt-4 font-semibold text-xs md:text-xs sm:text-base sm:ml-4">
                  MENU
                </li>
              )}

              {mainTabs.map(({ name, icon }) => (
                <li key={name} className="w-full relative">
                  <Link
                    to={`/admin/${name.toLowerCase()}/`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleTabClick(name);
                    }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltipPosition({ top: rect.top, left: rect.right });
                      setTooltip(name);
                    }}
                    onMouseLeave={() => setTooltip("")}
                    className={`link-hover flex items-center py-3 mx-2 rounded-2xl transition-all duration-200 ease-in-out ${
                      currentTab === name
                        ? "bg-blue-600 font-bold"
                        : "text-white"
                    } text-xs  md:text-xs sm:text-base`}
                    style={{ width: "calc(100% - 1rem)" }}
                    aria-label={name}
                    role="menuitem"
                  >
                    <span className="mr-4 ml-3.5 sm:mr-2 bounce-on-hover scale-on-hover rotate-on-hover">
                      {icon}
                    </span>
                    {isSidebarOpen && <span>{name}</span>}
                  </Link>
                </li>
              ))}

              {isSidebarOpen && (
                <li className="w-full text-left text-gray-400 ml-3 mt-4 font-semibold text-xs md:text-xs sm:text-base sm:ml-4">
                  SUPPORT
                </li>
              )}

              {additionalTabs.map(({ name, icon }) => (
                <li key={name} className="w-full relative">
                  <Link
                    to={`/admin/${name.toLowerCase().replace(/\s+/g, "-")}/`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleTabClick(name);
                    }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltipPosition({ top: rect.top, left: rect.right });
                      setTooltip(name);
                    }}
                    onMouseLeave={() => setTooltip("")}
                    className={`link-hover flex items-center py-3 mx-2 rounded-2xl transition-all duration-200 ease-in-out ${
                      currentTab === name
                        ? "bg-blue-600 font-bold"
                        : "text-white"
                    } text-xs md:text-xs sm:text-base`}
                    style={{ width: "calc(100% - 1rem)" }}
                    aria-label={name}
                    role="menuitem"
                  >
                    <span className="mr-4 ml-3.5 sm:mr-2 rotate-on-hover">
                      {icon}
                    </span>
                    {isSidebarOpen && <span>{name}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <Tooltip
        name={tooltip}
        position={tooltipPosition}
        isVisible={!isSidebarOpen && tooltip !== ""}
      />
    </div>
  );
};

export default SideNavbar;
