const jwt = require("jsonwebtoken")
exports.verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if (!token) return res.status(401).json({ error: "Unauthorized: No token provided" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Token Verification Error user:", error.message);
        return res.status(403).json({ error: "Invalid token", message: error.message });
    }
};
exports.verifyProviderToken = (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if (!token) return res.status(401).json({ error: "Unauthorized: No token provided" });
        const decoded = jwt.verify(token, process.env.PROVIDER_JWT_SECRET);
       

        req.provider = decoded;
        
        next();
    } catch (error) {
        console.error("Token Verification Error provider:", error.message);
        return res.status(403).json({ error: "Invalid token", message: error.message });
    }
}