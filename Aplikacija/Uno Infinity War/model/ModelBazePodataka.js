"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.odigranaKartaModel = exports.igraModel = exports.korisnikModel = exports.chatModel = exports.kartaModel = exports.igracModel = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
var kartaSchema = new Schema({
    vrednost: Number,
    boja: String,
    specijalna: Boolean,
});
var igracSchema = new Schema({
    karte: [kartaSchema],
    ime: String,
    indeks: Number,
    idIgraca: String,
    izvucenihKarata: Number,
    mozeDaZavrsi: Boolean,
    soketId: String,
    poeni: Number,
});
var chatSchema = new Schema({
    igracIme: String, poruka: String,
});
var korisnikSchema = new Schema({
    prethodneIgre: [{ id: String }], _id: String
});
var odigranaKartaSchema = new Schema({
    karta: kartaSchema,
    korisnik: korisnikSchema,
});
var igraSchema = new Schema({
    igraci: [igracSchema],
    igracNaPotezu: Number,
    trenutnaKarta: kartaSchema,
    trenutnaBoja: String,
    obrnutRedosled: Boolean,
    pocalaIgra: Boolean,
    zavrsenaIgra: Boolean,
    brojIgraca: Number,
    chat: [chatSchema],
    karte: [odigranaKartaSchema],
    datum: String,
});
var igracModel = mongoose_1.default.model("Igrac", igracSchema);
exports.igracModel = igracModel;
var kartaModel = mongoose_1.default.model("Karta", kartaSchema);
exports.kartaModel = kartaModel;
var chatModel = mongoose_1.default.model("Chat", chatSchema);
exports.chatModel = chatModel;
var korisnikModel = mongoose_1.default.model("Korisnik", korisnikSchema);
exports.korisnikModel = korisnikModel;
var igraModel = mongoose_1.default.model("Igra", igraSchema);
exports.igraModel = igraModel;
var odigranaKartaModel = mongoose_1.default.model("OdigranaKarta", odigranaKartaSchema);
exports.odigranaKartaModel = odigranaKartaModel;
