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

var obavestiPlusCetiri = async function (rezultat,io, igra, podaci, igraKontroler)
{
  io.sockets.emit("odaberiteBoju", {
    idPartije: podaci.idPartije,
    indexIgraca: podaci.indexIgraca,
    idIgraca: igra.igraci[podaci.indexIgraca].idIgraca,
  });
  igraKontroler.sledeciPotez(igra);
  io.to(igra.igraci[igra.igracNaPotezu].soketId).emit("vuciCetiri", {
    idPartije: podaci.idPartije,
  });
  igra.obrnutRedosled = !igra.obrnutRedosled;
  igraKontroler.sledeciPotez(igra);
  igra.obrnutRedosled = !igra.obrnutRedosled;
}




export {praviloPlusCetiri as praviloPlusCetiri, ProveriPlusCetiriPravilo as ProveriPlusCetiriPravilo, obavestiPlusCetiri as obavestiPlusCetiri}