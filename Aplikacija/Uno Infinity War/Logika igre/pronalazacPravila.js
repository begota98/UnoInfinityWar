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
 * 1 => normalna vrednost
 * 2 => +2
 * 3 => preskoci
 * 4 => okreni
 * 5 => wild mystery boja
 * 6 => +4
 **/
//rule pattern, na onsovu tekuceg stanja odredjuje sta se dalje treba primeniti
class PronalazacPravila {
    constructor(karta1, karta2, trenutnaBoja) {
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
    vratiPravilo() {
        //prvo proveri da li je nastala greska
        let rezultatError;
        for (let errPravilo of this.errorPravila) {
            rezultatError = errPravilo.OdrediPravilo();
            if (rezultatError != 0) {
                return 0;
            }
        }
        //u suprotnom, prodje kroz ostala moguca pravila, i ako je neko zadovoljeno signalizira na dalje tu informaciju kako bi se preduzele dalje akcije
        let rezultatNormalno;
        for (let pravilo of this.normalnaPravila) {
            rezultatNormalno = pravilo.OdrediPravilo();
            if (rezultatNormalno != 0) {
                return rezultatNormalno;
            }
        }
        return 0;
    }
}
exports.default = PronalazacPravila;
