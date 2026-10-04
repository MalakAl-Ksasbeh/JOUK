// ==========================================
// JOUK - YOUR PATH
// Connected to saved JOUK trips
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // ELEMENTS
    // ==========================================

    const selectedPlacesContainer =
        document.getElementById("selected-places");

    const placesCount =
        document.getElementById("places-count");

    const mapMessage =
        document.getElementById("map-message");

    const dynamicMarkers =
        document.getElementById("dynamic-markers");

    const routeLines =
        document.getElementById("route-lines");

    const googleMapsButton =
        document.getElementById("google-maps-btn");

    const editTripButton =
        document.getElementById("edit-trip-btn");


    // ==========================================
    // PLACE DATA
    // Coordinates here are positions
    // on the Jordan map image, not GPS coordinates.
    // ==========================================

    const placeData = {

        "petra": {
            image: "images/petra.jpeg",
            location: "Petra, Jordan",
            mapX: 47,
            mapY: 69
        },

        "jerash": {
            image: "images/jerash.jpeg",
            location: "Jerash, Jordan",
            mapX: 47,
            mapY: 27
        },

        "mujib reserve": {
            image: "images/Wadi Mujib.jpg",
            location: "Mujib, Jordan",
            mapX: 43,
            mapY: 51
        },

        "wadi mujib": {
            image: "images/Wadi Mujib.jpg",
            location: "Mujib, Jordan",
            mapX: 43,
            mapY: 51
        },

        "dead sea": {
            image: "images/dead sea.jpg",
            location: "Dead Sea, Jordan",
            mapX: 39,
            mapY: 45
        },

        "wadi rum": {
            image: "images/wadi rum.jpg",
            location: "Wadi Rum, Jordan",
            mapX: 48,
            mapY: 83
        },

        "aqaba": {
            image: "images/Aqaba red sea.png",
            location: "Aqaba, Jordan",
            mapX: 45,
            mapY: 92
        },

        "ajloun": {
            image: "images/AJLOUN.png",
            location: "Ajloun, Jordan",
            mapX: 43,
            mapY: 22
        },

        "ajloun castle": {
            image: "images/AJLOUN.png",
            location: "Ajloun, Jordan",
            mapX: 43,
            mapY: 22
        },

        "amman": {
            image: "images/amman.png",
            location: "Amman, Jordan",
            mapX: 48,
            mapY: 36
        },

        "dana": {
            image: "images/Dana Biosphere Reserve.jpg",
            location: "Dana, Jordan",
            mapX: 44,
            mapY: 63
        },

        "dana biosphere reserve": {
            image: "images/Dana Biosphere Reserve.jpg",
            location: "Dana, Jordan",
            mapX: 44,
            mapY: 63
        },

        "umm qais": {
            image: "images/UMM QAIS.png",
            location: "Umm Qais, Jordan",
            mapX: 40,
            mapY: 14
        }

    };


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
    // READ SAVED PLANS
    // Same storage used by the existing project
    // ==========================================

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


    // ==========================================
    // GET SELECTED PLAN
    // Same selected trip used by View Plan
    // ==========================================

    function getSelectedPlan() {

        const selectedId =
            localStorage.getItem(
                "selectedJoukPlan"
            );

        if (!selectedId) {
            return null;
        }

        const plans =
            getSavedPlans();

        return plans.find(function (plan) {

            return String(plan.id) ===
                String(selectedId);

        }) || null;
    }


    // ==========================================
    // GET PLAN PLACES
    // ==========================================

    function getPlaces(plan) {

        if (!plan) {
            return [];
        }

        return Array.isArray(plan.places)
            ? plan.places
            : [];
    }


    // ==========================================
    // GET DAY
    // Compatible with saved structures
    // ==========================================

    function getPlaceDay(place) {

        const possibleDay =
            place.day ??
            place.selectedDay ??
            place.dayNumber ??
            1;

        const day =
            Number(possibleDay);

        return Number.isFinite(day) && day > 0
            ? day
            : 1;
    }


    // ==========================================
    // SORT BY DAY
    // ==========================================

    function sortPlacesByDay(places) {

        return [...places].sort(function (a, b) {

            return (
                getPlaceDay(a) -
                getPlaceDay(b)
            );
        });
    }


    // ==========================================
    // LOCAL PLACE DATA
    // ==========================================

    function getLocalPlaceData(place) {

        const name =
            String(place?.name || "")
                .trim()
                .toLowerCase();

        return placeData[name] || null;
    }


    // ==========================================
    // PLACE IMAGE
    // First use image saved with the trip.
    // If missing, use our known local image.
    // ==========================================

    function getPlaceImage(place) {

        if (place?.image) {
            return window.JOUK.asset(place.image);
        }

        const localData =
            getLocalPlaceData(place);

        return window.JOUK.asset(localData?.image || "");
    }


    // ==========================================
    // PLACE LOCATION
    // ==========================================

    function getPlaceLocation(place) {

        if (place?.location) {
            return place.location;
        }

        const localData =
            getLocalPlaceData(place);

        if (localData?.location) {
            return localData.location;
        }

        const name =
            place?.name || "Jordan";

        return `${name}, Jordan`;
    }


    // ==========================================
    // RENDER LEFT-SIDE PLACE CARDS
    // Matches existing path.css exactly
    // ==========================================

    function renderSelectedPlaces(places) {

        selectedPlacesContainer.innerHTML = "";


        if (places.length === 0) {

            selectedPlacesContainer.innerHTML = `

                <div class="empty-path">

                    <span class="empty-plus">
                        +
                    </span>

                    <h2>
                        Your path is empty
                    </h2>

                    <p>
                        Create a trip and add places
                        you would love to visit.
                    </p>

                </div>

            `;

            return;
        }


        places.forEach(function (place, index) {

            const item =
                document.createElement("article");

            item.className =
                "path-place-item";


            const name =
                place.name ||
                "Jordan Place";

            const image =
                getPlaceImage(place);

            const location =
                getPlaceLocation(place);

            const day =
                getPlaceDay(place);


            let imageHTML = "";

            if (image) {

                imageHTML = `

                    <img
                        class="path-place-image"
                        src="${escapeHTML(window.JOUK.asset(image))}"
                        alt="${escapeHTML(name)}"
                    >

                `;
            }


            item.innerHTML = `

                <div class="path-number">
                    ${index + 1}
                </div>


                ${imageHTML}


                <div class="path-place-text">

                    <h3>
                        ${escapeHTML(name)}
                    </h3>

                    <p>
                        ${escapeHTML(location)}
                    </p>

                    <span>
                        DAY ${day}
                    </span>

                </div>

            `;


            selectedPlacesContainer.appendChild(
                item
            );
        });
    }


    // ==========================================
    // UPDATE PLACE COUNT
    // ==========================================

    function updatePlacesCount(places) {

        const count =
            places.length;

        placesCount.textContent =
            `${count} ${
                count === 1
                    ? "Place"
                    : "Places"
            }`;
    }


    // ==========================================
    // GET MAP POSITION
    // ==========================================

    function getMapPosition(place, index, total) {

        const localData =
            getLocalPlaceData(place);


        if (
            localData &&
            Number.isFinite(localData.mapX) &&
            Number.isFinite(localData.mapY)
        ) {

            return {
                x: localData.mapX,
                y: localData.mapY
            };
        }


        // Fallback only for unknown future places

        const safeTotal =
            Math.max(total - 1, 1);

        return {
            x: 46,
            y: 25 + ((index / safeTotal) * 55)
        };
    }


    // ==========================================
    // RENDER MAP
    // ==========================================

    function renderMap(places) {

        dynamicMarkers.innerHTML = "";
        routeLines.innerHTML = "";


        // EMPTY JOURNEY
        if (places.length === 0) {

            if (mapMessage) {
                mapMessage.style.display = "";
            }

            googleMapsButton.style.display =
                "none";

            return;
        }


        // JOURNEY EXISTS
        if (mapMessage) {
            mapMessage.style.display = "none";
        }

        googleMapsButton.style.display =
            "flex";


        const positions =
            places.map(function (place, index) {

                return getMapPosition(
                    place,
                    index,
                    places.length
                );
            });


        // ==========================================
        // ROUTE SVG
        // ==========================================

        routeLines.setAttribute(
            "viewBox",
            "0 0 100 100"
        );

        routeLines.setAttribute(
            "preserveAspectRatio",
            "none"
        );


        if (positions.length > 1) {

            const points =
                positions
                    .map(function (position) {

                        return (
                            position.x +
                            "," +
                            position.y
                        );
                    })
                    .join(" ");


            const svgNamespace =
                "http://www.w3.org/2000/svg";

            const polyline =
                document.createElementNS(
                    svgNamespace,
                    "polyline"
                );


            polyline.setAttribute(
                "points",
                points
            );

            polyline.setAttribute(
                "fill",
                "none"
            );

            polyline.setAttribute(
                "stroke",
                "#6f4528"
            );

            polyline.setAttribute(
                "stroke-width",
                "0.65"
            );

            polyline.setAttribute(
                "stroke-dasharray",
                "2 1.5"
            );

            polyline.setAttribute(
                "stroke-linecap",
                "round"
            );

            polyline.setAttribute(
                "stroke-linejoin",
                "round"
            );

            polyline.setAttribute(
                "vector-effect",
                "non-scaling-stroke"
            );


            routeLines.appendChild(
                polyline
            );
        }


        // ==========================================
        // MARKERS
        // Matches existing path.css
        // ==========================================

        places.forEach(function (place, index) {

            const position =
                positions[index];

            const marker =
                document.createElement("div");

            marker.className =
                "journey-marker";


            marker.style.left =
                `${position.x}%`;

            marker.style.top =
                `${position.y}%`;


            marker.innerHTML = `

                <span class="journey-marker-number">
                    ${index + 1}
                </span>

                <span class="journey-marker-name">
                    ${escapeHTML(
                        place.name ||
                        "Jordan Place"
                    )}
                </span>

            `;


            dynamicMarkers.appendChild(
                marker
            );
        });
    }


    // ==========================================
    // GOOGLE MAPS LINK
    // ==========================================

    function updateGoogleMapsLink(places) {

        if (places.length === 0) {

            googleMapsButton.href = "#";

            googleMapsButton.style.display =
                "none";

            return;
        }


        const locations =
            places.map(function (place) {

                return getPlaceLocation(place);

            });


        let url =
            "https://www.google.com/maps/dir/?api=1";


        // ONE PLACE
        if (locations.length === 1) {

            url +=
                "&destination=" +
                encodeURIComponent(
                    locations[0]
                );

            url +=
                "&travelmode=driving";

        }


        // TWO OR MORE PLACES
        else {

            const origin =
                locations[0];

            const destination =
                locations[
                    locations.length - 1
                ];

            const waypoints =
                locations.slice(1, -1);


            url +=
                "&origin=" +
                encodeURIComponent(origin);


            url +=
                "&destination=" +
                encodeURIComponent(destination);


            url +=
                "&travelmode=driving";


            if (waypoints.length > 0) {

                url +=
                    "&waypoints=" +
                    encodeURIComponent(
                        waypoints.join("|")
                    );
            }
        }


        googleMapsButton.href =
            url;

        googleMapsButton.style.display =
            "flex";
    }


    // ==========================================
    // EDIT TRIP BUTTON
    // ==========================================

    function setupEditTripButton(plan) {

        if (!editTripButton) {
            return;
        }


        if (!plan) {

            editTripButton.href =
                window.JOUK.url("plans/index.html");

            return;
        }


        editTripButton.href =
            window.JOUK.url("other pages/create-plan/index.html");
    }


    // ==========================================
    // EMPTY STATE
    // ==========================================

    function showEmptyJourney() {

        updatePlacesCount([]);

        renderSelectedPlaces([]);

        renderMap([]);

        updateGoogleMapsLink([]);
    }


    // ==========================================
    // RENDER SELECTED JOURNEY
    // ==========================================

    function renderJourney() {

        const plan =
            getSelectedPlan();


        if (!plan) {

            showEmptyJourney();

            setupEditTripButton(null);

            return;
        }


        const places =
            sortPlacesByDay(
                getPlaces(plan)
            );


        updatePlacesCount(
            places
        );


        renderSelectedPlaces(
            places
        );


        renderMap(
            places
        );


        updateGoogleMapsLink(
            places
        );


        setupEditTripButton(
            plan
        );
    }


    // ==========================================
    // START
    // ==========================================

    renderJourney();

});