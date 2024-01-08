"use client";
import { Divider, Stack, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { pusherClient } from "@/lib/pusher";
import Message from "./Message";
import moment from "moment";

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

  const groupedMessagesByDay = groupMessagesByDay(initialMessages);

  function groupMessagesByDay(messages: IncomingMessagesProps[]): {
    [key: string]: IncomingMessagesProps[];
  } {
    const groupedMessages: { [key: string]: IncomingMessagesProps[] } = {};
    messages.forEach((message) => {
      const messageDate = moment(message.createdAt);
      const currentDate = moment();

      const dayDifference = currentDate.diff(messageDate, "days");

      let label: string;

      if (dayDifference === 0) {
        label = "Today";
      } else if (dayDifference === 1) {
        label = "Yesterday";
      } else {
        label = messageDate.format("Do MMM");
      }

      if (!groupedMessages[label]) {
        groupedMessages[label] = [];
      }
      groupedMessages[label].push(message);
    });

    return groupedMessages;
  }

  return (
    <Stack>
      {!Object.keys(groupedMessagesByDay)?.length &&
      !incomingMessages?.length ? (
        <Typography>No messages in this room, start chatting... </Typography>
      ) : (
        <>
          {Object.keys(groupedMessagesByDay)?.length ? (
            Object.keys(groupedMessagesByDay).map((date) => (
              <Stack key={date} mt={1}>
                <Stack mb={0.5} mt={1}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#6f6c598c",
                      textAlign: "center",
                      position: "absolute",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      background: "#fff",
                      px: 1,
                    }}
                  >
                    {date}
                  </Typography>
                  <Divider />
                </Stack>
                {groupedMessagesByDay[date].map(
                  (message: IncomingMessagesProps) => (
                    <Stack key={message.id}>
                      <Message
                        message={message.message}
                        id={message.id}
                        createdAt={message.createdAt}
                      />
                    </Stack>
                  )
                )}
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
