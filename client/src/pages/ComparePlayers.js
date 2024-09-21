import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Autocomplete,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  margin: theme.spacing(2),
  maxWidth: 345,
}));

const StyledTable = styled(Table)(({ theme }) => ({
  minWidth: 650,
  "& th, td": {
    padding: theme.spacing(1),
  },
}));

const StatCell = styled(TableCell)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(1),
}));

const HighlightCell = styled(StatCell)(({ isWinner }) => ({
  fontWeight: isWinner ? "bold" : "normal",
  color: isWinner ? "green" : "inherit",
  backgroundColor: isWinner ? "#e8f5e9" : "inherit", // Light green background for winner
  border: isWinner ? "2px solid green" : "1px solid #ddd",
}));

function ComparePlayers() {
  const [players, setPlayers] = useState(null);
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [player1Id, setPlayer1Id] = useState("");
  const [player2Id, setPlayer2Id] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        fetch(`/api/players`)
          .then((response) => response.json())
          .then((data) => {
            const mappedData = data
              .map((player) => ({
                id: player.id,
                name: player.name,
                teamAbbrev: player.teamAbbrev,
              }))
              .sort((a, b) => a.name.localeCompare(b.name));

            setPlayers(mappedData);
            setError(null); // Clear previous errors
          })
          .catch((error) => {
            setError("Error fetching players data: " + error.message);
          });
      } catch (error) {
        setError("Error fetching draft ranking data: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchPlayerData = (playerId, setPlayer) => {
    fetch(`/nhl/players/${playerId}`)
      .then((response) => response.json())
      .then((data) => {
        setPlayer(data);
        setError(null); // Clear previous errors
      })
      .catch((error) => {
        setError("Error fetching player data: " + error.message);
      });
  };

  const handleSearchPlayer1 = () => {
    if (player1Id) {
      fetchPlayerData(player1Id, setPlayer1);
    }
  };

  const handleSearchPlayer2 = () => {
    if (player2Id) {
      fetchPlayerData(player2Id, setPlayer2);
    }
  };

  const renderPlayerCard = (player) => (
    <StyledCard elevation={3}>
      <CardHeader
        avatar={<Avatar alt={player.firstName} src={player.headshot} />}
        title={`${player.firstName} ${player.lastName}`}
        subheader={`#${player.sweaterNumber} - ${player.position}`}
        action={
          <Avatar
            alt={player.fullTeamName}
            src={player.teamLogo}
            sx={{ width: 50, height: 50 }}
          />
        }
      />
      <CardMedia
        component="img"
        image={player.headshot}
        alt={`${player.firstName} ${player.lastName}`}
        style={{
          height: 200,
          objectFit: "contain",
        }}
      />
      <CardContent>
        <Typography variant="h6" align="center">
          {player.fullTeamName}
        </Typography>
        <Typography variant="body2">
          Height: {player.heightInInches} in / {player.heightInCentimeters} cm
        </Typography>
        <Typography variant="body2">
          Weight: {player.weightInPounds} lbs / {player.weightInKilograms} kg
        </Typography>
        <Typography variant="body2">Shoots: {player.shootsCatches}</Typography>
        <Typography variant="body2">
          Birthdate: {player.birthDate} ({player.birthCity},{" "}
          {player.birthCountry})
        </Typography>
        <Typography variant="body2">
          Drafted: {player.draftDetails.year} - Round{" "}
          {player.draftDetails.round}, Pick {player.draftDetails.pickInRound}{" "}
          (Overall {player.draftDetails.overallPick})
        </Typography>
      </CardContent>
    </StyledCard>
  );

  const renderStatsComparison = (player1Stats, player2Stats) => {
    return Object.entries(player1Stats).map(([statName, statValue1]) => {
      const statValue2 = player2Stats[statName];
      const isPlayer1Winner = statValue1 > statValue2;
      const isPlayer2Winner = statValue2 > statValue1;

      return (
        <TableRow key={statName}>
          <HighlightCell isWinner={isPlayer1Winner}>{statValue1}</HighlightCell>
          <StatCell>{statName}</StatCell>
          <HighlightCell isWinner={isPlayer2Winner}>{statValue2}</HighlightCell>
        </TableRow>
      );
    });
  };

  const getStats = (player) => {
    if (!player) return {};

    const stats = {
      "Games Played (Regular Season)":
        player.featuredStats.regularSeason.subSeason.gamesPlayed,
      "Goals (Regular Season)":
        player.featuredStats.regularSeason.subSeason.goals,
      "Assists (Regular Season)":
        player.featuredStats.regularSeason.subSeason.assists,
      "Points (Regular Season)":
        player.featuredStats.regularSeason.subSeason.points,
      "+- (Regular Season)":
        player.featuredStats.regularSeason.subSeason.plusMinus,
      "PIM (Regular Season)": player.featuredStats.regularSeason.subSeason.pim,
      "Power Play Goals (Regular Season)":
        player.featuredStats.regularSeason.subSeason.powerPlayGoals,
      "Power Play Points (Regular Season)":
        player.featuredStats.regularSeason.subSeason.powerPlayPoints,
      "Game-Winning Goals (Regular Season)":
        player.featuredStats.regularSeason.subSeason.gameWinningGoals,
      "Shots (Regular Season)":
        player.featuredStats.regularSeason.subSeason.shots,
      "Shooting % (Regular Season)":
        (
          player.featuredStats.regularSeason.subSeason.shootingPctg * 100
        ).toFixed(2) + "%",
    };

    // Check if playoff stats exist before adding them
    if (
      player.featuredStats.playoffs &&
      player.featuredStats.playoffs.subSeason
    ) {
      stats["Games Played (Playoffs)"] =
        player.featuredStats.playoffs.subSeason.gamesPlayed;
      stats["Goals (Playoffs)"] = player.featuredStats.playoffs.subSeason.goals;
      stats["Assists (Playoffs)"] =
        player.featuredStats.playoffs.subSeason.assists;
      stats["Points (Playoffs)"] =
        player.featuredStats.playoffs.subSeason.points;
      stats["+- (Playoffs)"] =
        player.featuredStats.playoffs.subSeason.plusMinus;
      stats["PIM (Playoffs)"] = player.featuredStats.playoffs.subSeason.pim;
      stats["Power Play Goals (Playoffs)"] =
        player.featuredStats.playoffs.subSeason.powerPlayGoals;
      stats["Power Play Points (Playoffs)"] =
        player.featuredStats.playoffs.subSeason.powerPlayPoints;
      stats["Game-Winning Goals (Playoffs)"] =
        player.featuredStats.playoffs.subSeason.gameWinningGoals;
      stats["Shots (Playoffs)"] = player.featuredStats.playoffs.subSeason.shots;
      stats["Shooting % (Playoffs)"] =
        (player.featuredStats.playoffs.subSeason.shootingPctg * 100).toFixed(
          2
        ) + "%";
    }

    return stats;
  };

  return (
    <Box padding={2}>
      <Typography variant="h4" align="center" gutterBottom>
        Compare Players
      </Typography>

      {/* Search fields for players */}
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={5}>
          <Autocomplete
            options={players}
            getOptionLabel={(option) => `${option.name} - ${option.teamAbbrev}`}
            onChange={(event, newValue) => {
              setPlayer1Id(newValue ? newValue.id : "");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Player 1 ID"
                variant="outlined"
                fullWidth
                size="small"
              />
            )}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearchPlayer1}
            fullWidth
            style={{ marginTop: 8 }}
            startIcon={<Search />}
          >
            Search Player 1
          </Button>
        </Grid>
        <Grid item xs={12} sm={5}>
          <Autocomplete
            options={players}
            getOptionLabel={(option) => `${option.name} - ${option.teamAbbrev}`}
            onChange={(event, newValue) => {
              setPlayer2Id(newValue ? newValue.id : "");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Player 2 ID"
                variant="outlined"
                fullWidth
                size="small"
              />
            )}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearchPlayer2}
            fullWidth
            style={{ marginTop: 8 }}
            startIcon={<Search />}
          >
            Search Player 2
          </Button>
        </Grid>
      </Grid>

      {/* Display error message */}
      {error && (
        <Typography
          color="error"
          variant="body2"
          align="center"
          style={{ marginTop: 16 }}
        >
          {error}
        </Typography>
      )}

      <Box marginTop={4}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6}>
            {player1 && renderPlayerCard(player1)}
          </Grid>
          <Grid item xs={12} sm={6}>
            {player2 && renderPlayerCard(player2)}
          </Grid>
        </Grid>

        {player1 && player2 && (
          <TableContainer component={Paper} style={{ marginTop: 24 }}>
            <StyledTable>
              <TableBody>
                {renderStatsComparison(getStats(player1), getStats(player2))}
              </TableBody>
            </StyledTable>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
}

export default ComparePlayers;
