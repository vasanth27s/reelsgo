import express from "express";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";

// ===============================
// ROUTES
// ===============================
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";
import mediaRoutes from "./routes/media.routes.js";
import postRoutes from "./routes/posts.routes.js";
import followRoutes from "./routes/follows.routes.js";
import storyRoutes from "./routes/stories.routes.js";
import reelRoutes from "./routes/reels.routes.js";
import messageRoutes from "./routes/messages.routes.js";
import notificationRoutes from "./routes/notifications.routes.js";
import noteRoutes from "./routes/notes.routes.js";
import reportRoutes from "./routes/reports.routes.js";

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// ===============================
// ENVIRONMENT
// ===============================
const PORT = process.env.PORT || 5000;

const CLIENT_URL =
  process.env.CLIENT_URL || "http://localhost:5173";

const MONGO_URI = process.env.MONGO_URI;

const JWT_SECRET = process.env.JWT_SECRET;

// ===============================
// BASIC ENV CHECK
// ===============================
if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing in backend/.env");
  process.exit(1);
}

if (!JWT_SECRET) {
  console.error("❌ JWT_SECRET is missing in backend/.env");
  process.exit(1);
}

// ===============================
// CORS
// ===============================
const allowedOrigins = [
  CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests such as Postman/server-side requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn("⚠️ CORS blocked:", origin);

      return callback(
        new Error("Not allowed by CORS")
      );
    },
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS"
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization"
    ]
  })
);

// ===============================
// BODY PARSING
// ===============================
app.use(
  express.json({
    limit: "20mb"
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "20mb"
  })
);

