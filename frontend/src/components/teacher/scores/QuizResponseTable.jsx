import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardQuestion } from "@fortawesome/free-solid-svg-icons";

const QuizResponseTable = ({ responses, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-green-400">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                Student Name
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                Quiz Title
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
      <div className="bg-white shadow-md rounded-lg p-8 text-center  min-h-[400px] flex flex-col items-center justify-center">
        <FontAwesomeIcon
          icon={faClipboardQuestion}
          className="text-green-500 text-5xl mb-4"
        />
        <p className="text-gray-600 text-lg font-semibold">
          No quiz scores available
        </p>
        <p className="text-gray-700 text-sm mt-2">
          Select a classroom to view quiz scores
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-green-400">
          <tr>
            <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
              Student Name
            </th>
            <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
              Quiz Title
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
          {responses.map((response, index) => (
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
    </div>
  );
};

export default QuizResponseTable;
