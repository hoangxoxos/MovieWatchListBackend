import express from "express";
import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

// IMPORT Routes
import movieRoute from "./routes/movieRoute.js";
import authRoutes from "./routes/authRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";

config();
connectDB();

const app = express();
// Cookie parser (used by auth middleware to read `req.cookies`)
app.use(cookieParser());

// Body parsing middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SWAGGER CONFIGURATION
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Movie Watchlist API Documentation",
      version: "1.0.0",
      description: "Test API",
    },
    servers: [
      {
        url: "http://localhost:5001",
        description: "Local (Development)",
      },
      {
        url: "https://moviewatchlistbackend-5oq2.onrender.com", //link Render
        description: "(Production)",
      },
    ],
  },
  // Quét document từ toàn bộ các file trong thư mục routes
  apis: ["./src/server.js", "./src/routes/*.js"],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // Init route for Swagger UI
// Direct homepage (/) to UI Test API
app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

// API Routes - Apply Routes
app.use("/movies", movieRoute);
app.use("/auth", authRoutes);
app.use("/watchlist", watchlistRoutes);

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on PORT ${PORT}`);
  console.log(`Swagger UI is available at http://localhost:${PORT}/api-docs`);
});

// Có thể dùng trong mọi project
// Handle unhandled promise rejections (e.g., database connection errors)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection: ", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await disconnectDB();
  process.exit(1);
});

// Graceful shuwdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});
