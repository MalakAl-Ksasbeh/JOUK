// ========================================
// JOUK - CREATE / EDIT PLAN
// ========================================
import { auth, db } from "../../shared/firebase.js";

import {
    doc,
    setDoc,
    getDoc,
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
document.addEventListener("DOMContentLoaded", function () {

    // ========================================
    // ELEMENTS
    // ========================================

    const tripNameInput =
        document.getElementById("tripName");

    const numberOfDaysSelect =
        document.getElementById("numberOfDays");

    const filterButtons =
        document.querySelectorAll(".filter-btn");

    const placeCards =
        document.querySelectorAll(".place-card");

    const selectedPlacesContainer =
        document.getElementById("selectedPlaces");

    const itineraryGrid =
        document.getElementById("itineraryGrid");

    const summaryName =
        document.getElementById("summaryName");

    const summaryDetails =
        document.getElementById("summaryDetails");

    const savePlanBtn =
        document.getElementById("savePlanBtn");


    // ========================================
    // STATE
    // ========================================

    let numberOfDays =
        Number(numberOfDaysSelect.value);

    let selectedPlaces = [];

    let editingPlanId = null;


    // ========================================
    // GET PLACE DATA
    // ========================================

    function getPlaceFromCard(card) {

        return {
            id: card.dataset.id,
            name: card.dataset.name,
            location: card.dataset.location,
            category: card.dataset.category,
            image: card.dataset.image,
            description: card.dataset.description,
            day: 1
        };
    }


    // ========================================
    // FILTERS
    // ========================================

    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const filter =
                button.dataset.filter;

            filterButtons.forEach(function (btn) {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            placeCards.forEach(function (card) {

                const category =
                    card.dataset.category;

                if (
                    filter === "all" ||
                    category === filter
                ) {
                    card.classList.remove("hidden");
                } else {
                    card.classList.add("hidden");
                }
            });
        });
    });


    // ========================================
    // ADD / REMOVE PLACE FROM CARDS
    // ========================================

    placeCards.forEach(function (card) {

        const addButton =
            card.querySelector(".add-place");

        if (!addButton) {
            return;
        }

        addButton.addEventListener("click", function () {

            const place =
                getPlaceFromCard(card);

            const alreadySelected =
                selectedPlaces.some(function (item) {
                    return String(item.id) === String(place.id);
                });

            if (alreadySelected) {

                removePlace(place.id);

                return;
            }

            const nextDay =
                (selectedPlaces.length % numberOfDays) + 1;

            place.day =
                nextDay;

            selectedPlaces.push(place);

            card.classList.add("selected");

            addButton.textContent =
                "✓";

            renderEverything();
        });
    });


    // ========================================
    // REMOVE PLACE
    // ========================================

    function removePlace(placeId) {

        selectedPlaces =
            selectedPlaces.filter(function (place) {

                return String(place.id) !==
                    String(placeId);
            });

        const card =
            document.querySelector(
                '.place-card[data-id="' +
                placeId +
                '"]'
            );

        if (card) {

            card.classList.remove("selected");

            const button =
                card.querySelector(".add-place");

            if (button) {
                button.textContent = "+";
            }
        }

        renderEverything();
    }


    // ========================================
    // SELECTED PLACES
    // ========================================

    function renderSelectedPlaces() {

        selectedPlacesContainer.innerHTML =
            "";

        if (selectedPlaces.length === 0) {

            selectedPlacesContainer.innerHTML = `
                <div class="empty-message">
                    No places selected yet.
                    Add your favorite places above.
                </div>
            `;

            return;
        }

        selectedPlaces.forEach(function (place) {

            const card =
                document.createElement("div");

            card.className =
                "selected-card";

            let dayOptions = "";

            for (
                let day = 1;
                day <= numberOfDays;
                day++
            ) {

                const selected =
                    day === Number(place.day)
                        ? "selected"
                        : "";

                dayOptions += `
                    <option
                        value="${day}"
                        ${selected}
                    >
                        Day ${day}
                    </option>
                `;
            }

            card.innerHTML = `

                <img
                    src="${window.JOUK.asset(place.image || "")}"
                    alt="${place.name || "Jordan Place"}"
                >

                <div class="selected-info">

                    <h3>
                        ${place.name || "Jordan Place"}
                    </h3>

                    <select
                        class="day-selector"
                        data-id="${place.id}"
                    >
                        ${dayOptions}
                    </select>

                </div>

                <button
                    type="button"
                    class="remove-selected"
                    data-id="${place.id}"
                    aria-label="Remove ${place.name || "place"}"
                >
                    ×
                </button>
            `;

            selectedPlacesContainer.appendChild(card);
        });


        // DAY SELECTORS

        document
            .querySelectorAll(".day-selector")
            .forEach(function (select) {

                select.addEventListener(
                    "change",
                    function () {

                        const place =
                            selectedPlaces.find(
                                function (item) {

                                    return (
                                        String(item.id) ===
                                        String(select.dataset.id)
                                    );
                                }
                            );

                        if (place) {

                            place.day =
                                Number(select.value);

                            renderItinerary();

                            updateSummary();
                        }
                    }
                );
            });


        // REMOVE BUTTONS

        document
            .querySelectorAll(".remove-selected")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        removePlace(
                            button.dataset.id
                        );
                    }
                );
            });
    }


    // ========================================
    // ITINERARY
    // ========================================

    function renderItinerary() {

        itineraryGrid.innerHTML =
            "";

        for (
            let day = 1;
            day <= numberOfDays;
            day++
        ) {

            const placesForDay =
                selectedPlaces.filter(
                    function (place) {

                        return Number(place.day) === day;
                    }
                );

            const dayCard =
                document.createElement("div");

            dayCard.className =
                "day-card";

            let placesHTML = "";

            if (placesForDay.length === 0) {

                placesHTML = `
                    <div class="day-empty">
                        No places added to this day.
                    </div>
                `;

            } else {

                placesForDay.forEach(function (place) {

                    placesHTML += `

                        <div class="itinerary-place">

                            <img
                                src="${window.JOUK.asset(place.image || "")}"
                                alt="${place.name || "Jordan Place"}"
                            >

                            <div class="itinerary-info">

                                <h4>
                                    ${place.name || "Jordan Place"}
                                </h4>

                                <div class="category-label">

                                    ${getCategoryIcon(
                                        place.category
                                    )}

                                    ${place.category || "Jordan"}

                                </div>

                                <p>
                                    ${place.description || ""}
                                </p>

                            </div>

                            <button
                                type="button"
                                class="remove-itinerary"
                                data-id="${place.id}"
                                aria-label="Remove ${place.name || "place"}"
                            >
                                ×
                            </button>

                        </div>
                    `;
                });
            }

            dayCard.innerHTML = `

                <div class="day-header">

                    <h3>
                        DAY ${day}
                    </h3>

                    <span>
                        ${placesForDay.length}
                        ${
                            placesForDay.length === 1
                                ? "place"
                                : "places"
                        }
                    </span>

                </div>

                ${placesHTML}
            `;

            itineraryGrid.appendChild(dayCard);
        }


        document
            .querySelectorAll(".remove-itinerary")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        removePlace(
                            button.dataset.id
                        );
                    }
                );
            });
    }


    // ========================================
    // CATEGORY ICON
    // ========================================

    function getCategoryIcon(category) {

        if (category === "relax") {
            return "☀";
        }

        if (category === "culture") {
            return "♜";
        }

        if (category === "adventure") {
            return "△";
        }

        return "•";
    }


    // ========================================
    // NUMBER OF DAYS
    // ========================================

    numberOfDaysSelect.addEventListener(
        "change",
        function () {

            numberOfDays =
                Number(numberOfDaysSelect.value);

            selectedPlaces.forEach(
                function (place) {

                    if (
                        Number(place.day) >
                        numberOfDays
                    ) {

                        place.day =
                            numberOfDays;
                    }
                }
            );

            renderEverything();
        }
    );


    // ========================================
    // TRIP NAME
    // ========================================

    tripNameInput.addEventListener(
        "input",
        function () {

            updateSummary();
        }
    );


    // ========================================
    // SUMMARY
    // ========================================

    function updateSummary() {

        const tripName =
            tripNameInput.value.trim();

        summaryName.textContent =
            tripName ||
            "My Jordan Adventure";

        summaryDetails.textContent =
            numberOfDays +
            (
                numberOfDays === 1
                    ? " Day"
                    : " Days"
            ) +
            " · " +
            selectedPlaces.length +
            (
                selectedPlaces.length === 1
                    ? " Place"
                    : " Places"
            );
    }


    // ========================================
    // RENDER EVERYTHING
    // ========================================

    function renderEverything() {

        renderSelectedPlaces();

        renderItinerary();

        updateSummary();
    }


    // ========================================
    // MARK PLACE CARDS AS SELECTED
    // ========================================

    function updatePlaceCards() {

        placeCards.forEach(function (card) {

            const cardId =
                String(card.dataset.id);

            const isSelected =
                selectedPlaces.some(
                    function (place) {

                        return String(place.id) ===
                            cardId;
                    }
                );

            const button =
                card.querySelector(".add-place");

            if (isSelected) {

                card.classList.add("selected");

                if (button) {
                    button.textContent = "✓";
                }

            } else {

                card.classList.remove("selected");

                if (button) {
                    button.textContent = "+";
                }
            }
        });
    }


    // ========================================
    // LOAD PLAN FOR EDITING
    // ========================================

    async function loadPlanForEditing() {

        const params =
            new URLSearchParams(
                window.location.search
            );

        let editId =
            params.get("edit");


        // ========================================
        // FALLBACK
        // If browser opened /other%20pages/create-plan/index.html
        // without ?edit=ID after View Plan
        // ========================================

        if (!editId) {

            const cameFromViewPlan =
                document.referrer.includes(
                    window.JOUK.url("other pages/view-plan/index.html")
                );

            const selectedPlanId =
                localStorage.getItem(
                    "selectedJoukPlan"
                );

            if (
                cameFromViewPlan &&
                selectedPlanId
            ) {

                editId =
                    selectedPlanId;

            } else {

                // Normal CREATE mode
                return;
            }
        }


        // ========================================
        // READ SAVED PLANS
        // ========================================

       await auth.authStateReady();

const currentUser = auth.currentUser;

if (!currentUser) {
    alert("Please log in to edit your trip.");
    return;
}

let savedPlans = [];

try {
    const planRef = doc(
        db,
        "users",
        currentUser.uid,
        "savedPlans",
        String(editId)
    );

    const planSnap = await getDoc(planRef);

    if (planSnap.exists()) {
        savedPlans = [
            {
                ...planSnap.data(),
                id: editId
            }
        ];
    }

} catch (error) {
    console.error("Could not load trip for editing:", error);
    alert("Could not load your trip. Please try again.");
    return;
}


        // ========================================
        // FIND PLAN
        // ========================================

        const plan =
            savedPlans.find(
                function (item) {

                    return (
                        String(item.id) ===
                        String(editId)
                    );
                }
            );

        if (!plan) {

            console.error(
                "Plan for editing was not found."
            );

            return;
        }
const localPlans = JSON.parse(
    localStorage.getItem("joukPlans") || "[]"
);

const otherPlans = localPlans.filter(
    item => String(item.id) !== String(plan.id)
);

otherPlans.unshift(plan);

localStorage.setItem(
    "joukPlans",
    JSON.stringify(otherPlans)
);

        // ========================================
        // EDIT MODE
        // ========================================

        editingPlanId =
            plan.id;


        // NAME

        tripNameInput.value =
            plan.name ||
            "My Jordan Adventure";


        // DAYS

        numberOfDays =
            Math.max(
                1,
                Number(plan.days) || 1
            );

        numberOfDaysSelect.value =
            String(numberOfDays);


        // PLACES

        selectedPlaces =
            Array.isArray(plan.places)
                ? plan.places.map(
                    function (place) {

                        return {
                            ...place,

                            id:
                                String(
                                    place.id ?? ""
                                ),

                            day:
                                Math.max(
                                    1,
                                    Number(
                                        place.day ??
                                        place.selectedDay ??
                                        place.dayNumber ??
                                        1
                                    )
                                )
                        };
                    }
                )
                : [];


        // MARK CARDS

        updatePlaceCards();


        // CHANGE SAVE BUTTON TEXT

        if (savePlanBtn) {

            savePlanBtn.textContent =
                "Save Changes";
        }


        renderEverything();
    }


    // ========================================
    // SAVE PLAN
    // ========================================

    savePlanBtn.addEventListener(
        "click",
        async function () {
await auth.authStateReady();

const currentUser = auth.currentUser;

if (!currentUser) {
    alert("Please log in to save your trip.");
    return;
}
            const tripName =
                tripNameInput.value.trim();


            // NAME VALIDATION

            if (tripName === "") {

                alert(
                    "Please give your trip a name."
                );

                tripNameInput.focus();

                return;
            }


            // PLACES VALIDATION

            if (
                selectedPlaces.length === 0
            ) {

                alert(
                    "Please choose at least one place for your trip."
                );

                return;
            }


            // READ SAVED PLANS

            let savedPlans = [];

            const oldPlans =
                localStorage.getItem(
                    "joukPlans"
                );

            if (oldPlans) {

                try {

                    savedPlans =
                        JSON.parse(oldPlans);

                    if (
                        !Array.isArray(savedPlans)
                    ) {

                        savedPlans = [];
                    }

                } catch (error) {

                    savedPlans = [];
                }
            }


            // ========================================
            // EDIT EXISTING PLAN
            // ========================================

            if (editingPlanId !== null) {

                const planIndex =
                    savedPlans.findIndex(
                        function (item) {

                            return (
                                String(item.id) ===
                                String(editingPlanId)
                            );
                        }
                    );

                if (planIndex !== -1) {

                    const oldPlan =
                        savedPlans[planIndex];

                    savedPlans[planIndex] = {

                        ...oldPlan,

                        id:
                            oldPlan.id,

                        name:
                            tripName,

                        days:
                            numberOfDays,

                        places:
                            selectedPlaces,

                        createdAt:
                            oldPlan.createdAt ||
                            new Date().toISOString(),

                        updatedAt:
                            new Date().toISOString()
                    };


try {
    await setDoc(
        doc(
            db,
            "users",
            currentUser.uid,
            "savedPlans",
            String(editingPlanId)
        ),
        savedPlans[planIndex]
    );
} catch (error) {
    console.error("Error updating plan in Firebase:", error);
    alert("Could not update your trip. Please try again.");
    return;
}

                    localStorage.setItem(
                        "joukPlans",
                        JSON.stringify(
                            savedPlans
                        )
                    );


                    // Keep this plan selected
                    // when returning to View Plan

                    localStorage.setItem(
                        "selectedJoukPlan",
                        String(editingPlanId)
                    );


                    alert(
                        "Your Jordan trip has been updated successfully!"
                    );


                    window.location.href =
    `${window.JOUK.url("other pages/view-plan/index.html")}?id=${encodeURIComponent(editingPlanId)}`;


                    return;
                }
            }


            // ========================================
            // CREATE NEW PLAN
            // ========================================

            const plan = {

                id:
                    Date.now(),

                name:
                    tripName,

                days:
                    numberOfDays,

                places:
                    selectedPlaces,

                createdAt:
                    new Date().toISOString()
            };


            savedPlans.unshift(plan);
try {
    await setDoc(
        doc(db, "users", currentUser.uid, "savedPlans", String(plan.id)),
        plan
    );
} catch (error) {
    console.error("Error saving plan to Firebase:", error);
    alert("Could not save your trip. Please try again.");
    return;
}

            localStorage.setItem(
                "joukPlans",
                JSON.stringify(
                    savedPlans
                )
            );


            // Select newly created trip too

            localStorage.setItem(
                "selectedJoukPlan",
                String(plan.id)
            );


            alert(
                "Your Jordan trip has been saved successfully!"
            );
            window.location.assign(window.JOUK.url("paths/index.html"));
        }
    );


    // ========================================
    // START
    // ========================================

    loadPlanForEditing();

    const pendingPlace = new URLSearchParams(window.location.search).get("addPlace");
    if (pendingPlace && editingPlanId === null) {
        const aliases = { deadsea: "dead-sea", wadiRum: "wadi-rum", ajlounCastle: "ajloun-castle", wadiMujib: "mujib", romanTheater: "amman" };
        const cardID = aliases[pendingPlace] || pendingPlace;
        const pendingCard = Array.from(placeCards).find(function (card) { return card.dataset.id === cardID; });
        if (pendingCard) {
            selectedPlaces.push(getPlaceFromCard(pendingCard));
            pendingCard.classList.add("selected");
            const button = pendingCard.querySelector(".add-place");
            if (button) button.textContent = "✓";
        } else {
            savePlanBtn.disabled = true;
            fetch(window.JOUK.url("data/places.json")).then(function (response) {
                if (!response.ok) throw new Error("Place unavailable");
                return response.json();
            }).then(function (places) {
                const place = places[pendingPlace];
                if (!place) throw new Error("Place unavailable");
                selectedPlaces.push({ id: pendingPlace, name: place.name, location: place.location,
                    image: place.image, description: place.about, category: "", day: 1 });
                renderEverything();
            }).catch(function () {
                alert("We could not load your chosen place. Please return to the place and try again.");
            }).finally(function () { savePlanBtn.disabled = false; });
        }
    }

    renderEverything();

});
