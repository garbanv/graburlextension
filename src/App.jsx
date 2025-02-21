import React, { useState, useEffect, useRef, lazy } from "react";
import { FaPlus, FaCopy, FaTrash } from "react-icons/fa";

function App() {
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    async function loadLinks() {
      try {
        const result = await new Promise((resolve) => {
          chrome.storage.sync.get(["socialLinks"], (res) => {
            resolve(res);
          });
        });

        if (result.socialLinks) {
          setLinks(result.socialLinks);
        }
      } catch (error) {
        console.error("Error loading links:", error);
      } finally {
        setIsLoading(false); // Set loading to false once data is loaded
      }
    }

    loadLinks();
  }, []);

  useEffect(() => {
    async function saveLinks() {
      try {
        await new Promise((resolve, reject) => {
          chrome.storage.sync.set({ socialLinks: links }, () => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve();
            }
          });
        });
      } catch (error) {
        console.error("Error saving links:", error);
      }
    }

    if (links.length > 0) {
      saveLinks();
    }
  }, [links]);

  const handleAddLink = () => {
    if (newLink.trim() !== "") {
      setLinks([...links, newLink]);
      setNewLink("");
    }
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
  };

  const handleDeleteLink = (index) => {
    const updatedLinks = [...links];
    updatedLinks.splice(index, 1);
    setLinks(updatedLinks);
  };

  if (isLoading) {
    return <div>Loading...</div>; // Render loading indicator while data is fetched
  }

  return (
    <div className="max-w-screen-xl mx-auto py-5">
     <div className="container mx-auto px-5">
      <div className="flex justify-center items-center ">
        {/* <img src="/logo.png" loading="lazy" alt="graburl" width={"120px"} /> */}
        <h1 className="font-bold customFont">GrabURL</h1>
        
      </div>
      <div className="flex justify-center mb-5"><span className="text-xs">Effortless URL access</span></div>
      <div className="flex gap-x-5">
        <input
          type="text"
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
          placeholder="Enter URL"
          className="w-full p-2 bg-gray-50 rounded-md shadow"
        />
        <button onClick={handleAddLink}>
          <FaPlus />
        </button>
      </div>
      <ul className="">
        {links.map((link, index) => (
          <li
            key={index}
            className="flex gap-x-5  my-2  rounded-md"
            
          >
            <span className="w-full p-2 bg-gray-50 shadow rounded-md"><a href={link} target="_blank">{link}</a></span>
            <div className="flex justify-end gap-x-5">
              <button onClick={() => handleCopyLink(link)} className="shadow">
                <FaCopy />
              </button>
              <button onClick={() => handleDeleteLink(index)} className="shadow">
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
    <div className="flex flex-col items-center justify-center text-black"><span className="font-bold text-xs mt-5">Made by <a href="https://agarban.com" target="_blank">Alexei</a></span><a  className="font-bold text-xs underline text-black mb-5 bg-gray-50 rounded py-2 px-5"href="https://buymeacoffee.com/garbanv" target="_blank">Buy me a coffee?</a></div>
    </div>
  );
}

export default App;
