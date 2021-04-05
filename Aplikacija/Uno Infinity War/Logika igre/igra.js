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
const spil_1 = __importDefault(require("./spil"));
const pronalazacPravila_1 = __importDefault(require("./pronalazacPravila"));
const selektorPravila_1 = __importDefault(require("./selektorPravila"));
const db_model_1 = require("../Model/db-model");
class Igra {
    constructor() {
        this.spil = new spil_1.default();
        this.selektorPravila = new selektorPravila_1.default();
    }
    kreirajIgru(igraId, igraci) {
        return __awaiter(this, void 0, void 0, function* () {
            const brojIgraca = igraci.length;
            if (brojIgraca < 2)
                throw new Error("Nemozete poceti partiju sa manje od 2 igraca!");
            const igra = yield db_model_1.igraModel.findById(igraId);
            for (let i = 0; i < brojIgraca; i++) {
                // izvlacenje 7 karata za svakog igraca
                for (let j = 0; j < 7; j++) {
                    let karta = this.spil.vuciKartu();
                    igra.igraci[i].karte.push(karta);
                }
            }
            // inicijalizacija pocetne karte na stolu
            igra.trenutnaKarta = this.spil.vuciNeSpecijalnuKartu();
            igra.trenutnaBoja = igra.trenutnaKarta.boja;
            igra.brojIgraca = brojIgraca;
            igra.obrnutRedosled = false;
            igra.pocelaIgra = true;
            yield igra.save();
            return igra;
        });
    }
    sledeciPotez(igra) {
        igra.igraci[igra.igracNaPotezu].izvucenihKarata = 0;
        igra.igraci[igra.igracNaPotezu].mozeDaZavrsi = false;
        if (igra.obrnutRedosled && igra.igracNaPotezu == 0)
            igra.igracNaPotezu = igra.brojIgraca - 1;
        else {
            if (igra.obrnutRedosled)
                igra.igracNaPotezu--;
            else
                igra.igracNaPotezu = (igra.igracNaPotezu + 1) % igra.brojIgraca;
        }
        igra.igraci[igra.igracNaPotezu].mozeDaZavrsi = false;
    }
    dodajKartu(igra, karta) {
        igra.igraci[igra.igracNaPotezu].karte.push(karta);
    }
    ukloniKartu(igra, index) {
        igra.igraci[igra.igracNaPotezu].karte.splice(index, 1);
    }
    /**
     * -1 => nije vas potez
     * 0 => false
     * 1 => true
     * 2 => +2
     * 4 => +4
     * 3 => izaberi boju
     * 5 => preskoci
     * 6 => obrni
     * 7 => kraj igre
     */
    odigraj(igraId, indexIgraca, indexKarte, karta, idIgraca) {
        return __awaiter(this, void 0, void 0, function* () {
            const igra = yield db_model_1.igraModel.findById(igraId);
            if (igra.igracNaPotezu != indexIgraca || igra.igraci[igra.igracNaPotezu].idIgraca != idIgraca) {
                return -1;
            }
            igra.igraci[igra.igracNaPotezu].izvucenihKarata = 0;
            let pravilo = new pronalazacPravila_1.default(igra.trenutnaKarta, karta, igra.trenutnaBoja);
            let brojPravila = pravilo.vratiPravilo();
            if (!brojPravila) {
                return 0;
            }
            igra.igraci[igra.igracNaPotezu].mozeDaZavrsi = true;
            igra.trenutnaBoja = karta.boja;
            igra.trenutnaKarta = karta;
            this.ukloniKartu(igra, indexKarte);
            if (igra.igraci[igra.igracNaPotezu].karte.length == 0) {
                yield igra.save();
                return 7;
            }
            let izvrsilacPravila = this.selektorPravila.funkcijskaPravila[brojPravila];
            return izvrsilacPravila(igra, this);
        });
    }
    promeniTrenutnuBoju(igraId, boja, indexIgraca, idIgraca) {
        return __awaiter(this, void 0, void 0, function* () {
            const igra = yield db_model_1.igraModel.findById(igraId);
            if (igra.igracNaPotezu != indexIgraca)
                return 0;
            if (igra.igraci[igra.igracNaPotezu].idIgraca != idIgraca)
                return 0;
            if (["red", "yellow", "blue", "green"].includes(boja)) {
                igra.trenutnaBoja = boja;
                igra.karte[igra.karte.length - 1].bojaPozadine = boja;
                this.sledeciPotez(igra);
                yield igra.save();
                return igra;
            }
            return 0;
        });
    }
    vuciKartu(igraId, indexIgraca, idIgraca) {
        return __awaiter(this, void 0, void 0, function* () {
            const igra = yield db_model_1.igraModel.findById(igraId);
            if (!igra)
                return 0;
            if (igra.igracNaPotezu != indexIgraca || igra.igraci[indexIgraca].izvucenihKarata >= 2 || igra.igraci[indexIgraca].idIgraca != idIgraca)
                return 0;
            igra.igraci[indexIgraca].karte.push(this.spil.vuciKartu());
            igra.igraci[indexIgraca].izvucenihKarata++;
            if (igra.igraci[indexIgraca].izvucenihKarata == 2)
                igra.igraci[indexIgraca].mozeDaZavrsi = true;
            yield igra.save();
            return 1;
        });
    }
    revans(igra) {
        return __awaiter(this, void 0, void 0, function* () {
            const brojIgraca = igra.igraci.length;
            if (brojIgraca < 2)
                throw new Error("Nemozete poceti partiju sa manje od 2 igraca!");
            for (let i = 0; i < brojIgraca; i++) {
                igra.igraci[i].karte = [];
                igra.igraci[i].izvucenihKarata = 0;
                igra.igraci[i].mozeDaZavrsi = false;
                igra.igraci[i].score = 0;
                // izvlacenje 7 karata za svakog igraca
                for (let j = 0; j < 7; j++) {
                    let karta = this.spil.vuciKartu();
                    igra.igraci[i].karte.push(karta);
                }
            }
            // inicijalizacija pocetne karte na stolu
            igra.trenutnaKarta = this.spil.vuciNeSpecijalnuKartu();
            igra.trenutnaBoja = igra.trenutnaKarta.boja;
            igra.pocelaIgra = true;
            igra.brojIgraca = igra.igraci.length;
            igra.obrnutRedosled = false;
            igra.igracNaPotezu = 0;
            yield igra.save();
            return igra;
        });
    }
}
exports.default = Igra;
