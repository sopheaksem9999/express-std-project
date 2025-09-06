const { Location } = require("../models");
const refreshStore = new Map();

// List all locations
exports.listLocations = async (req, res) => {
  try {
    const locations = await Location.findAll();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch locations" });
  }
};

// Get a single location by ID
exports.getLocation = async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }
    res.json(location);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch location" });
  }
};

// Create a new location
exports.createLocation = async (req, res) => {
  // Validate that name is provided
  if (!req.body.name) {
    return res.status(400).json({ error: "Location name is required" });
  }

  try {
    const location = await Location.create(req.body);
    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({ error: "Failed to create location" });
  }
};

// Update a location by ID
exports.updateLocation = async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }
    await location.update(req.body);
    res.json(location);
  } catch (error) {
    res.status(500).json({ error: "Failed to update location" });
  }
};

// Delete a location by ID
exports.deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }
    await location.destroy();
    res.json({ message: "Location deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete location" });
  }
};
