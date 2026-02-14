import React, { useEffect, useState } from "react";
import { updateProfile } from "firebase/auth";
import { auth } from "../../firebase.js";
import axios from "axios";
import {
  User,
  Mail,
  Edit2,
  Phone,
  Calendar,
  MapPin,
  Save,
  Lock,
  Plus,
  UploadCloud,
} from "lucide-react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext.jsx";

import { Card, CardHeader, CardContent, CardFooter } from "../ui/card.jsx";
import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";
import { Separator } from "../ui/separator.jsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog.jsx";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").trim() || "/api";

const Profile = () => {
  const { user, setUser, getFirebaseToken } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.photoURL || "");
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState("");
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    location: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.uid) return;
      try {
        const idToken = await getFirebaseToken();
        const res = await axios.get(`${API_BASE}/users/me`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        const profile = res.data;
        setForm({
          name: profile.name || user?.name || "",
          email: profile.email || user?.email || "",
          phone: profile.phone || "",
          location: profile.location || "",
        });
        setAvatarUrl(profile.photoURL || user?.photoURL || "");
      } catch (error) {
        console.error(
          "Profile load failed:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.uid, getFirebaseToken]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoPick = (event) => {
    const file = event.target.files?.[0];
    if (!file || !user?.uid) return;

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowed.includes(file.type)) {
      Swal.fire({
        title: "Invalid file",
        text: "Please select JPG, PNG, or WEBP image",
        icon: "error",
      });
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: "Image too large",
        text: "Please select an image under 5MB",
        icon: "error",
      });
      event.target.value = "";
      return;
    }

    if (selectedPhotoPreview) {
      URL.revokeObjectURL(selectedPhotoPreview);
    }

    const preview = URL.createObjectURL(file);
    setSelectedPhotoFile(file);
    setSelectedPhotoPreview(preview);
    setPhotoDialogOpen(true);
    event.target.value = "";
  };

  const uploadSelectedPhoto = async () => {
    if (!selectedPhotoFile || !user?.uid) return;

    try {
      setPhotoUploading(true);
      const idToken = await getFirebaseToken();
      const formData = new FormData();
      formData.append("photo", selectedPhotoFile);

      const res = await axios.put(
        `${API_BASE}/users/me/photo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const photoURL = res.data?.photoURL || "";
      if (photoURL) {
        setAvatarUrl(photoURL);
        await updateProfile(auth.currentUser, {
          photoURL,
        });
        setUser((prev) => (prev ? { ...prev, photoURL } : prev));
      }

      Swal.fire({
        title: "Profile Photo Updated",
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
      });

      setPhotoDialogOpen(false);
      setSelectedPhotoFile(null);
      if (selectedPhotoPreview) {
        URL.revokeObjectURL(selectedPhotoPreview);
      }
      setSelectedPhotoPreview("");
    } catch (error) {
      Swal.fire({
        title: "Upload Failed",
        text: error.response?.data?.message || "Could not upload image",
        icon: "error",
      });
    } finally {
      setPhotoUploading(false);
    }
  };

  const closePhotoDialog = () => {
    setPhotoDialogOpen(false);
    setSelectedPhotoFile(null);
    if (selectedPhotoPreview) {
      URL.revokeObjectURL(selectedPhotoPreview);
    }
    setSelectedPhotoPreview("");
  };

  const handleSave = async () => {
    try {
      const idToken = await getFirebaseToken();

      await updateProfile(auth.currentUser, {
        displayName: form.name,
      });

      await axios.put(
        `${API_BASE}/users/me`,
        {
          name: form.name,
          phone: form.phone,
          location: form.location,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      Swal.fire({
        title: "Profile Updated",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      setUser((prev) =>
        prev
          ? {
              ...prev,
              name: form.name,
            }
          : prev
      );

      setIsEditing(false);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || error.message,
        icon: "error",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-[#009688] text-xl font-semibold">
        Loading your profile...
      </div>
    );
  }

  const joinedDate = new Date(
    user?.metadata?.creationTime || Date.now()
  ).toLocaleDateString();
  const lastLogin = new Date(
    user?.metadata?.lastSignInTime || Date.now()
  ).toLocaleString();

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-[Poppins] text-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex justify-center items-start p-6 md:p-10"
      >
        <Card className="w-full max-w-3xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-100 p-8">
          <CardHeader className="text-center mb-6">
            <h1 className="text-3xl font-semibold text-[#009688] flex justify-center items-center gap-2">
              <User className="w-7 h-7" /> My Profile
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Manage your basic account information
            </p>
          </CardHeader>

          <Separator className="mb-6" />

          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={form.name || "User"}
                  className="w-24 h-24 rounded-full object-cover shadow-lg border-2 border-[#009688]/20"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#009688] to-[#00796B] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {form.name?.[0] || "U"}
                </div>
              )}

              <label
                htmlFor="profile-photo-upload"
                className="absolute -bottom-1 -right-1 bg-[#009688] text-white p-2 rounded-full shadow cursor-pointer hover:bg-[#00796B] transition"
                title="Change profile photo"
              >
                <Plus className="w-4 h-4" />
              </label>
              <input
                id="profile-photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoPick}
                className="hidden"
                disabled={photoUploading}
              />
            </div>
            <h2 className="text-xl font-semibold text-[#009688] mt-3">
              {form.name}
            </h2>
            <p className="text-xs text-[#009688] font-medium mt-1">
              Tap + icon to change profile image
            </p>
            {photoUploading && (
              <p className="text-xs text-[#009688] mt-1">Uploading image...</p>
            )}
            <p className="flex items-center justify-center gap-2 text-gray-600 text-sm mt-1">
              <Mail className="w-4 h-4" /> {form.email}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Member since {joinedDate}
            </p>
          </div>

          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              <div>
                <label className="text-sm text-gray-500">Full Name</label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`mt-1 ${
                    isEditing
                      ? "border-teal-500 focus:ring-teal-500"
                      : "border-gray-200 bg-gray-50"
                  }`}
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">Email</label>
                <Input
                  value={form.email}
                  disabled
                  className="mt-1 border-gray-200 bg-gray-50 text-gray-600"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">Phone</label>
                <div className="flex items-center gap-2 border rounded-lg px-3 py-2 mt-1 bg-white">
                  <Phone className="w-4 h-4 text-teal-500" />
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    placeholder="+91 9876543210"
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full outline-none bg-transparent text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">Location</label>
                <div className="flex items-center gap-2 border rounded-lg px-3 py-2 mt-1 bg-white">
                  <MapPin className="w-4 h-4 text-teal-500" />
                  <input
                    type="text"
                    name="location"
                    placeholder="Delhi, India"
                    value={form.location}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full outline-none bg-transparent text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#F9FBFB] rounded-xl p-5 border border-gray-100 shadow-inner">
              <h3 className="text-[#009688] font-semibold mb-3 text-sm">
                Account Info
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#009688]" /> Joined:{" "}
                  <span className="font-medium">{joinedDate}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#009688]" /> Last Login:{" "}
                  <span className="font-medium">{lastLogin}</span>
                </p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center mt-8 gap-3">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-[#009688] to-[#00796B] text-white rounded-full px-6 py-2 shadow hover:opacity-90"
              >
                <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                className="bg-emerald-600 text-white rounded-full px-6 py-2 shadow hover:bg-emerald-700"
              >
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>

      <Dialog open={photoDialogOpen} onOpenChange={(open) => !open && closePhotoDialog()}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#009688]">Use this profile image?</DialogTitle>
            <DialogDescription>
              This image will be used across your profile, navbar, and sidebar.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center py-2">
            {selectedPhotoPreview && (
              <img
                src={selectedPhotoPreview}
                alt="Selected profile"
                className="w-40 h-40 rounded-2xl object-cover border border-gray-200 shadow-sm"
              />
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closePhotoDialog}
              className="rounded-full"
              disabled={photoUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={uploadSelectedPhoto}
              disabled={photoUploading || !selectedPhotoFile}
              className="bg-[#009688] text-white rounded-full"
            >
              <UploadCloud className="w-4 h-4 mr-2" />
              {photoUploading ? "Uploading..." : "Use This Image"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
