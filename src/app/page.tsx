"use client";
import { TextField, Button, Stack } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function Home() {
  const [roomIdInput, setRoomIdInput] = useState("");
  const [roomName, setRoomName] = useState("");
  const router = useRouter();

  const createRoom = async () => {
    const res = await axios.post("api/rooms/create", { name: roomName });
    const roomId: string = res?.data;
    router.push(`/room/${roomId}`);
  };

  const joinRoom = async () => {
    router.push(`/room/${roomIdInput}`);
  };

  return (
    <Stack
      sx={{
        gap: 4,
        flexDirection: "column",
        border: "1px solid red",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack direction={"row"} gap={2}>
        <TextField
          variant="standard"
          label={"Room name (optional)"}
          onChange={(event) => {
            setRoomName(event.target.value);
          }}
        />
        <Button variant="outlined" onClick={createRoom}>
          Create Room
        </Button>
      </Stack>
      <Stack direction={"row"} gap={2}>
        <TextField
          label={"Room ID"}
          onChange={(event) => {
            setRoomIdInput(event.target.value);
          }}
        />
        <Button disabled={!roomIdInput} variant="outlined" onClick={joinRoom}>
          Join Room
        </Button>
      </Stack>
    </Stack>
  );
}
