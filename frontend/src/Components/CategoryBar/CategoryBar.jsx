
// Purana code yaha se design -1 

import React, { useState } from "react";
import { ChevronDown, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// ⭐ FINAL REFINED CATEGORY STRUCTURE
const categories = {
  Mobiles: [
    "Mobile Phones",
    "Tablets",
    "Smart Watches",
    "Mobile Accessories",
  ],

  Vehicles: [
    "Cars",
    "Bikes",
    "Scooters",
    "Bicycles",
    "Electric Bikes",
    "Pickups",
    "Spare Parts",
    "Vehicle Accessories",
  ],

  Electronics: [
    "Computers & Laptops",
    "Computer Accessories",
    "Gaming Consoles & Accessories",
    "TVs & Home Entertainment",
    "Cameras & Lenses",
    "Smart Watches & Wearables",
    "Speakers & Headphones",
    "Kitchen Appliances",
    "Home Appliances",
    "Refrigerators",
    "Washing Machines",
    "ACs & Coolers",
    "Printers, Monitors & Hard Disks",
    "Smart Home Devices"
  ],

  "Real Estate": [
    "For Sale: Houses & Apartments",
    "For Rent: Houses & Apartments",
    "Lands & Plots",
    "For Rent: Shops & Offices",
    "For Sale: Shops & Offices",
    "PG & Guest Houses",
  ],

  "Furniture": [
    "Beds",
    "Sofas",
    "Tables & Chairs",
    "Wardrobes",
    "Lights",
  ],

  Fashion: [
    "Men",
    "Women",
    "Footwear",
    "Watches",
    "Bags",
  ],

  Services: [
    "Plumber",
    "Electrician",
    "Carpentry Services",
    "AC Repair & Services",
    "Refrigerator Repair",  
    "Washing Machine Repair",
    "Painter",
    "Home Cleaning",
    "Pest Control",
    "Packers & Movers",
    "Driver Services",
    "Computer & Laptop Repair",
    "Mobile Repair",
    "Tutoring & Classes",
    "Fitness Trainer",
    "Beauty & Salon Services",
    "CCTV Installation & Repair",
    "Interior Design & Renovation",
    "Event & Wedding Services",
    "Travel & Tour Services",
  ],
  
 
  

  Sports: [
    "Cricket Equipment",
    "Football Gear",
    "Badminton & Tennis",
    "Gym & Fitness Equipment",
    "Cycling",
    "Skating & Skateboards",
    "Swimming Gear",
    "Sportswear & Jerseys",
    "Yoga & Meditation Items",
    "Boxing & Martial Arts",
    "Camping & Trekking Gear",
    "Indoor Games (Chess, Carrom, etc.)",
  ],
  
  Pets: [
    "Dogs",
    
  ],

  Jobs: [
    "Delivery Jobs",
    "Driver Jobs",
    "Data Entry Jobs",
    "Office Assistant",
    "Sales & Marketing",
    "Retail / Store Staff",
    "Hotel & Restaurant Jobs",
    "Cook / Chef",
    "Housekeeping",
    "Telecaller / BPO",
    "Teacher / Tutor",
    "Accountant",
   
  ]
  
  
  };


// ⭐ POPULAR CATEGORIES
const categoryCards = [
  { title: "Mobiles & Tablets", route: "Mobiles", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80" },
  { title: "Vehicles", route: "Vehicles", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80" },
  { title: "Electronics", route: "Electronics", image: "https://plus.unsplash.com/premium_photo-1760531742626-eaf6b956f320?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { title: "Real Estate", route: "Real-Estate", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80" },
  { title: "Furniture & Home Decor", route: "Furniture", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800" },
  { title: "Fashion & Accessories", route: "Fashion", image: "https://images.unsplash.com/photo-1586878341523-7acb55eb8c12?q=80" },
  { title: "Sports & Fitness", route: "Sports", image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80" },
  { title: "Pets & Pet Care", route: "Pets", image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80" },
   { title: "Services", route: "Services", image: "https://plus.unsplash.com/premium_photo-1663090140645-32b7d760853e?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },

];

export default function ProductCategories() {
  const [openCategory, setOpenCategory] = useState(null);
  const [drawer, setDrawer] = useState(false);

  const navigate = useNavigate();

  const categoryList = Object.keys(categories);

  // Convert Category → URL route
  const convertToRoute = (name) =>
    name.replace(/ & /g, "-").replace(/ /g, "-");

  return (
    <div className="px-4 md:px-10 py-8">

      {/* MOBILE DRAWER BUTTON */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setDrawer(true)}
          className="flex items-center gap-2 bg-[#009688] text-white px-4 py-2 rounded-lg shadow-md"
        >
          <Menu size={20} /> Browse Categories
        </button>
      </div>

      <div className="flex gap-8 flex-col md:flex-row">

        {/* LEFT SIDEBAR */}
        <div className="hidden md:block w-1/4 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-fit">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#009688]"></span>
            Categories
          </h3>

          <div className="space-y-2">
            {categoryList.map((cat, idx) => (
              <div key={idx}>
                
                {/* MAIN CATEGORY */}
                <button
                  onClick={() =>
                    setOpenCategory(openCategory === cat ? null : cat)
                  }
                  className={`w-full text-left flex justify-between items-center py-2.5 px-4 rounded-xl border-l-4 transition 
                    ${
                      openCategory === cat
                        ? "border-[#009688] bg-[#E0F2F1]"
                        : "border-transparent hover:bg-gray-50"
                    }
                  `}
                >
                  <span
                    className={`text-sm font-medium ${
                      openCategory === cat ? "text-[#009688]" : "text-gray-700"
                    }`}
                  >
                    {cat}
                  </span>

                  <ChevronDown
                    size={16}
                    className={`transition ${
                      openCategory === cat ? "rotate-180 text-[#009688]" : ""
                    }`}
                  />
                </button>

                {/* SUBCATEGORIES */}
                {openCategory === cat && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="ml-6 mt-2 space-y-1 pb-2"
                  >
                    {categories[cat].map((sub, i) => (
                      <p
                        key={i}
                        onClick={() =>
                          navigate(
                            `/category/${convertToRoute(cat)}?sub=${encodeURIComponent(sub)}`
                          )
                        }
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#009688] cursor-pointer"
                      >
                        <span className="w-1.5 h-1.5 bg-[#009688] rounded-full"></span>
                        {sub}
                      </p>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* MOBILE DRAWER OVERLAY */}
        {drawer && (
          <div
            className="fixed inset-0 bg-black/40 md:hidden z-20"
            onClick={() => setDrawer(false)}
          ></div>
        )}

        {/* MOBILE CATEGORY DRAWER */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: drawer ? 0 : "-100%" }}
          transition={{ type: "tween", duration: 0.25 }}
          className="fixed top-0 left-0 w-64 h-full bg-white shadow-xl p-6 md:hidden z-30 overflow-y-auto"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Categories</h3>

          {categoryList.map((cat, idx) => (
            <div key={idx} className="mb-2">
              <button
                onClick={() =>
                  setOpenCategory(openCategory === cat ? null : cat)
                }
                className="w-full flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-50"
              >
                <span className="text-sm">{cat}</span>
                <ChevronDown
                  size={16}
                  className={openCategory === cat ? "rotate-180" : ""}
                />
              </button>

              {openCategory === cat && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="ml-4 mt-1 space-y-1 pb-2"
                >
                  {categories[cat].map((sub, i) => (
                    <p
                      key={i}
                      onClick={() =>
                        navigate(
                          `/category/${convertToRoute(cat)}?sub=${encodeURIComponent(sub)}`
                        )
                      }
                      className="text-sm text-gray-600 hover:text-[#009688] cursor-pointer"
                    >
                      {sub}
                    </p>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </motion.div>

        {/* POPULAR CATEGORY CARDS */}
        <div className="w-full md:w-3/4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-center text-xl font-semibold text-gray-800">
            Popular Categories
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {categoryCards.map((cat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate(`/category/${cat.route}`)}
                className="relative rounded-xl overflow-hidden shadow-md cursor-pointer bg-gray-100"
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-40 md:h-48 object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="text-lg font-semibold">{cat.title}</h4>
                  <p className="text-sm opacity-90">Explore →</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}











