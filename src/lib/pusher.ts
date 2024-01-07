import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new PusherServer({
  appId: "1734819",
  key: "25ffc855b048bb7cd635",
  secret: "eef899172e6112a7145e",
  cluster: "ap2",
  useTLS: true,
});

export const pusherClient = new PusherClient("25ffc855b048bb7cd635", {
  cluster: "ap2",
  authEndpoint: "/api/push-auth",
  authTransport: "ajax",
  auth: {
    headers: {
      "Content-Type": "application/json",
    },
  },
});
