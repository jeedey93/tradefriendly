import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlayerTable from "../components/PlayerTable";
import Lineup from "../components/Lineup";
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
  Tabs,
  Tab,
} from "@mui/material";

function TeamPage() {
  const { teamCode } = useParams();
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(50);
  const [teamImage, setTeamImage] = useState();
  const [teamName, setTeamName] = useState("");
  const [strengths, setStrengths] = useState([]);
  const [weaknesses, setWeaknesses] = useState([]);
  const [tradeblock, setTradeblock] = useState([]);
  const [lineup, setLineup] = useState({
    forwards: [
      {
        title: "1st Line",
        players: [
          { id: "player1", name: "Player One" },
          { id: "player2", name: "Player Two" },
          { id: "player3", name: "Player Three" },
        ],
      },
      {
        title: "2nd Line",
        players: [
          { id: "player4", name: "Player One" },
          { id: "player5", name: "Player Two" },
          { id: "player6", name: "Player Three" },
        ],
      },
      {
        title: "3rd Line",
        players: [
          { id: "player7", name: "Player One" },
          { id: "player8", name: "Player Two" },
          { id: "player9", name: "Player Three" },
        ],
      },
      {
        title: "4th Line",
        players: [
          { id: "player10", name: "Player One" },
          { id: "player11", name: "Player Two" },
          { id: "player12", name: "Player Three" },
        ],
      },
    ],
    defensemen: [
      {
        title: "1st Pair",
        players: [
          { id: "player1", name: "Player One" },
          { id: "player2", name: "Player Two" },
        ],
      },
      {
        title: "2nd Pair",
        players: [
          { id: "player1", name: "Player One" },
          { id: "player2", name: "Player Two" },
        ],
      },
      {
        title: "3rd Pair",
        players: [
          { id: "player1", name: "Player One" },
          { id: "player2", name: "Player Two" },
        ],
      },
    ],
    goalies: [
      { title: "1st Goalie", players: [{ id: "goalie1", name: "Goalie One" }] },
      { title: "2nd Goalie", players: [{ id: "goalie2", name: "Goalie Two" }] },
    ],
  });
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    fetch(`/nhl/roster/${teamCode}`)
      .then((response) => response.json())
      .then((data) => {
        setPlayers(data);
        setRating(data.rating || 75);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching roster data: " + error.message);
        setLoading(false);
      });
  }, [teamCode]);

  useEffect(() => {
    fetch(`/api/teams/${teamCode}`)
      .then((response) => response.json())
      .then((data) => {
        setTeamImage(data.logo);
        setTeamName(data.city + " " + data.name);
        setStrengths(data.strengths || []);
        setWeaknesses(data.weaknesses || []);
        setTradeblock(data.tradeblock || []);
        console.log(lineup);
        setLineup(data.lineup || lineup);
        setContracts(data.contracts || []);
      })
      .catch((error) => setError("Error fetching team data: " + error.message));
  }, [teamCode]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const { droppableId: sourceDroppableId, index: sourceIndex } = source;
    const { droppableId: destinationDroppableId, index: destinationIndex } =
      destination;

    // Handle the drag and drop logic
    if (sourceDroppableId === destinationDroppableId) {
      const updatedLineup = { ...lineup };
      const line = updatedLineup[sourceDroppableId];

      const [movedPlayer] = line.players.splice(sourceIndex, 1);
      line.players.splice(destinationIndex, 0, movedPlayer);

      setLineup(updatedLineup);
    } else {
      const updatedLineup = { ...lineup };
      const sourceLine = updatedLineup[sourceDroppableId];
      const destinationLine = updatedLineup[destinationDroppableId];

      const [movedPlayer] = sourceLine.players.splice(sourceIndex, 1);
      destinationLine.players.splice(destinationIndex, 0, movedPlayer);

      setLineup(updatedLineup);
    }
  };

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
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="team pages"
        >
          <Tab label="Overview" />
          <Tab label="Strengths & Weaknesses" />
          <Tab label="Tradeblock" />
          <Tab label="Lineup Compatibility" />
          <Tab label="Contracts" />
        </Tabs>
      </Box>

      {tabIndex === 0 && (
        <>
          <Grid container spacing={3}>
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
                    sx={{ width: 200, height: 150, objectFit: "contain" }}
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
        </>
      )}

      {tabIndex === 1 && (
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
      )}

      {tabIndex === 2 && (
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
      )}

      {tabIndex === 3 && (
        <Box sx={{ my: 4 }}>
          <Typography variant="h6" gutterBottom>
            Lineup Compatibility
          </Typography>
          <Lineup lineup={lineup} onDragEnd={onDragEnd} />
        </Box>
      )}

      {tabIndex === 4 && (
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
      )}

      {tabIndex === 0 && <PlayerTable players={players} />}
    </Container>
  );
}

export default TeamPage;
