import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import { motion } from "framer-motion";

const banners = [
  {
    title: "Up to 40% Off Laptops & Smartphones",
    subtitle: "Upgrade your tech at unbeatable prices!",
    button: "Shop Now",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1900",
  },
  {
    title: "Order Online & Save ₹ 1,500",
    subtitle: "Exclusive restaurant deals near you!",
    button: "Order Now",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1900",
  },
  {
    title: "2BHK Apartments – Ready to Move",
    subtitle: "Affordable housing in your favorite area.",
    button: "View Properties",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1900",
  },
  {
    title: "Hire Verified Plumbers Today",
    subtitle: "Fast, reliable & affordable home services.",
    button: "Book Service",
    image:
      "https://images.unsplash.com/photo-1581579185169-1be7c4c07b8b?w=1900",
  },
];

const BannerSlider = () => {
  return (
    <section className="w-full py-10">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop
        effect="fade"
        navigation
        className="rounded-3xl overflow-hidden shadow-xl"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full aspect-[16/6] bg-gray-200 overflow-hidden">
              {/* Banner Image */}
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover object-center scale-105"
              />

              {/* Glassmorphism Overlay */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col justify-center px-10 md:px-20">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-white text-3xl md:text-5xl font-bold max-w-[60%] leading-tight"
                >
                  {banner.title}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-gray-200 text-lg md:text-xl mt-3 max-w-[45%]"
                >
                  {banner.subtitle}
                </motion.p>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="mt-6 w-fit bg-[#14B8A6] hover:bg-[#E94F37] text-white px-6 py-3 rounded-xl text-sm font-medium shadow-lg transition"
                >
                  {banner.button}
                </motion.button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default BannerSlider;
