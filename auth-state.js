import { auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";


const profileLink = document.querySelector(".profile");


onAuthStateChanged(auth, (user)=>{


    if(user){

        profileLink.href = "profile.html";


    }else{

        profileLink.href = "login/login.html";

    }


});