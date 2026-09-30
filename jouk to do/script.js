const monthButtons = document.querySelectorAll(".months button");
const monthList = document.querySelector(".months");
const eventCard = document.querySelector(".event-card");
const eventClose = document.querySelector(".event-close");
const previousMonthButton = document.querySelector(".month-step-prev");
const nextMonthButton = document.querySelector(".month-step-next");
const placeCards = document.querySelectorAll(".place-card");
const eventDay = document.querySelector("#event-day");
const eventMonth = document.querySelector("#event-month");
const eventTitle = document.querySelector("#event-title");
const eventSubtitle = document.querySelector("#event-subtitle");
const eventDescription = document.querySelector("#event-description");
const eventNote = document.querySelector("#event-note");
const eventLocation = document.querySelector("#event-location");
const eventPhoto = document.querySelector("#event-photo");
const eventLink = document.querySelector("#event-link");
const eventLabel = document.querySelector("#event-label");
const eventSwitcher = document.querySelector("#event-switcher");
let currentMonth = "OCT";
let currentEventIndex = 0;
let hasRenderedEvent = false;
let eventTransitionTimer;

const soukJara = {
  day: "",
  month: "JUN–SEP",
  title: "Souk Jara",
  url: "https://www.facebook.com/Jarammanjo/?locale=ar_AR",
  description: "Discover Jordanian crafts, food & culture.",
  location: "Rainbow Street, Amman",
  image: "souk-jara-updated.png",
  alt: "The entrance to Souk Jara in Amman"
};

const ammanWinterFestival = {
  day: "",
  month: "JANUARY",
  title: "Amman Winter Festival",
  url: "https://www.theabdali.com/",
  description: "Winter vibes, festive lights & fun experiences.",
  location: "Amman, Jordan",
  image: "amman-winter-festival.webp",
  alt: "Festive winter lights and snowman at a winter festival"
};
const jordanBaja = {
  day: "12–14",
  month: "FEBRUARY 2026",
  title: "Jordan Baja",
  url: "https://www.jordanbaja.com/",
  description: "Motorsport · Desert · Adventure",
  location: "Aqaba, Jordan",
  image: "jordan-baja.jpg",
  alt: "A rally car racing through the Jordanian desert"
};
const springInAjloun = {
  day: "",
  month: "MARCH",
  title: "Spring in Ajloun",
  hideLabel: true,
  description: "Wildflowers, green hills & spring trails.",
  location: "Ajloun, Jordan",
  image: "spring-in-ajloun.jpg",
  alt: "Spring wildflowers blooming in the hills of Ajloun"
};
const springInIrbid = {
  day: "",
  month: "MARCH",
  title: "Spring in Irbid",
  hideLabel: true,
  subtitle: "March",
  description: "Green hills, wildflowers & village life.",
  location: "Irbid, Jordan",
  image: "spring-in-irbid.webp",
  alt: "Green hills and a stream in the Irbid countryside"
};
const deadSeaUltraMarathon = {
  day: "",
  month: "APRIL",
  title: "Dead Sea Ultra Marathon",
  url: "https://registration.runjordan.com/Event/Details/1?utm_source=chatgpt.com",
  description: "Run from Amman to the Dead Sea.",
  location: "Amman → Dead Sea, Jordan",
  image: "dead-sea-ultra-marathon.jpg",
  alt: "A runner taking part in the Dead Sea Ultra Marathon"
};
const oneRunHalfMarathon = {
  day: "23",
  month: "MAY 2026",
  title: "One Run International Half Marathon",
  url: "https://www.sajilni.com/",
  description: "Run through the heart of Amman.",
  location: "Amman, Jordan",
  image: "one-run-half-marathon.png",
  alt: "Runners taking part in the One Run event in Amman"
};
const alBaladFestival = {
  day: "",
  month: "JUNE",
  title: "Al-Balad Music Festival",
  image: "al-balad-music-festival.png",
  hideLabel: true,
  url: "https://al-balad.org/al-balad-music-festival/?utm_source=chatgpt.com",
  note: "Held every two years · Next edition not announced",
  subtitle: "Music, culture & live performances",
  description: "Celebrating Arabic music and emerging artists.",
  location: "Roman Theatre, Downtown Amman",
  alt: "An evening performance at Al-Balad Music Festival in Amman"
};
const jerashFestival = {
  day: "",
  month: "JUL–AUG",
  title: "Jerash Festival",
  url: "https://jerashfestival.jo/",
  description: "Culture comes alive among ancient ruins.",
  location: "Jerash, Jordan",
  image: "jerash-festival.webp",
  alt: "Traditional dancers perform at Jerash Festival"
};

const europeanFilmFestival = {
  day: "",
  month: "SEPTEMBER",
  title: "European Film Festival",
  url: "https://euffjordan.com/",
  description: "Stories from Europe & Jordan",
  location: "Amman, Jordan",
  image: "european-film-festival.webp",
  alt: "An outdoor film screening in Amman"
};

