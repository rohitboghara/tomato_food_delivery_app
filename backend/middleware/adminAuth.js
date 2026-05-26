import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
        return res.status(401).json({ success: false, message: "Admin login required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "admin") {
            return res.status(403).json({ success: false, message: "Admin access denied" });
        }
        req.admin = { email: decoded.email };
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid admin token" });
    }
}

export default adminAuth;
