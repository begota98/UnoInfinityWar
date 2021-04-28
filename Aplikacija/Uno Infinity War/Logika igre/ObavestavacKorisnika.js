"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObavestavacKorisnika = void 0;
const PraviloPlusDva_1 = require("../Moduli pravila/PraviloPlusDva");
const PraviloWildMysteryBoja_1 = require("../Moduli pravila/PraviloWildMysteryBoja");
const PraviloPlusCetiri_1 = require("../Moduli pravila/PraviloPlusCetiri");
const PreskociPravilo_1 = require("../Moduli pravila/PreskociPravilo");
const PraviloObrni_1 = require("../Moduli pravila/PraviloObrni");
const ObavestiZavrsetak_1 = require("../Moduli pravila/ObavestiZavrsetak");
class ObavestavacKorisnika {
    constructor() {
        this.nizObavestavaca = new Array();
        this.nizObavestavaca.push(PraviloPlusDva_1.obavestiPlusDva);
        this.nizObavestavaca.push(PraviloWildMysteryBoja_1.obavestiWildBoja);
        this.nizObavestavaca.push(PraviloPlusCetiri_1.obavestiPlusCetiri);
        this.nizObavestavaca.push(PreskociPravilo_1.obavestiPreskoci);
        this.nizObavestavaca.push(PraviloObrni_1.obavestiObrni);
        this.nizObavestavaca.push(ObavestiZavrsetak_1.obavestiZavrsetak);
    }
    obavesti(rezultat, io, igra, podaci, igraKontroler) {
        this.nizObavestavaca[rezultat - 2](rezultat, io, igra, podaci, igraKontroler);
    }
}
exports.ObavestavacKorisnika = ObavestavacKorisnika;
