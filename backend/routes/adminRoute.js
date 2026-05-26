import express from "express";
import fs from "fs";
import multer from "multer";
import { changeAdminPassword, getAdminProfile, loginAdmin, updateAdminDetails, updateAdminProfileImage } from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";

const adminRouter = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        fs.mkdirSync("uploads", { recursive: true });
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}admin_${file.originalname}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only image uploads are allowed"));
        }
        cb(null, true);
    }
});

adminRouter.post("/login", loginAdmin);
adminRouter.get("/profile", adminAuth, getAdminProfile);
adminRouter.post("/details", adminAuth, updateAdminDetails);
adminRouter.post("/password", adminAuth, changeAdminPassword);
adminRouter.post("/profile-image", adminAuth, upload.single("image"), updateAdminProfileImage);

export default adminRouter;
