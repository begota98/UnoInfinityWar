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
exports.ProveriNevalidnostTri = exports.ProveriNevalidnostDva = exports.ProveriNevalidnostJedan = exports.praviloNevalidanPotez = void 0;
const IPravilo_1 = __importDefault(require("./IPravilo"));
// sta se desava ako je nastao nevalidan potez
var praviloNevalidanPotez = function (igra, pointerNaIgru) {
    return __awaiter(this, void 0, void 0, function* () {
        return 0;
    });
};
exports.praviloNevalidanPotez = praviloNevalidanPotez;
// klase koje nasledjuju apstraktnu IPravilo, sadrze razlicite algoritme (strategy) koji pokusavaju da detektuju na osnovu odigranog poteza koje pravilo se treba primeniti
class ProveriNevalidnostJedan extends IPravilo_1.default {
    constructor(pravilo) {
        super();
        this._pronalazacPravila = pravilo;
    }
    OdrediPravilo() {
        if (!this._pronalazacPravila.karta2.specijalna && !(this._pronalazacPravila.trenutnaBoja == this._pronalazacPravila.karta2.boja || (!this._pronalazacPravila.karta1.specijalna && this._pronalazacPravila.karta1.vrednost == this._pronalazacPravila.karta2.vrednost)))
            return 1;
        else
            return 0;
    }
}
exports.ProveriNevalidnostJedan = ProveriNevalidnostJedan;
class ProveriNevalidnostDva extends IPravilo_1.default {
    constructor(pravilo) {
        super();
        this.mojePravilo = pravilo;
    }
    OdrediPravilo() {
        if (this.mojePravilo.karta2.specijalna && (this.mojePravilo.karta2.boja != "black" && this.mojePravilo.karta2.specijalna && this.mojePravilo.trenutnaBoja != this.mojePravilo.karta2.boja && this.mojePravilo.karta1.vrednost != this.mojePravilo.karta2.vrednost))
            return 1;
        else
            return 0;
    }
}
exports.ProveriNevalidnostDva = ProveriNevalidnostDva;
class ProveriNevalidnostTri extends IPravilo_1.default {
    constructor(pravilo) {
        super();
        this.mojePravilo = pravilo;
    }
    OdrediPravilo() {
        if (this.mojePravilo.karta2.specijalna && this.mojePravilo.karta2.boja != "black" && !(this.mojePravilo.karta2.boja == this.mojePravilo.trenutnaBoja || (this.mojePravilo.karta1.specijalna && this.mojePravilo.karta1.vrednost == this.mojePravilo.karta2.vrednost && this.mojePravilo.karta1.boja != "black")))
            return 1;
        else
            return 0;
    }
}
exports.ProveriNevalidnostTri = ProveriNevalidnostTri;
