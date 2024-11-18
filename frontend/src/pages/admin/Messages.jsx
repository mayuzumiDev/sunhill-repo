import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaUserCircle, FaPaperPlane, FaEllipsisV, FaFilter, FaSpinner } from 'react-icons/fa';
import { axiosInstance } from '../../utils/axiosInstance';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userFilter, setUserFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const messagesEndRef = useRef(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Mock data for testing - replace with actual API calls
  const mockConversations = [
    {
      id: 1,
      name: "John Doe",
      role: "teacher",
      lastMessage: "When is the next meeting?",
      timestamp: "2024-01-20T10:30:00",
      unread: 2
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "parent",
      lastMessage: "Thank you for the update",
      timestamp: "2024-01-20T09:15:00",
      unread: 0
    },
    {
      id: 3,
      name: "Mike Johnson",
      role: "student",
      lastMessage: "I have a question about the assignment",
      timestamp: "2024-01-19T16:45:00",
      unread: 1
    }
  ];

  const mockMessages = [
    {
      id: 1,
      senderId: 1,
      content: "Hello, how can I help you?",
      timestamp: "2024-01-20T10:00:00",
      senderName: "John Doe",
      senderRole: "teacher"
    },
    {
      id: 2,
      senderId: "current_user",
      content: "I wanted to discuss the upcoming event",
      timestamp: "2024-01-20T10:05:00",
      senderName: "Admin",
      senderRole: "admin"
    }
  ];

  useEffect(() => {
    // Simulate API call to fetch conversations
    setConversations(mockConversations);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      setIsLoadingMessages(true);
      // Simulate API call to fetch messages
      setMessages(mockMessages);
      setIsLoadingMessages(false);
      scrollToBottom();
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsg = {
      id: messages.length + 1,
      senderId: "current_user",
      content: newMessage,
      timestamp: new Date().toISOString(),
      senderName: "Admin",
      senderRole: "admin"
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = userFilter === 'all' || conv.role === userFilter;
    return matchesSearch && matchesFilter;
  });

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'teacher': return 'text-blue-600';
      case 'parent': return 'text-green-600';
      case 'student': return 'text-purple-600';
      case 'admin': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)]">
      {/* Left Sidebar - Conversations List */}
      <div className="w-1/3 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <FaFilter className="mr-2" />
              Filter
            </button>
            {showFilters && (
              <div className="flex space-x-2">
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                >
                  <option value="all">All</option>
                  <option value="teacher">Teachers</option>
                  <option value="parent">Parents</option>
                  <option value="student">Students</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <FaSpinner className="animate-spin text-blue-500 text-2xl" />
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                  selectedConversation?.id === conv.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <FaUserCircle className={`text-3xl ${getRoleColor(conv.role)}`} />
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-semibold text-gray-900">{conv.name}</h3>
                        <span className={`ml-2 text-xs px-2 py-1 rounded-full ${getRoleColor(conv.role)} bg-opacity-10`}>
                          {conv.role}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{conv.lastMessage}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatTimestamp(conv.timestamp)}
                    {conv.unread > 0 && (
                      <span className="ml-2 bg-blue-500 text-white px-2 py-1 rounded-full">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Side - Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <FaUserCircle className={`text-3xl ${getRoleColor(selectedConversation.role)}`} />
                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedConversation.name}</h2>
                    <span className={`text-sm ${getRoleColor(selectedConversation.role)}`}>
                      {selectedConversation.role}
                    </span>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-gray-700">
                  <FaEllipsisV />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4">
              {isLoadingMessages ? (
                <div className="flex justify-center items-center h-full">
                  <FaSpinner className="animate-spin text-blue-500 text-2xl" />
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 flex ${
                      message.senderId === 'current_user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.senderId === 'current_user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-800'
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        <span className="font-medium text-sm">
                          {message.senderName}
                        </span>
                        <span className={`ml-2 text-xs ${
                          message.senderId === 'current_user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex space-x-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaPaperPlane />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <FaUserCircle className="text-6xl mb-4 mx-auto" />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;