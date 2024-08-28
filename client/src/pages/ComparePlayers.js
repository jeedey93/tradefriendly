import React, { useState } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  CardHeader,
  IconButton,
} from "@mui/material";
import { Search } from "@mui/icons-material";

function ComparePlayers() {
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [player1Id, setPlayer1Id] = useState("");
  const [player2Id, setPlayer2Id] = useState("");
  const [error, setError] = useState(null);

  const fetchPlayerData = (playerId, setPlayer) => {
    fetch(`/nhl/players/${playerId}`)
      .then((response) => response.json())
      .then((data) => {
        setPlayer(data);
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
    <Card>
      <CardHeader
        avatar={<Avatar alt={player.firstName} src={player.headshot} />}
        title={`${player.firstName} ${player.lastName}`}
        subheader={`#${player.sweaterNumber} - ${player.position}`}
        action={
          <IconButton>
            <img src={player.teamLogo} alt={player.fullTeamName} width={50} />
          </IconButton>
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
        <Typography variant="h6">{player.fullTeamName}</Typography>
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
    </Card>
  );

  return (
    <Box padding={2}>
      <Typography variant="h4" align="center" gutterBottom>
        Compare Players
      </Typography>

      {/* Search fields for players */}
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={5}>
          <TextField
            label="Player 1 ID"
            variant="outlined"
            fullWidth
            value={player1Id}
            onChange={(e) => setPlayer1Id(e.target.value)}
            size="small"
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
          <TextField
            label="Player 2 ID"
            variant="outlined"
            fullWidth
            value={player2Id}
            onChange={(e) => setPlayer2Id(e.target.value)}
            size="small"
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

      {/* Display player information */}
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

      <Grid container spacing={3} style={{ marginTop: 24 }}>
        {player1 && (
          <Grid item xs={12} md={6}>
            {renderPlayerCard(player1)}
          </Grid>
        )}
        {player2 && (
          <Grid item xs={12} md={6}>
            {renderPlayerCard(player2)}
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default ComparePlayers;
