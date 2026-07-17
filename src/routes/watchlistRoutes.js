import express from "express";
import {
  addToWatchList,
  removeFromWatchlist,
  updateWatchlistItem,
} from "../controllers/watchlistController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { addToWatchlistSchema } from "../validators/watchlistValidators.js";

const router = express.Router();

router.use(authMiddleware); // Khi ta chạy bất cứ route nào ở dưới nó đều sẽ chạy authMiddleware

router.post("/", validateRequest(addToWatchlistSchema), addToWatchList);
router.put("/:id", updateWatchlistItem);
router.delete("/:id", removeFromWatchlist);

export default router;
