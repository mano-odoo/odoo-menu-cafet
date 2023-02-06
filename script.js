  const devMode = true;

  const dataFeed = devMode ? 'http://localhost:8080?max_results=${maxResults}' : 'lol.json'

  if(devMode) console.log("Care, devmode is true");

    /**
    * Configure date and time
    */
   function setTime() {
    document.getElementById("time").innerHTML = new Date().toLocaleTimeString('en-GB', {hour: "numeric", minute: "numeric"});
  }

  setTime();
  setInterval(function() {
    setTime();
  }, 1000);
  document.getElementById("date").innerHTML = new Date().toLocaleDateString('en-GB', {weekday: 'long', day: "numeric", month: "long"});

  let eventsMap = {};

  function pushInTable(firstRow, secondRow, firstCellHTML, secondCellHTML) {
    const headerCell = document.createElement("th");
    const cell = document.createElement("td");

    headerCell.innerHTML = firstCellHTML;
    firstRow.appendChild(headerCell);

    cell.innerHTML = secondCellHTML;
    secondRow.appendChild(cell);
  }

  /**
   * Generate the table of the 5 nexts days
   */
  function generateTable() {
    const menu = document.getElementById('content');
    const table = document.createElement('table');

    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const firstRow = thead.insertRow();
    const secondRow = tbody.insertRow();

    const firstHeaderCell = document.createElement("th");
    firstRow.appendChild(firstHeaderCell);
    const firstCell = document.createElement("th");
    firstCell.innerHTML = "Lunch";
    secondRow.appendChild(firstCell);

    Object.entries(eventsMap).forEach(([date, events], index, eventsArray) => {
      const headerCell = document.createElement("th");
      const cell = document.createElement("td");
      const formattedEvents = events.join("<HR style=\"color: white;\"/>")

      pushInTable(firstRow, secondRow, formatDate(date), formattedEvents)

      if (index + 1 < eventsArray.length) {
        const next = new Date(eventsArray[index + 1][0]);
        if (containsWeekend(new Date(date), next)) {
          pushInTable(firstRow, secondRow, "", "Weekend 🥳")
        }
      }

    })

    table.appendChild(thead);
    table.appendChild(tbody);
    menu.appendChild(table);
  }

  function containsWeekend(d1, d2)
  {
      // note: I'm assuming d2 is later than d1 and that both d1 and d2 are actually dates
      // you might want to add code to check those conditions
      const interval = (d2 - d1) / (1000 * 60 * 60 * 24); // convert to days
      if (interval > 5) {
          return true;    // must contain a weekend day
      }
      const day1 = d1.getDay();
      const day2 = d2.getDay();
      return !(day1 > 0 && day2 < 6 && day2 > day1);
  }

  function formatDate(date) {
    return new Date(date).toLocaleString('en-GB', {weekday: 'short', day: "numeric", month: "numeric"}).replace(/,/g, '')
  }

  String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  }

  /**
   * Print the summary and start datetime/date of the next five events in
   * the authorized user's calendar.
   */
  function listUpcomingEvents() {
    const maxResults = 10;
    fetch(dataFeed)
    .then((response) => {
      response.json().then(function(events) {
        if (events.length > 0) {
          for (i = 0; i < events.length; i++) {
            const event = events[i];
            const summary = event.summary || "🤷";
            let when = event.start.dateTime;
            if (!when) {
              when = event.start.date;
            }

            if (!eventsMap[when]) {
                eventsMap[when] = []
            }
            eventsMap[when].push(summary.capitalize())
          }
          generateTable();
        }
      })
    })
  };

  window.onload=function(){listUpcomingEvents()};