const jordanFoodFestival = {
  day: "6–11",
  month: "AUGUST",
  title: "Jordan International Food Festival",
  hideLabel: true,
  url: "https://www.instagram.com/jiffestival/",
  note: "Dates may vary · Follow Instagram for updates",
  description: "A celebration of Jordanian and international food.",
  location: "Amman, Jordan",
  image: "jordan-international-food-festival.png",
  alt: "Jordan International Food Festival sign"
};
const ammanDesignWeek = {
  day: "2–17",
  month: "OCT 2026",
  title: "Amman Design Week",
  url: "https://ammandesignweek.com/",
  description: "Design, creativity & innovation in Amman.",
  location: "Amman, Jordan",
  note: "Biennial · The 2026 edition returns after a seven-year break",
  image: "amman-design-week.jpg",
  alt: "Design exhibition inside the Ras El Ain Hangar in Amman"
};
const ammanFilmFestival = {
  day: "",
  month: "26 JUL – 3 AUG",
  title: "Amman International Film Festival",
  subtitle: "Awal Film",
  description: "Cinema, stories & new voices.",
  location: "Amman, Jordan",
  image: "amman-international-film-festival.jpg",
  alt: "Amman International Film Festival at the Citadel"
};

const eventsByMonth = {
  JAN: [ammanWinterFestival],
  FEB: [jordanBaja],
  MAR: [springInIrbid, springInAjloun],
  APR: [deadSeaUltraMarathon],
  MAY: [oneRunHalfMarathon],
  JUN: [soukJara, alBaladFestival],
  JUL: [jerashFestival, soukJara],
  AUG: [ammanFilmFestival, jordanFoodFestival, soukJara, jerashFestival],
  SEP: [europeanFilmFestival, soukJara],
  OCT: [{
    day: "",
    month: "OCTOBER",
    title: "Balloons Over Rum",
    url: "https://balloonsoverrum.com/",
    description: "Taste the desert from above.",
    location: "Wadi Rum",
    image: "balloons-over-rum.jpg",
    alt: "A hot air balloon in Wadi Rum"
  }, ammanDesignWeek],
  NOV: [{
    day: "",
    month: "NOVEMBER",
    title: "Jordan Olive Festival",
    url: "https://www.narc.gov.jo/",
    description: "Taste the season. Meet the makers.",
    location: "National Agricultural Research Center, Amman",
    image: "jordan-olive-festival.jpg",
    alt: "Olive products at a Jordanian olive festival"
  }],
  DEC: [{
    day: "20",
    month: "DECEMBER",
    title: "Christmas Tree Lighting – Petra",
    url: "https://calendar.jo/Events/View/1439",
    description: "Celebrate Christmas under the stars of Petra.",
    location: "Petra, Jordan",
    image: "christmas-tree-lighting-petra.jpg",
    alt: "Christmas tree lighting at Petra"
  }]
};

function showEvent(month, eventIndex = 0) {
  currentMonth = month;
  currentEventIndex = eventIndex;
  const events = eventsByMonth[month] || [];
  const monthOrder = Array.from(monthButtons, (button) => button.dataset.month);
  const monthIndex = monthOrder.indexOf(month);
  previousMonthButton.disabled = monthIndex <= 0;
  nextMonthButton.disabled = monthIndex >= monthOrder.length - 1;
monthButtons.forEach((button) => {
    const selected = button.dataset.month === month;
    button.classList.toggle("selected", selected);
    button.tabIndex = selected ? 0 : -1;
    if (selected) button.setAttribute("aria-pressed", "true");
    else button.removeAttribute("aria-pressed");
  });

  eventSwitcher.replaceChildren();
  const event = events[eventIndex];
  eventCard.classList.toggle("empty", !event);

  if (!event) {
    eventDay.textContent = "";
    eventMonth.textContent = month;
    eventTitle.textContent = "No event added yet";
    eventSubtitle.textContent = "";
    eventSubtitle.hidden = true;
    eventDescription.textContent = "Check back for updates.";
    eventLocation.textContent = "";
    eventPhoto.removeAttribute("src");
    eventLink.hidden = true;
    eventPhoto.alt = "";
    animateEventCard();
    return;
  }

  eventDay.textContent = event.day;
  eventMonth.textContent = event.month;
  eventMonth.classList.toggle("range", event.month.length > 5);
  eventTitle.textContent = event.title;
  eventLabel.hidden = Boolean(event.hideLabel);
  eventSubtitle.textContent = event.subtitle || "";
  eventSubtitle.hidden = !event.subtitle;
  eventNote.textContent = event.note || "";
  eventNote.href = event.url || "#";
  eventNote.hidden = !event.note;
  eventDescription.textContent = event.description;
  eventLocation.textContent = event.location;
  eventPhoto.src = event.image;
  eventLink.hidden = !event.url;
  eventLink.href = event.url || "";
  eventPhoto.alt = event.alt;

  if (events.length > 1) {
    const previousChoice = document.createElement("button");
    previousChoice.type = "button";
    previousChoice.className = "event-step event-step-prev";
    previousChoice.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m7 7-7-7 7-7"/></svg>';
    previousChoice.setAttribute("aria-label", "Previous event");
    previousChoice.addEventListener("click", () => showEvent(month, (eventIndex - 1 + events.length) % events.length));
    eventSwitcher.append(previousChoice);

    events.forEach((item, index) => {
      const choice = document.createElement("button");
      choice.type = "button";
      choice.className = `event-choice${index === eventIndex ? " selected" : ""}`;
      choice.textContent = item.title;
      choice.addEventListener("click", () => showEvent(month, index));
      eventSwitcher.append(choice);
    });

    const nextChoice = document.createElement("button");
    nextChoice.type = "button";
    nextChoice.className = "event-step event-step-next";
    nextChoice.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m7 7-7-7 7-7"/></svg>';
    nextChoice.setAttribute("aria-label", "Next event");
    nextChoice.addEventListener("click", () => showEvent(month, (eventIndex + 1) % events.length));
    eventSwitcher.append(nextChoice);
  }
  animateEventCard();
}

