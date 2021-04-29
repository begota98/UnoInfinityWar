

var TablaFrontend = function (trenutnaKarta)
{
  
    this.trenutnaKarta = trenutnaKarta;
    
  

  this.renderujTablu = function(destination) 
  {
    let parent = destination;
    let div = document.createElement("div");
    div.className = " board-card ";
    
    parent.appendChild(div);
    let karta = new KartaFrontend(this.trenutnaKarta,0);
    parent = div;
    
    let img = document.createElement("img");
    parent.appendChild(img);
    console.log(this.trenutnaKarta);
    img.dataset.color = this.trenutnaKarta.boja;
    img.dataset.value = this.trenutnaKarta.vrednost;
    img.dataset.isSpecial = this.trenutnaKarta.specijalna ? 1 : 0;
    img.dataset.index = this.index;
    karta.odredjivanjeImenaFajla();
    img.className = "card-deck";
    img.src = "Slike_spil/" + karta.imefajla;
   
  }
}


