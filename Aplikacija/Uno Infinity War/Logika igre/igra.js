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
    //kada host odabere da pokrene igra, zovemo funkciju kreirajIgru koja inicijalizuje potrebne stavke, i cuva sve u bazu
    kreirajIgru(igraId, igraci) {
        return __awaiter(this, void 0, void 0, function* () {
            const brojIgraca = igraci.length;
            if (brojIgraca < 2)
                throw new Error("Ne mozete poceti partiju sa manje od 2 igraca!");
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
    //kada jedan igrac zavrsi potez, zove se ova funkcija
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
        //ne moze da zavrsi slededeci igrac dok ne odigra kartu ili izvuce maximum dve karte pa preskoci potez
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
    //kada korisnik klikne na neku kartu da odigra potez
    odigraj(igraId, indexIgraca, indexKarte, karta, idIgraca) {
        return __awaiter(this, void 0, void 0, function* () {
            const igra = yield db_model_1.igraModel.findById(igraId);
            if (igra.igracNaPotezu != indexIgraca || igra.igraci[igra.igracNaPotezu].idIgraca != idIgraca) {
                return -1;
            }
            igra.igraci[igra.igracNaPotezu].izvucenihKarata = 0;
            //on zakljucuje koje pravilo ce biti primenjeno, na osnvu karte na tavli, odigrane karte i boje koja se zahteva
            let pravilo = new pronalazacPravila_1.default(igra.trenutnaKarta, karta, igra.trenutnaBoja);
            //detektovano pravilo koje se primenjuje
            let brojPravila = pravilo.vratiPravilo();
            //pogresan potez
            if (!brojPravila) {
                return 0;
            }
            igra.igraci[igra.igracNaPotezu].mozeDaZavrsi = true;
            igra.trenutnaBoja = karta.boja;
            igra.trenutnaKarta = karta;
            this.ukloniKartu(igra, indexKarte);
            //posto nema vise karata u ruci, kraj igre
            if (igra.igraci[igra.igracNaPotezu].karte.length == 0) {
                yield igra.save();
                return 7;
            }
            //ako je potez validan, a nije se doslo do kraja igre, primenjuje se detektovano pravilo, u izvrsiocu pravila
            let izvrsilacPravila = this.selektorPravila.funkcijskaPravila[brojPravila];
            //izvrsilac javlja serveru sta se desilo, kako bi server mogao da obavesti igrace
            return izvrsilacPravila(igra, this);
        });
    }
    //zove se kada korisnik odabere novu boju
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
    //kada se vuce nova karta zbog neke specijalne karte ili korisnik sam zatrazi da izvuce novu kartu
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
}
exports.default = Igra;
