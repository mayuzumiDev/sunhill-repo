import React from "react";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faUsers,
  faPencilAlt,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const EventCard = ({ event }) => {
  const getAudienceBadgeColor = (audience) => {
    switch (audience) {
      case "students":
        return "bg-blue-100 text-blue-800";
      case "teachers":
        return "bg-purple-100 text-purple-800";
      case "parents":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "MMMM d, yyyy h:mm a");
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] h-full">
      <div className="p-6 flex gap-6">
        <div className="flex-shrink-0 w-1/2">
          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {event.title}
          </h2>

          {/* Date */}
          <div className="flex items-center mb-4 text-gray-600">
            <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 mr-2" />
            <span className="text-sm">{event.formatted_date}</span>
          </div>

          {/* Target Audience */}
          <div className="flex items-center mb-4">
            <FontAwesomeIcon
              icon={faUsers}
              className="w-4 h-4 mr-2 text-gray-600"
            />
            <span
              className={`text-xs px-2 py-1 rounded-full ${getAudienceBadgeColor(
                event.target_audience
              )}`}
            >
              {event.target_audience.charAt(0).toUpperCase() +
                event.target_audience.slice(1)}
            </span>
          </div>
        </div>

        <div className="flex-1 border-l pl-6">
          {/* Description */}
          <p className="text-gray-600 text-sm line-clamp-3">
            {event.description}
          </p>
        </div>

        {/* Action Buttons Section */}
        <div className="flex-shrink-0 border-l pl-6 flex flex-col gap-2 justify-center">
          <button
            // onClick={() => onEdit(event)}
            className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors"
          >
            <FontAwesomeIcon icon={faPencilAlt} className="w-4 h-4" />
          </button>
          <button
            // onClick={() => onDelete(event)}
            className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
          >
            <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
