import mongoose from "mongoose";

// Define Player Schema
const playerSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  position: { type: String, required: true },
  overallRating: { type: Number, required: true },
});

// Define Line Schema
const lineSchema = new Schema({
  title: { type: String, required: true },
  chemistry: { type: Number, required: true },
  players: [playerSchema], // Array of playerSchema
});

// Define Goalies Schema
const goaliesSchema = new Schema({
  starter: playerSchema, // Single playerSchema instance
  backup: playerSchema, // Single playerSchema instance
});

// Define Reserves Schema
const reservesSchema = new Schema({
  title: { type: String, required: true },
  players: [playerSchema], // Array of playerSchema
});

// Define Main Team Schema
const teamLineupSchema = new Schema({
  teamId: { type: String, required: true },
  forwards: [lineSchema], // Array of lineSchema
  defensemen: [lineSchema], // Array of lineSchema
  goalies: goaliesSchema, // Single goaliesSchema instance
  reserves: [reservesSchema], // Array of reservesSchema
});

const Lineup = mongoose.model("Lineup", teamLineupSchema);

export default Lineup;
