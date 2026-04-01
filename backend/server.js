// 🌐 server.js — Alinafe + Zitheke Real-Time Chat + Ads Backend

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";

import connectDB from "./config/db.js";

// ROUTES
import adRoutes from "./routes/adsRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import adminRoutes from "./routes/admin.routes.js";
import adminMessageRoutes from "./routes/adminMessageRoutes.js";
import reportRoutes from "./routes/report.routes.js";
import adminAnalyticsRoutes from "./routes/adminAnalyticsRoutes.js";
import sellerStatsRoutes from "./routes/sellerStatsRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import trendingRoutes from "./routes/trending.routes.js";
import publicSellerRoutes from "./routes/publicSellerRoutes.js";
import adminAuthRoutes from "./routes/adminAuth.routes.js";
import authMiddleware from "./middlewares/authMiddleware.js";
import adminReportRoutes from "./routes/adminReports.routes.js";
import searchRoutes from "./routes/searchRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import emailRoutes from "./routes/email.routes.js";
import phoneAuthRoutes from "./routes/phoneAuth.routes.js";
import ogPreviewRoutes from "./routes/ogPreview.routes.js";
import { getDiskFreeSpace } from "./utils/diskUtils.js";





  



// MODELS
import Message from "./models/Message.js";
import Conversation from "./models/Conversation.js";
import User from "./models/User.js";

// Presence utilities
import {
  setUserOnline,
  setUserOffline,
  setTyping,
  getSocketId
} from "./Services/presenceService.js";

let morganMiddleware = null;
try {
  const morganModule = await import("morgan");
  morganMiddleware = morganModule.default || morganModule;
} catch {
  console.warn("[server] morgan not installed, request logging middleware disabled.");
}

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
app.set("trust proxy", 1);

const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://alinafe.in",
  "https://www.alinafe.in",
  "https://admin.alinafe.in",
  "https://api.alinafe.com",
];

const envAllowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins =
  envAllowedOrigins.length > 0 ? envAllowedOrigins : defaultAllowedOrigins;
const allowedOriginSet = new Set(allowedOrigins);

// BODY PARSERS
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
const accessLogStream = fs.createWriteStream(path.join(logDir, "access.log"), {
  flags: "a",
});
const errorLogStream = fs.createWriteStream(path.join(logDir, "error.log"), {
  flags: "a",
});

if (morganMiddleware) {
  morganMiddleware.token("real-ip", (req) => req.ip || "");
  app.use(
    morganMiddleware(
      ":date[iso] :real-ip :method :url :status :res[content-length] - :response-time ms",
      { stream: accessLogStream }
    )
  );
  app.use(morganMiddleware("dev"));
}

// 🌍 GLOBAL CORS — FINAL FIXED VERSION
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOriginSet.has(origin)) {
      return callback(null, true);
    }
    console.warn(
      JSON.stringify({
        ts: new Date().toISOString(),
        level: "warn",
        msg: "cors_blocked",
        origin,
      })
    );
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));





// STATIC UPLOADS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });

// STATIC FILES
app.use(
  "/uploads",
  express.static(uploadsPath, {
    etag: true,
    maxAge: "30d",
    fallthrough: false,
  })
);

/* =========================
   PUBLIC / AUTH ROUTES
   (NO JWT REQUIRED)
========================= */
/* =========================
   🔐 ADMIN AUTH (NO JWT)
========================= */
app.use("/api/admin/auth", adminAuthRoutes);

/* =========================
   🌍 PUBLIC ROUTES (NO JWT)
========================= */
app.use("/api/ads", adRoutes);
app.use("/api/users", userRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin/reports", adminReportRoutes); // ADMIN
app.use("/api/trending", trendingRoutes);
app.use("/api/public/sellers", publicSellerRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/contact", contactRoutes);

app.use("/api/email", emailRoutes);
app.use("/api/auth/phone", phoneAuthRoutes);



/* =========================
   🔐 PROTECTED ADMIN ROUTES
   (JWT + ROLE REQUIRED)
========================= */

/**
 * ⚠️ IMPORTANT ORDER
 * analytics → messages → core admin
 */

// 📊 ADMIN ANALYTICS (MOST SPECIFIC)
app.use("/api/admin", authMiddleware, adminAnalyticsRoutes);

// 💬 ADMIN MESSAGES
app.use("/api/admin", authMiddleware, adminMessageRoutes);

// 🛠️ ADMIN CORE (users, ads, approvals, etc.)
app.use("/api/admin", authMiddleware, adminRoutes);

/* =========================
   🧑‍💼 SELLER ROUTES
========================= */
app.use("/api/sellers", sellerStatsRoutes);
app.use("/api/sellers", sellerRoutes);

// Crawler OG preview route (non-api), keep before final 404.
app.use("/", ogPreviewRoutes);

/* =========================
   🏠 ROOT & 404
========================= */
app.get("/", (req, res) => {
  res.send("🔥 Alinafe + Zitheke API Running");
});

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

app.use((err, req, res, next) => {
  errorLogStream.write(
    `${JSON.stringify({
      ts: new Date().toISOString(),
      level: "error",
      msg: "unhandled_route_error",
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      error: err?.message || String(err),
      stack: err?.stack || "",
    })}\n`
  );

  if (res.headersSent) return next(err);
  return res
    .status(500)
    .json({ success: false, message: "Internal server error" });
});


// ===============================
//       SOCKET.IO v4.8.1
// ===============================

// ===============================
//       SOCKET.IO (FIXED)
// ===============================

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // allow server-to-server or curl
      if (!origin) return callback(null, true);

      if (allowedOriginSet.has(origin)) {
        return callback(null, true);
      }

      console.warn(
        JSON.stringify({
          ts: new Date().toISOString(),
          level: "warn",
          msg: "socket_cors_blocked",
          origin,
        })
      );
      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  },
  transports: ["websocket", "polling"], // 🔥 IMPORTANT
});


