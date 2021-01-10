"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var db_model_1 = require("./model/db-model");
dotenv_1.default.config();
var app = express_1.default();
var PORT = 3000;
var server = http_1.default.createServer(app);
var connectionString = "mongodb://uno1234567890:uno12345@cluster0-shard-00-00.q10ii.mongodb.net:27017,cluster0-shard-00-01.q10ii.mongodb.net:27017,cluster0-shard-00-02.q10ii.mongodb.net:27017/baza?ssl=true&replicaSet=atlas-2rb5rr-shard-0&authSource=admin&retryWrites=true";
mongoose_1.default.connect(connectionString, { useNewUrlParser: true });
mongoose_1.default.connection.once("open", function () {
    console.log("connected to db " + process.env.CONNECTION_STRING);
});
app.use(cors_1.default());
server.listen(process.env.PORT || PORT, function () {
    console.log("listening on port " + (process.env.PORT || PORT));
});
app.get("/vratikorisnike", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var users;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_model_1.userModel.find()];
                case 1:
                    users = _a.sent();
                    console.log(users);
                    res.json(users);
                    return [2 /*return*/];
            }
        });
    });
});
//http://localhost:3000/vratikorisnike
app.get("/vratikorisnika/:id", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_model_1.userModel.findById(req.params.id)];
                case 1:
                    user = _a.sent();
                    console.log(user);
                    res.json(user);
                    return [2 /*return*/];
            }
        });
    });
});
//http://localhost:3000/vratikorisnika/BinFicP2ttfws0JCei2kMPcL0xY2
//BinFicP2ttfws0JCei2kMPcL0xY2
app.get("/vratiigrekorisnika/:id", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_model_1.userModel.findById(req.params.id)];
                case 1:
                    user = _a.sent();
                    if (user) {
                        console.log(user.get("pastGames"));
                        res.json(user.get("pastGames"));
                    }
                    else {
                        res.json("");
                    }
                    return [2 /*return*/];
            }
        });
    });
});
//http://localhost:3000/vratiigrekorisnika/BinFicP2ttfws0JCei2kMPcL0xY2
app.get("/vratiigre", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var games;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_model_1.gameModel.find()];
                case 1:
                    games = _a.sent();
                    console.log(games);
                    res.json(games);
                    return [2 /*return*/];
            }
        });
    });
});
//http://localhost:3000/vratiigre
app.get("/vratiigru/:id", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var game;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_model_1.gameModel.findById(req.params.id)];
                case 1:
                    game = _a.sent();
                    console.log(game);
                    res.json(game);
                    return [2 /*return*/];
            }
        });
    });
});
//5ff9ed001b2ede08cc345109
//http://localhost:3000/vratiigru/5ff9ed001b2ede08cc345109
app.get("/vratiucesnikeigre/:id", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var game;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_model_1.gameModel.findById(req.params.id)];
                case 1:
                    game = _a.sent();
                    if (game) {
                        console.log(game.get("players"));
                        res.json(game.get("players"));
                    }
                    else {
                        res.json("");
                    }
                    return [2 /*return*/];
            }
        });
    });
});
//5ff9f27993d63e1600fee0ab
//http://localhost:3000/vratiucesnikeigre/5ff9f27993d63e1600fee0ab
app.get("/vratipotezeigre/:id", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var game;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_model_1.gameModel.findById(req.params.id)];
                case 1:
                    game = _a.sent();
                    if (game) {
                        console.log(game.get("cards"));
                        res.json(game.get("cards"));
                    }
                    else {
                        res.json("");
                    }
                    return [2 /*return*/];
            }
        });
    });
});
//5ffb3e6611355a2cdcce71fb
//http://localhost:3000/vratipotezeigre/5ffb3e6611355a2cdcce71fb
