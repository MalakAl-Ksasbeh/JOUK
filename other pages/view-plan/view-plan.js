// ==========================================
// JOUK - VIEW SAVED PLAN
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // ELEMENTS
    // ==========================================

    const tripName = document.getElementById("tripName");
    const daysCount = document.getElementById("daysCount");
    const placesCount = document.getElementById("placesCount");
    const itineraryContainer = document.getElementById("itineraryContainer");
    const heroImage = document.getElementById("heroImage");
    const bottomTripName = document.getElementById("bottomTripName");
    const bottomTripMeta = document.getElementById("bottomTripMeta");
    const planNotFound = document.getElementById("planNotFound");
    const bottomSummary = document.getElementById("bottomSummary");
    const editPlanButton = document.getElementById("editPlanButton");


    // ==========================================
    // LOCAL PLACE IMAGES
    // ==========================================

    const placeImages = {

        "dead sea": "images/dead sea.jpg",

        "petra": "images/petra6.jpeg",

        "wadi rum": "images/wadi rum.jpg",

        "ajloun castle": "images/AJLOUN.png",
        "ajloun": "images/AJLOUN.png",

        "aqaba": "images/Aqaba red sea.png",

        "jerash": "images/jerash.jpeg",

        "mujib reserve": "images/Wadi Mujib.jpg",
        "wadi mujib": "images/Wadi Mujib.jpg",

        "amman": "images/amman.png",

        "dana": "images/Dana Biosphere Reserve.jpg",
        "dana biosphere reserve": "images/Dana Biosphere Reserve.jpg",

        "umm qais": "images/UMM QAIS.png"

    };


    // ==========================================
    // GET PLACE IMAGE
    // ==========================================

    function getPlaceImage(place) {

        if (!place) {
            return "";
        }

        const name = String(
            place.name ||
            place.placeName ||
            place.title ||
            ""
        )
            .trim()
            .toLowerCase();


        if (placeImages[name]) {
            return window.JOUK.asset(placeImages[name]);
        }


        if (place.image) {
            return window.JOUK.asset(place.image);
        }


        if (place.photo) {
            return window.JOUK.asset(place.photo);
        }


        if (place.imageUrl) {
            return window.JOUK.asset(place.imageUrl);
        }


        return "";
    }


    // ==========================================
    // ESCAPE HTML
    // ==========================================

    function escapeHTML(value) {

        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }


    // ==========================================
    // GET ALL SAVED PLANS
    // ==========================================

    function getSavedPlans() {

        const possibleKeys = [
            "savedTrips",
            "joukTrips",
            "myTrips",
            "savedPlans",
            "joukPlans"
        ];

        let plans = [];


        possibleKeys.forEach(function (key) {

            try {

                const value = localStorage.getItem(key);

                if (!value) {
                    return;
                }

                const stored = JSON.parse(value);

                if (Array.isArray(stored)) {
                    plans = plans.concat(stored);
                }

            } catch (error) {

                console.log(
                    "Could not read plans from:",
                    key
                );

            }

        });


        // Remove duplicates

        const uniquePlans = [];

        const signatures = new Set();


        plans.forEach(function (plan) {

            const planId =
                plan.id ??
                plan.tripId ??
                plan.planId;


            const signature =
                planId != null
                    ? "id:" + String(planId)
                    : JSON.stringify(plan);


            if (!signatures.has(signature)) {

                signatures.add(signature);

                uniquePlans.push(plan);

            }

        });


        return uniquePlans;
    }


    // ==========================================
    // GET ID FROM URL
    // ==========================================

    function getPlanIdFromURL() {

        const params =
            new URLSearchParams(
                window.location.search
            );

        return params.get("id");
    }


    // ==========================================
    // GET PLAN ID
    // ==========================================

    function getPlanId(plan, index) {

        return (
            plan.id ??
            plan.tripId ??
            plan.planId ??
            index
        );
    }


    // ==========================================
    // GET SELECTED PLAN
    // ==========================================

    function getSelectedPlan() {

        const plans = getSavedPlans();

        if (plans.length === 0) {
            return null;
        }


        // FIRST:
        // Try ID from URL

        const urlId = getPlanIdFromURL();


        if (urlId !== null) {

            const planFromURL =
                plans.find(
                    function (plan, index) {

                        return String(
                            getPlanId(
                                plan,
                                index
                            )
                        ) === String(urlId);

                    }
                );


            if (planFromURL) {

                localStorage.setItem(
                    "selectedJoukPlan",
                    String(urlId)
                );

                return planFromURL;
            }

        }


        // SECOND:
        // Compatibility with selectedJoukPlan

        const selectedId =
            localStorage.getItem(
                "selectedJoukPlan"
            );


        if (selectedId !== null) {

            const selectedPlan =
                plans.find(
                    function (plan, index) {

                        return String(
                            getPlanId(
                                plan,
                                index
                            )
                        ) === String(selectedId);

                    }
                );


            if (selectedPlan) {
                return selectedPlan;
            }

        }


        // THIRD:
        // If there is only one trip, open it

        if (plans.length === 1) {
            return plans[0];
        }


        return null;
    }


    // ==========================================
    // GET PLACES
    // ==========================================

    function getPlaces(plan) {

        if (!plan) {
            return [];
        }


        if (Array.isArray(plan.places)) {
            return plan.places;
        }


        if (Array.isArray(plan.selectedPlaces)) {
            return plan.selectedPlaces;
        }


        // Some versions store places inside itinerary

        if (Array.isArray(plan.itinerary)) {

            const places = [];


            plan.itinerary.forEach(
                function (day, index) {

                    if (
                        !day ||
                        !Array.isArray(day.places)
                    ) {
                        return;
                    }


                    day.places.forEach(
                        function (place) {

                            if (
                                place &&
                                typeof place === "object"
                            ) {

                                places.push({

                                    ...place,

                                    day:
                                        place.day ??
                                        place.selectedDay ??
                                        place.dayNumber ??
                                        day.day ??
                                        day.dayNumber ??
                                        index + 1

                                });

                            } else {

                                places.push({

                                    name:
                                        String(
                                            place || ""
                                        ),

                                    day:
                                        day.day ??
                                        day.dayNumber ??
                                        index + 1

                                });

                            }

                        }
                    );

                }
            );


            return places;
        }


        return [];
    }


    // ==========================================
    // GET PLACE DAY
    // ==========================================

    function getPlaceDay(place) {

        const possibleDay =
            place.day ??
            place.selectedDay ??
            place.dayNumber ??
            1;


        const day =
            Number(possibleDay);


        return (
            Number.isFinite(day) &&
            day > 0
        )
            ? day
            : 1;
    }


    // ==========================================
    // GET TOTAL DAYS
    // ==========================================

    function getTotalDays(plan) {

        if (
            Number.isFinite(
                Number(plan.daysCount)
            ) &&
            Number(plan.daysCount) > 0
        ) {

            return Number(
                plan.daysCount
            );
        }


        if (
            typeof plan.days !== "object" &&
            Number.isFinite(
                Number(plan.days)
            ) &&
            Number(plan.days) > 0
        ) {

            return Number(
                plan.days
            );
        }


        if (Array.isArray(plan.days)) {
            return plan.days.length;
        }


        if (Array.isArray(plan.itinerary)) {
            return plan.itinerary.length;
        }


        const places =
            getPlaces(plan);


        let highestDay = 0;


        places.forEach(
            function (place) {

                highestDay =
                    Math.max(
                        highestDay,
                        getPlaceDay(place)
                    );

            }
        );


        return highestDay || 1;
    }


    // ==========================================
    // HERO IMAGE
    // ==========================================

    function setHeroImage(plan) {

        if (!heroImage) {
            return;
        }


        const places =
            getPlaces(plan);


        let heroImagePath =
            plan.heroImage ||
            plan.coverImage ||
            plan.image ||
            "";


        if (
            !heroImagePath &&
            places.length > 0
        ) {

            heroImagePath =
                getPlaceImage(
                    places[0]
                );
        }


        if (!heroImagePath) {
            return;
        }


        heroImage.style.backgroundImage =
            `linear-gradient(
                to top,
                rgba(0, 0, 0, 0.22),
                rgba(0, 0, 0, 0.03)
            ),
            url("${window.JOUK.asset(heroImagePath)}")`;


        heroImage.style.backgroundSize =
            "cover";


        heroImage.style.backgroundPosition =
            "center";
    }


    // ==========================================
    // CREATE PLACE
    // ==========================================

    function createPlaceHTML(place) {

        const image =
            getPlaceImage(place);


        const name =
            place.name ||
            place.placeName ||
            place.title ||
            "Jordan Place";


        const category =
            place.category ||
            place.type ||
            "Jordan";


        const location =
            place.location ||
            place.city ||
            "";


        const description =
            place.description ||
            place.desc ||
            "A beautiful destination in Jordan.";


        let imageHTML =
            `<div class="itinerary-place-image"></div>`;


        if (image) {

            imageHTML = `
                <div class="itinerary-place-image">

                    <img
                        src="${escapeHTML(window.JOUK.asset(image))}"
                        alt="${escapeHTML(name)}"
                    >

                </div>
            `;
        }


        return `
            <article class="itinerary-place">

                ${imageHTML}

                <div class="itinerary-place-content">

                    <div class="place-category">
                        ${escapeHTML(category)}
                    </div>

                    <h3>
                        ${escapeHTML(name)}
                    </h3>

                    ${
                        location
                            ? `
                                <p class="place-location">
                                    ${escapeHTML(location)}
                                </p>
                              `
                            : ""
                    }

                    <p class="place-description">
                        ${escapeHTML(description)}
                    </p>

                </div>

            </article>
        `;
    }


    // ==========================================
    // RENDER DAYS
    // ==========================================

    function renderDays(plan) {

        if (!itineraryContainer) {
            return;
        }


        const totalDays =
            getTotalDays(plan);


        const places =
            getPlaces(plan);


        itineraryContainer.innerHTML = "";


        for (
            let day = 1;
            day <= totalDays;
            day++
        ) {

            const placesForDay =
                places.filter(
                    function (place) {

                        return (
                            getPlaceDay(place) === day
                        );

                    }
                );


            const dayCard =
                document.createElement(
                    "article"
                );


            dayCard.className =
                "day-card";


            const countText =
                placesForDay.length === 1
                    ? "1 Place"
                    : `${placesForDay.length} Places`;


            let placesHTML = "";


            if (
                placesForDay.length === 0
            ) {

                placesHTML = `
                    <div class="empty-day">
                        No places planned for this day.
                    </div>
                `;

            } else {

                placesHTML =
                    placesForDay
                        .map(
                            createPlaceHTML
                        )
                        .join("");

            }


            dayCard.innerHTML = `

                <div class="day-card-header">

                    <span class="day-number">
                        DAY ${day}
                    </span>

                    <span class="day-count">
                        ${countText}
                    </span>

                </div>


                <div class="day-places">
                    ${placesHTML}
                </div>

            `;


            itineraryContainer.appendChild(
                dayCard
            );
        }
    }


    // ==========================================
    // PLAN NOT FOUND
    // ==========================================

    function showNotFound() {

        if (itineraryContainer) {

            itineraryContainer.style.display =
                "none";

        }


        if (bottomSummary) {

            bottomSummary.style.display =
                "none";

        }


        if (editPlanButton) {

            editPlanButton.style.display =
                "none";

        }


        if (planNotFound) {

            planNotFound.hidden =
                false;

        }
    }


    // ==========================================
    // RENDER PLAN
    // ==========================================

    function renderPlan() {

        const plan =
            getSelectedPlan();


        if (!plan) {

            showNotFound();

            return;
        }


        if (planNotFound) {

            planNotFound.hidden =
                true;

        }


        if (itineraryContainer) {

            itineraryContainer.style.display =
                "";

        }


        if (bottomSummary) {

            bottomSummary.style.display =
                "";

        }


        if (editPlanButton) {

            editPlanButton.style.display =
                "";

        }


        const places =
            getPlaces(plan);


        const totalDays =
            getTotalDays(plan);


        const name =
            plan.name ||
            plan.tripName ||
            plan.title ||
            "My Jordan Adventure";


        // TITLE

        if (tripName) {

            tripName.textContent =
                name;

        }


        // COUNTS

        if (daysCount) {

            daysCount.textContent =
                totalDays;

        }


        if (placesCount) {

            placesCount.textContent =
                places.length;

        }


        // BOTTOM SUMMARY

        if (bottomTripName) {

            bottomTripName.textContent =
                name;

        }


        if (bottomTripMeta) {

            bottomTripMeta.textContent =
                `${totalDays} ${
                    totalDays === 1
                        ? "Day"
                        : "Days"
                } • ${places.length} ${
                    places.length === 1
                        ? "Place"
                        : "Places"
                }`;

        }


        // HERO IMAGE

        setHeroImage(plan);


        // DAYS

        renderDays(plan);
    }


    // ==========================================
    // EDIT TRIP
    // ==========================================

    if (editPlanButton) {

        editPlanButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                const plan =
                    getSelectedPlan();


                if (!plan) {
                    return;
                }


                const plans =
                    getSavedPlans();


                const index =
                    plans.indexOf(plan);


                const planId =
                    getPlanId(
                        plan,
                        index
                    );


                window.location.href =
                    `${window.JOUK.url("other pages/create-plan/index.html")}?edit=${encodeURIComponent(planId)}`;

            }
        );

    }


    // ==========================================
    // START
    // ==========================================

    renderPlan();

});