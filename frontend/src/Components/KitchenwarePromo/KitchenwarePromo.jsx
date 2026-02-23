import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Star,
  Loader2,
} from "lucide-react";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const KitchenwarePromo = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").trim() || "/api";

  useEffect(() => {
    const fetchLatestAds = async () => {
      try {
        const res = await fetch(`${API_BASE}/ads?limit=80&page=1`);
        const data = await res.json();
        const ads = Array.isArray(data?.ads) ? data.ads : [];
        const filteredAds = ads.filter(
          (ad) => !["Jobs", "Services"].includes(ad?.category)
        );

        const uniqueCategoryAds = [];
        const seenCategories = new Set();

        for (const ad of filteredAds) {
          const category = (ad?.category || "").trim().toLowerCase();
          if (!category || seenCategories.has(category)) continue;
          seenCategories.add(category);
          uniqueCategoryAds.push(ad);
          if (uniqueCategoryAds.length === 5) break;
        }

        setProducts(uniqueCategoryAds);
        setActiveIndex(0);
      } catch (err) {
        console.error("Promo ads fetch failed", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestAds();
  }, [API_BASE]);

  useEffect(() => {
    if (!products.length) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % products.length);
    }, 3500);
    return () => clearInterval(id);
  }, [products]);

  return (
    <section className="relative overflow-hidden py-24 px-6">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#0D9488] to-[#14B8A6]" />
      <div className="absolute -top-40 right-0 w-[140%] h-72 bg-gradient-to-r from-white/5 to-white/0 rotate-[-6deg]" />
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#0D9488]/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#14B8A6]/30 rounded-full blur-3xl" />
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 items-center text-white">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.h1
            variants={item}
            className="text-4xl md:text-5xl font-bold leading-tight"
          >
            Explore <span className="text-[#5EEAD4]">Best Deals</span> on Alinafe
          </motion.h1>

          <motion.p 
            variants={item}
            className="mt-5 text-lg text-[#E9EDFF] max-w-xl"
          >
            Fresh listings from multiple categories, updated in real time for
            faster discovery.
          </motion.p>

          <motion.ul variants={container} className="mt-7 space-y-4">
            <motion.li variants={item} className="flex gap-3">
              <ShieldCheck className="w-5 h-5 text-[#5EEAD4] mt-1" />
              <span className="text-[#E9EDFF]">
                Verified local sellers with trusted listings
              </span>
            </motion.li>

            <motion.li variants={item} className="flex gap-3">
              <Truck className="w-5 h-5 text-[#5EEAD4] mt-1" />
              <span className="text-[#E9EDFF]">
                Easy inspection and direct connection with sellers
              </span>
            </motion.li>

            <motion.li variants={item} className="flex gap-3">
              <Star className="w-5 h-5 text-[#5EEAD4] mt-1" />
              <span className="text-[#E9EDFF]">
                Priority listings surfaced for faster response
              </span>
            </motion.li>
          </motion.ul>

          <motion.div variants={item} className="mt-9 flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/ads")}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[#5EEAD4] text-[#0F172A] font-semibold shadow-lg hover:bg-[#2DD4BF] transition"
            >
              Explore All Ads
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative w-full block md:block order-first md:order-none"
        >
          {loading ? (
            <div className="h-[420px] rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center">
              <div className="flex items-center gap-2 text-white">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading latest Products...</span>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="h-[420px] rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center px-6 text-center text-white/90">
              No latest Products available right now.
            </div>
          ) : (
            <>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <motion.img
                  key={activeIndex}
                  src={
                    products[activeIndex]?.images?.[0] ||
                    "https://cdn-icons-png.flaticon.com/512/4076/4076500.png"
                  }
                  alt={products[activeIndex]?.title || "Latest Ad"}
                  className="w-full h-[440px] object-cover cursor-pointer"
                  onClick={() => {
                    if (products[activeIndex]?._id) {
                      navigate(`/ad/${products[activeIndex]._id}`);
                    }
                  }}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              </div>

              {products.length > 1 && (
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {products.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={`h-2.5 w-2.5 rounded-full transition ${
                        idx === activeIndex
                          ? "bg-[#5EEAD4]"
                          : "bg-white/60 hover:bg-white"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              <div
                onClick={() => {
                  if (products[activeIndex]?._id) {
                    navigate(`/ad/${products[activeIndex]._id}`);
                  }
                }}
                className="absolute bottom-6 left-6 bg-white/90 text-[#0F172A] rounded-2xl p-4 shadow-xl w-56 cursor-pointer backdrop-blur"
              >
                <div className="text-sm font-semibold line-clamp-2">
                  {products[activeIndex]?.title || "Latest listing"}
                </div>
                <div className="text-lg font-bold text-[#0D9488] mt-1">
                  {products[activeIndex]?.price
                    ? `INR ${Number(products[activeIndex].price).toLocaleString("en-IN")}`
                    : "Price on request"}
                </div>
                <div className="text-xs text-gray-600 mt-1 flex flex-col gap-0.5">
                  <span>
                    {products[activeIndex]?.category || "General"} |{" "}
                    {products[activeIndex]?.city || "India"}
                  </span>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>

       
    </section>
  );
};

export default KitchenwarePromo;
