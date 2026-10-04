import { auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";


const profileLink = document.querySelector(".profile");


onAuthStateChanged(auth, (user)=>{


    if(user){

        profileLink.href = window.JOUK.url("other pages/profile/index.html");


    }else{

        profileLink.href = window.JOUK.url("sign up-log in/index.html");

    }


});