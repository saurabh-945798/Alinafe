//  design navbar  - 1 


import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Bookmark,
  MessageSquare,
  Menu,
  X,
  Search,
  PlusCircle,
  LogOut,
  User,
  Home,
  Layers,
  Info,
  Phone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import SearchBar from "../SearchBar/SearchBar.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const go = (path) => {
    setDropdownOpen(false);
    setSidebarOpen(false);
    navigate(path);
  };

  /* =========================
     SCROLL EFFECT
  ========================= */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* =========================
     LOGOUT
  ========================= */
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  /* =========================
     AVATAR
  ========================= */
  const getAvatar = () => {
    if (user?.photoURL)
      return (
        <img
          src={user.photoURL}
          alt="User"
          className="w-10 h-10 rounded-full object-cover border border-[#0E9F9F]/30 shadow-sm"
        />
      );
    const letter = (user?.name || user?.displayName || user?.email || "U").charAt(0);
    return (
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0E9F9F] text-white font-semibold shadow-sm">
        {letter}
      </div>
    );
  };

  return (
    <>
      {/* ================= TOP NAVBAR ================= */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`fixed top-0 w-full z-50 border-b ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-md"
            : "bg-white/95"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* LOGO */}
          <div
            onClick={() => navigate("/")}
            className="cursor-pointer select-none"
          >
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-[#0E9F9F] to-[#0B7F7F] bg-clip-text text-transparent">
              Alinafe
            </h1>
            <p className="text-xs font-semibold text-[#E94F37] -mt-1">
              Buy • Sell • Connect
            </p>
          </div>

          {/* DESKTOP SEARCH */}
          <div className="hidden md:flex flex-1 justify-center px-6">
            <SearchBar />
          </div>

          {/* DESKTOP RIGHT */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-[#0E9F9F] font-semibold"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-[#0E9F9F] text-white px-4 py-2 rounded-full shadow hover:bg-[#00796B]"
                >
                  Join Now
                </button>
              </>
            ) : (
              <>
                {[
                  { Icon: Bookmark, path: "/dashboard/favorites", label: "Favorites" },
                  { Icon: MessageSquare, path: "/chats", label: "Chat" },
                  { Icon: Bell, path: "/dashboard", label: "Updates" },
                ].map(({ Icon, path, label }) => (
                  <button
                    key={label}
                    onClick={() => go(path)}
                    title={label}
                    className="p-2 rounded-full bg-[#0E9F9F]/10 text-[#0E9F9F]"
                  >
                    <Icon size={18} />
                  </button>
                ))}

                <div className="relative">
                  <button onClick={() => setDropdownOpen(!dropdownOpen)}>
                    {getAvatar()}
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-12 bg-white rounded-xl shadow-xl w-48 overflow-hidden"
                      >
                        <ul className="text-sm">
                          <li
                            onClick={() => go("/dashboard")}
                            className="px-4 py-3 hover:bg-[#0E9F9F]/10 cursor-pointer flex gap-2"
                          >
                            <User size={16} /> Dashboard
                          </li>
                          <li
                            onClick={() => go("/dashboard/my-ads")}
                            className="px-4 py-3 hover:bg-[#0E9F9F]/10 cursor-pointer flex gap-2"
                          >
                            <Bookmark size={16} /> My Ads
                          </li>
                          <li
                            onClick={handleLogout}
                            className="px-4 py-3 text-red-500 hover:bg-red-50 cursor-pointer flex gap-2"
                          >
                            <LogOut size={16} /> Logout
                          </li>
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={() => go("/dashboard/createAd")}
                  className="flex items-center gap-2 bg-[#0E9F9F] text-white px-5 py-2.5 rounded-full shadow-md"
                >
                  <PlusCircle size={20} />
                  Sell
                </button>
              </>
            )}
          </div>

          {/* MOBILE ICONS */}
          <div className="md:hidden flex items-center gap-4">
            <Search
              size={22}
              className="text-[#0E9F9F]"
              onClick={() => setMobileSearchOpen(true)}
            />
            <Menu
              size={26}
              className="text-[#0E9F9F]"
              onClick={() => setSidebarOpen(true)}
            />
          </div>
        </div>
      </motion.nav>

      {/* ================= MOBILE SEARCH OVERLAY ================= */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setMobileSearchOpen(false)}
            />

            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 w-full z-50 bg-white shadow-xl px-4 pt-4 pb-6"
            >
              <div className="flex justify-between items-center mb-4">
                <p className="font-semibold text-[#0E9F9F]">
                  Search on Alinafe
                </p>
                <X onClick={() => setMobileSearchOpen(false)} />
              </div>

              <SearchBar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ================= SIDE DRAWER ================= */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setSidebarOpen(false)}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-6">
                  {getAvatar()}
                  <div>
                    <p className="font-semibold text-[#0E9F9F]">
                      {user?.name || user?.displayName || "Guest User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user ? user.email : "Not logged in"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 text-gray-700">
                  <button onClick={() => go("/")} className="flex gap-2">
                    <Home size={18} /> Home
                  </button>
                  <button onClick={() => go("/all-ads")} className="flex gap-2">
                    <Layers size={18} /> Categories
                  </button>
                  <button onClick={() => go("/about")} className="flex gap-2">
                    <Info size={18} /> About
                  </button>
                  <button onClick={() => go("/contact")} className="flex gap-2">
                    <Phone size={18} /> Contact
                  </button>
                </div>
              </div>

              <div className="border-t pt-4">
                {user ? (
                  <>
                    <button
                      onClick={() => go("/dashboard")}
                      className="w-full bg-[#0E9F9F]/10 text-[#0E9F9F] py-2 rounded-full"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => go("/dashboard/createAd")}
                      className="w-full bg-[#0E9F9F] text-white py-2 rounded-full mt-2"
                    >
                      + Sell Item
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-red-500 mt-2 py-2 rounded-full hover:bg-red-50 flex gap-2 justify-center"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => go("/login")}
                    className="w-full bg-[#0E9F9F] text-white py-2 rounded-full"
                  >
                    Login / Signup
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ================= BOTTOM MOBILE NAV ================= */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t shadow-lg z-50 px-4 py-2">
        <div className="flex justify-between">
          <button onClick={() => navigate("/")} className="flex flex-col items-center text-[#0E9F9F]">
            <Home size={22} />
            <span className="text-xs">Home</span>
          </button>
          <button onClick={() => navigate("/all-ads")} className="flex flex-col items-center">
            <Layers size={22} />
            <span className="text-xs">Categories</span>
          </button>
          <button
            onClick={() => navigate("/dashboard/createAd")}
            className="flex flex-col items-center bg-[#0E9F9F] text-white px-4 py-2 rounded-full -mt-6 shadow-lg"
          >
            <PlusCircle size={24} />
          </button>
          <button onClick={() => navigate("/chats")} className="flex flex-col items-center">
            <MessageSquare size={22} />
            <span className="text-xs">Chat</span>
          </button>
          <button onClick={() => navigate(user ? "/dashboard" : "/login")} className="flex flex-col items-center">
            <User size={22} />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
