import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { LayoutGrid, List, MapPin, SlidersHorizontal, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").trim() || "/api";
const FALLBACK_IMAGE =
  "https://res.cloudinary.com/demo/image/upload/v1690000000/no-image.png";
const NO_PRICE_CATEGORIES = new Set(["Jobs", "Services"]);
const PAGE_LIMIT = 20;

const getPostedDaysAgo = (dateValue) => {
  if (!dateValue) return "";
  const created = new Date(dateValue).getTime();
  if (Number.isNaN(created)) return "";
  const now = Date.now();
  const diffDays = Math.max(0, Math.floor((now - created) / (1000 * 60 * 60 * 24)));
  if (diffDays === 0) return "Posted today";
  if (diffDays === 1) return "Posted 1 day ago";
  return `Posted ${diffDays} days ago`;
};

const AdsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const location = searchParams.get("location") || "";
  const query = searchParams.get("q") || "";

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [view, setView] = useState("grid");
  const [filterBy, setFilterBy] = useState("all");

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        setPage(1);
        const params = {};
        if (location) params.location = location;
        if (query) params.q = query;
        if (filterBy === "new") params.condition = "New";
        if (filterBy === "used") params.condition = "Used";
        params.page = 1;
        params.limit = PAGE_LIMIT;

        const res = await axios.get(`${API_BASE}/ads`, { params });
        const data = Array.isArray(res.data) ? res.data : res.data?.ads || [];
        setAds(data);
        setHasMore((res.data?.page || 1) < (res.data?.pages || 1));
      } catch (err) {
        console.error("Fetch ads error", err);
        setAds([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [location, query, filterBy]);

  const loadMoreAds = async () => {
    if (loadingMore || !hasMore) return;
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const params = { page: nextPage, limit: PAGE_LIMIT };
      if (location) params.location = location;
      if (query) params.q = query;
      if (filterBy === "new") params.condition = "New";
      if (filterBy === "used") params.condition = "Used";

      const res = await axios.get(`${API_BASE}/ads`, { params });
      const data = Array.isArray(res.data) ? res.data : res.data?.ads || [];
      setAds((prev) => [...prev, ...data]);
      setPage(nextPage);
      setHasMore((res.data?.page || nextPage) < (res.data?.pages || nextPage));
    } catch (err) {
      console.error("Load more ads error", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const sortedAds = useMemo(() => {
    const data = [...ads];
    if (filterBy === "priceLow") data.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (filterBy === "priceHigh") data.sort((a, b) => (b.price || 0) - (a.price || 0));
    return data;
  }, [ads, filterBy]);

  return (
    <section className="relative min-h-screen font-[Poppins] bg-gradient-to-br from-[#ECFEFF] via-white to-[#F0FDFA] overflow-hidden">
      <div className="absolute -top-20 -left-16 w-[28rem] h-[28rem] bg-[#0EA5A0]/15 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[24rem] h-[24rem] bg-[#14B8A6]/15 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#0B4F4A]">
          {query ? `Results for "${query}"` : "Browse Ads"}
        </h1>
        <p className="mt-2 text-sm md:text-base text-[#0F766E]/80">
          Explore trusted listings around you with fast filters and clean browsing.
        </p>

        <div className="mt-5 inline-flex flex-wrap items-center gap-3 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-xl shadow border border-[#0F766E]/10">
          {location && (
            <span className="flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-[#E6F6F4] text-[#0E9F9F]">
              <MapPin size={12} /> {location}
            </span>
          )}

          <span className="text-sm text-gray-600">{loading ? "Loading..." : `${sortedAds.length} results`}</span>

          {(query || location || filterBy !== "all") && (
            <button
              onClick={() => {
                setFilterBy("all");
                navigate("/ads");
              }}
              className="flex items-center gap-1 text-xs text-[#E94F37] hover:underline font-medium"
            >
              <X size={12} /> Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 mb-8 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 bg-white/80 border border-[#0F766E]/10 rounded-2xl px-3 py-2 shadow-sm">
          <SlidersHorizontal size={18} className="text-gray-500" />
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="px-3 py-1.5 rounded-full border border-[#0F766E]/20 text-sm bg-white"
          >
            <option value="all">All</option>
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
          </select>
        </div>

        <div className="flex items-center gap-2 bg-white/80 border border-[#0F766E]/10 rounded-full p-1.5 shadow-sm">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-full border ${
              view === "grid"
                ? "bg-[#E6F6F4] border-[#0F766E]/20"
                : "bg-white border-transparent"
            }`}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-full border ${
              view === "list"
                ? "bg-[#E6F6F4] border-[#0F766E]/20"
                : "bg-white border-transparent"
            }`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-3xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"
              />
            ))}
          </div>
        )}

        {!loading && sortedAds.length === 0 && (
          <div className="flex flex-col items-center py-24">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076500.png"
              alt="No ads"
              className="w-28 mb-4 opacity-80"
            />
            <p className="text-lg font-medium text-gray-600">No ads found</p>
            <button
              onClick={() => navigate("/dashboard/createAd")}
              className="mt-4 px-6 py-2.5 rounded-full bg-[#0F766E] text-white font-medium"
            >
              Post an ad
            </button>
          </div>
        )}

        {!loading && sortedAds.length > 0 && (
          <>
            <motion.div
              layout
              className={
                view === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                  : "flex flex-col gap-6"
              }
            >
              <AnimatePresence>
                {sortedAds.map((ad, i) => (
                  <motion.div
                    key={ad._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    whileHover={{ y: -6 }}
                    onClick={() => navigate(`/ad/${ad._id}`)}
                    className={`group bg-white/90 backdrop-blur-xl rounded-3xl border border-[#0F766E]/10 shadow-sm hover:shadow-xl cursor-pointer overflow-hidden transition ${
                      view === "list" ? "flex flex-col sm:flex-row" : ""
                    }`}
                  >
                    <div
                      className={`relative overflow-hidden ${
                        view === "list" ? "h-56 sm:h-auto sm:w-72" : "h-52"
                      }`}
                    >
                      <img
                        src={ad.images?.[0] || FALLBACK_IMAGE}
                        alt={ad.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="p-4 flex-1">
                      <h3 className="font-semibold text-[#0B4F4A] truncate">{ad.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {ad.description || "No description available"}
                      </p>
                      {!NO_PRICE_CATEGORIES.has(ad.category) && ad.price != null && (
                        <p className="mt-2 text-sm font-semibold text-[#14B8A6]">
                          ₹ {ad.price?.toLocaleString("en-IN")}
                        </p>
                      )}

                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-xs text-gray-500">{ad.city || "India"}</p>
                        {ad.subcategory && (
                          <span className="text-[11px] px-2 py-1 rounded-full bg-[#0F766E]/10 text-[#0F766E]">
                            {ad.subcategory}
                          </span>
                        )}
                      </div>

                      {ad.createdAt && (
                        <p className="mt-2 text-[11px] text-gray-400">
                          {getPostedDaysAgo(ad.createdAt)}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={loadMoreAds}
                  disabled={loadingMore}
                  className="px-7 py-3 rounded-full bg-[#0F766E] text-white font-semibold shadow hover:bg-[#0c655f] disabled:opacity-70"
                >
                  {loadingMore ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default AdsPage;
