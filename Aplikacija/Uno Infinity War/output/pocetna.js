window.addEventListener("DOMContentLoaded", () => {
  let imeIgraca;
  let tekstKarte;
  let poruka;

  let dugme = document.getElementById("odigrajPotez");
  dugme.addEventListener("click", () => {
    //imeIgraca=document.getElementById("imeIgraca").value;
    tekstKarte = document.getElementById("tekstKarte").value;
    socket.emit("odigrajPotez", {
      imeKarte: tekstKarte,
    });
  });

  dugme = document.getElementById("chat");
  dugme.addEventListener("click", () => {
    imeIgraca = document.getElementById("imeIgraca").value;
    poruka = document.getElementById("poruka").value;
    alert("kliknuto");
    socket.emit("novaPoruka", {
      ime: imeIgraca,
      poruka: poruka,
    });
  });

  dugme = document.getElementById("zapocniIgru");
  dugme.addEventListener("click", () => {
    imeIgraca = document.getElementById("imeIgraca").value;
    //tekstKarte=document.getElementById("tekstKarte").value;
    socket.emit("zapocniIgru", {
      ime: imeIgraca,
    });
  });

  socket.on("zapocetoJe", async (podaci) => {
    let dugme = document.getElementById("zapocniIgru");
    dugme.disabled = true;
    swal.fire({
      confirmButtonColor: "#2c3e50",
      icon: "info",
      title: "Zapoceli ste igru sa id-jem " + podaci.igra._id,
      showConfirmButton: true,
    });
  });

  socket.on("stizeNovaPoruka", async (podaci) => {
    swal.fire({
      confirmButtonColor: "#2c3e50",
      icon: "info",
      title: "Stigla nova poruka",
      showConfirmButton: true,
    });
    let chat = document.getElementById("chat111");
    let div = document.createElement("div");
    div.innerHTML = podaci.poruka.igracIme + ": " + podaci.poruka.poruka;
    chat.appendChild(div);
  });

  socket.on("stizeNovPotez", async (podaci) => {
    swal.fire({
      confirmButtonColor: "#2c3e50",
      icon: "info",
      title: "Stiglo nov potez",
      showConfirmButton: true,
    });
    let slika = document.getElementById("slikaKarte");
    slika.src = "deck-images/" + podaci.karta + ".png";
  });
});
