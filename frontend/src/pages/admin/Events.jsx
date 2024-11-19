import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { axiosInstance } from "../../utils/axiosInstance";
import EventCard from "../../components/admin/events/EventCard";
import AddEventForm from "../../components/admin/events/AddEventForm";
import SatyamLoader from "../../components/loaders/SatyamLoader";
import HideScrollbar from "../../components/misc/HideScrollBar";

const Events = () => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    eventId: null,
    eventTitle: "",
  });

  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, [events]);

  const fetchEvents = async () => {
    try {
      setIsEmpty(false);

      const response = await axiosInstance.get("/user-admin/event/list/");
      if (response.status === 200) {
        const eventData = response.data.events_list;
        if (eventData.length === 0) {
          setIsEmpty(true);
        }

        setEvents(Array.isArray(eventData) ? eventData : []);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleAddEvent = async () => {
    fetchEvents();
    setIsAddEventOpen(false);
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
        fetchEvents();
        hideDeleteConfirmation();
        setSuccessMessage(true);

        setTimeout(() => {
          setSuccessMessage(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      hideDeleteConfirmation();
      setErrorMessage(true);
      setTimeout(() => {
        setErrorMessage(false);
      }, 3000);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          {" "}
          <h1 className="text-3xl sm:text-4xl text-gray-800 font-bold font-montserrat">
            Events & Announcements
          </h1>
          <button
            className="bg-blue-500 text-white font-semibold py-2 px-3 rounded-lg hover:bg-blue-600 transition flex items-center text-xs sm:text-lg sm:py-2 sm:px-4"
            onClick={() => setIsAddEventOpen(true)}
          >
            <FontAwesomeIcon
              icon={faPlus}
              className="mr-2 text-sm sm:text-lg"
            />
            Add
          </button>
        </div>

        {events.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[200px]">
            <div style={{ transform: "translateY(100%)" }}>
              <SatyamLoader />
            </div>
          </div>
        )}

        {isEmpty ? (
          <div className="text-center py-12 flex flex-col items-center justify-center min-h-[400px]">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              size="2x"
              className="text-red-500 mb-2"
            />
            <p className="text-gray-500 text-lg">No events available</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onDelete={() => showDeleteConfirmation(event.id, event.title)}
              />
            ))}
          </div>
        )}
      </div>

      <AddEventForm
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        onSave={handleAddEvent}
      />

      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="text-center">
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete "{deleteConfirm.eventTitle}"?
                This action cannot be undone.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => handleDeleteEvent(deleteConfirm.eventId)}
                  className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
                >
                  Yes
                </button>
                <button
                  onClick={hideDeleteConfirmation}
                  className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium rounded-lg"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="px-6 py-4 bg-green-50 border border-green-400 rounded-lg text-green-500">
            Event deletion complete.
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="px-6 py-4 bg-red-50 border border-red-400 rounded-lg text-red-500">
            Event deletion failed.
          </div>
        </div>
      )}
      <HideScrollbar />
    </div>
  );
};

export default Events;
