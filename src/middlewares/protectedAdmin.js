const jwt = require("jsonwebtoken")
exports.protectedAdmin = (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if (!token) return res.status(401).json({ error: "Unauthorized: No token provided" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        

        if (req.user.role == 'admin') {
            next();
        }
        else {
            return res.status(400).json({ error: "You are not allowed to proceed this operation!" })
        }
    } catch (error) {
        console.error("Token Verification Error:", error.message);
        return res.status(403).json({ error: "Invalid token", message: error.message });
    }
};