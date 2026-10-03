// ======================================================
// JOUK - PROFILE
// PART 1
// ======================================================


// ======================================================
// START PAGE
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    initializeIcons();

    loadProfileInformation();

    setupProfileEditing();

    setupTabs();

    setupProfileActions();

    loadProfileExperiences();

    loadProfilePhotos();

    loadSavedPlans();

    updateProfileStatistics();

});


// ======================================================
// LUCIDE ICONS
// ======================================================

function initializeIcons() {

    if (
        typeof lucide !== "undefined" &&
        lucide.createIcons
    ) {

        lucide.createIcons();

    }

}


// ======================================================
// DEFAULT PROFILE DATA
// ======================================================

const DEFAULT_PROFILE = {

    name: "Sarah Ahmed",

    bio: "Exploring Jordan 🦋",

    location: "Amman, Jordan"

};


// ======================================================
// LOAD PROFILE INFORMATION
// ======================================================

function loadProfileInformation() {

    const profileData =
        getProfileData();


    const profileName =
        document.getElementById(
            "profileName"
        );


    const profileBio =
        document.getElementById(
            "profileBio"
        );


    const profileLocationText =
        document.getElementById(
            "profileLocationText"
        );


    if (profileName) {

        profileName.textContent =
            profileData.name;

    }


    if (profileBio) {

        profileBio.textContent =
            profileData.bio;

    }


    if (profileLocationText) {

        profileLocationText.textContent =
            profileData.location;

    }


    loadProfileAvatar();

}


// ======================================================
// GET PROFILE DATA
// ======================================================

function getProfileData() {

    let profileData = {
        ...DEFAULT_PROFILE
    };


    try {

        const savedProfile =
            JSON.parse(
                localStorage.getItem(
                    "joukProfile"
                )
            );


        if (
            savedProfile &&
            typeof savedProfile === "object"
        ) {

            profileData = {

                name:
                    savedProfile.name ||
                    DEFAULT_PROFILE.name,

                bio:
                    savedProfile.bio ||
                    DEFAULT_PROFILE.bio,

                location:
                    savedProfile.location ||
                    DEFAULT_PROFILE.location

            };

        }

    } catch (error) {

        console.log(
            "Could not load profile information:",
            error
        );

    }


    /*
        Compatibility with older profile data.

        If the previous version of the project
        saved these values separately, we keep
        using them instead of losing the user's
        existing information.
    */

    const oldName =
        localStorage.getItem(
            "profileName"
        );


    const oldBio =
        localStorage.getItem(
            "profileBio"
        );


    const oldLocation =
        localStorage.getItem(
            "profileLocation"
        );


    if (
        oldName &&
        !localStorage.getItem(
            "joukProfile"
        )
    ) {

        profileData.name =
            oldName;

    }


    if (
        oldBio &&
        !localStorage.getItem(
            "joukProfile"
        )
    ) {

        profileData.bio =
            oldBio;

    }


    if (
        oldLocation &&
        !localStorage.getItem(
            "joukProfile"
        )
    ) {

        profileData.location =
            oldLocation;

    }


    return profileData;

}


// ======================================================
// SAVE PROFILE DATA
// ======================================================

function saveProfileData(
    name,
    bio,
    location
) {

    const profileData = {

        name:
            name.trim() ||
            DEFAULT_PROFILE.name,

        bio:
            bio.trim() ||
            DEFAULT_PROFILE.bio,

        location:
            location.trim() ||
            DEFAULT_PROFILE.location

    };


    localStorage.setItem(
        "joukProfile",
        JSON.stringify(
            profileData
        )
    );


    /*
        Also update the old keys so anything
        else in the existing JOUK project that
        still reads them continues working.
    */

    localStorage.setItem(
        "profileName",
        profileData.name
    );


    localStorage.setItem(
        "profileBio",
        profileData.bio
    );


    localStorage.setItem(
        "profileLocation",
        profileData.location
    );


    return profileData;

}


// ======================================================
// PROFILE EDITING
// ======================================================

