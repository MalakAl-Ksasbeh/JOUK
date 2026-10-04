document.addEventListener("DOMContentLoaded", function () {


    // ================= CARDS ANIMATION =================

    const cards = document.querySelectorAll(".card");

    cards.forEach(function (card, index) {

        card.style.opacity = "0";
        card.style.transform = "translateY(8px)";
        card.style.transition =
            "opacity 0.6s ease, transform 0.6s ease";

        setTimeout(function () {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }, index * 60);

    });



    // ================= HERO TEXT ANIMATION =================

    const heroText = document.querySelector(".hero-text");

    if (heroText) {

        heroText.style.opacity = "0";
        heroText.style.transform = "translateY(-15px)";
        heroText.style.transition =
            "opacity 0.7s ease, transform 0.7s ease";

        setTimeout(function () {
            heroText.style.opacity = "1";
            heroText.style.transform = "translateY(0)";
        }, 100);

    }



    // ================= FOCUS IMAGE EFFECT =================

    const images = document.querySelectorAll(".card > img");

    images.forEach(function (image) {

        image.addEventListener("mouseenter", function () {

            images.forEach(function (otherImage) {

                if (otherImage !== image) {
                    otherImage.style.opacity = "0.65";
                }

            });

        });


        image.addEventListener("mouseleave", function () {

            images.forEach(function (otherImage) {
                otherImage.style.opacity = "1";
            });

        });

    });



    // ================= HERO BACKGROUND EFFECT =================

    const hero = document.querySelector(".hero");

    if (hero) {

        hero.style.backgroundSize = "105%";
        hero.style.transition = "background-size 2s ease";

        setTimeout(function () {
            hero.style.backgroundSize = "100%";
        }, 100);

    }



    // ================= JOUK LOGO INTERACTION =================

    const logos = document.querySelectorAll(".logo");

    logos.forEach(function (logo) {

        const originalSpacing =
            window.getComputedStyle(logo).letterSpacing;

        logo.style.cursor = "pointer";
        logo.style.transition = "letter-spacing 0.3s ease";

        logo.addEventListener("mouseenter", function () {
            logo.style.letterSpacing = "5px";
        });

        logo.addEventListener("mouseleave", function () {
            logo.style.letterSpacing = originalSpacing;
        });

        logo.addEventListener("click", function () {
            window.location.href = window.JOUK.url("home page/index.html");
        });

    });



    // ================= PLANS CARDS INTERACTION =================

    const planCards = document.querySelectorAll(".plan-card");

    planCards.forEach(function (card) {

        card.style.transition =
            "filter 0.35s ease, transform 0.35s ease";

        card.addEventListener("mouseenter", function () {

            card.style.transform =
                "translateY(-3px) scale(1.025)";

            planCards.forEach(function (otherCard) {

                if (otherCard !== card) {
                    otherCard.style.filter =
                        "brightness(0.85)";
                }

            });

        });


        card.addEventListener("mouseleave", function () {

            card.style.transform =
                "translateY(0) scale(1)";

            planCards.forEach(function (otherCard) {
                otherCard.style.filter =
                    "brightness(1)";
            });

        });

    });



    // ================= HOME HERO ANIMATION =================

    const homeContent =
        document.querySelector(".hero-content");

    if (homeContent) {

        homeContent.style.opacity = "0";

        homeContent.style.transform =
            "translateX(-20px)";

        homeContent.style.transition =
            "opacity 0.8s ease, transform 0.8s ease";

        setTimeout(function () {

            homeContent.style.opacity = "1";

            homeContent.style.transform =
                "translateX(0)";

        }, 100);

    }



    // ================= EXPLORE BUTTON =================

    const exploreButton =
        document.querySelector(".explore-button");

    if (exploreButton) {

        exploreButton.style.transition =
            "transform 0.3s ease, letter-spacing 0.3s ease, background-color 0.3s ease";

        exploreButton.addEventListener(
            "mouseenter",
            function () {

                exploreButton.style.transform =
                    "translate(-50%, -50%) scale(1.05)";

                exploreButton.style.letterSpacing = "1px";

            }
        );


        exploreButton.addEventListener(
            "mouseleave",
            function () {

                exploreButton.style.transform =
                    "translate(-50%, -50%) scale(1)";

                exploreButton.style.letterSpacing = "0";

            }
        );

    }



    // ================= ABOUT CONTENT ANIMATION =================

    const aboutContent =
        document.querySelector(".about-content");

    if (aboutContent) {

        aboutContent.style.opacity = "0";

        aboutContent.style.transform =
            "translateX(-15px)";

        aboutContent.style.transition =
            "opacity 0.8s ease, transform 0.8s ease";

        setTimeout(function () {

            aboutContent.style.opacity = "1";

            aboutContent.style.transform =
                "translateX(0)";

        }, 100);

    }



    // ================= ABOUT IMAGES HOVER =================

    const aboutPictures =
        document.querySelectorAll(
            ".main-image img, .small-image img"
        );

    aboutPictures.forEach(function (picture) {

        picture.style.transition =
            "transform 0.4s ease";

        picture.addEventListener(
            "mouseenter",
            function () {

                picture.style.transform =
                    "scale(1.06)";

            }
        );


        picture.addEventListener(
            "mouseleave",
            function () {

                picture.style.transform =
                    "scale(1)";

            }
        );

    });



    // ================= CARD IMAGE CLICK =================

    const cardImages =
        document.querySelectorAll(".card > img");

    cardImages.forEach(function (image) {

        image.style.cursor = "pointer";

        image.addEventListener("click", function () {

            const card =
                image.closest(".card");

            const link =
                card.querySelector(".arrow a");

            if (link) {
                window.location.href = link.href;
            }

        });

    });



    // ================= PROFILE ICON LOGIN =================

    const profileIcons =
        document.querySelectorAll(".profile-icon");

    profileIcons.forEach(function (profileIcon) {

        profileIcon.style.cursor = "pointer";

        profileIcon.addEventListener(
            "click",
            function () {

                window.location.href =
                    window.JOUK.url("sign up-log in/index.html");

            }
        );

    });


    // =====================================================
    // ===================== MY PATH ========================
    // =====================================================

    const selectedPlaces =
        document.getElementById("selected-places");

    const placesCount =
        document.getElementById("places-count");

    const googleMapsButton =
        document.getElementById("google-maps-btn");

    const dynamicMarkers =
        document.getElementById("dynamic-markers");

    const routeLines =
        document.getElementById("route-lines");

    const mapMessage =
        document.getElementById("map-message");


    // =====================================================
    // POSITIONS ON OUR JORDAN MAP IMAGE
    // left = horizontal position
    // top  = vertical position
    // =====================================================

    const mapPositions = {

        // NORTH
        ummQais: {
            left: 28,
            top: 12
        },

        ajlounCastle: {
            left: 36,
            top: 20
        },

        ajlounRelax: {
            left: 36,
            top: 20
        },

        dibeenForest: {
            left: 39,
            top: 24
        },

        jerash: {
            left: 43,
            top: 26
        },


        // CENTRAL
        romanTheater: {
            left: 47,
            top: 35
        },

        deadsea: {
            left: 36,
            top: 44
        },

        main: {
            left: 41,
            top: 47
        },

        wadiMujib: {
            left: 43,
            top: 53
        },


        // SOUTH
        karakCastle: {
            left: 43,
            top: 60
        },

        danaReserve: {
            left: 42,
            top: 70
        },

        shobak: {
            left: 43,
            top: 75
        },

        petra: {
            left: 40,
            top: 81
        },

        wadiRum: {
            left: 38,
            top: 90
        },

        aqaba: {
            left: 30,
            top: 94
        },

        aqabaAdventures: {
            left: 30,
            top: 94
        }
    };


    // This code runs only on /paths/index.html

    if (selectedPlaces && placesCount) {

        let myPath =
            JSON.parse(
                localStorage.getItem("myPath")
            ) || [];


        // ================= PLACE COUNT =================

        if (myPath.length === 1) {

            placesCount.textContent =
                "1 Place";

        } else {

            placesCount.textContent =
                myPath.length + " Places";

        }


        // ================= EMPTY PATH =================

        if (myPath.length === 0) {

            if (mapMessage) {
                mapMessage.style.display = "block";
            }

            if (dynamicMarkers) {
                dynamicMarkers.innerHTML = "";
            }

            if (routeLines) {
                routeLines.innerHTML = "";
            }

            if (googleMapsButton) {

                googleMapsButton.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                    }
                );

            }

        } else {

            // Hide center message when places exist

            if (mapMessage) {
                mapMessage.style.display = "none";
            }


            // Remove empty message from left side

            selectedPlaces.innerHTML = "";


            // ================= LOAD PLACES =================

            fetch(window.JOUK.url("data/places.json"))

                .then(function (response) {

                    return response.json();

                })

                .then(function (data) {

                    const routeNames = [];

                    const routePoints = [];


                    // Clear map before drawing

                    if (dynamicMarkers) {
                        dynamicMarkers.innerHTML = "";
                    }

                    if (routeLines) {
                        routeLines.innerHTML = "";
                    }


                    // ================= CREATE PLACES =================

                    myPath.forEach(
                        function (placeID, index) {

                            const place =
                                data[placeID];

                            if (!place) {
                                return;
                            }


                            routeNames.push(
                                place.name
                            );


                            // ================= CARD IMAGE =================

                            let imagePath =
                                place.image;

                            if (
                                imagePath.startsWith("../")
                            ) {

                                imagePath =
                                    imagePath.substring(3);

                            }


                            // ================= CREATE CARD =================

                            const pathItem =
                                document.createElement("div");

                            pathItem.className =
                                "path-place-item";


                            pathItem.innerHTML = `

                                <div class="path-number">
                                    ${index + 1}
                                </div>

                                <img
                                    src="${window.JOUK.asset(imagePath)}"
                                    alt="${place.name}"
                                    class="path-place-image"
                                >

                                <div class="path-place-text">

                                    <h3>
                                        ${place.name}
                                    </h3>

                                    <p>
                                        ${place.location}
                                    </p>

                                    <span>
                                        ${place.info.bestFor}
                                    </span>

                                </div>

                                <button
                                    class="remove-path-place"
                                    data-place="${placeID}"
                                    aria-label="Remove place"
                                >
                                    ×
                                </button>
                            `;


                            selectedPlaces.appendChild(
                                pathItem
                            );


                            // ================= MAP MARKER =================

                            const position =
                                mapPositions[placeID];


                            if (
                                position &&
                                dynamicMarkers
                            ) {

                                const marker =
                                    document.createElement(
                                        "div"
                                    );


                                marker.className =
                                    "journey-marker";


                                marker.style.left =
                                    position.left + "%";

                                marker.style.top =
                                    position.top + "%";


                                marker.innerHTML = `

                                    <div class="journey-marker-number">
                                        ${index + 1}
                                    </div>

                                    <div class="journey-marker-name">
                                        ${place.name}
                                    </div>
                                `;


                                dynamicMarkers.appendChild(
                                    marker
                                );


                                routePoints.push({

                                    x: position.left,

                                    y: position.top

                                });

                            }

                        }
                    );


                    // =====================================================
                    // ================= DRAW ROUTE =========================
                    // =====================================================

                    if (
                        routeLines &&
                        routePoints.length > 1
                    ) {

                        routeLines.setAttribute(
                            "viewBox",
                            "0 0 100 100"
                        );

                        routeLines.setAttribute(
                            "preserveAspectRatio",
                            "none"
                        );


                        const points =
                            routePoints
                                .map(
                                    function (point) {

                                        return (
                                            point.x +
                                            "," +
                                            point.y
                                        );

                                    }
                                )
                                .join(" ");


                        const routeShadow =
                            document.createElementNS(
                                "http://www.w3.org/2000/svg",
                                "polyline"
                            );


                        routeShadow.setAttribute(
                            "points",
                            points
                        );

                        routeShadow.setAttribute(
                            "fill",
                            "none"
                        );

                        routeShadow.setAttribute(
                            "stroke",
                            "rgba(255,255,255,0.75)"
                        );

                        routeShadow.setAttribute(
                            "stroke-width",
                            "1.8"
                        );

                        routeShadow.setAttribute(
                            "stroke-linecap",
                            "round"
                        );

                        routeShadow.setAttribute(
                            "stroke-linejoin",
                            "round"
                        );


                        routeLines.appendChild(
                            routeShadow
                        );


                        const routeLine =
                            document.createElementNS(
                                "http://www.w3.org/2000/svg",
                                "polyline"
                            );


                        routeLine.setAttribute(
                            "points",
                            points
                        );

                        routeLine.setAttribute(
                            "fill",
                            "none"
                        );

                        routeLine.setAttribute(
                            "stroke",
                            "#6f4528"
                        );

                        routeLine.setAttribute(
                            "stroke-width",
                            "0.75"
                        );

                        routeLine.setAttribute(
                            "stroke-linecap",
                            "round"
                        );

                        routeLine.setAttribute(
                            "stroke-linejoin",
                            "round"
                        );


                        routeLines.appendChild(
                            routeLine
                        );

                    }


                    // =====================================================
                    // ================= REMOVE PLACE ======================
                    // =====================================================

                    const removeButtons =
                        document.querySelectorAll(
                            ".remove-path-place"
                        );


                    removeButtons.forEach(
                        function (button) {

                            button.addEventListener(
                                "click",
                                function () {

                                    const placeToRemove =
                                        button.dataset.place;


                                    myPath =
                                        myPath.filter(
                                            function (id) {

                                                return (
                                                    id !==
                                                    placeToRemove
                                                );

                                            }
                                        );


                                    localStorage.setItem(
                                        "myPath",
                                        JSON.stringify(
                                            myPath
                                        )
                                    );


                                    window.location.reload();

                                }
                            );

                        }
                    );


                    // =====================================================
                    // ================= GOOGLE MAPS =======================
                    // =====================================================

                    if (
                        googleMapsButton &&
                        routeNames.length > 0
                    ) {

                        googleMapsButton.addEventListener(
                            "click",
                            function (event) {

                                event.preventDefault();


                                let mapsURL;


                                // ONE PLACE

                                if (
                                    routeNames.length === 1
                                ) {

                                    mapsURL =
                                        "https://www.google.com/maps/search/?api=1&query=" +
                                        encodeURIComponent(
                                            routeNames[0] +
                                            ", Jordan"
                                        );

                                }


                                // TWO OR MORE PLACES

                                else {

                                    const origin =
                                        routeNames[0];


                                    const destination =
                                        routeNames[
                                            routeNames.length - 1
                                        ];


                                    const middlePlaces =
                                        routeNames.slice(
                                            1,
                                            routeNames.length - 1
                                        );


                                    mapsURL =
                                        "https://www.google.com/maps/dir/?api=1" +
                                        "&origin=" +
                                        encodeURIComponent(
                                            origin +
                                            ", Jordan"
                                        ) +
                                        "&destination=" +
                                        encodeURIComponent(
                                            destination +
                                            ", Jordan"
                                        );


                                    if (
                                        middlePlaces.length > 0
                                    ) {

                                        mapsURL +=
                                            "&waypoints=" +
                                            middlePlaces
                                                .map(
                                                    function (name) {

                                                        return (
                                                            encodeURIComponent(
                                                                name +
                                                                ", Jordan"
                                                            )
                                                        );

                                                    }
                                                )
                                                .join("%7C");

                                    }

                                }


                                window.open(
                                    mapsURL,
                                    "_blank"
                                );

                            }
                        );

                    }

                })

                .catch(function (error) {

                    console.log(
                        "Error loading path places:",
                        error
                    );

                });

        }

    }

