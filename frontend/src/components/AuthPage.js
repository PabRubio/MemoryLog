import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';

import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from 'firebase/auth';

const provider = new GoogleAuthProvider();

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.58c2.08-1.92 3.28-4.74 3.28-8.07z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-1 7.28-2.69l-3.58-2.75c-.99.67-2.26 1.07-3.7 1.07-2.84 0-5.24-1.92-6.1-4.51H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.9 14.12c-.2-.78-.2-1.57 0-2.35V8.93H2.18C.88 11.16.88 13.84 2.18 16.07l3.72-2.95z"/>
    <path fill="#EA4335" d="M12 4.75c1.57 0 2.98.54 4.1 1.6l3.07-3.07C17.45 1.56 14.97.5 12 .5 7.7.5 3.99 2.97 2.18 6.93l3.72 2.95c.86-2.59 3.26-4.53 6.1-4.53z"/>
  </svg>
);

const AuthPage = () => {
  const [error, setError] = useState('');
  const [isNewLogin, setIsNewLogin] = useState(false);
  const navigate = useNavigate();

  const serverURL = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (user && !isNewLogin) console.log("User already logged in");
    });
  }, [isNewLogin]);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const response = await fetch(`${serverURL}/api/create_user/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (response.ok) {
        setIsNewLogin(true);
        navigate('/snippets');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to sign in');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to sign in with Google');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800 rounded-xl shadow-lg w-full max-w-md p-8 border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
            MemoryLog
          </h1>
          <p className="text-gray-400">
            Capture and cherish your memories
          </p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <GoogleIcon />
            Continue with Google
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>By continuing, you agree to MemoryLog's</p>
          <div className="space-x-2">
            <a href="#" className="hover:text-gray-300">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-300">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;