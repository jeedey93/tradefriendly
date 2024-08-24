import express from "express";
import mongoose from "mongoose";
import Rumor from "../models/Rumor.js";

const router = express.Router();

// POST route to create a new rumor
router.post("/rumors", async (req, res) => {
  try {
    // Validate and process req.body
    const { playerName, playerImage, tradeReason, rumoredTeams } = req.body;

    // Check if all required fields are present
    if (!playerName || !playerImage || !tradeReason || !rumoredTeams) {
      return res.status(400).send("All fields are required.");
    }

    // Validate rumoredTeams and teamIds
    for (const team of rumoredTeams) {
      if (!mongoose.Types.ObjectId.isValid(team.teamId)) {
        return res.status(400).send(`Invalid teamId: ${team.teamId}`);
      }
    }

    // Create a new Rumor document
    const rumor = new Rumor({
      playerName,
      playerImage,
      tradeReason,
      rumoredTeams: rumoredTeams.map((team) => ({
        teamId: team.teamId, // Ensure valid ObjectId
        chance: team.chance,
        links: team.links,
      })),
    });

    // Save the rumor to the database
    await rumor.save();
    res.status(201).send(rumor);
  } catch (error) {
    console.error("Error creating rumor:", error);
    res.status(400).send(error.message);
  }
});

// GET route to get all rumors
router.get("/rumors", async (req, res) => {
  try {
    const teams = await Rumor.find();
    res.status(200).send(teams);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
