import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ size = 'md', message = 'Loading...' }) => {
  const spinnerSize = {
    sm: 'sm',
    md: '',
    lg: 'lg'
  }[size];

  return (
    <div className="loading-spinner d-flex flex-column justify-content-center align-items-center py-5">
      <Spinner 
        animation="border" 
        role="status" 
        variant="primary"
        size={spinnerSize}
      >
        <span className="visually-hidden">{message}</span>
      </Spinner>
      {message && <p className="mt-3 text-muted">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;