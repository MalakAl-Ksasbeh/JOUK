// ======================================================
// JOUK - PLACE DETAILS
// ======================================================


// ================= URL PARAMETERS =================

const params = new URLSearchParams(window.location.search);

const placeID = params.get("place") || "deadsea";

const requestedTab = params.get("tab") || "overview";

let currentPlace = null;


// ======================================================
// TABS
// ======================================================

const detailTabs = document.querySelectorAll(".details-tab");

const tabContents = document.querySelectorAll(".tab-content");


function openTab(tabID) {

    let tabExists = false;

    detailTabs.forEach(function (tab) {

        if (tab.dataset.target === tabID) {

            tabExists = true;

        }

    });


    if (!tabExists) {

        tabID = "overview";

    }


    detailTabs.forEach(function (tab) {

        tab.classList.remove("active");

        if (tab.dataset.target === tabID) {

            tab.classList.add("active");

        }

    });


    tabContents.forEach(function (content) {

        content.classList.remove("active");

        if (content.id === tabID) {

            content.classList.add("active");

        }

    });

}


detailTabs.forEach(function (tab) {

    tab.addEventListener("click", function () {

        const targetID = this.dataset.target;

        openTab(targetID);

    });

});


openTab(requestedTab);


// ======================================================
// LOAD PLACE DATA
// ======================================================

fetch(window.JOUK.url("data/places.json"))

.then(function (response) {

    if (!response.ok) {

        throw new Error("Could not load places.json");

    }

    return response.json();

})

