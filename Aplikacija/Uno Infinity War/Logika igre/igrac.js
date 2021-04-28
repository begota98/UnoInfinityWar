"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Igrac = /** @class */ (function () {
    function Igrac(name, index) {
        this.karte = [];
        this.ime = name;
        this.index = index;
    }
    Igrac.prototype.dodajKartu = function (card) {
        this.karte.push(card);
    };
    Igrac.prototype.ukloniKartu = function (index) {
        this.karte.splice(index, 1);
    };
    return Igrac;
}());
exports.default = Igrac;
