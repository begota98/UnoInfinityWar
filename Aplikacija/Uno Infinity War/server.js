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
var path_1 = __importDefault(require("path"));
var mongoose_1 = __importDefault(require("mongoose"));
var dotenv_1 = __importDefault(require("dotenv"));
var http_1 = __importDefault(require("http"));
var socket_io_1 = __importDefault(require("socket.io"));
var ModelBazePodataka_1 = require("./model/ModelBazePodataka");
dotenv_1.default.config();
var app = express_1.default();
var PORT = 3000;
var server = http_1.default.createServer(app);
var konekcioniString = "mongodb://uno1234567890:uno12345@cluster0-shard-00-00.q10ii.mongodb.net:27017,cluster0-shard-00-01.q10ii.mongodb.net:27017,cluster0-shard-00-02.q10ii.mongodb.net:27017/baza?ssl=true&replicaSet=atlas-2rb5rr-shard-0&authSource=admin&retryWrites=true";
mongoose_1.default.connect(konekcioniString, { useNewUrlParser: true });
mongoose_1.default.connection.once("open", function () {
    console.log("Konektovan sa bazom podataka : " + konekcioniString);
});
app.use(cors_1.default());
app.use(express_1.default.static("output"));
app.use(express_1.default.static("styles"));
var io = socket_io_1.default.listen(server);
server.listen(process.env.PORT || PORT, function () {
    console.log("Server osluskuje na portu : " + (process.env.PORT || PORT));
});
app.get("/", function (req, res) {
    res.sendFile(path_1.default.join(__dirname, "pocetna.html"));
});
io.on("connection", function (socket) {
    var id = "5ff9f39d8beeef1c6863a9ce";
    socket.on("zapocniIgru", function (podaci) { return __awaiter(void 0, void 0, void 0, function () {
        var igra, igrac, _i, _a, igrac_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, ModelBazePodataka_1.igraModel.findById(id)];
                case 1:
                    igra = _b.sent();
                    console.log("AAAASDASDADSAD");
                    console.log(podaci.socketId);
                    igrac = new ModelBazePodataka_1.igracModel({
                        ime: podaci.ime,
                        soketId: socket.id,
                    });
                    console.log(igrac);
                    if (!igra) return [3 /*break*/, 3];
                    igra.igraci.push(igrac);
                    return [4 /*yield*/, igra.save()];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    for (_i = 0, _a = igra.igraci; _i < _a.length; _i++) {
                        igrac_1 = _a[_i];
                        io.to(igrac_1.soketId).emit("zapocetoJe", {
                            igra: igra,
                        });
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    socket.on("novaPoruka", function (podaci) { return __awaiter(void 0, void 0, void 0, function () {
        var igra, chat, _i, _a, igrac;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, ModelBazePodataka_1.igraModel.findById(id)];
                case 1:
                    igra = _b.sent();
                    if (igra) {
                        chat = new ModelBazePodataka_1.chatModel({
                            igracIme: podaci.ime,
                            poruka: podaci.poruka,
                        });
                        igra.chat.push(chat);
                        for (_i = 0, _a = igra.igraci; _i < _a.length; _i++) {
                            igrac = _a[_i];
                            io.to(igrac.soketId).emit("stizeNovaPoruka", {
                                poruka: chat,
                            });
                        }
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    socket.on("odigrajPotez", function (podaci) { return __awaiter(void 0, void 0, void 0, function () {
        var igra, _i, _a, igrac;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, ModelBazePodataka_1.igraModel.findById(id)];
                case 1:
                    igra = _b.sent();
                    if (igra) {
                        for (_i = 0, _a = igra.igraci; _i < _a.length; _i++) {
                            igrac = _a[_i];
                            io.to(igrac.soketId).emit("stizeNovPotez", {
                                karta: podaci.imeKarte,
                            });
                        }
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    socket.on("disconnect", function () { return __awaiter(void 0, void 0, void 0, function () {
        var igra, socketid, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ModelBazePodataka_1.igraModel.findById(id)];
                case 1:
                    igra = _a.sent();
                    socketid = socket.id;
                    if (igra) {
                        for (i = 0; i <= igra.igraci.lenght - 1; i++) {
                            if (igra.igraci[i].soketId == socketid) {
                                igra.igraci.splice(i, 1);
                                break;
                            }
                        }
                    }
                    return [2 /*return*/];
            }
        });
    }); });
});
app.get("/vratikorisnike", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var korisnici;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ModelBazePodataka_1.korisnikModel.find()];
                case 1:
                    korisnici = _a.sent();
                    console.log(korisnici);
                    res.json(korisnici);
                    return [2 /*return*/];
            }
        });
    });
});
//http://localhost:3000/vratikorisnike
app.get("/vratikorisnika/:id", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var korisnik;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ModelBazePodataka_1.korisnikModel.findById(req.params.id)];
                case 1:
                    korisnik = _a.sent();
                    console.log(korisnik);
                    res.json(korisnik);
                    return [2 /*return*/];
            }
        });
    });
});
//http://localhost:3000/vratikorisnika/BinFicP2ttfws0JCei2kMPcL0xY2
//BinFicP2ttfws0JCei2kMPcL0xY2
app.get("/vratiigrekorisnika/:id", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var korisnik;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ModelBazePodataka_1.korisnikModel.findById(req.params.id)];
                case 1:
                    korisnik = _a.sent();
                    if (korisnik) {
                        console.log(korisnik.get("prethodneIgre"));
                        res.json(korisnik.get("prethodneIgre"));
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
        var igre;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ModelBazePodataka_1.igraModel.find()];
                case 1:
                    igre = _a.sent();
                    console.log(igre);
                    res.json(igre);
                    return [2 /*return*/];
            }
        });
    });
});
//http://localhost:3000/vratiigre
app.get("/vratiigru/:id", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var igra;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ModelBazePodataka_1.igraModel.findById(req.params.id)];
                case 1:
                    igra = _a.sent();
                    console.log(igra);
                    res.json(igra);
                    return [2 /*return*/];
            }
        });
    });
});
//5ff9f39d8beeef1c6863a9ce
//http://localhost:3000/vratiigru/5ff9f39d8beeef1c6863a9ce
app.get("/vratiucesnikeigre/:id", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var igra;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ModelBazePodataka_1.igraModel.findById(req.params.id)];
                case 1:
                    igra = _a.sent();
                    if (igra) {
                        console.log(igra.get("igraci"));
                        res.json(igra.get("igraci"));
                    }
                    else {
                        res.json("");
                    }
                    return [2 /*return*/];
            }
        });
    });
});
//5ff9f39d8beeef1c6863a9ce
//http://localhost:3000/vratiucesnikeigre/5ff9f39d8beeef1c6863a9ce
app.get("/vratipotezeigre/:id", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var igra;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ModelBazePodataka_1.igraModel.findById(req.params.id)];
                case 1:
                    igra = _a.sent();
                    if (igra) {
                        console.log(igra.get("karte"));
                        res.json(igra.get("karte"));
                    }
                    else {
                        res.json("");
                    }
                    return [2 /*return*/];
            }
        });
    });
});
//5ff9f39d8beeef1c6863a9ce
//http://localhost:3000/vratipotezeigre/5ff9f39d8beeef1c6863a9ce
