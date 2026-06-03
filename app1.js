/**
 * Money Manager Pro v3.5 - Advanced Core Control System Engine
 */

// 1. Firebase Live Production Configurations
const firebaseConfig = {
  apiKey: "AIzaSyDIiBdSKMigymz8P4PooMSguP7LoLKvllg",
  authDomain: "hotel-c4382.firebaseapp.com",
  databaseURL: "https://hotel-c4382-default-rtdb.firebaseio.com",
  projectId: "hotel-c4382",
  storageBucket: "hotel-c4382.firebasestorage.app",
  messagingSenderId: "879811080075",
  appId: "1:879811080075:web:656ac50faffced4aee898e",
  measurementId: "G-EGS10RS2V4"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const rtdb = firebase.database();
const SYSTEM_NAMESPACE = "money_manager_v35";

// Shared Dynamic Memory State
let state = {
  uid: null,
  profile: {}
};

// 2. Global Route Authentication Matrix
auth.onAuthStateChanged(user => {
  const path = window.location.pathname;
  const isAuthPage = path.includes("index.html") || 
                     path.includes("newregistration.html") || 
                     path.includes("forgot.html") || 
                     path.endsWith("/");

  if (user) {
    state.uid = user.uid;
    if (isAuthPage) {
      window.location.href = "dashboard.html";
    } else {
      initializeApplicationDataStreams();
    }
  } else {
    state.uid = null;
    if (!isAuthPage) {
      window.location.href = "index.html";
    }
  }
});

// 3. Page Element Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  
  // Login Submitter Trigger Link
  document.getElementById("btn-login")?.addEventListener("click", () => {
    const email = document.getElementById("auth-email").value.trim();
    const pass = document.getElementById("auth-password").value;
    if (!email || !pass) return alert("Please specify your sign-in details.");
    
    auth.signInWithEmailAndPassword(email, pass)
      .catch(err => alert(`Authentication Failed: ${err.message}`));
  });

  // Account Registration Trigger Link
  document.getElementById("btn-register")?.addEventListener("click", () => {
    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const pass = document.getElementById("reg-password").value;

    if (!name || !email || !pass) return alert("Please fill in all layout parameters.");
    if (pass.length < 6) return alert("Password must contain at least 6 alphanumeric values.");

    auth.createUserWithEmailAndPassword(email, pass)
      .then(cred => {
        // Instant write sequence saves name to real-time sync structure immediately
        return rtdb.ref(`${SYSTEM_NAMESPACE}/users/${cred.user.uid}/profile`).set({
          name: name,
          email: email,
          createdTimestamp: firebase.database.ServerValue.TIMESTAMP
        });
      })
      .then(() => {
        window.location.href = "dashboard.html";
      })
      .catch(err => alert(`Registration Interruption: ${err.message}`));
  });

  // Password Recovery Reset Dispatcher Link
  document.getElementById("btn-reset-password")?.addEventListener("click", () => {
    const email = document.getElementById("forgot-email").value.trim();
    if (!email) return alert("Please insert your account email vector target.");
    
    auth.sendPasswordResetEmail(email)
      .then(() => alert("A secure password recovery token has been dispatched to your email."))
      .catch(err => alert(`Recovery Error: ${err.message}`));
  });
});

// 4. Synchronization Interface System Elements 
function initializeApplicationDataStreams() {
  rtdb.ref(`${SYSTEM_NAMESPACE}/users/${state.uid}/profile`).on("value", snapshot => {
    const profile = snapshot.val() || {};
    state.profile = profile;

    // Instantly maps user display tags across Dashboard elements
    const nameLabel = document.getElementById("user-display-name");
    if (nameLabel) {
      nameLabel.innerText = profile.name || "Premium Active Client";
    }
  });
}

function executeSignOutGateway() {
  auth.signOut().then(() => window.location.href = "index.html");
}