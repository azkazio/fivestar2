const userInp = document.getElementById('username');
const statusDiv = document.getElementById('status-online');

// Load dari LocalStorage (Anti-Lost)
userInp.value = localStorage.getItem('temp_user') || '';

userInp.oninput = () => {
    localStorage.setItem('temp_user', userInp.value);
};

document.getElementById('btn-login').onclick = () => {
    if (userInp.value.trim() !== "") {
        sessionStorage.setItem('is_logged_in', 'true');
        sessionStorage.setItem('session_user', userInp.value);
        window.location.href = '../dashboard/dashboard.html';
    } else {
        alert("System Error: Username is required.");
    }
};

// Network Detection
function updateNet() {
    if (navigator.onLine) {
        statusDiv.textContent = "CONNECTED";
        statusDiv.style.color = "green";
    } else {
        statusDiv.textContent = "OFFLINE MODE";
        statusDiv.style.color = "red";
    }
}

window.ononline = window.onoffline = updateNet;
updateNet();
