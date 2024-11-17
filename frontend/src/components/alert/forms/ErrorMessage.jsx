const ErrorMessage = ({ message }) => {
  return (
    <p className="mt-1 text-sm text-center text-red-500 bg-red-50 border border-red-200 rounded-md p-2">
      {message}
    </p>
  );
};

export default ErrorMessage;
