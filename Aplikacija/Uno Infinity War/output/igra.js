window.addEventListener("DOMContentLoaded", () => 
{
  const firebaseConfig = 
  {
    apiKey: "AIzaSyBaHMwV8NKaRiousx25zJ4io2fnsRrpASM",
    authDomain: "unoinfinitywar.firebaseapp.com",
    databaseURL: "https://unoinfinitywar.firebaseio.com",
    projectId: "unoinfinitywar",
    storageBucket: "unoinfinitywar.appspot.com",
    messagingSenderId: "739172238526",
    appId: "1:739172238526:web:1e80da63d9fccf2c6d8aef",
    measurementId: "G-0BJNWCHRW5",
  };

  firebase.initializeApp(firebaseConfig);

  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);

  firebase.auth().onAuthStateChanged(function (korisnik) 
  {
      if (korisnik) 
      {
          socket.emit("ulogovanSam", 
          {
              id: korisnik.uid,
          });
          let sirina = innerWidth;
          let idPartije = undefined;
          let igraci = [];
          let karte = [];
          let imeIgraca = undefined;
          let indexIgraca = undefined;
          let da_li_je_host = undefined;
          let idIgraca = "";
          let PoeniZaPobedu=300;

          //funkcije vezane za funkcionalnost chata
          Message = function (arg) 
          {
              this.text = arg.text, this.strana_poruke = arg.strana_poruke;
              this.idIgraca=arg.idIgraca, this.idPartije=arg.idPartije, this.imeIgraca=arg.imeIgraca;
              this.draw = function (_this) 
              {
                  return function () 
                  {
                      var $poruka;
                      $poruka = $($('.message_template').clone().html());
                      $poruka.addClass(_this.strana_poruke).find('.text').html(_this.text);
                      $('.messages').append($poruka);
                      return setTimeout(function () 
                      {
                          return $poruka.addClass('appeared');
                      }, 0);
                  };
              }(this);
              this.persiste = function () 
              {
                  socket.emit("chatMessage", 
                  {
                      idPartije: this.idPartije,
                      imeIgraca: this.imeIgraca,
                      tekstPoruke: this.text,
                      idIgraca: this.idIgraca,
                  });
              }
              return this;
          };
          $(function () 
          {
              var vratiTekstPoruke, strana_poruke, posaljiPoruku;
              strana_poruke = 'right';
              vratiTekstPoruke = function () 
              {
                  var $poruka_input;
                  $poruka_input = $('.message_input');
                  return $poruka_input.val();
              };
              posaljiPoruku = function (text) 
              {
                  var $poruke, poruka;
                  if (text.trim() === '') 
                  {
                      return;
                  }
                  $('.message_input').val('');
                  $poruke = $('.messages');
                  strana_poruke = strana_poruke === 'left' ? 'right' : 'left';
                  poruka = new Message(
                  {
                      text: text,
                      strana_poruke: strana_poruke,
                      idPartije:idPartije,
                      imeIgraca:imeIgraca,
                      idIgraca:idIgraca,
                  });
                  poruka.persiste();
                  return $("messages");
              };

              $('.send_message').click(function (e) 
              {
                  return posaljiPoruku(vratiTekstPoruke());
              });
              $('.message_input').keyup(function (e) 
              {
                  if (e.which === 13) 
                  {
                      return posaljiPoruku(vratiTekstPoruke());
                  }
              });
          });

          let bodyElement = document.querySelector("body");
          let nizBoja = 
          {
              red: "#ff5555",
              yellow: "#ffaa00",
              green: "#55aa55",
              blue: "#5555fd",
          };
          idIgraca = korisnik.uid;
          
          let izaberiBojuDugme = document.querySelector("#choosColorBtn");
          var pocetakPartijeDugme = document.getElementById("buttonMain");

          //event nakon pokusaja kreiranja ili join-ovanja igre
          pocetakPartijeDugme.addEventListener("click", function()
          {
              let unesenoIme = document.querySelector("#nameInput").value;
              if (!unesenoIme) 
              {
                unesenoIme = "uno-igrac";
              }
              imeIgraca = unesenoIme;
              
              PoeniZaPobedu=document.getElementById("pointsInput").value;

              if (!PoeniZaPobedu)
              {
                PoeniZaPobedu=300;
              }
              
              da_li_je_host = document.querySelector('input[name="flexRadioDefault"]:checked').value;

              //ovo se ivrsava u slucaju da smo odabrali da budemo host
              if (da_li_je_host==1)
              {
                  //document.getElementById("createDivMain").innerHTML="";
                  document.getElementById("createDivMain").remove();
                  //?????????
                  document.getElementById("containerGameID").style.display="flex";
                  //potencijalno da stavimo ako se ne kreira gejm, tj ako je neuspeo join da se ne brise ona forma gde se unosi id za jon gejma, nego tek kad se primi potvrdan emit
                  //saljemo podatke serveru koji su vezani za igru
                  socket.emit("createGame", 
                  {
                      ime: imeIgraca,
                      indexIgraca: 0,
                      idIgraca: idIgraca,
                      PoeniZaPobedu: PoeniZaPobedu,
                  });
                  $("#gameIdText").text("kreiranje igre....");

                  //server nam vraca id igre koji mozemo da delimo sa drugima
                  socket.on("kreiranaJeIgraID", (podaci) => 
                  {
                      if (podaci.idIgraca != idIgraca || idPartije != undefined)
                      { 
                          return;
                      }
                      idPartije = podaci.idPartije;
                      $("#gameIdText").text(podaci.idPartije);
                      indexIgraca = 0;
                  });
                
                  let listaIgracaZaPrikaz = document.querySelector("#queue");
                  if (listaIgracaZaPrikaz.innerHTML.trim() == "") 
                  {
                      let listaIgraca = document.createElement("li");
                      listaIgraca.classList.add("list-group-item");
                      listaIgraca.innerText = imeIgraca + " (You)";
                      listaIgracaZaPrikaz.appendChild(listaIgraca);
                  }

                  let dugmeZaStartovanje = document.createElement("button");
                  dugmeZaStartovanje.id = "startGameBtn";
                  dugmeZaStartovanje.innerText = "Start game";
                  dugmeZaStartovanje.className = "btn btn-warning btnStartGame";

                  //event da startujemo igru, nakon starta nije moguc dolazak novih igraca
                  dugmeZaStartovanje.addEventListener("click", () => 
                  {
                      socket.emit("pokreniIgru", 
                      {
                        idPartije: idPartije,
                      });
                  });

                  if (document.querySelector("#startGameDiv").innerHTML.trim() == "")
                  {
                      document.querySelector("#startGameDiv").appendChild(dugmeZaStartovanje);
                  }

                  let dugmeZaPrikazIDPartije = document.createElement("a");
                  dugmeZaPrikazIDPartije.className ="btn btn-warning btnShowId";
                  dugmeZaPrikazIDPartije.innerText = "gameId";

                  //dugme kojim prikazujemo id igre za deljenje
                  dugmeZaPrikazIDPartije.addEventListener("click", () => 
                  {
                      swal.fire(
                      {
                          confirmButtonColor: "#2c3e50",
                          icon: "info",
                          title: "ID Vase partije je : " + idPartije,
                          showConfirmButton: true,
                      });
                  });
                  document.body.appendChild(dugmeZaPrikazIDPartije);

              }//ovo se izvrsava u slucaju da smo odabrali opciju Join
              else 
              {
                  idPartije = document.querySelector("#codeID").value;

                  if (!idPartije) 
                  {
                      swal.fire(
                      {
                          confirmButtonColor: "#2c3e50",
                          icon: "error",
                          title: "Molimo unesite tacan ID partije",
                          showConfirmButton: false,
                          timer: 500,
                      });
                  }
                  else
                  {
                      document.getElementById("createDivMain").innerHTML="";
                      document.getElementById("createDivMain").remove();
                      document.getElementById("containerGameID").style.display="flex";
                      //saljemo event kojim obavestavamo ostale ucesnike igre da se i mi pridruzujemo
                      socket.emit("pridruziSePartiji", 
                      {
                          idPartije: idPartije,
                          imeIgraca: imeIgraca,
                          idIgraca: idIgraca,
                      });
                      //event koji se izvrsava kad nam server potvrdi da smo se uspesno pridruzili
                      socket.on("uspesnoPridruzivanjeIgri", (podaci) => 
                      {
                          if (podaci.idIgraca != idIgraca) 
                          {   
                              return;
                          }
                          //????
                          //showQueue = true;
                          indexIgraca = podaci.indexIgraca;
                          let dugmeZaPrikazIDPartije = document.createElement("a");
                          dugmeZaPrikazIDPartije.className = "btn btn-warning btnShowId";
                          dugmeZaPrikazIDPartije.innerText = "gameId";
                          dugmeZaPrikazIDPartije.addEventListener("click", () => 
                          {
                              swal.fire(
                              {
                                  confirmButtonColor: "#2c3e50",
                                  icon: "info",
                                  title: "ID Vase partije je : " + idPartije,
                                  showConfirmButton: true,
                              });
                          });
                          document.body.appendChild(dugmeZaPrikazIDPartije);
                      });
                  } 
              }

              //ubacujemo dugme za prikaz chata
              let dugmeZaChat = document.createElement("a");
              dugmeZaChat.className = "btn btn-warning btnShowChat";
              dugmeZaChat.innerText = "Chat";
              document.body.appendChild(dugmeZaChat);
              dugmeZaChat.addEventListener("click", function() 
              {
                  if ($("#chatDiv").is(":visible"))
                  {
                      $("#chatDiv").hide();
                      dugmeZaChat.style.left = '1%'; 
                      //$('#divCollectionId').style.left='1%';
                  }
                  else
                  {
                      $("#chatDiv").show();
                      dugmeZaChat.style.left = '22%'; 
                     // $('#divCollectionId').style.left='22%';
                  }

              });

          })

          
          //ovde krecu eventi, treba da se prebaci u poseban fajl
          //event koji se dogodi nakon startovanja partije
          socket.on("kreiranaJeIgra", (podaci) => 
          {
              if (idPartije != podaci.idPartije) 
              {
                  return;
              }
              swal.close();
              document.querySelector("#queue").innerHTML = "";
              document.querySelector("#queue").className = "";
              document.querySelector("#queue").style.display = "none";
              if (document.querySelector("#startGameBtn"))
              {
                  document.querySelector("#startGameBtn").remove();
              }
              document.getElementById("containerGameID").style.display="flex";
              igraci = [];
              for (let igrac of podaci.igraci) 
              {
                igraci.push(
                  {
                        imeIgraca: igrac.ime,
                        indexIgraca: igrac.indeks,
                        skor: igrac.poeni,
                        izvucenihKarata: igrac.izvucenihKarata,
                  });
              }
              document.querySelector(".players ul").innerHTML="";
              document.querySelector(".board").innerHTML="";
              //ovo potencijalno da se obrise, nema potrebe da proveravamo sirinu
              if (sirina <= 600) 
              {
                  let openPlayersBtn = document.querySelector(".open-players");
                  openPlayersBtn.style.display = "block";
                  openPlayersBtn.addEventListener("click", () => 
                  {
                      let igraci = document.querySelector(".players ul");
                      igraci.style.display = "block";
                      setTimeout(() => {
                        igraci.style.display = "none";
                      }, 1500);
                  });
              }
              window.addEventListener("resize", () => 
              {
                  sirina = innerWidth;
                  let openPlayersBtn = document.querySelector(".open-players");
                  if (sirina <= 600) 
                  {
                      document.querySelector(".players ul").style.display = "none";
                      openPlayersBtn.style.display = "block";
                      openPlayersBtn.addEventListener("click", () => 
                      {
                          let igraci = document.querySelector(".players ul");
                          igraci.style.display = "block";
                          setTimeout(() => 
                          {
                            igraci.style.display = "none";
                          }, 1500);
                      });
                  } 
                  else 
                  {
                      openPlayersBtn.style.display = "none";
                      document.querySelector(".players ul").style.display = "block";
                  }
              });

              let igraciZaPrikaz = new IgraciFrontend(igraci, indexIgraca, podaci.igracaNaPotezu);
              igraciZaPrikaz.renderujIgrace(document.querySelector(".players ul"));
            
              let dugmiciZaKickovanje = document.querySelectorAll(".btnKick");
              for (let dugme of dugmiciZaKickovanje) 
              {
                  dugme.addEventListener("click", (e) => 
                  {
                      if(Number(dugme.dataset.index)!=0)
                        socket.emit("kickujIgraca", 
                        {
                            idIgraca: idIgraca,
                            idPartije: idPartije,
                            indexIgraca: Number(dugme.dataset.index),
                        });
                  });
              }

              let kartaNaTabliPrikaz = new TablaFrontend(podaci.trenutnaKarta, "");
              kartaNaTabliPrikaz.renderujTablu(document.querySelector(".board"));
              

              bodyElement.style.backgroundColor = nizBoja[podaci.trenutnaBoja];
              let dugmeVuciKartu = document.createElement("button");
              dugmeVuciKartu.className = "btn btn-info gameBtn";
              dugmeVuciKartu.innerText = "Vuci kartu";
              let dugmeZavrsiPotez = document.createElement("button");
              dugmeZavrsiPotez.className = "btn btn-info gameBtn";
              dugmeZavrsiPotez.innerText = "Zavrsi potez";

              dugmeVuciKartu.addEventListener("click", () => 
              {
                  socket.emit("vuciKartu", 
                  {
                      idPartije: idPartije,
                      idIgraca: idIgraca,
                      indexIgraca: indexIgraca,
                  });
              });

              dugmeZavrsiPotez.addEventListener("click", () => 
              {
                  socket.emit("zavrsiPotez", 
                  {
                      idPartije: idPartije,
                      idIgraca: idIgraca,
                      indexIgraca: indexIgraca,
                  });
              });
              var pom = document.getElementById('btnEndAndDraw');
              pom.appendChild(dugmeVuciKartu);
              pom.appendChild(dugmeZavrsiPotez);
          });

          //kad se azurira igrica nakon poteza
          socket.on("azuriranaPartija", (podaci) => 
          {
              if (idPartije != podaci.idPartije) 
              {
                  return;
              }
              if (indexIgraca == podaci.trenutniIgracNaPotezu && !podaci.kartaJeIzvucena) 
              {
                  swal.fire(
                  {
                      confirmButtonColor: "#2c3e50",
                      icon: "info",
                      title: "Vi ste na potezu",
                      timer: 500,

                      showConfirmButton: false,
                  });
              }
              document.querySelector(".players ul").innerHTML="";
              document.querySelector(".board").innerHTML="";
              document.querySelector("#queue").innerHTML="";

              
              //ovaj animate treba isto da se izbrise ja mislim
              let animated = "";
              if (!podaci.kartaJeIzvucena) 
              {
                  animated = "animate__animated animate__bounce";
              }
              igraci = [];
              for (let igrac of podaci.igraci) 
              {
                igraci.push(
                  {
                      imeIgraca: igrac.ime,
                      indexIgraca: igrac.indeks,
                      skor: igrac.poeni,
                      izvucenihKarata: igrac.izvucenihKarata,
                  });
              }

              let tabelaIgracaZaPrikaz = new IgraciFrontend(igraci,indexIgraca,podaci.indexIgracaNaPotezu);
              tabelaIgracaZaPrikaz.renderujIgrace(document.querySelector(".players ul"));
              
              let dugmeZaKickovanje = document.querySelectorAll(".btnKick");
              for (let dugme of dugmeZaKickovanje) 
              {
                  dugme.addEventListener("click", (e) => 
                  {
                    if(Number(dugme.dataset.index)!=0)
                      socket.emit("kickujIgraca", 
                      {
                          idIgraca: idIgraca,
                          idPartije: idPartije,
                          indexIgraca: Number(dugme.dataset.index),
                      });
                  });
              }

              let trenutnaKarta = new TablaFrontend(podaci.trenutnaKarta,"animated");
              trenutnaKarta.renderujTablu(document.querySelector(".board"));
            
              bodyElement.style.backgroundColor = nizBoja[podaci.trenutnaBoja];
          });

          socket.on("pribaviKarte", (podaci) => 
          {
              if (idIgraca != podaci.idIgraca) 
              {
                  return;
              }
              karte = podaci.karte;
              console.log(karte);
              console.log(podaci);
              //?????????????????????????????????????????????????????????????????????????????????????????????????????????
              document.querySelector(".card-list-container").innerHTML="";

              let karteURuciPrikaz = new SpilFrontend(karte);
              karteURuciPrikaz.renderujSpil(document.querySelector(".card-list-container"));
              
              let listaKarata = document.querySelectorAll(".single-card");
            
              listaKarata.forEach((karta) => 
              {
                  karta.addEventListener("click", (e) => 
                  {
                      //kada se klikne na kartu salje se dogadjaj kojim signaliziramo svim ostalima da smo odigrali kartu
                      socket.emit("kartaOdigrana", 
                      {
                        idPartije: idPartije,
                        indexIgraca: indexIgraca,
                          karta: 
                          {
                              specijalna: karta.dataset.specijalna == "1" ? true : false,
                              vrednost: Number(karta.dataset.vrednost),
                              boja: karta.dataset.boja,
                          },
                          indexKarte: Number(karta.dataset.index),
                          idIgraca: idIgraca,
                          imeIgraca: imeIgraca,
                      });
                  });
              });
          });