function setupProfileEditing() {

    const editButton =
        document.getElementById(
            "editProfileBtn"
        );


    const saveButton =
        document.getElementById(
            "saveProfileBtn"
        );


    const cancelButton =
        document.getElementById(
            "cancelProfileBtn"
        );


    const displayInfo =
        document.getElementById(
            "profileDisplayInfo"
        );


    const editForm =
        document.getElementById(
            "editProfileForm"
        );


    const editName =
        document.getElementById(
            "editName"
        );


    const editBio =
        document.getElementById(
            "editBio"
        );


    const editLocation =
        document.getElementById(
            "editLocation"
        );


    if (
        !editButton ||
        !saveButton ||
        !cancelButton ||
        !displayInfo ||
        !editForm
    ) {

        return;

    }


    // ==================================================
    // OPEN EDIT MODE
    // ==================================================

    editButton.addEventListener(
        "click",
        function () {

            const profileData =
                getProfileData();


            if (editName) {

                editName.value =
                    profileData.name;

            }


            if (editBio) {

                editBio.value =
                    profileData.bio;

            }


            if (editLocation) {

                editLocation.value =
                    profileData.location;

            }


            displayInfo.classList.add(
                "hidden"
            );


            editForm.classList.remove(
                "hidden"
            );


            editButton.classList.add(
                "hidden"
            );


            if (editName) {

                editName.focus();

            }

        }
    );


    // ==================================================
    // CANCEL EDITING
    // ==================================================

    cancelButton.addEventListener(
        "click",
        function () {

            closeProfileEditMode();

        }
    );


    // ==================================================
    // SAVE PROFILE
    // ==================================================

    saveButton.addEventListener(
        "click",
        function () {

            const name =
                editName
                    ? editName.value
                    : "";


            const bio =
                editBio
                    ? editBio.value
                    : "";


            const location =
                editLocation
                    ? editLocation.value
                    : "";


            const savedProfile =
                saveProfileData(
                    name,
                    bio,
                    location
                );


            const profileName =
                document.getElementById(
                    "profileName"
                );


            const profileBio =
                document.getElementById(
                    "profileBio"
                );


            const profileLocationText =
                document.getElementById(
                    "profileLocationText"
                );


            if (profileName) {

                profileName.textContent =
                    savedProfile.name;

            }


            if (profileBio) {

                profileBio.textContent =
                    savedProfile.bio;

            }


            if (profileLocationText) {

                profileLocationText.textContent =
                    savedProfile.location;

            }


            closeProfileEditMode();

        }
    );


    // Save with Enter on simple fields

    [
        editName,
        editBio,
        editLocation
    ].forEach(function (input) {

        if (!input) {

            return;

        }


        input.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    saveButton.click();

                }

            }
        );

    });

}


// ======================================================
// CLOSE PROFILE EDIT MODE
// ======================================================

function closeProfileEditMode() {

    const displayInfo =
        document.getElementById(
            "profileDisplayInfo"
        );


    const editForm =
        document.getElementById(
            "editProfileForm"
        );


    const editButton =
        document.getElementById(
            "editProfileBtn"
        );


    if (displayInfo) {

        displayInfo.classList.remove(
            "hidden"
        );

    }


    if (editForm) {

        editForm.classList.add(
            "hidden"
        );

    }


    if (editButton) {

        editButton.classList.remove(
            "hidden"
        );

    }

}


// ======================================================
// PROFILE AVATAR
// ======================================================

function loadProfileAvatar() {

    const avatar =
        document.getElementById(
            "profileAvatar"
        );


    if (!avatar) {

        return;

    }


    const savedAvatar =
        localStorage.getItem(
            "joukProfileAvatar"
        ) ||
        localStorage.getItem(
            "profileAvatar"
        );


    if (savedAvatar) {

        avatar.src =
            savedAvatar;

    }

}


// ======================================================
// CAMERA / CHANGE PROFILE PHOTO
// ======================================================

