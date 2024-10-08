const calendar = document.querySelector(".calendar"),
    date = document.querySelector(".date"),
    daysContainer = document.querySelector(".days"),
    prev = document.querySelector(".prev"),
    next = document.querySelector(".next"),
    todayBtn = document.querySelector(".today-btn"),
    gotoBtn = document.querySelector(".goto-btn"),
    dateInput = document.querySelector(".date-input"),
    eventDay = document.querySelector(".event-day"),
    eventDate = document.querySelector(".event-date"),
    eventsContainer = document.querySelector(".events"),
    addEventBtn = document.querySelector(".add-event"),
    addEventWrapper = document.querySelector(".add-event-wrapper "),
    addEventCloseBtn = document.querySelector(".close "),
    addEventTitle = document.querySelector(".event-name "),
    addEventFrom = document.querySelector(".event-time-from "),
    addEventTo = document.querySelector(".event-time-to "),
    addEventSubmit = document.querySelector(".add-event-btn ");

// current day month year
let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();


// list of month name
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

// const eventsArr = [
//   {
//     day: 13,
//     month: 11,
//     year: 2022,
//     events: [
//       {
//         title: "Event 1 lorem ipsun dolar sit genfa tersd dsad ",
//         time: "10:00 AM",
//       },
//       {
//         title: "Event 2",
//         time: "11:00 AM",
//       },
//     ],
//   },
// ];


const eventsArr = [];
getEvents();
// console.log(eventsArr);


//function to add days in days with class day and prev-date next-date on previous month and next month days and active on today
function initCalendar() {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const day = firstDay.getDay();
    const nextDays = 7 - lastDay.getDay() - 1;
    date.innerHTML = months[month] + " " + year;
    let days = "";
    for (let x = day; x > 0; x--) {
        days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
    }
    for (let i = 1; i <= lastDate; i++) {
        //check if event is present on that day
        let event = false;
        eventsArr.forEach((eventObj) => {
            if (
                eventObj.day === i &&
                eventObj.month === month + 1 &&
                eventObj.year === year
            ) {
                event = true;
            }
        });
        if (
            i === new Date().getDate() &&
            year === new Date().getFullYear() &&
            month === new Date().getMonth()
        ) {
            activeDay = i;
            getActiveDay(i);
            updateEvents(i);
            if (event) {
                days += `<div class="day today active event">${i}</div>`;
            } else {
                days += `<div class="day today active">${i}</div>`;
            }
        } else {
            if (event) {
                days += `<div class="day event">${i}</div>`;
            } else {
                days += `<div class="day ">${i}</div>`;
            }
        }
    }
    for (let j = 1; j <= nextDays; j++) {
        days += `<div class="day next-date">${j}</div>`;
    }
    daysContainer.innerHTML = days;
    addListner();
    let monthh = document.querySelector(".date").textContent.slice(0, document.querySelector(".date").textContent.lastIndexOf(" "))
    let yearr = document.querySelector(".date").textContent.slice(document.querySelector(".date").textContent.lastIndexOf(" ") + 1);
    let fate = JSON.parse(localStorage.getItem("markedEventDates"));
    [...document.querySelectorAll(".day:not(.prev-date):not(.next-date)")].forEach(elem => {
        fate && fate.forEach(item => {
            if (item.day == elem.textContent && item.month == monthh && item.year == yearr) {
                elem.classList.add("marked")
            }
        })
    })
    let events = JSON.parse(localStorage.getItem("events"));
    [...document.querySelectorAll(".day:not(.prev-date):not(.next-date)")].forEach(elem => {
        events && events.forEach(item => {
            // console.log(item.day, elem.textContent, item.month, monthh, item.year, yearr)
            if (item.day == elem.textContent && item.month == months.indexOf(monthh) + 1 && item.year == yearr) {
                elem.classList.add("event")
            }
        })
    })
}


//function to add month and year on prev and next button
function prevMonth() {
    month--;
    if (month < 0) {
        month = 11;
        year--;
    }
    initCalendar();
}
function nextMonth() {
    month++;
    if (month > 11) {
        month = 0;
        year++;
    }
    initCalendar();
}

// prev.addEventListener("click", prevMonth);
// next.addEventListener("click", nextMonth);
prev.addEventListener('click', function () {
    prevMonth();
});
next.addEventListener('click', function () {
    nextMonth();
});
initCalendar();


// arrow key to goto next or previous month
document.addEventListener('keydown', function (event) {
    // Check if any input field is focused
    const isInputFocused = document.activeElement.tagName.toLowerCase() === 'input';

    if (!isInputFocused) {
        if (event.key === 'ArrowRight') {
            next.click();
        } else if (event.key === 'ArrowLeft') {
            prev.click();
        }
    }
});


