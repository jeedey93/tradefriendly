import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  points: { type: Number, required: true },
  position: { type: String, required: true },
  teamAbbrev: { type: String, required: true },
  capHit: { type: Number, default: null },
  yearsLeft: { type: Number, default: null },
  overallScore: { type: Number, default: null },
});

// Create and export the Player model
const Player = mongoose.model("Player", playerSchema);
export default Player;
