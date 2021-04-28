"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObavestavacKorisnika = void 0;
var PraviloPlusDva_1 = require("../Moduli pravila/PraviloPlusDva");
var PraviloWildMysteryBoja_1 = require("../Moduli pravila/PraviloWildMysteryBoja");
var PraviloPlusCetiri_1 = require("../Moduli pravila/PraviloPlusCetiri");
var PreskociPravilo_1 = require("../Moduli pravila/PreskociPravilo");
var PraviloObrni_1 = require("../Moduli pravila/PraviloObrni");
var ObavestiZavrsetak_1 = require("../Moduli pravila/ObavestiZavrsetak");
var ObavestavacKorisnika = /** @class */ (function () {
    function ObavestavacKorisnika() {
        this.nizObavestavaca = new Array();
        this.nizObavestavaca.push(PraviloPlusDva_1.obavestiPlusDva);
        this.nizObavestavaca.push(PraviloWildMysteryBoja_1.obavestiWildBoja);
        this.nizObavestavaca.push(PraviloPlusCetiri_1.obavestiPlusCetiri);
        this.nizObavestavaca.push(PreskociPravilo_1.obavestiPreskoci);
        this.nizObavestavaca.push(PraviloObrni_1.obavestiObrni);
        this.nizObavestavaca.push(ObavestiZavrsetak_1.obavestiZavrsetak);
    }
    ObavestavacKorisnika.prototype.obavesti = function (rezultat, io, igra, podaci, igraKontroler) {
        this.nizObavestavaca[rezultat - 2](rezultat, io, igra, podaci, igraKontroler);
    };
    return ObavestavacKorisnika;
}());
exports.ObavestavacKorisnika = ObavestavacKorisnika;
