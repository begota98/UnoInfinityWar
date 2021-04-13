import express from "express";
import cors from "cors";
import socketio from "socket.io";
import http from "http";
import Igra from "./Logika igre/igra";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { igraModel, igracModel, korisnikModel } from "./Model/db-model";
import { getMaxListeners } from "process";
import { Socket } from "dgram";
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
dotenv.config();

// create the igra
let igraKontroler: Igra = new Igra();

const aplikacija = express();
const PORT = 3000;
const server = http.createServer(aplikacija);
mongoose.connect(process.env.CONNECTION_STRING, { useNewUrlParser: true });
mongoose.connection.once("open", () => {
  console.log("connected to db " + process.env.CONNECTION_STRING);
});
aplikacija.use(cors());
aplikacija.use(express.static("output"));
aplikacija.use(express.static("Front klase"))
aplikacija.use(express.static("styles"));
const io = socketio.listen(server);

aplikacija.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./Stranice/signin.html"));
});


aplikacija.get("/signin", (req, res) => {
  res.sendFile(path.join(__dirname, "./Stranice/signin.html"));
});

aplikacija.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "./Stranice/signup.html"));
});

aplikacija.get("/kreirajIgru", (req, res) => {
  res.sendFile(path.join(__dirname, "./Stranice/kreirajIgru.html"));
});

aplikacija.get("/pregledIgre", (req, res) => {
  res.sendFile(path.join(__dirname, "./Stranice/pregledIgre.html"));
});

aplikacija.get("/resetpass", (req, res) => {
  res.sendFile(path.join(__dirname, "./Stranice/resetpass.html"));
});

aplikacija.get("/pocetnaStrana", function (req, res) 
{
  res.sendFile(path.join(__dirname, "./Stranice/pocetnaStrana.html"));
});

aplikacija.get("/oStranici", function (req, res) 
{
  res.sendFile(path.join(__dirname, "./Stranice/oStranici.html"));
});

aplikacija.get("/istorijaIgara", function (req, res) 
{
  res.sendFile(path.join(__dirname, "./Stranice/istorijaIgara.html"));
});

aplikacija.get("/igrajIgru", function (req, res) 
{
  res.sendFile(path.join(__dirname, "./Stranice/kreirajIgru.html"));
});

aplikacija.get("/vratiigrekorisnika/:id", async function (req, res) 
{
  let korisnik = await korisnikModel.findById(req.params.id);
  if (korisnik) {
    res.json(korisnik.get("prethodneIgre"));
  } else {
    res.json("");
  }
});

aplikacija.get("/vratiigru/:id", async function (req, res) 
{
  let igra = await igraModel.findById(req.params.id);
  res.json(igra);
});

aplikacija.get("/vratipotezeigre/:id", async function (req, res) 
{
  let igra = await igraModel.findById(req.params.id);
  if (igra) {
    res.json(igra.get("karte"));
  } else {
    res.json("");
  }
});

