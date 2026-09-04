import express from "express";
import multer from "multer";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { uploadProductFile } from "../controllers/uploadController.js";

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 },
});

router.post("/product-file", protect, adminOnly, upload.single("file"), uploadProductFile);

export default router;
