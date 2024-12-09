import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardQuestion,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

const QuizResponseTable = ({ responses, isLoading = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuiz, setSelectedQuiz] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const rowsPerPage = 10;

  // Get unique quiz titles for dropdown
  const getUniqueQuizTitles = () => {
    if (!responses) return [];
    const titles = [
      ...new Set(responses.map((response) => response.quiz_title)),
    ];
    return titles;
  };

  // Filter responses based on selected quiz
  const filteredResponses = responses
    ? responses.filter(
        (response) =>
          (selectedQuiz === "all" || response.quiz_title === selectedQuiz) &&
          response.student_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    : [];

  // Calculate pagination values
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredResponses.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredResponses.length / rowsPerPage);

  // Handle page navigation
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (isLoading) {
    return (
      <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-green-500">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                Student Name
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                Quiz/Activity Title
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                Total Score
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                Total Items
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="inline-block h-4 w-32 bg-gray-400/30 animate-pulse rounded "></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="inline-block h-4 w-40 bg-gray-400/30 animate-pulse rounded"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="inline-block h-4 w-16 bg-gray-400/30 animate-pulse rounded"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="inline-block h-4 w-16 bg-gray-400/30 animate-pulse rounded"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="inline-block h-4 w-20 bg-gray-400/30 animate-pulse rounded"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!responses || responses.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
        <FontAwesomeIcon
          icon={faClipboardQuestion}
          className="text-green-500 text-5xl mb-4"
        />
        <p className="text-gray-600 text-lg font-semibold">
          No quiz/activity scores available
        </p>
        <p className="text-gray-700 text-sm mt-2">
          Select a classroom to view quiz/activity scores
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <div className="relative w-full md:w-64">
          <div className="relative">
            <input
              type="text"
              placeholder="Search student name"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-200"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>
        <div className="relative w-full md:w-64">
          <Listbox
            value={selectedQuiz}
            onChange={(value) => {
              setSelectedQuiz(value);
              setCurrentPage(1);
            }}
          >
            <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-4 pr-10 text-left border border-gray-300 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-200">
              <span className="block truncate text-sm text-gray-700">
                {selectedQuiz === "all"
                  ? "All Quizzes/Activities"
                  : selectedQuiz}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
                <Listbox.Option
                  key="all"
                  value="all"
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-4 pr-4 ${
                      active ? "bg-green-50 text-green-700" : "text-gray-700"
                    }`
                  }
                >
                  All Quizzes/Activities
                </Listbox.Option>
                {getUniqueQuizTitles().map((title) => (
                  <Listbox.Option
                    key={title}
                    value={title}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-4 pr-4 ${
                        active ? "bg-green-50 text-green-700" : "text-gray-700"
                      }`
                    }
                  >
                    {title}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </Listbox>
        </div>
      </div>
      <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-green-400">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                Student Name
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                Quiz/Activity Title
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                Total Score
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                Total Items
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentRows.map((response, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                  {response.student_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                  {response.quiz_title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                  {response.total_score}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                  {response.total_possible}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${
                      response.status === "passed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {response.status.charAt(0).toUpperCase() +
                      response.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredResponses.length > rowsPerPage && (
          <div className="flex justify-center items-center space-x-4 mt-4 pb-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-green-500 bg-white border border-green-300 rounded-md hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-green-500 bg-white border border-green-300 rounded-md hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizResponseTable;
