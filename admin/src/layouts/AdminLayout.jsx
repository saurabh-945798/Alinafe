import Sidebar from "../Components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen font-[Poppins] bg-[#F8FAFC] text-gray-800">
      <Sidebar />

      <div className="flex-1 ml-[80px] lg:ml-[260px] p-6">
        <Outlet /> {/* 🔥 CHILD ROUTES RENDER HERE */}
      </div>
    </div>
  );
};

export default AdminLayout;
