import IPravilo from "./IPravilo";
import PronalazacPravila from "../Logika igre/pronalazacPravila";


class ProveriPreskociPravilo extends IPravilo
{
  _pronalazacPravila: PronalazacPravila;
  constructor(rule: PronalazacPravila)
  {
    super();
    this._pronalazacPravila=rule;
  }

  OdrediPravilo():number
  {
    if(this._pronalazacPravila.karta2.specijalna && (this._pronalazacPravila.karta2.boja != "black" && (this._pronalazacPravila.karta2.boja == this._pronalazacPravila.trenutnaBoja || (this._pronalazacPravila.karta1.specijalna && this._pronalazacPravila.karta1.vrednost == this._pronalazacPravila.karta2.vrednost && this._pronalazacPravila.karta1.boja != "black")) && this._pronalazacPravila.karta2.vrednost == 1))
      return 3;
    else
      return 0;
  }

}


var praviloPreskoci = async function (igra, pointerNaIgru)
{
    igra.igraci[igra.igracNaPotezu].poeni += 20;
    if (igra.igraci[igra.igracNaPotezu].poeni >= igra.poeniZaPobedu) 
    {
        await igra.save();
        return 7;
    }
    // preskoci igraca
    pointerNaIgru.sledeciPotez(igra);
    pointerNaIgru.sledeciPotez(igra);

    await igra.save();
    return 5;
}

var obavestiPreskoci = async function (rezultat,io, igra, podaci, igraKontroler)
{
  io.sockets.emit("preskakanjeIgraca", {
    idPartije: podaci.idPartije,
  });
}

export {praviloPreskoci as praviloPreskoci, ProveriPreskociPravilo as ProveriPreskociPravilo, obavestiPreskoci as obavestiPreskoci}