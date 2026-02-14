import React from "react";
import { Search } from "lucide-react";

const items = [
  "Cars Under 5 Lakhs",
  "1BHK Houses Near You",
  "Second-hand Laptops",
  "Mobile Phones",
  "Bikes & Scooters",
  "Agriculture Tools",
  "Home Appliances",
  "Jobs in Your City",
  "Fashion & Beauty",
  "Real Estate Deals",
];

const PopularSearches = () => {
  return (
    <section className="w-full py-16 px-6 md:px-12 font-[Poppins] bg-gradient-to-br from-white via-[#f4fffd] to-[#e7fffb]">
      
      {/* Heading */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#00A896] to-[#00796B] bg-clip-text text-transparent drop-shadow-sm">
          Popular Searches
        </h2>
        <p className="text-gray-600 mt-3 md:text-lg">
          Explore the most searched categories on Alinafe
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {items.map((item, i) => (
          <div
            key={i}
            className="
              group flex items-center gap-3 px-5 py-4 rounded-2xl cursor-pointer 
              bg-white/60 backdrop-blur-xl border border-teal-100 
              shadow-[0_2px_10px_rgba(0,0,0,0.06)]
              transition transform duration-300 
              hover:-translate-y-2 hover:shadow-[0_10px_28px_rgba(0,168,150,0.25)]
              hover:border-[#00A896]
            "
          >
            {/* Icon */}
            <div
              className="
                w-9 h-9 flex items-center justify-center rounded-xl 
                bg-gradient-to-br from-[#00A896] to-[#00796B]
                text-white shadow-md group-hover:scale-110 transition
              "
            >
              <Search className="w-4 h-4" />
            </div>

            {/* Text */}
            <span className="text-sm font-medium text-gray-700 group-hover:text-[#00796B] transition">
              {item}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularSearches;
