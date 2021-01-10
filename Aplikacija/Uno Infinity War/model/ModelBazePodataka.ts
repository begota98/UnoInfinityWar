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

const igracModel = mongoose.model("Igrac", igracSchema);
const kartaModel = mongoose.model("Karta", kartaSchema);

export { igracModel, kartaModel };
