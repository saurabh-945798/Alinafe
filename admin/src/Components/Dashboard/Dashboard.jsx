// 📁 src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import adminApi from "../../api/adminApi.js"; // path adjust karo
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  CheckCircle,
  Clock,
  AlertTriangle,
  MessageCircle,
  TrendingUp,
  MapPin,
  BarChart3, // ✅ add this
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const BASE_URL = "https://localhost:5000";
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Admin Overview Data
 // ✅ Fetch Admin Overview Data
// ✅ Fetch Admin Overview Data
useEffect(() => {
  const fetchStats = async () => {
    try {
      const res = await adminApi.get("/overview");
      console.log("ADMIN OVERVIEW RAW RESPONSE 👉", res.data); // 🔥 ADD THIS
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  fetchStats();
}, []);




  if (loading || !stats) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white text-[#004D40]">
        
        {/* Animated Loader */}
        <div className="flex gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-[#009688] animate-bounce"></div>
          <div className="w-3 h-3 rounded-full bg-[#26A69A] animate-bounce delay-150"></div>
          <div className="w-3 h-3 rounded-full bg-[#80CBC4] animate-bounce delay-300"></div>
        </div>
  
        {/* Loading Text */}
        <p className="text-lg font-semibold bg-gradient-to-r from-[#009688] to-[#004D40] bg-clip-text text-transparent">
          Loading Dashboard Analytics...
        </p>
      </div>
    );
  }
  

  const {
    totalUsers = 0,
    totalAds = 0,
    approvedAds = 0,
    pendingAds = 0,
    rejectedAds = 0,
    soldAds = 0,
    totalReports = 0,
    totalMessages = 0,
    months = [],
    monthlyAds = [],
    monthlyUsers = [],
    adStatusCount = {},   // 🔥 IMPORTANT
    topCategory = "",
    topLocation = "",
    mostReportedCategory = "",
    engagementRate = 0,
    lastUpdated = new Date(),
  } = stats;
  

  // ✅ Chart Data
  // Create teal gradient inside useEffect or before return:
const gradientFill = (ctx) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, "rgba(0,150,136,0.35)");   // Teal bright
  gradient.addColorStop(1, "rgba(0,150,136,0.05)");   // Soft fade
  return gradient;
};

const lineData = {
  labels: months,
  datasets: [
    {
      label: "Ads Posted",
      data: monthlyAds,
      borderColor: "#009688",        // Alinafe teal
      backgroundColor: (context) => {
        const chart = context.chart;
        const { ctx } = chart;
        return gradientFill(ctx);
      },
      borderWidth: 3,
      pointBackgroundColor: "#004D40",
      pointBorderColor: "#ffffff",
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.45,
      fill: true,
      shadowColor: "#009688",
      shadowBlur: 15,
    },
  ],
};



const userData = {
  labels: months,
  datasets: [
    {
      label: "New Users",
      data: monthlyUsers,
      backgroundColor: (context) => {
        const chart = context.chart;
        const { ctx } = chart;
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, "rgba(0,150,136,0.9)");   // Teal top
        gradient.addColorStop(1, "rgba(128,203,196,0.5)"); // Soft aqua bottom
        return gradient;
      },
      borderColor: "#004D40",
      borderWidth: 1.5,
      borderRadius: 10,
      hoverBackgroundColor: "rgba(0,150,136,0.8)",
      hoverBorderColor: "#00332D",
    },
  ],
};

