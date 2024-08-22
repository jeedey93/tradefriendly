import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";
import SeasonTotalsTable from "../components/SeasonTotals";

// Helper function to format season as "YYYY-YYYY"
const formatSeason = (season) => {
  let seasonString = season.toString();
  const year1 = seasonString.slice(0, 4);
  const year2 = seasonString.slice(4);
  return `${year1}-${year2}`;
};

// Define mappings and thresholds
const BASE_CONTRACT_VALUES = {
  Sniper: 6,
  Passer: 6,
  "Two-Way Forward": 5,
  Grinder: 4,
  "Power Forward": 5,
  Utility: 2,
};

const ROLE_ADJUSTMENTS = {
  "1st liner": 1.2,
  "2nd liner": 1.1,
  "3rd liner": 0.9,
  "4th liner": 0.7,
  "1st pair": 1.2,
  "2nd pair": 1.1,
  "3rd pair": 1.05,
};

const PERFORMANCE_ADJUSTMENTS = (pointPerGame) => {
  return pointPerGame + 0.3;
};

const AGE_ADJUSTMENTS = (age) => {
  if (age < 25) return 1.1;
  if (age <= 30) return 1.0;
  return 0.9;
};

const calculateContractValue = (player, actualRole, playerType) => {
  if (!player) return "N/A";

  // Get the last 2 NHL seasons
  const recentSeasons = player.seasonTotals
    .filter(
      (season) => season.leagueAbbrev === "NHL" && season.gameTypeId === 2
    )
    .slice(-2);

  const { goals, assists, totalPoints, totalGames } = recentSeasons.reduce(
    (acc, season) => {
      acc.goals += season.goals || 0;
      acc.assists += season.assists || 0;
      acc.totalPoints += (season.goals || 0) + (season.assists || 0);
      acc.totalGames += season.gamesPlayed || 1; // Avoid division by zero
      return acc;
    },
    { goals: 0, assists: 0, totalPoints: 0, totalGames: 0 }
  );

  const age = calculateAge(player.birthDate);

  // Base contract value based on player type
  const baseValue = BASE_CONTRACT_VALUES[playerType] || 2;

  // Adjustments
  const roleAdjustment = ROLE_ADJUSTMENTS[actualRole] || 1;
  const avgPointsPerGame = totalPoints / totalGames || 0;
  const performanceMultiplier = PERFORMANCE_ADJUSTMENTS(avgPointsPerGame);
  const ageMultiplier = AGE_ADJUSTMENTS(age);

  // Calculate final contract value
  const contractValue =
    baseValue * roleAdjustment * performanceMultiplier * ageMultiplier;

  return `$${Math.max(0.75, contractValue).toFixed(2)}M`;
};

function convertInchesToFeetAndInches(inches) {
  if (!inches) return "N/A";
  const feet = Math.floor(inches / 12);
  const remainderInches = inches % 12;
  return `${feet}'${remainderInches}"`;
}

// Define role mappings
const roleMappings = {
  Forward: {
    "1st liner": 18,
    "2nd liner": 15,
    "3rd liner": 13,
    "4th liner": 0,
  },
  Defensemen: {
    "1st pair": 22,
    "2nd pair": 17,
    "3rd pair": 0,
  },
};

