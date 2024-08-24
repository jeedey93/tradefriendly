import React, { useState } from "react";
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
  Grid,
  Divider,
  Stack,
} from "@mui/material";
import { Delete, Add } from "@mui/icons-material";

const AdminRumor = () => {
  const [rumors, setRumors] = useState([
    {
      playerName: "",
      tradeReason: "",
      rumoredTeams: [{ team: "", chance: 0, links: [{ title: "", url: "" }] }],
    },
  ]);

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
    "Player Conflict",
  ];

  const teams = ["Team A", "Team B", "Team C"];

  const handleAddRumor = () => {
    setRumors([
      ...rumors,
      {
        playerName: "",
        tradeReason: "",
        rumoredTeams: [
          { team: "", chance: 0, links: [{ title: "", url: "" }] },
        ],
      },
    ]);
  };

  const handleRemoveRumor = (index) => {
    const updatedRumors = rumors.filter((_, i) => i !== index);
    setRumors(updatedRumors);
  };

  const handleRumorChange = (index, field, value) => {
    const updatedRumors = [...rumors];
    updatedRumors[index][field] = value;
    setRumors(updatedRumors);
  };

  const handleRumoredTeamChange = (rumorIndex, teamIndex, field, value) => {
    const updatedRumors = [...rumors];
    updatedRumors[rumorIndex].rumoredTeams[teamIndex][field] = value;
    setRumors(updatedRumors);
  };

  const handleLinkChange = (rumorIndex, teamIndex, linkIndex, field, value) => {
    const updatedRumors = [...rumors];
    updatedRumors[rumorIndex].rumoredTeams[teamIndex].links[linkIndex][field] =
      value;
    setRumors(updatedRumors);
  };

  const handleAddTeam = (index) => {
    const updatedRumors = [...rumors];
    updatedRumors[index].rumoredTeams.push({
      team: "",
      chance: 0,
      links: [{ title: "", url: "" }],
    });
    setRumors(updatedRumors);
  };

  const handleRemoveTeam = (rumorIndex, teamIndex) => {
    const updatedRumors = [...rumors];
    updatedRumors[rumorIndex].rumoredTeams = updatedRumors[
      rumorIndex
    ].rumoredTeams.filter((_, i) => i !== teamIndex);
    setRumors(updatedRumors);
  };

  const handleAddLink = (rumorIndex, teamIndex) => {
    const updatedRumors = [...rumors];
    updatedRumors[rumorIndex].rumoredTeams[teamIndex].links.push({
      title: "",
      url: "",
    });
    setRumors(updatedRumors);
  };

  const handleRemoveLink = (rumorIndex, teamIndex, linkIndex) => {
    const updatedRumors = [...rumors];
    updatedRumors[rumorIndex].rumoredTeams[teamIndex].links = updatedRumors[
      rumorIndex
    ].rumoredTeams[teamIndex].links.filter((_, i) => i !== linkIndex);
    setRumors(updatedRumors);
  };

  return (
    <Container maxWidth="xl">
      <Typography
        variant="h3"
        gutterBottom
        align="center"
        sx={{ fontWeight: "bold", color: "primary.main" }}
      >
        Admin Rumor Management
      </Typography>
      <Box my={4} textAlign="center">
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddRumor}
        >
          Add Rumor
        </Button>
      </Box>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <Typography variant="subtitle1">
                  <b>Player Name</b>
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="subtitle1">
                  <b>Trade Reason</b>
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="subtitle1">
                  <b>Rumored Teams</b>
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="subtitle1">
                  <b>Action</b>
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rumors.map((rumor, rumorIndex) => (
              <TableRow key={rumorIndex}>
                <TableCell>
                  <TextField
                    variant="outlined"
                    value={rumor.playerName}
                    onChange={(e) =>
                      handleRumorChange(
                        rumorIndex,
                        "playerName",
                        e.target.value
                      )
                    }
                    placeholder="Player Name"
                    fullWidth
                    margin="normal"
                  />
                </TableCell>
                <TableCell>
                  <FormControl variant="outlined" fullWidth margin="normal">
                    <InputLabel>Trade Reason</InputLabel>
                    <Select
                      value={rumor.tradeReason}
                      onChange={(e) =>
                        handleRumorChange(
                          rumorIndex,
                          "tradeReason",
                          e.target.value
                        )
                      }
                      label="Trade Reason"
                    >
                      {teamTradeReasons
                        .concat(playerTradeReasons)
                        .map((reason, index) => (
                          <MenuItem key={index} value={reason}>
                            {reason}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <Grid container spacing={2}>
                    {rumor.rumoredTeams.map((team, teamIndex) => (
                      <Grid item xs={12} key={teamIndex}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <FormControl
                            variant="outlined"
                            fullWidth
                            margin="normal"
                          >
                            <InputLabel>Team</InputLabel>
                            <Select
                              value={team.team}
                              onChange={(e) =>
                                handleRumoredTeamChange(
                                  rumorIndex,
                                  teamIndex,
                                  "team",
                                  e.target.value
                                )
                              }
                              label="Team"
                            >
                              {teams.map((teamName, index) => (
                                <MenuItem key={index} value={teamName}>
                                  {teamName}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <TextField
                            type="number"
                            label="Chance (%)"
                            variant="outlined"
                            value={team.chance}
                            onChange={(e) =>
                              handleRumoredTeamChange(
                                rumorIndex,
                                teamIndex,
                                "chance",
                                e.target.value
                              )
                            }
                            fullWidth
                            margin="normal"
                          />
                          <Grid container spacing={2}>
                            {team.links.map((link, linkIndex) => (
                              <Grid item xs={12} key={linkIndex}>
                                <Stack
                                  direction="row"
                                  spacing={2}
                                  alignItems="center"
                                >
                                  <TextField
                                    label="Link Title"
                                    variant="outlined"
                                    value={link.title}
                                    onChange={(e) =>
                                      handleLinkChange(
                                        rumorIndex,
                                        teamIndex,
                                        linkIndex,
                                        "title",
                                        e.target.value
                                      )
                                    }
                                    fullWidth
                                  />
                                  <TextField
                                    label="Link URL"
                                    variant="outlined"
                                    value={link.url}
                                    onChange={(e) =>
                                      handleLinkChange(
                                        rumorIndex,
                                        teamIndex,
                                        linkIndex,
                                        "url",
                                        e.target.value
                                      )
                                    }
                                    fullWidth
                                  />
                                  <IconButton
                                    color="secondary"
                                    onClick={() =>
                                      handleRemoveLink(
                                        rumorIndex,
                                        teamIndex,
                                        linkIndex
                                      )
                                    }
                                  >
                                    <Delete />
                                  </IconButton>
                                </Stack>
                              </Grid>
                            ))}
                            <Grid item xs={12}>
                              <Button
                                variant="contained"
                                color="primary"
                                startIcon={<Add />}
                                onClick={() =>
                                  handleAddLink(rumorIndex, teamIndex)
                                }
                                fullWidth
                              >
                                Add Link
                              </Button>
                            </Grid>
                          </Grid>
                          <Divider sx={{ my: 2 }} />
                          <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<Delete />}
                            onClick={() =>
                              handleRemoveTeam(rumorIndex, teamIndex)
                            }
                            fullWidth
                          >
                            Remove Team
                          </Button>
                        </Paper>
                      </Grid>
                    ))}
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={() => handleAddTeam(rumorIndex)}
                        fullWidth
                      >
                        Add Team
                      </Button>
                    </Grid>
                  </Grid>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="error"
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
