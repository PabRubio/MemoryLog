import React, { useState, useEffect } from 'react';
import { PlusCircle, Camera, X } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';

const MemoryLog = () => {
  const [memories, setMemories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSnippet, setNewSnippet] = useState({
    image: null,
    caption: '',
    emoji: '😊'
  });

  const serverURL = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    const fetchSnippets = async (user) => {
      try {
        const idToken = await user.getIdToken();
        const response = await fetch(`${serverURL}/api/get_snippets/`, {
          headers: { Authorization: idToken },
        });
  
        if (response.ok) {
          const snippets = await response.json();
          const sortedSnippets = snippets.sort((a, b) => 
            new Date(b.date) - new Date(a.date)
          );
          setMemories(sortedSnippets);
        } else {
          console.error((await response.json()).error || 'Failed to fetch snippets');
        }
      } catch (err) {
        console.error('Failed to fetch snippets', err);
      }
    };
  
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchSnippets(user);
      } else {
        console.warn('No user is logged in');
      }
    });
  
    return () => unsubscribe();
  }, []);   

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewSnippet((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewSnippet({ image: null, caption: '', emoji: '😊' });
  };

  const handleSaveSnippet = async () => {
    if (!newSnippet.image || !newSnippet.caption) return;
  
    const newMemory = {
      image: newSnippet.image,
      caption: newSnippet.caption,
      emoji: newSnippet.emoji,
    };
  
    try {
      const user = auth.currentUser;
      if (!user) return console.warn("User not authenticated");
  
      const idToken = await user.getIdToken();
      const response = await fetch(`${serverURL}/api/create_snippet/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': idToken,
        },
        body: JSON.stringify(newMemory),
      });
  
      if (response.ok) {
        const savedSnippet = await response.json();
        const fullSnippet = {
          ...newMemory,
          id: savedSnippet.id,
          date: new Date().toISOString(),
        };
  
        setMemories([fullSnippet, ...memories]);
        handleCloseModal();
      } else {
        const errorData = await response.json();
        console.error(errorData.error || 'Failed to save snippet');
      }
    } catch (err) {
      console.error('Failed to save snippet', err);
    }
  };  

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col px-4">
      <div className="w-full max-w-6xl mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">MemoryLog</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-gray-100 px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg"
          >
            <PlusCircle size={20} />
            <span>New Snippet</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memories.map((memory, index) => (
            <div 
              key={index} 
              className="overflow-hidden hover:shadow-lg transition-shadow bg-gray-800 border border-gray-700 rounded-lg transform hover:scale-105 transition-transform duration-200"
            >
              <div className="p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-base text-gray-400">
                    {new Date(memory.date).toLocaleDateString()}
                  </span>
                  <span className="text-2xl">{memory.emoji}</span>
                </div>
              </div>
              <div className="w-full" style={{ paddingBottom: `${(3648 / 5472) * 100}%`, position: 'relative' }}>
                <img
                  src={memory.image}
                  alt={memory.caption}
                  style={{
                    position: 'absolute',
                    width: '5472px',
                    height: '3648px',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    objectFit: 'contain'
                  }}
                />
              </div>
              <div className="p-3">
                <p className="text-base text-gray-300 relative top-1.5">{memory.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 w-96 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-100">Create New Snippet</h2>
              <button 
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                className="hidden" 
                id="imageUpload"
              />
              <label 
                htmlFor="imageUpload" 
                className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors block cursor-pointer"
              >
                {newSnippet.image ? (
                  <img 
                    src={newSnippet.image} 
                    alt="Uploaded" 
                    className="w-full h-40 object-contain rounded-lg"
                  />
                ) : (
                  <>
                    <Camera className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-base text-gray-400">Click to upload photo</p>
                  </>
                )}
              </label>
              <textarea
                placeholder="What's the story behind this moment?"
                className="w-full p-2 rounded-lg bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                value={newSnippet.caption}
                onChange={(e) => {
                  if (e.target.value.length <= 50) {
                    setNewSnippet((prev) => ({ ...prev, caption: e.target.value }));
                  }
                }}
              />
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  {['😊', '❤️', '😢', '😎'].map((emoji) => (
                    <button 
                      key={emoji}
                      onClick={() => setNewSnippet((prev) => ({ ...prev, emoji }))}
                      className={`p-2 hover:bg-gray-700 rounded transition-colors ${
                        newSnippet.emoji === emoji ? 'bg-blue-600' : ''
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={handleSaveSnippet}
                  disabled={!newSnippet.image || !newSnippet.caption}
                  className="bg-blue-600 text-gray-100 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Snippet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryLog;