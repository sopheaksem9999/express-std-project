const { User } = require("../models");
const { body, validationResult } = require("express-validator");
const { sign } = require("../utils/jwt");
const { JWT_SECRET, JWT_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } = process.env;

// Simple in-memory store for refresh tokens (use Redis in production)
const refreshStore = new Map();

/**
 * Authentication Controller
 *
 * This controller handles all authentication-related operations including:
 * - User registration
 * - User login
 * - Token refresh
 * - User logout
 * - User profile retrieval
 *
 * All endpoints return JSON responses with appropriate HTTP status codes.
 */

/**
 * Validation rules for user registration
 *
 * Sample request body:
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "password": "password123"
 * }
 */
exports.registerValidators = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

/**
 * Register a new user
 *
 * @route POST /api/auth/register
 * @access Public
 *
 * Request body:
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "password": "password123"
 * }
 *
 * Success response (201):
 * {
 *   "user": {
 *     "id": 1,
 *     "email": "john@example.com",
 *     "name": "John Doe"
 *   },
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 *
 * Error responses:
 * - 422: Validation errors
 * - 409: Email already in use
 * - 500: Server error
 */
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });

  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ where: { email } });
    if (existing)
      return res.status(409).json({ message: "Email already in use" });

    const user = await User.create({ name, email, password });

    // Return success without logging in the user
    return res.status(201).json({
      message: "Registration successful. Please login to continue.",
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
/**
 * Validation rules for user login
 *
 * Sample request body:
 * {
 *   "email": "john@example.com",
 *   "password": "password123"
 * }
 */
exports.loginValidators = [
  body("email").isEmail(),
  body("password").notEmpty(),
];

/**
 * Authenticate user and return tokens
 *
 * @route POST /api/auth/login
 * @access Public
 *
 * Request body:
 * {
 *   "email": "john@example.com",
 *   "password": "password123"
 * }
 *
 * Success response (200):
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "user": {
 *     "id": 1,
 *     "email": "john@example.com",
 *     "name": "John Doe"
 *   }
 * }
 *
 * Error responses:
 * - 422: Validation errors
 * - 401: Invalid credentials
 * - 500: Server error
 */
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await user.validatePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    const refreshToken = sign({ id: user.id }, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });
    refreshStore.set(refreshToken, user.id);

    return res.json({
      token,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Refresh access token using refresh token
 *
 * @route POST /api/auth/refresh
 * @access Public
 *
 * Request body:
 * {
 *   "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 *
 * Success response (200):
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 *
 * Error responses:
 * - 400: Missing refresh token
 * - 401: Invalid refresh token
 */
exports.refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(400).json({ message: "Missing refresh token" });
  try {
    const payload = require("jsonwebtoken").verify(refreshToken, JWT_SECRET);
    const stored = refreshStore.get(refreshToken);
    if (!stored || stored !== payload.id)
      return res.status(401).json({ message: "Invalid refresh token" });

    const token = sign({ id: payload.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    return res.json({ token });
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

/**
 * Logout user and invalidate refresh token
 *
 * @route POST /api/auth/logout
 * @access Public
 *
 * Request body:
 * {
 *   "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 *
 * Success response (200):
 * {
 *   "message": "Logged out"
 * }
 */
exports.logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) refreshStore.delete(refreshToken);
  return res.json({ message: "Logged out" });
};

/**
 * Get current user profile
 *
 * @route GET /api/auth/profile
 * @access Private (requires valid JWT token)
 *
 * Headers:
 * {
 *   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 *
 * Success response (200):
 * {
 *   "user": {
 *     "id": 1,
 *     "name": "John Doe",
 *     "email": "john@example.com",
 *     "role": "user"
 *   }
 * }
 *
 * Error responses:
 * - 401: Unauthorized (invalid or missing token)
 */
exports.profile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "role"],
    });
    return res.json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role"],
    });
    return res.json({ users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
