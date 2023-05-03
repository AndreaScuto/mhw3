
function onResponse(response) {
  console.log("Connessione OK!");
  return response.json();
}

//Riempie la tabella con i dati del campionato costruttori

function campionatoCostruttori(json) {
  console.log("JSON OK!");
  console.log(json);

  let pos, costruttore, nazionalità, punti, vittorie, info;
  const num_risultati = json.MRData.total;
  console.log(num_risultati);

  placeH1 = document.querySelector(".PlaceH1");
  placeH2 = document.querySelector(".PlaceH2");
  placeH1.innerHTML = "Costruttore";
  placeH2.innerHTML = "Nazionalità";

  for (let i = 0; i < num_risultati; i++) {
    pos =
      json.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[i]
        .position;
    nome =
      json.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[i]
        .Constructor.name;
    nazionalità =
      json.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[i]
        .Constructor.nationality;
    punti =
      json.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[i]
        .points;
    vittorie =
      json.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[i].wins;

    info = [pos, nome, nazionalità, punti, vittorie];
    console.log("pilota=" + info);

    let Lista = document.querySelector(".tabellaArchivio");
    let tbody = Lista.getElementsByTagName("tbody")[0];
    let colonne = Lista.getElementsByTagName("th").length;
    let tr = document.createElement("tr");
    for (let j = 0; j < colonne; j++) {
      let td = document.createElement("td");
      let tx = document.createTextNode(info[j]);
      td.appendChild(tx);
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
}

//Riempie la tabella con i dati del campionato piloti

function campionatoPiloti(json) {
  console.log("JSON OK!");
  console.log(json);

  let pos, nome, cognome, nome_completo, costruttore, punti, vittorie, info;
  const num_risultati = json.MRData.total;
  console.log(num_risultati);

  placeH1 = document.querySelector(".PlaceH1");
  placeH2 = document.querySelector(".PlaceH2");
  placeH1.innerHTML = "Pilota";
  placeH2.innerHTML = "Costruttore";

  for (let i = 0; i < num_risultati; i++) {
    pos =
      json.MRData.StandingsTable.StandingsLists[0].DriverStandings[i].position;

    nome =
      json.MRData.StandingsTable.StandingsLists[0].DriverStandings[i].Driver
        .givenName;
    cognome =
      json.MRData.StandingsTable.StandingsLists[0].DriverStandings[i].Driver
        .familyName;
    nome_completo = nome + " " + cognome;

    costruttore =
      json.MRData.StandingsTable.StandingsLists[0].DriverStandings[i]
        .Constructors[0].name;
    punti =
      json.MRData.StandingsTable.StandingsLists[0].DriverStandings[i].points;
    vittorie =
      json.MRData.StandingsTable.StandingsLists[0].DriverStandings[i].wins;
    info = [pos, nome_completo, costruttore, punti, vittorie];
    console.log("pilota=" + info);

    let Lista = document.querySelector(".tabellaArchivio");
    let tbody = Lista.getElementsByTagName("tbody")[0];
    let colonne = Lista.getElementsByTagName("th").length;
    let tr = document.createElement("tr");
    for (let j = 0; j < colonne; j++) {
      let td = document.createElement("td");
      let tx = document.createTextNode(info[j]);
      td.appendChild(tx);
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
}

//Fetch senza key per la ricerca in base all'anno e al tipo di campionato (Tasto Archivio)

function Ricerca(event) {
  event.preventDefault();
  const Anno_I = document.querySelector("#Anno");
  const Tipo_I = document.querySelector("#Tipo");
  const Tipo_I_value = encodeURIComponent(Tipo_I.value);

  const form = document.querySelector("form");
  form.removeEventListener("submit", Ricerca);


  console.log("Eseguo ricerca: " + Anno_I.value + " " + Tipo_I_value);
  API_url =
    "http://ergast.com/api/f1/" + Anno_I.value + "/" + Tipo_I_value + ".json";
  console.log("URL: " + API_url);
  if (Tipo_I_value == "driverStandings") {
    fetch(API_url)
      .then(onResponse)
      .then(campionatoPiloti)
      .catch((error) => console.log("error", error));
  } else {
    fetch(API_url)
      .then(onResponse)
      .then(campionatoCostruttori)
      .catch((error) => console.log("error", error));
  }
  const BottoneCerca = document.querySelector(".BottoneCerca");
  BottoneCerca.style.display = "none";
}

//Fetch tramite key per visualizzare gare 2023 (Banner)

function BannerClick(event) {
  event.preventDefault();

  const myHeaders = new Headers();
  myHeaders.append("x-rapidapi-key", "4a7414a153db433937462623af36141c");
  myHeaders.append("x-rapidapi-host", "v1.formula-1.api-sports.io");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch(
    "https://v1.formula-1.api-sports.io/races?season=2023&type=Race&timezone=Europe%2FRome",
    requestOptions
  )
    .then(onResponse)
    .then(VisualizzaGare)
    .catch((error) => console.log("error", error));
}

//Onjson per la visualizzazione delle gare 2023 (Banner)

function VisualizzaGare(json) {
  console.log("JSON OK!");
  console.log(json);

  let banner = document.querySelector(".BannerGare");
  let box = document.querySelector(".BoxGare");
  banner.style.display = "none";
  box.style.display = "flex";

  let data, circuito, luogo, stato, giri;
  const num_risultati = json.response.length;
  console.log(num_risultati);

  for (let i = 0; i < num_risultati; i++) {
   
    data = json.response[i].date;
    circuito = json.response[i].competition.name;
    luogo = json.response[i].competition.location.city;
    stato = json.response[i].status;
    giri = json.response[i].laps.total;
    dataOK = data.substring(0, 10);
    info = [dataOK, circuito, luogo, stato, giri];

    let Lista = document.querySelector(".tabellaGare");
    let tbody = Lista.getElementsByTagName("tbody")[0];
    let colonne = Lista.getElementsByTagName("th").length;
    let tr = document.createElement("tr");
    for (let j = 0; j < colonne; j++) {
      let td = document.createElement("td");
      let tx = document.createTextNode(info[j]);
      td.appendChild(tx);
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }

}

//Chiude box e fa tornare il banner

function EliminaGare() {
  let banner = document.querySelector(".BannerGare");
  let box = document.querySelector(".BoxGare");
  banner.style.display = "flex";
  box.style.display = "none";
}

//Chiude box e fa tornare all'inizio della pagina

function ChiudiRicerca() {
  const Lista = document.querySelector(".tabellaArchivio");
  const tbody = Lista.getElementsByTagName("tbody")[0];
  tbody.innerHTML = "";
  const BoxRicerca = document.querySelector(".BoxRicerca");
  BoxRicerca.style.display = "none";
  scrollTo({ top: 0, behavior: "smooth" });
  const BottoneCerca = document.querySelector(".BottoneCerca");
  BottoneCerca.style.display = "flex";
  const form = document.querySelector("form");
  form.addEventListener("submit", Ricerca);
}

//  Visualizza il box di ricerca

function VisualizzaCerca() {
  const BoxRicerca = document.querySelector(".BoxRicerca");
  BoxRicerca.style.display = "flex";
  scrollTo({ top: 2600, behavior: "smooth" });
}

// Elementi interattivi

const BottoneArchivio = document.querySelector(".BottoneArchivio");
BottoneArchivio.addEventListener("click", VisualizzaCerca);

const BottoneChiudi_1 = document.querySelector(".ChiudiRicerca");
BottoneChiudi_1.addEventListener("click", ChiudiRicerca);

const form = document.querySelector("form");
form.addEventListener("submit", Ricerca);

const Banner = document.querySelector(".BannerGare");
Banner.addEventListener("click", BannerClick);

const BottoneChiudi_2 = document.querySelector(".ChiudiGare");
BottoneChiudi_2.addEventListener("click", EliminaGare);

// Autore: Andrea Scuto
// RestApi utilizzate: https://ergast.com/mrd/   ||   https://api-sports.io/documentation/formula-1/v1
