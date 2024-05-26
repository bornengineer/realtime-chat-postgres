"use client";
import { TextField, Button, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import LogoutIcon from "@mui/icons-material/Logout";
import ShareIcon from "@mui/icons-material/Share";
import RoomCards from "@/components/RoomCards";
import { LoggedInUser } from "@/types/user";
import getLoggedInUser from "@/services/getCurrUser";
import ShareModal from "@/components/ShareModal";

export default function Home() {
  const [roomIdInput, setRoomIdInput] = useState("");
  const [error, setError] = useState("");
  const [roomName, setRoomName] = useState("");
  const [shareModal, setShareModal] = useState(false);
  const [rooms, setRooms] = useState([]);
  const router = useRouter();

  const handleShare = () => {
    setShareModal(true);
  };
  const handleCloseModal = () => {
    setShareModal(false);
  };

  const [currUser, setCurrUser] = useState<LoggedInUser>({
    email: "",
    username: "",
    id: "",
  });

  const createRoom = async () => {
    const res = await axios.post("api/rooms/create", { name: roomName });
    const roomId: string = res?.data;
    router.push(`/room/${roomId}`);
  };

  useEffect(() => {
    const getUser = async () => {
      const user = await getLoggedInUser();
      const rooms = await axios.get(`api/users/${user.id}/rooms`);
      setRooms(rooms.data);
      setCurrUser(user);
    };
    getUser();
  }, []);

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
      <ShareModal
        shareModal={shareModal}
        handleClose={handleCloseModal}
        inviter={currUser.username}
      />
      <>
        <Toaster />
        <Stack justifyContent={"space-between"} flexDirection={"row"} px={0.5}>
          <Button
            size="small"
            endIcon={<ShareIcon />}
            onClick={handleShare}
            variant="contained"
          >
            Share
          </Button>
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
          gap: 2,
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
            label={"Room name"}
            onChange={(event) => {
              setRoomName(event.target.value);
            }}
          />
          <Button
            variant="outlined"
            onClick={createRoom}
            disabled={roomName.length < 3}
          >
            Create Room
          </Button>
        </Stack>
        <Typography
          sx={{
            p: 1,
            borderRadius: "8px",
            fontSize: "10px",
            fontWeight: "bold",
            background: "#00000030",
            color: "#00000070",
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
        <RoomCards rooms={rooms} currUser={currUser} />
      </Stack>
    </Stack>
  );
}
