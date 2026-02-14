import React from "react";
import { motion } from "framer-motion";
import { Rocket, Star, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden py-24 px-6 md:px-10 bg-gradient-to-br from-[#0E9F9F] via-[#14B8B8] to-[#0B7F7F] text-white font-[Poppins]">
      {/* ✨ Animated background glows */}
      <motion.div
        className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"
        animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-[#F9B233]/10 rounded-full blur-3xl"
        animate={{ x: [0, -60, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 🌟 Content */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* 🧠 Left Section */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left space-y-6"
        >
          <div className="flex justify-center md:justify-start items-center gap-2">
            <Sparkles className="text-yellow-300" size={22} />
            <p className="uppercase text-sm tracking-widest text-white/80 font-semibold">
              Empower Local Exchange
            </p>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Turn Your Items into <br />
            <span className="bg-gradient-to-r from-[#FFF8E1] to-[#FFD54F] text-transparent bg-clip-text">
              Instant Cash 💸
            </span>
          </h2>

          <p className="text-white/90 text-base md:text-lg max-w-md">
            Post your ad for free and reach thousands of verified buyers near you.
            Simple, fast, and completely secure — start selling smarter with Alinafe.
          </p>

          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dashboard/createAd")}
            className="group relative mt-4 inline-flex items-center gap-3 bg-white text-[#0E9F9F] font-bold px-8 py-3 rounded-full overflow-hidden shadow-lg hover:text-[#0B7F7F] transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Rocket className="text-[#0E9F9F]" size={20} />
              Post Your Ad
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#CFFAFE] to-[#E0F2F1] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              layoutId="cta-bg"
            />
          </motion.button>
        </motion.div>

        {/* 🚀 Right Section Animation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <div className="absolute -inset-2 rounded-3xl bg-white/10 blur-2xl" />
            <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 w-[300px] md:w-[360px] text-center shadow-[0_8px_40px_rgba(0,0,0,0.1)]">
              <Star className="mx-auto text-yellow-300 mb-4" size={40} />
              <h3 className="text-2xl font-bold mb-2">
                Verified Sellers, Real Buyers
              </h3>
              <p className="text-white/80 mb-4">
                Every ad you post gets maximum exposure with top-notch visibility.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate("/ads")}
                className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-2 rounded-full transition"
              >
                Explore Ads <ArrowRight size={18} />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
