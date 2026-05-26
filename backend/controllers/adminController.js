import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import fs from "fs";
import validator from "validator";
import adminModel from "../models/adminModel.js";

const createToken = (admin) => {
    return jwt.sign({ role: "admin", email: admin.email, username: admin.username }, process.env.JWT_SECRET, { expiresIn: "1d" });
}

const ensureAdmin = async () => {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const username = process.env.ADMIN_USERNAME || "admin";

    if (!email || !password) {
        throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
    }

    let admin = await adminModel.findOne({ email });
    if (!admin) {
        const hashedPassword = await bcrypt.hash(password, 10);
        admin = await adminModel.create({ username, email, password: hashedPassword });
    }
    else if (!admin.username) {
        admin.username = username;
        await admin.save();
    }

    return admin;
}

const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    const identifier = String(email || "").trim();

    if (!identifier || !password) {
        return res.status(400).json({ success: false, message: "Email or username and password are required" });
    }

    try {
        await ensureAdmin();
        const admin = await adminModel.findOne(
            validator.isEmail(identifier) ? { email: identifier } : { username: identifier }
        );
        if (!admin) {
            return res.status(401).json({ success: false, message: "Invalid admin credentials" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid admin credentials" });
        }

        const token = createToken(admin);
        res.json({ success: true, token, data: { username: admin.username, email: admin.email, profileImage: admin.profileImage } });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Admin login failed" });
    }
}

const getAdminProfile = async (req, res) => {
    try {
        const admin = await adminModel.findOne({ email: req.admin.email }).select("username email profileImage");
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }
        res.json({ success: true, data: admin });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error" });
    }
}

const updateAdminDetails = async (req, res) => {
    const username = String(req.body.username || "").trim();
    const email = String(req.body.email || "").trim();

    if (username.length < 3) {
        return res.status(400).json({ success: false, message: "Username must be at least 3 characters" });
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
        return res.status(400).json({ success: false, message: "Username can use letters, numbers, dot, underscore, and dash only" });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: "Valid email is required" });
    }

    try {
        const admin = await adminModel.findOne({ email: req.admin.email });
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        const existing = await adminModel.findOne({
            _id: { $ne: admin._id },
            $or: [{ email }, { username }]
        });
        if (existing) {
            return res.status(409).json({ success: false, message: "Email or username already exists" });
        }

        admin.username = username;
        admin.email = email;
        await admin.save();

        const token = createToken(admin);
        res.json({
            success: true,
            message: "Admin details updated",
            token,
            data: { username: admin.username, email: admin.email, profileImage: admin.profileImage }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error" });
    }
}

const changeAdminPassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: "Current and new password are required" });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({ success: false, message: "New password must be at least 8 characters" });
    }

    try {
        const admin = await adminModel.findOne({ email: req.admin.email });
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Current password is incorrect" });
        }

        admin.password = await bcrypt.hash(newPassword, 10);
        await admin.save();
        res.json({ success: true, message: "Password changed" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error" });
    }
}

const updateAdminProfileImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "Profile image is required" });
    }

    try {
        const admin = await adminModel.findOne({ email: req.admin.email });
        if (!admin) {
            fs.unlink(`uploads/${req.file.filename}`, () => { });
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        if (admin.profileImage) {
            fs.unlink(`uploads/${admin.profileImage}`, () => { });
        }

        admin.profileImage = req.file.filename;
        await admin.save();
        res.json({ success: true, message: "Profile photo updated", data: { profileImage: admin.profileImage } });
    } catch (error) {
        fs.unlink(`uploads/${req.file.filename}`, () => { });
        res.status(500).json({ success: false, message: "Error" });
    }
}

export { changeAdminPassword, getAdminProfile, loginAdmin, updateAdminDetails, updateAdminProfileImage };
