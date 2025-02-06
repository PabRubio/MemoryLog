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
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
      s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
      s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
      C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
      c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
      c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
);

const AuthPage = () => {
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
      }
    } catch (err) {
      console.error(err.code);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800 rounded-xl shadow-lg w-full max-w-md p-8 pt-[23px] border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-4 leading-normal">
            MemoryLog
          </h1>
          <p className="text-gray-400">
            Life is a collection of moments
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
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>By continuing, you agree to MemoryLog's</p>
          <div className="space-x-2">
            <a href="https://www.youtube.com/watch?v=kk0feCp_MZ4" target="_blank" rel="noreferrer" className="hover:text-gray-300">Terms of Service</a>
            <span>•</span>
            <a href="https://www.youtube.com/watch?v=kk0feCp_MZ4" target="_blank" rel="noreferrer" className="hover:text-gray-300">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;