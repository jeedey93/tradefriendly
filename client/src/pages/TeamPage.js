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
        chemistry: 85,
        players: [
          {
            id: "player1",
            name: "Alex Johnson",
            position: "Left Wing",
            overallRating: 85,
          },
          {
            id: "player2",
            name: "Ryan Smith",
            position: "Center",
            overallRating: 88,
          },
          {
            id: "player3",
            name: "Dylan Carter",
            position: "Right Wing",
            overallRating: 87,
          },
        ],
      },
      {
        title: "2nd Line",
        chemistry: 80,
        players: [
          {
            id: "player4",
            name: "Jordan Lee",
            position: "Left Wing",
            overallRating: 83,
          },
          {
            id: "player5",
            name: "Mason Davis",
            position: "Center",
            overallRating: 84,
          },
          {
            id: "player6",
            name: "Ethan Brown",
            position: "Right Wing",
            overallRating: 82,
          },
        ],
      },
      {
        title: "3rd Line",
        chemistry: 100,
        players: [
          {
            id: "player7",
            name: "Liam Martinez",
            position: "Left Wing",
            overallRating: 80,
          },
          {
            id: "player8",
            name: "Noah Wilson",
            position: "Center",
            overallRating: 81,
          },
          {
            id: "player9",
            name: "Logan Anderson",
            position: "Right Wing",
            overallRating: 79,
          },
        ],
      },
      {
        title: "4th Line",
        chemistry: 85,
        players: [
          {
            id: "player10",
            name: "Jack Thomas",
            position: "Left Wing",
            overallRating: 76,
          },
          {
            id: "player11",
            name: "Owen White",
            position: "Center",
            overallRating: 77,
          },
          {
            id: "player12",
            name: "Lucas Robinson",
            position: "Right Wing",
            overallRating: 75,
          },
        ],
      },
    ],
    defensemen: [
      {
        title: "1st Pair",
        chemistry: 100,
        players: [
          {
            id: "def1",
            name: "Mikhail Ivanov",
            position: "Defenseman",
            overallRating: 89,
          },
          {
            id: "def2",
            name: "Tyler Brooks",
            position: "Defenseman",
            overallRating: 87,
          },
        ],
      },
      {
        title: "2nd Pair",
        chemistry: 85,
        players: [
          {
            id: "def3",
            name: "William Harris",
            position: "Defenseman",
            overallRating: 84,
          },
          {
            id: "def4",
            name: "James Thompson",
            position: "Defenseman",
            overallRating: 83,
          },
        ],
      },
      {
        title: "3rd Pair",
        chemistry: 50,
        players: [
          {
            id: "def5",
            name: "Alexander Lewis",
            position: "Defenseman",
            overallRating: 80,
          },
          {
            id: "def6",
            name: "Evan Young",
            position: "Defenseman",
            overallRating: 78,
          },
        ],
      },
    ],
    goalies: {
      starter: {
        id: "goalie1",
        name: "Nathaniel Green",
        position: "Goaltender",
        overallRating: 90,
      },
      backup: {
        id: "goalie2",
        name: "Connor Adams",
        position: "Goaltender",
        overallRating: 88,
      },
    },
    reserves: [
      {
        id: "reserve1",
        name: "Zachary Scott",
        position: "Forward",
        overallRating: 74,
      },
      {
        id: "reserve2",
        name: "Benjamin Walker",
        position: "Defenseman",
        overallRating: 72,
      },
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
    const { destination, source, draggableId, type } = result;

    // If there's no destination (dropped outside the list), do nothing
    if (!destination) return;

    // Reorder only within the same droppable
    if (type === "COLUMN") {
      // Handle reordering for forwards and defensemen sections
      if (source.droppableId !== destination.droppableId) return; // Can only reorder within the same section

      const startIndex = source.index;
      const endIndex = destination.index;

      // Update the lineup based on the source and destination
      const updatedLineup = { ...lineup };
      const section = updatedLineup[source.droppableId];

      const [movedPlayer] = section.players.splice(startIndex, 1);
      section.players.splice(endIndex, 0, movedPlayer);

      // Call your function to update the state or data source here
      updateLineup(updatedLineup);
    }
  };

  // Example of how to use the `updateLineup` function
  const updateLineup = (updatedLineup) => {
    // Update the state or backend with the new lineup
    console.log("Updated Lineup:", updatedLineup);
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
          <Tab label="Lineup" />
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
