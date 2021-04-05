"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Igrac {
    constructor(name, index) {
        this.karte = [];
        this.ime = name;
        this.index = index;
    }
    dodajKartu(card) {
        this.karte.push(card);
    }
    ukloniKartu(index) {
        this.karte.splice(index, 1);
    }
}
exports.default = Igrac;
