import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faExclamationTriangle,
  faCalendarAlt,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { axiosInstance } from "../../utils/axiosInstance";
import EventCard from "../../components/admin/events/EventCard";
import AddEventForm from "../../components/admin/events/AddEventForm";
import SatyamLoader from "../../components/loaders/SatyamLoader";
import HideScrollbar from "../../components/misc/HideScrollBar";
import { motion, AnimatePresence } from "framer-motion";
import EditEventForm from "../../components/admin/events/EditEventForm";

const Events = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isEditEvent, setIsEditEvent] = useState({
    show: false,
    eventData: null,
  });
  const [isEmpty, setIsEmpty] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    eventId: null,
    eventTitle: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid, list

  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentDate = new Date();
  const upcomingEvents = filteredEvents
    .filter((event) => new Date(event.date) >= currentDate)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const finishedEvents = filteredEvents
    .filter((event) => new Date(event.date) <= currentDate)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleAddEvent = async () => {
    await fetchEvents();
    setIsAddEventOpen(false);
  };

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setIsEmpty(false);

      const response = await axiosInstance.get("/user-admin/event/list/");
      if (response.status === 200) {
        const eventData = response.data.events;
        // console.log("Fetched events with branch data:", eventData);
        if (eventData.length === 0) {
          setIsEmpty(true);
        }

        setEvents(Array.isArray(eventData) ? eventData : []);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditEvent = async (event) => {
    // console.log('Opening edit form with event data:', event);
    setIsEditEvent({
      show: true,
      eventData: event,
    });
  };

  const handleEditSuccess = async () => {
    setIsEditEvent({
      show: false,
      eventData: null,
    });

    await fetchEvents();
  };

  const showDeleteConfirmation = (eventId, eventTitle) => {
    setDeleteConfirm({
      show: true,
      eventId,
      eventTitle,
    });
  };

  const hideDeleteConfirmation = () => {
    setDeleteConfirm({
      show: false,
      eventId: null,
      eventTitle: null,
    });
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await axiosInstance.delete(
        `/user-admin/event/delete/${eventId}/`
      );

      if (response.status === 200) {
        await fetchEvents();
        hideDeleteConfirmation();
        setSuccessMessage(true);

        setTimeout(() => {
          setSuccessMessage(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      console.error("Error response:", error.response);
      hideDeleteConfirmation();
      setErrorMessage(true);
      setTimeout(() => {
        setErrorMessage(false);
      }, 3000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="sm:p-2 p-0 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="flex-shrink-0"
              >
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="text-blue-500 text-2xl sm:text-3xl md:text-4xl"
                />
              </motion.div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-montserrat bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
                Events & Announcements
              </h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
              onClick={() => setIsAddEventOpen(true)}
            >
              <FontAwesomeIcon icon={faPlus} className="text-base sm:text-lg" />
              <span>Create Event</span>
            </motion.button>
          </div>

          {/* Search and Filter Bar */}
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
              />
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px]"
            >
              <SatyamLoader />
            </motion.div>
          ) : isEmpty ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8 sm:py-12 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] bg-white rounded-2xl shadow-lg px-4 sm:px-6"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="text-gray-400 mb-4 text-4xl sm:text-5xl"
                />
              </motion.div>
              <p className="text-gray-500 text-lg sm:text-xl font-medium">
                No events available
              </p>
              <p className="text-gray-400 mt-2 text-sm sm:text-base">
                Create your first event by clicking the Create Event button
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAddEventOpen(true)}
                className="mt-6 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
              >
                Create Your First Event
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              layout
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Upcoming Event Section */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-green-500 rounded-full px-4 py-2 text-lg font-medium text-white">
                    Upcoming Events
                  </span>
                </div>
              </div>
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    layout
                    key={event.id}
                    variants={itemVariants}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.1,
                      layout: { duration: 0.3 },
                    }}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <EventCard
                      event={event}
                      onEdit={() => handleEditEvent(event)}
                      onDelete={() =>
                        showDeleteConfirmation(event.id, event.title)
                      }
                    />
                  </motion.div>
                ))}
              </div>

              {/* Finished Event Section */}
              {finishedEvents.length > 0 && (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-red-500 rounded-full px-4 py-2 text-lg font-medium text-white">
                        Finished Events
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {finishedEvents.map((event, index) => (
                      <motion.div
                        layout
                        key={event.id}
                        variants={itemVariants}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.1,
                          layout: { duration: 0.3 },
                        }}
                        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                      >
                        <EventCard
                          event={event}
                          onEdit={() => handleEditEvent(event)}
                          onDelete={() =>
                            showDeleteConfirmation(event.id, event.title)
                          }
                        />
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AddEventForm
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        onSave={handleAddEvent}
      />
      <EditEventForm
        isOpen={isEditEvent.show}
        onClose={() => setIsEditEvent({ show: false, eventData: null })}
        onSuccess={handleEditSuccess}
        editData={isEditEvent.eventData}
      />

      <AnimatePresence>
        {deleteConfirm.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-0"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md mx-4 shadow-2xl"
            >
              <div className="text-center">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-red-500 text-3xl sm:text-4xl mb-4"
                  />
                </motion.div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                  Confirm Deletion
                </h3>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">
                  Are you sure you want to delete "{deleteConfirm.eventTitle}"?
                  This action cannot be undone.
                </p>
                <div className="flex justify-center gap-3 sm:gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteEvent(deleteConfirm.eventId)}
                    className="px-5 sm:px-6 py-2.5 sm:py-3 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors shadow-md hover:shadow-lg text-sm sm:text-base"
                  >
                    Delete
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={hideDeleteConfirmation}
                    className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(successMessage || errorMessage) && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-50 w-[90%] sm:w-auto"
          >
            <div
              className={`px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg ${
                successMessage
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                  : "bg-gradient-to-r from-red-500 to-red-600 text-white"
              }`}
            >
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <FontAwesomeIcon
                  icon={successMessage ? faCalendarAlt : faExclamationTriangle}
                  className="text-lg sm:text-xl"
                />
                <span className="font-medium text-sm sm:text-base">
                  {successMessage
                    ? "Event deleted successfully"
                    : "Failed to delete event"}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <HideScrollbar />
    </motion.div>
  );
};

export default Events;
