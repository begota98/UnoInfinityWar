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

          
