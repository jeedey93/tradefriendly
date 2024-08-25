import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Paper, Typography, Box, Divider, Tooltip } from "@mui/material";

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
                  sx={{ fontWeight: "bold", mb: 2 }}
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
                          gap: 2,
                          mb: 2,
                          p: 1,
                          borderRadius: 2,
                          backgroundColor: "#fff",
                          boxShadow: 1,
                        }}
                      >
                        <Box
                          sx={{
                            flexShrink: 0,
                            mr: 2,
                            p: 1,
                            backgroundColor: "#e3f2fd",
                            borderRadius: 1,
                          }}
                        >
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
                              <Tooltip
                                title={`Position: ${player.position}\nRating: ${player.overallRating}`}
                                arrow
                              >
                                <Paper
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  sx={{
                                    p: 2,
                                    mb: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: 1,
                                    backgroundColor: "#fff",
                                    boxShadow: 2,
                                    cursor: "grab",
                                  }}
                                >
                                  <Typography
                                    variant="body1"
                                    sx={{ fontWeight: "bold" }}
                                  >
                                    {player.name}
                                  </Typography>
                                  <Typography variant="body2">
                                    Position: {player.position}
                                  </Typography>
                                  <Typography variant="body2">
                                    Rating: {player.overallRating}
                                  </Typography>
                                </Paper>
                              </Tooltip>
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
                  sx={{ fontWeight: "bold", mb: 2 }}
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
                          gap: 2,
                          mb: 2,
                          p: 1,
                          borderRadius: 2,
                          backgroundColor: "#fff",
                          boxShadow: 1,
                        }}
                      >
                        <Box
                          sx={{
                            flexShrink: 0,
                            mr: 2,
                            p: 1,
                            backgroundColor: "#e3f2fd",
                            borderRadius: 1,
                          }}
                        >
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
                              <Tooltip
                                title={`Position: ${player.position}\nRating: ${player.overallRating}`}
                                arrow
                              >
                                <Paper
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  sx={{
                                    p: 2,
                                    mb: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: 1,
                                    backgroundColor: "#fff",
                                    boxShadow: 2,
                                    cursor: "grab",
                                  }}
                                >
                                  <Typography
                                    variant="body1"
                                    sx={{ fontWeight: "bold" }}
                                  >
                                    {player.name}
                                  </Typography>
                                  <Typography variant="body2">
                                    Position: {player.position}
                                  </Typography>
                                  <Typography variant="body2">
                                    Rating: {player.overallRating}
                                  </Typography>
                                </Paper>
                              </Tooltip>
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
        {lineup.goalies && (
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
                  sx={{ fontWeight: "bold", mb: 2 }}
                >
                  Goalies
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 2,
                    mb: 2,
                    p: 1,
                    borderRadius: 2,
                    backgroundColor: "#fff",
                    boxShadow: 1,
                  }}
                >
                  {[lineup.goalies.first, lineup.goalies.second].map(
                    (goalie, index) => (
                      <Draggable
                        key={goalie.id}
                        draggableId={goalie.id}
                        index={index}
                      >
                        {(provided) => (
                          <Tooltip
                            title={`Position: ${goalie.position}\nRating: ${goalie.overallRating}`}
                            arrow
                          >
                            <Paper
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{
                                p: 2,
                                mb: 1,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 1,
                                backgroundColor: "#fff",
                                boxShadow: 2,
                                cursor: "grab",
                              }}
                            >
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: "bold" }}
                              >
                                {goalie.name}
                              </Typography>
                              <Typography variant="body2">
                                Position: {goalie.position}
                              </Typography>
                              <Typography variant="body2">
                                Rating: {goalie.overallRating}
                              </Typography>
                            </Paper>
                          </Tooltip>
                        )}
                      </Draggable>
                    )
                  )}
                </Box>
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        )}

        {/* Reserves */}
        {lineup.reserves && (
          <Droppable droppableId="reserves" direction="vertical">
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
                  sx={{ fontWeight: "bold", mb: 2 }}
                >
                  Reserves
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 2,
                    mb: 2,
                    p: 1,
                    borderRadius: 2,
                    backgroundColor: "#fff",
                    boxShadow: 1,
                  }}
                >
                  {lineup.reserves.map((reserve, index) => (
                    <Draggable
                      key={reserve.id}
                      draggableId={reserve.id}
                      index={index}
                    >
                      {(provided) => (
                        <Tooltip
                          title={`Position: ${reserve.position}\nRating: ${reserve.overallRating}`}
                          arrow
                        >
                          <Paper
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              p: 2,
                              mb: 1,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: 1,
                              backgroundColor: "#fff",
                              boxShadow: 2,
                              cursor: "grab",
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: "bold" }}
                            >
                              {reserve.name}
                            </Typography>
                            <Typography variant="body2">
                              Position: {reserve.position}
                            </Typography>
                            <Typography variant="body2">
                              Rating: {reserve.overallRating}
                            </Typography>
                          </Paper>
                        </Tooltip>
                      )}
                    </Draggable>
                  ))}
                </Box>
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
