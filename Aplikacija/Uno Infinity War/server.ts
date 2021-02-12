//import express = require('express');
// Create a new express app instance
import express from "express";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import http from "http";
import socketio from "socket.io";
import {
  igracModel,
  kartaModel,
  chatModel,
  korisnikModel,
  igraModel,
  odigranaKartaModel,
} from "./model/ModelBazePodataka";

dotenv.config();

const app = express();
const PORT = 3000;
const server = http.createServer(app);
const konekcioniString =
  "";
mongoose.connect(konekcioniString, { useNewUrlParser: true });
mongoose.connection.once("open", () => {
  console.log("Konektovan sa bazom podataka : " + konekcioniString);
});
app.use(cors());
app.use(express.static("output"));
app.use(express.static("styles"));
const io = socketio.listen(server);

server.listen(process.env.PORT || PORT, () => {
  console.log(`Server osluskuje na portu : ${process.env.PORT || PORT}`);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "pocetna.html"));
});

io.on("connection", (socket) => {
  var id = "5ff9f39d8beeef1c6863a9ce";
  socket.on("zapocniIgru", async (podaci) => {
    let igra = await igraModel.findById(id);
    let igrac = new igracModel({
      ime: podaci.ime,
      soketId: socket.id,
    });

    if (igra) {
      igra.igraci.push(igrac);
      await igra.save();
    }

    io.to(socket.id).emit("zapocetoJe", {
      igra: igra,
    });
  });

  socket.on("novaPoruka", async (podaci) => {
    let igra = await igraModel.findById(id);
    if (igra) {
      let chat = new chatModel({
        igracIme: podaci.ime,
        poruka: podaci.poruka,
      });
      igra.chat.push(chat);
      for (let igrac of igra.igraci) {
        io.to(igrac.soketId).emit("stizeNovaPoruka", {
          poruka: chat,
        });
      }
    }
  });

  socket.on("odigrajPotez", async (podaci) => {
    let igra = await igraModel.findById(id);
    if (igra) {
      for (let igrac of igra.igraci) {
        io.to(igrac.soketId).emit("stizeNovPotez", {
          karta: podaci.imeKarte,
        });
      }
    }
  });

  socket.on("disconnect", async () => {
    let igra = await igraModel.findById(id);
    let socketid = socket.id;
    if (igra) {
      for (let i = 0; i <= igra.igraci.lenght - 1; i++) {
        if (igra.igraci[i].soketId == socketid) {
          igra.igraci.splice(i, 1);
          break;
        }
      }
    }
  });
});

app.get("/vratikorisnike", async function (req, res) {
  let korisnici = await korisnikModel.find();
  console.log(korisnici);
  res.json(korisnici);
});

//http://localhost:3000/vratikorisnike

app.get("/vratikorisnika/:id", async function (req, res) {
  let korisnik = await korisnikModel.findById(req.params.id);
  console.log(korisnik);
  res.json(korisnik);
});
//http://localhost:3000/vratikorisnika/BinFicP2ttfws0JCei2kMPcL0xY2
//BinFicP2ttfws0JCei2kMPcL0xY2

app.get("/vratiigrekorisnika/:id", async function (req, res) {
  let korisnik = await korisnikModel.findById(req.params.id);
  if (korisnik) {
    console.log(korisnik.get("prethodneIgre"));
    res.json(korisnik.get("prethodneIgre"));
  } else {
    res.json("");
  }
});

//http://localhost:3000/vratiigrekorisnika/BinFicP2ttfws0JCei2kMPcL0xY2

app.get("/vratiigre", async function (req, res) {
  let igre = await igraModel.find();
  console.log(igre);
  res.json(igre);
});

//http://localhost:3000/vratiigre

app.get("/vratiigru/:id", async function (req, res) {
  let igra = await igraModel.findById(req.params.id);
  console.log(igra);
  res.json(igra);
});

//5ff9f39d8beeef1c6863a9ce
//http://localhost:3000/vratiigru/5ff9f39d8beeef1c6863a9ce

app.get("/vratiucesnikeigre/:id", async function (req, res) {
  let igra = await igraModel.findById(req.params.id);
  if (igra) {
    console.log(igra.get("igraci"));
    res.json(igra.get("igraci"));
  } else {
    res.json("");
  }
});
//5ff9f39d8beeef1c6863a9ce
//http://localhost:3000/vratiucesnikeigre/5ff9f39d8beeef1c6863a9ce

app.get("/vratipotezeigre/:id", async function (req, res) {
  let igra = await igraModel.findById(req.params.id);
  if (igra) {
    console.log(igra.get("karte"));
    res.json(igra.get("karte"));
  } else {
    res.json("");
  }
});

//5ff9f39d8beeef1c6863a9ce
//http://localhost:3000/vratipotezeigre/5ff9f39d8beeef1c6863a9ce