// swipe gesture for changing month i.e. next and previous
const leftElement = document.querySelector('.left');
// Initialize Hammer.js for swipe gestures on the left element
    const hammerLeft = new Hammer(leftElement);

    // Handle swipe left and right gestures only on the left element
    hammerLeft.on('swipeleft swiperight', function (event) {
        if (event.type === 'swiperight') {
            prev.click();
        } else if (event.type === 'swipeleft') {
            next.click();
        }
    });


//function to add active on day
function addListner() {
    const days = document.querySelectorAll(".day");
    days.forEach((day) => {
        day.addEventListener("click", (e) => {
            getActiveDay(e.target.innerHTML);
            updateEvents(Number(e.target.innerHTML));
            activeDay = Number(e.target.innerHTML);
            //remove active
            days.forEach((day) => {
                day.classList.remove("active");
            });
            //if clicked prev-date or next-date switch to that month
            if (e.target.classList.contains("prev-date")) {
                prevMonth();
                //add active to clicked day afte month is change
                setTimeout(() => {
                    //add active where no prev-date or next-date
                    const days = document.querySelectorAll(".day");
                    days.forEach((day) => {
                        if (
                            !day.classList.contains("prev-date") &&
                            day.innerHTML === e.target.innerHTML
                        ) {
                            day.classList.add("active");
                        }
                    });
                }, 100);
            } else if (e.target.classList.contains("next-date")) {
                nextMonth();
                //add active to clicked day afte month is changed
                setTimeout(() => {
                    const days = document.querySelectorAll(".day");
                    days.forEach((day) => {
                        if (
                            !day.classList.contains("next-date") &&
                            day.innerHTML === e.target.innerHTML
                        ) {
                            day.classList.add("active");
                        }
                    });
                }, 100);
            } else {
                e.target.classList.add("active");
            }
        });
    });
}

// goto today month and shows todays date
todayBtn.addEventListener("click", () => {
    today = new Date();
    month = today.getMonth();
    year = today.getFullYear();
    initCalendar();
});


// input the valid date
dateInput.addEventListener("input", (e) => {
    dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
    if (dateInput.value.length === 2) {
        dateInput.value += "/";
    }
    if (dateInput.value.length > 7) {
        dateInput.value = dateInput.value.slice(0, 7);
    }
    if (e.inputType === "deleteContentBackward") {
        if (dateInput.value.length === 3) {
            dateInput.value = dateInput.value.slice(0, 2);
        }
    }
});


// goto specific date
gotoBtn.addEventListener("click", gotoDate);
function gotoDate() {
    // console.log("here");
    const dateArr = dateInput.value.split("/");
    if (dateArr.length === 2) {
        if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
            month = dateArr[0] - 1;
            year = dateArr[1];
            initCalendar();
            return;
        }
    }
    alert("Invalid Date");
}


//function get active day day name and date and update eventday eventdate
function getActiveDay(date) {
    const day = new Date(year, month, date);
    const dayName = day.toString().split(" ")[0];
    eventDay.innerHTML = dayName;
    eventDate.innerHTML = date + " " + months[month] + " " + year;
}


//function update events when a day is active
function updateEvents(date) {
    let events = "";
    eventsArr.forEach((event) => {
        if (
            date == event.day &&
            month + 1 == event.month &&
            year == event.year
        ) {
            event.events.forEach((event) => {
                events += `<div class="event">
            <div class="title">
              <i class="fas fa-circle"></i>
              <h3 class="event-title">${event.title}</h3>
            </div>
            <div class="event-time">
              <span class="event-time">${event.time}</span>
            </div>
        </div>`;
            });
        }
    });
    if (events === "") {
        events = `<div class="no-event">
            <h3>No Events</h3>
        </div>`;
    }
    eventsContainer.innerHTML = events;
    saveEvents();
}


//function to add event
addEventBtn.addEventListener("click", () => {
    addEventWrapper.classList.toggle("active");
});
addEventCloseBtn.addEventListener("click", () => {
    addEventWrapper.classList.remove("active");
});
document.addEventListener("click", (e) => {
    if (e.target !== addEventBtn && !addEventWrapper.contains(e.target)) {
        addEventWrapper.classList.remove("active");
    }
});


//allow 50 chars in eventtitle
addEventTitle.addEventListener("input", (e) => {
    addEventTitle.value = addEventTitle.value.slice(0, 60);
});


