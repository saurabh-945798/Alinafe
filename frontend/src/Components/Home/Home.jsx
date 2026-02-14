import React from "react";

// Sections
import HeroSection from "../HeroSection/HeroSection.jsx";
import CategoryBar from "../CategoryBar/CategoryBar.jsx";
import SpotlightSection from "../SpotlightSection/SpotlightSection.jsx";
import TrendingNearYou from "../TrendingNearYou/TrendingNearYou.jsx";
import FreshRecommendations from "../FreshRecommendations/FreshRecommendations.jsx";
import FeaturedListings from "../FeaturedListings/FeaturedListings.jsx";
import WhyChooseUs from "../WhyChooseUs/WhyChooseUs.jsx";
import BoostYourAd from "../BoostYourAd/BoostAdSection.jsx";
import HowItWorks from "../HowItWorks/HowItWorks.jsx";
import CTASection from "../CTASection/CTASection.jsx";
import SafetyTips from "../SafetyTips/SafetyTips.jsx";

// Category Sliders (Bottom)
import RealEstate from "../CategorySlider/RealEstate.jsx";
import Vehicles from "../CategorySlider/Vehicles.jsx";
import Electronics from "../CategorySlider/Electronics.jsx";
import FashionBeauty from "../CategorySlider/Fashion.jsx";
import Furniture from "../CategorySlider/Furniture.jsx";
import JobsServices from "../CategorySlider/Jobs.jsx";
import Domain from "../CategorySlider/Domain.jsx";
import Sports from "../CategorySlider/Sports.jsx";
import Pets from "../CategorySlider/Pets.jsx";
import Mobile from "../CategorySlider/Mobile.jsx";
import PopularSearches from "../PopularSearches/PopularSearches.jsx";
import DomainAuctionSection from "../DomainAuctionSection/DomainAuctionSection.jsx";
import KitchenwarePromo from "../KitchenwarePromo/KitchenwarePromo.jsx";

const Home = () => {
  return (
    <div className="bg-[#F8FAFC] min-h-screen font-[Poppins] flex flex-col">

      {/* 1️⃣ Hero */}
      <HeroSection />

      {/* 2️⃣ Category Bar */}
      <CategoryBar />
      <KitchenwarePromo/>

      {/* 3️⃣ Spotlight */}
      <SpotlightSection />

      {/* 4️⃣ Trending Near You */}
      {/* <TrendingNearYou /> */}

      {/* 5️⃣ Fresh Recommendations */}
      <FreshRecommendations />

      {/* 6️⃣ Featured Listings (optional section) */}
      <FeaturedListings />
      {/* <PopularSearches/> */}

      {/* 7️⃣ Why Choose Us */}
      <WhyChooseUs />
      {/* <DomainAuctionSection/> */}

      {/* 8️⃣ Boost Your Ad */}
      <BoostYourAd />

      {/* 9️⃣ How It Works */}
      <HowItWorks />

      {/* 🔟 CTA – Post Ad */}
      <CTASection />

      {/* 1️⃣1️⃣ Safety Tips */}
      <SafetyTips />

      {/* 1️⃣2️⃣ Category Sliders (Bottom of page) */}
      <RealEstate />
      <Vehicles />
      <Electronics />
      <FashionBeauty />
      <Furniture />
      <JobsServices />
      <Mobile />
      <Sports />
      {/* <Pets /> */}

      {/* 1️⃣3️⃣ Footer (if needed) */}
      {/* <Footer /> */}
      
    </div>
  );
};

export default Home;
