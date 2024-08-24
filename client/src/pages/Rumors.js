import React, { useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Box,
  CssBaseline,
  Chip,
  Avatar,
  CardActionArea,
  CardActions,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Info as InfoIcon } from "@mui/icons-material";

function Rumors() {
  const teamTradeReasons = [
    "Salary Cap Management",
    "Performance Issues",
    "Injuries",
    "Team Chemistry",
    "Rebuilding",
  ];

  const playerTradeReasons = [
    "Lack of Playing Time",
    "Contract Dispute",
    "Desire for a New Challenge",
    "Personal Reasons",
    "Team Rebuilding",
  ];

  // Sample data for rumors
  const initialRumors = [
    {
      id: 1,
      playerName: "John Doe",
      playerImage: "https://assets.nhle.com/mugs/nhl/20232024/TBL/8476453.png",
      tradeReason: "Personal Reasons",
      rumoredTeams: [
        {
          name: "Toronto Maple Leafs",
          logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9f/Toronto_Maple_Leafs_Logo_2016.svg/1200px-Toronto_Maple_Leafs_Logo_2016.svg.png",
          chance: 40,
          links: [
            {
              title: "Toronto Rumors 1",
              url: "https://www.example.com/toronto-rumors-1",
            },
            {
              title: "Toronto Rumors 2",
              url: "https://www.example.com/toronto-rumors-2",
            },
          ],
        },
        {
          name: "Montreal Canadiens",
          logo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/69/Montreal_Canadiens.svg/1200px-Montreal_Canadiens.svg.png",
          chance: 30,
          links: [
            {
              title: "Montreal Rumors 1",
              url: "https://www.example.com/montreal-rumors-1",
            },
            {
              title: "Montreal Rumors 2",
              url: "https://www.example.com/montreal-rumors-2",
            },
          ],
        },
        {
          name: "Vancouver Canucks",
          logo: "https://upload.wikimedia.org/wikipedia/en/thumb/3/3a/Vancouver_Canucks_logo.svg/1200px-Vancouver_Canucks_logo.svg.png",
          chance: 30,
          links: [
            {
              title: "Vancouver Rumors 1",
              url: "https://www.example.com/vancouver-rumors-1",
            },
            {
              title: "Vancouver Rumors 2",
              url: "https://www.example.com/vancouver-rumors-2",
            },
          ],
        },
      ],
    },
    {
      id: 2,
      playerName: "Jane Smith",
      playerImage: "https://assets.nhle.com/mugs/nhl/20232024/COL/8477492.png",
      tradeReason: "Contract Dispute",
      rumoredTeams: [
        {
          name: "Boston Bruins",
          logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Boston_Bruins_logo.svg/1200px-Boston_Bruins_logo.svg.png",
          chance: 50,
        },
        {
          name: "New York Rangers",
          logo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6f/New_York_Rangers.svg/1200px-New_York_Rangers.svg.png",
          chance: 50,
        },
      ],
    },
    {
      id: 3,
      playerName: "Mike Johnson",
      playerImage: "https://assets.nhle.com/mugs/nhl/20232024/EDM/8478402.png",
      tradeReason: "Cap Space",
      rumoredTeams: [
        {
          name: "Chicago Blackhawks",
          logo: "https://upload.wikimedia.org/wikipedia/en/thumb/2/29/Chicago_Blackhawks_logo.svg/1200px-Chicago_Blackhawks_logo.svg.png",
          chance: 35,
        },
        {
          name: "Los Angeles Kings",
          logo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/63/Los_Angeles_Kings_logo.svg/1200px-Los_Angeles_Kings_logo.svg.png",
          chance: 35,
        },
        {
          name: "Dallas Stars",
          logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/52/Dallas_Stars_logo.svg/1200px-Dallas_Stars_logo.svg.png",
          chance: 30,
        },
      ],
    },
    {
      id: 4,
      playerName: "Artemi Pana",
      playerImage: "https://assets.nhle.com/mugs/nhl/20232024/NYR/8478550.png",
      tradeReason: "Lack of Playing Time",
      rumoredTeams: [
        {
          name: "Chicago Blackhawks",
          logo: "https://upload.wikimedia.org/wikipedia/en/thumb/2/29/Chicago_Blackhawks_logo.svg/1200px-Chicago_Blackhawks_logo.svg.png",
          chance: 30,
        },
        {
          name: "Los Angeles Kings",
          logo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/63/Los_Angeles_Kings_logo.svg/1200px-Los_Angeles_Kings_logo.svg.png",
          chance: 30,
        },
        {
          name: "Dallas Stars",
          logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/52/Dallas_Stars_logo.svg/1200px-Dallas_Stars_logo.svg.png",
          chance: 40,
        },
      ],
    },
    {
      id: 5,
      playerName: "David Pastrnak",
      playerImage: "https://assets.nhle.com/mugs/nhl/20232024/BOS/8477956.png",
      tradeReason: "Team Rebuilding",
      rumoredTeams: [
        {
          name: "Chicago Blackhawks",
          logo: "https://upload.wikimedia.org/wikipedia/en/thumb/2/29/Chicago_Blackhawks_logo.svg/1200px-Chicago_Blackhawks_logo.svg.png",
          chance: 30,
        },
        {
          name: "Los Angeles Kings",
          logo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/63/Los_Angeles_Kings_logo.svg/1200px-Los_Angeles_Kings_logo.svg.png",
          chance: 30,
        },
        {
          name: "Dallas Stars",
          logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/52/Dallas_Stars_logo.svg/1200px-Dallas_Stars_logo.svg.png",
          chance: 40,
        },
      ],
    },
    {
      id: 6,
      playerName: "Auston Matthews",
      playerImage: "https://assets.nhle.com/mugs/nhl/20232024/TOR/8479318.png",
      tradeReason: "Unsatisfied with Playing Time",
      rumoredTeams: [
        {
          name: "Chicago Blackhawks",
          logo: "https://upload.wikimedia.org/wikipedia/en/thumb/2/29/Chicago_Blackhawks_logo.svg/1200px-Chicago_Blackhawks_logo.svg.png",
          chance: 30,
        },
        {
          name: "Los Angeles Kings",
          logo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/63/Los_Angeles_Kings_logo.svg/1200px-Los_Angeles_Kings_logo.svg.png",
          chance: 30,
        },
        {
          name: "Dallas Stars",
          logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/52/Dallas_Stars_logo.svg/1200px-Dallas_Stars_logo.svg.png",
          chance: 40,
        },
      ],
    },
  ];

  // Extract unique values for trade reasons and teams
  const tradeReasons = Array.from(
    new Set(initialRumors.map((r) => r.tradeReason))
  );
  const teams = Array.from(
    new Set(initialRumors.flatMap((r) => r.rumoredTeams.map((t) => t.name)))
  );

  const [filteredRumors, setFilteredRumors] = useState(initialRumors);
  const [selectedTradeReason, setSelectedTradeReason] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTeamLinks, setCurrentTeamLinks] = useState([]);

  const handleTradeReasonChange = (event) => {
    const reason = event.target.value;
    setSelectedTradeReason(reason);
    filterRumors(reason, selectedTeam);
  };

  const handleTeamChange = (event) => {
    const team = event.target.value;
    setSelectedTeam(team);
    filterRumors(selectedTradeReason, team);
  };

  const filterRumors = (tradeReason, team) => {
    let filtered = initialRumors;

    if (tradeReason) {
      filtered = filtered.filter((r) => r.tradeReason === tradeReason);
    }

    if (team) {
      filtered = filtered.filter((r) =>
        r.rumoredTeams.some((t) => t.name === team)
      );
    }

    setFilteredRumors(filtered);
  };

  const handleAvatarClick = (teamLinks) => {
    setCurrentTeamLinks(teamLinks);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.paper",
        color: "text.primary",
        pt: 4,
        pb: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <CssBaseline />
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          gutterBottom
          align="center"
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          Trade Rumors
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel id="trade-reason-label">Trade Reason</InputLabel>
                <Select
                  labelId="trade-reason-label"
                  value={selectedTradeReason}
                  onChange={handleTradeReasonChange}
                  label="Trade Reason"
                >
                  <MenuItem value="">All Trade Reasons</MenuItem>
                  {tradeReasons.map((reason) => (
                    <MenuItem key={reason} value={reason}>
                      {reason}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel id="team-label">Rumored Teams</InputLabel>
                <Select
                  labelId="team-label"
                  value={selectedTeam}
                  onChange={handleTeamChange}
                  label="Rumored Teams"
                >
                  <MenuItem value="">All Teams</MenuItem>
                  {teams.map((team) => (
                    <MenuItem key={team} value={team}>
                      {team}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={4}>
          {filteredRumors.map((rumor) => (
            <Grid item xs={12} sm={6} md={4} key={rumor.id}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image={rumor.playerImage}
                    alt={rumor.playerName}
                    sx={{ objectFit: "contain" }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="div">
                      {rumor.playerName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Trade Reason: {rumor.tradeReason}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="h6">Rumored Teams</Typography>
                      {rumor.rumoredTeams.map((team) => (
                        <Tooltip
                          key={team.name}
                          title="Click to view rumors"
                          arrow
                        >
                          <IconButton
                            onClick={() => handleAvatarClick(team.links)}
                            sx={{ mr: 1, mb: 1 }}
                          >
                            <Avatar src={team.logo} />
                          </IconButton>
                        </Tooltip>
                      ))}
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Dialog for showing team rumors links */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Team Rumors</DialogTitle>
          <DialogContent>
            <List>
              {currentTeamLinks.map((link) => (
                <ListItem
                  button
                  component="a"
                  href={link.url}
                  target="_blank"
                  key={link.url}
                >
                  <ListItemText primary={link.title} />
                </ListItem>
              ))}
            </List>
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
}

export default Rumors;
