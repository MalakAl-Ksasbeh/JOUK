import { auth, db } from "../../shared/firebase.js";

import {
  addDoc,
  collection,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
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
const placeImageInput = document.getElementById("placeImageInput");

let selectedPlaceImageFile = null;
let placeImagePreviewURL = null;

placeImageInput?.addEventListener("change", function () {
    const file = placeImageInput.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Please select an image.");
        placeImageInput.value = "";
        return;
    }

    selectedPlaceImageFile = file;

    if (placeImagePreviewURL) {
        URL.revokeObjectURL(placeImagePreviewURL);
    }

    placeImagePreviewURL = URL.createObjectURL(file);

    placeImageElement.src = placeImagePreviewURL;
    placeImageElement.style.display = "block";

    const placeholder = document.getElementById("placeImagePlaceholder");

    if (placeholder) {
        placeholder.style.display = "none";
    }
});

    // ========================================
    // CURRENT PLACE
    // ========================================

    const urlParams =
        new URLSearchParams(window.location.search);

    const placeID =
    urlParams.get("place") || "";


  let currentPlace = {
    id: placeID,

    name: placeID
        ? formatPlaceName(placeID)
        : "",

    location: placeID
        ? formatPlaceName(placeID) + ", Jordan"
        : "",

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


        // Resolve JSON image paths from the project folder.

        while (path.startsWith("../")) {

            path = path.substring(3);

        }


        if (path.startsWith("./")) {

            path = path.substring(2);

        }


        return window.JOUK.asset(path);

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

           placeNameElement.value =
            currentPlace.name;

        }


        if (placeLocationElement) {

            placeLocationElement.value =
             currentPlace.location;

        }


       if (placeImageElement) {
    const placeholder = document.getElementById("placeImagePlaceholder");

    if (currentPlace.image) {
        placeImageElement.src = currentPlace.image;
        placeImageElement.style.display = "block";

        if (placeholder) {
            placeholder.style.display = "none";
        }
    } else {
        placeImageElement.removeAttribute("src");
        placeImageElement.style.display = "none";

        if (placeholder) {
            placeholder.style.display = "block";
        }
    }

    placeImageElement.alt = currentPlace.name || "Selected place";
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
                            1
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
                    1
                ) {

                    alert(
                        "You can upload only one photo."
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
const enteredPlaceName =
    placeNameElement?.value.trim() || "";

const enteredPlaceLocation =
    placeLocationElement?.value.trim() || "";

if (!enteredPlaceName || !enteredPlaceLocation) {
    alert("Please enter the place name and location.");

    if (!enteredPlaceName) {
        placeNameElement?.focus();
    } else {
        placeLocationElement?.focus();
    }

    return false;
}

// Use the details entered by the traveler
currentPlace.name = enteredPlaceName;
currentPlace.location = enteredPlaceLocation;
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
    
async function compressImage(file) {

    const bitmap = await createImageBitmap(file);

    try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            throw new Error("Image compression is unavailable.");
        }

        let scale = Math.min(
            1,
            1000 / Math.max(bitmap.width, bitmap.height)
        );

        for (let attempt = 0; attempt < 7; attempt++) {

            canvas.width = Math.max(
                1,
                Math.round(bitmap.width * scale)
            );

            canvas.height = Math.max(
                1,
                Math.round(bitmap.height * scale)
            );

            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(
                bitmap,
                0,
                0,
                canvas.width,
                canvas.height
            );

            const compressed = canvas.toDataURL(
                "image/jpeg",
                0.7
            );

            if (compressed.length <= 150000) {
                return compressed;
            }

            scale *= 0.7;
        }

        throw new Error("Image is too large.");

    } finally {
        bitmap.close();
    }
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
                     await compressImage(file);


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

       await auth.authStateReady();

const firebaseUser = auth.currentUser;

if (!firebaseUser) {
    alert("Please log in to share your experience.");
    throw new Error("User not logged in");
}

const user = {
    id: firebaseUser.uid,
    name: firebaseUser.displayName ||
          firebaseUser.email?.split("@")[0] ||
          "JOUK Traveler",
    avatar: firebaseUser.photoURL || ""
};


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

   

    shareBtn.disabled = true;

    const oldButtonContent = shareBtn.innerHTML;
    shareBtn.innerHTML = "Sharing...";

    try {

        // Create experience with the logged-in Firebase user.
        const newExperience = await createExperience();

        // Use the place image until photo uploads are connected.
        const placePhoto = selectedPlaceImageFile
    ? await compressImage(selectedPlaceImageFile)
    : "";

const experienceData = { ...newExperience };
delete experienceData.id;

const experiencePhoto = selectedPhotos.length > 0
    ? newExperience.photos[0]
    : "";

const coverPhoto = placePhoto || experiencePhoto;

const photosToSave = [coverPhoto, experiencePhoto].filter(
    (photo, index, photos) =>
        photo && photos.indexOf(photo) === index
);

const experienceRef = await addDoc(
    collection(db, "experiences"),
    {
        ...experienceData,
        placeImage: coverPhoto,
        photos: photosToSave,
        image: coverPhoto,
        createdAt: serverTimestamp()
    }
);

        localStorage.setItem(
            "lastSharedExperience",
            experienceRef.id
        );

        alert("Your experience was shared successfully!");

        const placeURL =
            window.JOUK.url("other pages/place/index.html") +
            "?place=" +
            encodeURIComponent(currentPlace.id);

        window.location.href = placeURL;

    } catch (error) {

        console.error("Could not share experience:", error);

        if (error.message === "User not logged in") {
            // The login message was already shown.
        } else if (error.code === "permission-denied") {
            alert("You do not have permission to share this experience.");
        } else {
            alert("Something went wrong while sharing your experience.");
        }

    } finally {

        shareBtn.disabled = false;
        shareBtn.innerHTML = oldButtonContent;

    }
}
 

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
