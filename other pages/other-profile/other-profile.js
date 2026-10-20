// ========================================
// JOUK - OTHER USER PROFILE
// ========================================
import { auth, db } from "../../shared/firebase.js";
import {
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
document.addEventListener("DOMContentLoaded", function () {


    // ========================================
    // USER INFORMATION
    // ========================================

const profileUid = new URLSearchParams(
    window.location.search
).get("uid");

const currentProfileUser = {
    id: profileUid,
    name: "",
    location: "",
    avatar: ""
};

async function initializeOtherProfile() {
    await auth.authStateReady();

    const currentUid = auth.currentUser?.uid;

    // No user specified: do not display Omar's fake profile
    if (!profileUid) {
        window.location.replace(
            window.JOUK.url("reviews/community/index.html")
        );
        return;
    }

    // Own account: always open My Profile
    if (profileUid === currentUid) {
        window.location.replace(
            window.JOUK.url("other pages/profile/index.html")
        );
        return;
    }

    // Another account: load its real information
    try {
        const snapshot = await getDoc(
            doc(db, "users", profileUid)
        );

        const userData = snapshot.exists()
            ? snapshot.data()
            : {};
            console.log("Viewed profile UID:", profileUid);
console.log("Profile document exists:", snapshot.exists());
console.log("Profile data:", userData);

        currentProfileUser.name =
            userData.name || "JOUK Traveler";

        currentProfileUser.location =
            userData.location || "Jordan";

        currentProfileUser.avatar =
            userData.avatar || "";

        document.querySelector(".profile-info h1").textContent =
            currentProfileUser.name;

        document.querySelector(".profile-bio").textContent =
            userData.bio || "";

        document.querySelector(".profile-location").textContent =
            currentProfileUser.location;

        const avatar = document.querySelector(".profile-avatar");

        if (avatar) {
            avatar.alt = currentProfileUser.name;

            if (currentProfileUser.avatar) {
                avatar.src = currentProfileUser.avatar;
            } else {
                avatar.removeAttribute("src");
                avatar.style.display = "none";
            }
        }
// Load the viewed user's cover photo
const cover = document.querySelector(".cover-image");

if (cover && userData.coverPhoto) {
    cover.src = userData.coverPhoto;
}
        document.title = "JOUK - " + currentProfileUser.name;

    } catch (error) {
        console.error("Could not load profile:", error);
        document.querySelector(".profile-info h1").textContent =
            "Profile unavailable";
    }
}
async function loadUserExperiences(uid) {
    const experiencesGrid = document.querySelector(
        "#experiences .experiences-grid"
    );

    const placesGrid = document.querySelector(
        "#places .places-grid"
    );

    const photosGrid = document.querySelector(
        "#photos .photos-grid"
    );

    if (!experiencesGrid || !placesGrid || !photosGrid) {
        return;
    }

    // Remove Omar's hardcoded example cards
    experiencesGrid.replaceChildren();
    placesGrid.replaceChildren();
    photosGrid.replaceChildren();

    const experiencesQuery = query(
        collection(db, "experiences"),
        where("userId", "==", uid)
    );

    const snapshot = await getDocs(experiencesQuery);

    const experiences = snapshot.docs.map(item => ({
        id: item.id,
        ...item.data()
    }));

    const uniquePlaces = new Map();

    experiences.forEach(experience => {
        const placeName =
            experience.placeName ||
            experience.place ||
            "Unknown Place";

        const placeId = experience.placeId || "";
        const photo =
            experience.photos?.[0] ||
            experience.placeImage ||
            "";

        // Experience card
        const card = document.createElement("article");
        card.className = "experience-card";

        const content = document.createElement("div");
        content.className = "experience-content";

        const heading = document.createElement("h3");
        heading.textContent = placeName;

        const description = document.createElement("p");
        description.textContent =
            experience.text ||
            experience.description ||
            "";

        if (photo) {
            const image = document.createElement("img");
            image.src = photo;
            image.alt = placeName;
            card.appendChild(image);
        }

        content.append(heading, description);
        card.appendChild(content);
        experiencesGrid.appendChild(card);

        // Collect each visited place once
        const placeKey = placeId || placeName;

        if (!uniquePlaces.has(placeKey)) {
            uniquePlaces.set(placeKey, {
                name: placeName,
                id: placeId,
                image: experience.placeImage || photo
            });
        }

        // Photos
        const photos = Array.isArray(experience.photos)
            ? experience.photos
            : [];

        photos.forEach(src => {
            if (!src) return;

            const photoCard = document.createElement("div");
            photoCard.className = "photo-card";

            const image = document.createElement("img");
            image.src = src;
            image.alt = placeName;

            photoCard.appendChild(image);
            photosGrid.appendChild(photoCard);
        });
    });

    // Visited places
    uniquePlaces.forEach(place => {
        const card = document.createElement("article");
        card.className = "place-card";

        const link = document.createElement("a");

        if (place.id) {
            link.href =
                window.JOUK.url("other pages/place/index.html") +
                "?place=" + encodeURIComponent(place.id);
        } else {
            link.removeAttribute("href");
        }

        if (place.image) {
            const image = document.createElement("img");
            image.src = place.image;
            image.alt = place.name;
            link.appendChild(image);
        }

        const heading = document.createElement("h3");
        heading.textContent = place.name;

        link.appendChild(heading);
        card.appendChild(link);
        placesGrid.appendChild(card);
    });

    // Actual counts
    const stats = document.querySelectorAll(
        ".profile-stats .stat strong"
    );

    if (stats[0]) {
        stats[0].textContent = uniquePlaces.size;
    }

    if (stats[1]) {
        stats[1].textContent = experiences.length;
    }

    // Followers/following are not connected yet
    if (stats[2]) stats[2].textContent = "—";
    if (stats[3]) stats[3].textContent = "—";
}

initializeOtherProfile();
async function loadOtherProfile() {
    if (!profileUid) return;

    try {
        const profileSnap = await getDoc(
            doc(db, "users", profileUid)
        );

        if (!profileSnap.exists()) {
            console.warn("User profile not found");
            return;
        }

        const profile = profileSnap.data();

        currentProfileUser.name =
            profile.name || "JOUK Traveler";

        currentProfileUser.location =
            profile.location || "Jordan";

        currentProfileUser.avatar =
            profile.avatar || "images/wadi rum.jpg";

        document.querySelector(".profile-info h1").textContent =
            currentProfileUser.name;

        document.querySelector(".profile-bio").textContent =
            profile.bio || "JOUK Traveler";

        document.querySelector(".profile-location").textContent =
            currentProfileUser.location;

        const avatar = document.querySelector(".profile-avatar");

        avatar.src = currentProfileUser.avatar;
        avatar.alt = currentProfileUser.name;

        document.title = "JOUK - " + currentProfileUser.name;
await loadUserExperiences(profileUid);
    } catch (error) {
        console.error("Could not load other profile:", error);
    }
}

loadOtherProfile();

    // ========================================
    // MESSAGE BUTTON
    // ========================================

    const messageBtn =
        document.getElementById("messageBtn");


    if (messageBtn) {

        messageBtn.addEventListener(
            "click",
            function () {


                // Save full user information
                // for the chat page.

                localStorage.setItem(
                    "selectedChatUser",
                    JSON.stringify(
                        currentProfileUser
                    )
                );


                // Compatibility with older chat code
                // if it expects only the user's name.

                localStorage.setItem(
                    "selectedChatUserName",
                    currentProfileUser.name
                );


                // Open chat page

                window.location.href =
                    window.JOUK.url("other pages/chat/index.html");

            }
        );

    }



    // ========================================
    // PROFILE TABS
    // ========================================

    const tabs =
        document.querySelectorAll(
            ".profile-tabs .tab"
        );


    const panels =
        document.querySelectorAll(
            ".tab-panel"
        );


    tabs.forEach(function (tab) {


        tab.addEventListener(
            "click",
            function () {


                const targetID =
                    tab.dataset.tab;


                // Remove active state
                // from every tab.

                tabs.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                // Hide every panel.

                panels.forEach(
                    function (panel) {

                        panel.classList.remove(
                            "active"
                        );

                    }
                );


                // Activate clicked tab.

                tab.classList.add(
                    "active"
                );


                // Show matching section.

                const targetPanel =
                    document.getElementById(
                        targetID
                    );


                if (targetPanel) {

                    targetPanel.classList.add(
                        "active"
                    );

                }

            }
        );

    });



    // ========================================
    // LIKE BUTTONS
    // ========================================

    const likeButtons =
        document.querySelectorAll(
            ".like-btn"
        );


    likeButtons.forEach(
        function (button) {


            button.addEventListener(
                "click",
                function () {


                    const numberElement =
                        button.querySelector(
                            "span"
                        );


                    let currentNumber = 0;


                    if (numberElement) {

                        currentNumber =
                            Number(
                                numberElement.textContent
                            ) || 0;

                    }


                    const isActive =
                        button.classList.toggle(
                            "active"
                        );


                    if (numberElement) {

                        if (isActive) {

                            currentNumber += 1;

                        } else {

                            currentNumber =
                                Math.max(
                                    0,
                                    currentNumber - 1
                                );

                        }


                        numberElement.textContent =
                            currentNumber;

                    }


                    // Change heart appearance.

                    const textNodes =
                        Array.from(
                            button.childNodes
                        );


                    const heartNode =
                        textNodes.find(
                            function (node) {

                                return (
                                    node.nodeType ===
                                    Node.TEXT_NODE
                                );

                            }
                        );


                    if (heartNode) {

                        heartNode.textContent =
                            isActive
                                ? "♥ "
                                : "♡ ";

                    }

                }
            );

        }
    );



    // ========================================
    // BOOKMARK BUTTONS
    // ========================================

    const bookmarkButtons =
        document.querySelectorAll(
            ".bookmark-btn"
        );


    bookmarkButtons.forEach(
        function (button) {


            button.addEventListener(
                "click",
                function () {


                    const isSaved =
                        button.classList.toggle(
                            "active"
                        );


                    button.textContent =
                        isSaved
                            ? "♥"
                            : "♡";

                }
            );

        }
    );



    // ========================================
    // COMMENT BUTTONS
    // ========================================

    const commentButtons =
        document.querySelectorAll(
            ".comment-btn"
        );


    commentButtons.forEach(
        function (button) {


            button.addEventListener(
                "click",
                function () {


                    /*
                        Comments will be connected
                        later with the Community
                        system.

                        For now the button stays
                        functional without taking
                        the user to a broken page.
                    */

                    button.classList.toggle(
                        "active"
                    );

                }
            );

        }
    );



    // ========================================
    // SEE ALL BUTTONS
    // ========================================

    const seeAllButtons =
        document.querySelectorAll(
            ".see-all"
        );


    seeAllButtons.forEach(
        function (button) {


            button.addEventListener(
                "click",
                function () {


                    const section =
                        button.closest(
                            ".tab-panel"
                        );


                    if (!section) {
                        return;
                    }


                    /*
                        For this profile we currently
                        show all available content.

                        Keep the button safe instead
                        of linking to a page that
                        does not exist yet.
                    */

                    section.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        }
    );



    // ========================================
    // MORE BUTTON
    // ========================================

    const moreBtn =
        document.querySelector(
            ".more-btn"
        );


    if (moreBtn) {

        moreBtn.addEventListener(
            "click",
            function () {


                /*
                    We are keeping this ready
                    for future profile options
                    without opening a broken page.
                */

                moreBtn.classList.toggle(
                    "active"
                );

            }
        );

    }



    // ========================================
    // MAKE SURE FIRST TAB IS DISPLAYED
    // ========================================

    function initializeProfileTabs() {


        let activeTab =
            document.querySelector(
                ".profile-tabs .tab.active"
            );


        if (
            !activeTab &&
            tabs.length > 0
        ) {

            activeTab =
                tabs[0];


            activeTab.classList.add(
                "active"
            );

        }


        panels.forEach(
            function (panel) {

                panel.classList.remove(
                    "active"
                );

            }
        );


        if (activeTab) {

            const firstTarget =
                activeTab.dataset.tab;


            const firstPanel =
                document.getElementById(
                    firstTarget
                );


            if (firstPanel) {

                firstPanel.classList.add(
                    "active"
                );

            }

        }

    }


    initializeProfileTabs();


});