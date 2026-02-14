import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { motion } from "framer-motion";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Loader2,
  LogIn,
  Mail,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";

const Login = () => {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [forgotMsgType, setForgotMsgType] = useState("info");

  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").trim() || "/api";

  const getFriendlyError = (code) => {
    const map = {
      "auth/wrong-password": "Invalid email or password",
      "auth/user-not-found": "Invalid email or password",
      "auth/invalid-credential": "Invalid email or password",
      "auth/invalid-email": "Please enter a valid email address",
      "auth/too-many-requests": "Too many attempts. Please try again later",
      "auth/popup-closed-by-user": "Google login popup was closed",
    };
    return map[code] || "Login failed. Please try again.";
  };

  const normalizeEmail = (value) => value.trim().toLowerCase();

  const getEmailSignInMethods = async (email) => {
    const sanitizedEmail = normalizeEmail(email);
    if (!sanitizedEmail) return [];
    return fetchSignInMethodsForEmail(auth, sanitizedEmail);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());

  const resolveEmailFromIdentifier = async (identifier) => {
    const normalized = String(identifier || "").trim();
    if (isEmail(normalized)) return normalized.toLowerCase();

    const res = await axios.post(`${API_BASE}/users/login/resolve`, {
      identifier: normalized,
    });

    if (!res.data?.email) {
      throw new Error("Invalid email/phone or password");
    }
    return String(res.data.email).toLowerCase();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const loginEmail = await resolveEmailFromIdentifier(form.identifier);
      await signInWithEmailAndPassword(
        auth,
        loginEmail,
        form.password
      );
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || getFriendlyError(err?.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setSuccess("");
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      setError(getFriendlyError(err?.code));
    }
  };

  const handleForgotPassword = async () => {
    setForgotMsg("");
    setForgotMsgType("info");
    const email = normalizeEmail(forgotEmail);

    if (!email) {
      setForgotMsgType("error");
      setForgotMsg("Please enter your email.");
      return;
    }

    setResetLoading(true);
    try {
      const methods = await getEmailSignInMethods(email);
      const hasPassword = methods.includes("password");
      const hasGoogle = methods.includes("google.com");

      // Firebase Console checklist:
      // 1) Authentication -> Templates -> Password reset enabled
      // 2) Authorized domains include production domain
      // 3) Optional: actionCodeSettings.url points to /login?reset=1
      // Try reset for password users, and also when provider detection is inconclusive.
      // Some Firebase project settings can return an empty methods array.
      if (hasPassword || methods.length === 0) {
        await sendPasswordResetEmail(auth, email, {
          url: `${window.location.origin}/login?reset=1`,
        });
        setForgotMsgType("success");
        setForgotMsg("If an account exists, you'll receive an email shortly.");
      } else if (hasGoogle && !hasPassword) {
        setForgotMsgType("info");
        setForgotMsg("This account uses Google Sign-In. Please continue with Google.");
      } else {
        // Avoid account enumeration leaks.
        setForgotMsgType("success");
        setForgotMsg("If an account exists, you'll receive an email shortly.");
      }
    } catch (err) {
      const code = err?.code;
      if (code === "auth/invalid-email") {
        setForgotMsgType("error");
        setForgotMsg("Please enter a valid email.");
      } else if (code === "auth/too-many-requests") {
        setForgotMsgType("error");
        setForgotMsg("Too many attempts. Please try again later.");
      } else {
        // Secure default: do not leak details.
        setForgotMsgType("success");
        setForgotMsg("If an account exists, you'll receive an email shortly.");
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white/80 backdrop-blur-xl border border-[#009688]/10 rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="absolute left-0 top-0 h-full w-1.5 bg-[#009688]" />
          {/* ================= LEFT BRAND PANEL ================= */}
          <div className="hidden md:flex flex-col justify-between p-10 bg-white text-[#0E9F9F] relative border-r border-[#0E9F9F]/10">
            <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-[#009688]/10 blur-3xl pointer-events-none" />
            <div className="flex-1 flex flex-col items-center justify-center -mt-8 text-center">
              {/* Wordmark + tagline */}
              <div className="flex flex-col items-center gap-2 mb-8 -translate-x-8">
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#009688"
                  viewBox="0 0 24 24"
                  className="w-8 h-8 flex-shrink-0 -mt-[4px] -mr-[1px] transform scale-x-[-1]"
                >
                  <path d="M21 11l-9-9H3v9l9 9 9-9zM7 7a2 2 0 110-4 2 2 0 010 4z" />
                </svg> */}
                <div className="flex flex-col leading-tight">
                  <h1 className="text-5xl  font-extrabold text-[#0E9F9F]">
                    Alinafe
                  </h1>
                  <p className="text-lg font-semibold text-[#E94F37] -mt-1">
                    Buy &bull; Sell &bull; Connect
                  </p>
                </div>
              </div>

              {/* Benefits */}
              <ul className="space-y-6 text-xl text-gray-700 self-start translate-x-20">
                <li className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-[#0E9F9F]" />
                  Verified local marketplace
                </li>
                <li className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-[#0E9F9F]" />
                  Secure chats & trusted sellers
                </li>
                <li className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-[#0E9F9F]" />
                  Built for Indian communities
                </li>
              </ul>
            </div>

            {/* Testimonial / trust badge */}
            <div className="text-base text-gray-500 border-t border-[#0E9F9F]/10 pt-4">
              "Alinafe makes local buying simple and safe."
              <br />
              <span className="text-gray-700 font-medium">
              - Community Member
              </span>
            </div>
          </div>

          {/* ================= RIGHT FORM PANEL ================= */}
          <div className="p-8 sm:p-10">
            {/* Heading */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800">
                Log in to Alinafe India
              </h1>
              <p className="text-base text-gray-500">
                Login to continue buying and selling
              </p>
               
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <>
                {/* Email / Phone */}
                <div>
                  <label className="text-base font-medium text-gray-600 mb-1 block">
                    Email or Phone Number
                  </label>
                  <div className="relative rounded-xl border border-[#009688]/15 bg-[#F8FFFD] shadow-sm">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#009688]" />
                    <input
                      type="text"
                      name="identifier"
                      value={form.identifier}
                      onChange={handleChange}
                      placeholder="Email or Phone Number"
                      required
                      className="w-full pl-10 pr-3 py-3 rounded-xl bg-transparent text-base focus:ring-2 focus:ring-[#009688]/30 focus:outline-none"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Mobile login: <span className="font-medium text-[#009688]">+91</span> is default. Enter only your 10-digit number.
                  </p>
                </div>
                {/* Password */}
                <div>
                  <label className="text-base font-medium text-gray-600 mb-1 block">
                    Password
                  </label>
                  <div className="relative rounded-xl border border-[#009688]/15 bg-[#F8FFFD] shadow-sm">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#009688]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      className="w-full pl-10 pr-3 py-3 rounded-xl bg-transparent text-base focus:ring-2 focus:ring-[#009688]/30 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#009688] hover:opacity-80"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Password hint */}
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                    <span>Password strength</span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#009688]" />
                      <span className="h-2 w-2 rounded-full bg-[#009688]/50" />
                      <span className="h-2 w-2 rounded-full bg-gray-200" />
                    </span>
                  </div>
                </div>
              </>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between text-base">
                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" className="accent-[#009688]" />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (isEmail(form.identifier)) {
                      setForgotEmail(form.identifier || "");
                    } else {
                      setForgotEmail("");
                    }
                    setForgotMsg("");
                    setForgotMsgType("info");
                    setForgotOpen(true);
                  }}
                  className="text-[#009688] text-base font-medium hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Error */}

              {error && (
                <p className="text-red-600 text-sm font-medium text-center bg-red-50 py-2 rounded-lg border border-red-100">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-emerald-700 text-sm font-medium text-center bg-emerald-50 py-2 rounded-lg border border-emerald-100">
                  {success}
                </p>
              )}

              {/* Login button */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#009688] to-[#14B8A6]
                           text-white text-lg font-semibold rounded-xl shadow-md
                           hover:opacity-90 transition"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Logging in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <LogIn className="w-5 h-5" />
                    Login
                  </span>
                )}
              </motion.button>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-600">
                <span className="inline-flex items-center gap-1 rounded-full border border-[#009688]/20 bg-[#F8FFFD] px-3 py-1">
                  <ShieldCheck className="w-4 h-4 text-[#009688]" />
                  Secure login
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-[#009688]/20 bg-[#F8FFFD] px-3 py-1">
                  OTP protected
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-[#009688]/20 bg-[#F8FFFD] px-3 py-1">
                  Privacy first
                </span>
              </div>

              {/* Divider */}
              <div className="flex items-center my-2">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-2 text-base text-gray-500">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              {/* Google */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 py-3
                           border border-[#009688]/40 rounded-xl bg-white
                           hover:bg-[#009688]/5 transition text-gray-700 text-base font-medium"
              >
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                  className="w-5 h-5"
                  alt="Google"
                />
                Continue with Google
              </motion.button>
            </form>

            {/* Signup */}
            <p className="text-center text-base mt-6 text-gray-600">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-[#009688] font-semibold cursor-pointer hover:underline"
              >
                Sign up
              </span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Forgot Password Modal */}
      {forgotOpen && (
        <div className="fixed inset-0 z-[70] bg-black/45 flex items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-[#009688]/20 shadow-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-800">Reset Password</h3>
            <p className="text-base text-gray-500 mt-1">
              Enter your email to receive reset instructions.
            </p>

            <div className="mt-4">
              <label className="text-base font-medium text-gray-600 mb-1 block">
                Email address
              </label>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-3 rounded-xl border border-[#009688]/20 bg-[#F8FFFD] focus:ring-2 focus:ring-[#009688]/30 focus:outline-none"
              />
            </div>

            {forgotMsg && (
              <p
                className={`mt-3 text-sm font-medium rounded-lg px-3 py-2 border ${
                  forgotMsgType === "error"
                    ? "text-red-700 bg-red-50 border-red-100"
                    : forgotMsgType === "success"
                    ? "text-emerald-700 bg-emerald-50 border-emerald-100"
                    : "text-[#0E9F9F] bg-[#EAFBFA] border-[#BFEDEA]"
                }`}
              >
                {forgotMsg}
              </p>
            )}

            <p className="mt-3 text-sm text-gray-500">
              Check spam/promotions folder. Signed up with Google? Use Google Sign-In.
            </p>

            <div className="mt-5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setForgotOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={resetLoading}
                className="flex-1 py-2.5 rounded-xl bg-[#009688] text-white font-medium hover:bg-[#00796B] disabled:opacity-60"
              >
                {resetLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </div>
 
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

