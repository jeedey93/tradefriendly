import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";

const positionOrder = ["Forward", "Defense", "Goalie"];

// Styled components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  boxShadow: theme.shadows[5],
  borderRadius: theme.shape.borderRadius,
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  position: "relative",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

function DragDropTable() {
  const [tableData, setTableData] = useState([]);
  const [listData, setListData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [maxSalary, setMaxSalary] = useState(83); // Initialize maxSalary with current totalSalary

  useEffect(() => {
    // Fetch roster data
    fetch(`/nhl/stats`)
      .then((response) => response.json())
      .then((data) => {
        setListData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching players data: " + error.message);
        setLoading(false);
      });
  }, []);

  // Calculate the total salary
  const totalSalary = useMemo(() => {
    return tableData.reduce((acc, item) => acc + item.capHit, 0);
  }, [tableData]);

  // Sort table data to group by position order
  const sortedTableData = useMemo(() => {
    return [...tableData].sort((a, b) => {
      const posA = positionOrder.indexOf(a.position);
      const posB = positionOrder.indexOf(b.position);
      return posA - posB;
    });
  }, [tableData]);

  // Handle max salary input change
  const handleMaxSalaryChange = (e) => {
    const value = e.target.value.replace(/,/g, "");
    setMaxSalary(Number(value));
  };

  // Handle item addition from list to table
  const addItemToTable = (item) => {
    const potentialNewTotalSalary = totalSalary + item.capHit;

    if (potentialNewTotalSalary > maxSalary) {
      alert(
        `Cannot add ${
          item.name
        }. Adding this item would exceed the maximum salary limit of $${maxSalary.toFixed(
          1
        )} million.`
      );
      return;
    }

    setTableData((prevTableData) => [...prevTableData, item]);
    setListData((prevListData) => prevListData.filter((i) => i.id !== item.id));
  };

  // Handle item removal from table to list
  const removeItemFromTable = (item) => {
    setListData((prevListData) => [...prevListData, item]);
    setTableData((prevTableData) =>
      prevTableData.filter((i) => i.id !== item.id)
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, p: 2 }}>
      {/* Input Field for Salary Cap */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Set Salary Cap
        </Typography>
        <TextField
          label="Salary Cap (M)"
          type="text"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { step: 1, min: 0 },
          }}
          value={maxSalary.toLocaleString()} // Display in millions
          onChange={handleMaxSalaryChange}
          sx={{ width: "300px" }}
        />
      </Box>

      {/* Table Section */}
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="bold">
                  Position
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="bold">
                  Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="bold">
                  Salary
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="bold">
                  Actions
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTableData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.position}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>${row.capHit}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => removeItemFromTable(row)}
                    color="error"
                  >
                    <CloseIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} align="right">
                <Typography variant="subtitle1" fontWeight="bold">
                  Total Salary:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="bold">
                  ${totalSalary}
                </Typography>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </StyledTableContainer>

      {/* List Section */}
      <Box sx={{ maxWidth: 360 }}>
        <Typography variant="h6" gutterBottom>
          Available Players
        </Typography>
        <List sx={{ bgcolor: "background.paper", boxShadow: 3 }}>
          {listData
            .sort((a, b) => b.capHit - a.capHit) // Sort by cap
            .map((item) => (
              <StyledListItem key={item.id}>
                <ListItemText
                  primary={`${item.position} - ${item.name}`}
                  secondary={`$${item.capHit}M`}
                />
                <IconButton
                  onClick={() => addItemToTable(item)}
                  color="primary"
                  sx={{
                    position: "absolute",
                    right: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <AddIcon />
                </IconButton>
              </StyledListItem>
            ))}
        </List>
      </Box>
    </Box>
  );
}

export default DragDropTable;
