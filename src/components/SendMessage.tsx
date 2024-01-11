"use client";
import { Button, Stack, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";
import axios from "axios";

interface SendMessageProps {
  roomId: string;
}

const SendMessage = ({ roomId }: SendMessageProps) => {
  const [message, setMessage] = useState("");
  const sendMessage = async () => {
    await axios.post(`/api/${roomId}/message`, { message, roomId });
    setMessage("");
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && message) {
      event.preventDefault();
      sendMessage();
    }
  };
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      gap={2}
      sx={{ width: "100%", height: "40px" }}
    >
      <TextField
        id="outlined-controlled"
        placeholder="Type a message"
        value={message}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setMessage(event.target.value);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => setMessage("")}
        sx={{
          width: "inherit",
          background: "#fff",
          border: "none",
          borderRadius: "5px",
          "& fieldset": { border: "none" },
        }}
        size="small"
      ></TextField>
      <Button
        variant="contained"
        sx={{ px: 3, height: "40px" }}
        size="medium"
        endIcon={<SendIcon />}
        onClick={sendMessage}
        disabled={!message?.length}
      >
        Send
      </Button>
    </Stack>
  );
};

export default SendMessage;
