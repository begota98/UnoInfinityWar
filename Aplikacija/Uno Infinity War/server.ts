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
