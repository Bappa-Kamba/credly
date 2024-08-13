// src/components/ResultComponents.jsx

import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

function ResultComponent({ result }) {
  return (
    <div className="result">
      <h2>Verification Result</h2>
      {/* Display results here */}
      <p>{result.message}</p>
    </div>
  );
}

// Define PropTypes for the ResultComponent
ResultComponent.propTypes = {
  result: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }).isRequired,
};

export default ResultComponent;
