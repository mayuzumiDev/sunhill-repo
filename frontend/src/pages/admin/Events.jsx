import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { axiosInstance } from "../../utils/axiosInstance";
import EventCard from "../../components/admin/events/EventCard";
import AddEventForm from "../../components/admin/events/AddEventForm";
import SatyamLoader from "../../components/loaders/SatyamLoader";
import HideScrollbar from "../../components/misc/HideScrollBar";

const Events = () => {
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsEmpty(false);

      const response = await axiosInstance.get("/user-admin/event/list/");
      if (response.status === 200) {
        const eventData = response.data.events_list;
        console.log("Events:", eventData);
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
    console.log("Add Event");
    setIsAddEventOpen(false);
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
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      <AddEventForm
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        onSave={handleAddEvent}
      />
      <HideScrollbar />
    </div>
  );
};

export default Events;
