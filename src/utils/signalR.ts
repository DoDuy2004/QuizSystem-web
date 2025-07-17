// src/utils/signalr.ts
import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
  .withUrl(`${import.meta.env.VITE_DOMAIN}/QuizHub`, {
    accessTokenFactory: () => localStorage.getItem("jwt_access_token") || "",
  })
  .withAutomaticReconnect()
  .build();

export default connection;