function animateEventCard() {
  if (!hasRenderedEvent) {
    hasRenderedEvent = true;
    return;
  }
  eventCard.classList.remove("switching");
  void eventCard.offsetWidth;
  eventCard.classList.add("switching");
  window.clearTimeout(eventTransitionTimer);
  eventTransitionTimer = window.setTimeout(() => eventCard.classList.remove("switching"), 400);
}

function stepMonth(direction) {
  const monthOrder = Array.from(monthButtons, (button) => button.dataset.month);
  const currentIndex = monthOrder.indexOf(currentMonth);
  const nextIndex = Math.max(0, Math.min(monthOrder.length - 1, currentIndex + direction));
  if (nextIndex === currentIndex) return;
  if (expandedCard && expandedCard !== eventCard) closeExpandedCard();
  showEvent(monthOrder[nextIndex]);
}

let expandedCard = null;

function closeExpandedCard() {
  if (!expandedCard) return;
  expandedCard.classList.remove("expanded");
  if (expandedCard === eventCard) {
    eventCard.setAttribute("aria-expanded", "false");
    eventCard.setAttribute("aria-label", "Expand featured event");
    eventClose.hidden = true;
    previousMonthButton.hidden = true;
    nextMonthButton.hidden = true;
  }
  expandedCard = null;
  document.body.classList.remove("event-expanded");
}

function expandCard(card) {
  if (expandedCard === card) {
    closeExpandedCard();
    return;
  }
  closeExpandedCard();
  expandedCard = card;
  card.classList.add("expanded");
  document.body.classList.add("event-expanded");
  if (card === eventCard) {
    eventCard.setAttribute("aria-expanded", "true");
    eventCard.setAttribute("aria-label", "Close featured event");
    eventClose.hidden = false;
    previousMonthButton.hidden = false;
    nextMonthButton.hidden = false;
  }
}

eventCard.addEventListener("click", (event) => {
  if (event.target.closest("button, a")) return;
  expandCard(eventCard);
});
eventClose.addEventListener("click", closeExpandedCard);
previousMonthButton.addEventListener("click", () => stepMonth(-1));
nextMonthButton.addEventListener("click", () => stepMonth(1));
eventCard.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && !event.target.closest("button")) {
    event.preventDefault();
    expandCard(eventCard);
  }
});
placeCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    if (event.target.closest("a")) return;
    expandCard(card);
  });
  card.addEventListener("keydown", (event) => {
    if (event.key === " ") {
      event.preventDefault();
      expandCard(card);
    }
  });
});
document.addEventListener("click", (event) => {
  if (expandedCard && !expandedCard.contains(event.target)) closeExpandedCard();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeExpandedCard();
});
monthList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-month]");
  if (!button) return;
  event.preventDefault();
  event.stopPropagation();
  if (expandedCard && expandedCard !== eventCard) closeExpandedCard();
  showEvent(button.dataset.month);
});

document.addEventListener("keydown", (event) => {
  if (event.target.matches("input, textarea, select, [contenteditable='true']")) return;

  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    if (expandedCard?.classList.contains("place-card")) {
      event.preventDefault();
      const currentIndex = Array.from(placeCards).indexOf(expandedCard);
      const step = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (currentIndex + step + placeCards.length) % placeCards.length;
      expandCard(placeCards[nextIndex]);
      return;
    }

    event.preventDefault();
    stepMonth(event.key === "ArrowRight" ? 1 : -1);
    return;
  }

  if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
  event.preventDefault();
  const currentIndex = Array.from(monthButtons).findIndex((button) => button.classList.contains("selected"));
  const step = event.key === "ArrowDown" ? 1 : -1;
  const nextIndex = Math.max(0, Math.min(monthButtons.length - 1, currentIndex + step));
  if (expandedCard && expandedCard !== eventCard) closeExpandedCard();
  monthButtons[nextIndex].focus();
  showEvent(monthButtons[nextIndex].dataset.month);
});

showEvent("OCT");
