import React, { useState, useEffect } from 'react';
import { FaUser, FaPaperPlane, FaSearch, FaTrash, FaStar, FaReply, FaEllipsisV, FaFilter, FaBars, FaArrowLeft } from 'react-icons/fa';

const Messages = ({ darkMode }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [starredConversations, setStarredConversations] = useState([]);
  const [filter, setFilter] = useState('all');
  const [messages, setMessages] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    fetchConversations();
    const handleResize = () => {
      setShowSidebar(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial state
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchConversations = async () => {
    // Simulating API call
    const data = [
      { id: 1, name: 'Mr. Smith (Math Teacher)', lastMessage: 'How is John doing with his homework?', unread: 2, timestamp: '2023-06-15T10:30:00Z' },
      { id: 2, name: 'Mrs. Johnson (Science Teacher)', lastMessage: 'Jane\'s project was excellent!', unread: 0, timestamp: '2023-06-14T15:45:00Z' },
      { id: 3, name: 'Principal Davis', lastMessage: 'Thank you for attending the PTA meeting.', unread: 1, timestamp: '2023-06-13T09:00:00Z' },
    ];
    setConversations(data);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && selectedConversation) {
      const newMessage = {
        id: Date.now(),
        sender: 'You',
        content: message,
        timestamp: new Date().toISOString(),
      };
      setMessages([...messages, newMessage]);
      // Send message to API
      console.log(`Sending message to ${selectedConversation.name}: ${message}`);
      setMessage('');
    }
  };

  const handleDeleteConversation = (id) => {
    setConversations(conversations.filter(conv => conv.id !== id));
    if (selectedConversation && selectedConversation.id === id) {
      setSelectedConversation(null);
    }
  };

  const handleStarConversation = (id) => {
    setStarredConversations(prev => 
      prev.includes(id) ? prev.filter(convId => convId !== id) : [...prev, id]
    );
  };

  const handleReply = () => {
    // Implement reply functionality
    console.log('Replying to message');
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && conv.unread > 0) || 
      (filter === 'starred' && starredConversations.includes(conv.id));
    return matchesSearch && matchesFilter;
  });

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className={`flex flex-col md:flex-row h-screen ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <div className={`${showSidebar ? 'block' : 'hidden'} md:block w-full md:w-1/3 lg:w-1/4 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="p-4">
          <div className={`flex items-center mb-4 ${darkMode ? 'bg-gray-700' : 'bg-orange-100'} rounded-full p-2`}>
            <FaSearch className="mr-2 text-orange-500" />
            <input
              type="text"
              placeholder="Search conversations..."
              className={`w-full bg-transparent focus:outline-none ${darkMode ? 'text-white' : 'text-gray-800'}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="mb-4 flex flex-wrap justify-between">
            {['all', 'unread', 'starred'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => handleFilterChange(filterOption)}
                className={`px-3 py-1 rounded mb-2 ${filter === filterOption ? 'bg-orange-500 text-white' : ''}`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </button>
            ))}
          </div>
          {filteredConversations.map(conv => (
            <div
              key={conv.id}
              className={`flex items-center p-3 cursor-pointer ${selectedConversation?.id === conv.id ? (darkMode ? 'bg-gray-700' : 'bg-orange-200') : ''}`}
              onClick={() => {setSelectedConversation(conv); setShowSidebar(false);}}
            >
              <FaUser className="mr-3 text-orange-500" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{conv.name}</h3>
                <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{conv.lastMessage}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {new Date(conv.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center ml-2">  
                {conv.unread > 0 && (
                  <span className="mr-2 bg-orange-500 text-white rounded-full px-2 py-1 text-xs">
                    {conv.unread}
                  </span>
                )}
                <FaStar
                  className={`mr-2 cursor-pointer ${starredConversations.includes(conv.id) ? 'text-yellow-500' : 'text-gray-400'}`}
                  onClick={(e) => { e.stopPropagation(); handleStarConversation(conv.id); }}
                />
                <FaTrash
                  className="text-red-500 cursor-pointer mr-2"
                  onClick={(e) => { e.stopPropagation(); handleDeleteConversation(conv.id); }}
                />
                <FaEllipsisV className="text-gray-500 cursor-pointer" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="md:hidden flex items-center justify-between p-4 bg-orange-500 text-white">
          <button onClick={toggleSidebar} className="text-xl">
            {showSidebar ? <FaArrowLeft /> : <FaBars />}
          </button>
          <h1 className="text-xl font-bold">Messages</h1>
          <div className="w-6"></div> {/* Placeholder for balance */}
        </div>
        
        {selectedConversation ? (
          <>
            <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center`}>
              <button onClick={() => {setSelectedConversation(null); setShowSidebar(true);}} className="md:hidden mr-4 text-orange-500">
                <FaArrowLeft />
              </button>
              <h2 className="text-xl font-semibold text-orange-600 truncate">{selectedConversation.name}</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map(msg => (
                <div key={msg.id} className={`mb-4 ${msg.sender === 'You' ? 'text-right' : ''}`}>
                  <p className={`inline-block p-2 rounded-lg max-w-3/4 break-words ${msg.sender === 'You' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                    {msg.content}
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {new Date(msg.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className={`flex-1 p-2 rounded-l-full ${darkMode ? 'bg-gray-700 text-white' : 'bg-orange-100 text-gray-800'}`}
                />
                <button
                  type="submit"
                  className={`p-2 rounded-r-full ${darkMode ? 'bg-orange-600 hover:bg-orange-700' : 'bg-orange-500 hover:bg-orange-600'} text-white`}
                >
                  <FaPaperPlane />
                </button>
              </div>
            </form>
            <div className="flex justify-end p-2">
              <button
                onClick={handleReply}
                className={`p-2 rounded-full ${darkMode ? 'bg-orange-600 hover:bg-orange-700' : 'bg-orange-500 hover:bg-orange-600'} text-white mr-2`}
              >
                <FaReply />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
