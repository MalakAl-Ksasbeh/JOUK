import { auth } from "../shared/firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

function afterLogin() {
    const requested = new URLSearchParams(window.location.search).get("returnTo");
    if (requested) {
        try {
            const target = new URL(requested, window.location.href);
            const root = new URL(window.JOUK.url(""));
            if (target.origin === root.origin && target.pathname.startsWith(root.pathname) && !target.pathname.includes("sign%20up-log%20in")) {
                window.location.assign(target.href);
                return;
            }
        } catch (_) { /* Use the home page for an invalid return address. */ }
    }
    window.location.href = window.JOUK.url("home page/index.html");
}


const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

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

        afterLogin();


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

        afterLogin();


    })



    .catch((error)=>{


        alert(error.message);


    });



});









window.JOUK_AUTH_READY = true;

