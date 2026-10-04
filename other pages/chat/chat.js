// ========================================
// JOUK - CHAT
// ========================================

document.addEventListener("DOMContentLoaded", function () {


    // ========================================
    // ELEMENTS
    // ========================================

    const messageInput =
        document.getElementById("messageInput");

    const sendBtn =
        document.getElementById("sendBtn");

    const chatMessages =
        document.getElementById("chatMessages");

    const chatUserName =
        document.querySelector(".user-info h1");

    const chatAvatar =
        document.querySelector(".chat-avatar");

    const smallAvatars =
        document.querySelectorAll(".small-avatar");


    // ========================================
    // SAFETY CHECK
    // ========================================

    if (
        !messageInput ||
        !sendBtn ||
        !chatMessages
    ) {
        console.error(
            "Chat elements could not be found."
        );

        return;
    }


    // ========================================
    // DEFAULT USER
    // ========================================

    const defaultUser = {
        id: "omar-khaled",
        name: "Omar Khaled",
        location: "Amman, Jordan",
        avatar: "images/wadi rum.jpg"
    };


    // ========================================
    // GET SELECTED CHAT USER
    // ========================================

    function getSelectedChatUser() {

        const savedUser =
            localStorage.getItem(
                "selectedChatUser"
            );


        if (!savedUser) {
            return defaultUser;
        }


        /*
            New version:
            selectedChatUser contains JSON.
        */

        try {

            const parsedUser =
                JSON.parse(savedUser);


            if (
                parsedUser &&
                typeof parsedUser === "object"
            ) {

                return {
                    id:
                        parsedUser.id ||
                        "omar-khaled",

                    name:
                        parsedUser.name ||
                        "Omar Khaled",

                    location:
                        parsedUser.location ||
                        "",

                    avatar:
                        parsedUser.avatar ||
                        ""
                };

            }

        } catch (error) {

            /*
                Old version compatibility:
                selectedChatUser may simply contain
                "Omar Khaled".
            */

            return {
                id: savedUser
                    .toLowerCase()
                    .replace(/\s+/g, "-"),

                name: savedUser,

                location: "",

                avatar: ""
            };

        }


        return defaultUser;
    }


    const selectedUser =
        getSelectedChatUser();


    // ========================================
    // USER INITIALS
    // ========================================

    function getInitials(name) {

        const words =
            String(name || "")
                .trim()
                .split(/\s+/)
                .filter(Boolean);


        if (words.length === 0) {
            return "?";
        }


        if (words.length === 1) {

            return words[0]
                .charAt(0)
                .toUpperCase();

        }


        return (
            words[0].charAt(0) +
            words[1].charAt(0)
        ).toUpperCase();
    }


    // ========================================
    // SHOW SELECTED USER
    // ========================================

    function renderSelectedUser() {

        const initials =
            getInitials(
                selectedUser.name
            );


        if (chatUserName) {

            chatUserName.textContent =
                selectedUser.name;
        }


        if (chatAvatar) {

            chatAvatar.textContent =
                initials;
        }


        smallAvatars.forEach(
            function (avatar) {

                avatar.textContent =
                    initials;

            }
        );

    }


    // ========================================
    // CHAT STORAGE KEY
    // ========================================

    /*
        Every user gets a different key.

        Example:
        joukChat_omar-khaled
    */

    function getChatStorageKey() {

        return (
            "joukChat_" +
            selectedUser.id
        );
    }


    // ========================================
    // GET SAVED MESSAGES
    // ========================================

    function getSavedMessages() {

        try {

            const saved =
                JSON.parse(
                    localStorage.getItem(
                        getChatStorageKey()
                    )
                );


            if (Array.isArray(saved)) {
                return saved;
            }

        } catch (error) {

            console.error(
                "Could not load chat messages:",
                error
            );

        }


        return [];
    }


    // ========================================
    // SAVE MESSAGES
    // ========================================

    function saveMessages(messages) {

        localStorage.setItem(
            getChatStorageKey(),
            JSON.stringify(messages)
        );

    }


    // ========================================
    // FORMAT TIME
    // ========================================

    function formatTime(date) {

        return date.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    }


    // ========================================
    // CREATE MESSAGE
    // ========================================

    function createMessageElement(message) {

        const messageRow =
            document.createElement("div");


        messageRow.classList.add(
            "message-row",
            message.type === "received"
                ? "received"
                : "sent"
        );


        // ------------------------------------
        // RECEIVED AVATAR
        // ------------------------------------

        if (
            message.type === "received"
        ) {

            const avatar =
                document.createElement("div");


            avatar.classList.add(
                "small-avatar"
            );


            avatar.textContent =
                getInitials(
                    selectedUser.name
                );


            messageRow.appendChild(
                avatar
            );
        }


        // ------------------------------------
        // MESSAGE GROUP
        // ------------------------------------

        const messageGroup =
            document.createElement("div");


        messageGroup.classList.add(
            "message-group"
        );


        // ------------------------------------
        // MESSAGE BUBBLE
        // ------------------------------------

        const messageBubble =
            document.createElement("div");


        messageBubble.classList.add(
            "message-bubble"
        );


        messageBubble.textContent =
            message.text;


        // ------------------------------------
        // MESSAGE TIME
        // ------------------------------------

        const messageTime =
            document.createElement("span");


        messageTime.classList.add(
            "message-time"
        );


        messageTime.textContent =
            message.time +
            (
                message.type === "sent"
                    ? " ✓✓"
                    : ""
            );


        // ------------------------------------
        // BUILD MESSAGE
        // ------------------------------------

        messageGroup.appendChild(
            messageBubble
        );


        messageGroup.appendChild(
            messageTime
        );


        messageRow.appendChild(
            messageGroup
        );


        return messageRow;
    }


    // ========================================
    // SCROLL TO BOTTOM
    // ========================================

    function scrollToBottom() {

        chatMessages.scrollTop =
            chatMessages.scrollHeight;

    }


    // ========================================
    // GET DEFAULT HTML MESSAGES
    // ========================================

    /*
        Your HTML already contains the first
        Omar conversation.

        On the first visit only, we convert
        those messages into saved data.
    */

    function getDefaultMessagesFromHTML() {

        const rows =
            chatMessages.querySelectorAll(
                ".message-row"
            );


        const messages = [];


        rows.forEach(
            function (row) {

                const bubble =
                    row.querySelector(
                        ".message-bubble"
                    );


                const timeElement =
                    row.querySelector(
                        ".message-time"
                    );


                if (!bubble) {
                    return;
                }


                let time =
                    timeElement
                        ? timeElement.textContent
                        : "";


                time =
                    time.replace(
                        "✓✓",
                        ""
                    ).trim();


                messages.push({

                    id:
                        Date.now() +
                        Math.random(),

                    type:
                        row.classList.contains(
                            "received"
                        )
                            ? "received"
                            : "sent",

                    text:
                        bubble.textContent.trim(),

                    time:
                        time ||
                        formatTime(
                            new Date()
                        )

                });

            }
        );


        return messages;
    }


    // ========================================
    // RENDER SAVED CHAT
    // ========================================

    function renderMessages() {

        let messages =
            getSavedMessages();


        /*
            First time opening Omar:
            preserve the starter conversation
            already written in /other%20pages/chat/index.html.
        */

        if (messages.length === 0) {

            const defaultMessages =
                getDefaultMessagesFromHTML();


            if (
                selectedUser.id ===
                "omar-khaled"
            ) {

                messages =
                    defaultMessages;


                saveMessages(
                    messages
                );

            } else {

                messages = [];

            }

        }


        // Remove existing message rows.
        // Keep the "Today" label.

        const oldRows =
            chatMessages.querySelectorAll(
                ".message-row"
            );


        oldRows.forEach(
            function (row) {

                row.remove();

            }
        );


        // Add saved messages.

        messages.forEach(
            function (message) {

                const messageElement =
                    createMessageElement(
                        message
                    );


                chatMessages.appendChild(
                    messageElement
                );

            }
        );


        scrollToBottom();

    }


    // ========================================
    // SEND MESSAGE
    // ========================================

    function sendMessage() {

        const messageText =
            messageInput.value.trim();


        if (messageText === "") {
            return;
        }


        const now =
            new Date();


        const newMessage = {

            id: Date.now(),

            type: "sent",

            text: messageText,

            time: formatTime(now)

        };


        // ------------------------------------
        // GET CURRENT CHAT
        // ------------------------------------

        const messages =
            getSavedMessages();


        // ------------------------------------
        // SAVE NEW MESSAGE
        // ------------------------------------

        messages.push(
            newMessage
        );


        saveMessages(
            messages
        );


        // ------------------------------------
        // DISPLAY MESSAGE
        // ------------------------------------

        const messageElement =
            createMessageElement(
                newMessage
            );


        chatMessages.appendChild(
            messageElement
        );


        // ------------------------------------
        // CLEAR INPUT
        // ------------------------------------

        messageInput.value = "";


        // ------------------------------------
        // SCROLL
        // ------------------------------------

        scrollToBottom();


        // ------------------------------------
        // FOCUS
        // ------------------------------------

        messageInput.focus();

    }


    // ========================================
    // SEND BUTTON
    // ========================================

    sendBtn.addEventListener(
        "click",
        sendMessage
    );


    // ========================================
    // ENTER KEY
    // ========================================

    messageInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendMessage();

            }

        }
    );


    // ========================================
    // START CHAT
    // ========================================

    renderSelectedUser();

    renderMessages();


    setTimeout(
        scrollToBottom,
        50
    );


});