import { useState } from "react";
import toast from "react-hot-toast";
import { FiCopy, FiEdit2, FiTrash2, FiCheck, FiX, FiExternalLink } from "react-icons/fi";
import type { UrlItem } from "../api/urlService";

interface UrlCardProps {
  urlItem: UrlItem;
  onDelete: (id: string) => void;
  onUpdate: (id: string, newTitle: string) => void;
}

function UrlCard({ urlItem, onDelete, onUpdate }: UrlCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [titleInput, setTitleInput] = useState(urlItem.title);
  const [loading, setLoading] = useState(false);

  const backendBaseUrl = import.meta.env.VITE_AXIOS_BASE_URL || "http://localhost:3000";
  const shortUrlDomain = import.meta.env.VITE_SHORT_URL_DOMAIN || backendBaseUrl;
  const fullShortUrl = `${shortUrlDomain}/${urlItem.shortCode}`;

  async function handleCopy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard.`);
    } catch {
      toast.error("Failed to copy link");
    }
  }

  async function handleSaveTitle() {
    if (!titleInput.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    setLoading(true);
    try {
      await onUpdate(urlItem.id, titleInput.trim());
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  }

  function handleCancelEdit() {
    setTitleInput(urlItem.title);
    setIsEditing(false);
  }

  return (
    <div className="bg-gray-800 rounded-xl p-5 flex flex-col justify-between gap-4 border-1 border-gray-700 hover:border-gray-600 transition-all duration-200 shadow-lg">
      <div className="flex flex-col gap-3">
        {/* Header: Title & Actions */}
        <div className="flex items-center justify-between gap-2 border-b border-gray-700/60 pb-3">
          {isEditing ? (
            <div className="flex items-center gap-2 w-full">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                className="bg-gray-700 text-white text-xl px-2 py-1 rounded w-full border border-gray-500 focus:outline-none"
                autoFocus
              />
              <button
                onClick={handleSaveTitle}
                disabled={loading}
                className="p-2 bg-green-600 hover:bg-green-500 text-white rounded duration-150 cursor-pointer"
                title="Save Title"
              >
                <FiCheck className="text-lg" />
              </button>
              <button
                onClick={handleCancelEdit}
                className="p-2 bg-gray-600 hover:bg-gray-500 text-white rounded duration-150 cursor-pointer"
                title="Cancel"
              >
                <FiX className="text-lg" />
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-white/90 text-2xl font-bold tracking-wider truncate">
                {urlItem.title}
              </h3>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 bg-gray-700/60 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-all cursor-pointer"
                  title="Edit Title"
                >
                  <FiEdit2 className="text-lg" />
                </button>
                <button
                  onClick={() => onDelete(urlItem.id)}
                  className="p-2 bg-red-950/40 hover:bg-red-600/80 text-red-400 hover:text-white rounded-lg transition-all cursor-pointer"
                  title="Delete URL"
                >
                  <FiTrash2 className="text-lg" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Smol URL Field */}
        <div>
          <span className="text-gray-400 text-sm tracking-wide block mb-1">
            Smol URL
          </span>
          <div className="p-3 bg-gray-700/70 rounded-lg relative flex items-center justify-between gap-2 border border-gray-600/50">
            <a
              href={fullShortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 font-medium tracking-normal text-lg hover:underline truncate flex items-center gap-1.5"
            >
              {fullShortUrl}
              <FiExternalLink className="text-sm shrink-0" />
            </a>
            <button
              className="bg-black/30 hover:bg-black/50 p-2 rounded-md text-gray-300 hover:text-white transition-all cursor-pointer shrink-0"
              onClick={() => handleCopy(fullShortUrl, "Smol URL")}
              title="Copy Smol URL"
            >
              <FiCopy />
            </button>
          </div>
        </div>

        {/* Original URL Field */}
        <div>
          <span className="text-gray-400 text-sm tracking-wide block mb-1">
            Original URL
          </span>
          <div className="p-3 bg-gray-900/60 rounded-lg relative flex items-center justify-between gap-2 border border-gray-700/50">
            <span className="text-gray-300 tracking-normal text-base truncate">
              {urlItem.url}
            </span>
            <button
              className="bg-black/30 hover:bg-black/50 p-2 rounded-md text-gray-400 hover:text-white transition-all cursor-pointer shrink-0"
              onClick={() => handleCopy(urlItem.url, "Original URL")}
              title="Copy Original URL"
            >
              <FiCopy />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UrlCard;
