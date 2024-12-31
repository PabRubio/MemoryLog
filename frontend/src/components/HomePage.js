import React from 'react';
import { PlusCircle, Camera, BookOpen, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col px-4">
      <div className="w-full max-w-6xl mx-auto py-8">
        <header className="text-center py-20">
          <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
            MemoryLog
          </h1>
          <p className="text-2xl text-gray-400 max-w-3xl mx-auto mb-10">
            Capture, cherish, and relive your most precious moments in a beautiful, 
            personal digital journal.
          </p>
          <button 
            onClick={() => navigate('/auth')}
            className="flex items-center gap-3 mx-auto bg-blue-600 text-gray-100 px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-xl"
          >
            <PlusCircle size={24} />
            Create First Memory
          </button>
        </header>

        <section className="grid md:grid-cols-3 gap-8 mt-8 mb-20">
          <div className="bg-gray-800 border border-gray-700 rounded-lg hover:shadow-lg transition-shadow">
            <div className="p-8 text-center">
              <Camera className="mx-auto mb-6 text-blue-500" size={64} />
              <h2 className="text-2xl font-semibold mb-3">Capture Moments</h2>
              <p className="text-gray-400">
                Easily upload photos and add meaningful captions to your personal memory collection.
              </p>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg hover:shadow-lg transition-shadow">
            <div className="p-8 text-center">
              <Heart className="mx-auto mb-6 text-red-500" size={64} />
              <h2 className="text-2xl font-semibold mb-3">Express Emotions</h2>
              <p className="text-gray-400">
                Choose from a range of emojis to capture the feeling behind each memory.
              </p>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg hover:shadow-lg transition-shadow">
            <div className="p-8 text-center">
              <BookOpen className="mx-auto mb-6 text-green-500" size={64} />
              <h2 className="text-2xl font-semibold mb-3">Preserve Stories</h2>
              <p className="text-gray-400">
                Create a personal archive of your life's most cherished moments and memories.
              </p>
            </div>
          </div>
        </section>

        <footer className="text-center text-gray-500 py-8 border-t border-gray-700">
          <p>© 2025 MemoryLog. Preserve your moments, treasure your stories.</p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;