function setupProfilePhotoChange() {

    const cameraButton =
        document.querySelector(
            ".camera-btn"
        );


    const avatar =
        document.getElementById(
            "profileAvatar"
        );


    if (
        !cameraButton ||
        !avatar
    ) {

        return;

    }


    cameraButton.addEventListener(
        "click",
        function () {

            const fileInput =
                document.createElement(
                    "input"
                );


            fileInput.type =
                "file";


            fileInput.accept =
                "image/*";


            fileInput.style.display =
                "none";


            document.body.appendChild(
                fileInput
            );


            fileInput.addEventListener(
                "change",
                function () {

                    const file =
                        fileInput.files &&
                        fileInput.files[0];


                    if (!file) {

                        fileInput.remove();

                        return;

                    }


                    if (
                        !file.type.startsWith(
                            "image/"
                        )
                    ) {

                        alert(
                            "Please choose an image."
                        );

                        fileInput.remove();

                        return;

                    }


                    const reader =
                        new FileReader();


                    reader.onload =
                        function (event) {

                            const imageData =
                                event.target.result;


                            avatar.src =
                                imageData;


                            try {

                                localStorage.setItem(
                                    "joukProfileAvatar",
                                    imageData
                                );


                                localStorage.setItem(
                                    "profileAvatar",
                                    imageData
                                );

                            } catch (error) {

                                console.log(
                                    "Profile image is too large to save:",
                                    error
                                );

                            }

                        };


                    reader.readAsDataURL(
                        file
                    );


                    fileInput.remove();

                }
            );


            fileInput.click();

        }
    );

}


// ======================================================
// TABS
// ======================================================

function setupTabs() {

    const tabs =
        document.querySelectorAll(
            ".profile-tabs .tab"
        );


    const sections = [
        "places",
        "experiences",
        "photos",
        "saved"
    ];


    tabs.forEach(function (tab) {

        tab.addEventListener(
            "click",
            function () {

                const target =
                    this.dataset.tab;


                tabs.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                this.classList.add(
                    "active"
                );


                sections.forEach(
                    function (sectionID) {

                        const section =
                            document.getElementById(
                                sectionID
                            );


                        if (!section) {

                            return;

                        }


                        if (
                            sectionID ===
                            target
                        ) {

                            section.classList.remove(
                                "hidden"
                            );

                        } else {

                            section.classList.add(
                                "hidden"
                            );

                        }

                    }
                );


                if (
                    target ===
                    "experiences"
                ) {

                    loadProfileExperiences();

                }


                if (
                    target ===
                    "photos"
                ) {

                    loadProfilePhotos();

                }


                if (
                    target ===
                    "saved"
                ) {

                    loadSavedPlans();

                }


                initializeIcons();

            }
        );

    });

}


// ======================================================
// PROFILE BUTTON ACTIONS
// ======================================================

function setupProfileActions() {

    setupProfilePhotoChange();


    // ==================================================
    // LIKE BUTTONS
    // ==================================================

    document.addEventListener(
        "click",
        function (event) {

            const likeButton =
                event.target.closest(
                    ".like-btn"
                );


            if (likeButton) {

                likeButton.classList.toggle(
                    "active"
                );


                const countElement =
                    likeButton.querySelector(
                        "span"
                    );


                if (countElement) {

                    let count =
                        Number(
                            countElement.textContent
                        ) || 0;


                    if (
                        likeButton.classList.contains(
                            "active"
                        )
                    ) {

                        count += 1;

                    } else {

                        count =
                            Math.max(
                                0,
                                count - 1
                            );

                    }


                    countElement.textContent =
                        count;

                }

            }


            const bookmark =
                event.target.closest(
                    ".bookmark"
                );


            if (bookmark) {

                bookmark.classList.toggle(
                    "active"
                );

            }

        }
    );

}


// ======================================================
// EXPERIENCE STORAGE KEYS
// SAME SYSTEM USED BY PLACE DETAILS
// ======================================================

const EXPERIENCE_STORAGE_KEYS = [

    "joukExperiences",

    "experiences",

    "jOukExperiences",

    "sharedExperiences",

    "userExperiences"

];


// ======================================================
// GET ALL STORED EXPERIENCES
// ======================================================

