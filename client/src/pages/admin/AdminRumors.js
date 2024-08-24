import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Paper,
  Popover,
  Snackbar,
} from "@mui/material";

import { Delete, Add } from "@mui/icons-material";

const AdminRumor = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [rumors, setRumors] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [newRumor, setNewRumor] = useState({
    playerName: "",
    playerImage: "",
    tradeReason: "",
    rumoredTeams: [
      { teamId: "", teamName: "", chance: 0, links: [{ title: "", url: "" }] },
    ],
  });

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

  const tradeReasons = teamTradeReasons.concat(playerTradeReasons);

  const [teamsData, setTeamsData] = useState([]);

  useEffect(() => {
    fetch("/api/teams")
      .then((response) => response.json())
      .then((data) => {
        data.sort((a, b) => a.city.localeCompare(b.city));
        setTeamsData(data);
      })
      .catch((error) => console.error("Error fetching teams data:", error));
  }, []);

  const handleAddRumorClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    resetNewRumor();
  };

  const handleSaveRumor = () => {
    setRumors([...rumors, newRumor]);

    fetch("/api/rumors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRumor),
    })
      .then(() => {
        setSnackbarMessage("Rumor saved successfully!");
        setOpenSnackbar(true);
      })
      .catch((error) => {
        setError("Error saving rumor data: " + error.message);
      });

    handlePopoverClose();
  };

  const resetNewRumor = () => {
    setNewRumor({
      playerName: "",
      playerImage: "",
      tradeReason: "",
      rumoredTeams: [
        {
          teamId: "",
          teamName: "",
          chance: 0,
          links: [{ title: "", url: "" }],
        },
      ],
    });
  };

  const handleRumorChange = (field, value) => {
    setNewRumor((prevRumor) => ({ ...prevRumor, [field]: value }));
  };

  const handleRumoredTeamChange = (index, field, value) => {
    const updatedTeams = [...newRumor.rumoredTeams];

    if (field === "teamId") {
      const selectedTeam = teamsData.find((team) => team._id === value);
      if (selectedTeam) {
        updatedTeams[index] = {
          ...updatedTeams[index],
          teamId: value,
          teamName: `${selectedTeam.city} ${selectedTeam.name}`,
        };
      }
    } else {
      updatedTeams[index] = { ...updatedTeams[index], [field]: value };
    }

    setNewRumor((prevRumor) => ({ ...prevRumor, rumoredTeams: updatedTeams }));
  };

  const handleAddRumoredTeam = () => {
    setNewRumor((prevRumor) => ({
      ...prevRumor,
      rumoredTeams: [
        ...prevRumor.rumoredTeams,
        {
          teamId: "",
          teamName: "",
          chance: 0,
          links: [{ title: "", url: "" }],
        },
      ],
    }));
  };

  const handleRemoveRumor = (index) => {
    setRumors(rumors.filter((_, i) => i !== index));
  };

  const handleAddLink = (teamIndex) => {
    const updatedTeams = [...newRumor.rumoredTeams];
    updatedTeams[teamIndex].links.push({ title: "", url: "" });
    setNewRumor((prevRumor) => ({ ...prevRumor, rumoredTeams: updatedTeams }));
  };

  const handleLinkChange = (teamIndex, linkIndex, field, value) => {
    const updatedTeams = [...newRumor.rumoredTeams];
    updatedTeams[teamIndex].links[linkIndex] = {
      ...updatedTeams[teamIndex].links[linkIndex],
      [field]: value,
    };
    setNewRumor((prevRumor) => ({ ...prevRumor, rumoredTeams: updatedTeams }));
  };

  const open = Boolean(anchorEl);
  const id = open ? "add-rumor-popover" : undefined;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" align="center" gutterBottom>
        Admin Rumor Page
      </Typography>
      <Box my={4}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddRumorClick}
        >
          Add Rumor
        </Button>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Box p={2} width={600}>
            <Typography variant="h6" gutterBottom>
              Add New Rumor
            </Typography>
            <TextField
              variant="outlined"
              label="Player Name"
              value={newRumor.playerName}
              onChange={(e) => handleRumorChange("playerName", e.target.value)}
              fullWidth
              margin="normal"
            />
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel>Trade Reason</InputLabel>
              <Select
                value={newRumor.tradeReason}
                onChange={(e) =>
                  handleRumorChange("tradeReason", e.target.value)
                }
                label="Trade Reason"
              >
                {tradeReasons.map((reason, index) => (
                  <MenuItem key={index} value={reason}>
                    {reason}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="h6" gutterBottom>
              Rumored Teams
            </Typography>
            {newRumor.rumoredTeams.map((team, index) => (
              <Box key={index} mt={2}>
                <FormControl variant="outlined" fullWidth margin="normal">
                  <InputLabel>Team</InputLabel>
                  <Select
                    value={team.teamId}
                    onChange={(e) =>
                      handleRumoredTeamChange(index, "teamId", e.target.value)
                    }
                    label="Team"
                  >
                    {teamsData.map((teamOption, i) => (
                      <MenuItem key={i} value={teamOption._id}>
                        {teamOption.city + " " + teamOption.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  variant="outlined"
                  label="Chance (%)"
                  type="number"
                  value={team.chance}
                  onChange={(e) =>
                    handleRumoredTeamChange(index, "chance", e.target.value)
                  }
                  fullWidth
                  margin="normal"
                />
                <Typography variant="subtitle1">Links</Typography>
                {team.links.map((link, linkIndex) => (
                  <Box
                    key={linkIndex}
                    display="flex"
                    alignItems="center"
                    mt={1}
                  >
                    <TextField
                      variant="outlined"
                      label="Media Source"
                      value={link.title}
                      onChange={(e) =>
                        handleLinkChange(
                          index,
                          linkIndex,
                          "title",
                          e.target.value
                        )
                      }
                      margin="normal"
                      fullWidth
                      style={{ marginRight: 8 }}
                    />
                    <TextField
                      variant="outlined"
                      label="Link URL"
                      value={link.url}
                      onChange={(e) =>
                        handleLinkChange(
                          index,
                          linkIndex,
                          "url",
                          e.target.value
                        )
                      }
                      margin="normal"
                      fullWidth
                    />
                  </Box>
                ))}
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleAddLink(index)}
                  fullWidth
                >
                  Add Link
                </Button>
              </Box>
            ))}
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddRumoredTeam}
              fullWidth
              style={{ marginTop: 16 }}
            >
              Add Rumored Team
            </Button>
            <Box mt={2} display="flex" justifyContent="space-between">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveRumor}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handlePopoverClose}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Popover>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <b>Player Name</b>
              </TableCell>
              <TableCell align="center">
                <b>Trade Reason</b>
              </TableCell>
              <TableCell align="center">
                <b>Rumored Teams</b>
              </TableCell>
              <TableCell align="center">
                <b>Action</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rumors.map((rumor, rumorIndex) => (
              <TableRow key={rumorIndex}>
                <TableCell>{rumor.playerName}</TableCell>
                <TableCell>{rumor.tradeReason}</TableCell>
                <TableCell>
                  <ul>
                    {rumor.rumoredTeams.map((team, teamIndex) => (
                      <li key={teamIndex}>
                        {team.teamName} - {team.chance}%
                        <ul>
                          {team.links.map((link, linkIndex) => (
                            <li key={linkIndex}>
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {link.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    aria-label="delete"
                    color="secondary"
                    onClick={() => handleRemoveRumor(rumorIndex)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminRumor;
