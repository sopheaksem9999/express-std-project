require("dotenv").config();
const app = require("./app");
const { sequelize } = require("./src/models");

const PORT = process.env.PORT || 5173;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected");
    await sequelize.sync(); // for dev convenience; use migrations in production

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("Server is ready to accept connections");
    });

    // Add error handling for the server
    server.on("error", (err) => {
      console.error("Server error:", err);
    });

    // Keep the process alive
    process.on("SIGTERM", () => {
      console.log("SIGTERM received, shutting down gracefully");
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });
  } catch (err) {
    console.error("Unable to start server", err);
    process.exit(1);
  }
})();

// Add global error handlers
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
