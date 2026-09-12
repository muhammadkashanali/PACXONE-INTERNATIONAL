import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import quoteRoutes from "./routes/quoteRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

const app = express();

// 1. Single, unified CORS configuration
const corsOptions = {
  origin: true, // Echoes the requesting origin (allows admin, public site, localhost)
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// 2. Body Parsing (keep 10mb limit for image/file uploads)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 3. Health & Root Check Endpoints
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    message: "Pacxone API is running.",
    catalogSeeding: false,
  });
});

app.get("/", (_req, res) => {
  res.status(200).json({
    ok: true,
    message: "Pacxone API is running.",
    catalogSeeding: false,
  });
});

// 4. API Routes (Supports calls with OR without /api prefix)
app.use(["/api/auth", "/auth"], authRoutes);
app.use(["/api/categories", "/categories"], categoryRoutes);
app.use(["/api/products", "/products"], productRoutes);
app.use(["/api/quotes", "/quotes"], quoteRoutes);
app.use(["/api/uploads", "/uploads"], uploadRoutes);

// 5. Global Error Handler
app.use((err, _req, res, _next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal server error",
  });
});

export default app;