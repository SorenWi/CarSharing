resultsDiv = document.getElementById("searchResults");
searchBar = document.getElementById("searchBar");
fuelType = document.getElementById("searchFuelType");
searchBtn = document.getElementById("searchBtn");
searchAllBtn = document.getElementById("searchAllBtn");

filterBtn = document.getElementById("filterBtn");
filterDateInput = document.getElementById("filterDate");
filterTimeInput = document.getElementById("filterTime");
filterDurationInput = document.getElementById("filterDuration");

searchResponseDiv = document.getElementById("searchResponse");

cardTemplate = document.getElementById("cardTemplate").innerHTML;

searchBtn.addEventListener("click", search);
searchAllBtn.addEventListener("click", searchAll);
filterBtn.addEventListener("click", filterSearch);

let currentSearch = {};
let currentSearchResultAmount = 0;
let currentSearchIndex = 0;

function getFilterValues() {
  return { filterDate: filterDateInput.value, filterTime: filterTimeInput.value, filterDuration: filterDurationInput.value};
}

async function filterSearch() {
  const { filterDate, filterTime, filterDuration } = getFilterValues();

  if ( filterDate == "" || filterTime == "" || filterDuration == "") {
    showSearchResponse("Missing filter input");
    return;
  }

  let body = currentSearch;
  body.useFilter = true;
  body.resultAmount = currentSearchResultAmount;
  body.filterDate = filterDate;
  body.filterTime = filterTime;
  body.filterDuration = filterDuration;

  clearResults();
  const results = await getSearchResults(body);
  showResults(results);
  showSearchResponse("Filter applied");
}


async function searchAll() {
  clearResults();
  const body = { showAll: true, useFilter: false, index: currentSearchIndex };
  const results = await getSearchResults(body);
  showResults(results); 
  showSearchResponse("Showing all");
}

async function search() {
  if (searchBar.value == "" || fuelType.value == "") {
    showSearchResponse("Missing search input");
    return;
  }
  
  clearResults();
  const body = { showAll: false, useFilter: false, index: currentSearchIndex, searchText: searchBar.value, fuelType: fuelType.value};
  const results = await getSearchResults(body);
  showResults(results); 
  showSearchResponse("Showing results");
}

async function showMore() {
  let showMoreBtn = document.getElementById("showMoreBtn");
  showMoreBtn.parentNode.removeChild(showMoreBtn);

  const body = currentSearch;
  body.index = currentSearchIndex;

  const results = await getSearchResults(body);
  showResults(results);
}

async function getSearchResults(body) {
  currentSearch = body;
  const response = await makeRequest("/search", body);
  currentSearchIndex += response.index;
  currentSearchResultAmount += response.results.length;
  return response.results; 
}

function clearResults() {
  currentSearchResultAmount = 0;
  currentSearchIndex = 0;
  resultsDiv.innerHTML = "";
}

function showResults(results) {
  //https://stackoverflow.com/questions/16270761/how-to-insert-a-large-block-of-html-in-javascript
  
  results.forEach(function(result) {
    card = document.createElement("div");
    card.classList.add("card");
    let id = result.carId;
    card.setAttribute("id", id);
    card.innerHTML = cardTemplate;
    card.innerHTML = card.innerHTML
      .replace(/{NAME}/g, result.name)
      .replace(/{ID}/g, result.carId)
      .replace(/{FUELTYPE}/g, result.fuelType)
      .replace(/{TIMEFRAME}/g, `${result.earlyTime} - ${result.lateTime}`)
      .replace(/{MAXTIME}/g, result.maxTime)
      .replace(/{PRICE}/g, result.price)
      .replace(/{PRICEPERMINUTE}/g, result.pricePerMinute);

    resultsDiv.append(card);

    checkButton = document.querySelector(`#${id} #checkButton`);
    checkButton.addEventListener("click", () => { checkAvailability(id)})

    bookButton = document.querySelector(`#${id} #bookButton`);
    bookButton.addEventListener("click", () => { tryBooking(id) });
  });

  if (results.length != 0) {
    showMoreButton = document.createElement("button");
    showMoreButton.setAttribute("id", "showMoreBtn");
    showMoreButton.append(document.createTextNode("Show more"));
  
    showMoreButton.addEventListener("click", showMore);
  
    resultsDiv.append(showMoreButton);
  }
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

function getInputsOfCard(id) {
  dateInput = document.querySelector(`#${id} input[name="date"]`).value;
  timeInput = document.querySelector(`#${id} input[name="time"]`).value;
  durationInput = document.querySelector(`#${id} input[name="duration"]`).value;

  return inputs = { date: dateInput, time: timeInput, duration: durationInput };
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
