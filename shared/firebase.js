import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { 
    getAuth 
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyALPksJ95bZKLMKJ5V9BSM0HcZ9eLAycag",
  authDomain: "jouk-95077.firebaseapp.com",
  projectId: "jouk-95077",
  storageBucket: "jouk-95077.firebasestorage.app",
  messagingSenderId: "450283738120",
  appId: "1:450283738120:web:c987d051d4a25620242dbd"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);