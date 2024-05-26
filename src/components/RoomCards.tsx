import { LoggedInUser, Room } from "@/types/user";
import { CircularProgress, Stack, Typography } from "@mui/material";
import React from "react";
import RoomCard from "./RoomCard";

const RoomCards = ({
  rooms,
  currUser,
}: {
  rooms: Room[];
  currUser: LoggedInUser;
}) => {
  return (
    <Stack
      sx={{
        width: "100%",
        mt: 1,
      }}
    >
      <Typography
        sx={{
          fontSize: "16px",
          fontWeight: 600,
          mb: "0.5rem",
          color: "#00000090",
        }}
      >
        Rooms
      </Typography>
      <Stack
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        {rooms.length > 0 ? (
          rooms.map((room) => {
            return <RoomCard key={room.id} room={room} currUser={currUser} />;
          })
        ) : (
          <CircularProgress size={30} />
        )}
      </Stack>
    </Stack>
  );
};

export default RoomCards;
