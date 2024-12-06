import React from "react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  AiOutlineEdit,
  AiOutlineUsergroupAdd,
  AiOutlineDelete,
  AiOutlineEye,
  AiOutlineMenu,
} from "react-icons/ai";

const ClassroomCard = ({
  classroomData,
  onEdit,
  onDelete,
  addStudent,
  onView,
}) => (
  <div
    onClick={onView}
    className="bg-gradient-to-r from-green-700 to-green-400 rounded-lg p-6 mb-6 shadow-md flex justify-between items-center transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer"
  >
    {/* Dropdown Buttons */}
    <div
      className="absolute top-4 right-4"
      onClick={(e) => e.stopPropagation()}
    >
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="bg-green-700 text-white p-2 rounded-full hover:bg-green-800 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
          <AiOutlineMenu size={20} />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={onEdit}
                    className={`${
                      active ? "bg-green-50 text-green-700" : "text-gray-700"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <AiOutlineEdit className="mr-2 h-5 w-5" />
                    Edit Classroom
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={addStudent}
                    className={`${
                      active ? "bg-green-50 text-green-700" : "text-gray-700"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <AiOutlineUsergroupAdd className="mr-2 h-5 w-5" />
                    Add Students
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={onDelete}
                    className={`${
                      active ? "bg-red-50 text-red-700" : "text-red-600"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <AiOutlineDelete className="mr-2 h-5 w-5" />
                    Delete Classroom
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>

    {/* Title */}
    <div className="mb-14">
      <h2 className="font-bold text-2xl text-white mb-2">
        {classroomData.subject_name_display}
      </h2>
      <div className="space-y-0.5">
        <p className="text-sm text-white/80">
          Grade Level:{" "}
          <span className="font-medium text-white">
            {classroomData.grade_level}
          </span>
        </p>
        <p className="text-sm text-white/80">
          Section:{" "}
          <span className="font-medium text-white">
            {classroomData.class_section}
          </span>
        </p>
      </div>
    </div>
  </div>
);

export default ClassroomCard;
