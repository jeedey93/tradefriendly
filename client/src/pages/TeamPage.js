import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlayerTable from "../components/PlayerTable";
import {
  Container,
  Typography,
  LinearProgress,
  Paper,
  Box,
  CardMedia,
  Card,
  Grid,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

function TeamPage() {
  const { teamCode } = useParams(); // Extract the teamCode from URL

  const [players, setPlayers] = useState([]);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(50);
  const [teamImage, setTeamImage] = useState();
  const [teamName, setTeamName] = useState("");
  const [strengths, setStrengths] = useState([]);
  const [weaknesses, setWeaknesses] = useState([]);
  const [tradeblock, setTradeblock] = useState([]);
  const [lineupCompatibility, setLineupCompatibility] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch roster data
    fetch(`/nhl/roster/${teamCode}`)
      .then((response) => response.json())
      .then((data) => {
        setPlayers(data);
        setRating(data.rating || 75); // Example: default to 75 if rating is not provided
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching roster data: " + error.message);
        setLoading(false);
      });
  }, [teamCode]);

  useEffect(() => {
    // Fetch team data
    fetch(`/api/teams/${teamCode}`)
      .then((response) => response.json())
      .then((data) => {
        setTeamImage(data.logo);
        setTeamName(data.city + " " + data.name);
        setStrengths(data.strengths || []);
        setWeaknesses(data.weaknesses || []);
        setTradeblock(data.tradeblock || []);
        setLineupCompatibility(data.lineupCompatibility || []);
        setContracts(data.contracts || []);
      })
      .catch((error) => setError("Error fetching team data: " + error.message));
  }, [teamCode]);

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
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {/* Team Name and Image */}
        <Grid item xs={12} md={8}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{ flexGrow: 1 }}
            >
              {teamName}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4} container justifyContent="flex-end">
          {teamImage && (
            <Card elevation={4}>
              <CardMedia
                component="img"
                image={teamImage}
                alt={`Image of ${teamCode}`}
                sx={{ width: 200, height: 150, objectFit: "contain" }} // Adjust as needed
              />
            </Card>
          )}
        </Grid>
      </Grid>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {/* Rating Display */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h6" gutterBottom>
          Team Rating
        </Typography>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" gutterBottom>
            {rating}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={rating}
            sx={{ width: "100%", height: 10, borderRadius: 5 }}
          />
        </Paper>
      </Box>

      {/* Strengths and Weaknesses */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Strengths
            </Typography>
            <List>
              {strengths.map((strength, index) => (
                <ListItem key={index}>
                  <ListItemText primary={strength} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Weaknesses
            </Typography>
            <List>
              {weaknesses.map((weakness, index) => (
                <ListItem key={index}>
                  <ListItemText primary={weakness} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Tradeblock */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h6" gutterBottom>
          Tradeblock
        </Typography>
        <Paper sx={{ p: 2 }}>
          <List>
            {tradeblock.map((item, index) => (
              <ListItem key={index}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>

      {/* Lineup Compatibility */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h6" gutterBottom>
          Lineup Compatibility
        </Typography>
        <Paper sx={{ p: 2 }}>
          <List>
            {lineupCompatibility.map((item, index) => (
              <ListItem key={index}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>

      {/* Contracts */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h6" gutterBottom>
          Contracts
        </Typography>
        <Paper sx={{ p: 2 }}>
          <List>
            {contracts.map((item, index) => (
              <ListItem key={index}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>

      {/* Pass players data to PlayerTable component */}
      <PlayerTable players={players} />
    </Container>
  );
}

export default TeamPage;