.then(function (data) {

    const place = data[placeID];

    currentPlace = place;


    if (!place) {

        console.log("Place not found:", placeID);

        return;

    }


    // ==================================================
    // MAIN INFORMATION
    // ==================================================

    const placeName =
        document.getElementById("place-name");

    const placeLocation =
        document.getElementById("place-location");

    const placeImage =
        document.getElementById("place-image");

    const placeRating =
        document.getElementById("place-rating");


    if (placeName) {

        placeName.textContent =
            place.name || "";

    }


    if (placeLocation) {

        placeLocation.textContent =
            place.location || "";

    }


    if (placeImage) {

        placeImage.src =
            window.JOUK.asset(place.image || "");

        placeImage.alt =
            place.name
                ? `${place.name} - Jordan`
                : "Place Image";

    }


    if (placeRating) {

        placeRating.textContent =
            place.rating || "";

    }


    // ==================================================
    // PLACE INFO
    // ==================================================

    const bestTime =
        document.getElementById("best-time");

    const visitTime =
        document.getElementById("visit-time");

    const bestFor =
        document.getElementById("best-for");

    const nearby =
        document.getElementById("nearby");


    if (bestTime) {

        bestTime.textContent =
            place.info?.bestTime || "";

    }


    if (visitTime) {

        visitTime.textContent =
            place.info?.visitTime || "";

    }


    if (bestFor) {

        bestFor.textContent =
            place.info?.bestFor || "";

    }


    if (nearby) {

        nearby.textContent =
            place.info?.nearby || "";

    }


    // ==================================================
    // ABOUT
    // ==================================================

    const aboutTitle =
        document.getElementById("about-title");

    const aboutText =
        document.getElementById("about-text");


    if (aboutTitle) {

        aboutTitle.textContent =
            place.aboutTitle || "";

    }


    if (aboutText) {

        aboutText.textContent =
            place.about || "";

    }


    // ==================================================
    // QUICK INFO
    // ==================================================

    const elevation =
        document.getElementById("elevation");

    const quickBest =
        document.getElementById("quick-best");

    const access =
        document.getElementById("access");

    const distance =
        document.getElementById("distance");


    if (elevation) {

        elevation.textContent =
            place.quickInfo?.elevation || "";

    }


    if (quickBest) {

        quickBest.textContent =
            place.quickInfo?.bestFor || "";

    }


    if (access) {

        access.textContent =
            place.quickInfo?.access || "";

    }


    if (distance) {

        distance.textContent =
            place.quickInfo?.distance || "";

    }


    // ==================================================
    // THINGS TO DO
    // ==================================================

    const thingsList =
        document.getElementById("things-list");


    if (thingsList) {

        thingsList.innerHTML = "";

        const things =
            Array.isArray(place.thingsToDo)
                ? place.thingsToDo
                : [];


        things.forEach(function (item) {

            const li =
                document.createElement("li");

            li.textContent = item;

            thingsList.appendChild(li);

        });

    }


    // ==================================================
    // PHOTOS
    // ==================================================

    const photosContainer =
        document.getElementById("photos-container");


    if (photosContainer) {

        photosContainer.innerHTML = "";

        const photos =
            Array.isArray(place.photos)
                ? place.photos
                : [];


        photos.forEach(function (photo) {

            const img =
                document.createElement("img");

            img.src = window.JOUK.asset(photo);

            img.alt =
                place.name
                    ? `${place.name} photo`
                    : "Jordan photo";

            img.loading = "lazy";

            photosContainer.appendChild(img);

        });

    }


    // ==================================================
    // HIGHLIGHTS
    // ==================================================

    const highlightsContainer =
        document.getElementById(
            "highlights-container"
        );


    if (highlightsContainer) {

        highlightsContainer.innerHTML = "";

        const highlights =
            Array.isArray(place.highlights)
                ? place.highlights
                : [];


        highlights.forEach(function (item) {

            const card =
                document.createElement("div");

            card.className =
                "highlight-card";


            const img =
                document.createElement("img");

            img.src =
                window.JOUK.asset(item.image || "");

            img.alt =
                item.title || "Highlight";


            const title =
                document.createElement("h3");

            title.textContent =
                item.title || "";


            card.appendChild(img);

            card.appendChild(title);

            highlightsContainer.appendChild(
                card
            );

        });

    }


    // ==================================================
    // SHARE EXPERIENCE BUTTON
    // ==================================================

    const shareExperienceBtn =
        document.getElementById(
            "shareExperienceBtn"
        );


    if (shareExperienceBtn) {

        shareExperienceBtn.href =
            `${window.JOUK.url("reviews/share-experience/index.html")}?place=${encodeURIComponent(placeID)}`;

    }


    // ==================================================
    // EXPERIENCES
    // ==================================================

    loadExperiences(
        placeID,
        place
    );


    // ==================================================
    // ADD TO MY PATH
    // ==================================================

    const addToPathBtn =
        document.getElementById(
            "add-to-path-btn"
        );


    if (addToPathBtn) {

        let myPath =
            getStoredArray("myPath");


        const alreadyAdded =
            myPath.includes(placeID);


        if (alreadyAdded) {

            addToPathBtn.textContent =
                "View My Trip →";

        }


        addToPathBtn.addEventListener(
            "click",
            function () {

                let savedPath =
                    getStoredArray(
                        "myPath"
                    );


                const exists =
                    savedPath.includes(
                        placeID
                    );


                if (!exists) {

                    savedPath.push(
                        placeID
                    );


                    localStorage.setItem(
                        "myPath",
                        JSON.stringify(
                            savedPath
                        )
                    );

                }


                window.location.href =
                    window.JOUK.url("paths/index.html");

            }
        );

    }

})

.catch(function (error) {

    console.log(
        "Error loading place:",
        error
    );

});


// ======================================================
// LOAD EXPERIENCES
// ======================================================

