import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Paper, Typography, Box, Divider } from "@mui/material";

const Lineup = ({ lineup, onDragEnd }) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 3 }}>
        {/* Forwards */}
        {lineup.forwards && (
          <Droppable droppableId="forwards" direction="vertical">
            {(provided) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  border: "1px solid lightgray",
                  borderRadius: 2,
                  p: 2,
                  backgroundColor: "#f9f9f9",
                }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Forwards
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {lineup.forwards.map((line, lineIndex) => (
                  <Droppable
                    key={lineIndex}
                    droppableId={`forwards-${lineIndex}`}
                    direction="horizontal"
                  >
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 1,
                          mb: 2,
                          p: 1,
                          borderRadius: 2,
                          backgroundColor: "#fff",
                          boxShadow: 1,
                        }}
                      >
                        <Box sx={{ flexShrink: 0, mr: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {line.title}
                          </Typography>
                          <Typography variant="subtitle2">
                            Chemistry Rating: {line.chemistry || "N/A"}
                          </Typography>
                        </Box>
                        {line.players.map((player, playerIndex) => (
                          <Draggable
                            key={player.id}
                            draggableId={player.id}
                            index={playerIndex}
                          >
                            {(provided) => (
                              <Paper
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{
                                  p: 2,
                                  mb: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderRadius: 1,
                                  backgroundColor: "#fff",
                                  boxShadow: 2,
                                  cursor: "grab",
                                }}
                              >
                                {player.name}
                              </Paper>
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
        )}

        {/* Defensemen */}
        {lineup.defensemen && (
          <Droppable droppableId="defensemen" direction="vertical">
            {(provided) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  border: "1px solid lightgray",
                  borderRadius: 2,
                  p: 2,
                  backgroundColor: "#f9f9f9",
                }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Defensemen
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {lineup.defensemen.map((line, lineIndex) => (
                  <Droppable
                    key={lineIndex}
                    droppableId={`defensemen-${lineIndex}`}
                    direction="horizontal"
                  >
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 1,
                          mb: 2,
                          p: 1,
                          borderRadius: 2,
                          backgroundColor: "#fff",
                          boxShadow: 1,
                        }}
                      >
                        <Box sx={{ flexShrink: 0, mr: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {line.title}
                          </Typography>
                          <Typography variant="subtitle2">
                            Chemistry Rating: {line.chemistry || "N/A"}
                          </Typography>
                        </Box>
                        {line.players.map((player, playerIndex) => (
                          <Draggable
                            key={player.id}
                            draggableId={player.id}
                            index={playerIndex}
                          >
                            {(provided) => (
                              <Paper
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{
                                  p: 2,
                                  mb: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderRadius: 1,
                                  backgroundColor: "#fff",
                                  boxShadow: 2,
                                  cursor: "grab",
                                }}
                              >
                                {player.name}
                              </Paper>
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
        )}

        {/* Goalies */}
        {lineup.goalies && lineup.goalies.length > 0 && (
          <Droppable droppableId="goalies" direction="vertical">
            {(provided) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  border: "1px solid lightgray",
                  borderRadius: 2,
                  p: 2,
                  backgroundColor: "#f9f9f9",
                }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Goalies
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Droppable droppableId="goalies-line" direction="horizontal">
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 1,
                        p: 1,
                        borderRadius: 2,
                        backgroundColor: "#fff",
                        boxShadow: 1,
                      }}
                    >
                      {lineup.goalies.map((player, playerIndex) => (
                        <Draggable
                          key={player.id}
                          draggableId={player.id}
                          index={playerIndex}
                        >
                          {(provided) => (
                            <Paper
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{
                                p: 2,
                                mb: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 1,
                                backgroundColor: "#fff",
                                boxShadow: 2,
                                cursor: "grab",
                              }}
                            >
                              {player.name}
                            </Paper>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        )}
      </Box>
    </DragDropContext>
  );
};

export default Lineup;
