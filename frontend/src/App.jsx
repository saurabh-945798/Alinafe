import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

import MainLayout from "./layouts/MainLayout.jsx";

import Home from "./Components/Home/Home.jsx";
import Login from "./Components/Pages/Login.jsx";
import Signup from "./Components/Pages/Signup.jsx";
import Dashboard from "./Components/Dashboard/Dashboard.jsx";
import MyAds from "./Components/Dashboard/MyAds.jsx";
import Favorites from "./Components/Dashboard/Favorites.jsx";
import Profile from "./Components/Dashboard/Profile.jsx";
import Settings from "./Components/Dashboard/Settings.jsx";
import CreateAd from "./Components/Dashboard/CreateAd.jsx";
import ReportAd from "./Components/Dashboard/ReportAd.jsx";
import ProductDetails from "./Components/ProductDetails/ProductDetails.jsx";
import CategoryPage from "./Components/CategoryPage/CategoryPage.jsx";
import SearchResults from "./Components/SearchResults/SearchResults.jsx";
import Listings from "./Components/Listings/Listings.jsx";
import Chats from "./Components/Dashboard/Chats.jsx";
import DashboardLayout from "./Components/Dashboard/DashboardLayout.jsx";
import MyReports from "./Components/Dashboard/MyReports.jsx";
import SellerProfile from "./Components/SellerProfile/SellerProfile.jsx";
import PricingPage from "./Components/BoostYourAd/PricingPage.jsx";
import Checkout from "./Components/BoostYourAd/Checkout.jsx";
import AdsPage from "./Components/AdsPage/AdsPage.jsx";
import About from "./Components/Footercontent/About.jsx";
import PrivacyPolicy from "./Components/Footercontent/PrivacyPolicy.jsx";
import Terms from "./Components/Footercontent/Terms.jsx";
import Contact from "./Components/Footercontent/Contact.jsx";
import SafetyTipsPage from "./Components/SafetyTips/SafetyTipsPage.jsx";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl text-[#0E9F9F] font-semibold">
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl text-[#0E9F9F] font-semibold">
        Loading...
      </div>
    );
  }

  if (user) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />

      <Route
        path="/about"
        element={
          <MainLayout>
            <About />
          </MainLayout>
        }
      />
      <Route
        path="/privacy-policy"
        element={
          <MainLayout>
            <PrivacyPolicy />
          </MainLayout>
        }
      />
      <Route
        path="/terms"
        element={
          <MainLayout>
            <Terms />
          </MainLayout>
        }
      />
      <Route
        path="/contact"
        element={
          <MainLayout>
            <Contact />
          </MainLayout>
        }
      />
      <Route
        path="/safety-tips"
        element={
          <MainLayout>
            <SafetyTipsPage />
          </MainLayout>
        }
      />

      <Route
        path="/chats"
        element={
          <ProtectedRoute>
            <Chats />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chats/:receiverId"
        element={
          <ProtectedRoute>
            <Chats />
          </ProtectedRoute>
        }
      />

      <Route
        path="/search"
        element={
          <MainLayout>
            <SearchResults />
          </MainLayout>
        }
      />

      <Route
        path="/ad/:id"
        element={
          <MainLayout>
            <ProductDetails />
          </MainLayout>
        }
      />

      <Route
        path="/profile/:sellerId"
        element={
          <MainLayout>
            <SellerProfile />
          </MainLayout>
        }
      />

      <Route
        path="/category/:category"
        element={
          <MainLayout>
            <CategoryPage />
          </MainLayout>
        }
      />

      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="my-ads" element={<MyAds />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="createAd" element={<CreateAd />} />
        <Route path="ReportAd" element={<ReportAd />} />
        <Route path="ReportAd/:id" element={<ReportAd />} />
        <Route path="myreports" element={<MyReports />} />
      </Route>

      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicOnlyRoute>
            <Signup />
          </PublicOnlyRoute>
        }
      />

      <Route path="/all-ads" element={<Listings />} />

      <Route
        path="/pricing"
        element={
          <MainLayout>
            <PricingPage />
          </MainLayout>
        }
      />
      <Route
        path="/checkout"
        element={
          <MainLayout>
            <Checkout />
          </MainLayout>
        }
      />

      <Route
        path="/ads"
        element={
          <MainLayout>
            <AdsPage />
          </MainLayout>
        }
      />

      <Route
        path="*"
        element={
          <div className="flex items-center justify-center h-screen text-gray-500">
            Page not found
          </div>
        }
      />
    </Routes>
  );
}

export default App;
