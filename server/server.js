import express from "express";
import mongoose from "./db.js"; // Ensure this is correctly connecting to MongoDB

import teamRoutes from "./routes/teams.js";
import playersRoutes from "./routes/players.js";
import nhlRoutes from "./routes/nhlstats.js";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Route prefixes
app.use("/api", teamRoutes);
app.use("/api", playersRoutes);
app.use("/nhl", nhlRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
