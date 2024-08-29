// routes/users.js
import express from "express";
import Team from "../models/Team.js";
import getRosterData from "../util/rosterutil.js";

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

router.get("/teams/:abbreviation/lineup", async (req, res) => {
  const { abbreviation } = req.params;
  try {
    const currentRoster = await getRosterData(abbreviation);
    const teamStructure = mapPlayersToStructure(currentRoster);
    res.json(teamStructure);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while retrieving data.");
  }
});

router.post("/teams/:abbreviation/lineup", async (req, res) => {
  try {
    console.log(req.body);
    const lineup = new Lineup(req.body);
    await lineup.save();
    res.status(201).send(lineup);
  } catch (error) {
    res.status(400).send(error);
  }
});

const mapPlayersToStructure = (players) => {
  const forwards = [];
  const defensemen = [];
  const goalies = [];
  const reserves = [];

  // Process each player and categorize them
  players.forEach((player) => {
    const mappedPlayer = {
      id: player.id.toString(), // Ensure id is a string
      name: `${player.firstName} ${player.lastName}`,
      position:
        player.positionCode === "G"
          ? "Goaltender"
          : player.positionCode === "D"
          ? "Defenseman"
          : "Forward",
      overallRating: Math.floor(Math.random() * 100) + 1, // Random rating for example purposes
    };

    if (player.positionCode === "G") {
      goalies.push(mappedPlayer);
    } else if (player.positionCode === "D") {
      defensemen.push(mappedPlayer);
    } else if (
      player.positionCode === "C" ||
      player.positionCode === "RW" ||
      player.positionCode === "LW"
    ) {
      forwards.push(mappedPlayer);
    } else {
      // Players with unrecognized position codes are added to reserves directly
      reserves.push(mappedPlayer);
    }
  });

  // Define forward lines and defense pairings
  const forwardLines = [
    { title: "1st Line", chemistry: 85, players: forwards.slice(0, 3) },
    { title: "2nd Line", chemistry: 80, players: forwards.slice(3, 6) },
    { title: "3rd Line", chemistry: 75, players: forwards.slice(6, 9) },
    { title: "4th Line", chemistry: 70, players: forwards.slice(9, 12) },
  ];

  const defensePairings = [
    { title: "1st Pair", chemistry: 100, players: defensemen.slice(0, 2) },
    { title: "2nd Pair", chemistry: 85, players: defensemen.slice(2, 4) },
    { title: "3rd Pair", chemistry: 50, players: defensemen.slice(4, 6) },
  ];

  // Ensure we have at least two goalies
  const goaliesStructure = {
    starter: goalies[0] || {
      id: "n/a",
      name: "N/A",
      position: "Goaltender",
      overallRating: 0,
    },
    backup: goalies[1] || {
      id: "n/a",
      name: "N/A",
      position: "Goaltender",
      overallRating: 0,
    },
  };

  // Add remaining players from forwards and defensemen to reserves
  const allPlayers = [...forwards, ...defensemen, ...goalies];
  const allPlayersInLines = [
    ...forwardLines.flatMap((line) => line.players),
    ...defensePairings.flatMap((pairing) => pairing.players),
    goaliesStructure.starter,
    goaliesStructure.backup,
  ];

  reserves.push(
    ...allPlayers.filter((player) => !allPlayersInLines.includes(player))
  );

  return {
    forwards: forwardLines,
    defensemen: defensePairings,
    goalies: goaliesStructure,
    reserves: [
      {
        title: "Reserves",
        players: reserves,
      },
    ],
  };
};

export default router;
