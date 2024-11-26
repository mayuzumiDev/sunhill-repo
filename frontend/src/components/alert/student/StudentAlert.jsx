const StudentAlert = ({ message, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="animate-bounce-gentle">
        <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-1 rounded-2xl shadow-xl">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4">
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Animated stars */}
              <div className="flex justify-center space-x-2">
                <FontAwesomeIcon
                  icon={faStar}
                  className="text-yellow-400 text-2xl animate-spin-slow"
                />
                <FontAwesomeIcon
                  icon={faStar}
                  className="text-purple-500 text-2xl animate-pulse"
                />
                <FontAwesomeIcon
                  icon={faStar}
                  className="text-yellow-400 text-2xl animate-spin-slow"
                />
              </div>

              <h3 className="text-xl font-bold text-purple-600 font-comic">
                Oops!
              </h3>

              <p className="text-gray-700 font-comic text-lg">{message}</p>

              {/* Decorative elements */}
              <div className="flex justify-center space-x-4 mt-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-3 h-3 bg-red-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAlert;