// =====================================================
// ================ PATH INTERACTIONS ==================
// =====================================================


// ================= PROFILE HOVER =================

const pathProfile =
    document.querySelector(".profile-btn");

if (pathProfile) {

    pathProfile.style.transition =
        "transform 0.3s ease, color 0.3s ease";

    pathProfile.addEventListener(
        "mouseenter",
        function () {

            pathProfile.style.color = "#6f4528";

            pathProfile.style.transform =
                "translateY(-50%) scale(1.15)";
        }
    );

    pathProfile.addEventListener(
        "mouseleave",
        function () {

            pathProfile.style.color = "";

            pathProfile.style.transform =
                "translateY(-50%) scale(1)";
        }
    );
}


// ================= ADD MORE BUTTON =================

const addMoreButton =
    document.querySelector(".add-more-btn");

if (addMoreButton) {

    addMoreButton.style.transition =
        "transform 0.3s ease, background 0.3s ease";

    addMoreButton.addEventListener(
        "mouseenter",
        function () {

            addMoreButton.style.transform =
                "scale(1.02)";
        }
    );

    addMoreButton.addEventListener(
        "mouseleave",
        function () {

            addMoreButton.style.transform =
                "scale(1)";
        }
    );
}


// ================= GOOGLE MAPS BUTTON =================

