import React from "react";

const HideScrollbar = () => {
  return (
    <style jsx>{`
      /* Hide scrollbar in all browsers */
      ::-webkit-scrollbar {
        display: none;
      }
      body {
        overflow: hidden; /* Prevent scrolling on the body */
      }
    `}</style>
  );
};

export default HideScrollbar;
