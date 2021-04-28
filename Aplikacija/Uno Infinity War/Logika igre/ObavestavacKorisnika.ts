import { obavestiPlusDva } from "../Moduli pravila/PraviloPlusDva";
import { obavestiWildBoja } from "../Moduli pravila/PraviloWildMysteryBoja";
import { obavestiPlusCetiri } from "../Moduli pravila/PraviloPlusCetiri";
import { obavestiPreskoci } from "../Moduli pravila/PreskociPravilo";
import { obavestiObrni } from "../Moduli pravila/PraviloObrni";
import { obavestiZavrsetak } from "../Moduli pravila/ObavestiZavrsetak";

class ObavestavacKorisnika
{
    nizObavestavaca: Array<any> = new Array<any>();

    constructor()
    {
        this.nizObavestavaca.push(obavestiPlusDva);
        this.nizObavestavaca.push(obavestiWildBoja);
        this.nizObavestavaca.push(obavestiPlusCetiri);
        this.nizObavestavaca.push(obavestiPreskoci);
        this.nizObavestavaca.push(obavestiObrni);
        this.nizObavestavaca.push(obavestiZavrsetak);

    }

    obavesti (rezultat,io, igra, podaci, igraKontroler)
    {
        this.nizObavestavaca[rezultat-2](rezultat,io,igra,podaci,igraKontroler);
    }
}

export {ObavestavacKorisnika as ObavestavacKorisnika}