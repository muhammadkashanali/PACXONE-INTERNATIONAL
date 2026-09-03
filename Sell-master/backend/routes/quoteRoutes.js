import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

import {
  createQuote,
  getQuotes,
  updateQuoteStatus,
} from "../controllers/quoteController.js";

const router = express.Router();

// Public
router.post("/", createQuote);

// Admin
router.get("/", protect, adminOnly, getQuotes);

router.patch(
  "/:id/status",
  protect,
  adminOnly,
  updateQuoteStatus
);

export default router;