"use client";
import { TextField, Button, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Home() {
  const [roomIdInput, setRoomIdInput] = useState("");
  const [error, setError] = useState("");
  const [roomName, setRoomName] = useState("");
  const router = useRouter();

  const createRoom = async () => {
    const res = await axios.post("api/rooms/create", { name: roomName });
    const roomId: string = res?.data;
    router.push(`/room/${roomId}`);
  };

  const joinRoom = async () => {
    setError("");
    const room = await fetch(`/api/rooms/${roomIdInput}`);
    const selectedRoom = await room.json();
    if (Object.keys(selectedRoom).includes("id")) {
      const joinRoom = await axios.post(`/api/${selectedRoom?.id}/join`, {
        roomId: selectedRoom?.id,
      });
      if (joinRoom?.data?.success === true)
        router.push(`/room/${selectedRoom?.id}`);
    } else {
      setError("Room doesn't exists! Please create");
    }
  };

  const { push } = useRouter();
  const logout = async () => {
    try {
      const res: any = await axios.get("/api/users/logout");

      if (res.status === 200) {
        const toastId = toast.success(res.data.message);
        setTimeout(() => {
          toast.remove(toastId);
          push("/login");
        }, 1500);
      }
      if (res.status === 500) {
        toast.error(res.data.error);
      }

      return res;
    } catch (error: any) {
      toast.error(error.message);
      console.log("Error:", error.message);
    }
  };

  return (
    <Stack direction={"column-reverse"} gap={2}>
      <>
        <Toaster />
        <Stack alignItems={"flex-end"}>
          <Button
            size="small"
            sx={{ width: "100px" }}
            endIcon={<LogoutIcon />}
            onClick={logout}
            variant="outlined"
          >
            Logout
          </Button>
        </Stack>
      </>
      <Stack
        sx={{
          gap: 4,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #7170704a",
          background: "#fff",
          p: 5,
          borderRadius: "15px",
        }}
      >
        <Stack direction={"row"} gap={2}>
          <TextField
            label={"Room name (optional)"}
            onChange={(event) => {
              setRoomName(event.target.value);
            }}
          />
          <Button variant="outlined" onClick={createRoom}>
            Create Room
          </Button>
        </Stack>
        <Typography
          sx={{
            border: "1px solid #7170704a",
            p: 1,
            borderRadius: "8px",
            fontSize: "10px",
            fontWeight: "bold",
            background: "#858178",
            color: "#fff",
          }}
        >
          OR
        </Typography>
        <Stack direction={"row"} gap={2}>
          <TextField
            label={"Room ID"}
            onChange={(event) => {
              setRoomIdInput(event.target.value);
            }}
            helperText={error ? error : ""}
            error={!!error}
          />
          <Button
            disabled={!roomIdInput}
            variant="outlined"
            sx={{ minWidth: "135px", maxHeight: "56px", mt: "1px" }}
            onClick={joinRoom}
          >
            Join Room
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
