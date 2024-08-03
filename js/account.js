import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgonWKzerFz_YMUHBFIbGkGAr2de0OAQo",
  authDomain: "aniteams-83c62.firebaseapp.com",
  projectId: "aniteams-83c62",
  storageBucket: "aniteams-83c62.appspot.com",
  messagingSenderId: "571785825154",
  appId: "1:571785825154:web:d8f684c660c28eab121d9b",
  measurementId: "G-72YGQR0CPH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Get elements
const signUpForm = document.getElementById('signUpForm');
const signInForm = document.getElementById('signInForm');
const banner = document.getElementById('banner');
const showSignUpForm = document.getElementById('showSignUpForm');
const showSignInForm = document.getElementById('showSignInForm');
const profilePictureInput = document.getElementById('profilePicture');
const progressContainer = document.getElementById('progressContainer');
const uploadProgress = document.getElementById('uploadProgress');
const progressText = document.getElementById('progressText');

// Show banner message
function showBanner(message, color) {
    banner.textContent = message;
    banner.className = `banner ${color}`;
    banner.style.display = 'block';

    setTimeout(() => {
        banner.style.display = 'none';
    }, 5000);
}

// Save user session
function saveUserSession(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

// Load user session
function loadUserSession() {
    return JSON.parse(localStorage.getItem('user'));
}

// Clear user session
function clearUserSession() {
    localStorage.removeItem('user');
}

// Redirect to account page if user is logged in
function checkUserSession() {
    const user = loadUserSession();
    if (user) {
        window.location.href = 'account.html';
    }
}

// Handle form toggling
document.getElementById('showSignUpForm').addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    document.getElementById('signInForm').style.display = 'none';
    document.getElementById('signUpForm').style.display = 'block';
});

document.getElementById('showSignInForm').addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    document.getElementById('signUpForm').style.display = 'none';
    document.getElementById('signInForm').style.display = 'block';
});

// Handle file upload
async function handleFileUpload(file, userId) {
    const storageRef = ref(storage, 'profilePictures/' + userId + '.jpg');
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
        (snapshot) => {
            // Progress
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            uploadProgress.value = progress;
            progressText.textContent = `${Math.round(progress)}%`;
            progressContainer.style.display = 'block';
        },
        (error) => {
            showBanner(error.message, 'red');
        },
        async () => {
            // Complete
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            return downloadURL;
        }
    );
}

// Sign up event
signUpForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const profilePictureFile = profilePictureInput.files[0];

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        let profilePictureURL = '';

        if (profilePictureFile) {
            profilePictureURL = await handleFileUpload(profilePictureFile, user.uid);
        }

        await updateProfile(user, {
            displayName: username,
            photoURL: profilePictureURL
        });

        await setDoc(doc(db, 'users', user.uid), {
            name: name,
            username: username,
            profilePicture: profilePictureURL
        });

        showBanner('User registered successfully!', 'green');
        saveUserSession(user);
        window.location.href = 'account.html';
    } catch (error) {
        showBanner(error.message, 'red');
    }
});

// Sign in event
signInForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('signInEmail').value;
    const password = document.getElementById('signInPassword').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        showBanner('Signed in successfully!', 'green');
        saveUserSession(user);
        window.location.href = 'account.html';
    } catch (error) {
        showBanner(error.message, 'red');
    }
});

// Check user session on page load
document.addEventListener('DOMContentLoaded', checkUserSession);
