// src/components/Home/HowItWorks.jsx
import React from "react";
import { motion } from "framer-motion";
import { Upload, MessageCircle, Handshake, ShieldCheck } from "lucide-react";

const steps = [
  {
    id: 1,
    icon: <Upload size={40} />,
    title: "Post Your Ad",
    desc: "Upload product photos, set your price, and describe your item in seconds.",
  },
  {
    id: 2,
    icon: <MessageCircle size={40} />,
    title: "Connect with Buyers",
    desc: "Chat instantly with interested buyers using our secure in-app chat.",
  },
  {
    id: 3,
    icon: <Handshake size={40} />,
    title: "Meet & Finalize",
    desc: "Fix a meeting or use delivery partners to close your safe, local deal.",
  },
  {
    id: 4,
    icon: <ShieldCheck size={40} />,
    title: "Verified & Secure",
    desc: "Trade confidently with verified users and AI fraud detection.",
  },
];

const HowItWorks = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-[#E8FDFB] via-[#E0F7FA] to-[#D1F4EF] overflow-hidden font-[Poppins]">
      {/* Background Motion Glow */}
      <motion.div
        className="absolute -top-28 left-0 w-80 h-80 bg-[#2DB7A3]/20 rounded-full blur-3xl"
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 10 }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-80 h-80 bg-[#0E3C57]/15 rounded-full blur-3xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 12 }}
      />

      <div className="relative max-w-7xl mx-auto px-6 text-center">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-[#0E3C57] mb-6"
        >
          How It Works
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-gray-600 max-w-4xl mx-auto mb-14 text-left"
        >
          A simple, secure and transparent process to help you buy or sell anything locally with confidence.
        </motion.p>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="group relative bg-white/80 backdrop-blur-xl border border-[#E0F2F1]/60 shadow-xl hover:shadow-2xl rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2"
            >
              {/* Glow Border Animation */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#2DB7A3] to-[#0E3C57] opacity-0 group-hover:opacity-20 transition-opacity"></div>

              {/* Icon Circle */}
              <div className="mx-auto mb-6 w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-[#2DB7A3] to-[#0E3C57] text-white shadow-lg">
                {step.icon}
              </div>

              <h3 className="text-xl font-semibold text-[#0E3C57] mb-3">{step.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
