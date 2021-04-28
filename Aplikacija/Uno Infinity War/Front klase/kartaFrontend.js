var KartaFrontend = function (karta, index) 
{
  
    this.karta = karta;
    this.index = index;

    this.odredjivanjeImenaFajla = function()
    {
    if (this.karta.specijalna && this.karta.boja != "black") 
    {
        this.imefajla = `${9 + this.karta.vrednost}_${this.karta.boja}.png`;
    } 
    else if (this.karta.specijalna) 
    {
      this.imefajla = `${this.karta.vrednost}_${this.karta.boja}.png`;
    } 
    else 
    {
      this.imefajla = `${this.karta.vrednost}_${this.karta.boja}.png`;
    }
    return this.imefajla;
    }
  
  
  this.renderujKartu=function(destination) 
  {
    let parent = destination;
    let article = document.createElement("article");
    article.className="card-container card"
    parent.appendChild(article);
    let img = document.createElement("img");
    article.appendChild(img);
    img.dataset.boja = this.karta.boja;
    img.dataset.vrednost = this.karta.vrednost;
    img.dataset.specijalna = this.karta.specijalna ? 1 : 0;
    img.dataset.index = this.index;
    this.odredjivanjeImenaFajla();
    img.className = "single-card";
    img.src = "Slike_spil/" + this.imefajla;
  }
}

