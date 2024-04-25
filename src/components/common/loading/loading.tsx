import React from "react";

const Loading = () => {
  return (
    <div
      id="loading-container"
      className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-70 flex justify-center items-center z-50 "
    >
      <div className="w-12 h-12 border-8 border-dashed rounded-full animate-spin  border-blue-600"></div>
    </div>
  );
};

export default Loading;
