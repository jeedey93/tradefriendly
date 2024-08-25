import mongoose from "mongoose";
//import Team from "./Team"; // Ensure this path is correct

// Schema for Rumored Team Links
const rumorLinkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

// Schema for Rumored Team
const rumoredTeamSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team", // Must match the name of the model in Team.js
      required: true,
    },
    chance: { type: Number, required: true },
    links: [rumorLinkSchema],
  },
  { _id: false }
);

// Schema for Rumors
const rumorSchema = new mongoose.Schema({
  playerName: { type: String, required: true },
  playerImage: { type: String, required: true },
  currentTeamAbbrev: { type: String, required: true },
  tradeReason: { type: String, required: true },
  rumoredTeams: [rumoredTeamSchema],
});

// Create and export the Rumor model
const Rumor = mongoose.model("Rumor", rumorSchema);
export default Rumor;
