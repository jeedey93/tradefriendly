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
  Avatar,
} from "@mui/material";

function TeamPage() {
  const { teamCode } = useParams();
  const [currentRoster, setCurrentRoster] = useState([]);
  const [prospects, setProspects] = useState([]);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(50);
  const [teamImage, setTeamImage] = useState();
  const [teamName, setTeamName] = useState("");
  const [strengths, setStrengths] = useState([]);
  const [weaknesses, setWeaknesses] = useState([]);
  const [tradeblock, setTradeblock] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

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
        title: "Reserves",
        players: [
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
      },
    ],
  });

  useEffect(() => {
    // Fetch the full roster
    fetch(`/nhl/roster/${teamCode}`)
      .then((response) => response.json())
      .then((rosterData) => {
        // Fetch the prospects
        fetch(`/nhl/roster/${teamCode}/prospects`)
          .then((response) => response.json())
          .then((prospectsData) => {
            // Filter out prospects from the full roster
            const prospectIds = prospectsData.map((prospect) => prospect.id);
            const filteredRoster = rosterData.filter(
              (player) => !prospectIds.includes(player.id)
            );

            // Set the current roster (minus prospects) and other states
            setCurrentRoster(filteredRoster);
            setProspects(prospectsData);
            setRating(filteredRoster.rating || 75);
            setLoading(false);
          })
          .catch((error) => {
            setError("Error fetching prospects data: " + error.message);
            setLoading(false);
          });
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
  }, []);

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

  const [draftPicks, setDraftPicks] = useState({
    2025: [false, true, false, true, true, true, true], // 1st and 3rd picks are not available
    2026: [true, false, true, true, false, true, true], // 2nd and 5th picks are not available
    2027: [true, true, true, true, true, true, true], // All picks are available
  });

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
      <Grid container spacing={2} alignItems="center">
        {/* Team Name */}
        <Grid item xs={12} md={8}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            {teamName}
          </Typography>
        </Grid>

        {/* Team Image */}
        <Grid item xs={12} md={4} container justifyContent="flex-end">
          {teamImage && (
            <Card elevation={4} sx={{ maxWidth: 200 }}>
              <CardMedia
                component="img"
                image={teamImage}
                alt={`Image of ${teamCode}`}
                sx={{ width: "100%", height: "auto", objectFit: "contain" }}
              />
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 2 }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="team pages"
        >
          <Tab label="Current Roster" />
          <Tab label="Prospects" />
          <Tab label="Lineup" />
          <Tab label="Strengths & Weaknesses" />
          <Tab label="Trade Block" />
          <Tab label="Contracts" />
          <Tab label="Draft Picks" />
        </Tabs>
      </Box>

      {tabIndex === 0 && (
        <>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          {/* Display the PlayerTable for players */}
          <Box sx={{ my: 4 }}>
            <Typography variant="h6" gutterBottom>
              Current Roster
            </Typography>
            <PlayerTable players={currentRoster} />
          </Box>
        </>
      )}

      {tabIndex === 1 && (
        <>
          <Box sx={{ my: 4 }}>
            <Typography variant="h6" gutterBottom>
              Prospects
            </Typography>
            <PlayerTable players={prospects} />
          </Box>
        </>
      )}

      {tabIndex === 2 && (
        <Box sx={{ my: 4 }}>
          <Typography variant="h6" gutterBottom>
            Lineup Compatibility
          </Typography>
          <Lineup lineup={lineup} onDragEnd={onDragEnd} />
        </Box>
      )}

      {tabIndex === 3 && (
        <Grid container spacing={3}>
          {/* Team Rating on its own row */}
          <Grid item xs={12}>
            <Box sx={{ my: 4 }}>
              <Typography variant="h6" gutterBottom>
                Team Rating
              </Typography>
              <Paper
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "150px",
                }}
              >
                <Typography variant="h4" gutterBottom>
                  {rating}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={rating}
                  sx={{
                    width: "100%",
                    height: 8,
                    borderRadius: 5,
                    mt: 2,
                  }}
                />
              </Paper>
            </Box>
          </Grid>

          {/* Strengths and Weaknesses on the same row */}
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
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
              <Paper sx={{ p: 3 }}>
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
        </Grid>
      )}

      {tabIndex === 4 && (
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

      {tabIndex === 5 && (
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

      {tabIndex === 6 && (
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" gutterBottom>
            Draft Picks
          </Typography>
          <Grid container spacing={4}>
            {Object.entries(draftPicks).map(([year, rounds]) => (
              <Grid item xs={12} key={year}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: "background.paper",
                  }}
                >
                  <Typography variant="h5" gutterBottom>
                    {year} Draft Picks
                  </Typography>
                  <Grid container spacing={2}>
                    {rounds.map((hasPick, index) => (
                      <Grid item key={index} sx={{ textAlign: "center" }}>
                        <Typography
                          variant="h6"
                          sx={{
                            mb: 1, // margin-bottom: 1 (theme spacing)
                            color: hasPick ? "text.primary" : "text.secondary",
                          }}
                        >
                          Round {index + 1}
                        </Typography>
                        <Avatar
                          sx={{
                            bgcolor: hasPick ? "primary.main" : "grey.400",
                            width: 64,
                            height: 64,
                            border: `2px solid ${
                              hasPick ? "primary.dark" : "grey.500"
                            }`,
                            "& img": {
                              objectFit: "contain",
                            },
                          }}
                          src={hasPick ? teamImage : null}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
}

export default TeamPage;
