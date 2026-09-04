import crypto from "node:crypto";

const uploadToCloudinary = async (file, resourceType) => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        const error = new Error("Cloudinary server configuration is missing");
        error.statusCode = 500;
        throw error;
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const signature = crypto
        .createHash("sha1")
        .update(`timestamp=${timestamp}${apiSecret}`)
        .digest("hex");
    const body = new FormData();
    body.append("file", new Blob([file.buffer], { type: file.mimetype }), file.originalname);
    body.append("api_key", apiKey);
    body.append("timestamp", String(timestamp));
    body.append("signature", signature);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
        method: "POST",
        body,
    });
    const result = await response.json();

    if (!response.ok || !result.secure_url) {
        const error = new Error(result.error?.message || "Cloudinary upload failed");
        error.statusCode = response.status >= 400 && response.status < 500 ? 400 : 502;
        throw error;
    }

    return result.secure_url;
};

export const uploadProductFile = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "A file is required" });
        }

        const resourceType = req.file.mimetype === "application/pdf" ? "raw" : "image";
        const url = await uploadToCloudinary(req.file, resourceType);
        res.json({ secure_url: url });
    } catch (error) {
        next(error);
    }
};
