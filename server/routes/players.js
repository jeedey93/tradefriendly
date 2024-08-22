import express from "express";
import Player from "../models/Player.js";

const router = express.Router();
router.get("/players", async (req, res) => {
  try {
    const players = await Player.find();
    res.status(200).send(players);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/players/:playerId", async (req, res) => {
  try {
    const player = await Player.findOne({
      id: req.params.playerId,
    });

    if (!player) {
      return res.status(404).send({ message: "Player not found" });
    }

    res.status(200).send(player);
  } catch (error) {
    res.status(500).send({ message: "An error occurred", error });
  }
});

router.post("/players", async (req, res) => {
  try {
    const updatedPlayers = req.body;

    if (!Array.isArray(updatedPlayers) || updatedPlayers.length === 0) {
      return res
        .status(400)
        .send("Invalid input: expected a non-empty array of players.");
    }

    // Update or insert each player into the database
    const results = await Promise.all(
      updatedPlayers.map(async (player) => {
        const { id, ...updateData } = player;

        if (!id) {
          throw new Error("Player ID is required.");
        }

        // Upsert operation: update if exists, insert if not
        return await Player.findOneAndUpdate(
          { id }, // Filter by player ID
          updateData, // Data to update
          { new: true, upsert: true } // Return the updated document, create if not exists
        );
      })
    );

    res.status(200).json(results); // Return updated player documents
  } catch (error) {
    console.error("Error updating players:", error);
    res.status(500).send("An error occurred while updating players.");
  }
});

router.post("/players/:playerId", async (req, res) => {
  const { playerId } = req.params;
  const { overallScore } = req.body;

  if (!playerId || overallScore === undefined) {
    return res.status(400).send("Player ID and overallScore are required.");
  }

  const player = await Player.findOne({
    id: req.params.playerId,
  });

  if (!player) {
    return res.status(404).send("Player not found.");
  }

  player.overallScore = overallScore;
  await player.save();

  res.status(200).send("Player score saved successfully.");
});

export default router;