function getAllStoredExperiences() {

    let experiences = [];


    EXPERIENCE_STORAGE_KEYS.forEach(
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

                // Ignore invalid old data.

            }

        }
    );


    // Remove duplicates without deleting
    // anything from localStorage.

    const uniqueExperiences =
        [];


    const signatures =
        new Set();


    experiences.forEach(
        function (experience) {

            const signature =
                getExperienceSignature(
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
// EXPERIENCE SIGNATURE
// ======================================================

function getExperienceSignature(
    experience
) {

    if (
        experience.id != null
    ) {

        return (
            "id:" +
            String(
                experience.id
            )
        );

    }


    if (
        experience.experienceId != null
    ) {

        return (
            "experienceId:" +
            String(
                experience.experienceId
            )
        );

    }


    return JSON.stringify(
        experience
    );

}


// ======================================================
// LOAD EXPERIENCES ON PROFILE
// ======================================================

function loadProfileExperiences() {

    const grid =
        document.querySelector(
            "#experiences .experiences-grid"
        );


    if (!grid) {

        return;

    }


    const experiences =
        getAllStoredExperiences();


    /*
        The two cards written directly in profile.html
        are only visual defaults.

        As soon as the user has real shared experiences,
        the profile shows the real saved data instead.
    */

    if (
        experiences.length === 0
    ) {

        initializeIcons();

        return;

    }


    grid.innerHTML = "";


    const sortedExperiences =
        [...experiences].sort(
            function (a, b) {

                const dateA =
                    new Date(
                        a.createdAt ||
                        a.date ||
                        0
                    ).getTime();


                const dateB =
                    new Date(
                        b.createdAt ||
                        b.date ||
                        0
                    ).getTime();


                return (
                    dateB - dateA
                );

            }
        );


    sortedExperiences.forEach(
        function (experience) {

            const card =
                createProfileExperienceCard(
                    experience
                );


            grid.appendChild(
                card
            );

        }
    );


    initializeIcons();

}


// ======================================================
// CREATE PROFILE EXPERIENCE CARD
// ======================================================

function createProfileExperienceCard(
    experience
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "experience-card user-experience-card";


    const placeKey =
        getExperiencePlaceKey(
            experience
        );


    const placeName =
        getExperiencePlaceName(
            experience
        );


    const image =
        getExperienceImage(
            experience
        );


    // ==================================================
    // IMAGE
    // ==================================================

    if (image) {

        const imageLink =
            document.createElement(
                "a"
            );


        if (placeKey) {

            imageLink.href =
                `place/place-details.html?place=${encodeURIComponent(placeKey)}&tab=experiences`;

        } else {

            imageLink.href =
                "#";

        }


        const img =
            document.createElement(
                "img"
            );


        img.className =
            "experience-image";


        img.src =
            image;


        img.alt =
            placeName ||
            "Jordan experience";


        imageLink.appendChild(
            img
        );


        card.appendChild(
            imageLink
        );

    }


    // ==================================================
    // CONTENT
    // ==================================================

    const content =
        document.createElement(
            "div"
        );


    content.className =
        "experience-content user-experience-content";


    const titleRow =
        document.createElement(
            "div"
        );


    titleRow.className =
        "experience-title";


    const title =
        document.createElement(
            "h3"
        );


    title.textContent =
        placeName ||
        "Jordan Experience";


    titleRow.appendChild(
        title
    );


    const ratingValue =
        Number(
            experience.rating || 0
        );


    if (ratingValue > 0) {

        const rating =
            document.createElement(
                "span"
            );


        rating.className =
            "rating";


        rating.textContent =
            `★ ${ratingValue.toFixed(1)}`;


        titleRow.appendChild(
            rating
        );

    }


    content.appendChild(
        titleRow
    );


    const text =
        document.createElement(
            "p"
        );


    text.textContent =
        experience.text ||
        experience.description ||
        experience.experience ||
        experience.review ||
        experience.message ||
        "Shared a Jordan experience.";


    content.appendChild(
        text
    );


    // ==================================================
    // ACTIONS
    // ==================================================

    const actions =
        document.createElement(
            "div"
        );


    actions.className =
        "experience-actions";


    const likeButton =
        document.createElement(
            "button"
        );


    likeButton.type =
        "button";


    likeButton.className =
        "action-btn like-btn";


    likeButton.innerHTML =
        `
            <i data-lucide="heart"></i>
            <span>0</span>
        `;


    const commentButton =
        document.createElement(
            "button"
        );


    commentButton.type =
        "button";


    commentButton.className =
        "action-btn";


    commentButton.innerHTML =
        `
            <i data-lucide="message-circle"></i>
            <span>0</span>
        `;


    const bookmarkButton =
        document.createElement(
            "button"
        );


    bookmarkButton.type =
        "button";


    bookmarkButton.className =
        "action-btn bookmark";


    bookmarkButton.setAttribute(
        "aria-label",
        "Save experience"
    );


    bookmarkButton.innerHTML =
        `<i data-lucide="bookmark"></i>`;


    actions.appendChild(
        likeButton
    );


    actions.appendChild(
        commentButton
    );


    actions.appendChild(
        bookmarkButton
    );


    content.appendChild(
        actions
    );


    card.appendChild(
        content
    );


    return card;

}
// ======================================================
// GET EXPERIENCE PLACE KEY
// ======================================================

function getExperiencePlaceKey(
    experience
) {

    const value =
        experience.placeID ||
        experience.placeId ||
        experience.placeKey ||
        experience.place ||
        "";


    if (!value) {

        return "";

    }


    const normalized =
        normalizePlaceValue(
            value
        );


    const placeMap = {

        deadsea:
            "deadsea",

        deadseajordan:
            "deadsea",

        petra:
            "petra",

        petramaanjordan:
            "petra",

        wadirum:
            "wadirum",

        wadirumjordan:
            "wadirum",

        jerash:
            "jerash",

        jerashjordan:
            "jerash",

        ajloun:
            "ajloun",

        ajlounforest:
            "ajloun",

        main:
            "main",

        mainhotsprings:
            "main",

        mainhotspringsjordan:
            "main",

        mujib:
            "mujib",

        wadimujib:
            "mujib",

        dana:
            "dana",

        danabiospherereserve:
            "dana",

        aqaba:
            "aqaba"

    };


    return (
        placeMap[normalized] ||
        value
    );

}


// ======================================================
// GET EXPERIENCE PLACE NAME
// ======================================================

function getExperiencePlaceName(
    experience
) {

    if (experience.placeName) {

        return experience.placeName;

    }


    const placeKey =
        getExperiencePlaceKey(
            experience
        );


    const names = {

        deadsea:
            "Dead Sea",

        petra:
            "Petra",

        wadirum:
            "Wadi Rum",

        jerash:
            "Jerash",

        ajloun:
            "Ajloun",

        main:
            "Ma'in Hot Springs",

        mujib:
            "Wadi Mujib",

        dana:
            "Dana Biosphere Reserve",

        aqaba:
            "Aqaba"

    };


    const normalized =
        normalizePlaceValue(
            placeKey
        );


    return (
        names[normalized] ||
        experience.place ||
        experience.placeID ||
        experience.placeId ||
        experience.placeKey ||
        "Jordan"
    );

}


// ======================================================
// GET EXPERIENCE IMAGE
// ======================================================

function getExperienceImage(
    experience
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


    return "";

}


// ======================================================
// GET ALL EXPERIENCE PHOTOS
// ======================================================

function getAllExperiencePhotos(
    experience
) {

    const photos = [];


    if (
        Array.isArray(
            experience.photos
        )
    ) {

        experience.photos.forEach(
            function (photo) {

                if (photo) {

                    photos.push(
                        photo
                    );

                }

            }
        );

    }


    if (
        Array.isArray(
            experience.images
        )
    ) {

        experience.images.forEach(
            function (photo) {

                if (
                    photo &&
                    !photos.includes(photo)
                ) {

                    photos.push(
                        photo
                    );

                }

            }
        );

    }


    if (
        experience.image &&
        !photos.includes(
            experience.image
        )
    ) {

        photos.push(
            experience.image
        );

    }


    if (
        experience.photo &&
        !photos.includes(
            experience.photo
        )
    ) {

        photos.push(
            experience.photo
        );

    }


    return photos;

}


// ======================================================
// PROFILE PHOTOS
// ======================================================

function loadProfilePhotos() {

    const grid =
        document.getElementById(
            "profilePhotosGrid"
        );


    const emptyState =
        document.getElementById(
            "photosEmptyState"
        );


    const photosCount =
        document.getElementById(
            "photosCount"
        );


    if (!grid) {

        return;

    }


    grid.innerHTML = "";


    const experiences =
        getAllStoredExperiences();


    const photos = [];


    experiences.forEach(
        function (experience) {

            const experiencePhotos =
                getAllExperiencePhotos(
                    experience
                );


            experiencePhotos.forEach(
                function (photo) {

                    if (
                        photo &&
                        !photos.includes(
                            photo
                        )
                    ) {

                        photos.push(
                            photo
                        );

                    }

                }
            );

        }
    );


    if (photosCount) {

        photosCount.textContent =
            `${photos.length} ${
                photos.length === 1
                    ? "Photo"
                    : "Photos"
            }`;

    }


    if (
        photos.length === 0
    ) {

        if (emptyState) {

            emptyState.classList.remove(
                "hidden"
            );

        }


        return;

    }


    if (emptyState) {

        emptyState.classList.add(
            "hidden"
        );

    }


    photos.forEach(
        function (photo) {

            const photoItem =
                document.createElement(
                    "div"
                );


            photoItem.className =
                "profile-photo-item";


            const img =
                document.createElement(
                    "img"
                );


            img.src =
                photo;


            img.alt =
                "Shared Jordan experience";


            img.loading =
                "lazy";


            photoItem.appendChild(
                img
            );


            grid.appendChild(
                photoItem
            );

        }
    );

}


// ======================================================
// SAVED PLANS
// ======================================================

function loadSavedPlans() {

    const grid =
        document.getElementById(
            "savedPlansGrid"
        );


    const emptyState =
        document.getElementById(
            "savedPlansEmpty"
        );


    if (!grid) {

        return;

    }


    grid.innerHTML = "";


    const savedPlans =
        getAllSavedPlans();


    if (
        savedPlans.length === 0
    ) {

        if (emptyState) {

            emptyState.classList.remove(
                "hidden"
            );

        }


        return;

    }


    if (emptyState) {

        emptyState.classList.add(
            "hidden"
        );

    }


    savedPlans.forEach(
        function (plan, index) {

            const card =
                createSavedPlanCard(
                    plan,
                    index
                );


            grid.appendChild(
                card
            );

        }
    );

}


// ======================================================
// GET SAVED PLANS
// ======================================================

function getAllSavedPlans() {

    const possibleKeys = [

        "savedTrips",

        "joukTrips",

        "myTrips",

        "savedPlans",

        "joukPlans"

    ];


    let plans = [];


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

                    plans =
                        plans.concat(
                            stored
                        );

                }

            } catch (error) {

                // Ignore invalid old data.

            }

        }
    );


    const uniquePlans = [];

    const signatures =
        new Set();


    plans.forEach(
        function (plan) {

            const signature =
                plan.id != null
                    ? "id:" +
                      String(plan.id)
                    : JSON.stringify(
                        plan
                    );


            if (
                !signatures.has(
                    signature
                )
            ) {

                signatures.add(
                    signature
                );


                uniquePlans.push(
                    plan
                );

            }

        }
    );


    return uniquePlans;

}


