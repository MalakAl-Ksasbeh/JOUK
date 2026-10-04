// ========================================
// JOUK - SHARE EXPERIENCE
// PART 1
// ========================================

document.addEventListener("DOMContentLoaded", function () {


    // ========================================
    // ELEMENTS
    // ========================================

    const experienceText =
        document.getElementById("experienceText");

    const photoInput =
        document.getElementById("photoInput");

    const photoList =
        document.getElementById("photoList");

    const stars =
        document.querySelectorAll("#stars button");

    const tags =
        document.querySelectorAll(".tag");

    const shareBtn =
        document.getElementById("shareBtn");

    const placeNameElement =
        document.getElementById("placeName");

    const placeLocationElement =
        document.getElementById("placeLocation");

    const placeImageElement =
        document.getElementById("placeImage");


    // ========================================
    // CURRENT PLACE
    // ========================================

    const urlParams =
        new URLSearchParams(window.location.search);

    const placeID =
        urlParams.get("place") || "deadsea";


    let currentPlace = {

        id: placeID,

        name: formatPlaceName(placeID),

        location:
            formatPlaceName(placeID) + ", Jordan",

        image: ""

    };


    // ========================================
    // VARIABLES
    // ========================================

    let selectedRating = 0;

    let selectedTags = [];

    let selectedPhotos = [];


    // ========================================
    // FORMAT PLACE NAME
    // ========================================

    function formatPlaceName(value) {

        const knownPlaces = {

            deadsea: "Dead Sea",

            petra: "Petra",

            jerash: "Jerash",

            wadirum: "Wadi Rum",

            aqaba: "Aqaba",

            amman: "Amman",

            ajloun: "Ajloun",

            ajlouncastle: "Ajloun Castle",

            dana: "Dana",

            mujib: "Wadi Mujib",

            madaba: "Madaba"

        };


        const normalized =
            String(value || "")
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "");


        if (knownPlaces[normalized]) {

            return knownPlaces[normalized];

        }


        return String(value || "Jordan")

            .replace(/[-_]/g, " ")

            .replace(
                /\b\w/g,
                function (letter) {

                    return letter.toUpperCase();

                }
            );

    }


    // ========================================
    // FALLBACK PLACE IMAGES
    // ========================================

    function getFallbackPlaceImage(id) {

        const images = {

            deadsea:
                "images/deadsea.jpeg",

            petra:
                "images/petra.jpeg",

            wadirum:
                "images/wadi rum.jpg",

            aqaba:
                "images/aqaba.jpg",

            jerash:
                "images/jerash.jpg",

            amman:
                "images/amman.jpg",

            ajloun:
                "images/ajloun.jpg",

            ajlouncastle:
                "images/ajloun.jpg",

            dana:
                "images/dana.jpg",

            mujib:
                "images/mujib.jpg",

            madaba:
                "images/madaba.jpg"

        };


        const normalized =
            String(id || "")
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "");


        return (
            images[normalized] ||
            "images/deadsea.jpeg"
        );

    }


    // ========================================
    // FIX IMAGE PATH
    // ========================================

    function normalizeImagePath(imagePath) {

        if (!imagePath) {

            return getFallbackPlaceImage(placeID);

        }


        let path =
            String(imagePath).trim();


        // If the JSON contains /images/...
        // Share Experience is already in the root folder.

        while (path.startsWith("../")) {

            path = path.substring(3);

        }


        if (path.startsWith("./")) {

            path = path.substring(2);

        }


        return path;

    }


    // ========================================
    // LOAD CURRENT PLACE
    // ========================================

    async function loadCurrentPlace() {

        try {

            const response =
                await fetch(window.JOUK.url("data/places.json"));


            if (!response.ok) {

                updatePlaceOnPage();

                return;

            }


            const places =
                await response.json();


            const place =
                places[placeID];


            if (!place) {

                updatePlaceOnPage();

                return;

            }


            currentPlace = {

                id: placeID,

                name:
                    place.name ||
                    formatPlaceName(placeID),

                location:
                    place.location ||
                    (
                        place.name ||
                        formatPlaceName(placeID)
                    ) + ", Jordan",

                image:
                    normalizeImagePath(
                        place.image
                    )

            };


            updatePlaceOnPage();


        } catch (error) {

            console.log(
                "Could not load current place:",
                error
            );


            updatePlaceOnPage();

        }

    }


    // ========================================
    // UPDATE PLACE ON PAGE
    // ========================================

    function updatePlaceOnPage() {

        if (placeNameElement) {

            placeNameElement.textContent =
                currentPlace.name;

        }


        if (placeLocationElement) {

            placeLocationElement.textContent =
                currentPlace.location;

        }


        if (placeImageElement) {

            placeImageElement.src =
                currentPlace.image ||
                getFallbackPlaceImage(placeID);


            placeImageElement.alt =
                currentPlace.name;

        }

    }


    // ========================================
    // RATING STARS
    // ========================================

    stars.forEach(function (star) {

        star.addEventListener(
            "click",
            function () {

                const clickedRating =
                    Number(
                        star.dataset.rating
                    );


                // Clicking the same rating again
                // removes the rating.

                if (
                    selectedRating ===
                    clickedRating
                ) {

                    selectedRating = 0;

                } else {

                    selectedRating =
                        clickedRating;

                }


                updateStars();

            }
        );

    });


    function updateStars() {

        stars.forEach(function (star) {

            const rating =
                Number(
                    star.dataset.rating
                );


            if (
                rating <=
                selectedRating
            ) {

                star.textContent = "★";

                star.classList.add(
                    "selected"
                );

            } else {

                star.textContent = "☆";

                star.classList.remove(
                    "selected"
                );

            }

        });

    }


    // ========================================
    // TAGS
    // ========================================

    tags.forEach(function (tag) {

        tag.addEventListener(
            "click",
            function () {

                const tagName =
                    tag.textContent.trim();


                if (
                    selectedTags.includes(
                        tagName
                    )
                ) {

                    selectedTags =
                        selectedTags.filter(
                            function (item) {

                                return (
                                    item !== tagName
                                );

                            }
                        );


                    tag.classList.remove(
                        "selected"
                    );

                } else {

                    selectedTags.push(
                        tagName
                    );


                    tag.classList.add(
                        "selected"
                    );

                }

            }
        );

    });


    // ========================================
    // PHOTO UPLOAD
    // ========================================

    if (photoInput) {

        photoInput.addEventListener(
            "change",
            function (event) {

                const files =
                    Array.from(
                        event.target.files
                    );


                files.forEach(
                    function (file) {


                        // Maximum 10 photos

                        if (
                            selectedPhotos.length >=
                            10
                        ) {

                            return;

                        }


                        // Images only

                        if (
                            !file.type.startsWith(
                                "image/"
                            )
                        ) {

                            return;

                        }


                        selectedPhotos.push(
                            file
                        );


                        createPhotoPreview(
                            file
                        );

                    }
                );


                // Allow selecting the same
                // image again later.

                photoInput.value = "";


                if (
                    selectedPhotos.length >=
                    10
                ) {

                    alert(
                        "You can upload up to 10 photos."
                    );

                }

            }
        );

    }


    // ========================================
    // CREATE PHOTO PREVIEW
    // ========================================

    function createPhotoPreview(file) {

        const reader =
            new FileReader();


        reader.onload =
            function (event) {

                const preview =
                    document.createElement(
                        "div"
                    );


                preview.classList.add(
                    "photo-preview"
                );


                const image =
                    document.createElement(
                        "img"
                    );


                image.src =
                    event.target.result;


                image.alt =
                    "Selected photo";


                // ========================================
                // REMOVE PHOTO BUTTON
                // ========================================

                const removeButton =
                    document.createElement(
                        "button"
                    );


                removeButton.type =
                    "button";


                removeButton.classList.add(
                    "remove-photo"
                );


                removeButton.textContent =
                    "×";


                removeButton.setAttribute(
                    "aria-label",
                    "Remove photo"
                );


                removeButton.addEventListener(
                    "click",
                    function () {

                        removePhoto(
                            preview,
                            file
                        );

                    }
                );


                preview.appendChild(
                    image
                );


                preview.appendChild(
                    removeButton
                );


                const addPhotoButton =
                    document.querySelector(
                        ".add-photo"
                    );


                if (
                    photoList &&
                    addPhotoButton
                ) {

                    photoList.insertBefore(
                        preview,
                        addPhotoButton
                    );

                } else if (photoList) {

                    photoList.appendChild(
                        preview
                    );

                }

            };


        reader.readAsDataURL(
            file
        );

    }


    // ========================================
    // REMOVE PHOTO
    // ========================================

    function removePhoto(
        preview,
        file
    ) {

        selectedPhotos =
            selectedPhotos.filter(
                function (photo) {

                    return (
                        photo !== file
                    );

                }
            );


        preview.remove();

    }


    // ========================================
    // CONVERT IMAGE TO DATA URL
    // ========================================

    function convertImageToDataURL(file) {

        return new Promise(
            function (
                resolve,
                reject
            ) {

                const reader =
                    new FileReader();


                reader.onload =
                    function (event) {

                        resolve(
                            event.target.result
                        );

                    };


                reader.onerror =
                    function () {

                        reject(
                            new Error(
                                "Could not read image."
                            )
                        );

                    };


                reader.readAsDataURL(
                    file
                );

            }
        );

    }
        // ========================================
    // GET CURRENT USER
    // ========================================

    function getCurrentUser() {

        /*
            For now we try to read the logged-in
            user from localStorage.

            If the project does not have user
            information saved yet, we use a
            temporary JOUK user.
        */

        const possibleKeys = [
            "currentUser",
            "loggedInUser",
            "user"
        ];


        for (
            let i = 0;
            i < possibleKeys.length;
            i++
        ) {

            const savedValue =
                localStorage.getItem(
                    possibleKeys[i]
                );


            if (!savedValue) {
                continue;
            }


            try {

                const parsed =
                    JSON.parse(
                        savedValue
                    );


                if (
                    parsed &&
                    typeof parsed === "object"
                ) {

                    return {

                        id:
                            parsed.id ||
                            parsed.uid ||
                            "current-user",

                        name:
                            parsed.name ||
                            parsed.displayName ||
                            parsed.username ||
                            "JOUK Traveler",

                        avatar:
                            parsed.avatar ||
                            parsed.photoURL ||
                            ""

                    };

                }

            } catch (error) {

                /*
                    If the stored value is just
                    a plain user name.
                */

                if (
                    typeof savedValue ===
                    "string"
                ) {

                    return {

                        id:
                            savedValue
                                .toLowerCase()
                                .replace(
                                    /\s+/g,
                                    "-"
                                ),

                        name:
                            savedValue,

                        avatar: ""

                    };

                }

            }

        }


        return {

            id: "current-user",

            name: "JOUK Traveler",

            avatar: ""

        };

    }


    // ========================================
    // GET SAVED EXPERIENCES
    // ========================================

    function getSavedExperiences() {

        try {

            const saved =
                JSON.parse(
                    localStorage.getItem(
                        "joukExperiences"
                    )
                );


            if (Array.isArray(saved)) {

                return saved;

            }

        } catch (error) {

            console.error(
                "Could not load experiences:",
                error
            );

        }


        return [];

    }


    // ========================================
    // SAVE EXPERIENCES
    // ========================================

    function saveExperiences(
        experiences
    ) {

        localStorage.setItem(
            "joukExperiences",
            JSON.stringify(
                experiences
            )
        );

    }


    // ========================================
    // CREATE EXPERIENCE ID
    // ========================================

    function createExperienceID() {

        return (
            "experience-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .slice(2, 8)
        );

    }


    // ========================================
    // VALIDATE FORM
    // ========================================

    function validateExperience() {

        const text =
            experienceText
                ? experienceText.value.trim()
                : "";


        if (text === "") {

            alert(
                "Please write something about your experience."
            );


            if (experienceText) {

                experienceText.focus();

            }


            return false;

        }


        if (selectedRating === 0) {

            alert(
                "Please choose a rating."
            );


            return false;

        }


        return true;

    }


    // ========================================
    // PREPARE PHOTOS
    // ========================================

    async function preparePhotos() {

        const photos = [];


        for (
            const file of selectedPhotos
        ) {

            try {

                const dataURL =
                    await convertImageToDataURL(
                        file
                    );


                photos.push(
                    dataURL
                );

            } catch (error) {

                console.error(
                    "Could not prepare photo:",
                    error
                );

            }

        }


        return photos;

    }


    // ========================================
    // CREATE EXPERIENCE
    // ========================================

    async function createExperience() {

        const user =
            getCurrentUser();


        const uploadedPhotos =
            await preparePhotos();


        /*
            If the traveler did not upload a
            photo, use the place photo so the
            Community card still looks complete.
        */

        const experiencePhotos =
            uploadedPhotos.length > 0
                ? uploadedPhotos
                : [
                    currentPlace.image ||
                    getFallbackPlaceImage(
                        placeID
                    )
                ];


        return {

            // Experience information
            id:
                createExperienceID(),

            placeId:
                currentPlace.id,

            place:
                currentPlace.name,

            placeName:
                currentPlace.name,

            location:
                currentPlace.location,

            placeLocation:
                currentPlace.location,

            placeImage:
                currentPlace.image ||
                getFallbackPlaceImage(
                    placeID
                ),


            // User information
            userId:
                user.id,

            userName:
                user.name,

            author:
                user.name,

            userAvatar:
                user.avatar,


            // Experience content
            text:
                experienceText.value.trim(),

            experience:
                experienceText.value.trim(),

            description:
                experienceText.value.trim(),

            rating:
                selectedRating,

            tags:
                [...selectedTags],

            photos:
                experiencePhotos,

            image:
                experiencePhotos[0],


            // Community information
            likes: 0,

            liked: false,

            saved: false,


            // Date
            createdAt:
                new Date().toISOString(),

            date:
                new Date().toLocaleDateString(
                    "en-US",
                    {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                    }
                )

        };

    }


    // ========================================
    // SHARE EXPERIENCE
    // ========================================

    async function shareExperience() {

        if (!validateExperience()) {

            return;

        }


        // Prevent double-clicking while saving.

        shareBtn.disabled = true;


        const oldButtonContent =
            shareBtn.innerHTML;


        shareBtn.innerHTML =
            "Sharing...";


        try {

            // ==================================
            // CREATE EXPERIENCE
            // ==================================

            const newExperience =
                await createExperience();


            // ==================================
            // GET OLD EXPERIENCES
            // ==================================

            const experiences =
                getSavedExperiences();


            // Put newest experience first.

            experiences.unshift(
                newExperience
            );


            // ==================================
            // SAVE
            // ==================================

            try {

                saveExperiences(
                    experiences
                );

            } catch (storageError) {

                /*
                    Browser localStorage has a
                    limited size. Large uploaded
                    photos may exceed that limit.
                */

                console.error(
                    "Could not save experience:",
                    storageError
                );


                alert(
                    "The photos are too large to save in the browser. Try using fewer or smaller photos."
                );


                shareBtn.disabled =
                    false;


                shareBtn.innerHTML =
                    oldButtonContent;


                return;

            }


            // ==================================
            // SAVE LAST SHARED EXPERIENCE
            // ==================================

            localStorage.setItem(
                "lastSharedExperience",
                newExperience.id
            );


            // ==================================
            // SUCCESS
            // ==================================

            alert(
                "Your experience was shared successfully!"
            );


            /*
                The experience is now stored in
                joukExperiences.

                Community already reads from
                joukExperiences, so it can display
                the same experience there.

                Now return to the place the user
                was viewing.
            */


            const placeURL =
                window.JOUK.url("other pages/place/index.html") +
                "?place=" +
                encodeURIComponent(
                    currentPlace.id
                );


            window.location.href =
                placeURL;


        } catch (error) {

            console.error(
                "Could not share experience:",
                error
            );


            alert(
                "Something went wrong while sharing your experience."
            );


            shareBtn.disabled =
                false;


            shareBtn.innerHTML =
                oldButtonContent;

        }

    }


    // ========================================
    // SHARE BUTTON
    // ========================================

    if (shareBtn) {

        shareBtn.addEventListener(
            "click",
            shareExperience
        );

    }


    // ========================================
    // INITIALIZE PAGE
    // ========================================

    updateStars();

    loadCurrentPlace();


});