function loadExperiences(
    currentPlaceID,
    place
) {

    const container =
        document.getElementById(
            "experiences-container"
        );


    const emptyState =
        document.getElementById(
            "experiences-empty"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    const allExperiences =
        getAllStoredExperiences();


    const placeExperiences =
        allExperiences.filter(
            function (experience) {

                const experiencePlace =
                    experience.placeID ||
                    experience.placeId ||
                    experience.place ||
                    experience.placeName ||
                    experience.placeKey;


                if (!experiencePlace) {

                    return false;

                }


                const normalizedExperience =
                    normalizePlaceValue(
                        experiencePlace
                    );


                const normalizedID =
                    normalizePlaceValue(
                        currentPlaceID
                    );


                const normalizedName =
                    normalizePlaceValue(
                        place.name
                    );


                return (
                    normalizedExperience ===
                    normalizedID

                    ||

                    normalizedExperience ===
                    normalizedName
                );

            }
        );


    if (placeExperiences.length === 0) {

        if (emptyState) {

            emptyState.hidden = false;

        }

        return;

    }


    if (emptyState) {

        emptyState.hidden = true;

    }


    const sortedExperiences =
        [...placeExperiences].sort(
            function (a, b) {

                const dateA =
                    new Date(
                        a.createdAt || 0
                    ).getTime();


                const dateB =
                    new Date(
                        b.createdAt || 0
                    ).getTime();


                return dateB - dateA;

            }
        );


    sortedExperiences
        .slice(0, 6)
        .forEach(
            function (experience) {

                const card =
                    createExperienceCard(
                        experience,
                        place,
                        currentPlaceID
                    );


                container.appendChild(
                    card
                );

            }
        );

}


// ======================================================
// CREATE EXPERIENCE CARD
// ======================================================

function createExperienceCard(
    experience,
    place,
    currentPlaceID
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "experience-card";


    // Needed so the delete button stays
    // in the top-right corner of the card.
    card.style.position =
        "relative";


    // ==================================================
    // DELETE BUTTON
    // ==================================================

    const deleteButton =
        document.createElement(
            "button"
        );


    deleteButton.type =
        "button";


    deleteButton.innerHTML =
        "&times;";


    deleteButton.title =
        "Delete experience";


    deleteButton.setAttribute(
        "aria-label",
        "Delete experience"
    );


    // Styling is here intentionally,
    // so place-details.css does NOT need editing.
    deleteButton.style.position =
        "absolute";

    deleteButton.style.top =
        "16px";

    deleteButton.style.right =
        "16px";

    deleteButton.style.width =
        "34px";

    deleteButton.style.height =
        "34px";

    deleteButton.style.border =
        "1px solid rgba(36, 33, 30, 0.15)";

    deleteButton.style.borderRadius =
        "50%";

    deleteButton.style.background =
        "rgba(255,255,255,0.95)";

    deleteButton.style.color =
        "#24211e";

    deleteButton.style.fontSize =
        "22px";

    deleteButton.style.lineHeight =
        "28px";

    deleteButton.style.cursor =
        "pointer";

    deleteButton.style.zIndex =
        "5";

    deleteButton.style.display =
        "flex";

    deleteButton.style.alignItems =
        "center";

    deleteButton.style.justifyContent =
        "center";

    deleteButton.style.padding =
        "0";

    deleteButton.style.boxShadow =
        "0 3px 10px rgba(0,0,0,0.08)";


    deleteButton.addEventListener(
        "mouseenter",
        function () {

            deleteButton.style.transform =
                "scale(1.08)";

        }
    );


    deleteButton.addEventListener(
        "mouseleave",
        function () {

            deleteButton.style.transform =
                "scale(1)";

        }
    );


    deleteButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            const confirmed =
                window.confirm(
                    "Delete this experience?"
                );


            if (!confirmed) {

                return;

            }


            deleteStoredExperience(
                experience
            );


            loadExperiences(
                currentPlaceID,
                place
            );

        }
    );


    card.appendChild(
        deleteButton
    );


    // ==================================================
    // USER
    // ==================================================

    const top =
        document.createElement(
            "div"
        );


    top.className =
        "experience-user";


    const avatar =
        document.createElement(
            "div"
        );


    avatar.className =
        "experience-avatar";


    const avatarImage =
        experience.userPhoto ||
        experience.avatar ||
        experience.profileImage ||
        "";


    if (avatarImage) {

        const img =
            document.createElement(
                "img"
            );


        img.src =
            avatarImage;


        img.alt =
            experience.userName ||
            experience.name ||
            "Traveler";


        avatar.appendChild(
            img
        );

    } else {

        avatar.textContent =
            getInitials(
                experience.userName ||
                experience.name ||
                "Traveler"
            );

    }


    const userInfo =
        document.createElement(
            "div"
        );


    userInfo.className =
        "experience-user-info";


    const userName =
        document.createElement(
            "h3"
        );


    userName.textContent =
        experience.userName ||
        experience.name ||
        "JOUK Traveler";


    const date =
        document.createElement(
            "span"
        );


    date.textContent =
        formatExperienceDate(
            experience.createdAt ||
            experience.date
        );


    userInfo.appendChild(
        userName
    );


    userInfo.appendChild(
        date
    );


    top.appendChild(
        avatar
    );


    top.appendChild(
        userInfo
    );


    card.appendChild(
        top
    );


    // ==================================================
    // RATING
    // ==================================================

    const ratingValue =
        Number(
            experience.rating || 0
        );


    if (ratingValue > 0) {

        const rating =
            document.createElement(
                "div"
            );


        rating.className =
            "experience-rating";


        rating.textContent =
            `★ ${ratingValue.toFixed(1)}`;


        card.appendChild(
            rating
        );

    }


    // ==================================================
    // IMAGE
    // ==================================================

    const image =
        getExperienceImage(
            experience,
            place
        );


    if (image) {

        const experienceImage =
            document.createElement(
                "img"
            );


        experienceImage.className =
            "experience-image";


        experienceImage.src =
            image;


        experienceImage.alt =
            `${place.name} traveler experience`;


        card.appendChild(
            experienceImage
        );

    }
        // ==================================================
    // TEXT
    // ==================================================

    const text =
        document.createElement(
            "p"
        );


    text.className =
        "experience-text";


    text.textContent =
        experience.text ||
        experience.description ||
        experience.experience ||
        experience.review ||
        experience.message ||
        "";


    card.appendChild(
        text
    );


    // ==================================================
    // TAGS
    // ==================================================

    const tags =
        experience.tags;


    if (
        Array.isArray(tags) &&
        tags.length > 0
    ) {

        const tagsContainer =
            document.createElement(
                "div"
            );


        tagsContainer.className =
            "experience-tags";


        tags.forEach(
            function (tag) {

                const tagElement =
                    document.createElement(
                        "span"
                    );


                tagElement.textContent =
                    tag;


                tagsContainer.appendChild(
                    tagElement
                );

            }
        );


        card.appendChild(
            tagsContainer
        );

    }


    return card;

}


