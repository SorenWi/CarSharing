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

    //Create Card Header
    cardHeading = document.createElement("h2");
    cardHeading.classList.add("cardHeading");
    cardHeading.append(document.createTextNode(results[i].carName));

    cardSubheading = document.createElement("p")
    cardSubheading.classList.add("cardSubheading");
    cardSubheading.append(document.createTextNode("ID: " + results[i].carId));

    cardHeader = document.createElement("div");
    cardHeader.classList.add("cardHeader");

    cardHeader.append(cardHeading);
    cardHeader.append(cardSubheading);

    //Create Card Info Section
    //Section Header
    infoSectionHeading = document.createElement("h3");
    infoSectionHeading.classList.add("cardSectionHeading");
    infoSectionHeading.append(document.createTextNode("Information"));

    //Section Info
    infoSectionContainer = document.createElement("div");
    infoSectionContainer.classList.add("cardSectionGrid3");

    //Fuel type
    fuelInfoContainer = document.createElement("div");

    fuelTypeHeading = document.createElement("h3");
    fuelTypeHeading.classList.add("cardInfoHeading")
    fuelTypeHeading.append(document.createTextNode("Fuel Type"))

    fuelTypeInfo = document.createElement("p")
    fuelTypeInfo.classList.add("cardInfo");
    fuelTypeInfo.append(document.createTextNode(results[i].fuelType));
    
    fuelInfoContainer.append(fuelTypeHeading);
    fuelInfoContainer.append(fuelTypeInfo);

    //Time
    timeInfoContainer = document.createElement("div");

    timeHeading = document.createElement("h3");
    timeHeading.classList.add("cardInfoHeading");
    timeHeading.append(document.createTextNode("Time"));

    timeFrame = document.createElement("p");
    timeFrameString = `time frame: ${results[i].earlyTime} - ${results[i].lateTime}`;
    timeFrame.classList.add("cardInfo"); 
    timeFrame.append(document.createTextNode(timeFrameString));

    maxTime = document.createElement("p")
    maxTime.classList.add("cardInfo");
    maxTime.append(document.createTextNode("max time (minutes): " + results[i].maxTime));

    timeInfoContainer.append(timeHeading);
    timeInfoContainer.append(timeFrame);
    timeInfoContainer.append(maxTime);

    //Pricing
    pricingInfoContainer = document.createElement("div");

    pricingHeading = document.createElement("h3");
    pricingHeading.classList.add("cardInfoHeading");
    pricingHeading.append(document.createTextNode("Pricing"));

    flatrate = document.createElement("p")
    flatrate.classList.add("cardInfo");
    flatrate.append(document.createTextNode("flatrate:" + results[i].flatrate));

    costPerMinute = document.createElement("p")
    costPerMinute.classList.add("cardInfo");
    costPerMinute.append(document.createTextNode("cost per minute: " + results[i].costPerMinute));
    
    pricingInfoContainer.append(pricingHeading);
    pricingInfoContainer.append(flatrate);
    pricingInfoContainer.append(costPerMinute);

    //Combine everything
    infoSectionContainer.append(fuelInfoContainer);
    infoSectionContainer.append(timeInfoContainer);
    infoSectionContainer.append(pricingInfoContainer);

    //Input section
    inputSectionHeading = document.createElement("h3");
    inputSectionHeading.classList.add("cardSectionHeading");
    inputSectionHeading.append(document.createTextNode("Check Availability / Book"))
    
    inputSectionContainer = document.createElement("div");
    inputSectionContainer.classList.add("cardSectionGrid2");

    //Date input
    dateInputLabel = document.createElement("label");
    dateInputLabel.classList.add("cardLabel");
    dateInputLabel.setAttribute("for", "date");
    dateInputLabel.append(document.createTextNode("Date"));

    dateInput = document.createElement("input");
    dateInput.classList.add("cardInput");
    dateInput.setAttribute("name", "date");
    dateInput.setAttribute("type", "date");

    inputSectionContainer.append(dateInputLabel);
    inputSectionContainer.append(dateInput);

    //Time input
    timeInputLabel = document.createElement("label");
    timeInputLabel.classList.add("cardLabel");
    timeInputLabel.setAttribute("for", "time");
    timeInputLabel.append(document.createTextNode("Time"));

    timeInput = document.createElement("input");
    timeInput.classList.add("cardInput");
    timeInput.setAttribute("name", "time");
    timeInput.setAttribute("type", "time");

    inputSectionContainer.append(timeInputLabel);
    inputSectionContainer.append(timeInput);

    //Duration input
    durationInputLabel = document.createElement("label");
    durationInputLabel.classList.add("cardLabel");
    durationInputLabel.setAttribute("for", "duration");
    durationInputLabel.append(document.createTextNode("Duration"));

    durationInput = document.createElement("input");
    durationInput.classList.add("cardInput");
    durationInput.setAttribute("name", "duration");
    durationInput.setAttribute("type", "number");

    inputSectionContainer.append(durationInputLabel);
    inputSectionContainer.append(durationInput);

    //Buttons 
    

    //Check availability button
    checkButton = document.createElement("button");
    checkButton.classList.add("cardButton");
    checkButton.append(document.createTextNode("Check Price/Availability"));
    //Book button
    bookButton = document.createElement("button");
    bookButton.classList.add("cardButton");
    bookButton.append(document.createTextNode("Book"));


    inputSectionContainer.append(checkButton);
    inputSectionContainer.append(bookButton);

    resultCard.append(cardHeader);
    resultCard.append(infoSectionHeading);
    resultCard.append(infoSectionContainer);

    resultCard.append(inputSectionHeading);
    resultCard.append(inputSectionContainer);

    resultsDiv.append(resultCard);
    //create html elements to show data from results
    console.log(results[i].carName)
  }
}

async function showMore() {

}