const pathGoogleButton =
    document.getElementById("google-maps-btn");

if (pathGoogleButton) {

    pathGoogleButton.addEventListener(
        "mouseenter",
        function () {

            pathGoogleButton.style.transform =
                "translateX(-50%) translateY(-3px) scale(1.03)";
        }
    );

    pathGoogleButton.addEventListener(
        "mouseleave",
        function () {

            pathGoogleButton.style.transform =
                "translateX(-50%) translateY(0) scale(1)";
        }
    );
}


// ================= PATH CARD HOVER =================

document.addEventListener(
    "mouseover",
    function (event) {

        const card =
            event.target.closest(".path-place-item");

        if (!card) {
            return;
        }

        card.style.transition =
            "transform 0.3s ease, box-shadow 0.3s ease";

        card.style.transform =
            "translateY(-3px) scale(1.015)";

        card.style.boxShadow =
            "0 10px 25px rgba(70, 45, 28, 0.12)";
    }
);


document.addEventListener(
    "mouseout",
    function (event) {

        const card =
            event.target.closest(".path-place-item");

        if (!card) {
            return;
        }

        card.style.transform =
            "translateY(0) scale(1)";

        card.style.boxShadow =
            "none";
    }
);


// ================= CARD IMAGE ZOOM =================

document.addEventListener(
    "mouseover",
    function (event) {

        if (
            event.target.classList.contains(
                "path-place-image"
            )
        ) {

            event.target.style.transition =
                "transform 0.35s ease";

            event.target.style.transform =
                "scale(1.07)";
        }
    }
);


