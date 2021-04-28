"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const karta_1 = __importDefault(require("./karta"));
class Spil {
    constructor() {
        /**
        *
        * 8 wild karata, 1 => +4, 2 => mystery
        * 25 karata po svakoj od 4 boje => 0-9 numbers,2 preskoci, 2 okreni, 2 plus2, 3 akcione karte
        * 1 => preskoci, 2 => +2, 3 => okreni
        *
        **/
        this.boje = ["red", "yellow", "blue", "green"];
    }
    generisiNeSpecijalanIndex() {
        return Math.floor(Math.random() * 10);
    }
    generisiSpecijalanIndex() {
        return Math.floor(Math.random() * 3) + 1;
    }
    vuciKartu() {
        let random = Math.random();
        let vrednost = undefined;
        let specijalna = false;
        let boja = undefined;
        if (random < 0.5) {
            random = Math.random();
            specijalna = true;
            boja = "black";
            if (random < 0.5) {
                vrednost = 1;
            }
            else {
                vrednost = 2;
            }
        }
        else {
            random = Math.floor(Math.random() * 3.99);
            boja = this.boje[random];
            if (random < this.boje.length / 2) {
                vrednost = this.generisiNeSpecijalanIndex();
                specijalna = false;
            }
            else {
                vrednost = this.generisiSpecijalanIndex();
                specijalna = true;
            }
        }
        return new karta_1.default(vrednost, boja, specijalna);
    }
    vuciNeSpecijalnuKartu() {
        let random = Math.random();
        let vrednost = undefined;
        let specijalna = false;
        let boja = undefined;
        random = Math.floor(Math.random() * 3.99);
        boja = this.boje[random];
        specijalna = false;
        vrednost = this.generisiNeSpecijalanIndex();
        return new karta_1.default(vrednost, boja, specijalna);
    }
}
exports.default = Spil;
