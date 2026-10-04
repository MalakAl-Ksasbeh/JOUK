// ========================================
// JOUK - COMMUNITY PAGE
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    // ========================================
    // MAIN ELEMENTS
    // ========================================

    const experiencesGrid =
        document.querySelector(".experiences-grid");

    const filterButtons =
        document.querySelectorAll(".filter-btn");


    // ========================================
    // LOAD SHARED EXPERIENCES
    // ========================================

    function loadSharedExperiences() {

        const savedExperiences =
            localStorage.getItem("joukExperiences");


        if (!savedExperiences) {
            return;
        }


        let experiences = [];


        try {

            experiences =
                JSON.parse(savedExperiences);

        } catch (error) {

            console.error(
                "Could not load experiences:",
                error
            );

            return;
        }


        experiences.forEach(function (experience) {

            createExperienceCard(experience);

        });

    }


    // ========================================
    // CREATE EXPERIENCE CARD
    // ========================================

    function createExperienceCard(experience) {

        if (!experiencesGrid) {
            return;
        }


        const card =
            document.createElement("article");


        card.classList.add("experience-card");

        card.dataset.dynamic = "true";

        card.dataset.id =
            experience.id;


        // ========================================
        // CATEGORY
        // ========================================

        card.dataset.category =
            getExperienceCategory(experience.tags);


        // ========================================
        // USER
        // ========================================

        const userSection =
            document.createElement("div");

        userSection.classList.add("card-user");


        const userInfo =
            document.createElement("a");

        userInfo.classList.add("user-info");

        userInfo.href =
            window.JOUK.url("other pages/profile/index.html");


        // Avatar
        const avatar =
            document.createElement("img");

        avatar.classList.add("user-avatar");

        /*
            مؤقتًا نستخدم صورة موجودة عندك.
            لاحقًا Firebase سيجيب صورة المستخدم الحقيقية.
        */

        avatar.src =
            "images/deadsea.jpeg";

        avatar.alt =
            experience.userName || "User";


        // User text container
        const userText =
            document.createElement("div");


        const userName =
            document.createElement("h3");

        userName.textContent =
            experience.userName || "You";


        const userLocation =
            document.createElement("p");

        userLocation.textContent =
            experience.userLocation || "Amman, Jordan";


        userText.appendChild(userName);

        userText.appendChild(userLocation);


        userInfo.appendChild(avatar);

        userInfo.appendChild(userText);


        // More button
        const moreButton =
            document.createElement("button");

        moreButton.type =
            "button";

        moreButton.classList.add("more-button");

        moreButton.textContent =
            "•••";


        userSection.appendChild(userInfo);

        userSection.appendChild(moreButton);


        card.appendChild(userSection);


        // ========================================
        // EXPERIENCE IMAGE
        // ========================================

        const image =
            document.createElement("img");

        image.classList.add("experience-photo");


        if (
            experience.photos &&
            experience.photos.length > 0
        ) {

            image.src =
                experience.photos[0];

        } else {

            // Default image
            image.src =
                "images/deadsea.jpeg";

        }


        image.alt =
            experience.place || "Experience";


        card.appendChild(image);


        // ========================================
        // CARD CONTENT
        // ========================================

        const content =
            document.createElement("div");

        content.classList.add("card-content");


        // ========================================
        // PLACE ROW
        // ========================================

        const placeRow =
            document.createElement("div");

        placeRow.classList.add("place-row");


        const placeInfo =
            document.createElement("div");


        const category =
            document.createElement("span");

        category.classList.add("category");

        category.textContent =
            getCategoryLabel(
                card.dataset.category
            );


        const placeName =
            document.createElement("h2");

        placeName.textContent =
            experience.place || "Dead Sea";


        placeInfo.appendChild(category);

        placeInfo.appendChild(placeName);


        // ========================================
        // RATING
        // ========================================

        const rating =
            document.createElement("span");

        rating.classList.add("rating");

        rating.textContent =
            "★ " + Number(
                experience.rating || 0
            ).toFixed(1);


        placeRow.appendChild(placeInfo);

        placeRow.appendChild(rating);


        content.appendChild(placeRow);


        // ========================================
        // EXPERIENCE TEXT
        // ========================================

        const experienceText =
            document.createElement("p");

        experienceText.classList.add(
            "experience-text"
        );

        experienceText.textContent =
            experience.text || "";


        content.appendChild(
            experienceText
        );


        // ========================================
        // CARD FOOTER
        // ========================================

        const footer =
            document.createElement("div");

        footer.classList.add("card-footer");


        const actions =
            document.createElement("div");

        actions.classList.add("card-actions");


        // ========================================
        // LIKE BUTTON
        // ========================================

        const likeButton =
            document.createElement("button");

        likeButton.type =
            "button";

        likeButton.classList.add(
            "action-btn",
            "like-btn"
        );


        likeButton.innerHTML = `
            <i data-lucide="heart"></i>
            <span>0</span>
        `;


        // ========================================
        // COMMENT BUTTON
        // ========================================

        const commentButton =
            document.createElement("button");

        commentButton.type =
            "button";

        commentButton.classList.add(
            "action-btn"
        );


        commentButton.innerHTML = `
            <i data-lucide="message-circle"></i>
            <span>0</span>
        `;


        actions.appendChild(
            likeButton
        );

        actions.appendChild(
            commentButton
        );


        // ========================================
        // SAVE BUTTON
        // ========================================

        const saveButton =
            document.createElement("button");

        saveButton.type =
            "button";

        saveButton.classList.add(
            "action-btn",
            "save-btn"
        );


        saveButton.innerHTML = `
            <i data-lucide="bookmark"></i>
        `;


        footer.appendChild(actions);

        footer.appendChild(saveButton);


        content.appendChild(footer);


        card.appendChild(content);


        // ========================================
        // PUT NEW CARD FIRST
        // ========================================

        experiencesGrid.prepend(card);

    }


    // ========================================
    // GET CATEGORY FROM TAGS
    // ========================================

    function getExperienceCategory(tags) {

        if (!Array.isArray(tags)) {
            return "relax";
        }


        const normalizedTags =
            tags.map(function (tag) {

                return tag
                    .toLowerCase()
                    .trim();

            });


        if (
            normalizedTags.includes("adventure")
        ) {

            return "adventure";

        }


        if (
            normalizedTags.includes("relaxation") ||
            normalizedTags.includes("nature") ||
            normalizedTags.includes("sunset")
        ) {

            return "relax";

        }


        return "relax";

    }


    // ========================================
    // CATEGORY LABEL
    // ========================================

    function getCategoryLabel(category) {

        if (category === "adventure") {
            return "Adventure";
        }

        if (category === "culture") {
            return "Culture";
        }

        if (category === "things") {
            return "Things to do";
        }

        return "Relax";
    }


    // ========================================
    // FILTER EXPERIENCES
    // ========================================

    function setupFilters() {

        filterButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const selectedFilter =
                        button.dataset.filter;


                    filterButtons.forEach(
                        function (btn) {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    const allCards =
                        document.querySelectorAll(
                            ".experience-card"
                        );


                    allCards.forEach(
                        function (card) {

                            const category =
                                card.dataset.category;


                            if (
                                selectedFilter === "all" ||
                                selectedFilter === category
                            ) {

                                card.style.display = "";

                            } else {

                                card.style.display = "none";

                            }

                        }
                    );

                }
            );

        });

    }


    // ========================================
    // LIKE BUTTONS
    // ========================================

    function setupLikeButtons() {

        const likeButtons =
            document.querySelectorAll(
                ".like-btn"
            );


        likeButtons.forEach(
            function (button, index) {

                const countElement =
                    button.querySelector("span");


                if (!countElement) {
                    return;
                }


                const card =
                    button.closest(
                        ".experience-card"
                    );


                const cardId =
                    card && card.dataset.id
                        ? card.dataset.id
                        : "static_" + index;


                const storageKey =
                    "communityLike_" + cardId;


                const originalCount =
                    parseInt(
                        countElement.textContent.trim(),
                        10
                    ) || 0;


                let liked =
                    localStorage.getItem(
                        storageKey
                    ) === "true";


                if (liked) {

                    button.classList.add(
                        "liked"
                    );

                    countElement.textContent =
                        originalCount + 1;

                }


                button.addEventListener(
                    "click",
                    function () {

                        liked = !liked;


                        if (liked) {

                            button.classList.add(
                                "liked"
                            );

                            countElement.textContent =
                                originalCount + 1;


                            localStorage.setItem(
                                storageKey,
                                "true"
                            );

                        } else {

                            button.classList.remove(
                                "liked"
                            );

                            countElement.textContent =
                                originalCount;


                            localStorage.setItem(
                                storageKey,
                                "false"
                            );

                        }


                        if (window.lucide) {

                            lucide.createIcons();

                        }

                    }
                );

            }
        );

    }


    // ========================================
    // SAVE BUTTONS
    // ========================================

    function setupSaveButtons() {

        const saveButtons =
            document.querySelectorAll(
                ".save-btn"
            );


        saveButtons.forEach(
            function (button, index) {

                const card =
                    button.closest(
                        ".experience-card"
                    );


                const cardId =
                    card && card.dataset.id
                        ? card.dataset.id
                        : "static_" + index;


                const storageKey =
                    "communitySave_" + cardId;


                let saved =
                    localStorage.getItem(
                        storageKey
                    ) === "true";


                if (saved) {

                    button.classList.add(
                        "saved"
                    );

                }


                button.addEventListener(
                    "click",
                    function () {

                        saved = !saved;


                        if (saved) {

                            button.classList.add(
                                "saved"
                            );


                            localStorage.setItem(
                                storageKey,
                                "true"
                            );

                        } else {

                            button.classList.remove(
                                "saved"
                            );


                            localStorage.setItem(
                                storageKey,
                                "false"
                            );

                        }


                        if (window.lucide) {

                            lucide.createIcons();

                        }

                    }
                );

            }
        );

    }


    // ========================================
    // USER PROFILE LINKS
    // ========================================

    function setupUserLinks() {

        const userLinks =
            document.querySelectorAll(
                ".user-info"
            );


        userLinks.forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    const userName =
                        link.querySelector("h3");


                    if (userName) {

                        localStorage.setItem(
                            "selectedProfileUser",
                            userName.textContent.trim()
                        );

                    }

                }
            );

        });

    }


    // ========================================
    // MORE BUTTONS
    // ========================================

    function setupMoreButtons() {

        const moreButtons =
            document.querySelectorAll(
                ".more-button"
            );


        moreButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        alert(
                            "More options will be available soon."
                        );

                    }
                );

            }
        );

    }


    // ========================================
    // START COMMUNITY PAGE
    // ========================================

    loadSharedExperiences();

    setupFilters();

    setupLikeButtons();

    setupSaveButtons();

    setupUserLinks();

    setupMoreButtons();


    // ========================================
    // LUCIDE ICONS
    // ========================================

    if (window.lucide) {

        lucide.createIcons();

    }

});