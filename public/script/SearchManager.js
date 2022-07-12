class SearchManager {
    constructor() {
        this.serverCommunication;
        this.resultsDiv;
        this.searchBar = document.getElementById("searchBar");
        this.fuelType = document.getElementById("searchFuelType");
        console.log(this.fuelType);
        this.setup();
    }

    async setup() {
        await this.setupServerCommunication();
        this.setupHTML();
        this.setupSearchVariables();
    }

    async setupServerCommunication() {
        const { ServerCommunication } = await import("./ServerCommunication.js");
        this.serverCommunication = new ServerCommunication();
    }

    setupHTML() {
        this.resultsDiv = document.getElementById("searchResults");
        this.searchBar = document.getElementById("searchBar");
        //this.fuelType = document.getElementById("searchFuelType");
        this.searchBtn = document.getElementById("searchBtn");
        this.searchAllBtn = document.getElementById("searchAllBtn");

        this.filterBtn = document.getElementById("filterBtn");
        this.filterDateInput = document.getElementById("filterDate");
        this.filterTimeInput = document.getElementById("filterTime");
        this.filterDurationInput = document.getElementById("filterDuration");

        this.searchResponseDiv = document.getElementById("searchResponse");

        this.cardTemplate = document.getElementById("cardTemplate").innerHTML;

        console.log(this.fuelType);
        this.searchBtn.addEventListener("click", this.search);
        this.searchAllBtn.addEventListener("click", this.searchAll);
        this.filterBtn.addEventListener("click", this.filterSearch);
        
    }

    setupSearchVariables() {
        this.currentSearch = {};
        this.currentSearchResultAmount = 0;
        this.currentSearchIndex = 0;
    }

    async search() {
        if (searchBar.value == "" || this.fuelType.value == "") {
            this.showSearchResponse("Missing search input");
            return;
        }
        
        this.clearResults();
        const body = { showAll: false, useFilter: false, index: currentSearchIndex, searchText: searchBar.value, fuelType: fuelType.value};
        const results = await this.getSearchResults(body);
        this.showResults(results); 
        this.showSearchResponse("Showing results");
    }

    

    async searchAll() {
        this.clearResults();
        const body = { showAll: true, useFilter: false, index: currentSearchIndex };
        const results = await getSearchResults(body);
        showResults(results); 
        showSearchResponse("Showing all");
    }
    async filterSearch() {}

    //--- MANAGING RESULTS ---
    showResults(results) {
        //https://stackoverflow.com/questions/16270761/how-to-insert-a-large-block-of-html-in-javascript
        
        results.forEach(function(result) {
          let card = document.createElement("div");
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

    clearResults() {
        currentSearchResultAmount = 0;
        currentSearchIndex = 0;
        resultsDiv.innerHTML = "";
    }

    //--- HANDLING INTERACTION WITH RESULTS ---

    showSearchResponse(message) {
        this.searchResponseDiv.innerHTML = "";
        this.searchResponseDiv.append(document.createTextNode(message));
    }

}

const searchManager = new SearchManager();