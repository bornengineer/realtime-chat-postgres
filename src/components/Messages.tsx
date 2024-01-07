"use client";
import { Stack, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { pusherClient } from "@/lib/pusher";
import Message from "./Message";

interface MessagesProps {
  initialMessages: IncomingMessagesProps[];
  roomId: string;
}

interface IncomingMessagesProps {
  message: string;
  id: string;
  createdAt: Date;
}

const Messages = ({ initialMessages, roomId }: MessagesProps) => {
  const [incomingMessages, setIncomingMessages] = useState<
    IncomingMessagesProps[]
  >([]);
  let temp = incomingMessages;
  useEffect(() => {
    pusherClient.subscribe(roomId);
    pusherClient.bind("incoming-message", (messageBody: any) => {
      let flag = false;
      const id = messageBody?.id;
      if (temp?.length)
        temp.forEach((item) => {
          if (item.id === id) {
            flag = true;
          }
        });
      if (!flag) {
        setIncomingMessages((prev) => [...prev, messageBody]);
        temp = [...temp, messageBody];
      }
    });
    return () => {
      pusherClient.unsubscribe(roomId);
    };
  }, [roomId]);
  return (
    <Stack>
      {!initialMessages?.length && !incomingMessages?.length ? (
        <Typography>No messages in this room, start chatting... </Typography>
      ) : (
        <>
          {initialMessages ? (
            initialMessages.map((item) => (
              <Stack key={item.id}>
                <Message
                  message={item.message}
                  id={item.id}
                  createdAt={item.createdAt}
                />
              </Stack>
            ))
          ) : (
            <></>
          )}
          {incomingMessages?.length ? (
            incomingMessages.map((item) => (
              <Stack key={item.id}>
                <Message
                  message={item.message}
                  id={item.id}
                  createdAt={item.createdAt}
                />
              </Stack>
            ))
          ) : (
            <></>
          )}
        </>
      )}
    </Stack>
  );
};

export default Messages;