// ======================================================
// CREATE SAVED PLAN CARD
// ======================================================

function createSavedPlanCard(
    plan,
    index
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "saved-plan-card";


    const image =
        getSavedPlanImage(
            plan
        );


    if (image) {

        const img =
            document.createElement(
                "img"
            );


        img.src =
            image;


        img.alt =
            plan.name ||
            plan.tripName ||
            plan.title ||
            "Jordan trip";


        card.appendChild(
            img
        );

    }


    const content =
        document.createElement(
            "div"
        );


    content.className =
        "saved-plan-content";


    const title =
        document.createElement(
            "h3"
        );


    title.textContent =
        plan.name ||
        plan.tripName ||
        plan.title ||
        `Jordan Journey ${index + 1}`;


    content.appendChild(
        title
    );


    const meta =
        document.createElement(
            "p"
        );


    const days =
        getPlanDaysCount(
            plan
        );


    const places =
        getPlanPlacesCount(
            plan
        );


    meta.textContent =
        `${days} ${
            days === 1
                ? "Day"
                : "Days"
        } • ${places} ${
            places === 1
                ? "Place"
                : "Places"
        }`;


    content.appendChild(
        meta
    );


    card.appendChild(
        content
    );


    card.style.cursor =
        "pointer";


    card.addEventListener(
        "click",
        function () {

            const planID =
                plan.id ??
                plan.tripId ??
                plan.planId ??
                index;


            window.location.href =
                `view-plan.html?id=${encodeURIComponent(planID)}`;

        }
    );


    return card;

}


