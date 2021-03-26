"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.odigranaKartaModel = exports.igraModel = exports.korisnikModel = exports.chatModel = exports.kartaModel = exports.igracModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const kartaSchema = new Schema({
    vrednost: Number,
    boja: String,
    specijalna: Boolean,
});
const igracSchema = new Schema({
    karte: [kartaSchema],
    ime: String,
    indeks: Number,
    idIgraca: String,
    izvucenihKarata: Number,
    mozeDaZavrsi: Boolean,
    soketId: String,
    poeni: Number,
});
const chatSchema = new Schema({
    igracIme: String,
    poruka: String,
});
const korisnikSchema = new Schema({
    prethodneIgre: [{ id: String }],
    _id: String,
});
const odigranaKartaSchema = new Schema({
    karta: kartaSchema,
    korisnik: korisnikSchema,
    imeUPartiji: String,
    bojaPozadine: String,
});
const igraSchema = new Schema({
    igraci: [igracSchema],
    igracNaPotezu: Number,
    trenutnaKarta: kartaSchema,
    trenutnaBoja: String,
    obrnutRedosled: Boolean,
    pocelaIgra: Boolean,
    zavrsenaIgra: Boolean,
    brojIgraca: Number,
    chat: [chatSchema],
    karte: [odigranaKartaSchema],
    datum: String,
    poeniZaPobedu: Number,
});
const igracModel = mongoose_1.default.model("Igrac", igracSchema);
exports.igracModel = igracModel;
const kartaModel = mongoose_1.default.model("Karta", kartaSchema);
exports.kartaModel = kartaModel;
const chatModel = mongoose_1.default.model("Chat", chatSchema);
exports.chatModel = chatModel;
const korisnikModel = mongoose_1.default.model("Korisnik", korisnikSchema);
exports.korisnikModel = korisnikModel;
const igraModel = mongoose_1.default.model("Igra", igraSchema);
exports.igraModel = igraModel;
const odigranaKartaModel = mongoose_1.default.model("OdigranaKarta", odigranaKartaSchema);
exports.odigranaKartaModel = odigranaKartaModel;
