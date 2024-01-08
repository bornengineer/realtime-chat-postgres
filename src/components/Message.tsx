"use client";
import { Stack, Typography } from "@mui/material";
import moment from "moment";

interface MessageProps {
  message: string;
  id: string;
  createdAt: Date;
}

const Message = (props: MessageProps) => {
  const { message, createdAt } = props;
  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      sx={{
        background:
          "linear-gradient(90deg, rgba(153,148,242,1) 0%, rgba(116,111,196,1) 100%)",
        my: 1,
        borderRadius: "10px",
        px: 2,
        pt: 1,
        pb: 2,
        color: "#fff",
      }}
    >
      <Typography variant="body1">{message}</Typography>
      <Typography
        variant="caption"
        sx={{
          color: "#f0f6fa8c",
          position: "absolute",
          ml: 33,
          mt: 4,
        }}
      >
        {moment(createdAt).format("hh:mm:ss A")}
      </Typography>
    </Stack>
  );
};

export default Message;
