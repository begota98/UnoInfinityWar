import IPravilo from "./IPravilo";
import PronalazacPravila from "../Logika igre/pronalazacPravila";


class ProveriPlusCetiriPravilo extends IPravilo
{
  _pronalazacPravila: PronalazacPravila;
  constructor(pravilo: PronalazacPravila)
  {
    super();
    this._pronalazacPravila=pravilo;
  }

  OdrediPravilo():number
  {
    if(this._pronalazacPravila.karta2.specijalna && (this._pronalazacPravila.karta2.boja == "black" && this._pronalazacPravila.karta2.vrednost == 1))
      return 6;
    else
      return 0;
  }

}

var praviloPlusCetiri = async function (igra, pointerNaIgru)
{
  igra.igraci[igra.igracNaPotezu].poeni += 50;
  if (igra.igraci[igra.igracNaPotezu].poeni >= igra.poeniZaPobedu) 
  {
      await igra.save();
      return 7;
  }
  pointerNaIgru.sledeciPotez(igra);
  // +4 
  pointerNaIgru.dodajKartu(igra,pointerNaIgru.spil.vuciKartu());
  pointerNaIgru.dodajKartu(igra,pointerNaIgru.spil.vuciKartu());
  pointerNaIgru.dodajKartu(igra,pointerNaIgru.spil.vuciKartu());
  pointerNaIgru.dodajKartu(igra, pointerNaIgru.spil.vuciKartu());
  igra.obrnutRedosled = !igra.obrnutRedosled;
  pointerNaIgru.sledeciPotez(igra);
  igra.obrnutRedosled = !igra.obrnutRedosled;
  await igra.save();
  return 4;
}

export {praviloPlusCetiri as praviloPlusCetiri, ProveriPlusCetiriPravilo as ProveriPlusCetiriPravilo}