// 🔌 Attach io to req (for controllers)
app.use((req, res, next) => {
  req.io = io;
  next();
});


// AUTH SOCKET
io.use((socket, next) => {
  const uid = socket.handshake.auth?.uid;
  if (!uid) return next(new Error("Missing UID"));
  socket.userId = uid;
  next();
});

// ===============================
//       SOCKET CONNECTION
// ===============================
io.on("connection", async (socket) => {
  const userId = socket.userId;

  console.log(`🟢 User Connected: ${userId}`);
  setUserOnline(userId, socket.id);

  await User.updateOne({ uid: userId }, { lastSeen: new Date() });

  // 🔹 Personal room (for direct delivery)
  socket.join(userId);

  // =========================================================
  // 📥 Deliver Offline Messages
  // =========================================================
  const offline = await Message.find({
    receiverId: userId,
    isDelivered: false,
  }).sort({ createdAt: 1 });

  if (offline.length > 0) {
    socket.emit("message:batch-deliver", offline);

    await Message.updateMany(
      { receiverId: userId, isDelivered: false },
      { isDelivered: true, deliveredAt: new Date() }
    );
  }

  // =========================================================
  // 🏠 JOIN / LEAVE CONVERSATION ROOM
  // =========================================================
  socket.on("conversation:join", ({ conversationId }) => {
    if (conversationId) socket.join(conversationId);
  });

  socket.on("conversation:leave", (conversationId) => {
    if (conversationId) socket.leave(conversationId);
  });

  // =========================================================
  // ✍️ TYPING INDICATOR
  // =========================================================
  socket.on("typing:update", ({ fromId, toId, isTyping }) => {
    setTyping(fromId, toId, isTyping);

    const receiverSocket = getSocketId(toId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("typing:status", {
        fromId,
        toId,
        isTyping,
      });
    }
  });

  // =========================================================
  // 📤 SEND MESSAGE (TEXT / MEDIA)
  // =========================================================
  socket.on("message:send", async (msg, cb = () => {}) => {
    try {
      // 🔐 BASIC VALIDATION
      if (!msg || !msg.senderId || !msg.receiverId) {
        return cb({ success: false, error: "Invalid payload" });
      }
  
      // 🔐 AUTH CHECK
      if (msg.senderId !== userId) {
        return cb({ success: false, error: "Unauthorized" });
      }
  
      const {
        senderId,
        receiverId,
        senderName,
        senderEmail,
        senderPhoto,
        receiverName,
        receiverEmail,
        receiverPhoto,
        adId,
        adTitle,
        productTitle,
        productImage,
        message,
        type,
        mediaUrl,
        mediaName,
        mediaThumbnail,
        clientTempId,
      } = msg;
  
      /* -------------------------------
         PREVIEW TEXT
      -------------------------------- */
      const effectiveTitle = productTitle || adTitle || "Listing";
      const effectiveImage = productImage || "";
      const effectiveAdId = adId || null;

      let previewText = message || "";
      if (type && type !== "text") {
        if (type === "image") previewText = "[Photo]";
        else if (type === "video") previewText = "[Video]";
        else if (type === "pdf") previewText = mediaName || "[PDF]";
        else previewText = mediaName || "[Attachment]";
      }
  
      /* -------------------------------
         FIND / CREATE CONVERSATION
      -------------------------------- */
      let convo = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
        adId: effectiveAdId,
      });
  
      if (!convo) {
        convo = await Conversation.create({
          participants: [senderId, receiverId],
          adId: effectiveAdId,
          productTitle: effectiveTitle,
          productImage: effectiveImage,
          unreadCounts: {
            [senderId]: 0,
            [receiverId]: 1,
          },
          lastMessage: previewText,
          lastSenderId: senderId,
          updatedAtSort: new Date(),
        });
      } else {
        convo.lastMessage = previewText;
        convo.lastSenderId = senderId;
        convo.updatedAtSort = new Date();
        convo.unreadCounts[receiverId] =
          (convo.unreadCounts[receiverId] || 0) + 1;
        await convo.save();
      }
  
      /* -------------------------------
         SAVE MESSAGE
      -------------------------------- */
      const saved = await Message.create({
        conversationId: convo._id,
        senderId,
        receiverId,
        senderName,
        senderEmail,
        senderPhoto,
        receiverName,
        receiverEmail,
        receiverPhoto,
        adTitle: effectiveTitle,
        message: message || "",
        type: type || "text",
        mediaUrl: mediaUrl || "",
        mediaName: mediaName || "",
        mediaThumbnail: mediaThumbnail || "",
        clientTempId: clientTempId || null,
        isRead: false,
        isDelivered: false,
      });
  
      /* -------------------------------
         DELIVER TO RECEIVER
         (FIXED EMIT TARGET)
      -------------------------------- */
      const receiverSocketId = getSocketId(receiverId);
  
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("message:new", saved);
  
        await Message.updateOne(
          { _id: saved._id },
          { isDelivered: true, deliveredAt: new Date() }
        );
      }
  
      // ✅ ALWAYS ACK
      cb({ success: true, message: saved });
    } catch (err) {
      console.error("❌ message:send error:", err);
      cb({ success: false, error: err.message });
    }
  });
  

  // =========================================================
  // 🗑️ DELETE MESSAGE FOR EVERYONE (🔥 MAIN FIX)
  // =========================================================
  socket.on("message:delete-everyone", async (messageId) => {
    console.log("🔥 SOCKET DELETE EVENT HIT:", messageId, "by", userId);

    try {
      const msg = await Message.findById(messageId);
      if (!msg) return;

      // 🔐 Only sender can delete for everyone
      if (msg.senderId !== userId) return;

      // 🧹 SOFT DELETE (DB LEVEL)
      msg.isDeleted = true;
      msg.message = "";
      msg.mediaUrl = "";
      msg.type = "deleted";
      msg.deletedAt = new Date();

      await msg.save();

      // 🔊 Notify both users in conversation room
      io.to(msg.conversationId.toString()).emit(
        "message:deleted-everyone",
        messageId
      );
    } catch (err) {
      console.error("❌ delete-everyone error:", err);
    }
  });

  // =========================================================
  // 👁️ MESSAGE SEEN
  // =========================================================
  socket.on("message:seen", async ({ conversationId, userId }) => {
    await Message.updateMany(
      { conversationId, receiverId: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    io.to(conversationId).emit("message:update-seen", { userId });
  });

  // =========================================================
  // 🔴 DISCONNECT
  // =========================================================
  socket.on("disconnect", async () => {
    console.log(`🔴 User disconnected: ${userId}`);
    setUserOffline(userId);

    await User.updateOne({ uid: userId }, { lastSeen: new Date() });
  });
});


