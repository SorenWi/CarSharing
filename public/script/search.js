resultsDiv = document.getElementById("searchResults");
searchBar = document.getElementById("searchBar");
fuelType = document.getElementById("searchFuelType");
searchBtn = document.getElementById("searchBtn");
searchAllBtn = document.getElementById("searchAllBtn");

filterDateInput = document.getElementById("filterDate");
filterTimeInput = document.getElementById("filterTime");
filterDurationInput = document.getElementById("filterDuration");

searchResponseDiv = document.getElementById("searchResponse");

cardTemplate = document.getElementById("cardTemplate").innerHTML;

searchBtn.addEventListener("click", search);
searchAllBtn.addEventListener("click", searchAll);

let currentSearch = {};

function getFilterValues() {
  return { filterDate: filterDateInput.value, filterTime: filterTimeInput.value, filterDuration: filterDurationInput.value};
}

async function filterSearch() {
  const { filterDate, filterTime, filterDuration } = getFilterValues();

  if ( filterDate == "" || filterTime == "" || filterDuration == "") {
    searchResponse.innerHTML = "Missing filter input";
  }

  let body;
  if (currentSearch.showAll) {
    body = { showAll: true, filterDate: filterDate, filterTime: filterTime, filterDuration: filterDuration };
  } else {
    if (searchBar.value == "" || fuelType.value == "") {
      showSearchResponse("Missing filter input");
      return;
    }
    body = { searchText: searchBar.value, fuelType: fuelType.value, filterDate: filterDate, filterTime: filterTime, filterDuration: filterDuration};
  }

  // /search or /filterSearch?
  makeRequest("/search", body);
}



async function searchAll() {
  const response = await makeRequest("/searchAll", {});
  showResults(response.results);
}

async function search() {
  if (searchBar.value == "" || fuelType.value == "") {
    showSearchResponse("Missing search input");
    return;
  }
  const body = { searchText: searchBar.value, fuelType: fuelType.value};
  currentSearch = {searchAll: false, searchText: searchBar.value, fuelType: fuelType.value};
  const response = await makeRequest("/search", body);
  showResults(response.results); 
}

function showResults(results) {
  //clear previous search results
  //https://stackoverflow.com/questions/16270761/how-to-insert-a-large-block-of-html-in-javascript
  resultsDiv.innerHTML = "";
 
  results.forEach(function(result) {
    card = document.createElement("div");
    card.classList.add("card");
    let id = result.carId;
    card.setAttribute("id", id);
    card.innerHTML = cardTemplate;
    card.innerHTML = card.innerHTML
      .replace(/{NAME}/g, result.carName)
      .replace(/{ID}/g, result.carId)
      .replace(/{FUELTYPE}/g, result.fuelType)
      .replace(/{TIMEFRAME}/g, `${result.earlyTime} - ${result.lateTime}`)
      .replace(/{MAXTIME}/g, result.maxTime)
      .replace(/{FLATRATE}/g, result.flatrate)
      .replace(/{COSTPERMINUTE}/g, result.costPerMinute);

    resultsDiv.append(card);

    checkButton = document.querySelector(`#${id} #checkButton`);
    checkButton.addEventListener("click", () => { checkAvailability(id)})

    bookButton = document.querySelector(`#${id} #bookButton`);
    bookButton.addEventListener("click", () => { tryBooking(id) });
  });
}

async function checkAvailability(id) {
  const { date, time, duration } = getInputsOfCard(id);
  if ( date == "" || time == "" || duration == "") {
    showCardResponse(id, "Missing input");
    return;
  }

  const body = { carId: id, date: date, time: time, duration: duration };
  const response = await makeRequest("/checkAvailability", body); 
  showCardResponse(id, response.message);
}

//shows a message for the card with id
function showCardResponse(id, message) {
  responseDiv = document.querySelector(`#${id} .response`);
  responseDiv.innerHTML = "";
  responseDiv.append(document.createTextNode(message));
}

function showSearchResponse(message) {
  searchResponseDiv.innerHTML = "";
  searchResponseDiv.append(document.createTextNode(message));
}

async function tryBooking(id) {
  const { date, time, duration } = getInputsOfCard(id);
  if ( date == "" || time == "" || duration == "") {
    showCardResponse(id, "Missing input");
    return;
  }

  const body = { carId: id, date: date, time: time, duration: duration };
  const response = await makeRequest("/bookCar", body);
  showCardResponse(id, response.message);
}

function getInputsOfCard(id) {
  dateInput = document.querySelector(`#${id} input[name="date"]`).value;
  timeInput = document.querySelector(`#${id} input[name="time"]`).value;
  durationInput = document.querySelector(`#${id} input[name="duration"]`).value;

  return inputs = { date: dateInput, time: timeInput, duration: durationInput };
}

async function showMore() {

}

async function makeRequest(path, body) {
  let url = "http://localhost:3000"
  url += path;

  const response = await fetch(url, 
    { method: "POST",
    headers: {
      'Content-Type': "application/json"
    },
    body: JSON.stringify(body)}
  );

  const json = await response.json();
  return json;
}
