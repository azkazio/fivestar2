const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const userInp = document.getElementById('username');
const statusBadge = document.getElementById('status-net');

// 1. Toggle Animasi Slide
signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

// 2. Anti-Lost: Pulihkan data jika refresh
userInp.value = localStorage.getItem('saved_user') || '';
userInp.oninput = () => localStorage.setItem('saved_user', userInp.value);

// 3. Login & Session Storage
document.getElementById('do-login').onclick = () => {
    if(userInp.value.trim() !== "") {
        sessionStorage.setItem('is_logged_in', 'true');
        sessionStorage.setItem('session_user', userInp.value);
        window.location.href = '../dashboard/dashboard.html';
    }
};

// 4. Online/Offline UI (Menggunakan class yang kamu buat)
function updateStatus() {
    if (navigator.onLine) {
        statusBadge.textContent = "● Online";
        statusBadge.className = "badge online";
    } else {
        statusBadge.textContent = "● Offline Mode";
        statusBadge.className = "badge offline";
    }
}
window.ononline = window.onoffline = updateStatus;
updateStatus();
