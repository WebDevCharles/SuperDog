// Global var = Usually a bad idea.
const events = [{
        event: "ComicCon",
        city: "New York",
        state: "New York",
        attendance: 240000,
        date: "06/01/2020",
    },
    {
        event: "ComicCon",
        city: "New York",
        state: "New York",
        attendance: 250000,
        date: "06/01/2021",
    },
    {
        event: "ComicCon",
        city: "New York",
        state: "New York",
        attendance: 257000,
        date: "06/01/2022",
    },
    {
        event: "ComicCon",
        city: "San Diego",
        state: "California",
        attendance: 130000,
        date: "06/01/2020",
    },
    {
        event: "ComicCon",
        city: "San Diego",
        state: "California",
        attendance: 140000,
        date: "06/01/2021",
    },
    {
        event: "ComicCon",
        city: "San Diego",
        state: "California",
        attendance: 150000,
        date: "06/01/2022",
    },
    {
        event: "HeroesCon",
        city: "Charlotte",
        state: "North Carolina",
        attendance: 40000,
        date: "06/01/2020",
    },
    {
        event: "HeroesCon",
        city: "Charlotte",
        state: "North Carolina",
        attendance: 45000,
        date: "06/01/2021",
    },
    {
        event: "HeroesCon",
        city: "Charlotte",
        state: "North Carolina",
        attendance: 50000,
        date: "06/01/2022",
    },
];

// Building the dropdown menu.
function buildDropDown() {

    // First step: Get a handle on the drop down.
    let eventDD = document.getElementById("eventDropDownList");

    // Reset the list.
    eventDD.innerHTML = "";

    // <li><a class="dropdown-item" href="#"></a></li>
    // Get the template.
    let ddTemplate = document.getElementById("dropDown-template");

    // Get the template node.
    let ddItem = document.importNode(ddTemplate.content, true);

    let ddLink = ddItem.querySelector("a");
    ddLink.setAttribute("data-city", "All");
    ddLink.textContent = "All";
    eventDD.appendChild(ddItem);

    // Add links for the unique cities.
    let currentEvents = getEvents();
    // Get our data.

    // Get a unique or "distinct" array of city names.
    let distinctCities = [...new Set(currentEvents.map((event) => event.city))];

    // Filter the data to a unique set of cities.
    for (let index = 0; index < distinctCities.length; index++) {

        let ddItem = document.importNode(ddTemplate.content, true);

        let ddLink = ddItem.querySelector("a");
        ddLink.setAttribute("data-city", distinctCities[index]);
        ddLink.textContent = distinctCities[index];
        eventDD.appendChild(ddItem);
    }

    let statsHeader = document.getElementById("statsHeader");
    statsHeader.innerHTML = `Stats For All Events:`;

    displayStats(currentEvents);

    // Show data for all events
    displayEventData(currentEvents);

}

// Called every time a city name is clicked in the dropdown menu.
function getEventData(element) {
    let city = element.getAttribute("data-city");

    // Create the statistics for the "clicked" city.
    let currentEvents = getEvents();

    let filteredEvents = currentEvents;

    if (city != "All") {
        // Return an array with ONLY the events for the selected city.
        filteredEvents = currentEvents.filter(function (event) {

            if (event.city == city) {
                return event;
            }

        });
    }

    // Set the header
    let statsHeader = document.getElementById("statsHeader");
    statsHeader.innerHTML = `Statistics for ${city}:`;

    // Call a function to display the stats.
    displayStats(filteredEvents);

}

// Pulling events from local storage or the default array events.
function getEvents() {
    let currentEvents = JSON.parse(localStorage.getItem("eventData"));

    if (currentEvents === null) {
        currentEvents = events;
        localStorage.setItem("eventData", JSON.stringify(currentEvents));
    }

    return currentEvents;
}

// This function displays stats for the selected city.
function displayStats(filteredEvents) {

    let total = 0;
    let average = 0;
    let most = 0;
    let least = -1;
    let currentAttendance = 0;

    for (let index = 0; index < filteredEvents.length; index++) {

        currentAttendance = filteredEvents[index].attendance;
        total += currentAttendance;

        if (most < currentAttendance) {
            most = currentAttendance;
        }

        if (least > currentAttendance || least < 0) {
            least = currentAttendance;
        }

    }

    average = total / filteredEvents.length;

    // Write values to the page.
    document.getElementById("total").innerHTML = total.toLocaleString();
    document.getElementById("most").innerHTML = most.toLocaleString();
    document.getElementById("least").innerHTML = least.toLocaleString();
    document.getElementById("average").innerHTML = average.toLocaleString(
        undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }
    );

}

// This function displays all of the event data -
// In a grid on the bottom of the page.
function displayEventData(currentEvents) {
    let template = document.getElementById("eventData-template");
    let eventBody = document.getElementById("eventBody");

    // Clears the table of any previous data.
    eventBody.innerHTML = "";

    // Loop over all of the eventData and write a row for each event -
    // To the eventBody element.
    for (let index = 0; index < currentEvents.length; index++) {
        let eventRow = document.importNode(template.content, true)

        // Grab ONLY the columns from the template.
        // Creates an array of the columns in the template.
        let eventCols = eventRow.querySelectorAll("td");

        eventCols[0].textContent = currentEvents[index].event;
        eventCols[1].textContent = currentEvents[index].city;
        eventCols[2].textContent = currentEvents[index].state;
        eventCols[3].textContent = currentEvents[index].attendance;
        eventCols[4].textContent = new Date(currentEvents[index].date).toLocaleDateString();
        eventBody.appendChild(eventRow);

    }

}

function saveEventData() {
    // Get all of the course data from local storage
    let currentEvents = getEvents();

    let eventObj = {
        event: "name",
        city: "city",
        state: "state",
        attendance: 0,
        date: "01/01/2001",
    }

    // Get the values from the "add" form.
    eventObj.event = document.getElementById("newEventName").value;
    eventObj.city = document.getElementById("newEventCity").value;

    // Get values from the dropdown.
    let stateSel = document.getElementById("newEventState");
    eventObj.state = stateSel.options[stateSel.selectedIndex].text;

    // Turn the input into a number.
    let attendanceNmbr = parseInt(document.getElementById("newEventAttendance").value, 10);
    eventObj.attendance = attendanceNmbr;

    // Format the date.
    let eventDate = document.getElementById("newEventDate").value;
    let eventDateFormatted = `${eventDate} 00:00`;
    eventObj.date = new Date(eventDateFormatted).toLocaleDateString();

    // Save
    currentEvents.push(eventObj);
    localStorage.setItem("eventData", JSON.stringify(currentEvents));

    buildDropDown();

}