// ======================================================
// SAVED PLAN IMAGE
// ======================================================

function getSavedPlanImage(
    plan
) {

    if (plan.image) {

        return plan.image;

    }


    if (plan.heroImage) {

        return plan.heroImage;

    }


    if (plan.coverImage) {

        return plan.coverImage;

    }


    if (
        Array.isArray(plan.places) &&
        plan.places.length > 0
    ) {

        const firstPlace =
            plan.places[0];


        if (
            firstPlace &&
            typeof firstPlace === "object"
        ) {

            return (
                firstPlace.image ||
                firstPlace.photo ||
                ""
            );

        }

    }


    return "";

}


// ======================================================
// PLAN DAYS COUNT
// ======================================================

function getPlanDaysCount(
    plan
) {

    if (
        Number.isFinite(
            Number(plan.daysCount)
        )
    ) {

        return Number(
            plan.daysCount
        );

    }


    if (
        Number.isFinite(
            Number(plan.days)
        )
    ) {

        return Number(
            plan.days
        );

    }


    if (
        Array.isArray(
            plan.itinerary
        )
    ) {

        return plan.itinerary.length;

    }


    if (
        Array.isArray(
            plan.days
        )
    ) {

        return plan.days.length;

    }


    return 0;

}


// ======================================================
// PLAN PLACES COUNT
// ======================================================

