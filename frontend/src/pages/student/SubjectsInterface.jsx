import React from "react";
import { motion } from "framer-motion";
import {
  FaChalkboardTeacher,
  FaClipboardList,
  FaBullhorn,
  FaUsers,
  FaBook,
  FaCalendarAlt,
} from "react-icons/fa";

const SubjectInterface = ({ subject }) => {
  const subjectItems = [
    {
      title: "Stream",
      icon: <FaBullhorn />,
      color: "blue",
      description: "View announcements and updates",
    },
    {
      title: "Classwork",
      icon: <FaBook />,
      color: "green",
      description: "Access assignments and materials",
    },
    {
      title: "People",
      icon: <FaUsers />,
      color: "purple",
      description: "See classmates and teachers",
    },
    {
      title: "Grades",
      icon: <FaClipboardList />,
      color: "yellow",
      description: "Check your grades and progress",
    },
    {
      title: "Calendar",
      icon: <FaCalendarAlt />,
      color: "red",
      description: "View upcoming events and deadlines",
    },
    {
      title: "Meet",
      icon: <FaChalkboardTeacher />,
      color: "indigo",
      description: "Join virtual class meetings",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.div
        className="bg-white rounded-lg shadow-lg p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1
          className="text-4xl font-bold text-gray-800 mb-2"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          {subject.title}
        </h1>
        <p className="text-gray-600 text-lg">
          Welcome to your {subject.title} classroom!
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {subjectItems.map((item, index) => (
          <motion.div
            key={item.title}
            className={`bg-white p-6 rounded-lg shadow-md cursor-pointer border-l-4 border-${item.color}-500 hover:shadow-lg transition duration-300`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-center mb-4">
              {React.cloneElement(item.icon, {
                className: `text-2xl text-${item.color}-500 mr-3`,
              })}
              <h3
                className="text-xl font-semibold text-gray-800"
                style={{ fontFamily: "Arial, sans-serif" }}
              >
                {item.title}
              </h3>
            </div>
            <p
              className="text-gray-600"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              {item.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

const SubjectsInterface = ({ subject }) => {
  return <SubjectInterface subject={subject} />;
};

export default SubjectsInterface;
