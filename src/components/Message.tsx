"use client";
import { User } from "@/utils/types";
import { Stack, Typography } from "@mui/material";
import moment from "moment";

interface MessageProps {
  message: string;
  id: string;
  createdAt: Date;
  sender: User;
  currUser: { email: string; username: string };
}

const Message = (props: MessageProps) => {
  const { message, createdAt, sender, currUser } = props;
  return (
    <Stack
      sx={{
        alignItems:
          sender.username === currUser.username ? "flex-end" : "flex-start",
      }}
    >
      <Stack
        direction={"column"}
        justifyContent={"space-between"}
        alignItems={"center"}
        gap={0}
        sx={{
          background:
            sender.username === currUser.username ? "#d9fdd3" : "#fff",
          my: 1,
          borderRadius: "7px",
          p: "6px 8px 2px 8px",
          color: "#fff",
          minWidth: "25%",
          maxWidth: "70%",
          flexWrap: "wrap",
          alignItems: "flex-end",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Stack
          sx={{
            justifyContent: "flex-start",
            width: "100%",
            gap: 0.2,
          }}
        >
          {sender.username !== currUser.username && (
            <Typography
              fontWeight={"bold"}
              sx={{
                color: "#53bdeb",
                fontSize: "13px",
              }}
            >
              {sender.username}
            </Typography>
          )}
          <Typography sx={{ color: "#111b21", fontSize: "13px" }}>
            {message}
          </Typography>
        </Stack>
        <Typography
          sx={{
            color: "#667781",
            fontSize: "10px",
          }}
        >
          {moment(createdAt).format("hh:mm A")}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Message;
