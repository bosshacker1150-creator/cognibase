import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 className="text-4xl font-bold mb-4">Welcome to CogniBase</h1>
    <p className="mb-6">AI‑powered knowledge base for your team.</p>
    <Link to="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded">
      Go to Dashboard
    </Link>
  </div>
);

export default Landing;
