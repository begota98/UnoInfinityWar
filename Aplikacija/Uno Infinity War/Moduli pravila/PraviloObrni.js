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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obavestiObrni = exports.ProveriObrniPravilo = exports.praviloObrni = void 0;
const IPravilo_1 = __importDefault(require("./IPravilo"));
class ProveriObrniPravilo extends IPravilo_1.default {
    constructor(pravilo) {
        super();
        this._pronalazacPravila = pravilo;
    }
    OdrediPravilo() {
        if (this._pronalazacPravila.karta2.specijalna && (this._pronalazacPravila.karta2.boja != "black" && (this._pronalazacPravila.karta2.boja == this._pronalazacPravila.trenutnaBoja || (this._pronalazacPravila.karta1.specijalna && this._pronalazacPravila.karta1.vrednost == this._pronalazacPravila.karta2.vrednost && this._pronalazacPravila.karta1.boja != "black")) && (this._pronalazacPravila.karta2.vrednost != 1 && this._pronalazacPravila.karta2.vrednost != 2)))
            return 4;
        else
            return 0;
    }
}
exports.ProveriObrniPravilo = ProveriObrniPravilo;
var praviloObrni = function (igra, pointerNaIgru) {
    return __awaiter(this, void 0, void 0, function* () {
        igra.igraci[igra.igracNaPotezu].poeni += 20;
        if (igra.igraci[igra.igracNaPotezu].poeni >= igra.poeniZaPobedu) {
            yield igra.save();
            return 7;
        }
        // obrni
        // radi kao preskoci za 2 igraca 
        if (igra.brojIgraca > 2) {
            igra.obrnutRedosled = !igra.obrnutRedosled;
            pointerNaIgru.sledeciPotez(igra);
        }
        yield igra.save();
        return 6;
    });
};
exports.praviloObrni = praviloObrni;
var obavestiObrni = function (rezultat, io, igra, podaci, igraKontroler) {
    return __awaiter(this, void 0, void 0, function* () {
        io.sockets.emit("promenaSmeraPartije", {
            idPartije: podaci.idPartije,
        });
    });
};
exports.obavestiObrni = obavestiObrni;
