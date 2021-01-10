"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import express = require('express');
// Create a new express app instance
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var mongoose_1 = __importDefault(require("mongoose"));
var dotenv_1 = __importDefault(require("dotenv"));
var http_1 = __importDefault(require("http"));
dotenv_1.default.config();
var app = express_1.default();
var PORT = 3000;
var server = http_1.default.createServer(app);
var konekcioniString = "mongodb://uno1234567890:uno12345@cluster0-shard-00-00.q10ii.mongodb.net:27017,cluster0-shard-00-01.q10ii.mongodb.net:27017,cluster0-shard-00-02.q10ii.mongodb.net:27017/baza?ssl=true&replicaSet=atlas-2rb5rr-shard-0&authSource=admin&retryWrites=true";
mongoose_1.default.connect(konekcioniString, { useNewUrlParser: true });
mongoose_1.default.connection.once("open", function () {
    console.log("Konektovan sa bazom podataka : " + process.env.CONNECTION_STRING);
});
app.use(cors_1.default());
server.listen(process.env.PORT || PORT, function () {
    console.log("Server osluskuje na portu : " + (process.env.PORT || PORT));
});
