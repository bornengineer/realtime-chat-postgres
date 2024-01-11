"use client";
import CopyToClipboardButton from "@/components/CopyToClipboardButton";
import Goback from "@/components/Goback";
import Messages from "@/components/Messages";
import SendMessage from "@/components/SendMessage";
import { Stack, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

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

  const stackRef = useRef<HTMLDivElement | null>(null);

  function scrollBottom(
    stackRef: React.MutableRefObject<HTMLDivElement | null>
  ) {
    console.log("stackRef:>>", stackRef);
    stackRef.current?.scrollTo(0, stackRef.current?.scrollHeight);
  }
  useEffect(() => {
    scrollBottom(stackRef);
  }, [roomId, initialMessages]);

  return (
    <Stack gap={0.5}>
      <Goback text={"Home"} />
      <Stack
        sx={{
          border: "1px solid #7170701f",
          p: 0,
          borderRadius: "15px 15px 0 0",
          background: "#f0ebe2",
          width: "35vw",
          minWidth: "450px",
        }}
      >
        <Stack
          alignItems={"center"}
          gap={3}
          direction={"row"}
          sx={{
            background: "#f0f2f5",
            px: 5,
            py: 2,
            borderRadius: "15px 15px 0 0",
            borderBottom: "1px solid #7170701f",
          }}
        >
          <Typography textAlign={"center"} fontWeight={"500"}>
            {selectedRoom?.name}
          </Typography>
          <Stack
            direction={"row"}
            sx={{
              border: "1px solid #7170704a",
              gap: 1,
              borderRadius: "5px",
              alignItems: "center",
              justifyContent: "space-between",
              color: "#8e8f8e",
              px: 1,
              py: 0.5,
            }}
          >
            <Typography textAlign={"center"} fontSize={"13px"}>
              {roomId}
            </Typography>
            <CopyToClipboardButton text={roomId} />
          </Stack>
        </Stack>
        <Stack
          ref={stackRef}
          px={5}
          pb={2}
          sx={{
            gap: 2,
            height: "72vh",
            overflowY: "scroll",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#00000020", // Thumb
            },
            "&::-webkit-scrollbar-track": {
              background: "#f0ebe2", // Track
            },
          }}
        >
          <Messages
            scrollBottom={scrollBottom}
            stackRef={stackRef}
            roomId={roomId}
            initialMessages={initialMessages}
          />
        </Stack>
        <Stack
          alignItems={"center"}
          gap={3}
          direction={"row"}
          sx={{
            background: "#f0f2f5",
            borderTop: "1px solid #7170701f",
            px: 5,
            py: 1,
          }}
        >
          <SendMessage roomId={roomId} />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Room;
