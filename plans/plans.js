// ========================================
// JOUK - MY SAVED TRIPS
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    // ========================================
    // ELEMENTS
    // ========================================

    const savedTripsGrid =
        document.getElementById("savedTripsGrid");

    const emptyTrips =
        document.getElementById("emptyTrips");


    // ========================================
    // GET SAVED PLANS
    // ========================================

    function getSavedPlans() {

        const saved =
            localStorage.getItem("joukPlans");

        if (!saved) {
            return [];
        }

        try {

            const plans =
                JSON.parse(saved);

            return Array.isArray(plans)
                ? plans
                : [];

        } catch (error) {

            console.error(
                "Could not read saved plans:",
                error
            );

            return [];
        }
    }


    // ========================================
    // SAVE UPDATED PLANS
    // ========================================

    function savePlans(plans) {

        localStorage.setItem(
            "joukPlans",
            JSON.stringify(plans)
        );
    }


    // ========================================
    // FORMAT DATE
    // ========================================

    function formatDate(dateString) {

        if (!dateString) {
            return "";
        }

        const date =
            new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        return date.toLocaleDateString(
            "en-US",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
    }


    // ========================================
    // ESCAPE HTML
    // ========================================

    function escapeHTML(value) {

        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }


    // ========================================
    // CREATE PLACES TEXT
    // ========================================

    function getPlacesText(places) {

        if (
            !Array.isArray(places) ||
            places.length === 0
        ) {

            return "No places added";
        }

        return places
            .map(function (place) {

                return place.name;

            })
            .filter(Boolean)
            .join(" • ");
    }


    // ========================================
    // LOCAL PLACE IMAGES
    // ========================================

    const placeImages = {

        "dead sea":
            "images/dead sea.jpg",

        "petra":
            "images/petra6.jpeg",

        "wadi rum":
            "images/wadi rum.jpg",

        "ajloun castle":
            "images/AJLOUN.png",

        "ajloun":
            "images/AJLOUN.png",

        "aqaba":
            "images/Aqaba red sea.png",

        "jerash":
            "images/jerash.jpeg",

        "mujib reserve":
            "images/Wadi Mujib.jpg",

        "wadi mujib":
            "images/Wadi Mujib.jpg",

        "amman":
            "images/amman.png",

        "dana":
            "images/Dana Biosphere Reserve.jpg",

        "dana biosphere reserve":
            "images/Dana Biosphere Reserve.jpg",

        "umm qais":
            "images/UMM QAIS.png"
    };


    // ========================================
    // GET IMAGE FOR PLACE
    // ========================================

    function getPlaceImage(place) {

        if (!place) {
            return "";
        }

        const name =
            String(place.name || "")
                .trim()
                .toLowerCase();


        // First:
        // use the local image from /images
        if (placeImages[name]) {

            return placeImages[name];
        }


        // Second:
        // if the place already has a saved image
        if (place.image) {

            return place.image;
        }


        return "";
    }


    // ========================================
    // GET COVER IMAGE
    // ========================================

    function getCoverImage(plan) {

        const places =
            Array.isArray(plan.places)
                ? plan.places
                : [];


        if (places.length === 0) {

            return "";
        }


        // Use the first place as the trip cover
        return getPlaceImage(
            places[0]
        );
    }


    // ========================================
    // RENDER SAVED TRIPS
    // ========================================

    function renderSavedTrips() {

        const plans =
            getSavedPlans();


        savedTripsGrid.innerHTML = "";


        // ========================================
        // EMPTY STATE
        // ========================================

        if (plans.length === 0) {

            savedTripsGrid.style.display =
                "none";

            emptyTrips.style.display =
                "";

            return;
        }


        savedTripsGrid.style.display =
            "";

        emptyTrips.style.display =
            "none";


        // ========================================
        // CREATE TRIP CARDS
        // ========================================

        plans.forEach(function (plan) {

            const tripCard =
                document.createElement("article");


            tripCard.className =
                "saved-trip-card";


            const places =
                Array.isArray(plan.places)
                    ? plan.places
                    : [];


            const coverImage =
                getCoverImage(plan);


            const placesText =
                getPlacesText(places);


            const createdDate =
                formatDate(plan.createdAt);


            const totalDays =
                Math.max(
                    1,
                    Number(plan.days) || 1
                );


            // ========================================
            // IMAGE
            // ========================================

            let imageHTML = "";


            if (coverImage) {

                imageHTML = `

                    <div class="saved-trip-image">

                        <img
                            src="${escapeHTML(window.JOUK.asset(coverImage))}"
                            alt="${escapeHTML(
                                plan.name ||
                                "My Jordan Adventure"
                            )}"
                        >

                        <div class="trip-days-badge">

                            ${totalDays}
                            ${
                                totalDays === 1
                                    ? "Day"
                                    : "Days"
                            }

                        </div>

                    </div>

                `;

            } else {

                imageHTML = `

                    <div class="saved-trip-image no-image">

                        <div class="trip-placeholder">
                            JOUK
                        </div>

                        <div class="trip-days-badge">

                            ${totalDays}
                            ${
                                totalDays === 1
                                    ? "Day"
                                    : "Days"
                            }

                        </div>

                    </div>

                `;
            }


            // ========================================
            // CARD HTML
            // ========================================

            tripCard.innerHTML = `

                ${imageHTML}


                <div class="saved-trip-content">


                    <div class="saved-trip-top">

                        <span class="trip-label">
                            JORDAN JOURNEY
                        </span>


                        <button
                            class="delete-trip-btn"
                            type="button"
                            data-id="${plan.id}"
                            aria-label="Delete trip"
                        >
                            ×
                        </button>

                    </div>


                    <h3>

                        ${escapeHTML(
                            plan.name ||
                            "My Jordan Adventure"
                        )}

                    </h3>


                    <p class="trip-places">

                        ${escapeHTML(
                            placesText
                        )}

                    </p>


                    <div class="trip-meta">

                        <span>

                            ${places.length}
                            ${
                                places.length === 1
                                    ? "Place"
                                    : "Places"
                            }

                        </span>


                        ${
                            createdDate
                                ? `<span>${escapeHTML(createdDate)}</span>`
                                : ""
                        }

                    </div>


                    <button
                        class="view-trip-btn"
                        type="button"
                        data-id="${plan.id}"
                    >

                        View Plan

                        <span>
                            →
                        </span>

                    </button>


                </div>

            `;


            savedTripsGrid.appendChild(
                tripCard
            );
        });


        addCardEvents();
    }


    // ========================================
    // CARD EVENTS
    // ========================================

    function addCardEvents() {


        // ========================================
        // DELETE TRIP
        // ========================================

        document
            .querySelectorAll(".delete-trip-btn")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const tripId =
                            Number(
                                button.dataset.id
                            );


                        const shouldDelete =
                            confirm(
                                "Delete this trip?"
                            );


                        if (!shouldDelete) {
                            return;
                        }


                        let plans =
                            getSavedPlans();


                        plans =
                            plans.filter(
                                function (plan) {

                                    return (
                                        Number(plan.id) !==
                                        tripId
                                    );
                                }
                            );


                        savePlans(plans);


                        renderSavedTrips();
                    }
                );
            });


        // ========================================
        // VIEW PLAN
        // ========================================

        document
            .querySelectorAll(".view-trip-btn")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const tripId =
                            button.dataset.id;


                        localStorage.setItem(
                            "selectedJoukPlan",
                            tripId
                        );


                        window.location.href =
                            window.JOUK.url("other pages/view-plan/index.html");
                    }
                );
            });
    }


    // ========================================
    // INITIAL RENDER
    // ========================================

    renderSavedTrips();

});