import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Paper, Box, Typography, Card, CardContent } from "@mui/material";

const Lineup = ({ lineup, onDragEnd }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(null);

  const handlePlayerClick = (player, index, section, sectionIndex) => {
    if (selectedPlayer) {
      const newLineup = { ...lineup };
      const temp = newLineup[section][sectionIndex]?.players[index];
      if (temp) {
        newLineup[section][sectionIndex].players[index] = selectedPlayer;
        newLineup[selectedPlayer.section][selectedPlayer.sectionIndex].players[
          selectedPlayerIndex
        ] = temp;

        onDragEnd(
          {
            source: {
              index: selectedPlayerIndex,
              droppableId: selectedPlayer.section,
            },
            destination: { index, droppableId: section },
          },
          newLineup
        );
        setSelectedPlayer(null);
        setSelectedPlayerIndex(null);
      }
    } else {
      setSelectedPlayer({ ...player, section, sectionIndex });
      setSelectedPlayerIndex(index);
    }
  };

  if (!lineup) return <Typography>Loading...</Typography>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 2 }}>
        {/* Forwards Section */}
        <Droppable droppableId="forwards" type="COLUMN">
          {(provided) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                border: "1px solid #ddd",
                borderRadius: 2,
                p: 2,
                mt: 3,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                backgroundColor: "#f5f5f5",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Forwards
              </Typography>
              {lineup.forwards?.map((line, index) => (
                <Droppable
                  key={line.title}
                  droppableId={`forwards-${line.title}`}
                  direction="horizontal"
                >
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 2,
                        overflowX: "auto",
                        mb: 2,
                        border: "1px solid #ddd",
                        borderRadius: 2,
                        p: 2,
                        backgroundColor: "#fff",
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {line.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Chemistry: {line.chemistry || "N/A"}
                        </Typography>
                      </Box>
                      {line.players?.map((player, playerIndex) => (
                        <Draggable
                          key={player.id}
                          draggableId={player.id}
                          index={playerIndex}
                        >
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{
                                minWidth: 150,
                                mb: 1,
                                cursor: "pointer",
                                backgroundColor:
                                  selectedPlayer &&
                                  selectedPlayer.id === player.id
                                    ? "lightblue"
                                    : "white",
                                boxShadow:
                                  selectedPlayer &&
                                  selectedPlayer.id === player.id
                                    ? 3
                                    : 1,
                              }}
                              onClick={() =>
                                handlePlayerClick(
                                  player,
                                  playerIndex,
                                  "forwards",
                                  index
                                )
                              }
                            >
                              <CardContent>
                                <Typography variant="body1" component="div">
                                  {player.name || "Unnamed Player"}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  {player.position || "N/A"}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  Rating: {player.rating || "N/A"}
                                </Typography>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>

        {/* Defensemen Section */}
        <Droppable droppableId="defensemen" type="COLUMN">
          {(provided) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                border: "1px solid #ddd",
                borderRadius: 2,
                p: 2,
                mt: 3,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                backgroundColor: "#f5f5f5",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Defensemen
              </Typography>
              {lineup.defensemen?.map((pair, index) => (
                <Droppable
                  key={pair.title}
                  droppableId={`defensemen-${pair.title}`}
                  direction="horizontal"
                >
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 2,
                        overflowX: "auto",
                        mb: 2,
                        border: "1px solid #ddd",
                        borderRadius: 2,
                        p: 2,
                        backgroundColor: "#fff",
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {pair.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Chemistry: {pair.chemistry || "N/A"}
                        </Typography>
                      </Box>
                      {pair.players?.map((player, playerIndex) => (
                        <Draggable
                          key={player.id}
                          draggableId={player.id}
                          index={playerIndex}
                        >
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{
                                minWidth: 150,
                                mb: 1,
                                cursor: "pointer",
                                backgroundColor:
                                  selectedPlayer &&
                                  selectedPlayer.id === player.id
                                    ? "lightblue"
                                    : "white",
                                boxShadow:
                                  selectedPlayer &&
                                  selectedPlayer.id === player.id
                                    ? 3
                                    : 1,
                              }}
                              onClick={() =>
                                handlePlayerClick(
                                  player,
                                  playerIndex,
                                  "defensemen",
                                  index
                                )
                              }
                            >
                              <CardContent>
                                <Typography variant="body1" component="div">
                                  {player.name || "Unnamed Player"}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  {player.position || "N/A"}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  Rating: {player.rating || "N/A"}
                                </Typography>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>

        {/* Goalies Section */}
        <Droppable droppableId="goalies" type="COLUMN">
          {(provided) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                border: "1px solid #ddd",
                borderRadius: 2,
                p: 2,
                mt: 3,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                backgroundColor: "#f5f5f5",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Goalies
              </Typography>
              {/* Starter Goalie */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                  overflowX: "auto",
                  mb: 2,
                  border: "1px solid #ddd",
                  borderRadius: 2,
                  p: 2,
                  backgroundColor: "#fff",
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Starter
                  </Typography>
                </Box>
                {lineup.goalies?.starter && (
                  <Card
                    sx={{
                      minWidth: 150,
                      mb: 1,
                      cursor: "pointer",
                      backgroundColor:
                        selectedPlayer &&
                        selectedPlayer.id === lineup.goalies.starter.id
                          ? "lightblue"
                          : "white",
                      boxShadow:
                        selectedPlayer &&
                        selectedPlayer.id === lineup.goalies.starter.id
                          ? 3
                          : 1,
                    }}
                    onClick={() =>
                      handlePlayerClick(
                        lineup.goalies.starter,
                        0,
                        "goalies",
                        "starter"
                      )
                    }
                  >
                    <CardContent>
                      <Typography variant="body1" component="div">
                        {lineup.goalies.starter.name || "Unnamed Player"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Position: G
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Rating: {lineup.goalies.starter.rating || "N/A"}
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </Box>

              {/* Backup Goalie */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                  overflowX: "auto",
                  mb: 2,
                  border: "1px solid #ddd",
                  borderRadius: 2,
                  p: 2,
                  backgroundColor: "#fff",
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Backup
                  </Typography>
                </Box>
                {lineup.goalies?.backup && (
                  <Card
                    sx={{
                      minWidth: 150,
                      mb: 1,
                      cursor: "pointer",
                      backgroundColor:
                        selectedPlayer &&
                        selectedPlayer.id === lineup.goalies.backup.id
                          ? "lightblue"
                          : "white",
                      boxShadow:
                        selectedPlayer &&
                        selectedPlayer.id === lineup.goalies.backup.id
                          ? 3
                          : 1,
                    }}
                    onClick={() =>
                      handlePlayerClick(
                        lineup.goalies.backup,
                        0,
                        "goalies",
                        "backup"
                      )
                    }
                  >
                    <CardContent>
                      <Typography variant="body1" component="div">
                        {lineup.goalies.backup.name || "Unnamed Player"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Position: G
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Rating: {lineup.goalies.backup.rating || "N/A"}
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </Box>
              {provided.placeholder}
            </Box>
          )}
        </Droppable>

        {/* Reserves Section */}
        <Droppable droppableId="reserves" type="COLUMN">
          {(provided) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                border: "1px solid #ddd",
                borderRadius: 2,
                p: 2,
                mt: 3,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                backgroundColor: "#f5f5f5",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Reserves
              </Typography>
              {lineup.reserves?.map((line, index) => (
                <Droppable
                  key={line.title}
                  droppableId={`reserves-${line.title}`}
                  direction="horizontal"
                >
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 2,
                        overflowX: "auto",
                        mb: 2,
                        border: "1px solid #ddd",
                        borderRadius: 2,
                        p: 2,
                        backgroundColor: "#fff",
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {line.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Chemistry: {line.chemistry || "N/A"}
                        </Typography>
                      </Box>
                      {line.players?.map((player, playerIndex) => (
                        <Draggable
                          key={player.id}
                          draggableId={player.id}
                          index={playerIndex}
                        >
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{
                                minWidth: 150,
                                mb: 1,
                                cursor: "pointer",
                                backgroundColor:
                                  selectedPlayer &&
                                  selectedPlayer.id === player.id
                                    ? "lightblue"
                                    : "white",
                                boxShadow:
                                  selectedPlayer &&
                                  selectedPlayer.id === player.id
                                    ? 3
                                    : 1,
                              }}
                              onClick={() =>
                                handlePlayerClick(
                                  player,
                                  playerIndex,
                                  "reserves",
                                  index
                                )
                              }
                            >
                              <CardContent>
                                <Typography variant="body1" component="div">
                                  {player.name || "Unnamed Player"}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  {player.position || "N/A"}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  Rating: {player.rating || "N/A"}
                                </Typography>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </Box>
    </DragDropContext>
  );
};

export default Lineup;
