import Igra from "./igra";
import { praviloNevalidanPotez } from "../Moduli pravila/PraviloNevalidanPotez";
import { praviloNormalnaVrednost } from "../Moduli pravila/PraviloNormalnaVrednost";
import { praviloPlusCetiri } from "../Moduli pravila/PraviloPlusCetiri";
import { praviloWildBoja } from "../Moduli pravila/PraviloWildMysteryBoja";
import { praviloPreskoci } from "../Moduli pravila/PreskociPravilo";
import { praviloPlusDva } from "../Moduli pravila/PraviloPlusDva";
import { praviloObrni } from "../Moduli pravila/PraviloObrni";

/**
 * 0 => invaild move
 * 1 => normal value on value move
 * 2 => +2
 * 3 => skip
 * 4 => reverse 
 * 5 => wild mystery color
 * 6 => +4
 */
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