import { IoSearch } from "react-icons/io5";
import UrlCard from "../components/UrlCard.tsx";
import { useEffect, useState, useCallback } from "react";
import {
  createShortUrl,
  getUrls,
  updateUrlTitle as updateUrlTitleApi,
  deleteShortUrl as deleteShortUrlApi,
  type UrlItem,
} from "../api/urlService.ts";
import toast from "react-hot-toast";

function Dashboard() {
  const [shortenedUrls, setShortenedUrls] = useState<UrlItem[]>([]);
  const [longUrl, setLongUrl] = useState("");
  const [title, setTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [shortening, setShortening] = useState(false);

  const fetchUrls = useCallback((query?: string) => {
    setLoading(true);
    getUrls(query)
      .then((response) => {
        if (response.success && Array.isArray(response.data)) {
          setShortenedUrls(response.data);
        } else {
          toast.error(response.message || "Failed to fetch URLs");
        }
      })
      .catch((e) => {
        console.error(e);
        toast.error("Failed to load your URLs");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUrls(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchUrls]);

  async function handleShorten() {
    if (!longUrl.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }

    setShortening(true);
    try {
      const response = await createShortUrl(longUrl.trim(), title.trim() || undefined);
      if (response.success && response.data) {
        toast.success(response.message || "Short URL created!");
        setLongUrl("");
        setTitle("");
        setShortenedUrls((prev) => [response.data, ...prev]);
      } else {
        toast.error(response.message || "Failed to create short URL");
      }
    } catch (e: any) {
      const msg = e.response?.data?.message || "An unexpected error occurred.";
      toast.error(typeof msg === "string" ? msg : msg[0]);
    } finally {
      setShortening(false);
    }
  }

  async function handleUpdateTitle(id: string, newTitle: string) {
    try {
      const response = await updateUrlTitleApi(id, newTitle);
      if (response.success && response.data) {
        toast.success(response.message || "Title updated!");
        setShortenedUrls((prev) =>
          prev.map((item) => (item.id === id ? response.data : item))
        );
      } else {
        toast.error(response.message || "Failed to update title");
      }
    } catch (e: any) {
      const msg = e.response?.data?.message || "Failed to update title";
      toast.error(typeof msg === "string" ? msg : msg[0]);
    }
  }

  async function handleDeleteUrl(id: string) {
    if (!window.confirm("Are you sure you want to delete this Smol URL?")) {
      return;
    }

    try {
      const response = await deleteShortUrlApi(id);
      if (response.success) {
        toast.success(response.message || "URL deleted successfully");
        setShortenedUrls((prev) => prev.filter((item) => item.id !== id));
      } else {
        toast.error(response.message || "Failed to delete URL");
      }
    } catch (e: any) {
      const msg = e.response?.data?.message || "Failed to delete URL";
      toast.error(typeof msg === "string" ? msg : msg[0]);
    }
  }

  return (
    <div className="min-h-screen patrick-hand tracking-wider">
      {/* Hero Shortening Section */}
      <div className="bg-gray-800 flex items-center pt-[80px]">
        <div className="flex flex-col w-full gap-4 lg:gap-8 pt-4 lg:pt-10 pb-10 lg:pb-20">
          <div className="flex flex-col items-center gap-4 text-center px-4">
            <h1 className="text-5xl lg:text-6xl font-extrabold text-white/90">
              Turn Long URLs into Smol Links
            </h1>
            <h3 className="text-2xl lg:text-3xl text-white/50 max-w-250">
              Create short, clean links in seconds and keep all your URLs organized
              in one place. Simple, fast, and hassle-free.
            </h3>
          </div>

          <div className="flex flex-col justify-center max-w-4xl mx-auto px-4 w-full gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Title (optional, e.g. My Portfolio)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-gray-700/80 text-white p-3.5 sm:w-1/3 rounded-lg text-xl border border-gray-600 focus:outline-none focus:border-gray-400 placeholder:text-gray-400"
              />
              <input
                type="url"
                placeholder="Enter a looooooooooooong URL here (e.g. https://google.com)..."
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleShorten()}
                className="bg-gray-300 p-3.5 sm:w-2/3 rounded-lg text-xl text-gray-900 focus:outline-none placeholder:text-gray-600"
              />
            </div>
            <button
              className="bg-gray-600 hover:bg-gray-700 p-4 rounded-lg text-white/90 text-2xl cursor-pointer duration-200 disabled:opacity-50 font-bold tracking-wider"
              onClick={handleShorten}
              disabled={shortening}
            >
              {shortening ? "Creating Smol Link..." : "Shorten URL"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Links Content Section */}
      <div className="px-[5%] lg:px-[10%] py-10">
        <div className="flex flex-col mb-8 sm:flex-row items-center justify-between gap-6">
          <h1 className="text-4xl text-white/90 font-semibold">
            Your Smol Links ({shortenedUrls.length})
          </h1>
          <div className="border-2 border-transparent flex items-center bg-gray-700 px-3 rounded-lg focus-within:border-2 focus-within:border-gray-400 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by title or URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-[44px] w-full sm:w-[260px] text-white/80 outline-none text-xl placeholder:text-gray-400"
            />
            <IoSearch className="text-2xl text-white/70 cursor-pointer" />
          </div>
        </div>

        {loading ? (
          <div className="h-[200px] flex items-center justify-center text-gray-400 text-2xl">
            Loading links...
          </div>
        ) : shortenedUrls.length === 0 ? (
          <div className="h-[250px] bg-gray-800/40 border-2 border-gray-700 border-dashed rounded-xl flex items-center justify-center text-gray-400 text-2xl">
            {searchQuery ? "No Smol URLs match your search." : "No Smol URLs found. Shorten your first link above!"}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
            {shortenedUrls.map((urlItem) => (
              <UrlCard
                key={urlItem.id}
                urlItem={urlItem}
                onUpdate={handleUpdateTitle}
                onDelete={handleDeleteUrl}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
