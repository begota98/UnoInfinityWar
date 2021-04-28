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
 * 0 => invaild move
 * 1 => normal value on value move
 * 2 => +2
 * 3 => skip
 * 4 => reverse
 * 5 => wild mystery color
 * 6 => +4
 */
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
