
import http from "http";
import { configureServer } from "./src/chat/chat.js"; 
import express from 'express';

const app = express();
const server = http.createServer(app);

configureServer(server)

server.listen(7272, () => {
  console.log('Running on http://localhost:7272');
});