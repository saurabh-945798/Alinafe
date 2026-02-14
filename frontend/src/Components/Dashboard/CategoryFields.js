const CATEGORY_FIELDS = {
  /* =========================
     REAL ESTATE (unchanged)
  ========================= */
  "Real Estate": [
    { name: "bedrooms", placeholder: "Bedrooms" },
    { name: "bathrooms", placeholder: "Bathrooms" },
    { name: "area", placeholder: "Area (sq.ft)" },
    { name: "furnishing", placeholder: "Furnishing" },
  ],

  /* =========================
     VEHICLES (unchanged)
  ========================= */
  Vehicles: [
    { name: "brand", placeholder: "Brand" },
    { name: "color", placeholder: "Color" },
    { name: "year", placeholder: "Model Year" },
    { name: "mileage", placeholder: "Mileage (KM)" },
    {
      name: "fuelType",
      placeholder: "Fuel Type",
      type: "select",
      options: ["Petrol", "Diesel", "Electric", "CNG", "Hybrid"],
    },
  ],

  /* =========================
     MOBILES
  ========================= */
  Mobiles: [
    { name: "brand", placeholder: "Brand" },
    { name: "model", placeholder: "Model Name" },
    { name: "color", placeholder: "Color" },
    { name: "storage", placeholder: "Storage (64GB / 128GB)" },
    { name: "warranty", placeholder: "Warranty" },
  ],

  /* =========================
     ELECTRONICS (unchanged)
  ========================= */
  Electronics: [
    { name: "brand", placeholder: "Brand" },
    { name: "model", placeholder: "Model" },
    { name: "color", placeholder: "Color" },
    { name: "warranty", placeholder: "Warranty" },
    { name: "conditionNote", placeholder: "Additional Info" },
  ],

  /* =========================
     FURNITURE
  ========================= */
  Furniture: [
    { name: "material", placeholder: "Material (Wood / Metal / Plastic)" },
    { name: "brand", placeholder: "Brand" },
    { name: "color", placeholder: "Color" },
    { name: "dimensions", placeholder: "Dimensions (LA-WA-H)" },
  ],

  /* =========================
     SPORTS
  ========================= */
  Sports: [
    { name: "sportType", placeholder: "Sport Type (Cricket, Football)" },
    { name: "brand", placeholder: "Brand" },
     { name: "color", placeholder: "Color" },
  ],

  /* =========================
     FASHION
  ========================= */
  Fashion: [
    { name: "size", placeholder: "Size (S / M / L / XL)" },
    { name: "color", placeholder: "Color" },
    { name: "brand", placeholder: "Brand" },
    { name: "material", placeholder: "Material (Cotton, Denim)" },
  ],

  /* =========================
     BOOKS
  ========================= */
  Books: [
    { name: "author", placeholder: "Author Name" },
    { name: "publisher", placeholder: "Publisher" },
    { name: "edition", placeholder: "Edition / Year" },
    { name: "language", placeholder: "Language" },
  ],

  /* =========================
     PETS
  ========================= */
  Pets: [
    { name: "petType", placeholder: "Pet Type (Dog, Cat)" },
    { name: "breed", placeholder: "Breed" },
    { name: "age", placeholder: "Age (Months / Years)" },
    {
      name: "vaccinated",
      placeholder: "Vaccinated",
      type: "select",
      options: ["Yes", "No"],
    },
  ],
};

export default CATEGORY_FIELDS;