// shows the credit in bottom of calendar
function defineProperty() {
    var osccred = document.createElement("div");
    //   osccred.innerHTML =
    //     "A Project By <a href='https://bibekchandsah.github.io/bibek/' target=_blank>Developed by Bibek</a>";
    osccred.style.position = "absolute";
    osccred.style.bottom = "0";
    osccred.style.right = "0";
    osccred.style.fontSize = "10px";
    osccred.style.color = "#ccc";
    osccred.style.fontFamily = "sans-serif";
    //   osccred.style.padding = "5px";
    osccred.style.background = "#fff";
    osccred.style.borderTopLeftRadius = "5px";
    osccred.style.borderBottomRightRadius = "5px";
    osccred.style.boxShadow = "0 0 5px #ccc";
    document.body.appendChild(osccred);
}
defineProperty();


// allow only time in eventtime from and to
addEventFrom.addEventListener("input", (e) => {
    addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
    if (addEventFrom.value.length === 2) {
        addEventFrom.value += ":";
    }
    if (addEventFrom.value.length > 5) {
        addEventFrom.value = addEventFrom.value.slice(0, 5);
    }
});
addEventTo.addEventListener("input", (e) => {
    addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
    if (addEventTo.value.length === 2) {
        addEventTo.value += ":";
    }
    if (addEventTo.value.length > 5) {
        addEventTo.value = addEventTo.value.slice(0, 5);
    }
});


//function to add event to eventsArr
addEventSubmit.addEventListener("click", () => {
    const eventTitle = addEventTitle.value;
    const eventTimeFrom = addEventFrom.value;
    const eventTimeTo = addEventTo.value;
    // if (eventTitle === "" || eventTimeFrom === "" || eventTimeTo === "") {
    //     alert("Please fill all the fields");
    //     return;
    // }
    //check correct time format 24 hour
    const timeFromArr = eventTimeFrom.split(":");
    const timeToArr = eventTimeTo.split(":");
    // if (
    //     timeFromArr.length !== 2 ||
    //     timeToArr.length !== 2 ||
    //     timeFromArr[0] > 23 ||
    //     timeFromArr[1] > 59 ||
    //     timeToArr[0] > 23 ||
    //     timeToArr[1] > 59
    // ) {
    //     alert("Invalid Time Format");
    //     return;
    // }
    const timeFrom = convertTime(eventTimeFrom);
    const timeTo = convertTime(eventTimeTo);
    //check if event is already added
    let eventExist = false;
    eventsArr.forEach((event) => {
        if (
            event.day === activeDay &&
            event.month === month + 1 &&
            event.year === year
        ) {
            event.events.forEach((event) => {
                if (event.title === eventTitle) {
                    eventExist = true;
                }
            });
        }
    });
    if (eventExist) {
        alert("Event already added");
        return;
    }
    const newEvent = {
        title: eventTitle,
        time: timeFrom + " - " + timeTo,
    };
    // console.log(newEvent);
    // console.log(activeDay);
    let eventAdded = false;
    if (eventsArr.length > 0) {
        eventsArr.forEach((item) => {
            if (
                item.day === activeDay &&
                item.month === month + 1 &&
                item.year === year
            ) {
                item.events.push(newEvent);
                eventAdded = true;
            }
        });
    }
    if (!eventAdded) {
        eventsArr.push({
            day: activeDay,
            month: month + 1,
            year: year,
            events: [newEvent],
        });
    }
    // console.log(eventsArr);
    addEventWrapper.classList.remove("active");
    addEventTitle.value = "";
    addEventFrom.value = "";
    addEventTo.value = "";
    updateEvents(activeDay);
    //select active day and add event class if not added
    const activeDayEl = document.querySelector(".day.active");
    if (!activeDayEl.classList.contains("event")) {
        activeDayEl.classList.add("event");
    }
});


//function to delete event when clicked on event
eventsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("event")) {
        if (confirm("Are you sure you want to delete this event?")) {
            const eventTitle = e.target.children[0].children[1].innerHTML;
            eventsArr.forEach((event) => {
                if (
                    event.day == activeDay &&
                    event.month == month + 1 &&
                    event.year == year
                ) {
                    event.events.forEach((item, index) => {
                        if (item.title == eventTitle) {
                            event.events.splice(index, 1);
                        }
                    });
                    //if no events left in a day then remove that day from eventsArr
                    if (event.events.length == 0) {
                        eventsArr.splice(eventsArr.indexOf(event), 1);
                        //remove event class from day
                        const activeDayEl = document.querySelector(".day.active");
                        if (activeDayEl.classList.contains("event")) {
                            activeDayEl.classList.remove("event");
                        }
                    }
                }
            });
            updateEvents(activeDay);
        }
    }
});


//function to save events in local storage
function saveEvents() {
    localStorage.setItem("events", JSON.stringify(eventsArr));
}
//function to get events from local storage
function getEvents() {
    //check if events are already saved in local storage then return event else nothing
    if (localStorage.getItem("events") === null) {
        return;
    }
    eventsArr.push(...JSON.parse(localStorage.getItem("events")));
}
//convert time to 24 hour format
function convertTime(time) {
    let timeArr = time.split(":");
    let timeHour = timeArr[0];
    let timeMin = timeArr[1];
    let timeFormat = timeHour >= 12 ? "PM" : "AM";
    timeHour = timeHour % 12 || 12;
    time = timeHour + ":" + timeMin + " " + timeFormat;
    return time;
}


