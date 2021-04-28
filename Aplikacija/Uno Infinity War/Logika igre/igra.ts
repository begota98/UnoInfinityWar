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

    //kada host odabere da pokrene igra, zovemo funkciju kreirajIgru koja inicijalizuje potrebne stavke, i cuva sve u bazu
  async kreirajIgru(igraId: mongoose.Types.ObjectId, igraci: Array<Igrac>) 
  {
    const brojIgraca = igraci.length;
    if (brojIgraca < 2) 
      throw new Error("Ne mozete poceti partiju sa manje od 2 igraca!");
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

  //kada jedan igrac zavrsi potez, zove se ova funkcija
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
    //ne moze da zavrsi slededeci igrac dok ne odigra kartu ili izvuce maximum dve karte pa preskoci potez
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


   //kada korisnik klikne na neku kartu da odigra potez
  async odigraj(igraId: mongoose.Types.ObjectId, indexIgraca: Number, indexKarte: number, karta: Karta, idIgraca:string) 
  {
    const igra = await igraModel.findById(igraId);
    if (igra.igracNaPotezu != indexIgraca || igra.igraci[igra.igracNaPotezu].idIgraca != idIgraca) 
    {
      return -1;
    }
    igra.igraci[igra.igracNaPotezu].izvucenihKarata = 0;

    //on zakljucuje koje pravilo ce biti primenjeno, na osnvu karte na tavli, odigrane karte i boje koja se zahteva
    let pravilo: PronalazacPravila = new PronalazacPravila(igra.trenutnaKarta, karta,igra.trenutnaBoja);

    //detektovano pravilo koje se primenjuje
    let brojPravila: number = pravilo.vratiPravilo();
    
    //pogresan potez
    if (!brojPravila)
    { 
      return 0;
    }

    igra.igraci[igra.igracNaPotezu].mozeDaZavrsi = true;
    igra.trenutnaBoja = karta.boja;
    igra.trenutnaKarta = karta;
    this.ukloniKartu(igra,indexKarte);

    //posto nema vise karata u ruci, kraj igre
    if (igra.igraci[igra.igracNaPotezu].karte.length == 0) 
    {
      await igra.save();
      return 7;
    }
    
    //ako je potez validan, a nije se doslo do kraja igre, primenjuje se detektovano pravilo, u izvrsiocu pravila
    let izvrsilacPravila = this.selektorPravila.funkcijskaPravila[brojPravila];

    //izvrsilac javlja serveru sta se desilo, kako bi server mogao da obavesti igrace
    return izvrsilacPravila(igra,this);
    
  }

  //zove se kada korisnik odabere novu boju
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

  //kada se vuce nova karta zbog neke specijalne karte ili korisnik sam zatrazi da izvuce novu kartu
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
  
}

export default Igra;