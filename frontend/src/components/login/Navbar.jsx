import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      <div className="w-full fixed top-0 left-0 shadow">
        <nav className="bg-white px-4 py-3 flex justify-between ">
          <Link
            to="/login/"
            className="text-sky-500 text-xl font-semibold font-montserrat"
          >
            Sunhill Montessori Casa LMS
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
