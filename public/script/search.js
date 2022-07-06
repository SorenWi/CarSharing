resultsDiv = document.getElementById("searchResults");
searchBar = document.getElementById("searchBar");
fuelType = document.getElementById("searchFuelType");
searchBtn = document.getElementById("searchBtn");

cardTemplate = document.getElementById("cardTemplate").innerHTML;

searchBtn.addEventListener("click", search);

console.log("search js working");

async function search() {

  url = "http://localhost:3000/search";

  const response = await fetch(url, 
    { method: "POST",
    headers: {
      'Content-Type': "application/json"
    },
    body: JSON.stringify({ searchText: searchBar.value, fuelType: fuelType.value})});

  const json = await response.json();
  console.log(json);
  showResults(json.results);
}

function showResults(results) {
  //clear previous search results
  //https://stackoverflow.com/questions/16270761/how-to-insert-a-large-block-of-html-in-javascript
  resultsDiv.innerHTML = "";
  for (let i = 0; i < results.length; i++) {
    card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = cardTemplate;
    card.innerHTML = card.innerHTML
      .replace(/{NAME}/g, results[i].carName)
      .replace(/{ID}/g, results[i].carId)
      .replace(/{FUELTYPE}/g, results[i].fuelType)
      .replace(/{TIMEFRAME}/g, `${results[i].earlyTime} - ${results[i].lateTime}`)
      .replace(/{MAXTIME}/g, results[i].maxTime)
      .replace(/{FLATRATE}/g, results[i].flatrate)
      .replace(/{COSTPERMINUTE}/g, results[i].costPerMinute);

    resultsDiv.append(card);

    console.log(results[i].carName)
  }
}

async function showMore() {

}