// Function to determine player type
const determinePlayerType = (
  player,
  recentSeasonsImportance = 0.4,
  playoffImportance = 0.2
) => {
  if (
    player.position === "L" ||
    player.position === "R" ||
    player.position === "C"
  ) {
    // Define importance percentages
    let careerImportance = 1 - recentSeasonsImportance - playoffImportance;

    // Regular season stats
    const careerRegularSeasonStats = player.careerTotals.regularSeason;
    const goalsPerGameSeason =
      careerRegularSeasonStats.goals / careerRegularSeasonStats.gamesPlayed;
    const assistsPerGameSeason =
      careerRegularSeasonStats.assists / careerRegularSeasonStats.gamesPlayed;
    const shootingPercentageSeason = careerRegularSeasonStats.shootingPctg;
    const penaltyMinutesPerGameSeason =
      careerRegularSeasonStats.pim / careerRegularSeasonStats.gamesPlayed;
    const plusMinusSeason = careerRegularSeasonStats.plusMinus;

    // Playoff stats
    let goalsPerGamePlayoff = 0,
      assistsPerGamePlayoff = 0,
      shootingPercentagePlayoff = 0,
      penaltyMinutesPerGamePlayoff = 0,
      plusMinusPlayoff = 0;

    if (player.careerTotals.playoffs) {
      const careerPlayoffStats = player.careerTotals.playoffs;
      goalsPerGamePlayoff =
        careerPlayoffStats.goals / careerPlayoffStats.gamesPlayed;
      assistsPerGamePlayoff =
        careerPlayoffStats.assists / careerPlayoffStats.gamesPlayed;
      shootingPercentagePlayoff = careerPlayoffStats.shootingPctg;
      penaltyMinutesPerGamePlayoff =
        careerPlayoffStats.pim / careerPlayoffStats.gamesPlayed;
      plusMinusPlayoff = careerPlayoffStats.plusMinus;
    } else {
      careerImportance += playoffImportance; // Redistribute playoff importance if null
    }

    // Recent seasons stats
    const recentSeasons = player.seasonTotals
      .filter(
        (season) => season.leagueAbbrev === "NHL" && season.gameTypeId === 2
      )
      .slice(-2); // Get the last 2 NHL seasons

    const recentStats = recentSeasons.reduce(
      (acc, season) => {
        const games = season.gamesPlayed || 1; // Avoid division by zero
        acc.goals += season.goals || 0;
        acc.assists += season.assists || 0;
        acc.shootingPctg += season.shootingPctg || 0;
        acc.pim += season.pim || 0;
        acc.plusMinus += season.plusMinus || 0;
        acc.totalGames += games;
        return acc;
      },
      {
        goals: 0,
        assists: 0,
        shootingPctg: 0,
        pim: 0,
        plusMinus: 0,
        totalGames: 0,
      }
    );

    // Per-game averages for recent seasons
    const goalsPerGameRecent = recentStats.goals / recentStats.totalGames;
    const assistsPerGameRecent = recentStats.assists / recentStats.totalGames;
    const shootingPercentageRecent =
      recentStats.shootingPctg / recentStats.totalGames;
    const penaltyMinutesPerGameRecent =
      recentStats.pim / recentStats.totalGames;
    const plusMinusRecent = recentStats.plusMinus / recentStats.totalGames;

    // Calculate final weighted averages
    const finalGoalsPerGame =
      goalsPerGameSeason * careerImportance +
      goalsPerGamePlayoff * playoffImportance +
      goalsPerGameRecent * recentSeasonsImportance;
    const finalAssistsPerGame =
      assistsPerGameSeason * careerImportance +
      assistsPerGamePlayoff * playoffImportance +
      assistsPerGameRecent * recentSeasonsImportance;
    const finalShootingPercentage =
      shootingPercentageSeason * careerImportance +
      shootingPercentagePlayoff * playoffImportance +
      shootingPercentageRecent * recentSeasonsImportance;
    const finalPenaltyMinutesPerGame =
      penaltyMinutesPerGameSeason * careerImportance +
      penaltyMinutesPerGamePlayoff * playoffImportance +
      penaltyMinutesPerGameRecent * recentSeasonsImportance;
    const finalPlusMinus =
      plusMinusSeason * careerImportance +
      plusMinusPlayoff * playoffImportance +
      plusMinusRecent * recentSeasonsImportance;

    // Define thresholds with further adjusted values
    const SNIPER_GOALS_THRESHOLD = 0.35;
    const SNIPER_SHOOTING_PERCENTAGE_THRESHOLD = 0.06;
    const PASSER_ASSISTS_THRESHOLD = 0.5;
    const TWO_WAY_FORWARD_GOALS_THRESHOLD = 0.2;
    const TWO_WAY_FORWARD_ASSISTS_THRESHOLD = 0.2;
    const TWO_WAY_FORWARD_PLUS_MINUS_THRESHOLD = 50;
    const GRINDER_GOALS_THRESHOLD = 0.1;
    const GRINDER_PENALTY_MINUTES_THRESHOLD = 0.15;
    const POWER_FORWARD_HEIGHT_THRESHOLD = 72;
    const POWER_FORWARD_WEIGHT_THRESHOLD = 210;
    const GOALS_ASSISTS_CLOSE_THRESHOLD = 0.25;

    const goalsAssistDifference = Math.abs(
      finalGoalsPerGame - finalAssistsPerGame
    );

    // Determine player type
    if (
      finalGoalsPerGame > SNIPER_GOALS_THRESHOLD &&
      finalShootingPercentage > SNIPER_SHOOTING_PERCENTAGE_THRESHOLD
    ) {
      return "Sniper";
    }
    if (finalAssistsPerGame > PASSER_ASSISTS_THRESHOLD) {
      return "Passer";
    }
    // Check if goals and assists per game are close and both meet two-way forward criteria
    if (
      goalsAssistDifference < GOALS_ASSISTS_CLOSE_THRESHOLD &&
      finalGoalsPerGame > TWO_WAY_FORWARD_GOALS_THRESHOLD &&
      finalAssistsPerGame > TWO_WAY_FORWARD_ASSISTS_THRESHOLD &&
      finalPlusMinus > TWO_WAY_FORWARD_PLUS_MINUS_THRESHOLD
    ) {
      return "Two-Way Forward";
    }
    if (
      finalGoalsPerGame < GRINDER_GOALS_THRESHOLD &&
      finalPenaltyMinutesPerGame > GRINDER_PENALTY_MINUTES_THRESHOLD
    ) {
      if (
        player.heightInInches < POWER_FORWARD_HEIGHT_THRESHOLD ||
        player.weightInPounds < POWER_FORWARD_WEIGHT_THRESHOLD
      ) {
        return "Grinder";
      }
    }
    if (
      finalGoalsPerGame > GRINDER_GOALS_THRESHOLD &&
      player.heightInInches >= POWER_FORWARD_HEIGHT_THRESHOLD &&
      player.weightInPounds >= POWER_FORWARD_WEIGHT_THRESHOLD
    ) {
      return "Power Forward";
    }

    // If the player has more than 40 points in the last two seasons, classify them based on their strongest attribute
    if (recentStats.goals + recentStats.assists > 40) {
      if (
        finalGoalsPerGame > TWO_WAY_FORWARD_GOALS_THRESHOLD &&
        finalAssistsPerGame > TWO_WAY_FORWARD_ASSISTS_THRESHOLD
      ) {
        return "Two-Way Forward";
      }
      if (
        player.heightInInches >= POWER_FORWARD_HEIGHT_THRESHOLD &&
        player.weightInPounds >= POWER_FORWARD_WEIGHT_THRESHOLD
      ) {
        return "Power Forward";
      }
      return "Grinder"; // Default to Grinder if no other type matches
    }
    return "Utility";
  }
  return "N/A";
};

