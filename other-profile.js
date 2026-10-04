// ========================================
// JOUK - OTHER USER PROFILE
// ========================================

document.addEventListener("DOMContentLoaded", function () {


    // ========================================
    // USER INFORMATION
    // ========================================

    const currentProfileUser = {

        id: "omar-khaled",

        name: "Omar Khaled",

        location: "Amman, Jordan",

        avatar: "images/wadi rum.jpg"

    };


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
                    "chat.html";

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