window.addEventListener("DOMContentLoaded", () => {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      fetch("http://localhost:3000/vratiigrekorisnika/" + user.uid, {
        method: "GET",
      }).then((p) =>
        p.json().then((data) => {
          data.forEach((d) => {
            crtaj(d["_id"]);
          });
        })
      );
    } else {
    }
  });
});

async function crtaj(id) {
  console.log(id);
  var dat;
  await fetch("http://localhost:3000/vratiigru/" + id, {
    method: "GET",
  }).then((p) =>
    p.json().then((data) => {
      dat = data["datum"];
    })
  );


  
  var glavniDiv = document.createElement("div");
  glavniDiv.className="rounded";
  glavniDiv.style.border="1px black solid";
  glavniDiv.style.borderRadius="10%";
  glavniDiv.style.margin='10px';
  glavniDiv.style.justifyContent='center';
  glavniDiv.style.backgroundColor='khaki';
  var poDiv = document.createElement('div');
  glavniDiv.appendChild(poDiv);
  poDiv.className="cardN card-inverse bg-inverse";
  var div = document.createElement('div');
  poDiv.appendChild(div);
  div.className="card-block";
  var h4 = document.createElement('h4');
  h4.innerText=id;
  div.appendChild(h4);
  var p = document.createElement('p');
  p.innerText="Datum igranja: " + dat;
  div.appendChild(p);
  var c = document.getElementById("999999999");
  c.appendChild(glavniDiv);

  const butt = document.createElement("input");
  butt.className='btn btn-secondary-outline';
  div.appendChild(butt);
  butt.type = "submit";
  butt.value = "POGLEDAJ";
  butt.style.background="salmon";
  butt.style.margin="5px";

  butt.addEventListener("click", function () {
    location.replace("pregledIgre?id="+id);
  });
}
