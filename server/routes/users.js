// routes/users.js
import express from "express";
import User from "../models/User.js";

const router = express.Router();

// POST route to create a new user
router.post("/users", async (req, res) => {
  try {
    console.log(req.body);
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// GET route to get all users
router.get("/users", async (req, res) => {
  try {
    console.log("RETRIEVING USERS");
    const users = await User.find();
    console.log("RETRIEVED USERS: " + users);
    res.status(200).send(users);
  } catch (error) {
    console.log("RETRIEVED ERROIR: " + error);
    res.status(500).send(error);
  }
});

export default router;
