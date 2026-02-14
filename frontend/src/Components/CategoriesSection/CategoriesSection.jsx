import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ModernCategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = [
      {
        name: "Real Estate",
        image:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        color: "#2DB7A3",
      },
      {
        name: "Vehicles",
        image:
          "https://images.unsplash.com/photo-1558981033-0f0309284409?auto=format&fit=crop&w=1170&q=80",
        color: "#14B8A6",
      },
      {
        name: "Electronics",
        image:
          "https://cdn.shopify.com/s/files/1/0057/8938/4802/files/ACCH9K5BSTKDMBJX_0_3000x.png?v=1752071234",
        color: "#0E3C57",
      },
      {
        name: "Fashion & Beauty",
        image:
          "https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=1170&q=80",
        color: "#EC4899",
      },
      {
        name: "Home & Furniture",
        image:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=2158&q=80",
        color: "#8B5CF6",
      },
      {
        name: "Jobs & Services",
        image:
          "https://plus.unsplash.com/premium_photo-1677151140485-df90e1e2fbbd?auto=format&fit=crop&w=1170&q=80",
        color: "#F43F5E",
      },
      {
        name: "Agriculture",
        image:
          "https://plus.unsplash.com/premium_photo-1678344170545-c3edef92a16e?auto=format&fit=crop&w=1171&q=80",
        color: "#84CC16",
      },
      {
        name: "Education",
        image:
          "https://plus.unsplash.com/premium_photo-1677567996070-68fa4181775a?auto=format&fit=crop&w=1172&q=80",
        color: "#3B82F6",
      },
      {
        name: "Business & Industry",
        image:
          "https://plus.unsplash.com/premium_photo-1723874409704-6840c4c945cd?auto=format&fit=crop&w=1170&q=80",
        color: "#0EA5E9",
      },
      {
        name: "Digital Products",
        image:
          "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
        color: "#22C55E",
      },
    ];
    setCategories(data);
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <section className="relative py-24 bg-gradient-to-br from-[#E8FDFB] via-[#E0F7FA] to-[#D1F4EF] overflow-hidden font-[Poppins]">
      {/* Floating background glows */}
      <motion.div
        className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-[#2DB7A3]/25 rounded-full blur-3xl"
        animate={{ y: [0, 25, 0], x: [0, 25, 0] }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-[#0E3C57]/20 rounded-full blur-3xl"
        animate={{ y: [0, -25, 0], x: [0, -25, 0] }}
        transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
      />

      {/* Section Heading */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-extrabold text-[#0E3C57] leading-tight mb-4"
        >
          Explore Our{" "}
          <span className="bg-gradient-to-r from-[#2DB7A3] to-[#0E3C57] text-transparent bg-clip-text">
            Top Categories
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-gray-600 text-lg"
        >
          Real products. Real sellers. Real connections — all in one place.
        </motion.p>
      </div>

      {/* Category Grid */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10 max-w-7xl mx-auto px-6 justify-items-center"
      >
        {categories.map((cat, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={fadeUp}
            whileHover={{ scale: 1.07, y: -6 }}
            transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
            onClick={() => navigate(`/category/${encodeURIComponent(cat.name)}`)}
            className="relative cursor-pointer group"
          >
            <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-3xl overflow-hidden bg-white/70 backdrop-blur-xl border border-white/30 shadow-[0_6px_25px_rgba(14,159,159,0.08)] hover:shadow-[0_10px_35px_rgba(14,159,159,0.25)] transition-all duration-500 flex items-center justify-center">
              {/* Background Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-all duration-500"></div>

              {/* Text */}
              <div className="relative z-20 text-center">
                <h3 className="text-white font-semibold text-base md:text-lg drop-shadow-md">
                  {cat.name}
                </h3>
              </div>

              {/* Color Glow */}
              <motion.div
                className="absolute inset-0 blur-3xl z-0"
                style={{ backgroundColor: cat.color }}
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Call To Action */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        className="text-center mt-20"
      >
        <button
          onClick={() => navigate("/dashboard/createAd")}
          className="relative inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-[#2DB7A3] to-[#0E3C57] text-white font-semibold text-lg rounded-full shadow-lg hover:shadow-[0_8px_40px_rgba(14,159,159,0.3)] transition-all duration-500 overflow-hidden group"
        >
          <motion.span
            className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
          <span className="relative z-10">Post Your Ad Now 🚀</span>
        </button>
      </motion.div>
    </section>
  );
};

export default ModernCategoriesSection;
