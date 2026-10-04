import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";


const icon = document.querySelector(".profile, .profile-btn");

const menu = document.getElementById("profileMenu");

const name = document.getElementById("profileName");

const email = document.getElementById("profileEmail");

const logout = document.getElementById("logoutBtn");


let currentUser = null;



onAuthStateChanged(auth, (user)=>{

    currentUser = user;


    if(user){

        if(name)
            name.textContent = user.displayName || "JOUK User";

        if(email)
            email.textContent = user.email;


    }


});



if(icon){

icon.addEventListener("click",(e)=>{


   if(!currentUser){

    window.location.href = window.JOUK.url("sign up-log in/index.html");

    return;

}



    // User

    e.preventDefault();


    if(menu){

        menu.style.display =
        menu.style.display === "block"
        ? "none"
        : "block";

    }


});


}



if(logout){

logout.addEventListener("click",()=>{


    signOut(auth).then(()=>{

        location.reload();

    });


});

}