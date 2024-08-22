import React from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
} from "@mui/material";

function PlayerTable({ players }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Headshot</TableCell>
            <TableCell>Number</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Position</TableCell>
            <TableCell>Shoots</TableCell>
            <TableCell>Birth Country</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {players.map((player, index) => (
            <TableRow
              key={index}
              component={Link}
              to={`/players/${player.id}`}
              style={{ textDecoration: "none", cursor: "pointer" }}
            >
              <TableCell>
                <Avatar
                  alt={`${player.firstName} ${player.lastName}`}
                  src={player.headshot}
                />
              </TableCell>
              <TableCell>{player.sweaterNumber}</TableCell>
              <TableCell>
                {player.firstName} {player.lastName}
              </TableCell>
              <TableCell>{player.positionCode}</TableCell>
              <TableCell>{player.shootsCatches}</TableCell>
              <TableCell>{player.birthCountry}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PlayerTable;
