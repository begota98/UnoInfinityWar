import mongoose from "mongoose";

const Schema: any = mongoose.Schema;

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
  poeniZaPobedu:Number,
  
});

const igracModel = mongoose.model<any>("Igrac", igracSchema);
const kartaModel = mongoose.model<any>("Karta", kartaSchema);
const chatModel = mongoose.model<any>("Chat", chatSchema);
const korisnikModel = mongoose.model<any>("Korisnik", korisnikSchema);
const igraModel = mongoose.model<any>("Igra", igraSchema);
const odigranaKartaModel = mongoose.model<any>(
  "OdigranaKarta",
  odigranaKartaSchema
);
export {
  igracModel,
  kartaModel,
  chatModel,
  korisnikModel,
  igraModel,
  odigranaKartaModel,
};
