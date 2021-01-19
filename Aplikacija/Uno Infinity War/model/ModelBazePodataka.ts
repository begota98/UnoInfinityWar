import mongoose from "mongoose";

const Schema = mongoose.Schema;

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
});

const igracModel = mongoose.model("Igrac", igracSchema);
const kartaModel = mongoose.model("Karta", kartaSchema);
const chatModel = mongoose.model("Chat", chatSchema);
const korisnikModel = mongoose.model("Korisnik", korisnikSchema);
const igraModel = mongoose.model("Igra", igraSchema);
const odigranaKartaModel = mongoose.model("OdigranaKarta", odigranaKartaSchema);
export {
  igracModel,
  kartaModel,
  chatModel,
  korisnikModel,
  igraModel,
  odigranaKartaModel,
};
