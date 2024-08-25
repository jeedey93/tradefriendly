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
                                  {player.position}
                                </Typography>
                                <Typography variant="body2">
                                  Rating: {player.overallRating}
                                </Typography>
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
                                  {player.position}
                                </Typography>
                                <Typography variant="body2">
                                  Rating: {player.overallRating}
                                </Typography>
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
                  sx={{ fontWeight: "bold" }}
                >
                  Goalies
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box
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
                  <Draggable
                    key={lineup.goalies.first.id}
                    draggableId={lineup.goalies.first.id}
                    index={0}
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
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 1,
                          backgroundColor: "#fff",
                          boxShadow: 2,
                          cursor: "grab",
                        }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                          {lineup.goalies.first.name}
                        </Typography>
                        <Typography variant="body2">
                          {lineup.goalies.first.position}
                        </Typography>
                        <Typography variant="body2">
                          Rating: {lineup.goalies.first.overallRating}
                        </Typography>
                      </Paper>
                    )}
                  </Draggable>
                  <Draggable
                    key={lineup.goalies.second.id}
                    draggableId={lineup.goalies.second.id}
                    index={1}
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
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 1,
                          backgroundColor: "#fff",
                          boxShadow: 2,
                          cursor: "grab",
                        }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                          {lineup.goalies.second.name}
                        </Typography>
                        <Typography variant="body2">
                          {lineup.goalies.second.position}
                        </Typography>
                        <Typography variant="body2">
                          Rating: {lineup.goalies.second.overallRating}
                        </Typography>
                      </Paper>
                    )}
                  </Draggable>
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
                  sx={{ fontWeight: "bold" }}
                >
                  Reserves
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box
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
                  {lineup.reserves.map((player, index) => (
                    <Draggable
                      key={player.id}
                      draggableId={player.id}
                      index={index}
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
                            {player.position}
                          </Typography>
                          <Typography variant="body2">
                            Rating: {player.overallRating}
                          </Typography>
                        </Paper>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              </Box>
            )}
          </Droppable>
        )}
      </Box>
    </DragDropContext>
  );
};

export default Lineup;
