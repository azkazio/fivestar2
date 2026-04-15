const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const userInp = document.getElementById('username');

// Slide Toggle
signUpButton.onclick = () => container.classList.add("right-panel-active");
signInButton.onclick = () => container.classList.remove("right-panel-active");

// Anti-Lost Data
userInp.value = localStorage.getItem('saved_user') || '';
userInp.oninput = () => localStorage.setItem('saved_user', userInp.value);

// Action Login
document.getElementById('do-login').onclick = () => {
    if(userInp.value.trim() !== "") {
        sessionStorage.setItem('is_logged_in', 'true');
        sessionStorage.setItem('session_user', userInp.value);
        window.location.href = '../dashboard/dashboard.html';
    } else {
        alert("Mohon isi username");
    }
};

// Network Status
window.addEventListener('online', () => {
    const b = document.getElementById('status-net');
    b.textContent = "● Online";
    b.className = "badge online";
});
window.addEventListener('offline', () => {
    const b = document.getElementById('status-net');
    b.textContent = "● Offline Mode";
    b.className = "badge offline";
});
