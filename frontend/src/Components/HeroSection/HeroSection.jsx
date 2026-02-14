import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

// ⭐ NEW PREMIUM C2C SLIDES FOR ALINAFE
const slides = [
  {
    id: 1,
    title: "Know Alinafe Better",
    subtitle: "Trusted local marketplace built for India",
    image:
      "https://images.unsplash.com/photo-1598331668826-20cecc596b86?q=80&w=1336&auto=format&fit=crop",
    buttonText: "About Us",
    action: "about",
  },
  {
    id: 2,
    title: "Clear Space, Earn Cash",
    subtitle: "Post your listing and connect with real buyers",
    image:
      "https://plus.unsplash.com/premium_photo-1661369981367-914fd4081355?q=80&w=1170&auto=format&fit=crop",
    buttonText: "Post an Ad",
    action: "post-ad",
  },
  {
    id: 3,
    title: "Where Trust Meets Trading",
    subtitle: "Join now and start buying or selling today",
    image:
      "https://images.unsplash.com/photo-1723110994499-df46435aa4b3?q=80&w=1179&auto=format&fit=crop",
    buttonText: "Join Now",
    action: "join",
  },
];


export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  // ⭐ AUTO SLIDE EVERY 4 SECONDS
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const handleSlideAction = () => {
    const action = slides[index]?.action;
    if (action === "about") {
      navigate("/about");
      return;
    }
    if (action === "post-ad") {
      if (user?.uid) {
        navigate("/dashboard/createAd");
      } else {
        navigate("/login");
      }
      return;
    }
    if (action === "join") {
      navigate("/signup");
    }
  };

  return (
    <div
      className="relative w-full 
      h-[280px] sm:h-[360px] md:h-[480px] lg:h-[560px] xl:h-[630px]
      overflow-hidden rounded-2xl shadow-lg mt-[95px] md:mt-[120px]"
    >
      {/* SLIDES */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[index].id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Image */}
          <img
            src={slides[index].image}
            alt="slider"
            className="w-full h-full object-cover object-center"
          />

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-transparent"></div>

          {/* CONTENT */}
          <div
            className="absolute inset-0 flex flex-col justify-center 
            px-6 sm:px-10 md:px-14 lg:px-20 text-white max-w-xl"
          >
            <motion.h1
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight"
            >
              {slides[index].title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="mt-3 text-lg sm:text-xl md:text-2xl text-white/90"
            >
              {slides[index].subtitle}
            </motion.p>

            {/* CTA BUTTON */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={handleSlideAction}
              className="mt-6 w-fit px-7 py-3 md:px-9 md:py-4 
              bg-gradient-to-r from-[#0E9F9F] to-[#00796B] 
              hover:opacity-95 rounded-lg text-lg md:text-xl 
              font-semibold flex items-center gap-3 shadow-md"
            >
              {slides[index].buttonText}
              <ArrowRight size={22} />
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ⭐ DOTS INDICATOR */}
      <div className="absolute bottom-5 w-full flex justify-center gap-3">
        {slides.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              width: i === index ? 20 : 8,
              opacity: i === index ? 1 : 0.5,
            }}
            transition={{ duration: 0.3 }}
            className={`h-2 rounded-full ${
              i === index ? "bg-white" : "bg-white/50"
            }`}
          ></motion.div>
        ))}
      </div>
    </div>
  );
}
