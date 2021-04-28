var obavestiZavrsetak = async function (rezultat,io, igra, podaci, igraKontroler)
{
    igra.zavrsenaIgra=1;
    await igra.save();
    io.sockets.emit("zavrsetakPartije", {
        idPartije: podaci.idPartije,
        indeks: podaci.indexIgraca,
        idIgraca: podaci.idIgraca,
        success: "Kraj igre",
      });
}

export {obavestiZavrsetak as obavestiZavrsetak}