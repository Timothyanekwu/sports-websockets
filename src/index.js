import express from "express";
import http from 'http';
import { matchRouter } from "./routes/matches.js";
import { attachWebSocketServer } from "./ws/server.js";

const app = express();
const PORT = Number(process.env.PORT) || 8000;
const HOST = Number(process.env.HOST) || '0.0.0.0';

app.use(express.json());
const server = http.createServer(app);

app.get("/", (req, res) => {
  res.json({ message: "Hello from the Express server!" });
});

app.use("/matches", matchRouter);
const {broadcastMatchCreated} = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;

server.listen(PORT, HOST, () => {
  const baseUrl = HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
  console.log(`Server is running at ${baseUrl}`);
  console.log(`WebSocket server is running at ${baseUrl.replace('http', 'ws')}/ws`);
});
