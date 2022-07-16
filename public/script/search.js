const resultsDiv = document.getElementById("searchResults");
const searchBar = document.getElementById("searchBar");
const fuelType = document.getElementById("searchFuelType");
const searchBtn = document.getElementById("searchBtn");
const searchAllBtn = document.getElementById("searchAllBtn");

const filterBtn = document.getElementById("filterBtn");
const filterDateInput = document.getElementById("filterDate");
const filterTimeInput = document.getElementById("filterTime");
const filterDurationInput = document.getElementById("filterDuration");

const searchResponseDiv = document.getElementById("searchResponse");

const cardTemplate = document.getElementById("cardTemplate").innerHTML;

searchBtn.addEventListener("click", search);
searchAllBtn.addEventListener("click", searchAll);
filterBtn.addEventListener("click", filterSearch);

let currentSearch = {};
let currentSearchResultAmount = 0;
let currentSearchIndex = 0;

// -- Searches

async function search() {
  if (searchBar.value == "" || fuelType.value == "") {
    showSearchResponse("Missing search input");
    return;
  }

  clearResults();
  const body = { showAll: false, useFilter: false, index: currentSearchIndex, searchText: searchBar.value, fuelType: fuelType.value};
  await getAndDisplaySearchResults(body, "Showing results");
}

async function searchAll() {
  clearResults();
  const body = { showAll: true, useFilter: false, index: currentSearchIndex };
  await getAndDisplaySearchResults(body, "Showing all");
}

async function filterSearch() {
  const { filterDate, filterTime, filterDuration } = getFilterValues();

  if ( filterDate == "" || filterTime == "" || filterDuration == "") {
    showSearchResponse("Missing filter input");
    return;
  }

  clearResults();

  const body = currentSearch;
  body.useFilter = true;
  body.resultAmount = currentSearchResultAmount;
  body.filterDate = filterDate;
  body.filterTime = filterTime;
  body.filterDuration = filterDuration;
  
  await getAndDisplaySearchResults(body, "Filter applied");
}

async function showMore() {
  const showMoreBtn = document.getElementById("showMoreBtn");
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

async function getAndDisplaySearchResults(body, message) {
  const results = await getSearchResults(body);
  showResults(results); 
  showSearchResponse(message);
}

// -- Managing Search Results

function clearResults() {
  currentSearchResultAmount = 0;
  currentSearchIndex = 0;
  resultsDiv.innerHTML = "";
}

function showResults(results) {
  results.forEach(function(result) {
    const card = document.createElement("div");
    card.classList.add("card");
    const id = result.carId;
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

    const checkButton = document.querySelector(`#${id} #checkButton`);
    checkButton.addEventListener("click", () => { checkAvailability(id)})

    const bookButton = document.querySelector(`#${id} #bookButton`);
    bookButton.addEventListener("click", () => { tryBooking(id) });
  });

  if (results.length != 0) {
    const showMoreButton = document.createElement("button");
    showMoreButton.setAttribute("id", "showMoreBtn");
    showMoreButton.append(document.createTextNode("Show more"));
  
    showMoreButton.addEventListener("click", showMore);
  
    resultsDiv.append(showMoreButton);
  }
}

// -- Interaction with search results

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
  //const response = await makeRequest("/bookCar", body);
  const response = await makeRequest("/bookCar", body);
  showCardResponse(id, response.message);
}

// -- Show feedback to user

function showCardResponse(id, message) {
  const responseDiv = document.querySelector(`#${id} .response`);
  responseDiv.innerHTML = "";
  responseDiv.append(document.createTextNode(message));
}

function showSearchResponse(message) {
  searchResponseDiv.innerHTML = "";
  searchResponseDiv.append(document.createTextNode(message));
}

// -- Helper functions

function getFilterValues() {
  return { filterDate: filterDateInput.value, filterTime: filterTimeInput.value, filterDuration: filterDurationInput.value};
}

function getInputsOfCard(id) {
  const dateInput = document.querySelector(`#${id} input[name="date"]`).value;
  const timeInput = document.querySelector(`#${id} input[name="time"]`).value;
  const durationInput = document.querySelector(`#${id} input[name="duration"]`).value;

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
