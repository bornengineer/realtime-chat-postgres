"use client";
import CopyToClipboardButton from "@/components/CopyToClipboardButton";
import Goback from "@/components/Goback";
import Messages from "@/components/Messages";
import SendMessage from "@/components/SendMessage";
import getLoggedInUser from "@/services/getCurrUser";
import truncateId from "@/utils/truncateId";
import { User } from "@/utils/types";
import { Stack, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

interface RoomProps {
  createdAt: Date;
  updatedAt: Date;
  name: string;
  id: string;
  creatorId: string;
  users: User[];
}

const Room = ({ params }: { params: { roomId: string } }) => {
  const { roomId } = params;
  const [initialMessages, setInitialMessages] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomProps>();
  const [loading, setLoading] = useState(true);
  const [currUser, setCurrUser] = useState({
    email: "",
    username: "",
    id: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const messages = await fetch(`/api/messages/${roomId}`);
        const initialMessages = await messages.json();
        setInitialMessages(initialMessages);

        const room = await fetch(`/api/rooms/${roomId}`);
        const selectedRoom = await room.json();
        setSelectedRoom(selectedRoom);
      } catch (err: any) {
        console.log("Fetching messages failed :", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [roomId]);

  useEffect(() => {
    const getUser = async () => {
      const user = await getLoggedInUser();
      setCurrUser(user);
    };
    getUser();
  }, []);

  const stackRef = useRef<HTMLDivElement | null>(null);

  function scrollBottom(
    stackRef: React.MutableRefObject<HTMLDivElement | null>
  ) {
    stackRef.current?.scrollTo(0, stackRef.current?.scrollHeight);
  }
  useEffect(() => {
    scrollBottom(stackRef);
  }, [roomId, initialMessages]);

  return (
    <Stack gap={0.5}>
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Goback text={"Home"} />
        <Stack
          direction={"column"}
          alignItems={"flex-end"}
          justifyContent={"center"}
          mr={0.5}
        >
          <Typography sx={{ color: "#454a4d", fontSize: "14px" }}>
            {currUser.username}
          </Typography>
          <Typography sx={{ color: "#667781", fontSize: "12px" }}>
            {currUser.email}
          </Typography>
        </Stack>
      </Stack>
      <Stack
        sx={{
          border: "1px solid #7170701f",
          p: 0,
          borderRadius: "15px 15px 0 0",
          background: "#f0ebe2",
          // width: "35vw",
          minWidth: { xs: "340px", sm: "40vw" },
        }}
      >
        <Stack
          gap={0.5}
          direction={"column"}
          sx={{
            background: "#f0f2f5",
            px: 4,
            pt: 2,
            pb: 1.5,
            borderRadius: "15px 15px 0 0",
            borderBottom: "1px solid #7170701f",
          }}
        >
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Typography fontWeight={"500"}>{selectedRoom?.name}</Typography>
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
              <Typography fontSize={"13px"}>{truncateId(roomId)}</Typography>
              <CopyToClipboardButton text={roomId} />
            </Stack>
          </Stack>
          <Stack sx={{ color: "#667781", fontSize: "12px" }}>
            {" "}
            {selectedRoom?.users &&
              selectedRoom?.users?.map((user, index) =>
                currUser.id === user.id ? "" : `${user.username}, `
              )}
            {"You"}
          </Stack>
        </Stack>
        <Stack
          ref={stackRef}
          pb={2}
          sx={{
            px: { xs: 2, sm: 4 },
            gap: 2,
            height: { xs: "65vh", sm: "70vh" },
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
            isLoading={loading}
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
