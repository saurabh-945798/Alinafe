import React from "react";

const brands = [
  { name: "Honda", logo: "https://cdn.worldvectorlogo.com/logos/honda-4.svg" },
  { name: "Toyota", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTKkvXTksA8VS5JnYcCNfmZ8rZVfzmrQXWDw&s" },
  { name: "Samsung", logo: "https://www.svgrepo.com/show/331566/samsung.svg" },
  { name: "Apple", logo: "https://cdn.worldvectorlogo.com/logos/apple-11.svg" },
  { name: "HP", logo: "https://cdn.worldvectorlogo.com/logos/hp.svg" },
  { name: "Dell", logo: "https://cdn.worldvectorlogo.com/logos/dell-2.svg" },
  { name: "Nissan", logo: "https://cdn.worldvectorlogo.com/logos/nissan-6.svg" },
  { name: "Lenovo", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGsIeOdoR9c5RfOP61nZOK6FgMXx6y0tlzNw&s" },
];

const PopularBrands = () => {
  return (
    <section className="w-full py-16 px-6 md:px-12 font-[Poppins] bg-gradient-to-br from-white via-[#f1fffb] to-[#e0fff8]">

      {/* Heading */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#00A896] to-[#00796B] bg-clip-text text-transparent drop-shadow-sm">
          Popular Brands
        </h2>
      </div>

      {/* Smooth Horizontal Scroll */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-6 min-w-max py-4 px-2">

          {brands.map((b, i) => (
            <div
              key={i}
              className="
                w-24 h-24 rounded-full relative
                bg-gradient-to-br from-white to-[#f3fffd]
                border border-teal-200/40
                flex items-center justify-center shadow-lg
                cursor-pointer transition duration-300 
                hover:-translate-y-2 hover:scale-105
                hover:border-[#00A896] hover:shadow-[0_10px_35px_rgba(0,168,150,0.35)]
              "
            >

              {/* Outer Glow Ring */}
              <div className="
                absolute inset-0 rounded-full 
                bg-gradient-to-br from-[#00A896]/15 to-transparent
                blur-xl opacity-0 group-hover:opacity-100
                transition
              " />

              {/* Inner Shine */}
              <div className="
                absolute inset-0 rounded-full 
                bg-gradient-to-br from-white/60 to-transparent
                pointer-events-none
              " />

              {/* Logo Image */}
              <img
                src={b.logo}
                alt={b.name}
                className="
                  w-14 h-14 object-contain z-10 
                  transition-transform duration-300
                  group-hover:scale-110
                "
              />

            </div>
          ))}

        </div>
      </div>

    </section>
  );
};

export default PopularBrands;
