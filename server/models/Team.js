import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  abbreviation: { type: String, required: true },
  logo: { type: String, required: true },
});

// Create and export the Team model
const Team = mongoose.model("Team", teamSchema);
export default Team;
