import React from 'react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800 rounded-xl shadow-lg w-full max-w-md p-8 border border-gray-700">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
            404
          </h1>

          <h2 className="text-2xl font-bold text-gray-100 mb-4">Page Not Found</h2>
          <p className="text-gray-400 mb-8">
            The item you requested is not available.
          </p>

          <a
            href="/"
            className="w-full inline-block bg-blue-600 text-gray-100 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;