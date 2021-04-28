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
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var socket_io_1 = __importDefault(require("socket.io"));
var http_1 = __importDefault(require("http"));
var igra_1 = __importDefault(require("./Logika igre/igra"));
var path_1 = __importDefault(require("path"));
var mongoose_1 = __importDefault(require("mongoose"));
var dotenv_1 = __importDefault(require("dotenv"));
var db_model_1 = require("./Model/db-model");
var ObavestavacKorisnika_1 = require("./Logika igre/ObavestavacKorisnika");
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
dotenv_1.default.config();
// create the igra
var igraKontroler = new igra_1.default();
var aplikacija = express_1.default();
var PORT = 3000;
var server = http_1.default.createServer(aplikacija);
mongoose_1.default.connect(process.env.CONNECTION_STRING, { useNewUrlParser: true });
mongoose_1.default.connection.once("open", function () {
    console.log("connected to db " + process.env.CONNECTION_STRING);
});
aplikacija.use(cors_1.default());
aplikacija.use(express_1.default.static("output"));
aplikacija.use(express_1.default.static("Front klase"));
aplikacija.use(express_1.default.static("styles"));
var io = socket_io_1.default.listen(server);
aplikacija.get("/", function (req, res) {
    res.sendFile(path_1.default.join(__dirname, "./Stranice/signin.html"));
});
aplikacija.get("/signin", function (req, res) {
    res.sendFile(path_1.default.join(__dirname, "./Stranice/signin.html"));
});
aplikacija.get("/signup", function (req, res) {
    res.sendFile(path_1.default.join(__dirname, "./Stranice/signup.html"));
});
aplikacija.get("/kreirajIgru", function (req, res) {
    res.sendFile(path_1.default.join(__dirname, "./Stranice/kreirajIgru.html"));
});
aplikacija.get("/pregledIgre", function (req, res) {
    res.sendFile(path_1.default.join(__dirname, "./Stranice/pregledIgre.html"));
});
aplikacija.get("/resetpass", function (req, res) {
    res.sendFile(path_1.default.join(__dirname, "./Stranice/resetpass.html"));
});
aplikacija.get("/pocetnaStrana", function (req, res) {
    res.sendFile(path_1.default.join(__dirname, "./Stranice/pocetnaStrana.html"));
});
aplikacija.get("/oStranici", function (req, res) {
    res.sendFile(path_1.default.join(__dirname, "./Stranice/oStranici.html"));
});
aplikacija.get("/istorijaIgara", function (req, res) {
    res.sendFile(path_1.default.join(__dirname, "./Stranice/istorijaIgara.html"));
});
aplikacija.get("/igrajIgru", function (req, res) {
    res.sendFile(path_1.default.join(__dirname, "./Stranice/kreirajIgru.html"));
});
aplikacija.get("/vratiigrekorisnika/:id", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var korisnik;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_model_1.korisnikModel.findById(req.params.id)];
                case 1:
                    korisnik = _a.sent();
                    if (korisnik) {
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
aplikacija.get("/vratiigru/:id", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var igra;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_model_1.igraModel.findById(req.params.id)];
                case 1:
                    igra = _a.sent();
                    res.json(igra);
                    return [2 /*return*/];
            }
        });
    });
});
aplikacija.get("/vratipotezeigre/:id", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var igra;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_model_1.igraModel.findById(req.params.id)];
                case 1:
                    igra = _a.sent();
                    if (igra) {
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
io.on("connection", function (socket) {
    socket.on("istorija", function (podaci) { return __awaiter(void 0, void 0, void 0, function () {
        var igra;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_model_1.igraModel.findById(podaci.poruka)];
                case 1:
                    igra = _a.sent();
                    socket.emit("istorijaOdgovor", {
                        uzmiStaTiTreba: igra,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    socket.on("ulogovanSam", function (podaci) { return __awaiter(void 0, void 0, void 0, function () {
        var user, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, db_model_1.korisnikModel.findById(podaci.id)];
                case 1:
                    user = _a.sent();
                    if (!(user == null)) return [3 /*break*/, 3];
                    user = new db_model_1.korisnikModel({
                        _id: podaci.id,
                    });
                    return [4 /*yield*/, user.save()];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    console.log("GRESKA");
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    socket.on("createGame", function (podaci) { return __awaiter(void 0, void 0, void 0, function () {
        var novaPartija, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (!podaci.ime || !podaci.idIgraca)
                        throw new Error("nedovoljno popodataka");
                    novaPartija = new db_model_1.igraModel({
                        igraci: [
                            {
                                ime: podaci.ime,
                                indeks: podaci.indexIgraca,
                                idIgraca: podaci.idIgraca,
                                soketId: socket.id,
                                izvucenihKarata: 0,
                                poeni: 0,
                            },
                        ],
                        igracNaPotezu: 0,
                        pocelaIgra: false,
                        obrnutRedosled: false,
                        datum: new Date().toLocaleString(),
                        poeniZaPobedu: podaci.PoeniZaPobedu,
                        brojIgraca: 1,
                    });
                    return [4 /*yield*/, novaPartija.save()];
                case 1:
                    _a.sent();
                    socket.emit("kreiranaJeIgraID", {
                        //salje se ID igre
                        idPartije: novaPartija._id,
                        idIgraca: podaci.idIgraca,
                    });
                    socket.idPartije = novaPartija._id;
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    socket.emit("greska", { poruka: err_2.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // kada se ostali korisnci joinuju partiji
    socket.on("pridruziSePartiji", function (podaci) { return __awaiter(void 0, void 0, void 0, function () {
        var igra, _i, _a, igrac, index, igraci, _b, _c, igrac, _d, _e, igrac, err_3;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _f.trys.push([0, 3, , 4]);
                    if (!podaci.idPartije || !podaci.idIgraca)
                        throw new Error("nedovoljno podataka");
                    return [4 /*yield*/, db_model_1.igraModel.findById(podaci.idPartije)];
                case 1:
                    igra = _f.sent();
                    if (!igra)
                        throw new Error("ne postoji igra sa ovim id-jem");
                    if (igra.pocelaIgra) {
                        throw new Error("partija je vec pocela");
                    }
                    //provera da se nismo joinovali ranije
                    for (_i = 0, _a = igra.igraci; _i < _a.length; _i++) {
                        igrac = _a[_i];
                        if (igrac.idIgraca == podaci.idIgraca)
                            return [2 /*return*/];
                    }
                    index = igra.igraci.length;
                    igra.igraci.push({
                        ime: podaci.imeIgraca,
                        indeks: index,
                        idIgraca: podaci.idIgraca,
                        soketId: socket.id,
                        izvucenihKarata: 0,
                        poeni: 0,
                    });
                    // postavljanje idPartije na socket objekat
                    socket.idPartije = igra._id;
                    igraci = [];
                    for (_b = 0, _c = igra.igraci; _b < _c.length; _b++) {
                        igrac = _c[_b];
                        igraci.push({
                            ime: igrac.ime,
                            indeks: igrac.indeks,
                        });
                    }
                    igra.markModified("igraci");
                    igra.brojIgraca++;
                    return [4 /*yield*/, igra.save()];
                case 2:
                    _f.sent();
                    //kada se uspesno joinujemo
                    socket.emit("uspesnoPridruzivanjeIgri", {
                        idPartije: igra._id,
                        idIgraca: podaci.idIgraca,
                        indexIgraca: index,
                    });
                    for (_d = 0, _e = igra.igraci; _d < _e.length; _d++) {
                        igrac = _e[_d];
                        //promena u redu cekanja 
                        io.to(igrac.soketId).emit("promenaIgracaKojiCekajuPartiju", {
                            idPartije: igra._id,
                            igraci: igraci,
                        });
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _f.sent();
                    socket.emit("greska", { poruka: err_3.message });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // pokretanje igre
    socket.on("pokreniIgru", function (podaci) { return __awaiter(void 0, void 0, void 0, function () {
        var igra, igraci, _i, _a, igrac, _b, _c, igrac, ikorisnikPom, _d, _e, igrac, _f, _g, igrac, err_4;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    _h.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, db_model_1.igraModel.findById(podaci.idPartije)];
                case 1:
                    igra = _h.sent();
                    if (!igra)
                        throw new Error("ne postoji igra sa tim id-jem");
                    igraci = [];
                    for (_i = 0, _a = igra.igraci; _i < _a.length; _i++) {
                        igrac = _a[_i];
                        igraci.push(igrac);
                    }
                    return [4 /*yield*/, igraKontroler.kreirajIgru(igra._id, igraci)];
                case 2:
                    igra = _h.sent();
                    igraci = [];
                    _b = 0, _c = igra.igraci;
                    _h.label = 3;
                case 3:
                    if (!(_b < _c.length)) return [3 /*break*/, 7];
                    igrac = _c[_b];
                    igraci.push({
                        ime: igrac.ime,
                        indeks: igrac.indeks,
                        izvucenihKarata: igrac.karte.length,
                        poeni: igrac.poeni,
                    });
                    return [4 /*yield*/, db_model_1.korisnikModel.findById(igrac.idIgraca)];
                case 4:
                    ikorisnikPom = _h.sent();
                    ikorisnikPom.prethodneIgre.push(igra._id);
                    return [4 /*yield*/, ikorisnikPom.save()];
                case 5:
                    _h.sent();
                    _h.label = 6;
                case 6:
                    _b++;
                    return [3 /*break*/, 3];
                case 7:
                    //pocetak partije
                    for (_d = 0, _e = igra.igraci; _d < _e.length; _d++) {
                        igrac = _e[_d];
                        io.to(igrac.soketId).emit("kreiranaJeIgra", {
                            idPartije: podaci.idPartije,
                            igraci: igraci,
                            trenutnaKarta: igra.trenutnaKarta,
                            igracNaPotezu: igra.igracNaPotezu,
                            trenutnaBoja: igra.trenutnaBoja,
                        });
                    }
                    //izvlacenje karata za svakog od igraca
                    for (_f = 0, _g = igra.igraci; _f < _g.length; _f++) {
                        igrac = _g[_f];
                        io.to(igrac.soketId).emit("pribaviKarte", {
                            idIgraca: igrac.idIgraca,
                            karte: igrac.karte,
                            idPartije: podaci.idPartije,
                        });
                    }
                    return [3 /*break*/, 9];
                case 8:
                    err_4 = _h.sent();
                    socket.emit("greska", { poruka: err_4.message });
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    }); });
    // kada igrac odigra potez
    socket.on("kartaOdigrana", function (podaci) { return __awaiter(void 0, void 0, void 0, function () {
        var isPlayed, igra, korisnikP, igraci, _i, _a, igrac, _b, _c, igrac, uno, _d, _e, igrac, _f, _g, igrac, obavestavacKorisnika, err_5;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    _h.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, igraKontroler.odigraj(podaci.idPartije, podaci.indexIgraca, podaci.indexKarte, podaci.karta, podaci.idIgraca)];
                case 1:
                    isPlayed = _h.sent();
                    if (isPlayed == -1) {
                        socket.emit("nisteNaPotezu", {
                            idPartije: podaci.idPartije,
                            // indeks: podaci.indeks,
                            idIgraca: podaci.idIgraca,
                        });
                        return [2 /*return*/];
                    }
                    else if (isPlayed == 0) {
                        socket.emit("pogresanPotez", {
                            idPartije: podaci.idPartije,
                            // indeks: podaci.indeks,
                            idIgraca: podaci.idIgraca,
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, db_model_1.igraModel.findById(podaci.idPartije)];
                case 2:
                    igra = _h.sent();
                    return [4 /*yield*/, db_model_1.korisnikModel.findById(podaci.idIgraca)];
                case 3:
                    korisnikP = _h.sent();
                    igra.karte.push({
                        karta: {
                            vrednost: podaci.karta.vrednost,
                            specijalna: podaci.karta.specijalna,
                            boja: podaci.karta.boja,
                        },
                        korisnik: korisnikP,
                        bojaPozadine: podaci.karta.boja,
                        imeUPartiji: podaci.imeIgraca,
                    });
                    return [4 /*yield*/, igra.save()];
                case 4:
                    _h.sent();
                    igraci = [];
                    for (_i = 0, _a = igra.igraci; _i < _a.length; _i++) {
                        igrac = _a[_i];
                        igraci.push({
                            ime: igrac.ime,
                            indeks: igrac.indeks,
                            izvucenihKarata: igrac.karte.length,
                            poeni: igrac.poeni,
                        });
                    }
                    for (_b = 0, _c = igra.igraci; _b < _c.length; _b++) {
                        igrac = _c[_b];
                        io.to(igrac.soketId).emit("azuriranaPartija", {
                            idPartije: podaci.idPartije,
                            igraci: igraci,
                            trenutnaKarta: igra.trenutnaKarta,
                            igracNaPotezu: igra.igracNaPotezu,
                            trenutnaBoja: igra.trenutnaBoja,
                            kartaJeIzvucena: isPlayed == 4 || isPlayed == 3 ? true : false,
                        });
                    }
                    uno = false;
                    if (igra.igraci[podaci.indexIgraca].karte.length == 1)
                        uno = true;
                    for (_d = 0, _e = igra.igraci; _d < _e.length; _d++) {
                        igrac = _e[_d];
                        io.to(igrac.soketId).emit("pribaviKarte", {
                            idIgraca: igrac.idIgraca,
                            karte: igrac.karte,
                            idPartije: podaci.idPartije,
                        });
                    }
                    console.log(isPlayed);
                    if (uno) {
                        for (_f = 0, _g = igra.igraci; _f < _g.length; _f++) {
                            igrac = _g[_f];
                            io.to(igrac.soketId).emit("uno", {
                                idPartije: podaci.idPartije,
                            });
                        }
                    }
                    obavestavacKorisnika = new ObavestavacKorisnika_1.ObavestavacKorisnika();
                    if (isPlayed > 1) {
                        obavestavacKorisnika.obavesti(isPlayed, io, igra, podaci, igraKontroler);
                    }
                    return [3 /*break*/, 6];
                case 5:
                    err_5 = _h.sent();
                    socket.emit("greska", { poruka: err_5.message });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    socket.on("bojaOdabrana", function (podaci) { return __awaiter(void 0, void 0, void 0, function () {
        var igra, igraci, _i, _a, igrac, _b, _c, igrac, err_6;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 3, , 4]);
                    if (!podaci.idPartije ||
                        !podaci.boja ||
                        podaci.indexIgraca === undefined ||
                        !podaci.idIgraca)
                        throw new Error("nedovoljno podata");
                    return [4 /*yield*/, igraKontroler.promeniTrenutnuBoju(podaci.idPartije, podaci.boja, podaci.indexIgraca, podaci.idIgraca)];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, db_model_1.igraModel.findById(podaci.idPartije)];
                case 2:
                    igra = _d.sent();
                    igraci = [];
                    for (_i = 0, _a = igra.igraci; _i < _a.length; _i++) {
                        igrac = _a[_i];
                        igraci.push({
                            ime: igrac.ime,
                            indeks: igrac.indeks,
                            izvucenihKarata: igrac.karte.length,
                            poeni: igrac.poeni,
                        });
                    }
                    for (_b = 0, _c = igra.igraci; _b < _c.length; _b++) {
                        igrac = _c[_b];
                        io.to(igrac.soketId).emit("azuriranaPartija", {
                            idPartije: podaci.idPartije,
                            igraci: igraci,
                            trenutnaKarta: igra.trenutnaKarta,
                            igracNaPotezu: igra.igracNaPotezu,
                            trenutnaBoja: igra.trenutnaBoja,
                            kartaJeIzvucena: true,
                        });
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_6 = _d.sent();
                    socket.emit("greska", { poruka: err_6.message });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    socket.on("vuciKartu", function (podaci) { return __awaiter(void 0, void 0, void 0, function () {
        var x, igra, igraci, _i, _a, igrac, _b, _c, igrac, err_7;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 3, , 4]);
                    if (!podaci.idPartije || podaci.indexIgraca === undefined || !podaci.idIgraca)
                        throw new Error("podaci is not enough");
                    return [4 /*yield*/, igraKontroler.vuciKartu(podaci.idPartije, podaci.indexIgraca, podaci.idIgraca)];
                case 1:
                    x = _d.sent();
                    if (!x) {
                        socket.emit("nisteNaPotezu", {
                            idPartije: podaci.idPartije,
                            indeks: podaci.indexIgraca,
                            idIgraca: podaci.idIgraca,
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, db_model_1.igraModel.findById(podaci.idPartije)];
                case 2:
                    igra = _d.sent();
                    igraci = [];
                    for (_i = 0, _a = igra.igraci; _i < _a.length; _i++) {
                        igrac = _a[_i];
                        igraci.push({
                            ime: igrac.ime,
                            index: igrac.indeks,
                            izvucenihKarata: igrac.karte.length,
                            poeni: igrac.poeni,
                        });
                    }
                    for (_b = 0, _c = igra.igraci; _b < _c.length; _b++) {
                        igrac = _c[_b];
                        io.to(igrac.soketId).emit("azuriranaPartija", {
                            idPartije: podaci.idPartije,
                            igraci: igraci,
                            trenutnaKarta: igra.trenutnaKarta,
                            igracNaPotezu: igra.igracNaPotezu,
                            trenutnaBoja: igra.trenutnaBoja,
                            cardDrawn: true,
                        });
                    }
                    console.log(igra.igraci[podaci.indexIgraca].karte);
                    socket.emit("pribaviKarte", {
                        idIgraca: podaci.idIgraca,
                        karte: igra.igraci[podaci.indexIgraca].karte,
                        idPartije: podaci.idPartije,
                    });
                    return [3 /*break*/, 4];
                case 3:
                    err_7 = _d.sent();
                    socket.emit("greska", { poruka: err_7.message });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    socket.on("zavrsiPotez", function (podaci) { return __awaiter(void 0, void 0, void 0, function () {
        var igra, igraci, _i, _a, igrac, _b, _c, igrac, _d, _e, igrac, err_8;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _f.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, db_model_1.igraModel.findById(podaci.idPartije)];
                case 1:
                    igra = _f.sent();
                    if (!igra)
                        throw new Error("nema igre sa tim id-jem");
                    if (!(igra.igracNaPotezu == podaci.indexIgraca &&
                        igra.igraci[igra.igracNaPotezu].idIgraca == podaci.idIgraca &&
                        igra.igraci[igra.igracNaPotezu].mozeDaZavrsi)) return [3 /*break*/, 4];
                    return [4 /*yield*/, igraKontroler.sledeciPotez(igra)];
                case 2:
                    _f.sent();
                    return [4 /*yield*/, igra.save()];
                case 3:
                    _f.sent();
                    igraci = [];
                    for (_i = 0, _a = igra.igraci; _i < _a.length; _i++) {
                        igrac = _a[_i];
                        igraci.push({
                            ime: igrac.ime,
                            indeks: igrac.indeks,
                            izvucenihKarata: igrac.karte.length,
                            poeni: igrac.poeni,
                        });
                    }
                    for (_b = 0, _c = igra.igraci; _b < _c.length; _b++) {
                        igrac = _c[_b];
                        io.to(igrac.soketId).emit("azuriranaPartija", {
                            idPartije: podaci.idPartije,
                            igraci: igraci,
                            trenutnaKarta: igra.trenutnaKarta,
                            igracNaPotezu: igra.igracNaPotezu,
                            trenutnaBoja: igra.trenutnaBoja,
                        });
                    }
                    for (_d = 0, _e = igra.igraci; _d < _e.length; _d++) {
                        igrac = _e[_d];
                        io.to(igrac.soketId).emit("pribaviKarte", {
                            idIgraca: igrac.idIgraca,
                            karte: igrac.karte,
                            idPartije: podaci.idPartije,
                        });
                    }
                    return [3 /*break*/, 5];
                case 4:
                    if (!igra.igraci[igra.igracNaPotezu].mozeDaZavrsi) {
                        socket.emit("greska", {
                            poruka: "Nemozete zavrsti potez, morate vuci ili odigrati kartu",
                        });
                    }
                    _f.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    err_8 = _f.sent();
                    socket.emit("greska", { poruka: err_8 });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); });
    socket.on("disconnect", function () { return __awaiter(void 0, void 0, void 0, function () {
        var socketId, idPartije, igra, igrac, disconnected, i, i, igraci, _i, _a, igrac_1, _b, _c, igrac_2, _d, _e, igrac_3, err_9;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _f.trys.push([0, 7, , 8]);
                    socketId = socket.id;
                    idPartije = socket.idPartije;
                    return [4 /*yield*/, db_model_1.igraModel.findById(idPartije)];
                case 1:
                    igra = _f.sent();
                    if (!igra || igra.zavrsenaIgra == 1)
                        return [2 /*return*/];
                    igrac = void 0;
                    disconnected = 0;
                    // uklanjanje igraca iz igre
                    for (i = 0; i < igra.igraci.length; i++) {
                        if (igra.igraci[i].soketId == socketId) {
                            disconnected = 1;
                            igrac = igra.igraci[i];
                            igra.igraci.splice(i, 1);
                            igra.brojIgraca = igra.igraci.length;
                            if (igra.brojIgraca == 0) {
                                // delete igra from db
                                //await igraModel.findByIdAndDelete(idPartije);
                                return [2 /*return*/];
                            }
                            break;
                        }
                    }
                    if (!disconnected)
                        return [2 /*return*/];
                    if (!(igra.brojIgraca > 0)) return [3 /*break*/, 6];
                    // azuriranje indeksa igraca prilikom diskonekcije
                    for (i = 0; i < igra.igraci.length; i++) {
                        igra.igraci[i].index = i;
                        io.to(igra.igraci[i].soketId).emit("promenaIndexa", {
                            idPartije: idPartije,
                            idIgraca: igra.igraci[i].idIgraca,
                            noviIndex: i,
                        });
                        io.to(igra.igraci[i].soketId).emit("igracDiskonektovan", {
                            idPartije: idPartije,
                            imeIgraca: igrac.ime,
                        });
                    }
                    return [4 /*yield*/, igra.save()];
                case 2:
                    _f.sent();
                    igraci = [];
                    for (_i = 0, _a = igra.igraci; _i < _a.length; _i++) {
                        igrac_1 = _a[_i];
                        igraci.push({
                            ime: igrac_1.ime,
                            indeks: igrac_1.indeks,
                            izvucenihKarata: igrac_1.karte.length,
                            poeni: igrac_1.poeni,
                        });
                    }
                    if (!igra.pocelaIgra) return [3 /*break*/, 5];
                    for (_b = 0, _c = igra.igraci; _b < _c.length; _b++) {
                        igrac_2 = _c[_b];
                        io.to(igrac_2.soketId).emit("azuriranaPartija", {
                            idPartije: idPartije,
                            igraci: igraci,
                            trenutnaKarta: igra.trenutnaKarta,
                            igracNaPotezu: igra.igracNaPotezu,
                            trenutnaBoja: igra.trenutnaBoja,
                        });
                    }
                    if (!(igra.igraci.length == 1 && igra.zavrsenaIgra == 0)) return [3 /*break*/, 4];
                    igra.zavrsenaIgra = 1;
                    return [4 /*yield*/, igra.save()];
                case 3:
                    _f.sent();
                    io.to(igra.igraci[0].soketId).emit("zavrsetakPartije", {
                        idPartije: idPartije,
                        idIgraca: igra.igraci[0]._id,
                        nemaIgraca: 1,
                        success: "Kraj igre",
                    });
                    _f.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    for (_d = 0, _e = igra.igraci; _d < _e.length; _d++) {
                        igrac_3 = _e[_d];
                        io.to(igrac_3.soketId).emit("promenaIgracaKojiCekajuPartiju", {
                            idPartije: igra._id,
                            igraci: igraci,
                        });
                    }
                    _f.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    err_9 = _f.sent();
                    socket.emit("greska", { poruka: err_9.message });
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); });
    socket.on("chatMessage", function (podaci) { return __awaiter(void 0, void 0, void 0, function () {
        var idPartije, ime, igra, _i, _a, igrac, err_10;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    idPartije = podaci.idPartije;
                    ime = podaci.imeIgraca;
                    if (!idPartije || !ime)
                        throw new Error("nedovoljno podataka");
                    return [4 /*yield*/, db_model_1.igraModel.findById(idPartije)];
                case 1:
                    igra = _b.sent();
                    if (!igra)
                        throw new Error("ne postoji igra sa tim id-jem");
                    igra.chat.push({
                        imeIgraca: ime,
                        poruka: podaci.tekstPoruke,
                    });
                    return [4 /*yield*/, igra.save()];
                case 2:
                    _b.sent();
                    // emitovanje signale svim igracima u partiji
                    for (_i = 0, _a = igra.igraci; _i < _a.length; _i++) {
                        igrac = _a[_i];
                        io.to(igrac.soketId).emit("prijemPoruke", {
                            idPartije: igra._id,
                            imeIgraca: ime,
                            tekstPoruke: podaci.tekstPoruke,
                            idIgraca: podaci.idIgraca,
                        });
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_10 = _b.sent();
                    socket.emit("greska", { poruka: err_10.message });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    socket.on("kickujIgraca", function (podaci) { return __awaiter(void 0, void 0, void 0, function () {
        var idPartije, igra, i, igraci, _i, _a, igrac, _b, _c, igrac, _d, _e, igrac, err_11;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _f.trys.push([0, 7, , 8]);
                    idPartije = podaci.idPartije;
                    return [4 /*yield*/, db_model_1.igraModel.findById(idPartije)];
                case 1:
                    igra = _f.sent();
                    if (!igra)
                        throw new Error("nema igre sa tim id-jem");
                    if (igra.igraci[0].idIgraca != podaci.idIgraca)
                        throw new Error("niste host");
                    if (!podaci.indexIgraca)
                        throw new Error("nedovoljno podataka");
                    io.to(igra.igraci[podaci.indexIgraca].soketId).emit("kikovaniSte", {
                        idPartije: idPartije,
                    });
                    igra.igraci.splice(podaci.indexIgraca, 1);
                    igra.brojIgraca = igra.brojIgraca - 1;
                    igra.markModified("igraci");
                    return [4 /*yield*/, igra.save()];
                case 2:
                    _f.sent();
                    for (i = 0; i < igra.igraci.length; i++) {
                        igra.igraci[i].indexIgraca = i;
                        io.to(igra.igraci[i].soketId).emit("promenaIndexa", {
                            idPartije: idPartije,
                            idIgraca: igra.igraci[i].idIgraca,
                            noviIndex: i,
                        });
                    }
                    igraci = [];
                    for (_i = 0, _a = igra.igraci; _i < _a.length; _i++) {
                        igrac = _a[_i];
                        igraci.push({
                            ime: igrac.ime,
                            indeks: igrac.indeks,
                            izvucenihKarata: igrac.karte.length,
                            poeni: igrac.poeni,
                        });
                    }
                    if (!igra.pocelaIgra) return [3 /*break*/, 5];
                    for (_b = 0, _c = igra.igraci; _b < _c.length; _b++) {
                        igrac = _c[_b];
                        io.to(igrac.soketId).emit("azuriranaPartija", {
                            idPartije: idPartije,
                            igraci: igraci,
                            trenutnaKarta: igra.trenutnaKarta,
                            igracNaPotezu: igra.igracNaPotezu,
                            trenutnaBoja: igra.trenutnaBoja,
                        });
                    }
                    if (!(igra.igraci.length == 1)) return [3 /*break*/, 4];
                    igra.zavrsenaIgra = 1;
                    return [4 /*yield*/, igra.save()];
                case 3:
                    _f.sent();
                    io.to(igra.igraci[0].soketId).emit("zavrsetakPartije", {
                        idPartije: idPartije,
                        idIgraca: igra.igraci[0]._id,
                        nemaIgraca: 1,
                        success: "Kraj igre",
                    });
                    _f.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    for (_d = 0, _e = igra.igraci; _d < _e.length; _d++) {
                        igrac = _e[_d];
                        io.to(igrac.soketId).emit("promenaIgracaKojiCekajuPartiju", {
                            idPartije: igra._id,
                            igraci: igraci,
                        });
                    }
                    _f.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    err_11 = _f.sent();
                    socket.emit("greska", { poruka: err_11.message });
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); });
});
server.listen(process.env.PORT || PORT, function () {
    console.log("Osluskivanje na portu " + (process.env.PORT || PORT));
});
