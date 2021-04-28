"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PraviloNevalidanPotez_1 = require("../Moduli pravila/PraviloNevalidanPotez");
var PraviloNormalnaVrednost_1 = require("../Moduli pravila/PraviloNormalnaVrednost");
var PraviloPlusCetiri_1 = require("../Moduli pravila/PraviloPlusCetiri");
var PraviloWildMysteryBoja_1 = require("../Moduli pravila/PraviloWildMysteryBoja");
var PreskociPravilo_1 = require("../Moduli pravila/PreskociPravilo");
var PraviloPlusDva_1 = require("../Moduli pravila/PraviloPlusDva");
var PraviloObrni_1 = require("../Moduli pravila/PraviloObrni");
/**
 * 0 => nevalidan potez
 * 1 => normalna vrednost
 * 2 => +2
 * 3 => preskoci
 * 4 => okreni
 * 5 => wild mystery boja
 * 6 => +4
 **/
var PronalazacPravila = /** @class */ (function () {
    function PronalazacPravila(karta1, karta2, trenutnaBoja) {
        this.errorPravila = new Array();
        this.normalnaPravila = new Array();
        this.karta1 = karta1;
        this.karta2 = karta2;
        this.trenutnaBoja = trenutnaBoja;
        this.errorPravila.push(new PraviloNevalidanPotez_1.ProveriNevalidnostJedan(this));
        this.errorPravila.push(new PraviloNevalidanPotez_1.ProveriNevalidnostDva(this));
        this.errorPravila.push(new PraviloNevalidanPotez_1.ProveriNevalidnostTri(this));
        this.normalnaPravila.push(new PraviloNormalnaVrednost_1.ProveriNormalnuVrednost(this));
        this.normalnaPravila.push(new PraviloPlusDva_1.ProveriPlusDvaPravilo(this));
        this.normalnaPravila.push(new PreskociPravilo_1.ProveriPreskociPravilo(this));
        this.normalnaPravila.push(new PraviloObrni_1.ProveriObrniPravilo(this));
        this.normalnaPravila.push(new PraviloWildMysteryBoja_1.ProveriWildBojuPravilo(this));
        this.normalnaPravila.push(new PraviloPlusCetiri_1.ProveriPlusCetiriPravilo(this));
    }
    PronalazacPravila.prototype.vratiPravilo = function () {
        var rezultatError;
        for (var _i = 0, _a = this.errorPravila; _i < _a.length; _i++) {
            var errPravilo = _a[_i];
            rezultatError = errPravilo.OdrediPravilo();
            if (rezultatError != 0) {
                return 0;
            }
        }
        var rezultatNormalno;
        for (var _b = 0, _c = this.normalnaPravila; _b < _c.length; _b++) {
            var pravilo = _c[_b];
            rezultatNormalno = pravilo.OdrediPravilo();
            if (rezultatNormalno != 0) {
                return rezultatNormalno;
            }
        }
        return 0;
    };
    return PronalazacPravila;
}());
exports.default = PronalazacPravila;
