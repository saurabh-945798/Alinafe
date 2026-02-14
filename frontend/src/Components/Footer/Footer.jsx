import React from "react";
import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-white via-[#F8FAFC] to-[#E8FFFA] text-[#0E3C57] pt-16 pb-8 overflow-hidden font-[Poppins]">
      {/* Floating background glows */}
      <motion.div
        className="absolute -top-20 left-0 w-72 h-72 bg-[#14B8A6]/15 rounded-full blur-3xl"
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-80 h-80 bg-[#E94F37]/15 rounded-full blur-3xl"
        animate={{ y: [0, -25, 0] }}
        transition={{ repeat: Infinity, duration: 10 }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10">
        {/* Top Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* 1️⃣ Brand Info */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-3 text-[#14B8A6]">Alinafe</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-5">
              Empowering Local Exchange — your trusted Indian marketplace to buy
              and sell safely with verified users near you.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="p-2 bg-[#14B8A6]/10 rounded-full hover:bg-[#14B8A6]/20 transition"
              >
                <Facebook size={18} className="text-[#14B8A6]" />
              </a>
              <a
                href="#"
                className="p-2 bg-[#14B8A6]/10 rounded-full hover:bg-[#14B8A6]/20 transition"
              >
                <Twitter size={18} className="text-[#14B8A6]" />
              </a>
              <a
                href="#"
                className="p-2 bg-[#14B8A6]/10 rounded-full hover:bg-[#14B8A6]/20 transition"
              >
                <Instagram size={18} className="text-[#14B8A6]" />
              </a>
            </div>
          </motion.div>

          {/* 2️⃣ Quick Links (OPEN IN NEW TAB) */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="font-semibold text-lg mb-3 text-[#0E3C57]">
              Quick Links
            </h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>
                <a
                  href="/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#14B8A6] transition"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#14B8A6] transition"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#14B8A6] transition"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#14B8A6] transition"
                >
                  Contact Support
                </a>
              </li>
            </ul>
          </motion.div>

          {/* 3️⃣ Popular Categories (same tab as before) */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="font-semibold text-lg mb-3 text-[#0E3C57]">
              Popular Categories
            </h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>
                <Link
                  to="/category/Mobiles"
                  className="hover:text-[#14B8A6] transition"
                >
                  Mobile Phones & Tablets
                </Link>
              </li>
              <li>
                <Link
                  to="/category/Electronics"
                  className="hover:text-[#14B8A6] transition"
                >
                  Electronics
                </Link>
              </li>
              <li>
                <Link
                  to="/category/Vehicles"
                  className="hover:text-[#14B8A6] transition"
                >
                  Vehicles
                </Link>
              </li>
              <li>
                <Link
                  to="/category/Furniture"
                  className="hover:text-[#14B8A6] transition"
                >
                  Home & Furniture
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* 4️⃣ Contact Info */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9 }}
          >
            <h3 className="font-semibold text-lg mb-3 text-[#0E3C57]">
              Contact Us
            </h3>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[#14B8A6] mt-0.5" />
                <span>
                  A 502, Shipra Krishna Vista,
                  <br />
                  Ahinsa Khand, Indirapuram, Ghaziabad
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-[#14B8A6]" />
                support@alinafe.in
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-[#14B8A6]" />
                +91 8920679937
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-6" />

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="text-[#14B8A6] font-semibold">
              Alinafe India
            </span>
            . All rights reserved.
          </p>

           
        </div>
      </div>
    </footer>
  );
};

export default Footer;
