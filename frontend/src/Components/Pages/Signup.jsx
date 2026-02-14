// src/components/Pages/Signup.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    contactNumber: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  const getFriendlyError = (code) => {
    const map = {
      "auth/email-already-in-use": "This email is already registered",
      "auth/invalid-email": "Please enter a valid email address",
      "auth/weak-password": "Password should be at least 8 characters",
      "auth/popup-closed-by-user": "Google signup popup was closed",
    };
    return map[code] || "Signup failed. Please try again.";
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const email = String(form.email || "").trim().toLowerCase();
    const contactNumber = String(form.contactNumber || "").replace(/\D/g, "");
    const password = String(form.password || "");

    if (!form.name?.trim() || !email || !contactNumber || !password) {
      setError("Please fill all required fields");
      setLoading(false);
      return;
    }
    if (!acceptTerms) {
      setError("Please accept Terms & Privacy Policy to continue");
      setLoading(false);
      return;
    }

    if (contactNumber.length < 10 || contactNumber.length > 15) {
      setError("Please enter a valid contact number");
      setLoading(false);
      return;
    }

    if ((password || "").length < 8) {
      setError("Password should be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      sessionStorage.setItem(
        "alinafe_pending_signup_profile",
        JSON.stringify({
          email,
          contactNumber,
        })
      );
    } catch {
      // storage is best-effort, auth flow still continues
    }

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(credential.user, {
        displayName: form.name,
      });

      navigate("/");
    } catch (err) {
      try {
        sessionStorage.removeItem("alinafe_pending_signup_profile");
      } catch {
        // ignore storage failure
      }
      setError(getFriendlyError(err?.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      setError(getFriendlyError(err?.code));
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white relative overflow-hidden">

      {/* ===== LEFT BRAND PANEL ===== */}
      <div className="hidden lg:flex flex-col justify-center px-14 relative z-10">
        <div className="bg-white/70 backdrop-blur-xl border border-[#009688]/15 rounded-3xl p-10 shadow-2xl relative">
          <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-[#009688]/10 blur-3xl pointer-events-none" />
          {/* Wordmark + Tagline */}
          <div className="mb-8 flex items-start gap-3">
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#009688"
              viewBox="0 0 24 24"
              className="w-8 h-8 flex-shrink-0 -mt-[2px] transform scale-x-[-1]"
            >
              <path d="M21 11l-9-9H3v9l9 9 9-9zM7 7a2 2 0 110-4 2 2 0 010 4z" />
            </svg> */}
            <div className="flex flex-col leading-tight">
              <h1 className="text-5xl font-extrabold text-[#0E9F9F] tracking-tight">
                Alinafe
              </h1>
              <p className="text-base font-semibold text-[#E94F37] ml-[6px] mt-[-2px]">
                Buy • Sell • Connect
              </p>
            </div>
          </div>

          {/* Benefits */}
          <ul className="space-y-4 text-lg text-gray-700">
            <li className="flex gap-3">
              <CheckCircle className="text-[#009688] w-5 h-5 mt-1" />
              Trusted local marketplace across India
            </li>
            <li className="flex gap-3">
              <CheckCircle className="text-[#009688] w-5 h-5 mt-1" />
              Post ads, chat instantly & close deals faster
            </li>
            <li className="flex gap-3">
              <CheckCircle className="text-[#009688] w-5 h-5 mt-1" />
              Secure accounts with trusted authentication
            </li>
          </ul>

          {/* Testimonial / Trust Badge */}
          <div className="mt-8 p-4 rounded-xl bg-[#F8FFFD] border border-[#009688]/15">
            <p className="text-base text-gray-600 italic">
              "Alinafe makes buying & selling simple and safe."
            </p>
            <span className="text-base text-gray-500 mt-1 block">
              — Local Seller, India
            </span>
          </div>
        </div>
      </div>

      {/* ===== RIGHT FORM PANEL ===== */}
      <div className="flex items-center justify-center px-6 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-md bg-white/80 backdrop-blur-xl border border-[#009688]/15 shadow-2xl rounded-2xl p-8"
        >
          <div className="absolute left-0 top-0 h-full w-1.5 bg-[#009688]" />
          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              Create your Alinafe account
            </h2>
            <p className="text-base text-gray-500 mt-1">
              Join the trusted local marketplace
            </p>
            
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <>
              {/* Name */}
              <div className="relative rounded-xl border border-[#009688]/15 bg-[#F8FFFD] shadow-sm">
                <User className="absolute left-3 top-3.5 w-5 h-5 text-[#009688]" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 p-3 rounded-xl bg-transparent text-base
                           focus:ring-2 focus:ring-[#009688]/30 outline-none"
                />
              </div>

              {/* Email */}
              <div className="relative rounded-xl border border-[#009688]/15 bg-[#F8FFFD] shadow-sm">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-[#009688]" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 p-3 rounded-xl bg-transparent text-base
                           focus:ring-2 focus:ring-[#009688]/30 outline-none"
                />
              </div>

              {/* Contact Number */}
              <div className="relative rounded-xl border border-[#009688]/15 bg-[#F8FFFD] shadow-sm">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base font-semibold text-[#0E6D85]">
                  +91
                </span>
                <input
                  type="tel"
                  name="contactNumber"
                  placeholder="Phone number"
                  value={form.contactNumber}
                  onChange={handleChange}
                  required
                  className="w-full pl-14 p-3 rounded-xl bg-transparent text-base
                           focus:ring-2 focus:ring-[#009688]/30 outline-none"
                />
              </div>

              {/* Password */}
              <div className="relative rounded-xl border border-[#009688]/15 bg-[#F8FFFD] shadow-sm">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-[#009688]" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-11 p-3 rounded-xl bg-transparent text-base
                           focus:ring-2 focus:ring-[#009688]/30 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0E6D85] hover:text-[#009688]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password Strength Hint */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Use at least 8 characters</span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#009688]" />
                  <span className="h-2 w-2 rounded-full bg-[#009688]/50" />
                  <span className="h-2 w-2 rounded-full bg-gray-200" />
                </span>
              </div>
            </>

            {/* Terms */}
            <label className="flex items-start gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                required
                className="accent-[#009688] mt-0.5"
              />
              I agree to the Terms & Privacy Policy
            </label>

            {/* Error */}
            {error && (
              <p className="text-red-600 text-sm text-center bg-red-50 py-2 rounded-lg border border-red-100">
                {error}
              </p>
            )}

            <div className="h-px w-full bg-[#2E3192]/35" />

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              disabled={loading || !acceptTerms}
              className="w-full py-3 bg-gradient-to-r from-[#009688] to-[#14B8A6]
                         text-white text-lg font-semibold rounded-xl shadow-md hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </span>
              ) : (
                "Create Account"
              )}
            </motion.button>
            
          <div className="my-5 flex items-center">
            <div className="flex-grow border-t" />
            <span className="mx-2 text-sm text-gray-400">OR</span>
            <div className="flex-grow border-t" />
          </div>


            {/* Google Signup */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={handleGoogleSignup}
                className="w-full flex items-center justify-center gap-3 py-3
                         border border-[#009688]/30 rounded-xl bg-white
                         hover:bg-[#009688]/5 transition text-gray-700 font-medium"
              >
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                className="w-5 h-5"
                alt="Google"
              />
              Continue with Google
            </motion.button>

            {/* Secure Badge */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-3">
              <ShieldCheck className="w-4 h-4 text-[#009688]" />
              Secure by Alinafe India
            </div>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm mt-5 text-gray-600">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-[#009688] font-semibold cursor-pointer hover:underline"
            >
              Log in
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;