// ======================================================
// DELETE EXPERIENCE FROM LOCAL STORAGE
// ======================================================

function deleteStoredExperience(
    experienceToDelete
) {

    const possibleKeys = [

        "joukExperiences",

        "experiences",

        "jOukExperiences",

        "sharedExperiences",

        "userExperiences"

    ];


    possibleKeys.forEach(
        function (key) {

            try {

                const stored =
                    JSON.parse(
                        localStorage.getItem(
                            key
                        )
                    );


                if (!Array.isArray(stored)) {

                    return;

                }


                const updatedExperiences =
                    stored.filter(
                        function (storedExperience) {

                            return !sameExperience(
                                storedExperience,
                                experienceToDelete
                            );

                        }
                    );


                if (
                    updatedExperiences.length !==
                    stored.length
                ) {

                    localStorage.setItem(
                        key,
                        JSON.stringify(
                            updatedExperiences
                        )
                    );

                }

            } catch (error) {

                console.log(
                    "Could not delete experience from:",
                    key,
                    error
                );

            }

        }
    );

}


// ======================================================
// CHECK IF TWO EXPERIENCES ARE THE SAME
// ======================================================

function sameExperience(
    firstExperience,
    secondExperience
) {

    if (
        !firstExperience ||
        !secondExperience
    ) {

        return false;

    }


    // If both have an ID,
    // this is the safest comparison.

    if (
        firstExperience.id != null &&
        secondExperience.id != null
    ) {

        return (
            String(firstExperience.id) ===
            String(secondExperience.id)
        );

    }


    // Some versions may save experienceId.

    if (
        firstExperience.experienceId != null &&
        secondExperience.experienceId != null
    ) {

        return (
            String(
                firstExperience.experienceId
            ) ===
            String(
                secondExperience.experienceId
            )
        );

    }


    // If there is no ID,
    // compare the actual saved experience data.

    const firstPlace =
        normalizePlaceValue(
            firstExperience.placeID ||
            firstExperience.placeId ||
            firstExperience.place ||
            firstExperience.placeName ||
            firstExperience.placeKey ||
            ""
        );


    const secondPlace =
        normalizePlaceValue(
            secondExperience.placeID ||
            secondExperience.placeId ||
            secondExperience.place ||
            secondExperience.placeName ||
            secondExperience.placeKey ||
            ""
        );


    const firstText =
        String(
            firstExperience.text ||
            firstExperience.description ||
            firstExperience.experience ||
            firstExperience.review ||
            firstExperience.message ||
            ""
        ).trim();


    const secondText =
        String(
            secondExperience.text ||
            secondExperience.description ||
            secondExperience.experience ||
            secondExperience.review ||
            secondExperience.message ||
            ""
        ).trim();


    const firstDate =
        String(
            firstExperience.createdAt ||
            firstExperience.date ||
            ""
        );


    const secondDate =
        String(
            secondExperience.createdAt ||
            secondExperience.date ||
            ""
        );


    const firstRating =
        String(
            firstExperience.rating ||
            ""
        );


    const secondRating =
        String(
            secondExperience.rating ||
            ""
        );


    const firstUser =
        String(
            firstExperience.userName ||
            firstExperience.name ||
            ""
        ).trim();


    const secondUser =
        String(
            secondExperience.userName ||
            secondExperience.name ||
            ""
        ).trim();


    // Strong match:
    // place + text + date

    if (
        firstPlace === secondPlace &&
        firstText === secondText &&
        firstDate === secondDate
    ) {

        return true;

    }


    // Fallback for older saved experiences
    // that may not contain createdAt.

    if (
        firstPlace === secondPlace &&
        firstText === secondText &&
        firstRating === secondRating &&
        firstUser === secondUser
    ) {

        return true;

    }


    return false;

}


