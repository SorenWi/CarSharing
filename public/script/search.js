resultsDiv = document.getElementById("searchResults");
searchBar = document.getElementById("searchBar");
fuelType = document.getElementById("searchFuelType");
searchBtn = document.getElementById("searchBtn");

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
  resultsDiv.innerHTML = "";
  for (let i = 0; i < results.length; i++) {

    resultCard = document.createElement("div");
    resultCard.classList.add("card");

    resultCard.innerHTML = `
      <div class="cardHeader">
        <h3 class="cardHeading">${results[i].carName}</h3>
        <p class="cardSubheading">ID: ${results[i].carId}</p>
      </div>
      <h3 class="cardSectionHeading">Information</h3>
      <div class="cardSectionGrid3">
        <div>
          <h3 class="cardInfoHeading">Fuel Type</h3>
          <p>${results[i].fuelType}</p>
        </div>
        <div>
          <h3 class="cardInfoHeading">Time</h3>
          <p>Time Frame: ${results[i].earlyTime} - ${results[i].lateTime}</p>
          <p>Max Time: ${results[i].maxTime}</p>
        </div>
        <div>
          <h3 class="cardInfoHeading">Cost</h3>
          <p>Flatrate: ${results[i].flatrate}</p>
          <p>Cost per minute: ${results[i].costPerMinute}</p>
        </div>
      </div>

      <h3 class="cardSectionHeading">Check Availability / Book</h3>
      <div class="cardSectionGrid2">
        <label for="date">Date</label>
        <input type="date" name="date">
        <label for="time">Time</label>
        <input type="time" name="time">
        <label for="duration">Duration</label>
        <input type="number" name="duration">

        <button>Check Availability</button>
        <button>Book</button>
      </div>
    `;

    resultsDiv.append(resultCard);

    //event listener on buttons

    console.log(results[i].carName)
  }
}

async function showMore() {

}
