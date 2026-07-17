import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import { registerSchema, loginSchema } from "../validators/authValidators.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();
/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập vào hệ thống
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: matkhau123
 *     responses:
 *       200:
 *         description: Đăng nhập thành công và trả về Token
 *       400:
 *         description: Sai email hoặc mật khẩu
 */
// router.post('/login', authController.login);

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", logout);

export default router;
