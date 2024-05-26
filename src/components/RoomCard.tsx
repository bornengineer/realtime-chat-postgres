import { LoggedInUser, Room } from "@/types/user";
import { Stack, Tooltip, Typography } from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Link from "next/link";
import React from "react";

const RoomCard = ({
  room,
  currUser,
}: {
  room: Room;
  currUser: LoggedInUser;
}) => {
  return (
    <Link
      href={`room/${room.id}`}
      style={{
        textDecoration: "none",
        color: "white",
        backgroundColor: "#ffffff !important",
        width: "100%",
      }}
    >
      <Stack
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "1rem",
          p: "0.5rem 0.8rem",
          backgroundColor: "#00000050",
          transition: "all 0.1s ease-in-out",
          "&:hover": {
            backgroundColor: "#00000060",
          },
          borderRadius: "5px",
        }}
      >
        <Typography>{room.name}</Typography>
        {room.creatorId === currUser.id && (
          <Tooltip title="Room created by you">
            <AdminPanelSettingsIcon />
          </Tooltip>
        )}
      </Stack>
    </Link>
  );
};

export default RoomCard;
