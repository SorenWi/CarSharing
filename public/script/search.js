resultsDiv = document.getElementById("searchResults");
searchBar = document.getElementById("searchBar");
fuelType = document.getElementById("searchFuelType");
searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", search);

console.log("search js working");

async function search() {
  if (searchBar.value == "") {
    console.log("search bar empty");
    return;
  }

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
    
    carHeader = document.createElement("h2");
    carHeaderString = `${results[i].carName} - ${results[i].carId}`
    carHeader.append(document.createTextNode(carHeaderString));

    carId = document.createElement("p")
    carId.append(document.createTextNode(results[i].carId));

    carName = document.createElement("p")
    carName.append(document.createTextNode(results[i].carName));

    fuelType = document.createElement("p")
    fuelType.append(document.createTextNode(results[i].fuelType));
    
    timeFrame = document.createElement("p");
    timeFrameString = `${results[i].earlyTime} - ${results[i].lateTime}`; 
    timeFrame.append(document.createTextNode(timeFrameString));

    maxTime = document.createElement("p")
    maxTime.append(document.createTextNode(results[i].maxTime));

    flatrate = document.createElement("p")
    flatrate.append(document.createTextNode(results[i].flatrate));

    costPerMinute = document.createElement("p")
    costPerMinute.append(document.createTextNode(results[i].costPerMinute));
    
    resultCard.append(carHeader);
    resultCard.append(fuelType);
    resultCard.append(timeFrame);
    resultCard.append(maxTime);
    resultCard.append(flatrate);
    resultCard.append(costPerMinute);
    
    resultsDiv.append(resultCard);
    //create html elements to show data from results
    console.log(results[i].carName)
  }
}

async function showMore() {

}

/*
const myRequest = new Request('/url here/');
    
    async function getData () { 
    
    await fetch(request, {
          method: "GET"
        })
        .catch(() => {
          console.log("Fail zone");
        })
        .then((res) => {
          if (res.ok) {
            res.json().then((json) => {
             console.log(json)
            });
          } else {
            console.log("error", res);
          }
        });
      };
      */