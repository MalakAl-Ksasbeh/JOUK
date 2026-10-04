// ========================================
// JOUK - MESSAGES PAGE
// ========================================

document.addEventListener("DOMContentLoaded", function () {


    // ========================================
    // ELEMENTS
    // ========================================

    const searchInput =
        document.getElementById("searchInput");

    const conversations =
        document.querySelectorAll(
            ".conversation-item"
        );


    // ========================================
    // USERS
    // ========================================

    const users = {

        "Omar Khaled": {
            id: "omar-khaled",
            name: "Omar Khaled",
            location: "Amman, Jordan",
            avatar: "images/wadi rum.jpg"
        },

        "Lina Tariq": {
            id: "lina-tariq",
            name: "Lina Tariq",
            location: "Amman, Jordan",
            avatar: ""
        },

        "Yara Saleh": {
            id: "yara-saleh",
            name: "Yara Saleh",
            location: "Amman, Jordan",
            avatar: ""
        },

        "Ahmed Nasser": {
            id: "ahmed-nasser",
            name: "Ahmed Nasser",
            location: "Amman, Jordan",
            avatar: ""
        },

        "Maya Ibrahim": {
            id: "maya-ibrahim",
            name: "Maya Ibrahim",
            location: "Amman, Jordan",
            avatar: ""
        }

    };


    // ========================================
    // CREATE USER ID
    // ========================================

    function createUserId(name) {

        return String(name || "")
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-");

    }


    // ========================================
    // GET USER
    // ========================================

    function getUser(userName) {

        if (users[userName]) {
            return users[userName];
        }


        return {

            id: createUserId(userName),

            name: userName,

            location: "",

            avatar: ""

        };

    }


    // ========================================
    // GET SAVED CHAT
    // ========================================

    function getSavedChat(user) {

        try {

            const savedChat =
                JSON.parse(
                    localStorage.getItem(
                        "joukChat_" + user.id
                    )
                );


            if (Array.isArray(savedChat)) {
                return savedChat;
            }

        } catch (error) {

            console.error(
                "Could not read chat for:",
                user.name,
                error
            );

        }


        return [];

    }


    // ========================================
    // UPDATE CONVERSATION PREVIEW
    // ========================================

    function updateConversationPreview(
        conversation
    ) {

        const nameElement =
            conversation.querySelector(
                ".conversation-name"
            );


        const previewElement =
            conversation.querySelector(
                ".conversation-preview"
            );


        const timeElement =
            conversation.querySelector(
                ".conversation-time"
            );


        if (!nameElement) {
            return;
        }


        const userName =
            nameElement.textContent.trim();


        const user =
            getUser(userName);


        const messages =
            getSavedChat(user);


        if (messages.length === 0) {
            return;
        }


        const lastMessage =
            messages[
                messages.length - 1
            ];


        // Update preview

        if (
            previewElement &&
            lastMessage.text
        ) {

            previewElement.textContent =
                lastMessage.text;

        }


        // Update time

        if (
            timeElement &&
            lastMessage.time
        ) {

            timeElement.textContent =
                lastMessage.time;

        }

    }


    // ========================================
    // UPDATE ALL CONVERSATIONS
    // ========================================

    conversations.forEach(
        function (conversation) {

            updateConversationPreview(
                conversation
            );

        }
    );


    // ========================================
    // SEARCH CONVERSATIONS
    // ========================================

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {


                const searchValue =
                    searchInput.value
                        .toLowerCase()
                        .trim();


                conversations.forEach(
                    function (conversation) {


                        const nameElement =
                            conversation.querySelector(
                                ".conversation-name"
                            );


                        const previewElement =
                            conversation.querySelector(
                                ".conversation-preview"
                            );


                        const name =
                            nameElement
                                ? nameElement
                                    .textContent
                                    .toLowerCase()
                                : "";


                        const preview =
                            previewElement
                                ? previewElement
                                    .textContent
                                    .toLowerCase()
                                : "";


                        const matchesSearch =
                            name.includes(
                                searchValue
                            ) ||
                            preview.includes(
                                searchValue
                            );


                        conversation.style.display =
                            matchesSearch
                                ? ""
                                : "none";

                    }
                );

            }
        );

    }


    // ========================================
    // OPEN CHAT
    // ========================================

    conversations.forEach(
        function (conversation) {


            conversation.style.cursor =
                "pointer";


            conversation.addEventListener(
                "click",
                function () {


                    const nameElement =
                        conversation.querySelector(
                            ".conversation-name"
                        );


                    if (!nameElement) {
                        return;
                    }


                    const userName =
                        nameElement
                            .textContent
                            .trim();


                    const selectedUser =
                        getUser(userName);


                    // ==================================
                    // SAVE SELECTED USER
                    // ==================================

                    localStorage.setItem(
                        "selectedChatUser",
                        JSON.stringify(
                            selectedUser
                        )
                    );


                    localStorage.setItem(
                        "selectedChatUserName",
                        selectedUser.name
                    );


                    // ==================================
                    // REMOVE UNREAD BADGE
                    // ==================================

                    const unreadBadge =
                        conversation.querySelector(
                            ".unread-count"
                        );


                    if (unreadBadge) {

                        unreadBadge.remove();

                    }


                    // ==================================
                    // OPEN CHAT
                    // ==================================

                    window.location.href =
                        window.JOUK.url("other pages/chat/index.html");

                }
            );

        }
    );


});