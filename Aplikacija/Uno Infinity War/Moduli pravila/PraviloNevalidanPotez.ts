import IPravilo from "./IPravilo";
import PronalazacPravila from "../Logika igre/pronalazacPravila";


var praviloNevalidanPotez = async function (igra, pointerNaIgru)
{
    return 0;
}


class ProveriNevalidnostJedan extends IPravilo
{
  _pronalazacPravila: PronalazacPravila;
  constructor(pravilo: PronalazacPravila)
  {
    super();
    this._pronalazacPravila = pravilo;
  }

  OdrediPravilo():number
  {
    if(!this._pronalazacPravila.karta2.specijalna && !(this._pronalazacPravila.trenutnaBoja == this._pronalazacPravila.karta2.boja || (!this._pronalazacPravila.karta1.specijalna && this._pronalazacPravila.karta1.vrednost == this._pronalazacPravila.karta2.vrednost)))
      return 1;
    else
      return 0;
  }

}

class ProveriNevalidnostDva extends IPravilo
{
  mojePravilo: PronalazacPravila;
  constructor(pravilo: PronalazacPravila)
  {
    super();
    this.mojePravilo = pravilo;
  }

  OdrediPravilo():number
  {
    if(this.mojePravilo.karta2.specijalna && (this.mojePravilo.karta2.boja != "black" && this.mojePravilo.karta2.specijalna && this.mojePravilo.trenutnaBoja != this.mojePravilo.karta2.boja && this.mojePravilo.karta1.vrednost != this.mojePravilo.karta2.vrednost))
      return 1;
    else
      return 0;
  }

}

class ProveriNevalidnostTri extends IPravilo
{
  mojePravilo: PronalazacPravila;
  constructor(pravilo: PronalazacPravila)
  {
    super();
    this.mojePravilo = pravilo;
  }

  OdrediPravilo():number
  {
    if (this.mojePravilo.karta2.specijalna && this.mojePravilo.karta2.boja != "black" && !(this.mojePravilo.karta2.boja == this.mojePravilo.trenutnaBoja || (this.mojePravilo.karta1.specijalna && this.mojePravilo.karta1.vrednost == this.mojePravilo.karta2.vrednost && this.mojePravilo.karta1.boja != "black")))
      return 1;
    else
      return 0;
  }

}

export {praviloNevalidanPotez as praviloNevalidanPotez, ProveriNevalidnostJedan as ProveriNevalidnostJedan, ProveriNevalidnostDva as ProveriNevalidnostDva, ProveriNevalidnostTri as ProveriNevalidnostTri}