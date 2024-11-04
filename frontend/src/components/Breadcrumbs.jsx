import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ pageName, isActive, setCurrentTab }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <nav className="flex-grow flex justify-end">
        <ol className="flex items-center gap-2">
          <li>
            <Link
              className="font-medium text-primary hover:underline"
              to="#"
              onClick={() => setCurrentTab('Dashboard')}
            >
              Home
            </Link>
          </li>
          <li className="font-medium"> / </li>
          <li className={`font-medium ${isActive ? 'text-blue-500' : 'text-blue-700'}`}>{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