io.on("connection", (socket) => {
  socket.on("istorija", async (podaci) =>{
    let igra = await igraModel.findById(podaci.poruka);
    socket.emit("istorijaOdgovor", {
      uzmiStaTiTreba:igra,
    });
  });
  socket.on("ulogovanSam", async (podaci) => {
    try {
      let user = await korisnikModel.findById(podaci.id);
      if (user == null) 
      {
        user = new korisnikModel({
          _id: podaci.id,
        });
        await user.save();
      }
    } catch (err) {
      console.log("GRESKA");
    }
  });
  socket.on("createGame", async (podaci) => {
    try 
    {
      if (!podaci.ime  || !podaci.idIgraca)
        throw new Error("nedovoljno popodataka");

      let novaPartija = new igraModel({
        igraci: [
          {
            ime: podaci.ime,
            indeks: podaci.indexIgraca,
            idIgraca: podaci.idIgraca,
            soketId: socket.id,
            izvucenihKarata: 0,
            poeni: 0,
          },
        ],
        igracNaPotezu: 0,
        pocelaIgra: false,
        obrnutRedosled: false,
        datum: new Date().toLocaleString(),
        poeniZaPobedu: podaci.PoeniZaPobedu,
        brojIgraca: 1,
      });
      await novaPartija.save();
      socket.emit("kreiranaJeIgraID", {
        //salje se ID igre
        idPartije: novaPartija._id,
        idIgraca: podaci.idIgraca,
      });
      socket.idPartije = novaPartija._id;
    } catch (err) {
      socket.emit("greska", { poruka: err.message });
    }
  });

  // kada se ostali korisnci joinuju partiji
  socket.on("pridruziSePartiji", async (podaci) => {
    try 
    {
      if (!podaci.idPartije || !podaci.idIgraca) 
        throw new Error("nedovoljno podataka");
      let igra = await igraModel.findById(podaci.idPartije);
      if (!igra) 
        throw new Error("ne postoji igra sa ovim id-jem");

      if (igra.pocelaIgra) 
      {
        throw new Error("partija je vec pocela");
      }
      //provera da se nismo joinovali ranije
      for (let igrac of igra.igraci) 
      {
        if (igrac.idIgraca == podaci.idIgraca) 
          return;
      }
      let index = igra.igraci.length;
      igra.igraci.push({
        ime: podaci.imeIgraca,
        indeks: index,
        idIgraca: podaci.idIgraca,
        soketId: socket.id,
        izvucenihKarata: 0,
        poeni: 0,
      });
      // postavljanje idPartije na socket objekat
      socket.idPartije = igra._id;
      let igraci = [];
      for (let igrac of igra.igraci) {
        igraci.push({
          ime: igrac.ime,
          indeks: igrac.indeks,
        });
      }
      igra.markModified("igraci");
      igra.brojIgraca++;
      await igra.save();

      //kada se uspesno joinujemo
      socket.emit("uspesnoPridruzivanjeIgri", {
        idPartije: igra._id,
        idIgraca: podaci.idIgraca,
        indexIgraca: index,
      });
      for (let igrac of igra.igraci) {
        //promena u redu cekanja 
        io.to(igrac.soketId).emit("promenaIgracaKojiCekajuPartiju", {
          idPartije: igra._id,
          igraci: igraci,
        });
      }
    } catch (err) {
      socket.emit("greska", { poruka: err.message });
    }
  });

  // pokretanje igre
  socket.on("pokreniIgru", async (podaci) => {
    try 
    {
      let igra = await igraModel.findById(podaci.idPartije);
      if (!igra) 
        throw new Error("ne postoji igra sa tim id-jem");

      let igraci = [];
      for (let igrac of igra.igraci) 
        igraci.push(igrac);
      igra = await igraKontroler.kreirajIgru(igra._id, igraci);
      igraci = [];
      for (let igrac of igra.igraci) {
        igraci.push({
          ime: igrac.ime,
          indeks: igrac.indeks,
          izvucenihKarata: igrac.karte.length,
          poeni: igrac.poeni,
        });

        let ikorisnikPom = await korisnikModel.findById(igrac.idIgraca);
        ikorisnikPom.prethodneIgre.push(igra._id);
        await ikorisnikPom.save();
      }
      //pocetak partije
      for (let igrac of igra.igraci) {
        io.to(igrac.soketId).emit("kreiranaJeIgra", {
          idPartije: podaci.idPartije,
          igraci: igraci,
          trenutnaKarta: igra.trenutnaKarta,
          igracNaPotezu: igra.igracNaPotezu,
          trenutnaBoja: igra.trenutnaBoja,
        });
      }
      //izvlacenje karata za svakog od igraca
      for (let igrac of igra.igraci) {
        io.to(igrac.soketId).emit("pribaviKarte", {
          idIgraca: igrac.idIgraca,
          karte: igrac.karte,
          idPartije: podaci.idPartije,
        });
      }
    } catch (err) {
      socket.emit("greska", { poruka: err.message });
    }
  });
  // kada igrac odigra potez
  socket.on("kartaOdigrana", async (podaci) => {
    try {
      let isPlayed = await igraKontroler.odigraj(
        podaci.idPartije,
        podaci.indexIgraca,
        podaci.indexKarte,
        podaci.karta,
        podaci.idIgraca
      );
      if (isPlayed == -1) 
      {
        socket.emit("nisteNaPotezu", 
        {
          idPartije: podaci.idPartije,
          // indeks: podaci.indeks,
          idIgraca: podaci.idIgraca,
        });
        return;
      } 
      else if (isPlayed == 0) 
      {
        socket.emit("pogresanPotez", 
        {
          idPartije: podaci.idPartije,
          // indeks: podaci.indeks,
          idIgraca: podaci.idIgraca,
        });
        return;
      }
      let igra = await igraModel.findById(podaci.idPartije);
      //pamtimo svaki potez u bazi
      let korisnikP = await korisnikModel.findById(podaci.idIgraca);

      igra.karte.push({
        karta: {
          vrednost: podaci.karta.vrednost,
          specijalna: podaci.karta.specijalna,
          boja: podaci.karta.boja,
        },
        korisnik: korisnikP,
        bojaPozadine: podaci.karta.boja,
        imeUPartiji: podaci.imeIgraca,
      });
      await igra.save();

      let igraci = [];
      for (let igrac of igra.igraci) {
        igraci.push({
          ime: igrac.ime,
          indeks: igrac.indeks,
          izvucenihKarata: igrac.karte.length,
          poeni: igrac.poeni,
        });
      }
      for (let igrac of igra.igraci) {
        io.to(igrac.soketId).emit("azuriranaPartija", {
          idPartije: podaci.idPartije,
          igraci: igraci,
          trenutnaKarta: igra.trenutnaKarta,
          igracNaPotezu: igra.igracNaPotezu,
          trenutnaBoja: igra.trenutnaBoja,
          kartaJeIzvucena: isPlayed == 4 || isPlayed == 3 ? true : false,
        });
      }

      // azuriranje za sve
      //??????????????mozda pbrazac
      let uno = false;
      if (igra.igraci[podaci.indexIgraca].karte.length == 1) 
        uno = true;
      for (let igrac of igra.igraci) 
      {
        io.to(igrac.soketId).emit("pribaviKarte", 
        {
          idIgraca: igrac.idIgraca,
          karte: igrac.karte,
          idPartije: podaci.idPartije,
        });
      }
      console.log(isPlayed);
      if (uno) {
        for (let igrac of igra.igraci) {
          io.to(igrac.soketId).emit("uno", {
            idPartije: podaci.idPartije,
          });
        }
      }
      if (isPlayed == 2) {
        io.to(igra.igraci[igra.igracNaPotezu].socketId).emit("drawTwo", {
          idPartije: podaci.idPartije,
        });
      } else if (isPlayed == 3) {
        io.sockets.emit("odaberiteBoju", {
          idPartije: podaci.idPartije,
          indexIgraca: podaci.indexIgraca,
          idIgraca: igra.igraci[podaci.indexIgraca].idIgraca,
        });
      } else if (isPlayed == 4) {
        io.sockets.emit("odaberiteBoju", {
          idPartije: podaci.idPartije,
          indexIgraca: podaci.indexIgraca,
          idIgraca: igra.igraci[podaci.indexIgraca].idIgraca,
        });
        igraKontroler.sledeciPotez(igra);
        io.to(igra.igraci[igra.igracNaPotezu].socketId).emit("drawFour", {
          idPartije: podaci.idPartije,
        });
        igra.obrnutRedosled = !igra.obrnutRedosled;
        igraKontroler.sledeciPotez(igra);
        igra.obrnutRedosled = !igra.obrnutRedosled;
      } else if (isPlayed == 5) {
        io.sockets.emit("preskakanjeIgraca", {
          idPartije: podaci.idPartije,
        });
      } else if (isPlayed == 6) {
        io.sockets.emit("promenaSmeraPartije", {
          idPartije: podaci.idPartije,
        });
      } else if (isPlayed == 7) {
        io.sockets.emit("zavrsetakPartije", {
          idPartije: podaci.idPartije,
          indeks: podaci.indexIgraca,
          idIgraca: podaci.idIgraca,
          success: "Kraj igre",
        });
      }
    } catch (err) {
      socket.emit("greska", { poruka: err.message });
    }
  });

  socket.on("bojaOdabrana", async (podaci) => {
    try {
      if (
        !podaci.idPartije ||
        !podaci.boja ||
        podaci.indexIgraca === undefined ||
        !podaci.idIgraca
      )
        throw new Error("nedovoljno podata");

      await igraKontroler.promeniTrenutnuBoju(
        podaci.idPartije,
        podaci.boja,
        podaci.indexIgraca,
        podaci.idIgraca
      );
      let igra = await igraModel.findById(podaci.idPartije);
      let igraci = [];
      for (let igrac of igra.igraci) {
        igraci.push({
          ime: igrac.ime,
          indeks: igrac.indeks,
          izvucenihKarata: igrac.karte.length,
          poeni: igrac.poeni,
        });
      }
      for (let igrac of igra.igraci) {
        io.to(igrac.soketId).emit("azuriranaPartija", {
          idPartije: podaci.idPartije,
          igraci: igraci,
          trenutnaKarta: igra.trenutnaKarta,
          igracNaPotezu: igra.igracNaPotezu,
          trenutnaBoja: igra.trenutnaBoja,
          kartaJeIzvucena: true,
        });
      }
    } catch (err) {
      socket.emit("greska", { poruka: err.message });
    }
  });