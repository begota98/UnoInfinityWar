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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = __importDefault(require("socket.io"));
const http_1 = __importDefault(require("http"));
const igra_1 = __importDefault(require("./Logika igre/igra"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_model_1 = require("./Model/db-model");
const ObavestavacKorisnika_1 = require("./Logika igre/ObavestavacKorisnika");
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
dotenv_1.default.config();
// create the igra
let igraKontroler = new igra_1.default();
const aplikacija = express_1.default();
const PORT = 3000;
const server = http_1.default.createServer(aplikacija);
mongoose_1.default.connect(process.env.CONNECTION_STRING, { useNewUrlParser: true });
mongoose_1.default.connection.once("open", () => {
    console.log("connected to db " + process.env.CONNECTION_STRING);
});
aplikacija.use(cors_1.default());
aplikacija.use(express_1.default.static("output"));
aplikacija.use(express_1.default.static("Front klase"));
aplikacija.use(express_1.default.static("styles"));
const io = socket_io_1.default.listen(server);
aplikacija.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "./Stranice/signin.html"));
});
aplikacija.get("/signin", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "./Stranice/signin.html"));
});
aplikacija.get("/signup", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "./Stranice/signup.html"));
});
aplikacija.get("/kreirajIgru", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "./Stranice/kreirajIgru.html"));
});
aplikacija.get("/pregledIgre", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "./Stranice/pregledIgre.html"));
});
aplikacija.get("/resetpass", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "./Stranice/resetpass.html"));
});
aplikacija.get("/pocetnaStrana", function (req, res) {
    res.sendFile(path_1.default.join(__dirname, "./Stranice/pocetnaStrana.html"));
});
aplikacija.get("/oStranici", function (req, res) {
    res.sendFile(path_1.default.join(__dirname, "./Stranice/oStranici.html"));
});
aplikacija.get("/istorijaIgara", function (req, res) {
    res.sendFile(path_1.default.join(__dirname, "./Stranice/istorijaIgara.html"));
});
aplikacija.get("/igrajIgru", function (req, res) {
    res.sendFile(path_1.default.join(__dirname, "./Stranice/kreirajIgru.html"));
});
aplikacija.get("/vratiigrekorisnika/:id", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let korisnik = yield db_model_1.korisnikModel.findById(req.params.id);
        if (korisnik) {
            res.json(korisnik.get("prethodneIgre"));
        }
        else {
            res.json("");
        }
    });
});
aplikacija.get("/vratiigru/:id", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let igra = yield db_model_1.igraModel.findById(req.params.id);
        res.json(igra);
    });
});
aplikacija.get("/vratipotezeigre/:id", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let igra = yield db_model_1.igraModel.findById(req.params.id);
        if (igra) {
            res.json(igra.get("karte"));
        }
        else {
            res.json("");
        }
    });
});
io.on("connection", (socket) => {
    socket.on("istorija", (podaci) => __awaiter(void 0, void 0, void 0, function* () {
        let igra = yield db_model_1.igraModel.findById(podaci.poruka);
        socket.emit("istorijaOdgovor", {
            uzmiStaTiTreba: igra,
        });
    }));
    socket.on("ulogovanSam", (podaci) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let user = yield db_model_1.korisnikModel.findById(podaci.id);
            if (user == null) {
                user = new db_model_1.korisnikModel({
                    _id: podaci.id,
                });
                yield user.save();
            }
        }
        catch (err) {
            console.log("GRESKA");
        }
    }));
    socket.on("createGame", (podaci) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!podaci.ime || !podaci.idIgraca)
                throw new Error("nedovoljno popodataka");
            let novaPartija = new db_model_1.igraModel({
                igraci: [
                    {
                        ime: podaci.ime,
                        indeks: podaci.indexIgraca,
                        idIgraca: podaci.idIgraca,
                        soketId: socket.id,
                        izvucenihKarata: 0,
                        poeni: 0,
                    },
                ],
                igracNaPotezu: 0,
                pocelaIgra: false,
                obrnutRedosled: false,
                datum: new Date().toLocaleString(),
                poeniZaPobedu: podaci.PoeniZaPobedu,
                brojIgraca: 1,
            });
            yield novaPartija.save();
            socket.emit("kreiranaJeIgraID", {
                //salje se ID igre
                idPartije: novaPartija._id,
                idIgraca: podaci.idIgraca,
            });
            socket.idPartije = novaPartija._id;
        }
        catch (err) {
            socket.emit("greska", { poruka: err.message });
        }
    }));
    // kada se ostali korisnci joinuju partiji
    socket.on("pridruziSePartiji", (podaci) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!podaci.idPartije || !podaci.idIgraca)
                throw new Error("nedovoljno podataka");
            let igra = yield db_model_1.igraModel.findById(podaci.idPartije);
            if (!igra)
                throw new Error("ne postoji igra sa ovim id-jem");
            if (igra.pocelaIgra) {
                throw new Error("partija je vec pocela");
            }
            //provera da se nismo joinovali ranije
            for (let igrac of igra.igraci) {
                if (igrac.idIgraca == podaci.idIgraca)
                    return;
            }
            let index = igra.igraci.length;
            igra.igraci.push({
                ime: podaci.imeIgraca,
                indeks: index,
                idIgraca: podaci.idIgraca,
                soketId: socket.id,
                izvucenihKarata: 0,
                poeni: 0,
            });
            // postavljanje idPartije na socket objekat
            socket.idPartije = igra._id;
            let igraci = [];
            for (let igrac of igra.igraci) {
                igraci.push({
                    ime: igrac.ime,
                    indeks: igrac.indeks,
                });
            }
            igra.markModified("igraci");
            igra.brojIgraca++;
            yield igra.save();
            //kada se uspesno joinujemo
            socket.emit("uspesnoPridruzivanjeIgri", {
                idPartije: igra._id,
                idIgraca: podaci.idIgraca,
                indexIgraca: index,
            });
            for (let igrac of igra.igraci) {
                //promena u redu cekanja 
                io.to(igrac.soketId).emit("promenaIgracaKojiCekajuPartiju", {
                    idPartije: igra._id,
                    igraci: igraci,
                });
            }
        }
        catch (err) {
            socket.emit("greska", { poruka: err.message });
        }
    }));
    // pokretanje igre
    socket.on("pokreniIgru", (podaci) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let igra = yield db_model_1.igraModel.findById(podaci.idPartije);
            if (!igra)
                throw new Error("ne postoji igra sa tim id-jem");
            let igraci = [];
            for (let igrac of igra.igraci)
                igraci.push(igrac);
            igra = yield igraKontroler.kreirajIgru(igra._id, igraci);
            igraci = [];
            for (let igrac of igra.igraci) {
                igraci.push({
                    ime: igrac.ime,
                    indeks: igrac.indeks,
                    izvucenihKarata: igrac.karte.length,
                    poeni: igrac.poeni,
                });
                let ikorisnikPom = yield db_model_1.korisnikModel.findById(igrac.idIgraca);
                ikorisnikPom.prethodneIgre.push(igra._id);
                yield ikorisnikPom.save();
            }
            //pocetak partije
            for (let igrac of igra.igraci) {
                io.to(igrac.soketId).emit("kreiranaJeIgra", {
                    idPartije: podaci.idPartije,
                    igraci: igraci,
                    trenutnaKarta: igra.trenutnaKarta,
                    igracNaPotezu: igra.igracNaPotezu,
                    trenutnaBoja: igra.trenutnaBoja,
                });
            }
            //izvlacenje karata za svakog od igraca
            for (let igrac of igra.igraci) {
                io.to(igrac.soketId).emit("pribaviKarte", {
                    idIgraca: igrac.idIgraca,
                    karte: igrac.karte,
                    idPartije: podaci.idPartije,
                });
            }
        }
        catch (err) {
            socket.emit("greska", { poruka: err.message });
        }
    }));
    // kada igrac odigra potez
    socket.on("kartaOdigrana", (podaci) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let isPlayed = yield igraKontroler.odigraj(podaci.idPartije, podaci.indexIgraca, podaci.indexKarte, podaci.karta, podaci.idIgraca);
            if (isPlayed == -1) {
                socket.emit("nisteNaPotezu", {
                    idPartije: podaci.idPartije,
                    // indeks: podaci.indeks,
                    idIgraca: podaci.idIgraca,
                });
                return;
            }
            else if (isPlayed == 0) {
                socket.emit("pogresanPotez", {
                    idPartije: podaci.idPartije,
                    // indeks: podaci.indeks,
                    idIgraca: podaci.idIgraca,
                });
                return;
            }
            let igra = yield db_model_1.igraModel.findById(podaci.idPartije);
            //pamtimo svaki potez u bazi
            let korisnikP = yield db_model_1.korisnikModel.findById(podaci.idIgraca);
            igra.karte.push({
                karta: {
                    vrednost: podaci.karta.vrednost,
                    specijalna: podaci.karta.specijalna,
                    boja: podaci.karta.boja,
                },
                korisnik: korisnikP,
                bojaPozadine: podaci.karta.boja,
                imeUPartiji: podaci.imeIgraca,
            });
            yield igra.save();
            let igraci = [];
            for (let igrac of igra.igraci) {
                igraci.push({
                    ime: igrac.ime,
                    indeks: igrac.indeks,
                    izvucenihKarata: igrac.karte.length,
                    poeni: igrac.poeni,
                });
            }
            for (let igrac of igra.igraci) {
                io.to(igrac.soketId).emit("azuriranaPartija", {
                    idPartije: podaci.idPartije,
                    igraci: igraci,
                    trenutnaKarta: igra.trenutnaKarta,
                    igracNaPotezu: igra.igracNaPotezu,
                    trenutnaBoja: igra.trenutnaBoja,
                    kartaJeIzvucena: isPlayed == 4 || isPlayed == 3 ? true : false,
                });
            }
            // azuriranje za sve
            //??????????????mozda pbrazac
            let uno = false;
            if (igra.igraci[podaci.indexIgraca].karte.length == 1)
                uno = true;
            for (let igrac of igra.igraci) {
                io.to(igrac.soketId).emit("pribaviKarte", {
                    idIgraca: igrac.idIgraca,
                    karte: igrac.karte,
                    idPartije: podaci.idPartije,
                });
            }
            console.log(isPlayed);
            if (uno) {
                for (let igrac of igra.igraci) {
                    io.to(igrac.soketId).emit("uno", {
                        idPartije: podaci.idPartije,
                    });
                }
            }
            let obavestavacKorisnika = new ObavestavacKorisnika_1.ObavestavacKorisnika();
            if (isPlayed > 1) {
                obavestavacKorisnika.obavesti(isPlayed, io, igra, podaci, igraKontroler);
            }
            // console.log(igra.igraci[igra.igracNaPotezu]);
            // if (isPlayed == 2) {
            //   io.to(igra.igraci[igra.igracNaPotezu].socketId).emit("vuciDve", {
            //     idPartije: podaci.idPartije,
            //   });
            // } else if (isPlayed == 3) {
            //   io.sockets.emit("odaberiteBoju", {
            //     idPartije: podaci.idPartije,
            //     indexIgraca: podaci.indexIgraca,
            //     idIgraca: igra.igraci[podaci.indexIgraca].idIgraca,
            //   });
            // } else if (isPlayed == 4) {
            //   io.sockets.emit("odaberiteBoju", {
            //     idPartije: podaci.idPartije,
            //     indexIgraca: podaci.indexIgraca,
            //     idIgraca: igra.igraci[podaci.indexIgraca].idIgraca,
            //   });
            //   igraKontroler.sledeciPotez(igra);
            //   io.to(igra.igraci[igra.igracNaPotezu].socketId).emit("vuciCetiri", {
            //     idPartije: podaci.idPartije,
            //   });
            //   igra.obrnutRedosled = !igra.obrnutRedosled;
            //   igraKontroler.sledeciPotez(igra);
            //   igra.obrnutRedosled = !igra.obrnutRedosled;
            // } else if (isPlayed == 5) {
            //   io.sockets.emit("preskakanjeIgraca", {
            //     idPartije: podaci.idPartije,
            //   });
            // } else if (isPlayed == 6) {
            //   io.sockets.emit("promenaSmeraPartije", {
            //     idPartije: podaci.idPartije,
            //   });
            // } else if (isPlayed == 7) {
            //   io.sockets.emit("zavrsetakPartije", {
            //     idPartije: podaci.idPartije,
            //     indeks: podaci.indexIgraca,
            //     idIgraca: podaci.idIgraca,
            //     success: "Kraj igre",
            //   });
            // }
        }
        catch (err) {
            socket.emit("greska", { poruka: err.message });
        }
    }));
    socket.on("bojaOdabrana", (podaci) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!podaci.idPartije ||
                !podaci.boja ||
                podaci.indexIgraca === undefined ||
                !podaci.idIgraca)
                throw new Error("nedovoljno podata");
            yield igraKontroler.promeniTrenutnuBoju(podaci.idPartije, podaci.boja, podaci.indexIgraca, podaci.idIgraca);
            let igra = yield db_model_1.igraModel.findById(podaci.idPartije);
            let igraci = [];
            for (let igrac of igra.igraci) {
                igraci.push({
                    ime: igrac.ime,
                    indeks: igrac.indeks,
                    izvucenihKarata: igrac.karte.length,
                    poeni: igrac.poeni,
                });
            }
            for (let igrac of igra.igraci) {
                io.to(igrac.soketId).emit("azuriranaPartija", {
                    idPartije: podaci.idPartije,
                    igraci: igraci,
                    trenutnaKarta: igra.trenutnaKarta,
                    igracNaPotezu: igra.igracNaPotezu,
                    trenutnaBoja: igra.trenutnaBoja,
                    kartaJeIzvucena: true,
                });
            }
        }
        catch (err) {
            socket.emit("greska", { poruka: err.message });
        }
    }));
    socket.on("vuciKartu", (podaci) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!podaci.idPartije || podaci.indexIgraca === undefined || !podaci.idIgraca)
                throw new Error("podaci is not enough");
            let x = yield igraKontroler.vuciKartu(podaci.idPartije, podaci.indexIgraca, podaci.idIgraca);
            if (!x) {
                socket.emit("nisteNaPotezu", {
                    idPartije: podaci.idPartije,
                    indeks: podaci.indexIgraca,
                    idIgraca: podaci.idIgraca,
                });
                return;
            }
            let igra = yield db_model_1.igraModel.findById(podaci.idPartije);
            let igraci = [];
            for (let igrac of igra.igraci) {
                igraci.push({
                    ime: igrac.ime,
                    index: igrac.indeks,
                    izvucenihKarata: igrac.karte.length,
                    poeni: igrac.poeni,
                });
            }
            for (let igrac of igra.igraci) {
                io.to(igrac.soketId).emit("azuriranaPartija", {
                    idPartije: podaci.idPartije,
                    igraci: igraci,
                    trenutnaKarta: igra.trenutnaKarta,
                    igracNaPotezu: igra.igracNaPotezu,
                    trenutnaBoja: igra.trenutnaBoja,
                    cardDrawn: true,
                });
            }
            console.log(igra.igraci[podaci.indexIgraca].karte);
            socket.emit("pribaviKarte", {
                idIgraca: podaci.idIgraca,
                karte: igra.igraci[podaci.indexIgraca].karte,
                idPartije: podaci.idPartije,
            });
        }
        catch (err) {
            socket.emit("greska", { poruka: err.message });
        }
    }));
    socket.on("zavrsiPotez", (podaci) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let igra = yield db_model_1.igraModel.findById(podaci.idPartije);
            if (!igra)
                throw new Error("nema igre sa tim id-jem");
            if (igra.igracNaPotezu == podaci.indexIgraca &&
                igra.igraci[igra.igracNaPotezu].idIgraca == podaci.idIgraca &&
                igra.igraci[igra.igracNaPotezu].mozeDaZavrsi) {
                yield igraKontroler.sledeciPotez(igra);
                yield igra.save();
                let igraci = [];
                for (let igrac of igra.igraci) {
                    igraci.push({
                        ime: igrac.ime,
                        indeks: igrac.indeks,
                        izvucenihKarata: igrac.karte.length,
                        poeni: igrac.poeni,
                    });
                }
                for (let igrac of igra.igraci) {
                    io.to(igrac.soketId).emit("azuriranaPartija", {
                        idPartije: podaci.idPartije,
                        igraci: igraci,
                        trenutnaKarta: igra.trenutnaKarta,
                        igracNaPotezu: igra.igracNaPotezu,
                        trenutnaBoja: igra.trenutnaBoja,
                    });
                }
                for (let igrac of igra.igraci) {
                    io.to(igrac.soketId).emit("pribaviKarte", {
                        idIgraca: igrac.idIgraca,
                        karte: igrac.karte,
                        idPartije: podaci.idPartije,
                    });
                }
            }
            else if (!igra.igraci[igra.igracNaPotezu].mozeDaZavrsi) {
                socket.emit("greska", {
                    poruka: "Nemozete zavrsti potez, morate vuci ili odigrati kartu",
                });
            }
        }
        catch (err) {
            socket.emit("greska", { poruka: err });
        }
    }));
    socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const socketId = socket.id;
            const idPartije = socket.idPartije;
            const igra = yield db_model_1.igraModel.findById(idPartije);
            if (!igra || igra.zavrsenaIgra == 1)
                return;
            let igrac;
            let disconnected = 0;
            // uklanjanje igraca iz igre
            for (let i = 0; i < igra.igraci.length; i++) {
                if (igra.igraci[i].soketId == socketId) {
                    disconnected = 1;
                    igrac = igra.igraci[i];
                    igra.igraci.splice(i, 1);
                    igra.brojIgraca = igra.igraci.length;
                    if (igra.brojIgraca == 0) {
                        // delete igra from db
                        //await igraModel.findByIdAndDelete(idPartije);
                        return;
                    }
                    break;
                }
            }
            if (!disconnected)
                return;
            if (igra.brojIgraca > 0) {
                // azuriranje indeksa igraca prilikom diskonekcije
                for (let i = 0; i < igra.igraci.length; i++) {
                    igra.igraci[i].index = i;
                    io.to(igra.igraci[i].soketId).emit("promenaIndexa", {
                        idPartije: idPartije,
                        idIgraca: igra.igraci[i].idIgraca,
                        noviIndex: i,
                    });
                    io.to(igra.igraci[i].soketId).emit("igracDiskonektovan", {
                        idPartije: idPartije,
                        imeIgraca: igrac.ime,
                    });
                }
                yield igra.save();
                let igraci = [];
                for (let igrac of igra.igraci) {
                    igraci.push({
                        ime: igrac.ime,
                        indeks: igrac.indeks,
                        izvucenihKarata: igrac.karte.length,
                        poeni: igrac.poeni,
                    });
                }
                if (igra.pocelaIgra) {
                    for (let igrac of igra.igraci) {
                        io.to(igrac.soketId).emit("azuriranaPartija", {
                            idPartije: idPartije,
                            igraci: igraci,
                            trenutnaKarta: igra.trenutnaKarta,
                            igracNaPotezu: igra.igracNaPotezu,
                            trenutnaBoja: igra.trenutnaBoja,
                        });
                    }
                    if (igra.igraci.length == 1 && igra.zavrsenaIgra == 0) {
                        igra.zavrsenaIgra = 1;
                        yield igra.save();
                        io.to(igra.igraci[0].soketId).emit("zavrsetakPartije", {
                            idPartije: idPartije,
                            idIgraca: igra.igraci[0]._id,
                            nemaIgraca: 1,
                            success: "Kraj igre",
                        });
                    }
                }
                else {
                    for (let igrac of igra.igraci) {
                        io.to(igrac.soketId).emit("promenaIgracaKojiCekajuPartiju", {
                            idPartije: igra._id,
                            igraci: igraci,
                        });
                    }
                }
            }
        }
        catch (err) {
            socket.emit("greska", { poruka: err.message });
        }
    }));
    socket.on("chatMessage", (podaci) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let idPartije = podaci.idPartije;
            let ime = podaci.imeIgraca;
            if (!idPartije || !ime)
                throw new Error("nedovoljno podataka");
            const igra = yield db_model_1.igraModel.findById(idPartije);
            if (!igra)
                throw new Error("ne postoji igra sa tim id-jem");
            igra.chat.push({
                imeIgraca: ime,
                poruka: podaci.tekstPoruke,
            });
            yield igra.save();
            // emitovanje signale svim igracima u partiji
            for (let igrac of igra.igraci) {
                io.to(igrac.soketId).emit("prijemPoruke", {
                    idPartije: igra._id,
                    imeIgraca: ime,
                    tekstPoruke: podaci.tekstPoruke,
                    idIgraca: podaci.idIgraca,
                });
            }
        }
        catch (err) {
            socket.emit("greska", { poruka: err.message });
        }
    }));
    socket.on("kickujIgraca", (podaci) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const idPartije = podaci.idPartije;
            const igra = yield db_model_1.igraModel.findById(idPartije);
            if (!igra)
                throw new Error("nema igre sa tim id-jem");
            if (igra.igraci[0].idIgraca != podaci.idIgraca)
                throw new Error("niste host");
            if (!podaci.indexIgraca)
                throw new Error("nedovoljno podataka");
            io.to(igra.igraci[podaci.indexIgraca].soketId).emit("kikovaniSte", {
                idPartije: idPartije,
            });
            igra.igraci.splice(podaci.indexIgraca, 1);
            igra.brojIgraca = igra.brojIgraca - 1;
            igra.markModified("igraci");
            yield igra.save();
            for (let i = 0; i < igra.igraci.length; i++) {
                igra.igraci[i].indexIgraca = i;
                io.to(igra.igraci[i].soketId).emit("promenaIndexa", {
                    idPartije: idPartije,
                    idIgraca: igra.igraci[i].idIgraca,
                    noviIndex: i,
                });
            }
            let igraci = [];
            for (let igrac of igra.igraci) {
                igraci.push({
                    ime: igrac.ime,
                    indeks: igrac.indeks,
                    izvucenihKarata: igrac.karte.length,
                    poeni: igrac.poeni,
                });
            }
            if (igra.pocelaIgra) {
                for (let igrac of igra.igraci) {
                    io.to(igrac.soketId).emit("azuriranaPartija", {
                        idPartije: idPartije,
                        igraci: igraci,
                        trenutnaKarta: igra.trenutnaKarta,
                        igracNaPotezu: igra.igracNaPotezu,
                        trenutnaBoja: igra.trenutnaBoja,
                    });
                }
                if (igra.igraci.length == 1) {
                    igra.zavrsenaIgra = 1;
                    yield igra.save();
                    io.to(igra.igraci[0].soketId).emit("zavrsetakPartije", {
                        idPartije: idPartije,
                        idIgraca: igra.igraci[0]._id,
                        nemaIgraca: 1,
                        success: "Kraj igre",
                    });
                }
            }
            else {
                for (let igrac of igra.igraci) {
                    io.to(igrac.soketId).emit("promenaIgracaKojiCekajuPartiju", {
                        idPartije: igra._id,
                        igraci: igraci,
                    });
                }
            }
        }
        catch (err) {
            socket.emit("greska", { poruka: err.message });
        }
    }));
});
server.listen(process.env.PORT || PORT, () => {
    console.log(`Osluskivanje na portu ${process.env.PORT || PORT}`);
});