// START SERVER
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`✅ Alinafe/Zitheke Server running on PORT ${PORT}`)
);

// Graceful Shutdown
process.on("SIGINT", async () => {
  console.log("🔻 Closing Server...");
  await mongoose.connection.close();
  process.exit(0);
});

const logDiskSpace = async () => {
  try {
    const disk = await getDiskFreeSpace("/");
    console.log(
      JSON.stringify({
        ts: new Date().toISOString(),
        level: "info",
        msg: "disk_space",
        ...disk,
      })
    );
  } catch (error) {
    console.error(
      JSON.stringify({
        ts: new Date().toISOString(),
        level: "error",
        msg: "disk_space_check_failed",
        error: error?.message || String(error),
      })
    );
  }
};

logDiskSpace();
setInterval(logDiskSpace, 24 * 60 * 60 * 1000);

process.on("unhandledRejection", (reason) => {
  console.error(
    JSON.stringify({
      ts: new Date().toISOString(),
      level: "error",
      msg: "unhandled_rejection",
      error: reason?.message || String(reason),
      stack: reason?.stack || "",
    })
  );
});

process.on("uncaughtException", (error) => {
  console.error(
    JSON.stringify({
      ts: new Date().toISOString(),
      level: "fatal",
      msg: "uncaught_exception",
      error: error?.message || String(error),
      stack: error?.stack || "",
    })
  );

  setTimeout(async () => {
    try {
      await mongoose.connection.close();
    } catch {}
    process.exit(1);
  }, 1500);
});
