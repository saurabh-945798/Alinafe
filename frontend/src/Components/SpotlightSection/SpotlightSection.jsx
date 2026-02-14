import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// ⭐ Featured Spotlight Items (same as yours)
const spotlightData = [
  {
    category: "Mobiles",
    title: "iPhone 12 Pro",
    offer: "25% OFF",
    image:
      "https://www.perchtechnologies.com/wp-content/uploads/2021/06/iphone-12-Pro-Max-Gold.jpg",
  },
  {
    category: "Vehicles",
    title: "Toyota Corolla 2014",
    offer: "Hot Deal",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1100&q=80",
  },
  {
    category: "Electronics",
    title: "Sony 55” 4K Smart TV – Like New",
    offer: "Save 18%",
    image:
      "https://plus.unsplash.com/premium_photo-1664302149029-50514758ed8b?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    category: "Furniture",
    title: "Premium Wooden Sofa Set",
    offer: "Best Price",
    image:
      "https://plus.unsplash.com/premium_photo-1683121150169-4b0f6c92a3ac?q=80&w=1109&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    category: "Real Estate",
    title: "2 BHK Furnished Apartment",
    offer: "New Listing",
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    category: "Jobs",
    title: "Hiring: Office Assistant – Full Time",
    offer: "Apply Now",
    image:
      "https://images.unsplash.com/photo-1698047682091-782b1e5c6536?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    category: "Fashion",
    title: "Men’s Summer Wear Combo – Trending",
    offer: "30% OFF",
    image:
      "https://images.unsplash.com/photo-1622450180332-3da1126f10a4?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    category: "Books",
    title: "Best-Selling Novels Collection",
    offer: "Upto 40% OFF",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000&auto=format&fit=crop",
  },

  {
    category: "Pets",
    title: "Golden Retriever Puppies – Healthy & Vaccinated",
    offer: "Limited Stock",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9nc3xlbnwwfHwwfHx8MA%3D%3D",
  },

  {
    category: "Services",
    title: "Home Cleaning & Repair Services",
    offer: "Book Now",
    image:
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const SpotlightSection = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full py-12 font-[Poppins] bg-white">

      <h2 className="text-2xl md:text-4xl font-bold text-[#006F62] px-6 mb-6">
        Featured Deals 
      </h2>

      <div className="flex gap-6 overflow-x-auto px-6 hide-scrollbar scroll-smooth">

        {spotlightData.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}

            // ⭐ FIXED NAVIGATION — category ko direct pass kar rahe hain!
            onClick={() => navigate(`/category/${item.category}`)}

            className="
              relative cursor-pointer rounded-2xl overflow-hidden 
              min-w-[280px] min-h-[280px]
              md:min-w-[330px] md:min-h-[330px]
              lg:min-w-[360px] lg:min-h-[360px]
              shadow-md bg-gray-100 group
            "
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

            <div className="absolute bottom-4 left-4 text-white space-y-1 z-10">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium">
                {item.category}
              </span>

              <h3 className="text-xl md:text-2xl font-bold">{item.title}</h3>

              <p className="text-sm font-semibold text-teal-300">{item.offer}</p>
            </div>

          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SpotlightSection;
