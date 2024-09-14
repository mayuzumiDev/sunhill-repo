import React from "react";

function LoginForm({ title, subtitle }) {
  return (
    <div>
      <div>
        <h1 className="text-sky-500 text-3xl font-bold font-montserrat mb-1">
          {title}
        </h1>
        <p className="text-sm text-gray-700 mb-8">{subtitle}</p>
      </div>
      <form className="max-w-md mx-auto px-10 py-12 bg-white rounded-xl shadow-md">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-semibold font-montserrat mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="appearance-none border rounded w-full h-9 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-2 focus:border-sky-500"
            id="username"
            type="text"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-semibold font-montserrat mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="appearance-none border rounded w-full h-9 py-2 px-3 text-gray-700 leading-tight focus:outline:none focus:shadow-outline focus:border-2 focus:border-sky-500"
            id="password"
            type="password"
          />
        </div>
        <div className="mt-4 mb-4 text-sm text-gray-600 font-montserrat">
          <a
            href="/forgot-password"
            className="text-sky-500 hover:text-sky-700 focus:text-sky-700 active:text-sky-700"
          >
            Forgot Password?
          </a>
        </div>
        <button
          className="bg-sky-500 hover:bg-sky-700 text-white text-base font-bold font-montserrat w-full py-1 px-4 rounded-full focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
