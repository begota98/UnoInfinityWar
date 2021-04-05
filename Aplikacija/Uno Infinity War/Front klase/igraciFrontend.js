var IgraciFrontend = function (igraci, index, trenutniPotez) 
{
    
    this.igraci = igraci;
    this.index = index;
    this.trenutniPotez = trenutniPotez;
    window.playersComponent = this;
    

    //ovo je mozda nepotrebno, proveriti
    this.promeniBrojeve=function(index, number) 
    {
        let players = this.igraci;
        players[index].number += number;
        this.igraci = players;
    }
    this.renderujIgrace=function(destination) 
    {
        let parent=destination;
        let div=document.createElement("div");
        parent.appendChild(div);
        div.className="list-group resultTable";
        var table = document.createElement("table");
        table.className="table table-striped table-dark";
        div.appendChild(table);

        var thead =  document.createElement("thead");
        var tbody = document.createElement("tbody");
        table.appendChild(thead);
        table.appendChild(tbody);

        var tr = document.createElement("tr");
        thead.appendChild(tr);

        var th1 = document.createElement("th");
        tr.appendChild(th1);
        th1.innerHTML="#";

        var th2 = document.createElement("th");
        tr.appendChild(th2);
        th2.innerHTML="Igrac";

        var th3 = document.createElement("th");
        tr.appendChild(th3);
        th3.innerHTML="Karte";

        var th4 = document.createElement("th");
        tr.appendChild(th4);
        th4.innerHTML="Poeni";

        var th5 = document.createElement("th");
        tr.appendChild(th5);
        th5.innerHTML="";

        this.igraci.map((player,index) => 
        {
            tr = document.createElement("tr");
            tbody.appendChild(tr);

            let className="";
            if (this.index==index)
            {
                className+=" current";
            }
            if (this.trenutniPotez == index)
            {
                className+=" turn";
            }

            tr.className=className;

            var td1 = document.createElement("td");
            tr.appendChild(td1);
            td1.innerHTML=index;

            var td2 = document.createElement("td");
            tr.appendChild(td2);
            td2.innerHTML=player.imeIgraca;

            var td3 = document.createElement("td");
            tr.appendChild(td3);
            td3.innerHTML=player.izvucenihKarata    ;

            var td4 = document.createElement("td");
            tr.appendChild(td4);
            td4.innerHTML=player.skor;

            let a=document.createElement("a");
            a.className="btn btn-warning btnKick";
            a.dataset.index=index;
            a.innerText="Kick";
            var td5 = document.createElement("td");
            tr.appendChild(td5);
            let n=document.createElement("div");
            this.index == 0 && index != 0 ? td5.appendChild(a):td5.appendChild(n);

        })
    }
}
