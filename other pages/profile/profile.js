import { auth, db } from "../../shared/firebase.js";
import {
    doc,
    setDoc,
    getDoc,
    collection,
    query,
    where,
    getDocs,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { updateProfile, signOut } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";// The user whose profile is being viewed

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

    name: "JOUK Traveler",

    bio: "Exploring Jordan 🦋",

    location: "Amman, Jordan"

};


// ======================================================
// LOAD PROFILE INFORMATION
// ======================================================

async function loadProfileInformation() {
    const profileName = document.getElementById("profileName");
    const profileBio = document.getElementById("profileBio");
    const profileLocationText = document.getElementById("profileLocationText");

    if (profileName) profileName.textContent = "Loading...";
    if (profileBio) profileBio.textContent = "Loading...";
    if (profileLocationText) profileLocationText.textContent = "Loading...";

    await auth.authStateReady();

    const user = auth.currentUser;

    if (!user) {
        window.location.replace(
            window.JOUK.url("sign up-log in/index.html")
        );
        return;
    }

    if (profileName) {
        profileName.textContent =
            user.displayName ||
            user.email?.split("@")[0] ||
            "JOUK Traveler";
    }

    try {
const profileRef = doc(
    db,
    "users",
    user.uid
);
        const profileSnap = await getDoc(profileRef);

        const profileData = profileSnap.exists()
            ? profileSnap.data()
            : {};

        if (profileBio) {
            profileBio.textContent =
                profileData.bio ?? DEFAULT_PROFILE.bio;
        }

        if (profileLocationText) {
            profileLocationText.textContent =
                profileData.location ?? DEFAULT_PROFILE.location;
        }

    } catch (error) {
        console.error("Could not load profile:", error);

        if (profileBio) profileBio.textContent = "Could not load bio";
        if (profileLocationText) profileLocationText.textContent = "Could not load location";
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
    async function () {
        await auth.authStateReady();

            const profileData =
                getProfileData();


          if (editName) {
    const user = auth.currentUser;

    editName.value = user
        ? (user.displayName ||
           user.email?.split("@")[0] ||
           "")
        : "";
}


            if (editBio) {

               editBio.value =
               document.getElementById("profileBio")?.textContent || "";

            }


            if (editLocation) {

                editLocation.value =
                    document.getElementById("profileLocationText")?.textContent || "";

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
        async function () {

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

if (!auth.currentUser) {
    alert("Please log in first.");
    return;
}

if (!name.trim()) {
    alert("Please enter your name.");
    return;
}

try {
    // Save name in Firebase Authentication
    await updateProfile(auth.currentUser, {
        displayName: name.trim()
    });

    // Save bio and location in Firestore
    await setDoc(
        doc(db, "users", auth.currentUser.uid),
        {
             name: name.trim(),
            bio: bio.trim(),
            location: location.trim()
        },
        { merge: true }
    );

} catch (error) {
    console.error("Could not save profile:", error);
    alert("Could not save profile. Please try again.");
    return;
}
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

async function loadProfileAvatar() {
    const avatar = document.getElementById("profileAvatar");

    if (!avatar) return;

    // Default photo
    avatar.src = "images/deadsea.jpeg";

    await auth.authStateReady();

    const user = auth.currentUser;
    if (!user) return;

    try {
const profileRef = doc(
    db,
    "users",
    user.uid
);        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
            const savedPhoto = profileSnap.data().avatar;

            if (
                typeof savedPhoto === "string" &&
                savedPhoto.startsWith("data:image/")
            ) {
                avatar.src = savedPhoto;
            }
        }

    } catch (error) {
        console.error("Could not load profile photo:", error);
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


                  reader.onload = function (event) {
    const image = new Image();

    image.onload = async function () {
        try {
            await auth.authStateReady();

            const user = auth.currentUser;

            if (!user) {
                alert("Please log in first.");
                return;
            }

            // Resize the selected image
            const canvas = document.createElement("canvas");
            const maxSize = 320;

            const scale = Math.min(
                1,
                maxSize / Math.max(image.width, image.height)
            );

            canvas.width = Math.max(
                1,
                Math.round(image.width * scale)
            );

            canvas.height = Math.max(
                1,
                Math.round(image.height * scale)
            );

            const ctx = canvas.getContext("2d");

            if (!ctx) {
                throw new Error("Could not process image");
            }

            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

            const photoData = canvas.toDataURL("image/jpeg", 0.65);

            if (photoData.length > 150000) {
                alert("Image is too large. Please choose another photo.");
                return;
            }

            // Save photo in Firebase
            await setDoc(
                doc(db, "users", user.uid),
                {
                    avatar: photoData
                },
                {
                    merge: true
                }
            );

            // Show photo only after successful save
            avatar.src = photoData;

            alert("Profile photo saved successfully!");

        } catch (error) {
            console.error("Photo save failed:", error);
            alert("Could not save photo. Please try again.");
        }
    };

    image.onerror = function () {
        alert("Could not open this image.");
    };

    image.src = event.target.result;
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

async function loadProfileExperiences() {
    const grid = document.querySelector(
        "#experiences .experiences-grid"
    );

    if (!grid) return;

    grid.replaceChildren();

    try {
        await auth.authStateReady();

        const user = auth.currentUser;
        if (!user) return;

        const experiencesQuery = query(
            collection(db, "experiences"),
            where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(experiencesQuery);

        const experiences = snapshot.docs.map(doc => doc.data());

        if (experiences.length === 0) {
            const message = document.createElement("p");
            message.textContent = "No experiences shared yet.";
            grid.appendChild(message);
            return;
        }

        experiences.sort((a, b) => {
            const dateA = a.createdAt?.toMillis?.() || 0;
            const dateB = b.createdAt?.toMillis?.() || 0;
            return dateB - dateA;
        });

        experiences.forEach(experience => {
            const card = createProfileExperienceCard(experience);
            grid.appendChild(card);
        });

        initializeIcons();

    } catch (error) {
        console.error("Could not load experiences:", error);

        const message = document.createElement("p");
        message.textContent = "Could not load experiences.";
        grid.appendChild(message);
    }
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
                `${window.JOUK.url("other pages/place/index.html")}?place=${encodeURIComponent(placeKey)}&tab=experiences`;

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

async function loadProfilePhotos() {
    const grid = document.getElementById("profilePhotosGrid");
    const emptyState = document.getElementById("photosEmptyState");
    const photosCount = document.getElementById("photosCount");

    if (!grid) return;

    grid.replaceChildren();

    if (emptyState) {
        emptyState.classList.add("hidden");
    }

    try {
        await auth.authStateReady();

        const user = auth.currentUser;
        if (!user) return;

        // Get only this user's experiences
        const experiencesQuery = query(
            collection(db, "experiences"),
            where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(experiencesQuery);
        const photos = new Set();

        snapshot.forEach(experienceDoc => {
            const experience = experienceDoc.data();

            getAllExperiencePhotos(experience).forEach(photo => {
                if (typeof photo === "string" && photo.trim()) {
                    photos.add(photo);
                }
            });
        });

        // Update photos count
        if (photosCount) {
            photosCount.textContent =
                `${photos.size} ${photos.size === 1 ? "Photo" : "Photos"}`;
        }

        // Show empty message if there are no photos
        if (photos.size === 0) {
            if (emptyState) {
                emptyState.classList.remove("hidden");
            }
            return;
        }

        // Display real photos
        photos.forEach(photo => {
            const photoItem = document.createElement("div");
            photoItem.className = "profile-photo-item";

            const img = document.createElement("img");
            img.src = photo;
            img.alt = "Shared Jordan experience";
            img.loading = "lazy";

            photoItem.appendChild(img);
            grid.appendChild(photoItem);
        });

    } catch (error) {
        console.error("Could not load profile photos:", error);

        if (photosCount) {
            photosCount.textContent = "— Photos";
        }

        if (emptyState) {
            emptyState.classList.remove("hidden");
        }
    }
}


// ======================================================
// SAVED PLANS
// ======================================================


async function loadSavedPlans() {

    const grid = document.getElementById("savedPlansGrid");
    const emptyState = document.getElementById("savedPlansEmpty");

    if (!grid) return;

    grid.replaceChildren();

    if (emptyState) {
        emptyState.classList.add("hidden");
    }

    try {
        await auth.authStateReady();

        const user = auth.currentUser;

        if (!user) {
            if (emptyState) emptyState.classList.remove("hidden");
            return;
        }

        const plansRef = collection(
            db,
            "users",
            user.uid,
            "savedPlans"
        );

        const snapshot = await getDocs(plansRef);

        const savedPlans = snapshot.docs.map(doc => doc.data());

        savedPlans.sort((a, b) =>
            new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );

        if (savedPlans.length === 0) {
            if (emptyState) emptyState.classList.remove("hidden");
            return;
        }

        savedPlans.forEach(function (plan, index) {
            const card = createSavedPlanCard(plan, index);
            grid.appendChild(card);
        });

    } catch (error) {
        console.error("Could not load saved plans:", error);

        if (emptyState) {
            emptyState.classList.remove("hidden");
        }
    }
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

const deleteButton = document.createElement("button");

deleteButton.type = "button";
deleteButton.className = "delete-plan-btn";
deleteButton.textContent = "Delete Plan";

deleteButton.addEventListener("click",async function (event) {
    event.stopPropagation();

    const confirmed = confirm(
    "Are you sure you want to delete this trip?"
);

if (!confirmed) return;

const user = auth.currentUser;
const planID = plan.id ?? plan.tripId ?? plan.planId;

if (!user || planID == null) {
    alert("Could not identify this trip.");
    return;
}

try {
    await deleteDoc(
        doc(db, "users", user.uid, "savedPlans", String(planID))
    );

    const savedPlans = JSON.parse(
        localStorage.getItem("joukPlans") || "[]"
    );

    const updatedPlans = savedPlans.filter(
        item => String(item.id) !== String(planID)
    );

    localStorage.setItem(
        "joukPlans",
        JSON.stringify(updatedPlans)
    );

    card.remove();

    alert("Trip deleted successfully!");

} catch (error) {
    console.error("Error deleting trip:", error);
    alert("Could not delete trip. Please try again.");
}
});

content.appendChild(deleteButton);
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
                `${window.JOUK.url("other pages/view-plan/index.html")}?id=${encodeURIComponent(planID)}`;

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

async function updateProfileStatistics() {
    const placesElement = document.getElementById("placesVisitedCount");
    const experiencesElement = document.getElementById("experiencesCount");

    try {
        await auth.authStateReady();

        const user = auth.currentUser;

        if (!user) return;

        const q = query(
            collection(db, "experiences"),
            where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(q);

        const experiences = snapshot.docs.map(doc => doc.data());

        // Actual number of experiences
        if (experiencesElement) {
            experiencesElement.textContent = experiences.length;
        }

        // Actual number of unique visited places
        const uniquePlaces = new Set();

        experiences.forEach(experience => {
            const place = String(
                experience.placeId ||
                experience.placeName ||
                experience.place ||
                ""
            ).trim().toLowerCase();

            if (place) {
                uniquePlaces.add(place);
            }
        });

        if (placesElement) {
            placesElement.textContent = uniquePlaces.size;
        }

    } catch (error) {
        console.error("Error loading profile statistics:", error);

        if (placesElement) placesElement.textContent = "—";
        if (experiencesElement) experiencesElement.textContent = "—";
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
document.getElementById("logoutBtn")
    ?.addEventListener("click", async function () {

        try {
            await signOut(auth);

            window.location.href =
                window.JOUK.url("sign up-log in/index.html");

        } catch (error) {
            console.error("Logout failed:", error);
            alert("Could not log out. Please try again.");
        }

    });
    // ========================================
// PROFILE COVER PHOTO
// ========================================

async function initializeProfileCover() {
    await auth.authStateReady();

    const user = auth.currentUser;
    if (!user) return;

    const cover = document.getElementById("profileCover");
    const button = document.getElementById("changeCoverBtn");
    const input = document.getElementById("coverFileInput");

    if (!cover || !button || !input) return;

    // Load saved cover
    try {
        const snapshot = await getDoc(doc(db, "users", user.uid));

        if (snapshot.exists() && snapshot.data().coverPhoto) {
            cover.src = snapshot.data().coverPhoto;
        }
    } catch (error) {
        console.error("Could not load cover:", error);
    }

    button.addEventListener("click", () => {
        input.click();
    });

    input.addEventListener("change", async () => {
        const file = input.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select an image.");
            return;
        }

        button.disabled = true;

        try {
            const image = new Image();

            const imageURL = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            await new Promise((resolve, reject) => {
                image.onload = resolve;
                image.onerror = reject;
                image.src = imageURL;
            });

            const canvas = document.createElement("canvas");
            const maxWidth = 1000;
            const maxHeight = 400;

            const scale = Math.min(
                1,
                maxWidth / image.width,
                maxHeight / image.height
            );

            canvas.width = Math.round(image.width * scale);
            canvas.height = Math.round(image.height * scale);

            const context = canvas.getContext("2d");
            context.drawImage(
                image,
                0,
                0,
                canvas.width,
                canvas.height
            );

            const coverData = canvas.toDataURL("image/jpeg", 0.55);

            if (coverData.length > 700000) {
                alert("Image is too large. Please choose another image.");
                return;
            }

            await setDoc(
                doc(db, "users", user.uid),
                { coverPhoto: coverData },
                { merge: true }
            );

            cover.src = coverData;

            alert("Cover photo saved successfully!");

        } catch (error) {
            console.error("Cover upload failed:", error);
            alert("Could not save cover photo.");
        } finally {
            button.disabled = false;
            input.value = "";
        }
    });
}

document.addEventListener("DOMContentLoaded", initializeProfileCover);
// ========================================
// LOAD REAL VISITED PLACES FROM FIREBASE
// ========================================

async function loadRealProfilePlaces() {
    const grid = document.getElementById("profilePlacesGrid");

    if (!grid) return;

    grid.replaceChildren();

    try {
        await auth.authStateReady();

        const user = auth.currentUser;
        if (!user) return;

        const experiencesQuery = query(
            collection(db, "experiences"),
            where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(experiencesQuery);

        const uniquePlaces = new Map();

        snapshot.forEach(experienceDoc => {
            const experience = experienceDoc.data();

            const placeId = getExperiencePlaceKey(experience);
            const placeName = getExperiencePlaceName(experience);

            if (!placeId || uniquePlaces.has(placeId)) return;

            const image =
                experience.photos?.[0] ||
                experience.placeImage ||
                experience.image ||
                "";

            uniquePlaces.set(placeId, {
                id: placeId,
                name: placeName,
                image: image
            });
        });

        if (uniquePlaces.size === 0) {
            const message = document.createElement("p");
            message.textContent = "No places visited yet.";
            grid.appendChild(message);
            return;
        }

        uniquePlaces.forEach(place => {
            const card = document.createElement("article");
            card.className = "place-card";

            const link = document.createElement("a");
            link.href =
                window.JOUK.url("other pages/place/index.html") +
                "?place=" + encodeURIComponent(place.id);

            if (place.image) {
                const img = document.createElement("img");

                img.src = place.image;
                img.alt = place.name;

                link.appendChild(img);
            }

            const title = document.createElement("h3");
            title.textContent = place.name;

            link.appendChild(title);
            card.appendChild(link);
            grid.appendChild(card);
        });

    } catch (error) {
        console.error("Could not load visited places:", error);

        const message = document.createElement("p");
        message.textContent = "Could not load visited places.";
        grid.appendChild(message);
    }
}

document.addEventListener(
    "DOMContentLoaded",
    loadRealProfilePlaces
);