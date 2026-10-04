// ==================================================
// JOUK - PLACE DETAILS EFFECTS
// ==================================================



// ================= TABS =================

const tabs = document.querySelectorAll(".details-tab");

const contents = document.querySelectorAll(".tab-content");


tabs.forEach(tab => {

    tab.addEventListener("click", function () {


        // Remove active from all tabs

        tabs.forEach(t => {

            t.classList.remove("active");

        });


        // Hide all contents

        contents.forEach(content => {

            content.classList.remove("active");

        });


        // Activate clicked tab

        this.classList.add("active");


        // Get related content

        const target = this.dataset.target;

        const targetContent =
            document.getElementById(target);


        targetContent.classList.add("active");


        // Smooth content animation

        targetContent.animate(

            [

                {
                    opacity: 0,
                    transform: "translateY(20px)"
                },

                {
                    opacity: 1,
                    transform: "translateY(0)"
                }

            ],

            {

                duration: 550,

                easing: "ease-out"

            }

        );


    });

});



// ==================================================
// JOUK LOGO
// ==================================================

const logo = document.querySelector(".logo");


if (logo) {


    logo.addEventListener("mouseenter", function () {

        logo.style.transform =
            "scale(1.10)";

        logo.style.letterSpacing =
            "4px";

    });


    logo.addEventListener("mouseleave", function () {

        logo.style.transform =
            "scale(1)";

        logo.style.letterSpacing =
            "2px";

    });


}



// ==================================================
// NAVIGATION LINKS
// ==================================================

const navLinks =
    document.querySelectorAll("nav a");


navLinks.forEach(link => {


    link.addEventListener("mouseenter", function () {

        link.style.transform =
            "translateY(-3px)";

        link.style.opacity =
            "0.65";

    });


    link.addEventListener("mouseleave", function () {

        link.style.transform =
            "translateY(0)";

        link.style.opacity =
            "1";

    });


});



// ==================================================
// PROFILE ICON
// ==================================================

const profileButton =
    document.querySelector(".profile-btn");


if (profileButton) {


    profileButton.addEventListener("mouseenter", function () {

        profileButton.style.transform =
            "scale(1.15)";

    });


    profileButton.addEventListener("mouseleave", function () {

        profileButton.style.transform =
            "scale(1)";

    });


}



// ==================================================
// HERO IMAGE
// ==================================================

const heroImage =
    document.getElementById("place-image");


if (heroImage) {


    heroImage.addEventListener("mouseenter", function () {

        heroImage.style.transform =
            "scale(1.025)";

        heroImage.style.filter =
            "brightness(0.90)";

    });


    heroImage.addEventListener("mouseleave", function () {

        heroImage.style.transform =
            "scale(1)";

        heroImage.style.filter =
            "brightness(1)";

    });


}



// ==================================================
// PLACE CARD ENTRANCE
// ==================================================

const placeCard =
    document.querySelector(".place-card");


if (placeCard) {


    placeCard.animate(

        [

            {
                opacity: 0,
                transform: "translateY(35px)"
            },

            {
                opacity: 1,
                transform: "translateY(0)"
            }

        ],

        {

            duration: 900,

            easing: "ease-out"

        }

    );


}



// ==================================================
// INFORMATION ITEMS
// ==================================================

const infoItems =
    document.querySelectorAll(".info-item");


infoItems.forEach(item => {


    item.addEventListener("mouseenter", function () {


        item.style.transform =
            "translateY(-5px)";


        const icon =
            item.querySelector("span");


        if (icon) {

            icon.style.transform =
                "translateY(-3px) rotate(5deg)";

        }


    });


    item.addEventListener("mouseleave", function () {


        item.style.transform =
            "translateY(0)";


        const icon =
            item.querySelector("span");


        if (icon) {

            icon.style.transform =
                "translateY(0) rotate(0deg)";

        }


    });


});



// ==================================================
// ADD TO MY PATH BUTTON
// ==================================================

const pathButton =
    document.querySelector(".path-btn");


if (pathButton) {


    pathButton.addEventListener("mouseenter", function () {

        pathButton.style.transform =
            "scale(1.06)";

        pathButton.style.boxShadow =
            "0 8px 20px rgba(0,0,0,0.18)";

    });


    pathButton.addEventListener("mouseleave", function () {

        pathButton.style.transform =
            "scale(1)";

        pathButton.style.boxShadow =
            "none";

    });


}



// ==================================================
// TAB BUTTON MOVEMENT
// ==================================================

tabs.forEach(tab => {


    tab.addEventListener("mouseenter", function () {

        tab.style.transform =
            "translateY(-3px)";

    });


    tab.addEventListener("mouseleave", function () {

        tab.style.transform =
            "translateY(0)";

    });


});



// ==================================================
// QUICK INFO
// ==================================================

const quickInfo =
    document.querySelector(".quick-info");


if (quickInfo) {


    quickInfo.addEventListener("mouseenter", function () {

        quickInfo.style.transform =
            "translateY(-7px)";

        quickInfo.style.boxShadow =
            "0 12px 30px rgba(0,0,0,0.15)";

    });


    quickInfo.addEventListener("mouseleave", function () {

        quickInfo.style.transform =
            "translateY(0)";

        quickInfo.style.boxShadow =
            "0 5px 20px rgba(0,0,0,0.1)";

    });


}



// ==================================================
// DYNAMIC PHOTOS + HIGHLIGHTS
// place-details.js creates these elements
// ==================================================

setTimeout(function () {


    // ================= PHOTOS =================

    const photos =
        document.querySelectorAll(
            "#photos-container img"
        );


    photos.forEach(photo => {


        photo.addEventListener(
            "mouseenter",
            function () {

                photo.style.transform =
                    "scale(1.05)";

                photo.style.boxShadow =
                    "0 10px 25px rgba(0,0,0,0.20)";

            }
        );


        photo.addEventListener(
            "mouseleave",
            function () {

                photo.style.transform =
                    "scale(1)";

                photo.style.boxShadow =
                    "none";

            }
        );


    });



    // ================= HIGHLIGHT CARDS =================

    const highlightCards =
        document.querySelectorAll(
            ".highlight-card"
        );


    highlightCards.forEach(card => {


        card.addEventListener(
            "mouseenter",
            function () {


                card.style.transform =
                    "translateY(-8px)";


                card.style.boxShadow =
                    "0 15px 30px rgba(0,0,0,0.16)";


                const image =
                    card.querySelector("img");


                if (image) {

                    image.style.transform =
                        "scale(1.05)";

                }


            }
        );


        card.addEventListener(
            "mouseleave",
            function () {


                card.style.transform =
                    "translateY(0)";


                card.style.boxShadow =
                    "0 5px 20px rgba(0,0,0,0.08)";


                const image =
                    card.querySelector("img");


                if (image) {

                    image.style.transform =
                        "scale(1)";

                }


            }
        );


    });


}, 500);