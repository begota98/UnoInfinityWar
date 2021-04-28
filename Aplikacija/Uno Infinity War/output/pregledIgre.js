
window.addEventListener("DOMContentLoaded", () => {

  const firebaseConfig = {
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
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var url_string = window.location.href;
      var url = new URL(url_string);
      var c = url.searchParams.get("id");
      var game;
      socket.emit("istorija", {
        poruka: c,
      });
      socket.on("istorijaOdgovor", async (data) =>{
        game = data.uzmiStaTiTreba;
        
        let contentBG = document.querySelector("body");
        let mapaBoja = {
          red: "#ff5555",
          yellow: "#ffaa00",
          green: "#55aa55",
          blue: "#5555fd",
        };
        document.querySelector(".board").innerHTML="";
        var prethodni = document.getElementById("111");
        var sledeci = document.getElementById("222");


        //command pattern
        
        function incIndex(x, y) { 
          if(x>=y-1)
            return x;
          return x+1;
        }
        function decIndex(x) { 
          if(x<=0)
            return 0;
          return x-1;
        }

        //poslednji==bool promenljiva da li je potez poslednji
        //potez koj mu se prosledi prikazuje na tablu
        function exc(trenutniPotez, poslednji) { 
          document.querySelector(".board").innerHTML="";
          let tablaPom= new TablaFrontend(trenutniPotez.karta,"animated");
          tablaPom.renderujTablu(document.querySelector(".board"));
          var text;
          if(!poslednji)
            text = `${trenutniPotez.imeUPartiji} je odigrao potez. `+((trenutniPotez.karta.boja=="black")?"Izabrana je boja "+trenutniPotez.bojaPozadine:"");
          else
            text = "Kraj igre";

          Swal.fire({
            position: "bottom",
            title: text,
            showConfirmButton: false,
            timer: 1500,
            backdrop: false,
            customClass: {
              title: "swal-title",
              container: "swal-container-class",
            },
          });
          document.body.style.background = mapaBoja[trenutniPotez.bojaPozadine];
         }


        var Command = function (execute, nextIndex) {
          this.execute = execute;
          this.nextIndex = nextIndex;
        }
        
        var NextCommand = function () {
            return new Command(exc, incIndex);
        };
        
        var PrevCommand = function () {
            return new Command(exc, decIndex);
        };

        var Calculator = function (commandsPom) {
          var current = 0;
          var commands = [];
       
          var commands=game.karte;
          var current=0;
          exc(commands[current],current==commands.length-1);
       
          return {
              next: function (command) {
                current=command.nextIndex(current, commands.length);
                command.execute(commands[current],current==commands.length-1);
              },
       
              previous: function (command) {
                current=command.nextIndex(current);
                command.execute(commands[current],current==commands.length-1);
              }      
          }
      }

        var commandPatern = new Calculator();

        prethodni.addEventListener("click", function () {
          commandPatern.previous(new PrevCommand());
        });

        sledeci.addEventListener("click", function () {
          commandPatern.next(new NextCommand());          
        });
      });
      
    } else {
    }
  });
});
