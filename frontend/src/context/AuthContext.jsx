import React, { createContext, useState, useEffect, useContext, useMemo } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase.js";
import axios from "axios";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").trim();
const BASE_URL = API_BASE_URL || "/api";
const IS_DEV = !!import.meta.env.DEV;
const PENDING_SIGNUP_KEY = "alinafe_pending_signup_profile";

const AuthContext = createContext({
  user: null,
  loading: true,
  syncStatus: "idle",
  syncMessage: "",
  setUser: () => {},
  logout: async () => {},
  refreshBackendUser: async () => null,
  getFirebaseToken: async () => "",
});

const authApi = axios.create({
  baseURL: BASE_URL,
});
let lastSyncCache = { uid: null, at: 0, user: null };

const readPendingSignupProfile = (firebaseUser) => {
  try {
    const raw = sessionStorage.getItem(PENDING_SIGNUP_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const expectedEmail = String(parsed?.email || "").toLowerCase().trim();
    const currentEmail = String(firebaseUser?.email || "").toLowerCase().trim();
    if (!expectedEmail || expectedEmail !== currentEmail) return null;
    return {
      contactNumber: String(parsed?.contactNumber || "").trim(),
      category: String(parsed?.category || "").trim(),
    };
  } catch {
    return null;
  }
};

const clearPendingSignupProfile = () => {
  try {
    sessionStorage.removeItem(PENDING_SIGNUP_KEY);
  } catch {
    // ignore storage failures
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState("idle");
  const [syncMessage, setSyncMessage] = useState("");

  useEffect(() => {
    if (IS_DEV && !API_BASE_URL) {
      console.warn(
        "[AuthContext] VITE_API_BASE_URL is not set. Using '/api' proxy fallback."
      );
    }
  }, []);

  const deriveProvider = (firebaseUser) => {
    const providerIds = (firebaseUser?.providerData || [])
      .map((p) => p?.providerId)
      .filter(Boolean);

    const hasGoogle = providerIds.includes("google.com");
    const hasPassword = providerIds.includes("password");

    if (hasGoogle && hasPassword) return "google+password";
    if (hasPassword) return "password";
    if (hasGoogle) return "google";
    return "google";
  };

  const refreshBackendUser = async (firebaseUser) => {
    if (!firebaseUser) return null;
    const now = Date.now();

    if (
      lastSyncCache.uid === firebaseUser.uid &&
      now - lastSyncCache.at < 2500
    ) {
      return lastSyncCache.user;
    }

    const idToken = await firebaseUser.getIdToken(true);
    const pendingSignup = readPendingSignupProfile(firebaseUser);
    const res = await authApi.post(
      "/users/register",
      {
        name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
        photoURL: firebaseUser.photoURL || "",
        ...(pendingSignup?.contactNumber
          ? { contactNumber: pendingSignup.contactNumber }
          : {}),
        ...(pendingSignup?.category ? { category: pendingSignup.category } : {}),
      },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

    const syncedUser = res.data?.user || null;
    if (pendingSignup) clearPendingSignupProfile();
    lastSyncCache = { uid: firebaseUser.uid, at: now, user: syncedUser };
    return syncedUser;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);

      if (!currentUser) {
        setUser(null);
        setSyncStatus("idle");
        setSyncMessage("");
        setLoading(false);
        return;
      }

      // Instant UI auth state from Firebase (no backend wait).
      const initialProvider = deriveProvider(currentUser);
      const firebaseBaseUser = {
        uid: currentUser.uid,
        email: currentUser.email,
        name: currentUser.displayName || currentUser.email?.split("@")[0] || "User",
        photoURL: currentUser.photoURL || "",
        role: "user",
        emailVerified: !!currentUser.emailVerified,
        authProvider: initialProvider,
        hasPassword: initialProvider === "password" || initialProvider === "google+password",
        contactNumber: "",
        category: "",
      };
      setUser(firebaseBaseUser);
      setSyncStatus("syncing");
      setSyncMessage("");
      setLoading(false);

      try {
        const backendUser = await refreshBackendUser(currentUser);

        const mergedUser = {
          uid: currentUser.uid,
          email: currentUser.email,
          name:
            backendUser?.name ||
            currentUser.displayName ||
            currentUser.email?.split("@")[0] ||
            "User",
          photoURL: backendUser?.photoURL || currentUser.photoURL || "",
          role: backendUser?.role || "user",
          emailVerified:
            typeof backendUser?.emailVerified === "boolean"
              ? backendUser.emailVerified
              : !!currentUser.emailVerified,
          authProvider: backendUser?.authProvider || initialProvider,
          hasPassword: !!backendUser?.passwordHash,
          contactNumber: backendUser?.contactNumber || backendUser?.phone || "",
          category: backendUser?.category || "",
        };

        setUser(mergedUser);
        setSyncStatus("ok");
        setSyncMessage("");
      } catch (error) {
        const msg = error.response?.data?.message || error.message || "Backend sync failed";
        console.error(
          "Error syncing user to backend:",
          error.response?.data || msg
        );
        // Fallback: keep Firebase login state in UI even if backend sync fails.
        setSyncStatus("degraded");
        setSyncMessage(msg);
      }
    });

    return () => unsubscribe();
  }, []);

  const getFirebaseToken = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return "";
    return currentUser.getIdToken();
  };

  const logout = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const idToken = await currentUser.getIdToken(true);
        await authApi.post(
          "/users/logout",
          {
            name: currentUser.displayName || currentUser.email?.split("@")[0] || "User",
          },
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          }
        );
      }
    } catch (error) {
      console.error("Logout email trigger failed:", error.response?.data || error.message);
    } finally {
      await signOut(auth);
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      loading,
      syncStatus,
      syncMessage,
      logout,
      refreshBackendUser,
      getFirebaseToken,
    }),
    [user, loading, syncStatus, syncMessage]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
