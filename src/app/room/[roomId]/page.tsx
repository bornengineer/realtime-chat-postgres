"use client";
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
    <Stack gap={3}>
      <Typography>
        <strong>{selectedRoom?.name}</strong> ({roomId})
      </Typography>
      <Messages roomId={roomId} initialMessages={initialMessages} />
      <SendMessage roomId={roomId} />
    </Stack>
  );
};

export default Room;
