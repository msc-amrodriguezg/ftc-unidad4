import React from 'react';

const Spinner = ({ message = "Consultando información, un momento por favor..." }) => {
  return (
    <div className="spinner-overlay" id="loading-spinner">
      <div className="spinner" role="status"></div>
      <p className="spinner-text">{message}</p>
    </div>
  );
};

export default Spinner;
