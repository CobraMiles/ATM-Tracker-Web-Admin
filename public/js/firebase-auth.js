// import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
// import { auth } from "./firebase-config.js";

// import { auth } from "/atm-tracker-web/public/js/firebase-config.js";
//     import { signInWithEmailAndPassword, onAuthStateChanged } 
//       from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

//     const errorEl = document.getElementById("login-error");

//     // Redirect if already logged in
//     onAuthStateChanged(auth, user => {
//       if (user) {
//         window.location.href = "/atm-tracker-web/index.php";
//       }
//     });

//     document.getElementById("login-btn").addEventListener("click", () => {
//       const email = document.getElementById("login-email").value;
//       const password = document.getElementById("login-password").value;

//       signInWithEmailAndPassword(auth, email, password)
//         .then(() => {
//           window.location.href = "/atm-tracker-web/index.php";
//         })
//         .catch(err => {
//           errorEl.textContent = err.message;
//         });
//     });