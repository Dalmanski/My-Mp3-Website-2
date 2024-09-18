
let isLoginVisible = true;

// Toggle between Sign Up and Login forms
function toggleForm() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const formTitle = document.getElementById('form-title');
    const toggleLink = document.getElementById('toggle-link');
    if (isLoginVisible) {
        // Switch to sign-up form
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        formTitle.textContent = 'Sign Up';
        toggleLink.innerHTML = `Already have an account? <a href="#" onclick="toggleForm()">Log In</a>`;
    } else {
        // Switch to login form
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
        formTitle.textContent = 'Log In';
        toggleLink.innerHTML = `Don't have an account? <a href="#" onclick="toggleForm()">Sign Up</a>`;
    }
    isLoginVisible = !isLoginVisible;
}

function handleSignUp(event) {
    event.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const emailExists = users.some(user => user.email === email);
    if (emailExists) {
        alert('This email is already registered.');
        return;
    }
    const newUser = { email: email, password: password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    fetch('http://localhost:5000/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert('Signed up successfully!');
            document.getElementById('signup-form').reset();
        } else {
            alert('Signed up successfully, but failed to send confirmation email.');
        }
    })
    .catch(error => {
        alert('Signed up successfully, but failed to send confirmation email.');
        console.error('Error:', error);
    });
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
        alert('Logged in successfully!');
        document.getElementById('login-form').reset(); 
        window.location.href = 'main.html';
    } else {
        alert('Invalid email or password.');
    }
}

let developerModeEnabled = false;

function toggleDeveloperMode() {
    const devSection = document.getElementById('developer-mode-section');
    const toggleBtn = document.getElementById('dev-mode-toggle-btn');
    developerModeEnabled = !developerModeEnabled;
    if (developerModeEnabled) {
        devSection.style.display = 'block';
        toggleBtn.style.opacity = 1; 
        showLocalStorageData(); 
    } else {
        devSection.style.display = 'none';
    }
}

function showLocalStorageData() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const emails = users.map(user => user.email).join('<br>'); 
    const emailList = document.getElementById('email-list');
    emailList.innerHTML = emails ? 'Stored emails:<br>' + emails : 'No stored emails found.';
}

function clearLocalStorageData() {
    if (confirm('Are you sure you want to clear all user data?')) {
        localStorage.removeItem('users');
        alert('All user data cleared.');
        showLocalStorageData();
    }
}