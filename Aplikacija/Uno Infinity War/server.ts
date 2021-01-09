//import express = require('express');
// Create a new express app instance
import express from "express";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import http from "http";

dotenv.config();

const app = express();
const PORT = 3000;
const server = http.createServer(app);
const connectionString =
  "mongodb://uno1234567890:uno12345@cluster0-shard-00-00.q10ii.mongodb.net:27017,cluster0-shard-00-01.q10ii.mongodb.net:27017,cluster0-shard-00-02.q10ii.mongodb.net:27017/baza?ssl=true&replicaSet=atlas-2rb5rr-shard-0&authSource=admin&retryWrites=true";
mongoose.connect(connectionString, { useNewUrlParser: true });
mongoose.connection.once("open", () => {
  console.log("connected to db " + process.env.CONNECTION_STRING);
});
app.use(cors());

server.listen(process.env.PORT || PORT, () => {
  console.log(`listening on port ${process.env.PORT || PORT}`);
});

// const app = express();

// //const app: express.Application = express();
// app.get('/', function (req, res) {
// res.send('Hello World!');
// });
// app.listen(3000, function () {
// console.log('App is listening on port 3000!');
// });
