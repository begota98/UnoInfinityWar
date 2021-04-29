"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PraviloNevalidanPotez_1 = require("../Moduli pravila/PraviloNevalidanPotez");
const PraviloNormalnaVrednost_1 = require("../Moduli pravila/PraviloNormalnaVrednost");
const PraviloPlusCetiri_1 = require("../Moduli pravila/PraviloPlusCetiri");
const PraviloWildMysteryBoja_1 = require("../Moduli pravila/PraviloWildMysteryBoja");
const PreskociPravilo_1 = require("../Moduli pravila/PreskociPravilo");
const PraviloPlusDva_1 = require("../Moduli pravila/PraviloPlusDva");
const PraviloObrni_1 = require("../Moduli pravila/PraviloObrni");
/**
 * 0 => nevalidan potez
 * 1 => normalna vrednost (broj na broj)
 * 2 => +2
 * 3 => preskoci
 * 4 => okreni redosled
 * 5 => promena boje
 * 6 => promena boje i plus 4
 */
//kontejner za algoritme koji se primenjuju u zavisnosti od detektovane akcije iz pronalazaca
class SelektorPravila {
    constructor() {
        this.funkcijskaPravila = new Array();
        this.funkcijskaPravila.push(PraviloNevalidanPotez_1.praviloNevalidanPotez);
        this.funkcijskaPravila.push(PraviloNormalnaVrednost_1.praviloNormalnaVrednost);
        this.funkcijskaPravila.push(PraviloPlusDva_1.praviloPlusDva);
        this.funkcijskaPravila.push(PreskociPravilo_1.praviloPreskoci);
        this.funkcijskaPravila.push(PraviloObrni_1.praviloObrni);
        this.funkcijskaPravila.push(PraviloWildMysteryBoja_1.praviloWildBoja);
        this.funkcijskaPravila.push(PraviloPlusCetiri_1.praviloPlusCetiri);
    }
}
exports.default = SelektorPravila;