function getPlanPlacesCount(
    plan
) {

    if (
        Number.isFinite(
            Number(plan.placesCount)
        )
    ) {

        return Number(
            plan.placesCount
        );

    }


    if (
        Array.isArray(
            plan.places
        )
    ) {

        return plan.places.length;

    }


    if (
        Array.isArray(
            plan.selectedPlaces
        )
    ) {

        return plan.selectedPlaces.length;

    }


    if (
        Array.isArray(
            plan.itinerary
        )
    ) {

        let total = 0;


        plan.itinerary.forEach(
            function (day) {

                if (
                    Array.isArray(
                        day.places
                    )
                ) {

                    total +=
                        day.places.length;

                }

            }
        );


        return total;

    }


    return 0;

}


// ======================================================
// PROFILE STATISTICS
// ======================================================

function updateProfileStatistics() {

    const placesElement =
        document.getElementById(
            "placesVisitedCount"
        );


    const experiencesElement =
        document.getElementById(
            "experiencesCount"
        );


    const experiences =
        getAllStoredExperiences();


    if (experiencesElement) {

        experiencesElement.textContent =
            experiences.length;

    }


    if (placesElement) {

        const uniquePlaces =
            new Set();


        experiences.forEach(
            function (experience) {

                const place =
                    getExperiencePlaceKey(
                        experience
                    );


                if (place) {

                    uniquePlaces.add(
                        normalizePlaceValue(
                            place
                        )
                    );

                }

            }
        );


        /*
            Keep the existing visual places from
            the profile as visited places too.
        */

        document
            .querySelectorAll(
                "#places .place-card a"
            )
            .forEach(
                function (link) {

                    try {

                        const url =
                            new URL(
                                link.href
                            );


                        const place =
                            url.searchParams.get(
                                "place"
                            );


                        if (place) {

                            uniquePlaces.add(
                                normalizePlaceValue(
                                    place
                                )
                            );

                        }

                    } catch (error) {

                        // Ignore invalid links.

                    }

                }
            );


        placesElement.textContent =
            uniquePlaces.size;

    }

}


// ======================================================
// NORMALIZE PLACE VALUE
// ======================================================

function normalizePlaceValue(
    value
) {

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