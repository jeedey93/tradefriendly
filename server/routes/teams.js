// routes/users.js
import express from "express";
import Team from "../models/Team.js";

const router = express.Router();

// POST route to create a new team
router.post("/teams", async (req, res) => {
  try {
    console.log(req.body);
    const user = new Team(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// GET route to get all teams
router.get("/teams", async (req, res) => {
  try {
    const teams = await Team.find();
    res.status(200).send(teams);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/teams/:abbreviation", async (req, res) => {
  try {
    const { abbreviation } = req.params;
    const team = await Team.findOne({
      abbreviation: abbreviation.toUpperCase(),
    });

    if (!team) {
      return res.status(404).send({ message: "Team not found" });
    }

    res.status(200).send(team);
  } catch (error) {
    res.status(500).send({ message: "An error occurred", error });
  }
});

export default router;
