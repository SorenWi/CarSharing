upcomingBookingsBtn = document.getElementById("upcomingBookingsBtn");
pastBookingsBtn = document.getElementById("pastBookingsBtn");
bookingsContainer = document.getElementById("bookingsContainer");
bookingTemplate = document.getElementById("bookingTemplate").innerHTML;

upcomingBookingsBtn.addEventListener("click", showUpcomingBookings);
pastBookingsBtn.addEventListener("click", showPastBookings);


async function showUpcomingBookings() {
    const response = await makeRequest("/getBookings");
    showBookings(response.upcomingBookings);
}

async function showPastBookings() {
    const response = await makeRequest("/getBookings");
    showBookings(response.pastBookings);
}

function showBookings(bookings) {
    bookingsContainer.innerHTML = "";

    bookings.forEach((booking) => {
        card = document.createElement("div");
        
        card.innerHTML = bookingTemplate;
        card.innerHTML = card.innerHTML
            .replace(/{ID}/g, booking.carId)
            .replace(/{DATE}/g, booking.date)
            .replace(/{TIME}/g, booking.time)
            .replace(/{DURATION}/g, booking.duration)
            .replace(/{PRICE}/g, booking.price);
        
        bookingsContainer.append(card);
    });
}

async function makeRequest(path, body = {}) {
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
  