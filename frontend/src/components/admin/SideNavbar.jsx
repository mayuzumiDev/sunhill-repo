import React from "react";

const SideNavbar = ({ items = [], onSidebarClick }) => {
  const handleItemClick = (item) => {
    onSidebarClick(item.tab);
  };

  return (
    <div className="w-64 bg-gray-200 fixed top-0 left-0 h-full px-4 py-2">
      <div className="my-2 mb-4">
        <h1 className="text-2x text-black font-bold font-montserrat">
          Sunhill LMS
        </h1>
      </div>
      <hr />
      <nav>
        <ul className="mt-3 text-black font-bold font-montserrat">
          {Array.isArray(items) &&
            items.map((item) => (
              <li
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2"
              >
                {item.name}
              </li>
            ))}
        </ul>
      </nav>
    </div>
  );
};

export default SideNavbar;
