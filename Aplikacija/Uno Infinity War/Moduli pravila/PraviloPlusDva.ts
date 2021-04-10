import IPravilo from "./IPravilo";
import PronalazacPravila from "../Logika igre/pronalazacPravila";


class ProveriPlusDvaPravilo extends IPravilo
{
  _pronalazacPravila: PronalazacPravila;
  constructor(rule: PronalazacPravila)
  {
    super();
    this._pronalazacPravila=rule;
  }

  OdrediPravilo():number
  {
    if(this._pronalazacPravila.karta2.specijalna && (this._pronalazacPravila.karta2.boja != "black" && (this._pronalazacPravila.karta2.boja == this._pronalazacPravila.trenutnaBoja || (this._pronalazacPravila.karta1.specijalna && this._pronalazacPravila.karta1.vrednost == this._pronalazacPravila.karta2.vrednost && this._pronalazacPravila.karta1.boja != "black")) && this._pronalazacPravila.karta2.vrednost == 2))
      return 2;
    else
      return 0;
  }

}

var praviloPlusDva = async function (igra, pointerNaIgru)
{
    igra.igraci[igra.igracNaPotezu].poeni += 20;
    if (igra.igraci[igra.igracNaPotezu].poeni >= igra.poeniZaPobedu) 
    {
        await igra.save();
        return 7;
    }
    pointerNaIgru.sledeciPotez(igra);
    // +2
    pointerNaIgru.dodajKartu(igra,pointerNaIgru.spil.vuciKartu());
    pointerNaIgru.dodajKartu(igra, pointerNaIgru.spil.vuciKartu());
    await igra.save();
    return 2;
}

export {praviloPlusDva as praviloPlusDva, ProveriPlusDvaPravilo as ProveriPlusDvaPravilo}