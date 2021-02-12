import socketio from "socket.io";
import http from "http";
import {
  igracModel,
  kartaModel,
  chatModel,
  korisnikModel,
  igraModel,
  odigranaKartaModel,
} from "./model/ModelBazePodataka";

const serverKomunikacioniSloj = function (server: any) {
  const io = socketio.listen(server);

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
      await igra.save();
    });
  });
};

export { serverKomunikacioniSloj };
