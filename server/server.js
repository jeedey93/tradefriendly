import express from "express";
import mongoose from "./db.js"; // Ensure this is correctly connecting to MongoDB
import cors from "cors";

import teamRoutes from "./routes/teams.js";
import playersRoutes from "./routes/players.js";
import nhlRoutes from "./routes/nhlstats.js";
import rumorsRoutes from "./routes/rumors.js";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Route prefixes
app.use("/api", teamRoutes);
app.use("/api", playersRoutes);
app.use("/api", nhlRoutes);
app.use("/api", rumorsRoutes);

// NHL Stats API endpoint
app.use("/nhl", nhlRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.use(
  cors({
    origin: "https://tradefriendly.onrender.com", // Replace with your React app's domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
