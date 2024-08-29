import express from "express";
import fetch from "node-fetch";
import Player from "../models/Player.js";

const router = express.Router();

// Fetch NHL data from nhlstats API

router.get("/stats", async (req, res) => {
  try {
    const url = `https://api-web.nhle.com/v1/skater-stats-leaders/current?categories=points&limit=810`;

    // Make a GET request to the NHL API
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    const playersData = await fetchPlayerDataFromDatabase();

    const playerStatsList = extractPlayerLeadersData(data, playersData);

    res.status(200).send(playerStatsList);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while retrieving data.");
  }
});

router.get("/players/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const url = `https://api-web.nhle.com/v1/player/${id}/landing`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    res.json(extractProfilePlayerData(data));
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while retrieving data.");
  }
});

router.get("/roster/:teamCode", async (req, res) => {
  const { teamCode } = req.params; // Extract the teamCode from the route parameter

  try {
    const url = `https://api-web.nhle.com/v1/roster/${teamCode}/current`;

    // Make a GET request to an external API
    const response = await fetch(url);

    // Parse the JSON response
    const data = await response.json();

    // Use the reusable function to extract data for each player group
    const forwardsData = extractPlayerData(data.forwards);
    const defensemenData = extractPlayerData(data.defensemen);
    const goaliesData = extractPlayerData(data.goalies);

    const rosterData = forwardsData.concat(defensemenData).concat(goaliesData);

    // Send the data back to the client
    res.json(rosterData);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).send("An error occurred while retrieving data.");
  }
});

router.get("/roster/:teamCode/prospects", async (req, res) => {
  const { teamCode } = req.params; // Extract the teamCode from the route parameter

  try {
    const url = `https://api-web.nhle.com/v1/prospects/${teamCode}`;

    // Make a GET request to an external API
    const response = await fetch(url);

    // Parse the JSON response
    const data = await response.json();

    // Use the reusable function to extract data for each player group
    const forwardsData = extractPlayerData(data.forwards);
    const defensemenData = extractPlayerData(data.defensemen);
    const goaliesData = extractPlayerData(data.goalies);

    const prospectsData = forwardsData
      .concat(defensemenData)
      .concat(goaliesData);

    // Send the data back to the client
    res.json(prospectsData);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).send("An error occurred while retrieving data.");
  }
});

async function fetchPlayerDataFromDatabase() {
  try {
    const players = await Player.find();
    return players;
  } catch (error) {
    console.error("Database Query Error:", error);
    throw error;
  }
}

router.get("/draft/:draftYear/ranking/:draftType", async (req, res) => {
  const { draftYear, draftType } = req.params;

  try {
    const urlNorthAmericanSkaters = `https://api-web.nhle.com/v1/draft/rankings/${draftYear}/${draftType}`;

    const response = await fetch(urlNorthAmericanSkaters);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    res.json(extractDraftProfilePlayerData(data));
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while retrieving data.");
  }
});

function extractDraftProfilePlayerData(players) {
  return players.rankings.map((player) => ({
    lastName: player?.lastName ?? "N/A",
    firstName: player?.firstName ?? "N/A",
    positionCode: player?.positionCode ?? "N/A",
    shootsCatches: player?.shootsCatches ?? "N/A",
    heightInInches: player?.heightInInches ?? 0,
    weightInPounds: player?.weightInPounds ?? 0,
    lastAmateurClub: player?.lastAmateurClub ?? "N/A",
    lastAmateurLeague: player?.lastAmateurLeague ?? "N/A",
    birthDate: player?.birthDate ?? "N/A",
    birthCity: player?.birthCity ?? "N/A",
    birthStateProvince: player?.birthStateProvince ?? "N/A",
    birthCountry: player?.birthCountry ?? "N/A",
    midtermRank: player?.midtermRank ?? 0,
    finalRank: player?.finalRank ?? 0,
  }));
}

function extractProfilePlayerData(player) {
  return {
    playerId: player?.playerId ?? "N/A",
    isActive: player?.isActive ?? false,
    currentTeamId: player?.currentTeamId ?? "N/A",
    currentTeamAbbrev: player?.currentTeamAbbrev ?? "N/A",
    fullTeamName: player?.fullTeamName?.default ?? "N/A",
    fullTeamNameFr: player?.fullTeamName?.fr ?? "N/A",
    firstName: player?.firstName?.default ?? "N/A",
    lastName: player?.lastName?.default ?? "N/A",
    teamLogo: player?.teamLogo ?? "https://via.placeholder.com/60",
    sweaterNumber: player?.sweaterNumber ?? "N/A",
    position: player?.position ?? "N/A",
    headshot: player?.headshot ?? "https://via.placeholder.com/150",
    heightInInches: player?.heightInInches ?? "N/A",
    heightInCentimeters: player?.heightInCentimeters ?? "N/A",
    weightInPounds: player?.weightInPounds ?? "N/A",
    weightInKilograms: player?.weightInKilograms ?? "N/A",
    birthDate: player?.birthDate ?? "N/A",
    birthCity: player?.birthCity?.default ?? "N/A",
    birthStateProvince: player?.birthStateProvince?.default ?? "N/A",
    birthCountry: player?.birthCountry ?? "N/A",
    shootsCatches: player?.shootsCatches ?? "N/A",
    draftDetails: player?.draftDetails ?? {},
    featuredStats: player?.featuredStats ?? {},
    careerTotals: player?.careerTotals ?? {},
    last5Games: player?.last5Games ?? [],
    seasonTotals: player?.seasonTotals ?? {},
  };
}

function extractPlayerData(players) {
  return players.map((player) => ({
    id: player.id,
    headshot: player.headshot,
    firstName: player.firstName.default,
    lastName: player.lastName.default,
    sweaterNumber: player.sweaterNumber,
    positionCode:
      player.positionCode === "R"
        ? "RW"
        : player.positionCode === "L"
        ? "LW"
        : player.positionCode,
    shootsCatches: player.shootsCatches,
    heightInCentimeters: player.heightInCentimeters,
    weightInPounds: player.weightInPounds,
    birthCountry: player.birthCountry,
  }));
}

function extractPlayerLeadersData(nhlData, playersData) {
  return nhlData.points.map((player) => {
    const dbPlayer = playersData.find((p) => p.id === player.id);
    return {
      id: player.id,
      name: `${player.firstName.default} ${player.lastName.default}`,
      points: player.value,
      position: player.position,
      teamAbbrev: player.teamAbbrev,
      capHit: dbPlayer ? dbPlayer.capHit : 0,
      yearsLeft: dbPlayer ? dbPlayer.yearsLeft : 0,
      overallScore: dbPlayer ? dbPlayer.overallScore : 0,
    };
  });
}

export default router;
