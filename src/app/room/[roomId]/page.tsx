"use client";
import CopyToClipboardButton from "@/components/CopyToClipboardButton";
import Goback from "@/components/Goback";
import Messages from "@/components/Messages";
import SendMessage from "@/components/SendMessage";
import { Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

interface RoomProps {
  createdAt: Date;
  updatedAt: Date;
  name: string;
  id: string;
}

const Room = ({ params }: { params: { roomId: string } }) => {
  const { roomId } = params;
  const [initialMessages, setInitialMessages] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomProps>();
  useEffect(() => {
    const fetchData = async () => {
      const messages = await fetch(`/api/messages/${roomId}`);
      const initialMessages = await messages.json();
      setInitialMessages(initialMessages);

      const room = await fetch(`/api/rooms/${roomId}`);
      const selectedRoom = await room.json();
      setSelectedRoom(selectedRoom[0]);
    };

    fetchData();
  }, [roomId]);

  return (
    <Stack gap={2}>
      <Goback text={"Home"} />
      <Stack
        gap={3}
        sx={{
          border: "1px solid #7170701f",
          p: 5,
          borderRadius: "15px",
          background: "#fff",
        }}
      >
        <Stack alignItems={"center"} gap={1}>
          <Typography textAlign={"center"} fontWeight={"bold"}>
            {selectedRoom?.name}
          </Typography>
          <Stack
            direction={"row"}
            sx={{
              border: "1px solid #7170704a",
              width: "65%",
              borderRadius: "5px",
              alignItems: "center",
              justifyContent: "space-between",
              color: "#8e8f8e",
              px: 2,
              py: 0.5,
            }}
          >
            <Typography textAlign={"center"}>{roomId}</Typography>
            <CopyToClipboardButton text={roomId} />
          </Stack>
        </Stack>
        <Messages roomId={roomId} initialMessages={initialMessages} />
        <SendMessage roomId={roomId} />
      </Stack>
    </Stack>
  );
};

export default Room;
