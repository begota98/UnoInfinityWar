import IPravilo from "./IPravilo";
import PronalazacPravila from "../Logika igre/pronalazacPravila";


class ProveriObrniPravilo extends IPravilo
{
  _pronalazacPravila: PronalazacPravila;
  constructor(pravilo: PronalazacPravila)
  {
    super();
    this._pronalazacPravila=pravilo;
  }

  OdrediPravilo():number
  {
    if(this._pronalazacPravila.karta2.specijalna && (this._pronalazacPravila.karta2.boja != "black" && (this._pronalazacPravila.karta2.boja == this._pronalazacPravila.trenutnaBoja || (this._pronalazacPravila.karta1.specijalna && this._pronalazacPravila.karta1.vrednost == this._pronalazacPravila.karta2.vrednost && this._pronalazacPravila.karta1.boja != "black")) && (this._pronalazacPravila.karta2.vrednost != 1 && this._pronalazacPravila.karta2.vrednost != 2)))
      return 4;
    else
      return 0;
  }

}


var praviloObrni = async function (igra, pointerNaIgru)
{
    igra.igraci[igra.igracNaPotezu].poeni += 20;
    if (igra.igraci[igra.igracNaPotezu].poeni >= igra.poeniZaPobedu) 
    {
        await igra.save();
        return 7;
    }
    // obrni
    // radi kao preskoci za 2 igraca 
    if (igra.brojIgraca > 2) 
    {
        igra.obrnutRedosled = !igra.obrnutRedosled;
        pointerNaIgru.sledeciPotez(igra);
    } 
    await igra.save();
    return 6;
}

var obavestiObrni = async function (rezultat,io, igra, podaci, igraKontroler)
{
  io.sockets.emit("promenaSmeraPartije", {
    idPartije: podaci.idPartije,
  });
}


export {praviloObrni as praviloObrni, ProveriObrniPravilo as ProveriObrniPravilo, obavestiObrni as obavestiObrni}