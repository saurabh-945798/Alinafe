import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, MapPin, MessagesSquare } from "lucide-react";

const features = [
  {
    icon: <ShieldCheck size={42} className="text-[#009688]" />,
    title: "Safe & Secure Marketplace",
    desc: "Every interaction is protected. Verified users, safe chat, and trusted listings.",
  },
  {
    icon: <Zap size={42} className="text-[#009688]" />,
    title: "Fast Buying & Selling",
    desc: "Post ads in seconds and connect with genuine buyers instantly.",
  },
  {
    icon: <MapPin size={42} className="text-[#009688]" />,
    title: "Local & Relevant Listings",
    desc: "See products near your area. Save time and meet nearby sellers easily.",
  },
  {
    icon: <MessagesSquare size={42} className="text-[#009688]" />,
    title: "Smart Chat System",
    desc: "Real-time chat designed for buyers & sellers to communicate instantly.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-[#E8FDFB] via-white to-[#E0F7FA] overflow-hidden font-[Poppins]">

      {/* Floating Background Glow */}
      <motion.div
        className="absolute top-[-150px] right-[-150px] w-[350px] h-[350px] bg-[#009688]/20 rounded-full blur-3xl"
        animate={{ y: [0, 30, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-150px] left-[-150px] w-[350px] h-[350px] bg-[#006F62]/20 rounded-full blur-3xl"
        animate={{ y: [0, -30, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
      />

      {/* Section Title */}
      <div className="relative z-10 text-center px-6 mb-14">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-4xl md:text-5xl font-extrabold text-[#004C45] leading-tight"
        >
          Why Choose{" "}
          <span className="text-[#009688]">Alinafe?</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto"
        >
          A modern, safe and seamless marketplace built for everyone — buyers & sellers alike.
        </motion.p>
      </div>

      {/* Feature Cards */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
            className="
              bg-white/70 backdrop-blur-lg border border-white/40 
              shadow-[0_8px_30px_rgba(0,150,136,0.15)] 
              rounded-2xl p-7 text-center cursor-pointer 
              hover:shadow-[0_12px_50px_rgba(0,150,136,0.25)] 
              transition-all
            "
          >
            <div className="flex justify-center mb-5">{item.icon}</div>
            <h3 className="text-xl font-bold text-[#006F62]">{item.title}</h3>
            <p className="text-gray-600 text-sm mt-2 leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
