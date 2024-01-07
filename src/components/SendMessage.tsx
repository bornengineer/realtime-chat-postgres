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
  };
  return (
    <Stack direction={"row"} alignItems={"center"} gap={2}>
      <TextField
        id="outlined-controlled"
        label="Type message"
        value={message}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setMessage(event.target.value);
        }}
        onFocus={() => setMessage("")}
      ></TextField>
      <Button
        variant="contained"
        sx={{ px: 3, height: "52px" }}
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
