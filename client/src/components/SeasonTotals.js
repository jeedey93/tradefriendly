import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

// Helper function to format season as "YYYY-YYYY"
const formatSeason = (season) => {
  let seasonString = season.toString();
  const year1 = seasonString.slice(0, 4);
  const year2 = seasonString.slice(4);
  return `${year1}-${year2}`;
};

const getPlusMinusStyle = (value) => {
  return {
    color: value > 0 ? "green" : value < 0 ? "red" : "black",
  };
};

const SeasonTotalsTable = ({ seasonTotals }) => {
  // Split seasonTotals into arrays based on gameTypeId
  const seasonStatsData = seasonTotals.filter(
    (season) => season.gameTypeId === 2
  );
  const playoffStatsData = seasonTotals.filter(
    (season) => season.gameTypeId === 3
  );

  // Render a table for each gameTypeId
  const renderTable = (data, gameTypeName) => (
    <>
      <Typography variant="h6" gutterBottom>
        {gameTypeName}
      </Typography>
      <TableContainer component={Paper} style={{ marginBottom: "16px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Season</TableCell>
              <TableCell>League</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>Games Played</TableCell>
              <TableCell>Goals</TableCell>
              <TableCell>Assists</TableCell>
              <TableCell>Points</TableCell>
              <TableCell>Plus Minus</TableCell>
              <TableCell>AVG TOI</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .filter(
                (season) =>
                  season.leagueAbbrev === "NHL" || season.leagueAbbrev === "AHL"
              )
              .map((season, index) => (
                <TableRow key={index}>
                  <TableCell>{formatSeason(season.season)}</TableCell>
                  <TableCell>{season.leagueAbbrev}</TableCell>
                  <TableCell>{season.teamName.default}</TableCell>
                  <TableCell>{season.gamesPlayed}</TableCell>
                  <TableCell>{season.goals}</TableCell>
                  <TableCell>{season.assists}</TableCell>
                  <TableCell>{season.points}</TableCell>
                  <TableCell style={getPlusMinusStyle(season.plusMinus)}>
                    {season.plusMinus}
                  </TableCell>
                  <TableCell>{season.avgToi}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );

  return (
    <>
      {renderTable(seasonStatsData, "Regular Season")}
      {renderTable(playoffStatsData, "Playoffs")}
    </>
  );
};

export default SeasonTotalsTable;
