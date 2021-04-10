import IPravilo from "./IPravilo";
import PronalazacPravila from "../Logika igre/pronalazacPravila";


class ProveriWildBojuPravilo extends IPravilo
{
  _pronalazacPravila: PronalazacPravila;
  constructor(rule: PronalazacPravila)
  {
    super();
    this._pronalazacPravila=rule;
  }

  OdrediPravilo():number
  {
    if(this._pronalazacPravila.karta2.specijalna && (this._pronalazacPravila.karta2.boja == "black" && this._pronalazacPravila.karta2.vrednost != 1))
      return 5;
    else
      return 0;
  }

}


var praviloWildBoja = async function (igra, pointerNaIgru)
{
    igra.igraci[igra.igracNaPotezu].poeni += 50;
    if (igra.igraci[igra.igracNaPotezu].poeni >= igra.poeniZaPobedu) 
    {
        await igra.save();
        return 7;
    }
    await igra.save();
    return 3;
}


export {praviloWildBoja as praviloWildBoja, ProveriWildBojuPravilo as ProveriWildBojuPravilo}