// auto focus on input field and works on enter button
document.addEventListener('DOMContentLoaded', function () {
    const eventNameInput = document.querySelector('.event-name');
    const eventTimeFromInput = document.querySelector('.event-time-from');
    const eventTimeToInput = document.querySelector('.event-time-to');
    const addEventBtn = document.querySelector('.add-event-btn');
    const focusEventNameBtn = document.querySelector('.add-event');

    focusEventNameBtn.addEventListener('click', function () {
        eventNameInput.focus();
    });
    eventNameInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            eventTimeFromInput.focus();
        }
    });
    eventTimeFromInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            eventTimeToInput.focus();
        }
    });
    eventTimeToInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            addEventBtn.click();
        }
    });
    addEventBtn.addEventListener('click', function () {
        // Add your logic for handling the "Add Event" button click
        //   alert('Event added!');
    });
});
// press enter to jump on certain date
document.addEventListener('DOMContentLoaded', function () {
    const dateInput = document.querySelector('.date-input');
    const gotoBtn = document.querySelector('.goto-btn');
    // display current date value on date input
    // dateInput.value = (new Date()).getMonth() + 1 + "/" + (new Date()).getFullYear();
    dateInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            gotoBtn.click();
        }
    });
    gotoBtn.addEventListener('click', function () {
        // Add your logic for handling the "Go to Date" button click
        //   alert('Navigating to the specified date!');
    });
});


// sore the marked date in local storage
document.addEventListener('DOMContentLoaded', function () {
    const calendarDays = document.querySelector('.days');
    // Retrieve stored dates array from localStorage
    const storedDates = JSON.parse(localStorage.getItem('markedEventDates')) || [];
    // Mark the dates if they were stored
    let fate = JSON.parse(localStorage.getItem("markedEventDates"));
    [...document.querySelectorAll(".day:not(.prev-date):not(.next-date)")].forEach(elem => {
        if (fate && fate.includes(elem.textContent)) {
            elem.classList.add("marked")
        }
    })
    calendarDays.addEventListener('click', function (event) {
        const clickedDate = {
            year: document.querySelector(".date").textContent.slice(document.querySelector(".date").textContent.lastIndexOf(" ") + 1),
            day: event.target.textContent,
            month: document.querySelector(".date").textContent.slice(0, document.querySelector(".date").textContent.lastIndexOf(" "))
        };
        //if (!isNaN(clickedDate)) {
        toggleDateMarking(event.target);
        // Update the array of marked dates and store in localStorage
        updateMarkedDates(clickedDate, event.target);
        //}
    });
});


// Toggle the marking class
function toggleDateMarking(element) {
    element.classList.toggle('marked');
    let monthh = document.querySelector(".date").textContent.slice(0, document.querySelector(".date").textContent.lastIndexOf(" "))
    let yearr = document.querySelector(".date").textContent.slice(document.querySelector(".date").textContent.lastIndexOf(" ") + 1);
    if (!element.classList.contains('marked')) {
        let fate = JSON.parse(localStorage.getItem("markedEventDates"));

        fate && fate.forEach((item, index) => {
            if (item.day == element.textContent && item.month == monthh && item.year == yearr) {
                fate[index] = { year: "", day: "", month: "" }

                localStorage.setItem("markedEventDates", JSON.stringify(fate));
            }
        })
    }
}


// Add a date to the list of marked dates or remove it
// update the marked date on local storage
function updateMarkedDates(clickedDate, elem) {
    if (!elem.classList.contains("marked"))
        return;
    // Retrieve stored dates array from localStorage
    const storedDates = JSON.parse(localStorage.getItem('markedEventDates')) || [];
    // Check if the date is already in the array
    const index = storedDates.indexOf(clickedDate);
    if (index !== -1) {
        // If date is already in the array, remove it
        storedDates.splice(index, 1);
    } else {
        // If date is not in the array, add it
        storedDates.push(clickedDate);
    }
    // Store the updated array of marked dates in localStorage
    localStorage.setItem('markedEventDates', JSON.stringify(storedDates));
}

// get the selected date
function findDateElementByValue(calendarDays, value) {
    // Find and return the element with the specified value
    const dateElements = calendarDays.querySelectorAll('.day');
    for (const dateElement of dateElements) {
        // if (dateElement.textContent && dateElement.textContent.trim() === value.trim()) {
        //     return dateElement;
        // }
    }
    return null;
}
