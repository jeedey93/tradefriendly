import express from "express";
import mongoose from "mongoose";
import fetch from "node-fetch";
import Rumor from "../models/Rumor.js";
import Player from "../models/Player.js";

const router = express.Router();

// POST route to create a new rumor
router.post("/rumors", async (req, res) => {
  try {
    // Destructure request body
    let { playerName, playerImage, tradeReason, rumoredTeams } = req.body;

    // Check if all required fields are present
    if (!playerName || !tradeReason || !rumoredTeams) {
      return res.status(400).send("All fields are required.");
    }

    // Validate rumoredTeams and teamIds
    for (const team of rumoredTeams) {
      if (!mongoose.Types.ObjectId.isValid(team.teamId)) {
        return res.status(400).send(`Invalid teamId: ${team.teamId}`);
      }
    }

    // Check if the player exists in the Player database
    const player = await Player.findOne({ name: playerName });
    if (!player) {
      return res.status(404).send("Player does not exist.");
    }

    let currentTeamAbbrev; // Initialize the variable

    // Determine player info
    try {
      const playerInfo = await fetchPlayerInfo(player.id);
      const { headshot, currentTeamAbbrev: teamAbbrev } = playerInfo;
      playerImage = headshot;
      currentTeamAbbrev = teamAbbrev;
    } catch (error) {
      playerImage = "https://assets.nhle.com/mugs/nhl/default-skater.png";
      console.error("Error fetching player info:", error);
    }

    // Create and save the new Rumor document
    const rumor = new Rumor({
      playerName,
      playerImage,
      currentTeamAbbrev,
      tradeReason,
      rumoredTeams: rumoredTeams.map((team) => ({
        teamId: team.teamId,
        chance: team.chance,
        links: team.links || [],
      })),
    });

    await rumor.save();
    res.status(201).send(rumor);
  } catch (error) {
    console.error("Error creating rumor:", error);
    res.status(400).send(error.message);
  }
});

// DELETE route to delete a rumor by ID
router.delete("/rumors/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid rumor ID.");
    }

    // Delete the rumor from the database
    const result = await Rumor.findByIdAndDelete(id);

    // Check if the rumor was found and deleted
    if (!result) {
      return res.status(404).send("Rumor not found.");
    }

    res.status(200).send("Rumor deleted successfully.");
  } catch (error) {
    console.error("Error deleting rumor:", error);
    res.status(500).send(error.message);
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

const fetchPlayerInfo = async (playerId) => {
  const url = `https://api-web.nhle.com/v1/player/${playerId}/landing`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data = await response.json();
  // Assuming the headshot URL is in data.headshot.url
  if (data && data.headshot && data.currentTeamAbbrev) {
    return {
      headshot: data.headshot,
      currentTeamAbbrev: data.currentTeamAbbrev,
    };
  } else {
    throw new Error("Headshot or currentTeamAbbrev not found in the data.");
  }
};

export default router;