const findNHLSeason = (seasonTotals) => {
  // Start from the end of the array and move backwards
  for (let i = seasonTotals.length - 1; i >= 0; i--) {
    const season = seasonTotals[i];
    if (season.leagueAbbrev === "NHL" && season.gameTypeId === 2) {
      return season;
    }
  }
  return null; // Return null if no NHL season is found
};

// Determine role based on ice time and player type
const determineActualPlayerRole = (player) => {
  if (!player || !player.seasonTotals || player.seasonTotals.length === 0)
    return "N/A";

  // Get the most recent season totals
  const mostRecentNHLSeason = findNHLSeason(player.seasonTotals);

  const avgToi = mostRecentNHLSeason?.avgToi;
  if (avgToi === undefined || avgToi === null) return "N/A";
  const avgIceTime = timeStringToDecimal(avgToi);

  // Define player position and corresponding role mappings
  let playerPosition = determinePlayerPosition(player.position);

  // Determine the role based on avgToi
  const roles = roleMappings[playerPosition];
  if (!roles) return "N/A";

  for (const [role, minIceTime] of Object.entries(roles)) {
    if (avgIceTime >= minIceTime) {
      return role;
    }
  }

  return "N/A";
};

const determinePlayerPosition = (position) => {
  let playerPosition = "N/A";
  if (position === "L" || position === "R" || position === "C") {
    playerPosition = "Forward";
  } else if (position === "D") {
    playerPosition = "Defensemen";
  } else {
    playerPosition = "N/A"; // Invalid position
  }
  return playerPosition;
};

const determineForwardPosition = (position) => {
  let playerPosition = "N/A";

  if (position === "L") {
    playerPosition = "LW";
  } else if (position === "R") {
    playerPosition = "RW";
  } else if (position === "C") {
    playerPosition = "C";
  } else {
    playerPosition = "N/A"; // Invalid position
  }

  return playerPosition;
};

const timeStringToDecimal = (timeString) => {
  // Split the time string into hours and minutes
  const [hours, minutes] = timeString.split(":").map(Number);

  // Convert minutes to decimal format (e.g., 44 minutes as 0.73 of an hour)
  const minutesDecimal = minutes / 60;

  // Combine hours and decimal minutes
  return hours + minutesDecimal;
};

