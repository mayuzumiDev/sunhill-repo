import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTitle = ({ title }) => {
  const location = useLocation();

  useEffect(() => {
    // Update the document title when the route changes or the title prop changes
    document.title = title;
  }, [location, title]); // Dependency array includes location and title

  return null; // This component doesn't render anything
};

export default PageTitle;
