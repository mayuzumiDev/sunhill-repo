import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faTimes,
  faCalendarAlt,
  faTrash,
  faMapMarkerAlt,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { axiosInstance } from "../../utils/axiosInstance";
import { format } from "date-fns";

const NotificationButton = ({ userRole, userBranch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Get user role and branch from props or localStorage
  const effectiveRole =
    userRole || localStorage.getItem("userRole") || "teacher";
  const effectiveBranch =
    userBranch || localStorage.getItem("userBranch") || "";

  const isAdmin = effectiveRole === "admin";

  useEffect(() => {
    /*     console.log('NotificationButton initialized:', { 
      effectiveRole, 
      effectiveBranch,
      fromProps: { userRole, userBranch },
      fromStorage: { 
        storedRole: localStorage.getItem('userRole'),
        storedBranch: localStorage.getItem('userBranch')
      }
    }); */
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [effectiveRole, effectiveBranch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      // Mark all as read when opening
      try {
        await axiosInstance.post("/user-admin/notifications/mark_all_as_read/");
        setUnreadCount(0);
        // Update notifications to reflect read status
        setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
      } catch (error) {
        console.error("Error marking notifications as read:", error);
      }
    }
  };

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      /*       console.log("Fetching notifications for:", {
        role: effectiveRole,
        branch: effectiveBranch,
      }); */

      const response = await axiosInstance.get("/user-admin/notifications/");

      if (response.status === 200) {
        const { notifications: notificationData, unread_count } = response.data;
        // console.log("Received notifications:", notificationData?.length);

        // Sort notifications by date
        const sortedNotifications = (notificationData || []).sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setNotifications(sortedNotifications);
        setUnreadCount(unread_count);
        // console.log("Set unread count:", unread_count);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]); // Clear notifications on error
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventClick = (notification) => {
    setSelectedEvent(notification.event);
    setShowModal(true);
    setIsOpen(false);
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await axiosInstance.delete(`/user-admin/event/delete/${eventId}/`);
      setNotifications(notifications.filter((n) => n.event.id !== eventId));
      setShowModal(false);
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event. Please try again.");
    }
  };

  const formatEventDate = (date) => {
    try {
      return format(new Date(date), "MMM dd, yyyy");
    } catch {
      return "Date not available";
    }
  };

  const formatEventTime = (date) => {
    try {
      return format(new Date(date), "hh:mm a");
    } catch {
      return "Time not available";
    }
  };

  const formatCreatedAt = (date) => {
    try {
      const now = new Date();
      const createdAt = new Date(date);
      const diffInMinutes = Math.floor((now - createdAt) / (1000 * 60));
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInMinutes < 1) {
        return "Just now";
      } else if (diffInMinutes < 60) {
        return `${diffInMinutes} ${
          diffInMinutes === 1 ? "minute" : "minutes"
        } ago`;
      } else if (diffInHours < 24) {
        return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
      } else if (diffInDays < 7) {
        return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
      } else {
        return format(createdAt, "MMM dd, yyyy hh:mm a");
      }
    } catch {
      return "Time not available";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleNotificationClick}
        className="relative p-2 text-orange-500 hover:text-blue-600 transition-colors duration-200 focus:outline-none"
        aria-label="Notifications"
      >
        <FontAwesomeIcon icon={faBell} className="text-xl md:text-2xl" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg"
          >
            {unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-16 mx-auto md:absolute md:right-0 md:left-auto md:top-full md:mt-2 w-full md:w-96 bg-white rounded-xl shadow-2xl z-50 overflow-hidden border border-gray-100"
            style={{ maxWidth: "calc(100vw - 2rem)" }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-4 flex justify-between items-center">
              <h3 className="text-white font-semibold text-lg">
                Notifications
              </h3>
              <motion.button
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors focus:outline-none"
              >
                <FontAwesomeIcon icon={faTimes} />
              </motion.button>
            </div>

            <div className="max-h-[70vh] md:max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <FontAwesomeIcon
                    icon={faBell}
                    className="text-4xl mb-3 text-gray-300"
                  />
                  <p>No new notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      whileHover={{
                        backgroundColor: "rgba(243, 244, 246, 0.8)",
                      }}
                      onClick={() => handleEventClick(notification)}
                      className={`p-4 transition-colors duration-200 cursor-pointer ${
                        !notification.is_read
                          ? "bg-blue-50 hover:bg-blue-100"
                          : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <FontAwesomeIcon
                              icon={faCalendarAlt}
                              className="text-blue-500 text-lg"
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {notification.event.title}
                            </p>
                            <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                              {formatCreatedAt(notification.created_at)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 flex items-center">
                            <FontAwesomeIcon
                              icon={faCalendarAlt}
                              className="mr-2 text-blue-400"
                            />
                            {formatEventDate(notification.event.date)}
                            <span className="mx-1">•</span>
                            <FontAwesomeIcon
                              icon={faClock}
                              className="mr-2 text-blue-400"
                            />
                            {formatEventTime(notification.event.date)}
                          </p>
                          {notification.event.location && (
                            <p className="text-xs text-gray-500 mt-1 flex items-center">
                              <FontAwesomeIcon
                                icon={faMapMarkerAlt}
                                className="mr-2 text-blue-400"
                              />
                              {notification.event.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gray-50 px-4 py-3 text-center border-t border-gray-100">
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 focus:outline-none"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Details Modal */}
      <AnimatePresence>
        {showModal && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-semibold text-lg">
                    Event Details
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowModal(false)}
                    className="text-white hover:text-gray-200 transition-colors focus:outline-none"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </motion.button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h4 className="text-xl font-semibold text-gray-900">
                    {selectedEvent.title}
                  </h4>
                  <span className="text-sm text-gray-400">
                    {formatCreatedAt(selectedEvent.created_at)}
                  </span>
                </div>

                <div className="space-y-4">
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center text-gray-600 p-3 bg-gray-50 rounded-lg"
                  >
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="w-5 h-5 mr-3 text-blue-500"
                    />
                    <span>{formatEventDate(selectedEvent.date)}</span>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center text-gray-600 p-3 bg-gray-50 rounded-lg"
                  >
                    <FontAwesomeIcon
                      icon={faClock}
                      className="w-5 h-5 mr-3 text-blue-500"
                    />
                    <span>{formatEventTime(selectedEvent.date)}</span>
                  </motion.div>

                  {selectedEvent.location && (
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center text-gray-600 p-3 bg-gray-50 rounded-lg"
                    >
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        className="w-5 h-5 mr-3 text-blue-500"
                      />
                      <span>{selectedEvent.location}</span>
                    </motion.div>
                  )}

                  {selectedEvent.description && (
                    <div className="mt-6">
                      <h5 className="text-sm font-semibold text-gray-700 mb-2">
                        Description
                      </h5>
                      <p className="text-gray-600 text-sm p-3 bg-gray-50 rounded-lg">
                        {selectedEvent.description}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex justify-end space-x-3">
                  {isAdmin && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDeleteEvent(selectedEvent.id)}
                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200 focus:outline-none"
                    >
                      <FontAwesomeIcon icon={faTrash} className="mr-2" />
                      Delete
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm rounded-md hover:from-blue-700 hover:to-purple-700 transition-colors duration-200 focus:outline-none shadow-lg"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationButton;