const calculateAge = (birthDate) => {
  if (!birthDate) return "N/A";
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDifference = today.getMonth() - birth.getMonth();

  // Adjust age if the birthday hasn't occurred yet this year
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return age;
};

const calculateOverallRating = (
  playerType,
  actualRole,
  contractValue,
  seasonStats
) => {
  // Normalize Player Type
  const playerTypeScores = {
    Sniper: 90,
    Passer: 85,
    "Two-Way Forward": 80,
    Grinder: 75,
    "Power Forward": 80,
    Utility: 70,
  };
  const playerTypeScore = playerTypeScores[playerType] || 70; // Default to 70 if unknown

  // Normalize Actual Role
  const roleScores = {
    "1st liner": 95,
    "2nd liner": 85,
    "3rd liner": 80,
    "4th liner": 75,
    "1st pair": 95,
    "2nd pair": 85,
    "3rd pair": 80,
  };
  const roleScore = roleScores[actualRole] || 70; // Default to 70 if unknown

  // Normalize Contract Value
  const highestContractValue = 15; // Example highest contract value in millions
  const normalizedContractValue =
    Math.min(1, contractValue / highestContractValue) * 100;

  // Normalize Season Stats
  const {
    goals,
    assists,
    points,
    plusMinus,
    shootingPctg,
    pim, // Penalty Minutes
    powerPlayGoals,
    shorthandedGoals,
  } = seasonStats;

  // Simplified scoring formula based on important stats
  const statsScore =
    (points / 100) * 10 + // Points contribute up to 10 to the score
    (plusMinus / 50) * 10 + // Plus-Minus can contribute up to 10
    shootingPctg * 100 * 10 + // Shooting percentage contributes up to 10
    (pim / 100) * 10 + // pim contributes up to 10
    (powerPlayGoals / 100) * 10 + // powerPlayGoals contributes up to 10
    (shorthandedGoals / 100) * 10; // shorthandedGoals contributes up to 10

  // Weighting factors
  const playerTypeWeight = 0.25;
  const roleWeight = 0.25;
  const contractValueWeight = 0.25;
  const seasonStatsWeight = 0.25;

  // Calculate overall rating
  const overallRating =
    playerTypeScore * playerTypeWeight +
    roleScore * roleWeight +
    normalizedContractValue * contractValueWeight +
    statsScore * seasonStatsWeight;

  // Ensure rating stays within the 75-100 range
  return Math.max(75, Math.round(overallRating));
};

function convertToNumber(value) {
  // Remove the dollar sign and 'M'
  const cleanedValue = value.replace("$", "").replace("M", "");

  // Convert to a float
  return parseFloat(cleanedValue);
}

function getContractRating(contractValue, projectedContractValue) {
  const difference = convertToNumber(projectedContractValue) - contractValue;

  const percentageDifference = (difference / contractValue) * 100;

  if (percentageDifference > 50) {
    return "S+";
  } else if (percentageDifference > 30) {
    return "S";
  } else if (percentageDifference > 10) {
    return "A";
  } else if (percentageDifference >= -10) {
    return "B";
  } else if (percentageDifference >= -30) {
    return "C";
  } else if (percentageDifference >= -50) {
    return "D";
  } else {
    return "D-";
  }
}

