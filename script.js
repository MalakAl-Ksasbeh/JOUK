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
            window.location.href = "index.html";
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

        exploreButton.addEventListener("mouseenter", function () {

            exploreButton.style.transform =
                "translate(-50%, -50%) scale(1.05)";

            exploreButton.style.letterSpacing = "1px";

        });

        exploreButton.addEventListener("mouseleave", function () {

            exploreButton.style.transform =
                "translate(-50%, -50%) scale(1)";

            exploreButton.style.letterSpacing = "0";

        });

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

        picture.addEventListener("mouseenter", function () {

            picture.style.transform =
                "scale(1.06)";

        });

        picture.addEventListener("mouseleave", function () {

            picture.style.transform =
                "scale(1)";

        });

    });

// ================= CARD IMAGE CLICK =================

const cardImages = document.querySelectorAll(".card > img");

cardImages.forEach(function (image) {

    image.style.cursor = "pointer";

    image.addEventListener("click", function () {

        const card = image.closest(".card");

        const link = card.querySelector(".arrow a");

        if (link) {
            window.location.href = link.href;
        }

    });

});
// ================= PROFILE ICON LOGIN =================

const profileIcons = document.querySelectorAll(".profile-icon");

profileIcons.forEach(function (profileIcon) {

    profileIcon.style.cursor = "pointer";

    profileIcon.addEventListener("click", function () {

        window.location.href = "login/login.html";

    });

});
});