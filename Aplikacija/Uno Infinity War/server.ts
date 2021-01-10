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
const konekcioniString =
  "mongodb://uno1234567890:uno12345@cluster0-shard-00-00.q10ii.mongodb.net:27017,cluster0-shard-00-01.q10ii.mongodb.net:27017,cluster0-shard-00-02.q10ii.mongodb.net:27017/baza?ssl=true&replicaSet=atlas-2rb5rr-shard-0&authSource=admin&retryWrites=true";
mongoose.connect(konekcioniString, { useNewUrlParser: true });
mongoose.connection.once("open", () => {
  console.log(
    "Konektovan sa bazom podataka : " + process.env.CONNECTION_STRING
  );
});
app.use(cors());

server.listen(process.env.PORT || PORT, () => {
  console.log(`Server osluskuje na portu : ${process.env.PORT || PORT}`);
});