// ======================================================
// GET ALL EXPERIENCES
// ======================================================

function getAllStoredExperiences() {

    const possibleKeys = [

        "joukExperiences",

        "experiences",

        "jOukExperiences",

        "sharedExperiences",

        "userExperiences"

    ];


    let experiences = [];


    possibleKeys.forEach(
        function (key) {

            try {

                const stored =
                    JSON.parse(
                        localStorage.getItem(
                            key
                        )
                    );


                if (
                    Array.isArray(
                        stored
                    )
                ) {

                    experiences =
                        experiences.concat(
                            stored
                        );

                }

            } catch (error) {

                // Ignore invalid data

            }

        }
    );


    // ==================================================
    // REMOVE DUPLICATES
    // ==================================================

    const uniqueExperiences = [];

    const signatures =
        new Set();


    experiences.forEach(
        function (experience) {

            const signature =
                experience.id != null

                    ? "id:" +
                      String(
                          experience.id
                      )

                    : experience.experienceId != null

                        ? "experienceId:" +
                          String(
                              experience.experienceId
                          )

                        : JSON.stringify(
                            experience
                        );


            if (
                !signatures.has(
                    signature
                )
            ) {

                signatures.add(
                    signature
                );


                uniqueExperiences.push(
                    experience
                );

            }

        }
    );


    return uniqueExperiences;

}


// ======================================================
// SAFE LOCAL STORAGE ARRAY
// ======================================================

function getStoredArray(key) {

    try {

        const value =
            JSON.parse(
                localStorage.getItem(
                    key
                )
            );


        return Array.isArray(
            value
        )
            ? value
            : [];

    } catch (error) {

        return [];

    }

}


// ======================================================
// EXPERIENCE IMAGE
// ======================================================

function getExperienceImage(
    experience,
    place
) {

    if (
        Array.isArray(
            experience.photos
        ) &&
        experience.photos.length > 0
    ) {

        return experience.photos[0];

    }


    if (
        Array.isArray(
            experience.images
        ) &&
        experience.images.length > 0
    ) {

        return experience.images[0];

    }


    if (experience.image) {

        return experience.image;

    }


    if (experience.photo) {

        return experience.photo;

    }


    /*
        Important:
        If the traveler did not upload a photo,
        do NOT use the place hero image
        as their experience photo.
    */

    return "";

}


// ======================================================
// NORMALIZE PLACE VALUE
// ======================================================

function normalizePlaceValue(value) {

    return String(
        value || ""
    )
        .toLowerCase()
        .replace(
            /[^a-z0-9]/g,
            ""
        )
        .trim();

}


// ======================================================
// USER INITIALS
// ======================================================

function getInitials(name) {

    const words =
        String(name)
            .trim()
            .split(/\s+/)
            .filter(Boolean);


    if (
        words.length === 0
    ) {

        return "J";

    }


    if (
        words.length === 1
    ) {

        return (
            words[0]
                .charAt(0)
                .toUpperCase()
        );

    }


    return (
        words[0].charAt(0) +
        words[1].charAt(0)
    ).toUpperCase();

}


// ======================================================
// FORMAT EXPERIENCE DATE
// ======================================================

function formatExperienceDate(
    value
) {

    if (!value) {

        return "Recently";

    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(value);

    }


    return date.toLocaleDateString(

        "en-US",

        {

            month:
                "short",

            day:
                "numeric",

            year:
                "numeric"

        }

    );

}
