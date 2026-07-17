import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

// Middleware
// Read the token from the request
// Check if token is valid
export const authMiddleware = async (req, res, next) => {
  console.log("Auth middleware reached");
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]; // ["Bearer", "jwt-token"]
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    // Nếu không có token thì router.post("/", addToWatchList); ở watchlistRoute.js sẽ không được thực hiện
    return res.status(401).json({ error: "Not authorized, no token provided" });
  }

  try {
    // Verify token and extract the user Id
    // Dùng JWT_SECRET để giải mã, kiểm tra xem token bị sửa, hết hạn chưa
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({ error: "User no longer exists" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Not authorized, token failed" });
  }
};
