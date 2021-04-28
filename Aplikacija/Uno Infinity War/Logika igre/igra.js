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
var spil_1 = __importDefault(require("./spil"));
var pronalazacPravila_1 = __importDefault(require("./pronalazacPravila"));
var selektorPravila_1 = __importDefault(require("./selektorPravila"));
var db_model_1 = require("../Model/db-model");
var Igra = /** @class */ (function () {
    function Igra() {
        this.spil = new spil_1.default();
        this.selektorPravila = new selektorPravila_1.default();
    }
    Igra.prototype.kreirajIgru = function (igraId, igraci) {
        return __awaiter(this, void 0, void 0, function () {
            var brojIgraca, igra, i, j, karta;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        brojIgraca = igraci.length;
                        if (brojIgraca < 2)
                            throw new Error("Nemozete poceti partiju sa manje od 2 igraca!");
                        return [4 /*yield*/, db_model_1.igraModel.findById(igraId)];
                    case 1:
                        igra = _a.sent();
                        for (i = 0; i < brojIgraca; i++) {
                            // izvlacenje 7 karata za svakog igraca
                            for (j = 0; j < 7; j++) {
                                karta = this.spil.vuciKartu();
                                igra.igraci[i].karte.push(karta);
                            }
                        }
                        // inicijalizacija pocetne karte na stolu
                        igra.trenutnaKarta = this.spil.vuciNeSpecijalnuKartu();
                        igra.trenutnaBoja = igra.trenutnaKarta.boja;
                        igra.brojIgraca = brojIgraca;
                        igra.obrnutRedosled = false;
                        igra.pocelaIgra = true;
                        return [4 /*yield*/, igra.save()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, igra];
                }
            });
        });
    };
    Igra.prototype.sledeciPotez = function (igra) {
        igra.igraci[igra.igracNaPotezu].izvucenihKarata = 0;
        igra.igraci[igra.igracNaPotezu].mozeDaZavrsi = false;
        if (igra.obrnutRedosled && igra.igracNaPotezu == 0)
            igra.igracNaPotezu = igra.brojIgraca - 1;
        else {
            if (igra.obrnutRedosled)
                igra.igracNaPotezu--;
            else
                igra.igracNaPotezu = (igra.igracNaPotezu + 1) % igra.brojIgraca;
        }
        igra.igraci[igra.igracNaPotezu].mozeDaZavrsi = false;
    };
    Igra.prototype.dodajKartu = function (igra, karta) {
        igra.igraci[igra.igracNaPotezu].karte.push(karta);
    };
    Igra.prototype.ukloniKartu = function (igra, index) {
        igra.igraci[igra.igracNaPotezu].karte.splice(index, 1);
    };
    /**
     * -1 => nije vas potez
     * 0 => false
     * 1 => true
     * 2 => +2
     * 4 => +4
     * 3 => izaberi boju
     * 5 => preskoci
     * 6 => obrni
     * 7 => kraj igre
     */
    Igra.prototype.odigraj = function (igraId, indexIgraca, indexKarte, karta, idIgraca) {
        return __awaiter(this, void 0, void 0, function () {
            var igra, pravilo, brojPravila, izvrsilacPravila;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_model_1.igraModel.findById(igraId)];
                    case 1:
                        igra = _a.sent();
                        if (igra.igracNaPotezu != indexIgraca || igra.igraci[igra.igracNaPotezu].idIgraca != idIgraca) {
                            return [2 /*return*/, -1];
                        }
                        igra.igraci[igra.igracNaPotezu].izvucenihKarata = 0;
                        pravilo = new pronalazacPravila_1.default(igra.trenutnaKarta, karta, igra.trenutnaBoja);
                        brojPravila = pravilo.vratiPravilo();
                        if (!brojPravila) {
                            return [2 /*return*/, 0];
                        }
                        igra.igraci[igra.igracNaPotezu].mozeDaZavrsi = true;
                        igra.trenutnaBoja = karta.boja;
                        igra.trenutnaKarta = karta;
                        this.ukloniKartu(igra, indexKarte);
                        if (!(igra.igraci[igra.igracNaPotezu].karte.length == 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, igra.save()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, 7];
                    case 3:
                        izvrsilacPravila = this.selektorPravila.funkcijskaPravila[brojPravila];
                        return [2 /*return*/, izvrsilacPravila(igra, this)];
                }
            });
        });
    };
    Igra.prototype.promeniTrenutnuBoju = function (igraId, boja, indexIgraca, idIgraca) {
        return __awaiter(this, void 0, void 0, function () {
            var igra;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_model_1.igraModel.findById(igraId)];
                    case 1:
                        igra = _a.sent();
                        if (igra.igracNaPotezu != indexIgraca)
                            return [2 /*return*/, 0];
                        if (igra.igraci[igra.igracNaPotezu].idIgraca != idIgraca)
                            return [2 /*return*/, 0];
                        if (!["red", "yellow", "blue", "green"].includes(boja)) return [3 /*break*/, 3];
                        igra.trenutnaBoja = boja;
                        igra.karte[igra.karte.length - 1].bojaPozadine = boja;
                        this.sledeciPotez(igra);
                        return [4 /*yield*/, igra.save()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, igra];
                    case 3: return [2 /*return*/, 0];
                }
            });
        });
    };
    Igra.prototype.vuciKartu = function (igraId, indexIgraca, idIgraca) {
        return __awaiter(this, void 0, void 0, function () {
            var igra;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_model_1.igraModel.findById(igraId)];
                    case 1:
                        igra = _a.sent();
                        if (!igra)
                            return [2 /*return*/, 0];
                        if (igra.igracNaPotezu != indexIgraca || igra.igraci[indexIgraca].izvucenihKarata >= 2 || igra.igraci[indexIgraca].idIgraca != idIgraca)
                            return [2 /*return*/, 0];
                        igra.igraci[indexIgraca].karte.push(this.spil.vuciKartu());
                        igra.igraci[indexIgraca].izvucenihKarata++;
                        if (igra.igraci[indexIgraca].izvucenihKarata == 2)
                            igra.igraci[indexIgraca].mozeDaZavrsi = true;
                        return [4 /*yield*/, igra.save()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, 1];
                }
            });
        });
    };
    Igra.prototype.revans = function (igra) {
        return __awaiter(this, void 0, void 0, function () {
            var brojIgraca, i, j, karta;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        brojIgraca = igra.igraci.length;
                        if (brojIgraca < 2)
                            throw new Error("Nemozete poceti partiju sa manje od 2 igraca!");
                        for (i = 0; i < brojIgraca; i++) {
                            igra.igraci[i].karte = [];
                            igra.igraci[i].izvucenihKarata = 0;
                            igra.igraci[i].mozeDaZavrsi = false;
                            igra.igraci[i].score = 0;
                            // izvlacenje 7 karata za svakog igraca
                            for (j = 0; j < 7; j++) {
                                karta = this.spil.vuciKartu();
                                igra.igraci[i].karte.push(karta);
                            }
                        }
                        // inicijalizacija pocetne karte na stolu
                        igra.trenutnaKarta = this.spil.vuciNeSpecijalnuKartu();
                        igra.trenutnaBoja = igra.trenutnaKarta.boja;
                        igra.pocelaIgra = true;
                        igra.brojIgraca = igra.igraci.length;
                        igra.obrnutRedosled = false;
                        igra.igracNaPotezu = 0;
                        return [4 /*yield*/, igra.save()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, igra];
                }
            });
        });
    };
    return Igra;
}());
exports.default = Igra;
