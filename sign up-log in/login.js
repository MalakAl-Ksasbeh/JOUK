import { auth } from "../shared/firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";


// Elements

const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");

const tabs = document.getElementById("tabs");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const guestBtn = document.getElementById("guestBtn");
const loginPage = document.querySelector(".login-page");
const loginStorySubtitle = document.getElementById("loginStorySubtitle");
const signupStoryCopy = document.getElementById("signupStoryCopy");




// ================= SIGN UP TAB =================

signupTab.addEventListener("click", function () {

    loginForm.style.display = "none";
    guestBtn.style.display = "none";

    signupForm.style.display = "block";

    loginTab.classList.remove("active");
    signupTab.classList.add("active");

    tabs.classList.add("signup-active");
    loginPage.classList.add("signup-mode");
    loginStorySubtitle.hidden = true;
    signupStoryCopy.hidden = false;

});





// ================= LOGIN TAB =================

loginTab.addEventListener("click", function () {

    loginForm.style.display = "block";
    guestBtn.style.display = "block";

    signupForm.style.display = "none";

    signupTab.classList.remove("active");
    loginTab.classList.add("active");

    tabs.classList.remove("signup-active");
    loginPage.classList.remove("signup-mode");
    loginStorySubtitle.hidden = false;
    signupStoryCopy.hidden = true;

});





// ================= SHOW PASSWORD =================


const eyeButtons = document.querySelectorAll(".eye-btn");


eyeButtons.forEach(button => {


    button.addEventListener("click", function () {


        const targetId = button.getAttribute("data-target");

        const passwordInput = document.getElementById(targetId);



        if(passwordInput.type === "password"){

            passwordInput.type = "text";

        }

        else{

            passwordInput.type = "password";

        }


    });


});







// ================= SIGN UP FIREBASE =================


// ================= SIGN UP FIREBASE =================


signupForm.addEventListener("submit", function(event){

    event.preventDefault();


    const name = document.getElementById("fullName").value;

    const email = document.getElementById("signupEmail").value;

    const password = document.getElementById("signupPassword").value;

    const confirm = document.getElementById("confirmPassword").value;



    if(password !== confirm){

        alert("Passwords do not match!");

        return;

    }



    createUserWithEmailAndPassword(auth, email, password)

    .then((userCredential)=>{


        const user = userCredential.user;


        return updateProfile(user, {

            displayName: name

        });


    })


    .then(()=>{


        alert("Account created successfully!");

        window.location.href = window.JOUK.url("home page/index.html");


    })


    .catch((error)=>{

        alert(error.message);

    });


});







// ================= LOGIN FIREBASE =================



loginForm.addEventListener("submit", function(event){


    event.preventDefault();



    const email = document.getElementById("loginEmail").value;

    const password = document.getElementById("loginPassword").value;




    signInWithEmailAndPassword(auth, email, password)



    .then(()=>{


        alert("Login successful!");

        window.location.href = window.JOUK.url("home page/index.html");


    })



    .catch((error)=>{


        alert(error.message);


    });



});








// ================= GUEST =================



guestBtn.addEventListener("click", function(){


    window.location.href = window.JOUK.url("home page/index.html");


});







// ================= ICONS =================


if(window.lucide){

    lucide.createIcons();

}
