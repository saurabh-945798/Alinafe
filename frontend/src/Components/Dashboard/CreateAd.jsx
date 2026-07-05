import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../api/axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import CreateAdForm from "./CreateAdForm";

const CreateAd = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  // 🎥 VIDEO STATE
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subcategories, setSubcategories] = useState({});

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    subcategory: "",

    price: "",
    negotiable: false,
    condition: "Used",

    city: "",
    state: "",
    location: "",
    deliveryAvailable: false,

    // ===== REAL ESTATE =====
    bedrooms: "",
    bathrooms: "",
    area: "",
    furnishing: "",
    floorNumber: "",
    totalFloors: "",
    parking: "",
    washroom: "",
    roomType: "",
    plotArea: "",
    plotType: "",
    facing: "",

    // ===== VEHICLES =====
    brand: "",
    year: "",
    mileage: "",
    fuelType: "",
    partName: "",
    partCategory: "",
    originalType: "",
    workingStatus: "",
    accessoryType: "",
    vehicleType: "",
    accessoryCondition: "",
    

    // ===== ELECTRONICS =====
    model: "",
    warranty: "",
    conditionNote: "",

    // ===== FASHION =====
    size: "",
    color: "",

    // ===== JOBS =====
    salary: "",
    jobType: "",
    experience: "",
    company: "",

    // ===== PETS =====
    petType: "",
    breed: "",
    age: "",
    vaccinated: "",

    // ===== SERVICES =====
    serviceType: "",
    availability: "",
    serviceArea: "",

    // ===== DIGITAL =====
    fileType: "",
    accessType: "",

  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        const categories = res.data?.categories || [];

        setCategoryOptions(categories.map((category) => category.name).filter(Boolean));

        const subcategoryMap = categories.reduce((acc, category) => {
          acc[category.name] = (category.subcategories || [])
            .map((subcategory) => subcategory.name)
            .filter(Boolean);
          return acc;
        }, {});

        setSubcategories(subcategoryMap);
      } catch (error) {
        console.error("Failed to load public categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const categoryList = useMemo(() => categoryOptions, [categoryOptions]);

  // ✅ Conditional displays
  // ✅ REAL WORLD CONDITIONS (FIXED)
  const showCondition = !["Real Estate", "Jobs", "Services", "Pets"].includes(
    form.category
  );

  const showDelivery = !["Real Estate", "Jobs", "Services"].includes(
    form.category
  );

  // ❌ salary sirf nahi, poora job section aayega
  const showSalary = form.category === "Jobs";

  const showBedrooms = form.category === "Real Estate";
  const showMileage = form.category === "Vehicles";
  const showBrand = ["Electronics", "Mobiles"].includes(form.category);
  const showFashionExtras = form.category === "Fashion";

  const showQuantity = ["Agriculture", "Business Industry"].includes(
    form.category
  );
  const showDigitalExtras = form.category === "Digital Products";

  const CATEGORY_RESET_MAP = {
    "Real Estate": {
      bedrooms: "",
      bathrooms: "",
      area: "",
      furnishing: "",
      floorNumber: "",
      totalFloors: "",
      parking: "",
      washroom: "",
      roomType: "",
      plotArea: "",
      plotType: "",
      facing: "",
    },

    Vehicles: {
      brand: "",
      color: "",
      year: "",
      mileage: "",
      fuelType: "",
      partName: "",
      fitsCarBrand: "",
      fitsCarModel: "",
      fitsFromYear: "",
      fitsToYear: "",
      partCategory: "",
      originalType: "",
      workingStatus: "",
      accessoryType: "",
      vehicleType: "",
      accessoryCondition: "",
    },

    Electronics: {
      brand: "",
      model: "",
      color: "",
      warranty: "",
      conditionNote: "",
    },

    Mobiles: {
      brand: "",
      model: "",
      color: "",
      warranty: "",
      accessoryType: "",
    },

    Fashion: {
      size: "",
      color: "",
    },



    Furniture: {
      brand: "",
      material: "",
      color: "",
      conditionNote: "",
    },

    Sports: {
      brand: "",
      conditionNote: "",
    },

    Books: {
      author: "",
      conditionNote: "",
    },

    Jobs: {
      salary: "",
      jobType: "",
      experience: "",
      company: "",
    },

    Pets: {
      petType: "",
      breed: "",
      age: "",
      vaccinated: "",
    },

    Services: {
      serviceType: "",
      availability: "",
      serviceArea: "",
    },

    "Digital Products": {
      fileType: "",
      accessType: "",
    },

  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => {
      // base update
      let updatedForm = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      // 🔥 category change handling
      if (name === "category") {
        const previousCategory = prev.category;
        const resetFields = CATEGORY_RESET_MAP[previousCategory] || {};

        updatedForm = {
          ...updatedForm,
          subcategory: "",
          price: "",
          condition: "Used",
          deliveryAvailable: false,
          ...resetFields, // 🔥 purge old category data
        };
      }

      return updatedForm;
    });
  };

  const handleFileChange = (e) => {
    const fileList = Array.from(e.target.files);
    if (fileList.length + files.length > 5) {
      Swal.fire(
        "Limit Exceeded",
        "You can upload up to 5 images only.",
        "warning"
      );
      return;
    }
    setFiles([...files, ...fileList]);
    setPreview([...preview, ...fileList.map((f) => URL.createObjectURL(f))]);
  };

  const MAX_VIDEO_SIZE = 30 * 1024 * 1024; // 30MB

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // ❌ Size check
    if (file.size > MAX_VIDEO_SIZE) {
      Swal.fire(
        "Video too large",
        "Please upload a video under 30MB",
        "warning"
      );
      e.target.value = "";
      return;
    }
  
    // ❌ Duration check
    const video = document.createElement("video");
    video.preload = "metadata";
  
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
  
      if (video.duration > 30) {
        Swal.fire(
          "Video too long",
          "Video duration must be 30 seconds or less",
          "warning"
        );
        return;
      }
  
      // ✅ Safe to set
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    };
  
    video.src = URL.createObjectURL(file);
  };
  

  const handleRemoveImage = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    setPreview(preview.filter((_, i) => i !== index));
  };

  // ✅ Validation (Updated & Backend-safe)
  const validateStep = (targetStep = step) => {
    // STEP 1 — BASIC INFO
    if (targetStep === 1) {
      if (!form.title || form.title.trim().length < 5) {
        Swal.fire(
          "Invalid Title",
          "Title must be at least 5 characters long.",
          "warning"
        );
        return false;
      }

      if (!form.description || form.description.trim().length < 10) {
        Swal.fire(
          "Invalid Description",
          "Description must be at least 10 characters long.",
          "warning"
        );
        return false;
      }

      if (!form.category) {
        Swal.fire("Missing Category", "Please select a category.", "warning");
        return false;
      }
    }

    // STEP 2 — PRICE & MEDIA
    else if (targetStep === 2) {
      if (!showSalary) {
        if (!form.price || Number(form.price) <= 0) {
          Swal.fire(
            "Invalid Price",
            "Please enter a valid price greater than 0.",
            "warning"
          );
          return false;
        }
      }

      if (files.length === 0) {
        Swal.fire(
          "Missing Images",
          "Please upload at least one image.",
          "warning"
        );
        return false;
      }
    }

    return true;
  };

  const validateLocation = () => {
    if (!form.city || form.city.trim().length < 2) {
      Swal.fire("Invalid City", "Please enter a valid city name.", "warning");
      return false;
    }

    if (!form.location || form.location.trim().length < 3) {
      Swal.fire("Invalid Location", "Please enter a valid location.", "warning");
      return false;
    }

    return true;
  };


  const handleNext = () => validateStep(step) && setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateLocation()) return;

    const formData = new FormData();
    formData.append("ownerUid", user.uid);
    formData.append("ownerName", user.displayName || user.name || "Unknown");
    formData.append("ownerEmail", user.email || "");
    formData.append("ownerPhone", user.phoneNumber || "");

    // 1️⃣ clone form
    const payload = { ...form };

    // 2️⃣ Jobs normalization
    if (payload.category === "Jobs") {
      payload.price = payload.salary; // salary → price
      payload.condition = "Not Applicable"; // safe default
    }

    // 3️⃣ append cleaned payload
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    files.forEach((file) => formData.append("images", file));

    if (videoFile) {
      formData.append("video", videoFile);
    }

    setUploading(true);

    try {
      await api.post("/ads/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        
      });


      Swal.fire({
        title: "Ad Submitted for Review!",
        text: "Your ad is pending admin approval.",
        icon: "success",
        timer: 2500,
        showConfirmButton: false,
      });

      navigate("/dashboard/my-ads");
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to post ad.",
        "error"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex bg-[#F9FAFB] min-h-screen font-[Poppins]">
      {/* <Sidebar /> */}

      <CreateAdForm
        step={step}
        setStep={setStep}
        uploading={uploading}
        form={form}
        preview={preview}
        categoryOptions={categoryList}
        subcategories={subcategories}
        showDelivery={showDelivery}
        showSalary={showSalary}
        showBedrooms={showBedrooms}
        showMileage={showMileage}
        showBrand={showBrand}
        showFashionExtras={showFashionExtras}
        showQuantity={showQuantity}
        showDigitalExtras={showDigitalExtras}
        handleChange={handleChange}
        handleFileChange={handleFileChange}
        handleRemoveImage={handleRemoveImage}
        handleNext={handleNext}
        handleBack={handleBack}
        handleSubmit={handleSubmit}
        videoFile={videoFile}
        videoPreview={videoPreview}
        handleVideoChange={handleVideoChange}
        setVideoFile={setVideoFile}
        setVideoPreview={setVideoPreview}
      />
    </div>
  );
};

export default CreateAd;