document.addEventListener(
    "mouseout",
    function (event) {

        if (
            event.target.classList.contains(
                "path-place-image"
            )
        ) {

            event.target.style.transform =
                "scale(1)";
        }
    }
);


// ================= MAP MARKER HOVER =================

document.addEventListener(
    "mouseover",
    function (event) {

        const marker =
            event.target.closest(".journey-marker");

        if (!marker) {
            return;
        }

        marker.style.transition =
            "transform 0.25s ease";

        marker.style.transform =
            "translate(-50%, -50%) scale(1.15)";

        marker.style.zIndex = "30";
    }
);


document.addEventListener(
    "mouseout",
    function (event) {

        const marker =
            event.target.closest(".journey-marker");

        if (!marker) {
            return;
        }

        marker.style.transform =
            "translate(-50%, -50%) scale(1)";

        marker.style.zIndex = "";
    }
);


// ================= REMOVE BUTTON HOVER =================

document.addEventListener(
    "mouseover",
    function (event) {

        if (
            event.target.classList.contains(
                "remove-path-place"
            )
        ) {

            event.target.style.transition =
                "transform 0.25s ease";

            event.target.style.transform =
                "rotate(90deg) scale(1.12)";
        }
    }
);


document.addEventListener(
    "mouseout",
    function (event) {

        if (
            event.target.classList.contains(
                "remove-path-place"
            )
        ) {

            event.target.style.transform =
                "rotate(0deg) scale(1)";
        }
    }
);
});