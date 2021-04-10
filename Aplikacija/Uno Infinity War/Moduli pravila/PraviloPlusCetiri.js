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
exports.ProveriPlusCetiriPravilo = exports.praviloPlusCetiri = void 0;
const IPravilo_1 = __importDefault(require("./IPravilo"));
class ProveriPlusCetiriPravilo extends IPravilo_1.default {
    constructor(pravilo) {
        super();
        this._pronalazacPravila = pravilo;
    }
    OdrediPravilo() {
        if (this._pronalazacPravila.karta2.specijalna && (this._pronalazacPravila.karta2.boja == "black" && this._pronalazacPravila.karta2.vrednost == 1))
            return 6;
        else
            return 0;
    }
}
exports.ProveriPlusCetiriPravilo = ProveriPlusCetiriPravilo;
var praviloPlusCetiri = function (igra, pointerNaIgru) {
    return __awaiter(this, void 0, void 0, function* () {
        igra.igraci[igra.igracNaPotezu].poeni += 50;
        if (igra.igraci[igra.igracNaPotezu].poeni >= igra.poeniZaPobedu) {
            yield igra.save();
            return 7;
        }
        pointerNaIgru.sledeciPotez(igra);
        // +4 
        pointerNaIgru.dodajKartu(igra, pointerNaIgru.spil.vuciKartu());
        pointerNaIgru.dodajKartu(igra, pointerNaIgru.spil.vuciKartu());
        pointerNaIgru.dodajKartu(igra, pointerNaIgru.spil.vuciKartu());
        pointerNaIgru.dodajKartu(igra, pointerNaIgru.spil.vuciKartu());
        igra.obrnutRedosled = !igra.obrnutRedosled;
        pointerNaIgru.sledeciPotez(igra);
        igra.obrnutRedosled = !igra.obrnutRedosled;
        yield igra.save();
        return 4;
    });
};
exports.praviloPlusCetiri = praviloPlusCetiri;
