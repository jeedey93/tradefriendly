import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Paper, Box, Typography, Card, CardContent } from "@mui/material";

const Lineup = ({ lineup, onDragEnd }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(null);

  const handlePlayerClick = (player, index, section, sectionIndex) => {
    if (selectedPlayer) {
      // Swap the selected player with the current player
      const newLineup = { ...lineup };
      const temp = newLineup[section][sectionIndex].players[index];
      newLineup[section][sectionIndex].players[index] = selectedPlayer;
      newLineup[selectedPlayer.section][selectedPlayer.sectionIndex].players[
        selectedPlayerIndex
      ] = temp;

      // Update state with new lineup and reset selected player
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
    } else {
      // Select the player
      setSelectedPlayer({ ...player, section, sectionIndex });
      setSelectedPlayerIndex(index);
    }
  };

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
              {lineup.forwards.map((line, index) => (
                <Droppable
                  key={line.title}
                  droppableId={line.title}
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
                      </Box>
                      {line.players.map((player, playerIndex) => (
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
                                  {player.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  {player.position}
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
              {lineup.defensemen.map((pair, index) => (
                <Droppable
                  key={pair.title}
                  droppableId={pair.title}
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
                      </Box>
                      {pair.players.map((player, playerIndex) => (
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
                                  {player.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  {player.position}
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
              <Droppable droppableId="goalies-first">
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{ mb: 2 }}
                  >
                    <Typography variant="h6" gutterBottom>
                      First Goalie
                    </Typography>
                    <Draggable
                      key={lineup.goalies.first.id}
                      draggableId={lineup.goalies.first.id}
                      index={0}
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
                              selectedPlayer.id === lineup.goalies.first.id
                                ? "lightblue"
                                : "white",
                            boxShadow:
                              selectedPlayer &&
                              selectedPlayer.id === lineup.goalies.first.id
                                ? 3
                                : 1,
                          }}
                          onClick={() =>
                            handlePlayerClick(
                              lineup.goalies.first,
                              0,
                              "goalies",
                              0
                            )
                          }
                        >
                          <CardContent>
                            <Typography variant="body1" component="div">
                              {lineup.goalies.first.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {lineup.goalies.first.position}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Rating: {lineup.goalies.first.rating || "N/A"}
                            </Typography>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
              <Droppable droppableId="goalies-second">
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{ mb: 2 }}
                  >
                    <Typography variant="h6" gutterBottom>
                      Backup Goalie
                    </Typography>
                    <Draggable
                      key={lineup.goalies.second.id}
                      draggableId={lineup.goalies.second.id}
                      index={0}
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
                              selectedPlayer.id === lineup.goalies.second.id
                                ? "lightblue"
                                : "white",
                            boxShadow:
                              selectedPlayer &&
                              selectedPlayer.id === lineup.goalies.second.id
                                ? 3
                                : 1,
                          }}
                          onClick={() =>
                            handlePlayerClick(
                              lineup.goalies.second,
                              0,
                              "goalies",
                              1
                            )
                          }
                        >
                          <CardContent>
                            <Typography variant="body1" component="div">
                              {lineup.goalies.second.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {lineup.goalies.second.position}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Rating: {lineup.goalies.second.rating || "N/A"}
                            </Typography>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </Box>
    </DragDropContext>
  );
};

export default Lineup;
