import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShieldCheck,
  Eye,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  Calendar,
  User as UserIcon,
  Users as UsersIcon,
  UserCheck,
  UserX,
  Download,
} from "lucide-react";
import Swal from "sweetalert2";
import adminApi from "../../api/adminApi.js"; // path adjust karo
import {
  handleAvatarError,
  withAvatarFallback,
} from "../../utils/avatarFallback.js";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  const fallbackImage = "/default-avatar.svg";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await adminApi.get("/users");

        if (res.data?.users) {
          setUsers(res.data.users);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleView = async (id) => {
    try {
      const res = await adminApi.get(`/users/${id}`);
      setSelectedUser(res.data?.user || res.data);
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleExportUsers = () => {
    const rows = users.map((user) => ({
      User: user.name || "",
      Email: user.email || "",
      Location: user.location || "",
      Joined: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-IN")
        : "",
    }));

    if (rows.length === 0) {
      Swal.fire("No data", "There are no users to export.", "info");
      return;
    }

    const headers = ["User", "Email", "Location", "Joined"];
    const csvRows = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((header) => `"${String(row[header] || "").replace(/"/g, '""')}"`)
          .join(",")
      ),
    ];

    const blob = new Blob(["\uFEFF" + csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const today = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.setAttribute("download", `users-export-${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "Active").length;
  const suspendedUsers = users.filter((u) => u.status === "Suspended").length;
  const verifiedUsers = users.filter((u) => u.verified).length;

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#E0F2F1] via-white to-[#F1F8E9] p-6 font-[Poppins] md:p-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="mb-2 flex items-center gap-2 text-4xl font-extrabold text-[#004D40]">
          <UsersIcon className="text-[#009688]" /> Users Dashboard
        </h1>
        <p className="text-gray-600">
          Manage accounts, verify users & monitor activity.
        </p>
      </motion.div>

      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Users",
            value: totalUsers,
            icon: <UsersIcon />,
            bg: "from-[#009688] to-[#004D40]",
          },
          {
            label: "Active Users",
            value: activeUsers,
            icon: <UserCheck />,
            bg: "from-green-500 to-emerald-400",
          },
          {
            label: "Suspended Users",
            value: suspendedUsers,
            icon: <UserX />,
            bg: "from-red-500 to-red-700",
          },
          {
            label: "Verified Users",
            value: verifiedUsers,
            icon: <ShieldCheck />,
            bg: "from-yellow-500 to-amber-400",
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className={`flex items-center justify-between rounded-2xl bg-gradient-to-br ${card.bg} p-6 text-white shadow-xl`}
          >
            <div>
              <h2 className="text-4xl font-bold">{card.value}</h2>
              <p className="text-sm opacity-90">{card.label}</p>
            </div>
            <div className="text-4xl opacity-80">{card.icon}</div>
          </motion.div>
        ))}
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 rounded-xl border border-[#009688]/20 bg-white/70 px-4 py-3 shadow-lg backdrop-blur-xl md:w-80">
          <Search className="text-[#004D40]" size={18} />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-gray-700 outline-none"
          />
        </div>

        <button
          type="button"
          onClick={handleExportUsers}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#009688] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#00796B] md:self-auto"
        >
          <Download size={16} />
          Export Users
        </button>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-[#009688]/10 bg-white/80 shadow-lg backdrop-blur-xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gradient-to-r from-[#009688] to-[#004D40] text-white">
              <th className="p-4 text-sm font-semibold">User</th>
              <th className="p-4 text-sm font-semibold">Email</th>
              <th className="p-4 text-sm font-semibold">Location</th>
              <th className="p-4 text-sm font-semibold">Joined</th>
              <th className="p-4 text-sm font-semibold">Status</th>
              <th className="p-4 text-sm font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-6 text-center font-medium text-gray-500">
                  Loading users...
                </td>
              </tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user, idx) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="border-b transition hover:bg-[#E0F2F1]/40"
                >
                  <td className="p-4 font-medium text-gray-800">
                    <div className="flex items-center gap-3">
                      {user.photoURL ? (
                        <img
                          src={withAvatarFallback(user.photoURL)}
                          alt={user.name}
                          onError={handleAvatarError}
                          className="h-11 w-11 rounded-full border-2 border-[#009688]"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#009688]/20 font-bold text-[#004D40]">
                          {(user.name || "U")
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .substring(0, 2)
                            .toUpperCase()}
                        </div>
                      )}
                      {user.name}
                    </div>
                  </td>

                  <td className="p-4 text-gray-700">{user.email}</td>
                  <td className="p-4 text-gray-600">{user.location || "-"}</td>
                  <td className="p-4 text-sm text-gray-500">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="p-4">
                    {user.status === "Suspended" ? (
                      <span className="flex items-center gap-1 font-semibold text-red-600">
                        <XCircle size={16} /> Suspended
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-semibold text-green-600">
                        <CheckCircle size={16} /> Active
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <button
                      className="flex items-center gap-1 rounded-lg bg-[#E0F7FA] px-3 py-1 text-sm text-[#00695C] hover:bg-[#B2DFDB]"
                      onClick={() => handleView(user._id)}
                    >
                      <Eye size={16} /> View
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-6 text-center italic text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(240,253,250,0.98)_100%)] shadow-[0_30px_90px_rgba(15,118,110,0.22)]"
            >
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/85 text-lg text-slate-500 shadow-sm transition hover:bg-white hover:text-red-500"
              >
                ×
              </button>

              <div className="bg-gradient-to-r from-[#009688] via-[#00796B] to-[#004D40] px-6 pb-16 pt-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/70">
                  User Profile
                </p>
                <div className="mt-4 flex items-start gap-4">
                  <img
                    src={withAvatarFallback(selectedUser.photoURL || fallbackImage)}
                    alt={selectedUser.name}
                    onError={handleAvatarError}
                    className="h-24 w-24 rounded-3xl border-4 border-white/30 object-cover shadow-lg"
                  />

                  <div className="min-w-0 pt-2">
                    <h2 className="text-2xl font-bold leading-tight">
                      {selectedUser.name}
                    </h2>
                    <p className="mt-2 break-all text-sm text-white/80">
                      {selectedUser.email}
                    </p>
                    <span
                      className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                        selectedUser.status === "Suspended"
                          ? "bg-red-100 text-red-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {selectedUser.status === "Suspended" ? (
                        <XCircle size={14} />
                      ) : (
                        <CheckCircle size={14} />
                      )}
                      {selectedUser.status === "Suspended" ? "Suspended" : "Active"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6">
                <div className="-mt-10 rounded-[24px] border border-[#009688]/10 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-[#004D40]">
                      Account Details
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Basic profile and account information for this user.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 rounded-2xl bg-[#F7FFFD] px-4 py-3">
                      <div className="mt-0.5 rounded-xl bg-[#E0F7F4] p-2 text-[#00796B]">
                        <MapPin size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Location
                        </p>
                        <p className="mt-1 text-sm font-medium text-[#004D40]">
                          {selectedUser.location || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-2xl bg-[#F7FFFD] px-4 py-3">
                      <div className="mt-0.5 rounded-xl bg-[#E0F7F4] p-2 text-[#00796B]">
                        <Phone size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Phone
                        </p>
                        <p className="mt-1 text-sm font-medium text-[#004D40]">
                          {selectedUser.phone || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-2xl bg-[#F7FFFD] px-4 py-3">
                      <div className="mt-0.5 rounded-xl bg-[#E0F7F4] p-2 text-[#00796B]">
                        <Calendar size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Joined
                        </p>
                        <p className="mt-1 text-sm font-medium text-[#004D40]">
                          {new Date(selectedUser.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-2xl bg-[#F7FFFD] px-4 py-3">
                      <div className="mt-0.5 rounded-xl bg-[#E0F7F4] p-2 text-[#00796B]">
                        <UserIcon size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Status
                        </p>
                        <p className="mt-1 text-sm font-medium text-[#004D40]">
                          {selectedUser.status === "Suspended"
                            ? "Suspended"
                            : "Active"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Users;
