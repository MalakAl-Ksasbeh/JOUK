import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
}
from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";



const icon = document.querySelector(".profile-btn");

const menu = document.getElementById("profileMenu");

const name = document.getElementById("profileName");

const email = document.getElementById("profileEmail");

const logout = document.getElementById("logoutBtn");



onAuthStateChanged(auth,(user)=>{


    if(user){

        name.textContent = user.displayName || "JOUK User";

        email.textContent = user.email;


    }else{


        name.textContent = "Guest";

        email.textContent = "Login to see profile";


        logout.style.display="none";

    }


});



icon.addEventListener("click",(e)=>{

    e.preventDefault();

    menu.style.display =
    menu.style.display === "block"
    ? "none"
    : "block";


});



logout.addEventListener("click",()=>{


    signOut(auth).then(()=>{

        location.reload();

    });


});