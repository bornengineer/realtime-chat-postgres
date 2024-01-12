"use client";
import { Stack, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { pusherClient } from "@/lib/pusher";
import Message from "./Message";
import CircularProgress from "@mui/material/CircularProgress";
import moment from "moment";
import { User } from "@/utils/types";

interface MessagesProps {
  initialMessages: IncomingMessagesProps[];
  roomId: string;
  stackRef: React.MutableRefObject<HTMLDivElement | null>;
  scrollBottom: any;
  isLoading: boolean;
}

interface IncomingMessagesProps {
  message: string;
  id: string;
  createdAt: Date;
  user: User;
}

const Messages = ({
  initialMessages,
  roomId,
  stackRef,
  scrollBottom,
  isLoading,
}: MessagesProps) => {
  const [incomingMessages, setIncomingMessages] = useState<
    IncomingMessagesProps[]
  >([]);
  const [pusherError, setPusherError] = useState("");
  const [currUser, setCurrUser] = useState({
    email: "",
    username: "",
  });

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
    pusherClient.bind("pusher:error", (res: any) => {
      setPusherError(res);
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
      const messageDate = moment(message.createdAt).startOf("day");
      const currentDate = moment().startOf("day");

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

  useEffect(() => {
    const getUser = async () => {
      const loggedInUser = await fetch("/api/users/getLoggedInUser");
      const user = await loggedInUser.json();
      if (Object.keys(user).length) setCurrUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    scrollBottom(stackRef);
  }, [incomingMessages]);

  return (
    <Stack>
      {!Object.keys(groupedMessagesByDay)?.length &&
      !incomingMessages?.length ? (
        <Stack
          sx={{
            minHeight: "72vh",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isLoading ? (
            <CircularProgress disableShrink />
          ) : (
            <Typography color="#8e8f8e">
              No messages in this room, start chatting...{" "}
            </Typography>
          )}
        </Stack>
      ) : (
        <>
          {Object.keys(groupedMessagesByDay)?.length ? (
            Object.keys(groupedMessagesByDay).map((date) => (
              <Stack key={date} mt={1}>
                <Stack mb={1} mt={1} alignItems={"center"}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#6f6c598c",
                      textAlign: "center",
                      background: "#fffceb",
                      borderRadius: "5px",
                      maxWidth: "80px",
                      px: 1,
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    {date}
                  </Typography>
                  {/* <Divider
                    sx={{
                      mb: 2,
                      position: "absolute",
                      top: 0,
                      left: 0,
                      border: "1px solid red",
                    }}
                  /> */}
                </Stack>
                {groupedMessagesByDay[date].map(
                  (message: IncomingMessagesProps) => (
                    <Stack key={message.id}>
                      <Message
                        message={message.message}
                        id={message.id}
                        createdAt={message.createdAt}
                        sender={message.user}
                        currUser={currUser}
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
                  sender={item.user}
                  currUser={currUser}
                />
              </Stack>
            ))
          ) : (
            <></>
          )}
          <Typography variant="caption" color={"error"}>
            {pusherError}
          </Typography>
        </>
      )}
    </Stack>
  );
};

export default Messages;
