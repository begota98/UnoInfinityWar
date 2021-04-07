import IPravilo from "./IPravilo";
import PronalazacPravila from "../Logika igre/pronalazacPravila";


class ProveriNormalnuVrednost extends IPravilo
{
  _pronalazacPravlia: PronalazacPravila;
  constructor(pravilo: PronalazacPravila)
  {
    super();
    this._pronalazacPravlia=pravilo;
  }

  OdrediPravilo():number
  {
    if(!this._pronalazacPravlia.karta2.specijalna && (this._pronalazacPravlia.trenutnaBoja == this._pronalazacPravlia.karta2.boja || (!this._pronalazacPravlia.karta1.specijalna && this._pronalazacPravlia.karta1.vrednost == this._pronalazacPravlia.karta2.vrednost)))
	    return 1;
    else
	    return 0;
  }

}

var praviloNormalnaVrednost = async function(igra, pointerNaIgru)
        {
            igra.igraci[igra.igracNaPotezu].poeni += 20;
            if (igra.igraci[igra.igracNaPotezu].poeni >= igra.poeniZaPobedu) 
            {
                await igra.save();
                return 7;
            }
            pointerNaIgru.sledeciPotez(igra);
            await igra.save();
            return 1;
        }

export {praviloNormalnaVrednost as praviloNormalnaVrednost, ProveriNormalnuVrednost as ProveriNormalnuVrednost}