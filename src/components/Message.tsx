"use client";
import { Stack, Typography } from "@mui/material";
import moment from "moment";

interface MessageProps {
  message: string;
  id: string;
  createdAt: Date;
}

const Message = (props: MessageProps) => {
  const { message, id, createdAt } = props;
  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <Typography variant="body1" key={id}>
        {message}
      </Typography>
      <Typography variant="caption" key={id}>
        {moment(createdAt).format("HH:mm:ss (Do MMM)")}
      </Typography>
    </Stack>
  );
};

export default Message;
