// shared/popup.js
function initWelcomePopup() {
    const popup = document.getElementById('welcome-popup');
    const closeBtn = document.getElementById('close-popup');
    const userDisplay = document.getElementById('user-name-popup');

    // Ambil nama dari sesi
    const name = sessionStorage.getItem('session_user') || 'Admin';
    if(userDisplay) userDisplay.textContent = name;

    // Cek Sesi (Hanya muncul 1x per login)
    if (!sessionStorage.getItem('welcome_seen')) {
        popup.classList.remove('hidden');
    }

    // Tutup Popup
    closeBtn.onclick = () => {
        popup.classList.add('hidden');
        sessionStorage.setItem('welcome_seen', 'true');
    };
}

// Jalankan fungsi saat script dimuat
document.addEventListener('DOMContentLoaded', initWelcomePopup);
