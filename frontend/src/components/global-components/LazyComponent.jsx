import React, { Suspense } from 'react';
import { CircularProgress } from '@mui/material';

// Lazy loading wrapper component
const LazyComponent = ({ component: Component, ...props }) => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center w-full h-64">
        <CircularProgress />
      </div>
    }>
      <Component {...props} />
    </Suspense>
  );
};

export default LazyComponent;