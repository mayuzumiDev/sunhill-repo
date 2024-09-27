import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from 'react-modal';
import { FaBold, FaItalic, FaStrikethrough } from 'react-icons/fa';
import { marked } from 'marked'; // Updated import

// Modal custom styles
Modal.setAppElement('#root');
const modalStyles = {
  content: {
    top: '0',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, 0)',
    width: '80%',
    maxWidth: '400px',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
  },
};

const SchoolEventsCalendar = ({ setNotifications }) => {
  const [events, setEvents] = useState([
    { id: 1, title: 'Math Exam', date: '2024-10-10', backgroundColor: '#ff4d4d' },
    { id: 2, title: 'Parent-Teacher Meeting', date: '2024-10-15', backgroundColor: '#4d79ff' },
    { id: 3, title: 'School Holiday', date: '2024-11-01', backgroundColor: '#4dff88' },
    { id: 4, title: 'Basketball Tournament', start: '2024-11-05', end: '2024-11-06', backgroundColor: '#ffb84d' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  const handleDateClick = (info) => {
    setSelectedEvent({ date: info.dateStr });
    setIsModalOpen(true);
  };

  const handleEventClick = (info) => {
    setSelectedEvent({ id: info.event.id, title: info.event.title, date: info.event.startStr });
    setIsModalOpen(true);
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const updatedEvents = events.filter((event) => event.id !== eventId);
      setEvents(updatedEvents);
      setNotifications((prevNotifs) => [
        ...prevNotifs,
        { message: 'Event deleted successfully!', date: new Date().toLocaleDateString() },
      ]);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { title, date } = e.target.elements;

    if (selectedEvent.id) {
      const updatedEvents = events.map((event) =>
        event.id === selectedEvent.id ? { ...event, title: title.value, date: date.value } : event
      );
      setEvents(updatedEvents);
      setNotifications((prevNotifs) => [
        ...prevNotifs,
        { message: `${title.value} was updated!`, date: new Date().toLocaleDateString() },
      ]);
    } else {
      const newEvent = {
        id: events.length + 1,
        title: title.value,
        date: date.value,
        backgroundColor: '#FFD700',
      };
      setEvents([...events, newEvent]);
      setNotifications((prevNotifs) => [
        ...prevNotifs,
        { message: `${title.value} was added to the calendar!`, date: new Date().toLocaleDateString() },
      ]);
    }

    setIsModalOpen(false);
    setSelectedEvent({});
  };

  const handleAnnouncementSubmit = (e) => {
    e.preventDefault();
    if (newAnnouncement.trim()) {
      if (editingAnnouncement) {
        setAnnouncements((prev) => prev.map(announcement =>
          announcement.id === editingAnnouncement.id ? { ...announcement, text: newAnnouncement } : announcement
        ));
        setNotifications((prevNotifs) => [
          ...prevNotifs,
          { message: 'Announcement updated successfully!', date: new Date().toLocaleDateString() },
        ]);
      } else {
        setAnnouncements((prev) => [...prev, { id: announcements.length + 1, text: newAnnouncement }]);
        setNotifications((prevNotifs) => [
          ...prevNotifs,
          { message: 'Announcement created successfully!', date: new Date().toLocaleDateString() },
        ]);
      }
      setNewAnnouncement('');
      setEditingAnnouncement(null);
    }
  };

  const handleEditAnnouncement = (announcement) => {
    setNewAnnouncement(announcement.text);
    setEditingAnnouncement(announcement);
  };

  const handleDeleteAnnouncement = (id) => {
    setAnnouncements((prev) => prev.filter(announcement => announcement.id !== id));
    setNotifications((prevNotifs) => [
      ...prevNotifs,
      { message: 'Announcement deleted successfully!', date: new Date().toLocaleDateString() },
    ]);
  };

  const wrapSelectedText = (wrapper) => {
    const input = document.getElementById('announcement-input');
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const text = input.value;

    if (start === end) {
      // If no text is selected, insert the wrapper at the cursor position
      const newText = text.slice(0, start) + wrapper + text.slice(start);
      input.value = newText;
      input.setSelectionRange(start + wrapper.length, start + wrapper.length); // Move cursor after the wrapper
    } else {
      // If text is selected, wrap it with the specified wrapper
      const selectedText = text.substring(start, end);
      const newText = text.slice(0, start) + wrapper + selectedText + wrapper + text.slice(end);
      input.value = newText;
      input.setSelectionRange(start, end + wrapper.length * 2); // Move cursor after the wrapped text
    }

    // Update state to reflect the changes in the textarea
    setNewAnnouncement(input.value);
  };

  return (
    <div className="container mx-auto max-w-[900px] p-4">
      <h2 className="text-center text-2xl font-bold mb-6 text-gray-800">School Events Calendar</h2>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={modalStyles}
        contentLabel="Event Modal"
      >
        <div className="modal-content">
          <h3 className="modal-title text-lg font-bold mb-4 text-center">
            {selectedEvent.id ? 'Edit Event' : 'Add New Event'}
          </h3>
          <form onSubmit={handleFormSubmit} className="modal-form flex flex-col">
            <div className="flex justify-between mb-4">
              <div className="w-1/2 mr-2">
                <input
                  type="text"
                  name="title"
                  placeholder="Event Title"
                  defaultValue={selectedEvent.title || ''}
                  className="border border-gray-300 rounded p-2 w-full"
                  required
                />
              </div>
              <div className="w-1/2 ml-2">
                <input
                  type="date"
                  name="date"
                  defaultValue={selectedEvent.date || ''}
                  className="border border-gray-300 rounded p-2 w-full"
                  required
                />
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
              >
                {selectedEvent.id ? 'Update Event' : 'Add Event'}
              </button>
              {selectedEvent.id && (
                <button
                  type="button"
                  className="bg-red-500 text-white font-bold py-2 px-4 rounded ml-4"
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                >
                  Delete Event
                </button>
              )}
            </div>
          </form>
        </div>
      </Modal>

      <div className="flex justify-between mb-4">
        <div className="w-full">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
          />
        </div>
      </div>

      <div className="my-8">
        <h3 className="text-lg font-bold mb-4">Announcements</h3>
        <form onSubmit={handleAnnouncementSubmit} className="mb-4">
          <div className="flex mb-2">
            <button
              type="button"
              className="text-gray-600 mx-1"
              onClick={() => wrapSelectedText('**')}
            >
              <FaBold />
            </button>
            <button
              type="button"
              className="text-gray-600 mx-1"
              onClick={() => wrapSelectedText('*')}
            >
              <FaItalic />
            </button>
            <button
              type="button"
              className="text-gray-600 mx-1"
              onClick={() => wrapSelectedText('~~')}
            >
              <FaStrikethrough />
            </button>
          </div>
          <textarea
            id="announcement-input"
            className="border border-gray-300 rounded p-2 w-full"
            placeholder="Type your announcement here..."
            value={newAnnouncement}
            onChange={(e) => setNewAnnouncement(e.target.value)}
            rows="4"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2"
          >
            {editingAnnouncement ? 'Update Announcement' : 'Add Announcement'}
          </button>
        </form>

        <ul className="list-disc list-inside">
          {announcements.map((announcement) => (
            <li key={announcement.id} className="flex justify-between items-center mb-2">
              <span>{marked(announcement.text)}</span>
              <div className="ml-4">
                <button
                  className="text-blue-500 mr-2"
                  onClick={() => handleEditAnnouncement(announcement)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500"
                  onClick={() => handleDeleteAnnouncement(announcement.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SchoolEventsCalendar;