function PlayerPage() {
  const { playerCode } = useParams();
  const [error, setError] = useState(null);
  const [player, setPlayer] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // Fetch player data
    fetch(`/nhl/players/${playerCode}`)
      .then((response) => response.json())
      .then((data) => {
        // Calculate actualRole and playerType first
        const actualRole = determineActualPlayerRole(data);
        const playerType = determinePlayerType(data);

        // Calculate actualContractValue using the above values
        const actualContractValue = calculateContractValue(
          data,
          actualRole,
          playerType
        );

        // Normalize the contract value (example value of contract)
        const contractValueNormalized = parseFloat(
          actualContractValue.replace("M", "").replace("$", "")
        );

        const seasonStats = data.featuredStats.regularSeason.subSeason;

        // Calculate overall rating
        const overallRating = calculateOverallRating(
          playerType,
          actualRole,
          contractValueNormalized,
          seasonStats
        );

        // Initialize variables to hold values fetched later
        let capHit = null;
        let remainingYearsLeft = null;

        // Fetch additional player info to get the capHit and remaining years left
        return fetch(`/api/players/${data.playerId}`)
          .then((response) => response.json())
          .then((infoData) => {
            console.log("Player info retrieved successfully", infoData);
            capHit = infoData.capHit;
            remainingYearsLeft = infoData.remainingYearsLeft;

            // Create the updated player object
            const updatedPlayer = {
              ...data,
              actualRole: actualRole,
              playerType: playerType,
              actualContractValue: actualContractValue,
              overallRating: overallRating,
              capHit: capHit,
              remainingYearsLeft: remainingYearsLeft,
            };

            // Update state
            setPlayer(updatedPlayer);

            // POST request to save the updated player information
            return fetch(`/api/players/${updatedPlayer.playerId}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                overallScore: updatedPlayer.overallRating,
              }),
            });
          })
          .then(() => {
            // Handle successful save (if needed)
            console.log("Player data saved successfully");
          })
          .catch((error) => {
            setError("Error saving player data: " + error.message);
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch((error) => {
        setError("Error fetching player data: " + error.message);
        setLoading(false);
      });
  }, [playerCode]);

  // Check if player data is loaded and valid
  const isPlayerDataAvailable = player && Object.keys(player).length > 0;

  // Helper function to generate the stats table
  const generateStatsTable = (stats) => (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Games Played</TableCell>
            <TableCell>Goals</TableCell>
            <TableCell>Assists</TableCell>
            <TableCell>Points</TableCell>
            <TableCell>Penalty Minutes</TableCell>
            <TableCell>Plus/Minus</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{stats.gamesPlayed || "N/A"}</TableCell>
            <TableCell>{stats.goals || "N/A"}</TableCell>
            <TableCell>{stats.assists || "N/A"}</TableCell>
            <TableCell>{stats.points || "N/A"}</TableCell>
            <TableCell>{stats.pim || "N/A"}</TableCell>
            <TableCell>{stats.plusMinus || "N/A"}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Helper function to generate the last 5 games table
  const generateLast5GamesTable = (games) => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Opponent</TableCell>
            <TableCell>Goals</TableCell>
            <TableCell>Assists</TableCell>
            <TableCell>Points</TableCell>
            <TableCell>PIM</TableCell>
            <TableCell>Shots</TableCell>
            <TableCell>TOI</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {games.map((game, index) => (
            <TableRow key={index}>
              <TableCell>{game.gameDate}</TableCell>
              <TableCell>{game.opponentAbbrev}</TableCell>
              <TableCell>{game.goals}</TableCell>
              <TableCell>{game.assists}</TableCell>
              <TableCell>{game.points}</TableCell>
              <TableCell>{game.pim}</TableCell>
              <TableCell>{game.shots}</TableCell>
              <TableCell>{game.toi}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (loading) {
    return (
      <Container
        maxWidth="md"
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {isPlayerDataAvailable ? (
          <Grid container spacing={2}>
            {/* Player Headshot and Basic Info */}
            <Grid item xs={12} sm={4}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Avatar
                  alt={`${player.firstName} ${player.lastName}`}
                  src={player.headshot || "https://via.placeholder.com/150"}
                  sx={{ width: 150, height: 150, mb: 2 }}
                />
                <Typography variant="h5" gutterBottom>
                  #{player.sweaterNumber || "N/A"} {player.firstName || "N/A"}{" "}
                  {player.lastName || "N/A"}
                </Typography>
                <Typography variant="body1">
                  {`${determinePlayerPosition(
                    player.position
                  )} (${determineForwardPosition(player.position)}) | Shoots: ${
                    player.shootsCatches || "N/A"
                  }`}
                </Typography>
              </Card>
            </Grid>

            {/* Team Info */}
            <Grid item xs={12} sm={8}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Grid container alignItems="center">
                      <Grid item>
                        <img
                          src={
                            player.teamLogo || "https://via.placeholder.com/60"
                          }
                          alt={player.fullTeamName || "N/A"}
                          style={{
                            width: "60px",
                            verticalAlign: "middle",
                            marginRight: "8px",
                          }}
                        />
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" display="inline">
                          {player.fullTeamName || "N/A"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <List>
                          <ListItem>
                            <ListItemText
                              primary="Birth Date"
                              secondary={`${player.birthDate || "N/A"} (${
                                calculateAge(player.birthDate) || "N/A"
                              } years old)`}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Birthplace"
                              secondary={`${player.birthCity || "N/A"}, ${
                                player.birthStateProvince || "N/A"
                              }, ${player.birthCountry || "N/A"}`}
                            />
                          </ListItem>
                        </List>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <List>
                          <ListItem>
                            <ListItemText
                              primary="Height"
                              secondary={`${convertInchesToFeetAndInches(
                                player.heightInInches
                              )} (${player.heightInCentimeters || "N/A"} cm)`}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Weight"
                              secondary={`${
                                player.weightInPounds || "N/A"
                              } lbs (${player.weightInKilograms || "N/A"} kg)`}
                            />
                          </ListItem>
                        </List>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Typography variant="body1">No player data available.</Typography>
        )}

        <Divider sx={{ my: 2 }} />

        {isPlayerDataAvailable && (
          <>
            <Typography variant="h6">Player Profile</Typography>
            <Card variant="outlined" sx={{ p: 2 }}>
              <Grid container spacing={2}>
                {/* Overall Rating section */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      mb: 2,
                      p: 2,
                      border: "1px solid grey",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="h6">Overall Rating</Typography>
                    <Typography variant="body1">
                      {player.overallRating || "N/A"}
                    </Typography>
                  </Box>
                </Grid>

                {/* Player Type and Contract Rating on the Left, and Contract Rating, Potential Role, and Projected Contract Value on the Right */}
                <Grid item xs={12} container spacing={2}>
                  {/* Left side with Player Type, Actual Role, and Contract Value */}
                  <Grid item xs={12} sm={4}>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Player Type"
                          secondary={player.playerType || "N/A"}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Contract Value"
                          secondary={
                            player.capHit ? `$${player.capHit}M` : "N/A"
                          }
                        />
                      </ListItem>
                    </List>
                  </Grid>

                  {/* Right side with Contract Rating, Potential Role, and Projected Contract Value */}
                  <Grid item xs={12} sm={4}>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Actual Role"
                          secondary={player.actualRole || "N/A"}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Years left"
                          secondary={player.yearLeft || "2"}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Projected Contract Value"
                          secondary={player.actualContractValue || "N/A"}
                        />
                      </ListItem>
                    </List>
                  </Grid>

                  {/* Right side with Contract Rating, Potential Role, and Projected Contract Value */}
                  <Grid item xs={12} sm={4}>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Potential Role"
                          secondary={player.contractRating || "1st Liner"}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Pending (RFA/UFA)"
                          secondary={player.potentialRole || "UFA"}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Contract Rating"
                          secondary={getContractRating(
                            player.capHit,
                            player.actualContractValue
                          )}
                        />
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </Grid>
            </Card>
          </>
        )}

        <Divider sx={{ my: 2 }} />

        {isPlayerDataAvailable && player.draftDetails && (
          <>
            <Typography variant="h6">Draft Information</Typography>
            <Card variant="outlined" sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Drafted by:</strong>
                    <Chip
                      label={player.draftDetails.teamAbbrev || "N/A"}
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Year:</strong> {player.draftDetails.year || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Round:</strong> {player.draftDetails.round || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Pick:</strong>{" "}
                    {player.draftDetails.pickInRound || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Overall Pick:</strong>{" "}
                    {player.draftDetails.overallPick || "N/A"}
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </>
        )}

        <Divider sx={{ my: 2 }} />

        {isPlayerDataAvailable && player.featuredStats && (
          <>
            <Typography variant="h6">
              Season Stats ({formatSeason(player.featuredStats.season)})
            </Typography>
            {generateStatsTable(
              player.featuredStats.regularSeason?.subSeason || {}
            )}
          </>
        )}

        <Divider sx={{ my: 2 }} />

        {isPlayerDataAvailable && player.seasonTotals && (
          <>
            <Typography variant="h6">Season Totals</Typography>
            <SeasonTotalsTable seasonTotals={player.seasonTotals} />
          </>
        )}

        <Divider sx={{ my: 2 }} />

        {isPlayerDataAvailable && player.careerTotals && (
          <>
            <Typography variant="h6">Career Stats</Typography>
            {generateStatsTable(player.careerTotals.regularSeason || {})}
          </>
        )}

        <Divider sx={{ my: 2 }} />

        {isPlayerDataAvailable && player.last5Games && (
          <>
            <Typography variant="h6">Last 5 Games</Typography>
            {generateLast5GamesTable(player.last5Games)}
          </>
        )}
      </Paper>
    </Container>
  );
}

export default PlayerPage;
