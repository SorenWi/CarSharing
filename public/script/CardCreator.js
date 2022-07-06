export class CardCreator {

    constructor() {
        this.card = document.createElement("div");
        this.card.classList.add("card");
    }

    setHeader(heading, subheading) {
        this.heading = heading;
        this.subheading = subheading;
    }


    createCard() {
        this.header = this.createHeader();
        this.card.append(this.header);
        return this.card;
    }

    createHeader() {
        cardHeader =  document.createElement("div");
        cardHeader.classList.add("cardHeader");

        cardHeading = document.createElement("h2");
        cardHeading.classList.add("cardHeading");
        cardHeading.append(document.createTextNode(this.heading));

        cardSubheading = document.createElement("p")
        cardSubheading.classList.add("cardSubheading");
        cardSubheading.append(document.createTextNode(this.subheading));

        cardHeader.append(cardHeading);
        cardHeader.append(cardSubheading);

        return cardHeader;
    }

}