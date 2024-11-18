import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from 'react-modal';
import { FaBold, FaItalic, FaStrikethrough, FaBell, FaCalendarPlus, FaSave, FaCopy } from 'react-icons/fa';
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
    width: '90%', // Adjusted width for smaller screens
    maxWidth: '400px',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
  },
};

const SchoolEventsCalendar = ({ setNotifications }) => {
  const [eventCategories] = useState([
    { id: 1, name: 'Academic', color: '#ff4d4d' },
    { id: 2, name: 'Sports', color: '#4d79ff' },
    { id: 3, name: 'Cultural', color: '#4dff88' },
    { id: 4, name: 'Administrative', color: '#ffb84d' },
  ]);

  const [eventTypes] = useState([
    { id: 1, name: 'Class' },
    { id: 2, name: 'Exam' },
    { id: 3, name: 'Meeting' },
    { id: 4, name: 'Activity' },
  ]);

  const [events, setEvents] = useState([
    { 
      id: 1, 
      title: 'Math Exam', 
      date: '2024-10-10', 
      backgroundColor: '#ff4d4d',
      category: 'Academic',
      type: 'Exam',
      location: 'Room 101',
      description: 'Final Math Examination',
      priority: 'High',
      attendees: ['All 10th Grade Students'],
      isRecurring: false
    },
    { 
      id: 2, 
      title: 'Parent-Teacher Meeting', 
      date: '2024-10-15', 
      backgroundColor: '#4d79ff',
      category: 'Administrative',
      type: 'Meeting',
      location: 'Main Hall',
      description: 'Term End Meeting with Parents',
      priority: 'Medium',
      attendees: ['Teachers', 'Parents'],
      isRecurring: false
    },
    { 
      id: 3, 
      title: 'School Holiday', 
      date: '2024-11-01', 
      backgroundColor: '#4dff88',
      category: 'Administrative',
      type: 'Activity',
      description: 'National Holiday',
      priority: 'Low',
      attendees: ['All'],
      isRecurring: false
    },
    { 
      id: 4, 
      title: 'Basketball Tournament', 
      start: '2024-11-05', 
      end: '2024-11-06', 
      backgroundColor: '#ffb84d',
      category: 'Sports',
      type: 'Activity',
      location: 'School Ground',
      description: 'Inter-School Basketball Tournament',
      priority: 'Medium',
      attendees: ['Basketball Team', 'Sports Teachers'],
      isRecurring: false
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('calendar'); // calendar or list
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [recurringSettings, setRecurringSettings] = useState({
    frequency: 'weekly',
    interval: 1,
    endDate: '',
    daysOfWeek: [],
  });

  const [eventTemplates, setEventTemplates] = useState([
    {
      id: 1,
      name: 'Parent-Teacher Meeting',
      category: 'Administrative',
      type: 'Meeting',
      description: 'Regular parent-teacher meeting',
      priority: 'Medium',
      duration: '1h',
    },
    {
      id: 2,
      name: 'Class Test',
      category: 'Academic',
      type: 'Exam',
      description: 'Regular class assessment',
      priority: 'High',
      duration: '2h',
    }
  ]);

  const [reminders, setReminders] = useState([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    // Check for upcoming events and create reminders
    const checkUpcomingEvents = () => {
      const today = new Date();
      const upcomingEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        const diffDays = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 7;
      });

      const newReminders = upcomingEvents.map(event => ({
        id: `reminder-${event.id}`,
        eventId: event.id,
        message: `Upcoming event: ${event.title} on ${new Date(event.date).toLocaleDateString()}`,
        daysUntil: Math.ceil((new Date(event.date) - today) / (1000 * 60 * 60 * 24))
      }));

      setReminders(newReminders);
    };

    checkUpcomingEvents();
  }, [events]);

  const handleSaveTemplate = () => {
    const newTemplate = {
      id: eventTemplates.length + 1,
      name: selectedEvent.title,
      category: selectedEvent.category,
      type: selectedEvent.type,
      description: selectedEvent.description,
      priority: selectedEvent.priority,
      duration: '1h', // Default duration
    };
    setEventTemplates([...eventTemplates, newTemplate]);
    setNotifications(prev => [...prev, {
      message: 'Event template saved successfully!',
      date: new Date().toLocaleDateString()
    }]);
  };

  const handleUseTemplate = (template) => {
    setSelectedEvent({
      ...selectedEvent,
      title: template.name,
      category: template.category,
      type: template.type,
      description: template.description,
      priority: template.priority,
    });
    setShowTemplateModal(false);
  };

  const handleDragStart = (event) => {
    event.dataTransfer.setData('text/plain', event.target.id);
  };

  const handleDrop = (date) => {
    const templateId = parseInt(event.dataTransfer.getData('text/plain'));
    const template = eventTemplates.find(t => t.id === templateId);
    if (template) {
      const newEvent = {
        id: events.length + 1,
        title: template.name,
        date: date.dateStr,
        category: template.category,
        type: template.type,
        description: template.description,
        priority: template.priority,
        backgroundColor: eventCategories.find(cat => cat.name === template.category)?.color
      };
      setEvents([...events, newEvent]);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
    const formData = new FormData(e.target);
    const eventData = {
      title: formData.get('title'),
      date: formData.get('date'),
      category: formData.get('category'),
      type: formData.get('type'),
      location: formData.get('location'),
      description: formData.get('description'),
      priority: formData.get('priority'),
      attendees: formData.get('attendees').split(',').map(item => item.trim()),
      isRecurring: formData.get('isRecurring') === 'on',
      backgroundColor: eventCategories.find(cat => cat.name === formData.get('category'))?.color || '#FFD700'
    };

    if (selectedEvent.id) {
      const updatedEvents = events.map((event) =>
        event.id === selectedEvent.id ? { ...event, ...eventData } : event
      );
      setEvents(updatedEvents);
      setNotifications((prevNotifs) => [
        ...prevNotifs,
        { message: `${eventData.title} was updated!`, date: new Date().toLocaleDateString() },
      ]);
    } else {
      const newEvent = {
        id: events.length + 1,
        ...eventData
      };
      setEvents([...events, newEvent]);
      setNotifications((prevNotifs) => [
        ...prevNotifs,
        { message: `${eventData.title} was added to the calendar!`, date: new Date().toLocaleDateString() },
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

  const handleRecurringSubmit = (e) => {
    e.preventDefault();
    const baseEvent = {
      ...selectedEvent,
      isRecurring: true,
      recurringSettings: { ...recurringSettings }
    };

    // Generate recurring events
    const recurringEvents = generateRecurringEvents(baseEvent);
    setEvents(prev => [...prev, ...recurringEvents]);
    setShowRecurringModal(false);
    setRecurringSettings({
      frequency: 'weekly',
      interval: 1,
      endDate: '',
      daysOfWeek: [],
    });
  };

  const generateRecurringEvents = (baseEvent) => {
    const events = [];
    const startDate = new Date(baseEvent.date);
    const endDate = new Date(recurringSettings.endDate);
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      if (recurringSettings.frequency === 'weekly' && 
          recurringSettings.daysOfWeek.includes(currentDate.getDay())) {
        events.push({
          ...baseEvent,
          id: events.length + 1,
          date: currentDate.toISOString().split('T')[0],
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return events;
  };

  return (
    <div className="container mx-auto max-w-full p-4">
      <div className="mb-6 bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">School Events Calendar</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowTemplateModal(true)}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              <FaCalendarPlus className="mr-2" />
              Templates
            </button>
            {selectedEvent.id && (
              <button
                onClick={handleSaveTemplate}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <FaSave className="mr-2" />
                Save as Template
              </button>
            )}
          </div>
        </div>

        {/* Reminders Section */}
        {reminders.length > 0 && (
          <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <FaBell className="mr-2 text-yellow-500" />
              Upcoming Events
            </h3>
            <div className="space-y-2">
              {reminders.map(reminder => (
                <div key={reminder.id} className="flex items-center justify-between bg-white p-2 rounded shadow-sm">
                  <span>{reminder.message}</span>
                  <span className="text-sm text-gray-500">
                    {reminder.daysUntil === 0 ? 'Today' : 
                     reminder.daysUntil === 1 ? 'Tomorrow' : 
                     `In ${reminder.daysUntil} days`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Templates Modal */}
        <Modal
          isOpen={showTemplateModal}
          onRequestClose={() => setShowTemplateModal(false)}
          style={modalStyles}
          contentLabel="Event Templates"
        >
          <div className="modal-content">
            <h3 className="modal-title text-lg font-bold mb-4 text-center">Event Templates</h3>
            <div className="grid gap-4">
              {eventTemplates.map(template => (
                <div
                  key={template.id}
                  id={`template-${template.id}`}
                  draggable
                  onDragStart={handleDragStart}
                  className="p-4 border rounded-lg hover:shadow-md cursor-move"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{template.name}</h4>
                      <p className="text-sm text-gray-600">{template.category} • {template.type}</p>
                    </div>
                    <button
                      onClick={() => handleUseTemplate(template)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <FaCopy />
                    </button>
                  </div>
                  <p className="text-sm mt-2">{template.description}</p>
                  <div className="mt-2 flex gap-2">
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">{template.priority}</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">{template.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>

        <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
          <div className="flex items-center space-x-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-300 rounded p-2"
            >
              <option value="all">All Categories</option>
              {eventCategories.map(category => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded p-2"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded ${viewMode === 'calendar' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Calendar
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              List
            </button>
          </div>
        </div>

        {viewMode === 'calendar' ? (
          <div className="w-full">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={filteredEvents}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              eventContent={(eventInfo) => (
                <div className="p-1">
                  <div className="font-bold">{eventInfo.event.title}</div>
                  <div className="text-xs">
                    {eventInfo.event.extendedProps.type} • {eventInfo.event.extendedProps.priority}
                  </div>
                </div>
              )}
              drop={handleDrop}
            />
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredEvents.map(event => (
              <div 
                key={event.id} 
                className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedEvent(event);
                  setIsModalOpen(true);
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{event.title}</h3>
                    <p className="text-sm text-gray-600">{event.date}</p>
                  </div>
                  <span 
                    className="px-2 py-1 rounded text-sm"
                    style={{ backgroundColor: event.backgroundColor, color: '#fff' }}
                  >
                    {event.category}
                  </span>
                </div>
                <p className="mt-2 text-gray-700">{event.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">{event.type}</span>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">{event.priority}</span>
                  {event.location && (
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">{event.location}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recurring Event Modal */}
      <Modal
        isOpen={showRecurringModal}
        onRequestClose={() => setShowRecurringModal(false)}
        style={modalStyles}
        contentLabel="Recurring Event Settings"
      >
        <div className="modal-content">
          <h3 className="modal-title text-lg font-bold mb-4 text-center">Recurring Event Settings</h3>
          <form onSubmit={handleRecurringSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">Frequency</label>
              <select
                value={recurringSettings.frequency}
                onChange={(e) => setRecurringSettings({
                  ...recurringSettings,
                  frequency: e.target.value
                })}
                className="w-full border border-gray-300 rounded p-2"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {recurringSettings.frequency === 'weekly' && (
              <div>
                <label className="block mb-2">Days of Week</label>
                <div className="flex flex-wrap gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <label key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={recurringSettings.daysOfWeek.includes(index)}
                        onChange={(e) => {
                          const newDays = e.target.checked
                            ? [...recurringSettings.daysOfWeek, index]
                            : recurringSettings.daysOfWeek.filter(d => d !== index);
                          setRecurringSettings({
                            ...recurringSettings,
                            daysOfWeek: newDays
                          });
                        }}
                        className="mr-1"
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block mb-2">End Date</label>
              <input
                type="date"
                value={recurringSettings.endDate}
                onChange={(e) => setRecurringSettings({
                  ...recurringSettings,
                  endDate: e.target.value
                })}
                className="w-full border border-gray-300 rounded p-2"
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowRecurringModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </Modal>

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
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col md:flex-row justify-between mb-4">
                <div className="md:w-1/2 mr-2 mb-2 md:mb-0">
                  <input
                    type="text"
                    name="title"
                    placeholder="Event Title"
                    defaultValue={selectedEvent.title || ''}
                    className="border border-gray-300 rounded p-2 w-full"
                    required
                  />
                </div>
                <div className="md:w-1/2 ml-2">
                  <input
                    type="date"
                    name="date"
                    defaultValue={selectedEvent.date || ''}
                    className="border border-gray-300 rounded p-2 w-full"
                    required
                  />
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between space-x-4">
                <div className="md:w-1/2">
                  <select 
                    name="category"
                    defaultValue={selectedEvent.category || ''}
                    className="border border-gray-300 rounded p-2 w-full"
                    required
                  >
                    <option value="">Select Category</option>
                    {eventCategories.map(category => (
                      <option key={category.id} value={category.name}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div className="md:w-1/2">
                  <select 
                    name="type"
                    defaultValue={selectedEvent.type || ''}
                    className="border border-gray-300 rounded p-2 w-full"
                    required
                  >
                    <option value="">Select Type</option>
                    {eventTypes.map(type => (
                      <option key={type.id} value={type.name}>{type.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between space-x-4">
                <div className="md:w-1/2">
                  <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    defaultValue={selectedEvent.location || ''}
                    className="border border-gray-300 rounded p-2 w-full"
                  />
                </div>
                <div className="md:w-1/2">
                  <select 
                    name="priority"
                    defaultValue={selectedEvent.priority || ''}
                    className="border border-gray-300 rounded p-2 w-full"
                    required
                  >
                    <option value="">Select Priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="w-full">
                <textarea
                  name="description"
                  placeholder="Event Description"
                  defaultValue={selectedEvent.description || ''}
                  className="border border-gray-300 rounded p-2 w-full h-24"
                  required
                />
              </div>

              <div className="w-full">
                <input
                  type="text"
                  name="attendees"
                  placeholder="Attendees (comma-separated)"
                  defaultValue={selectedEvent.attendees ? selectedEvent.attendees.join(', ') : ''}
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isRecurring"
                  defaultChecked={selectedEvent.isRecurring || false}
                  className="mr-2"
                />
                <label>Recurring Event</label>
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

      <h3 className="text-lg font-bold mb-2 text-gray-800">Announcements</h3>
      <form onSubmit={handleAnnouncementSubmit} className="flex flex-col md:flex-row mb-4">
        <input
          id="announcement-input"
          type="text"
          value={newAnnouncement}
          onChange={(e) => setNewAnnouncement(e.target.value)}
          placeholder="Add Announcement"
          className="border border-gray-300 rounded p-2 flex-grow mr-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
        >
          {editingAnnouncement ? 'Update' : 'Add'}
        </button>
      </form>

      <div className="announcements-list mb-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="flex justify-between mb-2 bg-gray-100 p-2 rounded">
            <span>{announcement.text}</span>
            <div>
              <button
                onClick={() => handleEditAnnouncement(announcement)}
                className="text-yellow-500 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteAnnouncement(announcement.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-gray-600 text-sm">
        <p className="mb-2">Format announcements:</p>
        <div className="flex">
          <button onClick={() => wrapSelectedText('**')} className="mr-2"><FaBold /></button>
          <button onClick={() => wrapSelectedText('*')} className="mr-2"><FaItalic /></button>
          <button onClick={() => wrapSelectedText('~~')} className="mr-2"><FaStrikethrough /></button>
        </div>
      </div>
    </div>
  );
};

export default SchoolEventsCalendar;