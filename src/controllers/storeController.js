const { Store, Location } = require("../models");
const refreshStore = new Map();
// List all stores
exports.listStores = async (req, res) => {
  try {
    const stores = await Store.findAll({
      include: [
        {
          model: Location,
          as: "location",
        },
      ],
    });
    res.json(stores);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to list stores" });
  }
};

// Get a single store by ID
exports.getStore = async (req, res) => {
  const store = await Store.findByPk(req.params.id, {
    include: [
      {
        model: Location,
        as: "location",
      },
    ],
  });
  if (!store) {
    return res.status(404).json({ error: "Store not found" });
  }
  res.json(store);
};

// Create a new store
exports.createStore = async (req, res) => {
  try {
    // Validate that name is provided
    if (!req.body.name) {
      return res.status(400).json({ error: "Store name is required" });
    }

    try {
      const store = await Store.create(req.body);
      res.status(201).json(store);
    } catch (error) {
      res.status(500).json({ error: "Failed to create Store" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to create Store" });
  }
};

// Update a store by ID
exports.updateStore = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }
    await store.update(req.body);
    const updatedStore = await Store.findByPk(req.params.id, {
      include: [
        {
          model: Location,
          as: "location",
        },
      ],
    });
    res.json(updatedStore);
  } catch (error) {
    res.status(500).json({ error: "Failed to update Store" });
  }
};

// Delete a store by ID
exports.deleteStore = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }
    await store.destroy();
    res.json({ message: "Store deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete Store" });
  }
};
