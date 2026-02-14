import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, MessageSquare, HandCoins } from "lucide-react";

const tips = [
  {
    title: "Meet in Public Places",
    desc: "Always meet in well-lit, public areas like malls or cafes to ensure your safety during transactions.",
    icon: ShieldCheck,
    color: "text-[#14B8A6]",
    bg: "bg-[#E0F7F4]",
  },
  {
    title: "Chat Safely on Alinafe",
    desc: "Avoid sharing your personal contact details. Keep all your conversations within Alinafe’s chat for secure communication.",
    icon: MessageSquare,
    color: "text-[#E94F37]",
    bg: "bg-[#FFECEA]",
  },
  {
    title: "Inspect Before You Pay",
    desc: "Never send money before receiving the product. Always verify the item and the seller in person before payment.",
    icon: HandCoins,
    color: "text-[#14B8A6]",
    bg: "bg-[#E0F7F4]",
  },
];

const SafetyTips = () => {
  return (
    <section
      id="safety-tips"
      className="relative py-20 bg-gradient-to-b from-white via-[#F8FAFC] to-[#F1FBF9] overflow-hidden font-[Poppins]"
    >
      {/* Floating Glow Orbs */}
      <motion.div
        className="absolute top-0 left-0 w-80 h-80 bg-[#14B8A6]/10 rounded-full blur-3xl"
        animate={{ y: [0, 25, 0] }}
        transition={{ repeat: Infinity, duration: 10 }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-[#E94F37]/10 rounded-full blur-3xl"
        animate={{ y: [0, -25, 0] }}
        transition={{ repeat: Infinity, duration: 12 }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10">
        {/* Heading */}
        <div className="text-center mb-14">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold text-[#0E3C57] mb-4"
          >
            Stay Safe on <span className="text-[#14B8A6]">Alinafe</span>
          </motion.h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Follow these simple safety tips to make sure your buying and selling
            experience stays secure, smooth, and worry-free.
          </p>
        </div>

        {/* Tips Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {tips.map((tip, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className={`relative group p-8 rounded-3xl shadow-md hover:shadow-2xl border border-gray-100 transition-all ${tip.bg}`}
            >
              {/* Glow ring */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-br from-[#14B8A6]/10 to-[#E94F37]/10 rounded-3xl blur-xl"></div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div
                  className={`p-5 rounded-full ${tip.bg} ${tip.color} mb-5 shadow-inner`}
                >
                  <tip.icon size={42} strokeWidth={1.6} />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-[#0E3C57] mb-3">
                  {tip.title}
                </h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  {tip.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-16">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.3 }}
            onClick={() =>
              window.open("/safety-tips", "_blank", "noopener,noreferrer")
            }
            className="px-10 py-3 bg-[#14B8A6] text-white font-semibold rounded-full shadow-lg hover:bg-[#E94F37] transition-all duration-300"
          >
            Learn More Safety Tips
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default SafetyTips;
