const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const locationController = require("../controllers/locationController");
const storeController = require("../controllers/storeController");
const authMiddleware = require("../middlewares/authMiddleware");

// Auth routes
router.post(
  "/auth/register",
  authController.registerValidators,
  authController.register
);
router.post(
  "/auth/login",
  authController.loginValidators,
  authController.login
);
router.post("/auth/refresh", authController.refresh);
router.post("/auth/logout", authController.logout);
router.get("/auth/profile", authMiddleware, authController.profile);
// user
router.get("/users", authMiddleware, authController.listUsers);

// Location routes
router.post("/location", authMiddleware, locationController.createLocation);
router.get("/location", authMiddleware, locationController.listLocations);
router.get("/location/:id", authMiddleware, locationController.getLocation);
router.put("/location/:id", authMiddleware, locationController.updateLocation);
router.delete(
  "/location/:id",
  authMiddleware,
  locationController.deleteLocation
);

// Store routes
router.post("/store", authMiddleware, storeController.createStore);
router.get("/store", authMiddleware, storeController.listStores);
router.get("/store/:id", authMiddleware, storeController.getStore);
router.put("/store/:id", authMiddleware, storeController.updateStore);
router.delete("/store/:id", authMiddleware, storeController.deleteStore);

module.exports = router;
