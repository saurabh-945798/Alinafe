import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext.jsx";
import { auth } from "../../firebase.js";
import { updatePassword } from "firebase/auth";
import { Shield, CheckCircle, AlertCircle, KeyRound } from "lucide-react";
import { Card, CardHeader, CardContent } from "../ui/card.jsx";
import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";
import { Separator } from "../ui/separator.jsx";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").trim() || "/api";

const Settings = () => {
  const { user, getFirebaseToken } = useAuth();
  const [loading, setLoading] = useState(true);

  const [emailVerified, setEmailVerified] = useState(!!user?.emailVerified);
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const [passwordFlowStep, setPasswordFlowStep] = useState("idle");
  const [passwordOtpCode, setPasswordOtpCode] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const authProviderLabel = (() => {
    const provider = user?.authProvider || "";
    if (provider === "google") return "Google";
    if (provider === "password") return "Email + Password";
    if (provider === "google+password") return "Google + Email + Password";
    return "Unknown";
  })();

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
        setEmailVerified(!!profile.emailVerified);
      } catch (error) {
        console.error(
          "Settings load failed:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.uid, getFirebaseToken]);

  const sendEmailVerificationOtp = async () => {
    try {
      setOtpLoading(true);
      const idToken = await getFirebaseToken();
      await axios.post(
        `${API_BASE}/users/email/send-otp`,
        {},
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      Swal.fire({
        title: "OTP sent",
        text: "Check your email",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "OTP failed",
        text: error.response?.data?.message || "Could not send OTP",
        icon: "error",
      });
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyEmailOtp = async () => {
    try {
      setOtpLoading(true);
      const idToken = await getFirebaseToken();
      await axios.post(
        `${API_BASE}/users/email/verify-otp`,
        { otp: otpCode },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      setEmailVerified(true);
      setOtpCode("");
      Swal.fire({
        title: "Email verified",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Verification failed",
        text:
          error.response?.data?.message ||
          "Invalid or expired verification code",
        icon: "error",
      });
    } finally {
      setOtpLoading(false);
    }
  };

  const startPasswordReset = async () => {
    try {
      setPasswordLoading(true);
      const idToken = await getFirebaseToken();
      await axios.post(
        `${API_BASE}/users/password/send-otp`,
        {},
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      setPasswordFlowStep("otp_sent");
      Swal.fire({
        title: "Check your email",
        text: "Password reset OTP sent",
        icon: "success",
        timer: 1600,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Failed",
        text: error.response?.data?.message || "Could not send password reset OTP",
        icon: "error",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const verifyPasswordOtp = async () => {
    try {
      setPasswordLoading(true);
      const idToken = await getFirebaseToken();
      await axios.post(
        `${API_BASE}/users/password/verify-otp`,
        { otp: passwordOtpCode },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      setPasswordFlowStep("otp_verified");
      Swal.fire({
        title: "OTP verified",
        text: "Now set your new password",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Verification failed",
        text: error.response?.data?.message || "Invalid or expired verification code",
        icon: "error",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const resetPassword = async () => {
    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: "Mismatch",
        text: "New password and confirm password must match",
        icon: "error",
      });
      return;
    }

    try {
      setPasswordLoading(true);
      // 1) Update Firebase password first (actual login source).
      if (!auth.currentUser) {
        throw new Error("No active user session");
      }
      await updatePassword(auth.currentUser, newPassword);

      // 2) Finalize backend OTP/reset state + metadata.
      const idToken = await getFirebaseToken();
      await axios.post(
        `${API_BASE}/users/password/reset`,
        { newPassword, confirmPassword },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      setPasswordFlowStep("idle");
      setPasswordOtpCode("");
      setNewPassword("");
      setConfirmPassword("");

      Swal.fire({
        title: "Password updated",
        icon: "success",
        timer: 1600,
        showConfirmButton: false,
      });
    } catch (error) {
      const code = error?.code || "";
      const message =
        code === "auth/requires-recent-login"
          ? "For security, please log in again and then change password."
          : error.response?.data?.message || "Could not reset password";
      Swal.fire({
        title: "Password update failed",
        text: message,
        icon: "error",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-[#009688] text-xl font-semibold">
        Loading settings...
      </div>
    );
  }

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
            <h1 className="text-3xl font-semibold text-[#009688]">
              Account Settings
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Manage your sign-in method, email verification, and password security.
            </p>
          </CardHeader>

          <Separator className="mb-6" />

          <CardContent>
            <div className="bg-[#F9FBFB] rounded-xl p-5 border border-gray-100 shadow-inner mb-5">
              <h3 className="text-[#009688] font-semibold mb-3 flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4" /> Sign-in Method
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                This shows how you currently sign in to your account.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-[#009688]/10 text-[#00796B] border border-[#009688]/20">
                  {authProviderLabel}
                </span>
                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-white border border-gray-200 text-gray-700">
                  {user?.email || "No email found"}
                </span>
              </div>
            </div>

            <div className="bg-[#F9FBFB] rounded-xl p-5 border border-gray-100 shadow-inner mb-5">
              <h3 className="text-[#009688] font-semibold mb-3 flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4" /> Email Verification
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Verify your email to improve account trust and security.
              </p>
              <div className="flex items-center gap-2 mb-3 text-sm">
                {emailVerified ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 font-medium">
                      Verified
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span className="text-amber-700 font-medium">
                      Not Verified
                    </span>
                  </>
                )}
              </div>

              {!emailVerified && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-500">
                    Step 1: Send code to your email. Step 2: Enter the 4-digit code below.
                  </p>
                  <Button
                    onClick={sendEmailVerificationOtp}
                    disabled={otpLoading}
                    className="bg-[#009688] text-white rounded-full"
                  >
                    {otpLoading ? "Sending..." : "Send Verification Code"}
                  </Button>

                  <div className="flex gap-2">
                    <Input
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Enter 4-digit OTP"
                      maxLength={4}
                    />
                    <Button
                      onClick={verifyEmailOtp}
                      disabled={otpLoading || otpCode.length !== 4}
                      className="bg-[#0E9F9F] text-white rounded-full"
                    >
                      Verify Code
                    </Button>
                  </div>
                </div>
              )}
              {emailVerified && (
                <p className="text-xs text-emerald-700">
                  Your email is already verified. No further action is required.
                </p>
              )}
            </div>

            <div className="bg-[#F9FBFB] rounded-xl p-5 border border-gray-100 shadow-inner">
              <h3 className="text-[#009688] font-semibold mb-3 flex items-center gap-2 text-sm">
                <KeyRound className="w-4 h-4" /> Change Password
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Reset password securely using OTP on your email.
              </p>

              {passwordFlowStep === "idle" && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-500">
                    Step 1: Request OTP. Step 2: Verify OTP. Step 3: Set new password.
                  </p>
                  <Button
                    onClick={startPasswordReset}
                    disabled={passwordLoading}
                    className="bg-[#009688] text-white rounded-full"
                  >
                    {passwordLoading ? "Sending OTP..." : "Start Password Reset"}
                  </Button>
                </div>
              )}

              {passwordFlowStep === "otp_sent" && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Check your email and enter the 4-digit OTP to continue.
                  </p>
                  <div className="flex gap-2">
                    <Input
                      value={passwordOtpCode}
                      onChange={(e) => setPasswordOtpCode(e.target.value)}
                      placeholder="Enter password reset OTP"
                      maxLength={4}
                    />
                    <Button
                      onClick={verifyPasswordOtp}
                      disabled={passwordLoading || passwordOtpCode.length !== 4}
                      className="bg-[#0E9F9F] text-white rounded-full"
                    >
                      {passwordLoading ? "Verifying..." : "Verify OTP"}
                    </Button>
                  </div>
                  <Button
                    onClick={startPasswordReset}
                    disabled={passwordLoading}
                    variant="outline"
                    className="rounded-full"
                  >
                    Resend OTP
                  </Button>
                </div>
              )}

              {passwordFlowStep === "otp_verified" && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Create a strong password with at least 8 characters, 1 uppercase letter, and 1 number.
                  </p>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password (8+ chars, 1 uppercase, 1 number)"
                  />
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                  <Button
                    onClick={resetPassword}
                    disabled={passwordLoading || !newPassword || !confirmPassword}
                    className="bg-[#009688] text-white rounded-full"
                  >
                    {passwordLoading ? "Updating..." : "Save New Password"}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Settings;
