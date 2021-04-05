import Karta from './karta';
import Spil from './spil';
import Igrac from './igrac';
import PronalazacPravila from './pronalazacPravila';
import mongoose from 'mongoose';
import SelektorPravila from './selektorPravila';
import {  igraModel } from '../Model/db-model';
class Igra {
   spil: Spil = new Spil();
   selektorPravila: SelektorPravila = new SelektorPravila();

  async kreirajIgru(igraId: mongoose.Types.ObjectId, igraci: Array<Igrac>) 
  {
    const brojIgraca = igraci.length;
    if (brojIgraca < 2) 
      throw new Error("Nemozete poceti partiju sa manje od 2 igraca!");
    const igra = await igraModel.findById(igraId);
    for (let i = 0; i < brojIgraca; i++)
    {
      // izvlacenje 7 karata za svakog igraca
      for (let j = 0; j < 7; j++)
      {
        let karta: Karta = this.spil.vuciKartu();
        igra.igraci[i].karte.push(karta);
      }
    }
    // inicijalizacija pocetne karte na stolu
    igra.trenutnaKarta = this.spil.vuciNeSpecijalnuKartu();
    igra.trenutnaBoja = igra.trenutnaKarta.boja;
    igra.brojIgraca = brojIgraca;
    igra.obrnutRedosled = false;
    igra.pocelaIgra = true;
    await igra.save();
    return igra;
  }
  sledeciPotez(igra) 
  {
    igra.igraci[igra.igracNaPotezu].izvucenihKarata = 0;
    igra.igraci[igra.igracNaPotezu].mozeDaZavrsi = false;
    
    if (igra.obrnutRedosled && igra.igracNaPotezu == 0) 
      igra.igracNaPotezu = igra.brojIgraca - 1;
    else 
    {
      if (igra.obrnutRedosled) 
        igra.igracNaPotezu--;
      else 
        igra.igracNaPotezu = (igra.igracNaPotezu + 1) % igra.brojIgraca;
    }
    igra.igraci[igra.igracNaPotezu].mozeDaZavrsi = false;

    
  }
  dodajKartu(igra,karta: Karta): void 
  {
    igra.igraci[igra.igracNaPotezu].karte.push(karta);
  }
  ukloniKartu(igra,index: number): void
  {
    igra.igraci[igra.igracNaPotezu].karte.splice(index, 1);
  }
  /**
   * -1 => nije vas potez
   * 0 => false
   * 1 => true
   * 2 => +2
   * 4 => +4
   * 3 => izaberi boju
   * 5 => preskoci
   * 6 => obrni
   * 7 => kraj igre
   */
  async odigraj(igraId: mongoose.Types.ObjectId, indexIgraca: Number, indexKarte: number, karta: Karta, idIgraca:string) 
  {
    const igra = await igraModel.findById(igraId);
    if (igra.igracNaPotezu != indexIgraca || igra.igraci[igra.igracNaPotezu].idIgraca != idIgraca) 
    {
      return -1;
    }
    igra.igraci[igra.igracNaPotezu].izvucenihKarata = 0;
    let pravilo: PronalazacPravila = new PronalazacPravila(igra.trenutnaKarta, karta,igra.trenutnaBoja);
    let brojPravila: number = pravilo.vratiPravilo();
    if (!brojPravila)
    { 
      return 0;
    }

    igra.igraci[igra.igracNaPotezu].mozeDaZavrsi = true;
    igra.trenutnaBoja = karta.boja;
    igra.trenutnaKarta = karta;
    this.ukloniKartu(igra,indexKarte);
    if (igra.igraci[igra.igracNaPotezu].karte.length == 0) 
    {
      await igra.save();
      return 7;
    }
    
    let izvrsilacPravila = this.selektorPravila.funkcijskaPravila[brojPravila];
    return izvrsilacPravila(igra,this);
    
  }

  async promeniTrenutnuBoju(igraId: mongoose.Types.ObjectId, boja: string, indexIgraca:number, idIgraca:string) 
  {
    const igra = await igraModel.findById(igraId);
    if (igra.igracNaPotezu != indexIgraca) return 0;
    if (igra.igraci[igra.igracNaPotezu].idIgraca != idIgraca) return 0;
    if (["red", "yellow", "blue", "green"].includes(boja)) {
      igra.trenutnaBoja = boja;
      igra.karte[igra.karte.length-1].bojaPozadine = boja;
      this.sledeciPotez(igra);
      await igra.save();
      return igra;
    }
    return 0;
  }

  async vuciKartu(igraId: mongoose.Types.ObjectId, indexIgraca: number, idIgraca: string) 
  {
    const igra = await igraModel.findById(igraId);
    if (!igra) 
      return 0;
    if (igra.igracNaPotezu != indexIgraca || igra.igraci[indexIgraca].izvucenihKarata >= 2 || igra.igraci[indexIgraca].idIgraca != idIgraca) 
      return 0;
    igra.igraci[indexIgraca].karte.push(this.spil.vuciKartu());
    igra.igraci[indexIgraca].izvucenihKarata++;
    if(igra.igraci[indexIgraca].izvucenihKarata == 2) 
      igra.igraci[indexIgraca].mozeDaZavrsi = true;
    await igra.save();
    return 1;    
  }
  async revans(igra) {
    const brojIgraca = igra.igraci.length;
    if (brojIgraca < 2) 
      throw new Error("Nemozete poceti partiju sa manje od 2 igraca!");
    for (let i = 0; i < brojIgraca; i++)
    {
      igra.igraci[i].karte = [];
      igra.igraci[i].izvucenihKarata = 0;
      igra.igraci[i].mozeDaZavrsi = false;
      igra.igraci[i].score = 0;

      // izvlacenje 7 karata za svakog igraca
      for (let j = 0; j < 7; j++)
      {
        let karta: Karta = this.spil.vuciKartu();
        igra.igraci[i].karte.push(karta);
      }
    }
    // inicijalizacija pocetne karte na stolu
    igra.trenutnaKarta = this.spil.vuciNeSpecijalnuKartu();
    igra.trenutnaBoja = igra.trenutnaKarta.boja;
    igra.pocelaIgra = true;
    igra.brojIgraca = igra.igraci.length;
    igra.obrnutRedosled = false;
    igra.igracNaPotezu = 0;
    await igra.save();
    return igra;
  }
}

export default Igra;