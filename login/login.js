
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");

const tabs = document.getElementById("tabs");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const guestBtn = document.getElementById("guestBtn");


// 2. SIGN UP TAB


signupTab.addEventListener("click", function () {

    // Hide Login form
    loginForm.style.display = "none";

    // Hide Continue as Guest button
    guestBtn.style.display = "none";

    // Show Sign Up form
    signupForm.style.display = "block";


    // Change active tab
    loginTab.classList.remove("active");
    signupTab.classList.add("active");


    // Move the dark slider to Sign Up
    tabs.classList.add("signup-active");

});


// 3. LOGIN TAB

loginTab.addEventListener("click", function () {

    // Show Login form
    loginForm.style.display = "block";

    // Show Continue as Guest button
    guestBtn.style.display = "block";

    // Hide Sign Up form
    signupForm.style.display = "none";


    // Change active tab
    signupTab.classList.remove("active");
    loginTab.classList.add("active");


    // Move the dark slider back to Login
    tabs.classList.remove("signup-active");

});


// 4. SHOW / HIDE PASSWORD

// Get all password buttons
const eyeButtons = document.querySelectorAll(".eye-btn");

eyeButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        // Get the ID of the password field
        const targetId = button.getAttribute("data-target");

        // Find the password input
        const passwordInput = document.getElementById(targetId);


        // Show password
        if (passwordInput.type === "password") {

            passwordInput.type = "text";

        }

        // Hide password
        else {

            passwordInput.type = "password";

        }

    });

});


// ==========================================
// 5. SIGN UP VALIDATION
// ==========================================

const signupPassword =
    document.getElementById("signupPassword");

const confirmPassword =
    document.getElementById("confirmPassword");


signupForm.addEventListener("submit", function (event) {

    // Prevent page refresh
    event.preventDefault();


    // Check passwords
    if (signupPassword.value !== confirmPassword.value) {

        alert("Passwords do not match!");

        return;

    }


    // Passwords are correct
    alert("Account information is correct!");

});


// ==========================================
// 6. LOGIN FORM
// ==========================================

loginForm.addEventListener("submit", function (event) {

    // Prevent page refresh for now
    event.preventDefault();

    // Firebase will be added later

});
lucide.createIcons();