const jwt = require("jsonwebtoken");
const jwtSecret = process.env.SECRET;

// check login
exports.authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect("/login");
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.store = decoded;
        next();
    } catch (err) {
        console.log(err);
        return res.redirect("/login");
        // return res.status(401).json({ message: "Unauthorized" });
    }
}

exports.authAdmin = (req, res, next) => {
    try {
        const { role } = req.store;
        if (role != 1) {
            return res.redirect("/controller");
        }
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: "Unauthorized" });
    }
}