// ===============================
// REQUEST LOGGER
// ===============================
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} ${req.method} ${req.originalUrl}`
  );

  next();
});

// ===============================
// ROOT
// ===============================
app.get("/", (req, res) => {
  res.json({
    ok: true,
    name: "VK Social API",
    message: "VK Social backend is running",
    version: "1.0.0"
  });
});

// ===============================
// HEALTH CHECK
// ===============================
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "VK Social",
    database:
      mongoose.connection.readyState === 1
        ? "MongoDB connected"
        : "MongoDB not connected",
    timestamp: new Date().toISOString()
  });
});

// ===============================
// API ROUTES
// ===============================

// Authentication
app.use(
  "/api/auth",
  authRoutes
);

// Users / profiles / search / avatars
app.use(
  "/api/users",
  userRoutes
);

// MongoDB media
app.use(
  "/api/media",
  mediaRoutes
);

// Posts
app.use(
  "/api/posts",
  postRoutes
);

// Follow / followers / requests
app.use(
  "/api/follows",
  followRoutes
);

// Stories / story views
app.use(
  "/api/stories",
  storyRoutes
);

// Reels
app.use(
  "/api/reels",
  reelRoutes
);

// Messages / conversations
app.use(
  "/api/messages",
  messageRoutes
);

// Notifications
app.use(
  "/api/notifications",
  notificationRoutes
);

// Notes
app.use(
  "/api/notes",
  noteRoutes
);

// Reports
app.use(
  "/api/reports",
  reportRoutes
);

// ===============================
// 404 HANDLER
// ===============================
app.use((req, res) => {
  res.status(404).json({
    message: "API endpoint not found",
    method: req.method,
    path: req.originalUrl
  });
});

// ===============================
// GLOBAL ERROR HANDLER
// ===============================
app.use((err, req, res, next) => {
  console.error("=================================");
  console.error("SERVER ERROR");
  console.error(err);
  console.error("=================================");

  // CORS error
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      message: "CORS blocked this request"
    });
  }

  // Multer/file upload error
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      message: "Uploaded file is too large"
    });
  }

  res.status(err.status || 500).json({
    message:
      err.message || "Internal server error"
  });
});

// ===============================
// SOCKET.IO
// ===============================
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: [
      "GET",
      "POST"
    ]
  },
  transports: [
    "websocket",
    "polling"
  ]
});

// ===============================
// SOCKET.IO CONNECTIONS
// ===============================
io.on("connection", (socket) => {
  console.log(
    "🟢 Socket connected:",
    socket.id
  );

  // --------------------------------
  // Join user's personal room
  // --------------------------------
  socket.on("join_user", (userId) => {
    if (!userId) return;

    const room = `user:${userId}`;

    socket.join(room);

    console.log(
      `👤 User ${userId} joined ${room}`
    );
  });

  // --------------------------------
  // Join conversation room
  // --------------------------------
  socket.on(
    "join_conversation",
    (conversationId) => {
      if (!conversationId) return;

      const room =
        `conversation:${conversationId}`;

      socket.join(room);

      console.log(
        `💬 Socket ${socket.id} joined ${room}`
      );
    }
  );

  // --------------------------------
  // Leave conversation
  // --------------------------------
  socket.on(
    "leave_conversation",
    (conversationId) => {
      if (!conversationId) return;

      const room =
        `conversation:${conversationId}`;

      socket.leave(room);

      console.log(
        `🚪 Socket ${socket.id} left ${room}`
      );
    }
  );

  // --------------------------------
  // Typing
  // --------------------------------
  socket.on("typing", (data) => {
    if (!data?.conversationId) {
      return;
    }

    socket
      .to(`conversation:${data.conversationId}`)
      .emit("typing", {
        ...data
      });
  });

  // --------------------------------
  // Stop typing
  // --------------------------------
  socket.on("stop_typing", (data) => {
    if (!data?.conversationId) {
      return;
    }

    socket
      .to(`conversation:${data.conversationId}`)
      .emit("stop_typing", {
        ...data
      });
  });

  // --------------------------------
  // Message sent through socket
  // --------------------------------
  socket.on("message_sent", (data) => {
    if (!data?.conversationId) {
      return;
    }

    socket
      .to(`conversation:${data.conversationId}`)
      .emit("message_received", data);
  });

  // --------------------------------
  // Message seen
  // --------------------------------
  socket.on("message_seen", (data) => {
    if (!data?.conversationId) {
      return;
    }

    socket
      .to(`conversation:${data.conversationId}`)
      .emit("message_seen", data);
  });

  // --------------------------------
  // Message reaction
  // --------------------------------
  socket.on("message_reaction", (data) => {
    if (!data?.conversationId) {
      return;
    }

    socket
      .to(`conversation:${data.conversationId}`)
      .emit("message_reaction", data);
  });

  // --------------------------------
  // Story viewed
  // --------------------------------
  socket.on("story_viewed", (data) => {
    if (!data?.storyId) {
      return;
    }

    // Broadcast story-view update
    socket.emit("story_viewed", data);
  });

  // --------------------------------
  // Notification
  // --------------------------------
  socket.on("notification", (data) => {
    if (!data?.userId) {
      return;
    }

    io
      .to(`user:${data.userId}`)
      .emit("notification", data);
  });

  // --------------------------------
  // Disconnect
  // --------------------------------
  socket.on("disconnect", (reason) => {
    console.log(
      `🔴 Socket disconnected: ${socket.id}`,
      reason
    );
  });
});

// ===============================
// MONGODB CONNECTION
// ===============================
mongoose.set(
  "strictQuery",
  true
);

mongoose.connection.on(
  "connected",
  () => {
    console.log("🟢 MongoDB connected");
    console.log(
      "Database:",
      mongoose.connection.name
    );
  }
);

mongoose.connection.on(
  "error",
  (error) => {
    console.error(
      "❌ MongoDB error:",
      error.message
    );
  }
);

mongoose.connection.on(
  "disconnected",
  () => {
    console.log(
      "🟡 MongoDB disconnected"
    );
  }
);

// ===============================
// START SERVER
// ===============================
async function startServer() {
  try {
    console.log(
      "---------------------------------"
    );

    console.log(
      "🚀 Starting VK Social server..."
    );

    console.log(
      "MongoDB connecting..."
    );

    await mongoose.connect(
      MONGO_URI,
      {
        serverSelectionTimeoutMS: 10000
      }
    );

    console.log(
      "---------------------------------"
    );

    server.listen(
      PORT,
      "0.0.0.0",
      () => {
        console.log(
          `🚀 VK Social API running on http://localhost:${PORT}`
        );

        console.log(
          `🌐 Frontend: ${CLIENT_URL}`
        );

        console.log(
          `❤️ Health: http://localhost:${PORT}/api/health`
        );

        console.log(
          `💬 Socket.IO enabled`
        );

        console.log(
          "---------------------------------"
        );
      }
    );
  } catch (error) {
    console.error(
      "================================="
    );

    console.error(
      "❌ SERVER STARTUP FAILED"
    );

    console.error(
      error.message
    );

    console.error(
      "================================="
    );

    process.exit(1);
  }
}

// ===============================
// GRACEFUL SHUTDOWN
// ===============================
async function shutdown(signal) {
  console.log(
    `\n${signal} received. Shutting down...`
  );

  server.close(async () => {
    try {
      await mongoose.connection.close();

      console.log(
        "MongoDB connection closed."
      );

      console.log(
        "VK Social server stopped."
      );

      process.exit(0);
    } catch (error) {
      console.error(
        "Shutdown error:",
        error.message
      );

      process.exit(1);
    }
  });
}

process.on(
  "SIGINT",
  () => shutdown("SIGINT")
);

process.on(
  "SIGTERM",
  () => shutdown("SIGTERM")
);

// ===============================
// START
// ===============================
startServer();