"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.kartaModel = exports.igracModel = void 0;
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
var igracModel = mongoose_1.default.model("Igrac", igracSchema);
exports.igracModel = igracModel;
var kartaModel = mongoose_1.default.model("Karta", kartaSchema);
exports.kartaModel = kartaModel;
