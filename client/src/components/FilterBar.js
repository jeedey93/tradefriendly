// FilterBar.js
import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Typography,
  Paper,
} from "@mui/material";

const FilterBar = ({
  tradeReasons,
  teams,
  selectedTradeReason,
  selectedTeam,
  onTradeReasonChange,
  onTeamChange,
}) => {
  return (
    <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
      <Typography variant="h6" component="div" sx={{ mb: 2 }}>
        Filter Rumors
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel id="trade-reason-label">Trade Reason</InputLabel>
            <Select
              labelId="trade-reason-label"
              value={selectedTradeReason}
              onChange={onTradeReasonChange}
              label="Trade Reason"
              sx={{ bgcolor: "background.default" }}
            >
              <MenuItem value="">
                <em>All Trade Reasons</em>
              </MenuItem>
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
              onChange={onTeamChange}
              label="Rumored Teams"
              sx={{ bgcolor: "background.default" }}
            >
              <MenuItem value="">
                <em>All Teams</em>
              </MenuItem>
              {teams.map((team) => (
                <MenuItem key={team} value={team}>
                  {team}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FilterBar;
