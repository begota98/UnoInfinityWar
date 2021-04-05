import Karta from './karta';

class Igrac {
  karte: Array<Karta>;
  ime: string;
  index: number;
  constructor(name:string,index: number) 
  {
    this.karte = [];
    this.ime = name;
    this.index = index;
  }
  dodajKartu(card: Karta): void 
  {
    this.karte.push(card);
  }
  ukloniKartu(index: number): void
  {
    this.karte.splice(index, 1);
  }

}

export default Igrac;