import React from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Gavel,
  ShoppingCart,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

const domains = [
  {
    name: "ALINAFE.in",
    tagline: "Next-Gen Indian Marketplace Brand",
    price: "Auction",
    type: "auction",
    featured: true,
  },
  {
    name: "Zitheke.com",
    tagline: "Global C2C Marketplace Ready Brand",
    price: "$2,000",
    type: "buy",
  },
  {
    name: "ShopVerse.in",
    tagline: "Perfect for E-Commerce Startup",
    price: "Auction",
    type: "auction",
  },
];

const DomainAuctionSection = () => {
  return (
    <section className="relative py-28 bg-gradient-to-br from-white via-[#ECFEFF] to-[#F0FDFA] overflow-hidden font-[Poppins]">
      {/* ambient glows */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#14B8A6]/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#0D9488]/20 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-bold text-[#0F766E] mb-6 tracking-tight">
            Premium Domains Marketplace
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Own a high-impact digital identity. Hand-picked domains ideal for
            startups, marketplaces & serious founders.
          </p>
        </motion.div>

        {/* cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {domains.map((d, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 180 }}
              className={`relative rounded-[28px] p-8 backdrop-blur-xl
              ${
                d.featured
                  ? "bg-white border border-[#14B8A6] shadow-[0_30px_80px_rgba(20,184,166,0.25)]"
                  : "bg-white/80 border border-gray-200 shadow-xl"
              }`}
            >
              {/* featured badge */}
              {d.featured && (
                <div className="absolute -top-4 left-6 flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white text-xs rounded-full shadow-lg">
                  <Sparkles size={14} />
                  Featured Domain
                </div>
              )}

              {/* domain */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#E6FFFA] flex items-center justify-center">
                  <Globe className="text-[#0F766E]" />
                </div>
                <h3 className="text-3xl font-semibold text-[#0F766E] tracking-tight">
                  {d.name}
                </h3>
              </div>

              {/* description */}
              <p className="text-gray-600 mb-10">{d.tagline}</p>

              {/* price */}
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Price
                  </p>
                  <p className="text-2xl font-bold text-[#0F766E]">
                    {d.price}
                  </p>
                </div>

                {d.type === "auction" && (
                  <span className="text-xs px-3 py-1 rounded-full bg-[#E6FFFA] text-[#0F766E]">
                    Live Auction
                  </span>
                )}
              </div>

              {/* CTA */}
              {d.type === "auction" ? (
                <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition">
                  <Gavel size={18} />
                  Place a Bid
                </button>
              ) : (
                <button className="w-full py-3.5 rounded-xl border-2 border-[#14B8A6] text-[#0F766E] font-semibold flex items-center justify-center gap-2 hover:bg-[#E6FFFA] transition">
                  <ShoppingCart size={18} />
                  Buy Now
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-24 text-center"
        >
          <p className="text-gray-600 mb-6 text-lg">
            Want to sell or auction your premium domain on Alinafe?
          </p>
          <button className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-[#0F766E] text-white font-semibold shadow-xl hover:scale-105 transition">
            Submit Your Domain
            <ArrowUpRight size={18} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default DomainAuctionSection;
