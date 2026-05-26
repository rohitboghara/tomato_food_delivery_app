import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: "" },
}, { timestamps: true });

const adminModel = mongoose.models.admin || mongoose.model("admin", adminSchema);
export default adminModel;