const adStatusData = {
  labels: Object.keys(adStatusCount || {}),
  datasets: [
    {
      data: Object.values(adStatusCount || {}),
      backgroundColor: [
        "#009688",
        "#4DB6AC",
        "#80CBC4",
        "#004D40",
      ],
    },
  ],
};



  // 🧾 Stat Cards
  const cards = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: <Users />,
      color: "from-[#DBEAFE] to-[#BFDBFE]",
    },
    {
      title: "Total Ads",
      value: totalAds,
      icon: <FolderOpen />,
      color: "from-[#D1FAE5] to-[#A7F3D0]",
    },
    {
      title: "Approved Ads",
      value: approvedAds,
      icon: <CheckCircle />,
      color: "from-[#DCFCE7] to-[#BBF7D0]",
    },
    {
      title: "Pending Ads",
      value: pendingAds,
      icon: <Clock />,
      color: "from-[#FEF9C3] to-[#FDE68A]",
    },
    {
      title: "Rejected Ads",
      value: rejectedAds,
      icon: <AlertTriangle />,
      color: "from-[#FFE4E6] to-[#FDA4AF]",
    },
    {
      title: "Messages",
      value: totalMessages,
      icon: <MessageCircle />,
      color: "from-[#E0E7FF] to-[#C7D2FE]",
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#E0F2F1] via-white to-[#B2DFDB] py-10 px-6 font-[Poppins]">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-7xl mx-auto bg-white/60 backdrop-blur-xl rounded-3xl shadow-lg border border-teal-900/10 p-6 md:p-10"
      >
        {/* Header */}
        {/* Header */}
        <div className="flex items-center justify-between mb-10 bg-white/60 backdrop-blur-xl p-4 rounded-2xl shadow-sm border border-teal-900/10">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#009688]/15 flex items-center justify-center shadow-sm">
              <LayoutDashboard size={26} className="text-[#009688]" />
            </div>

            <div>
              <h1 className="text-3xl font-extrabold text-[#004D40] tracking-tight">
                Admin Overview
              </h1>
              <p className="text-xs text-[#00695C] mt-0.5">
                Alinafe Analytics Dashboard
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="text-right bg-white/70 backdrop-blur-md px-4 py-2 rounded-xl border border-teal-900/10 shadow-sm">
            <p className="text-xs text-[#00695C] tracking-wide flex items-center justify-end gap-1">
              <span className="w-2 h-2 bg-[#009688] rounded-full animate-pulse"></span>
              Last Updated
            </p>

            <p className="text-sm font-semibold text-[#004D40] mt-1">
              {new Date(lastUpdated).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.07, y: -6 }}
              transition={{ type: "spring", stiffness: 180 }}
              className="relative rounded-3xl p-5 bg-white/70 backdrop-blur-xl shadow-xl border border-teal-900/10 hover:shadow-2xl transition-all overflow-hidden"
            >
              {/* 🔵 Decorative gradient glow ring */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#009688]/20 via-transparent to-[#004D40]/20 opacity-40 pointer-events-none"></div>

              {/* TOP Row */}
              <div className="flex items-center justify-between relative z-10">
                <h3 className="text-sm font-semibold text-[#004D40] tracking-wide">
                  {card.title}
                </h3>

                <div className="p-3 rounded-2xl bg-[#009688]/10 border border-[#009688]/20 shadow-sm">
                  <span className="text-[#00695C]">{card.icon}</span>
                </div>
              </div>

              {/* NUMBER */}
              <h2 className="text-4xl font-extrabold text-[#002D27] mt-4 tracking-tight relative z-10">
                {card.value?.toLocaleString()}
              </h2>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Line Chart */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            transition={{ type: "spring", stiffness: 180 }}
            className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-teal-900/10 overflow-hidden"
          >
            {/* Decorative Gradient Aura */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#009688]/15 via-transparent to-[#004D40]/20 opacity-50 pointer-events-none"></div>

            <h3 className="font-semibold text-[#004D40] mb-4 flex items-center gap-2 relative z-10">
              <div className="p-2 bg-[#009688]/10 border border-[#009688]/20 rounded-lg shadow-sm">
                <TrendingUp size={18} className="text-[#00695C]" />
              </div>
              Monthly Ads Growth
            </h3>

            <div className="h-56 relative z-10 rounded-xl bg-white/50 p-2 backdrop-blur-sm border border-teal-900/10 shadow-inner">
              <Line
                data={lineData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            transition={{ type: "spring", stiffness: 180 }}
            className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-teal-900/10 overflow-hidden"
          >
            {/* Gradient Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#009688]/15 via-transparent to-[#004D40]/20 opacity-50 pointer-events-none"></div>

            <h3 className="font-semibold text-[#004D40] mb-4 flex items-center gap-2 relative z-10">
              <div className="p-2 bg-[#009688]/10 border border-[#009688]/20 rounded-lg shadow-sm">
                <Users size={18} className="text-[#00695C]" />
              </div>
              Monthly User Signups
            </h3>

            <div className="h-56 relative z-10 rounded-xl bg-white/50 p-2 backdrop-blur-sm border border-teal-900/10 shadow-inner">
              <Bar
                data={userData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            transition={{ type: "spring", stiffness: 180 }}
            className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-teal-900/10 overflow-hidden"
          >
            {/* Gradient Aura */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#009688]/20 via-transparent to-[#004D40]/20 opacity-40 pointer-events-none"></div>

            <h3 className="font-semibold text-[#004D40] mb-4 text-center relative z-10">
              Ad Status Distribution
            </h3>

            <div className="flex justify-center h-56 relative z-10 rounded-xl bg-white/50 p-2 backdrop-blur-sm border border-teal-900/10 shadow-inner">
              <Pie
                data={adStatusData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </motion.div>
        </div>

        {/* 🧩 Revenue & Engagement Overview Section */}
        {/* 🌟 Revenue & Engagement Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          {/* Section Heading */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-[#009688]/15 border border-[#009688]/30 shadow-sm">
              <TrendingUp size={26} className="text-[#00695C]" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-[#004D40]">
                Revenue & Engagement Analytics
              </h2>
              <p className="text-sm text-[#00695C]/80 tracking-wide">
                Key performance metrics powering your marketplace insights.
              </p>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* 1️⃣ User Engagement Rate */}
            <motion.div
              whileHover={{ scale: 1.06, y: -4 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative rounded-3xl p-8 bg-white/70 backdrop-blur-xl shadow-xl border border-teal-900/10 overflow-hidden"
            >
              {/* Glow Aura */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#009688]/20 via-transparent to-[#004D40]/20 opacity-40 pointer-events-none"></div>

              <div className="flex items-center justify-between mb-5 relative z-10">
                <h3 className="text-lg font-semibold text-[#004D40] tracking-wide">
                  User Engagement Rate
                </h3>
                <div className="p-3 rounded-2xl bg-[#009688]/10 border border-[#009688]/20 shadow-sm">
                  <TrendingUp size={22} className="text-[#00695C]" />
                </div>
              </div>

              <p className="text-5xl font-extrabold text-[#002D27] mb-3 relative z-10">
                {stats.engagementRate}%
              </p>

              <p className="text-gray-700 text-sm tracking-wide relative z-10">
                Average messages sent per active user.
              </p>
            </motion.div>

            {/* 2️⃣ Total Messages */}
            <motion.div
              whileHover={{ scale: 1.06, y: -4 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative rounded-3xl p-8 bg-white/70 backdrop-blur-xl shadow-xl border border-teal-900/10 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#A7F3D0]/40 via-transparent to-[#009688]/20 opacity-40 pointer-events-none"></div>

              <div className="flex items-center justify-between mb-5 relative z-10">
                <h3 className="text-lg font-semibold text-[#047857] tracking-wide">
                  Total Messages
                </h3>
                <div className="p-3 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20 shadow-sm">
                  <MessageCircle size={22} className="text-[#047857]" />
                </div>
              </div>

              <p className="text-5xl font-extrabold text-[#064E3B] mb-3 relative z-10">
                {stats.totalMessages?.toLocaleString()}
              </p>

              <p className="text-gray-700 text-sm tracking-wide relative z-10">
                Conversations exchanged across all users.
              </p>
            </motion.div>

            {/* 3️⃣ Ad Conversion Rate */}
            <motion.div
              whileHover={{ scale: 1.06, y: -4 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative rounded-3xl p-8 bg-white/70 backdrop-blur-xl shadow-xl border border-amber-900/10 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FDE68A]/40 via-transparent to-[#F59E0B]/20 opacity-40 pointer-events-none"></div>

              <div className="flex items-center justify-between mb-5 relative z-10">
                <h3 className="text-lg font-semibold text-[#92400E] tracking-wide">
                  Ad Conversion Rate
                </h3>
                <div className="p-3 rounded-2xl bg-yellow-200/40 border border-yellow-300/40 shadow-sm">
                  <BarChart3 size={22} className="text-[#92400E]" />
                </div>
              </div>

              <p className="text-5xl font-extrabold text-[#78350F] mb-3 relative z-10">
                42%
              </p>

              <p className="text-gray-700 text-sm tracking-wide relative z-10">
                Estimated ads leading to successful deals.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* 🧩 Category Performance Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-teal-900/10 mb-16 overflow-hidden"
        >
          {/* Decorative Gradient Top Highlight */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#009688] via-[#26A69A] to-[#80CBC4]" />

          {/* Section Header */}
          <div className="flex items-center gap-3 p-6 border-b border-teal-900/10">
            <div className="p-3 bg-[#009688]/10 border border-[#009688]/30 rounded-xl shadow-sm">
              <FolderOpen size={22} className="text-[#00695C]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#004D40]">
                Category Performance
              </h2>
              <p className="text-sm text-[#00695C]/80 -mt-0.5">
                Performance metrics across all marketplace categories.
              </p>
            </div>
          </div>

          {/* Table Section */}
          {stats.categoryInsights?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                {/* Table Head */}
                <thead>
                  <tr className="bg-[#E0F2F1] text-[#004D40] border-b border-teal-900/10">
                    <th className="py-4 px-5 text-left font-semibold">
                      Category
                    </th>
                    <th className="py-4 px-5 text-left font-semibold">
                      Total Ads
                    </th>
                    <th className="py-4 px-5 text-left font-semibold">
                      Avg Price(₹)
                    </th>
                    <th className="py-4 px-5 text-left font-semibold">
                      Reports
                    </th>
                    <th className="py-4 px-5 text-left font-semibold">
                      Messages
                    </th>
                    <th className="py-4 px-5 text-left font-semibold">
                      Engagement Rate
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {stats.categoryInsights.map((cat, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-200/60 hover:bg-[#F1FFFB] transition-all duration-200"
                    >
                      <td className="py-4 px-5 font-semibold text-[#004D40]">
                        {cat.category}
                      </td>

                      <td className="py-4 px-5 text-gray-700">
                        {cat.totalAds}
                      </td>

                      <td className="py-4 px-5 text-gray-700">
                      ₹{cat.avgPrice?.toLocaleString()}
                      </td>

                      <td className="py-4 px-5 text-gray-600">
                        {cat.totalReports}
                      </td>

                      <td className="py-4 px-5 text-gray-600">
                        {cat.totalMessages}
                      </td>

                      {/* Engagement Pill */}
                      <td className="py-4 px-5">
                        <span
                          className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-md border ${
                            cat.engagementRate > 3
                              ? "bg-green-100 text-green-800 border-green-300"
                              : cat.engagementRate > 1
                              ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                              : "bg-red-100 text-red-800 border-red-300"
                          }`}
                        >
                          {cat.engagementRate}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 italic p-6 text-center">
              No category insights available.
            </p>
          )}
        </motion.div>

        {/* 📊 Ad Performance Breakdown Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-teal-900/10 p-10 mb-20"
        >
          {/* Glowing Background Effects */}
          <div className="absolute top-5 left-5 w-60 h-60 bg-[#009688]/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-5 right-5 w-72 h-72 bg-[#004D40]/20 blur-[140px] rounded-full"></div>

          {/* Header */}
          <div className="relative flex items-center justify-between mb-10 z-10">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-[#009688]/10 border border-[#009688]/20 shadow-sm">
                <FolderOpen size={26} className="text-[#00695C]" />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-[#004D40] tracking-tight">
                  Ad Performance Breakdown
                </h2>
                <p className="text-sm text-[#00695C]/80">
                  Lifecycle insights from post → engagement → sale.
                </p>
              </div>
            </div>

            {/* Total Ads Badge */}
            <div className="bg-white/80 backdrop-blur-md px-6 py-2.5 rounded-full shadow-md border border-teal-900/10 text-sm text-[#004D40] font-medium">
              Total Ads: <b className="text-[#009688]">{stats.totalAds}</b>
            </div>
          </div>

          {/* Ad Status Summary Cards */}
          <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12 z-10">
            {[
              {
                title: "Approved",
                value: stats.adStatusCount?.Approved || 0,
                color: "from-[#009688] to-[#26A69A]",
                icon: <CheckCircle size={22} />,
              },
              {
                title: "Pending",
                value: stats.adStatusCount?.Pending || 0,
                color: "from-[#4DB6AC] to-[#26A69A]",
                icon: <Clock size={22} />,
              },
              {
                title: "Rejected",
                value: stats.adStatusCount?.Rejected || 0,
                color: "from-red-400 to-red-600", // keep red for danger (optional)
                icon: <AlertTriangle size={22} />,
              },
              {
                title: "Sold",
                value: stats.adStatusCount?.Sold || 0,
                color: "from-[#00695C] to-[#004D40]",
                icon: <TrendingUp size={22} />,
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.07, y: -4 }}
                transition={{ type: "spring", stiffness: 180 }}
                className={`relative bg-gradient-to-br ${card.color} text-white rounded-2xl p-6 flex flex-col shadow-xl hover:shadow-2xl border border-white/20 overflow-hidden`}
              >
                {/* Light overlay */}
                <div className="absolute inset-0 bg-white/10 opacity-20 pointer-events-none"></div>

                <div className="flex items-center justify-between w-full relative z-10">
                  <h3 className="text-sm font-semibold opacity-90">
                    {card.title}
                  </h3>
                  <div className="bg-white/20 p-2 rounded-xl shadow-sm">
                    {card.icon}
                  </div>
                </div>

                <h2 className="text-4xl font-extrabold mt-3 relative z-10">
                  {card.value}
                </h2>
              </motion.div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
            {/* Pie Chart */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white/75 backdrop-blur-xl rounded-3xl shadow-lg p-6 border border-teal-900/10"
            >
              <h3 className="text-lg font-bold text-[#004D40] mb-5 flex items-center gap-2">
                Ad Status Distribution
              </h3>
              <div className="h-72 flex justify-center">
                <Pie
                  data={{
                    labels: ["Approved", "Pending", "Rejected", "Sold"],
                    datasets: [
                      {
                        data: [
                          stats.adStatusCount?.Approved || 0,
                          stats.adStatusCount?.Pending || 0,
                          stats.adStatusCount?.Rejected || 0,
                          stats.adStatusCount?.Sold || 0,
                        ],
                        backgroundColor: [
                          "#22C55E",
                          "#FACC15",
                          "#EF4444",
                          "#009688",
                        ],
                        borderWidth: 3,
                        borderColor: "#fff",
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: { color: "#004D40", usePointStyle: true },
                      },
                      tooltip: {
                        backgroundColor: "#004D40",
                        titleColor: "#fff",
                        bodyColor: "#fff",
                      },
                    },
                  }}
                />
              </div>
            </motion.div>

            {/* Bar Chart */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white/75 backdrop-blur-xl rounded-3xl shadow-lg p-6 border border-teal-900/10"
            >
              <h3 className="text-lg font-bold text-[#004D40] mb-5">
                Ad Lifecycle Overview
              </h3>
              <div className="h-72">
                <Bar
                  data={{
                    labels: ["Approved", "Pending", "Rejected", "Sold"],
                    datasets: [
                      {
                        label: "Ads Count",
                        data: [
                          stats.adStatusCount?.Approved || 0,
                          stats.adStatusCount?.Pending || 0,
                          stats.adStatusCount?.Rejected || 0,
                          stats.adStatusCount?.Sold || 0,
                        ],
                        backgroundColor: [
                          "rgba(34,197,94,0.6)",
                          "rgba(250,204,21,0.6)",
                          "rgba(239,68,68,0.6)",
                          "rgba(0,150,136,0.6)",
                        ],
                        borderRadius: 10,
                        borderSkipped: false,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        backgroundColor: "#004D40",
                        titleColor: "#fff",
                        bodyColor: "#fff",
                      },
                    },
                    scales: {
                      y: { beginAtZero: true, grid: { color: "#E0F2F1" } },
                      x: { grid: { display: false } },
                    },
                  }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* 🗺️ Top Locations & User Activity (Alinafe Premium Design) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl bg-white/60 backdrop-blur-xl p-10 shadow-xl mb-20 border border-teal-900/10"
        >
          {/* 🌫 Floating Teal Accent Blobs */}
          <div className="absolute top-10 -left-10 w-44 h-44 bg-[#009688]/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-10 -right-10 w-56 h-56 bg-[#004D40]/20 rounded-full blur-[130px]"></div>

          {/* 🔹 Header */}
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between mb-10 z-10">
            <div className="flex items-center gap-3">
              <div className="bg-[#009688]/10 p-3 rounded-xl border border-[#009688]/20">
                <MapPin size={26} className="text-[#00695C]" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-[#004D40] tracking-tight">
                  Top Locations & User Activity
                </h2>
                <p className="text-sm text-[#00695C]/70">
                  Analyze where your community grows the fastest 🌍
                </p>
              </div>
            </div>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-md px-5 py-2 rounded-full shadow-md border border-teal-900/10 text-sm text-[#004D40] mt-5 md:mt-0"
            >
              📈 Growth Rate:{" "}
              <b className="text-[#009688]">{stats.userGrowthRate}</b>
            </motion.span>
          </div>

          {/* 🔸 Charts Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
            {/* Left: Bar Chart */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-teal-900/10"
            >
              <h3 className="text-lg font-semibold text-[#004D40] mb-5 flex items-center gap-2">
                <Users size={18} className="text-[#009688]" /> Top User Cities
              </h3>

              {stats.userCities?.length > 0 ? (
                <div className="h-72">
                  <Bar
                    data={{
                      labels: stats.userCities.map(
                        (c) => c._id.charAt(0).toUpperCase() + c._id.slice(1)
                      ),
                      datasets: [
                        {
                          label: "Users",
                          data: stats.userCities.map((c) => c.count),
                          backgroundColor: [
                            "rgba(0,150,136,0.75)",
                            "rgba(38,166,154,0.75)",
                            "rgba(128,203,196,0.75)",
                            "rgba(0,121,107,0.75)",
                            "rgba(77,182,172,0.75)",
                            "rgba(178,223,219,0.75)",
                          ],
                          borderRadius: 10,
                          borderSkipped: false,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          backgroundColor: "#004D40",
                          titleColor: "#fff",
                          bodyColor: "#fff",
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: { color: "#E0F2F1" },
                          ticks: { color: "#00695C" },
                        },
                        x: {
                          grid: { display: false },
                          ticks: { color: "#004D40" },
                        },
                      },
                    }}
                  />
                </div>
              ) : (
                <p className="text-gray-500 italic text-sm">
                  No user city data found.
                </p>
              )}
            </motion.div>

            {/* Right: Pie Chart */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-teal-900/10"
            >
              <h3 className="text-lg font-semibold text-[#004D40] mb-5 flex items-center gap-2">
                <Users size={18} className="text-[#009688]" /> Active vs
                Inactive Users
              </h3>

              <div className="h-64 flex justify-center">
                <Pie
                  data={{
                    labels: ["Active", "Inactive"],
                    datasets: [
                      {
                        data: [stats.activeUsers, stats.inactiveUsers],
                        backgroundColor: ["#009688", "#B2DFDB"],
                        borderColor: "#fff",
                        borderWidth: 3,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: {
                          color: "#004D40",
                          usePointStyle: true,
                          padding: 12,
                        },
                      },
                      tooltip: {
                        backgroundColor: "#004D40",
                        titleColor: "#fff",
                        bodyColor: "#fff",
                      },
                    },
                  }}
                />
              </div>

              <p className="text-center text-sm text-[#00695C] mt-3">
                Visualizing engagement and retention performance.
              </p>
            </motion.div>
          </div>

          {/* 🔹 Highlight Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-gradient-to-br from-[#009688] to-[#004D40] text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between shadow-xl"
          >
            <div className="flex items-center gap-3">
              <MapPin className="text-[#FBE6A2]" size={22} />
              <h4 className="text-lg font-semibold">
                Most Active Location:{" "}
                <span className="font-bold text-[#FBE6A2]">
                  {stats.topLocation}
                </span>
              </h4>
            </div>

            <p className="text-sm mt-3 sm:mt-0 text-[#E0F2F1]">
              Refreshed on{" "}
              <span className="font-medium">
                {new Date(stats.lastUpdated).toLocaleDateString()}
              </span>
            </p>
          </motion.div>
        </motion.div>

        {/* Quick Insights */}
        {/* 🔍 Key Insights Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {[
            { title: "Top Category", value: topCategory },
            { title: "Top Location", value: topLocation },
            { title: "Most Reported Category", value: mostReportedCategory },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.04, y: -3 }}
              transition={{ type: "spring", stiffness: 180 }}
              className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-teal-900/10 overflow-hidden"
            >
              {/* Accent Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#009688]/10 via-transparent to-[#004D40]/10 opacity-30"></div>

              <h4 className="font-semibold text-[#004D40] tracking-wide text-sm relative z-10">
                {item.title}
              </h4>

              <p className="text-lg font-bold text-[#002D27] mt-2 relative z-10">
                {item.value || "—"}
              </p>
            </motion.div>
          ))}
        </div>

        {/* 🌿 Footer (Alinafe Theme) */}
        <div className="text-center text-xs text-[#004D40]/70 mt-14 pb-6">
          © {new Date().getFullYear()}
          <span className="font-semibold text-[#00695C]"> Alinafe Admin</span> —
          Empowering Local Exchange
        </div>
      </motion.div>
    </section>
  );
};

export default Dashboard;
