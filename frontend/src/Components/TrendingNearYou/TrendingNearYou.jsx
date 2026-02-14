import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Loader2, LocateFixed } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").trim() || "/api";

// 🔥 Time Ago Function (OLX style)
const timeAgo = (dateString) => {
  const now = new Date();
  const posted = new Date(dateString);

  const seconds = Math.floor((now - posted) / 1000);
  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} mins ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} weeks ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} months ago`;

  const years = Math.floor(days / 365);
  return `${years} years ago`;
};

const TrendingNearYou = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [city, setCity] = useState("");
  const navigate = useNavigate();


  // 🔥 NEW STATE FOR AUTO-SUGGESTIONS
  const [suggestions, setSuggestions] = useState([]);

  /* -------------------------------
     🔹 Fetch Trending Ads
  -------------------------------- */
  const fetchTrending = async (params = {}) => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${API_BASE}/trending`, {
        params,
        withCredentials: true,
      });

      setAds(res.data || []);
    } catch (err) {
      console.error("Trending fetch error:", err);
      setError("Failed to load trending ads");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------
     🔹 Default load (global trending)
  -------------------------------- */
  useEffect(() => {
    fetchTrending();
  }, []);

  /* -------------------------------
     📍 Use Current Location
  -------------------------------- */
  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      return setError("Geolocation not supported");
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          const geoRes = await axios.get(
            "https://nominatim.openstreetmap.org/reverse",
            {
              params: {
                lat,
                lon: lng,
                format: "json",
              },
            }
          );

          const address = geoRes.data.address || {};
          const detectedCity =
            address.city ||
            address.town ||
            address.village ||
            address.county ||
            "";

          setCity(detectedCity);
          setSuggestions([]);

          fetchTrending({
            lat,
            lng,
            city: detectedCity,
          });
        } catch (err) {
          console.error("Reverse geocoding failed", err);
          fetchTrending({ lat, lng });
        }
      },
      () => {
        setLoading(false);
        setError("Location permission denied");
      }
    );
  };

  /* -------------------------------
     🏙️ City Select
  -------------------------------- */
  const handleCitySearch = () => {
    if (!city.trim()) return;
    setSuggestions([]);
    fetchTrending({ city });
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    setCity(value);

    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    const filtered = CITY_LIST.filter((c) =>
      c.toLowerCase().startsWith(value.toLowerCase())
    );

    setSuggestions(filtered);
  };

  /* -------------------------------
     🏙️ City List
  -------------------------------- */
  const CITY_LIST = [
    "Mumbai",
    "Delhi",
    "Bengaluru",
    "Chennai",
    "Hyderabad",
    "Kolkata",
    "Pune",
    "Jaipur",
    "Mathura",
    "Agra",
    "Noida",
    "Gurugram",
    "Faridabad",
    "Lucknow",
    "Kanpur",
    "Indore",
    "Bhopal",
    "Ahmedabad",
    "Surat",
    "Vadodara"
  ];

  return (
    <section className="w-full py-10 font-[Poppins] bg-white">
      {/* ================= HEADER ================= */}
      <div className="px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#006F62]">
            Trending Near You
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Popular picks around your area
          </p>
        </div>

        {/* 🔹 Actions */}
        <div className="relative flex gap-2 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter city (e.g. Mathura)"
              value={city}
              onChange={handleCityChange}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none w-56"
            />

            {/* 🔥 AUTO-SUGGESTION DROPDOWN */}
            {suggestions.length > 0 && (
              <ul className="absolute z-30 mt-1 w-full bg-white border rounded-lg shadow-md max-h-48 overflow-auto">
                {suggestions.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setCity(item);
                      setSuggestions([]);
                      fetchTrending({ city: item });
                    }}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-[#E0F2F1]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={handleCitySearch}
            className="bg-[#009688] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#00796B]"
          >
            Search
          </button>

          <button
            onClick={useCurrentLocation}
            title="Use current location"
            className="border rounded-lg p-2 hover:bg-gray-100"
          >
            <LocateFixed size={18} />
          </button>
        </div>
      </div>

      {/* ================= STATES ================= */}
      {loading && (
        <div className="flex justify-center py-10 text-[#009688]">
          <Loader2 className="animate-spin" />
        </div>
      )}

      {error && (
        <p className="text-center text-red-500 text-sm py-5">{error}</p>
      )}

      {!loading && ads.length === 0 && (
        <p className="text-center text-gray-500 text-sm py-10">
          No trending ads found
        </p>
      )}

      {/* ================= CARDS ================= */}
      {!loading && ads.length > 0 && (
        <div className="flex gap-5 overflow-x-auto px-6 hide-scrollbar scroll-smooth">
          {ads.map((item) => (
           <motion.div
           key={item._id}
           whileHover={{ scale: 1.03 }}
           transition={{ duration: 0.3 }}
           onClick={() => navigate(`/ad/${item._id}`)}
           className="min-w-[210px] max-w-[210px] bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer group"
         >
         
              <div className="w-full aspect-square bg-gray-100 overflow-hidden rounded-t-xl">
                <img
                  src={item.images?.[0] || "/placeholder.png"}
                  alt={item.title}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-3">
                <p className="text-lg font-bold text-gray-900">
                  ₹{item.price}
                </p>

                <p className="text-sm text-gray-700 line-clamp-1 mt-1">
                  {item.title}
                </p>

                <div className="flex items-center gap-1 text-gray-500 text-xs mt-2">
                  <MapPin size={12} />
                  <span>
                    {item.city || "Nearby"} • {timeAgo(item.createdAt)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default TrendingNearYou;


