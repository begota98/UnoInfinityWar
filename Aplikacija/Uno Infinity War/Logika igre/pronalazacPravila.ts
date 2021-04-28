import Karta from './karta';
import IPravilo from '../Moduli pravila/IPravilo';
import { ProveriNevalidnostJedan , ProveriNevalidnostDva, ProveriNevalidnostTri} from '../Moduli pravila/PraviloNevalidanPotez';
import { ProveriNormalnuVrednost } from '../Moduli pravila/PraviloNormalnaVrednost';
import { ProveriPlusCetiriPravilo } from '../Moduli pravila/PraviloPlusCetiri';
import { ProveriWildBojuPravilo } from '../Moduli pravila/PraviloWildMysteryBoja';
import { ProveriPreskociPravilo } from '../Moduli pravila/PreskociPravilo';
import { ProveriPlusDvaPravilo } from '../Moduli pravila/PraviloPlusDva';
import { ProveriObrniPravilo } from '../Moduli pravila/PraviloObrni';

/**
 * 0 => nevalidan potez
 * 1 => normalna vrednost
 * 2 => +2
 * 3 => preskoci
 * 4 => okreni 
 * 5 => wild mystery boja
 * 6 => +4
 **/


 //rule pattern, na onsovu tekuceg stanja odredjuje sta se dalje treba primeniti
class PronalazacPravila {
  karta1: Karta;
  karta2: Karta;
  trenutnaBoja: string;
  errorPravila: Array<IPravilo> = new Array<IPravilo>();
  normalnaPravila: Array<IPravilo> = new Array<IPravilo>();

  constructor(karta1: Karta, karta2: Karta,trenutnaBoja:string) 
  {
    this.karta1 = karta1;
    this.karta2 = karta2;
    this.trenutnaBoja = trenutnaBoja;

    this.errorPravila.push(new ProveriNevalidnostJedan(this));
    this.errorPravila.push(new ProveriNevalidnostDva(this));
    this.errorPravila.push(new ProveriNevalidnostTri(this));


    this.normalnaPravila.push(new ProveriNormalnuVrednost(this));
    this.normalnaPravila.push(new ProveriPlusDvaPravilo(this));
    this.normalnaPravila.push(new ProveriPreskociPravilo(this));
    this.normalnaPravila.push(new ProveriObrniPravilo(this));
    this.normalnaPravila.push(new ProveriWildBojuPravilo(this));
    this.normalnaPravila.push(new ProveriPlusCetiriPravilo(this));
  }
  
  vratiPravilo() 
  {
    //prvo proveri da li je nastala greska
    let rezultatError: number
    for (let errPravilo of this.errorPravila) 
    {
      rezultatError=errPravilo.OdrediPravilo();
      if (rezultatError!=0)
      {
        return 0;
      }
    }

    //u suprotnom, prodje kroz ostala moguca pravila, i ako je neko zadovoljeno signalizira na dalje tu informaciju kako bi se preduzele dalje akcije
    let rezultatNormalno:number;
    for (let pravilo of this.normalnaPravila)
    {
      rezultatNormalno=pravilo.OdrediPravilo();
      if (rezultatNormalno!=0)
      {
        return rezultatNormalno;
      }
    }
    return 0;
  } 
  
}



export default PronalazacPravila;