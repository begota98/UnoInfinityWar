import Igra from "./igra";
import { praviloNevalidanPotez } from "../Moduli pravila/PraviloNevalidanPotez";
import { praviloNormalnaVrednost } from "../Moduli pravila/PraviloNormalnaVrednost";
import { praviloPlusCetiri } from "../Moduli pravila/PraviloPlusCetiri";
import { praviloWildBoja } from "../Moduli pravila/PraviloWildMysteryBoja";
import { praviloPreskoci } from "../Moduli pravila/PreskociPravilo";
import { praviloPlusDva } from "../Moduli pravila/PraviloPlusDva";
import { praviloObrni } from "../Moduli pravila/PraviloObrni";

/**
 * 0 => nevalidan potez
 * 1 => normalna vrednost (broj na broj)
 * 2 => +2
 * 3 => preskoci
 * 4 => okreni redosled 
 * 5 => promena boje
 * 6 => promena boje i plus 4
 */

//kontejner za algoritme koji se primenjuju u zavisnosti od detektovane akcije iz pronalazaca
class SelektorPravila
{
    funkcijskaPravila: Array<any>;
    constructor()
    {
        this.funkcijskaPravila = new Array();

        this.funkcijskaPravila.push(praviloNevalidanPotez);
        this.funkcijskaPravila.push(praviloNormalnaVrednost);
        this.funkcijskaPravila.push(praviloPlusDva);
        this.funkcijskaPravila.push(praviloPreskoci);
        this.funkcijskaPravila.push(praviloObrni);
        this.funkcijskaPravila.push(praviloWildBoja);
        this.funkcijskaPravila.push(praviloPlusCetiri);


    }
}


export default SelektorPravila;