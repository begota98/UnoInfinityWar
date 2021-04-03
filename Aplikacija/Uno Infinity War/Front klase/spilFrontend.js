

var SpilFrontend = function (karte)
{
    this.karte = karte;

    
  this.renderujSpil=function(destination) 
  {
    let parent = destination;
    let section = document.createElement("section");
    section.className="card-list";
    parent.appendChild(section);
    this.karte.map((karta, index) => 
    {
      let kartaPom = new KartaFrontend(karta, index);
      kartaPom.renderujKartu(section);
    });
  }
}

