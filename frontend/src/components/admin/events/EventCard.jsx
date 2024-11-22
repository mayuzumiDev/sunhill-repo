import React, { useState } from "react";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faUsers,
  faPencilAlt,
  faTrash,
  faMapMarkerAlt,
  faClock,
  faChevronRight,
  faTimes,
  faUserGroup,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

const EventCard = ({ event, onDelete, onEdit }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getAudienceBadgeColor = (audience) => {
    switch (audience?.toLowerCase()) {
      case "students":
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white";
      case "teachers":
        return "bg-gradient-to-r from-purple-500 to-purple-600 text-white";
      case "parents":
        return "bg-gradient-to-r from-green-500 to-green-600 text-white";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white";
    }
  };

  const cardVariants = {
    hover: {
      y: -5,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  const formatEventDate = (date) => {
    try {
      return format(new Date(date), "MMMM dd, yyyy");
    } catch {
      return "Date not available";
    }
  };

  const EventDetailsModal = () => (
    <AnimatePresence>
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 relative">
              <motion.button
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowDetails(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
              </motion.button>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white mb-4 inline-block`}
              >
                {event.target_audience?.charAt(0).toUpperCase() +
                  event.target_audience?.slice(1) || "All"}
              </span>
              <h2 className="text-2xl font-bold text-white mt-2">
                {event.title}
              </h2>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center text-gray-700">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="w-5 h-5 mr-3 text-blue-500"
                    />
                    <div>
                      <p className="text-sm font-medium">Date</p>
                      <p className="text-gray-600">
                        {formatEventDate(event.date)}
                      </p>
                    </div>
                  </div>

                  {event.time && (
                    <div className="flex items-center text-gray-700">
                      <FontAwesomeIcon
                        icon={faClock}
                        className="w-5 h-5 mr-3 text-purple-500"
                      />
                      <div>
                        <p className="text-sm font-medium">Time</p>
                        <p className="text-gray-600">{event.time}</p>
                      </div>
                    </div>
                  )}

                  {event.location && (
                    <div className="flex items-center text-gray-700">
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        className="w-5 h-5 mr-3 text-red-500"
                      />
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-gray-600">{event.location}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-gray-700">
                    <FontAwesomeIcon
                      icon={faUserGroup}
                      className="w-5 h-5 mr-3 text-green-500"
                    />
                    <div>
                      <p className="text-sm font-medium">Organizer</p>
                      <p className="text-gray-600">
                        {event.organizer || "School Administration"}
                      </p>
                    </div>
                  </div>

                  {event.contact && (
                    <div className="flex items-center text-gray-700">
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="w-5 h-5 mr-3 text-yellow-500"
                      />
                      <div>
                        <p className="text-sm font-medium">Contact</p>
                        <p className="text-gray-600">{event.contact}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>

              {event.additional_info && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Additional Information
                  </h3>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {event.additional_info}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-100 p-6 bg-gray-50 flex justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowDetails(false)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              >
                Close
              </motion.button>
              {event.registration_link && (
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={event.registration_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                >
                  Register Now
                </motion.a>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <motion.div
        whileHover="hover"
        variants={cardVariants}
        className="bg-white rounded-xl shadow-lg overflow-hidden h-full border border-gray-100 flex flex-col"
      >
        {/* Card Header */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-b border-gray-100">
          <div className="flex justify-between items-start mb-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getAudienceBadgeColor(
                event.target_audience
              )}`}
            >
              {event.target_audience?.charAt(0).toUpperCase() +
                event.target_audience?.slice(1) || "All"}
            </span>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onEdit(event)}
                className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors"
              >
                <FontAwesomeIcon icon={faPencilAlt} className="w-3.5 h-3.5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(event)}
                className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
              >
                <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
            {event.title}
          </h2>
        </div>

        {/* Card Body */}
        <div className="p-4 flex-1">
          <div className="space-y-3 mb-4">
            <div className="flex items-center text-gray-600">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="w-4 h-4 mr-3 text-blue-500"
              />
              <span className="text-sm">{formatEventDate(event.date)}</span>
            </div>
            {event.time && (
              <div className="flex items-center text-gray-600">
                <FontAwesomeIcon
                  icon={faClock}
                  className="w-4 h-4 mr-3 text-purple-500"
                />
                <span className="text-sm">{event.time}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center text-gray-600">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="w-4 h-4 mr-3 text-red-500"
                />
                <span className="text-sm">{event.location}</span>
              </div>
            )}
          </div>

          <div className="relative">
            <p className="text-gray-600 text-sm line-clamp-3 mb-2">
              {event.description}
            </p>
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent"></div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 mt-auto">
          <button
            onClick={() => setShowDetails(true)}
            className="w-full flex items-center justify-between text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 group"
          >
            <span>View Details</span>
            <FontAwesomeIcon
              icon={faChevronRight}
              className="w-3 h-3 transform transition-transform duration-200 group-hover:translate-x-1"
            />
          </button>
        </div>
      </motion.div>

      <EventDetailsModal />
    </>
  );
};

export default EventCard;