const userField = document.getElementById('username');
const statusBadge = document.getElementById('status-badge');
const loginBtn = document.getElementById('login-btn');
const sessionInfo = document.getElementById('session-info');

// --- 1. ANTI-LOST DATA (LocalStorage) ---
// Ambil data saat halaman dimuat
window.onload = () => {
    const savedName = localStorage.getItem('persistent_username');
    if (savedName) {
        userField.value = savedName;
    }
    
    // Cek Session Storage
    const isAuth = sessionStorage.getItem('is_logged_in');
    if (isAuth) {
        sessionInfo.textContent = "Sesi Aktif: " + sessionStorage.getItem('session_user');
    }

    updateStatus();
};

// Simpan data setiap ketikan (Real-time prevention)
userField.addEventListener('input', () => {
    localStorage.setItem('persistent_username', userField.value);
});

// --- 2. SESSION STORAGE & LOGIN ---
loginBtn.addEventListener('click', () => {
    const val = userField.value;
    if(val) {
        sessionStorage.setItem('is_logged_in', 'true');
        sessionStorage.setItem('session_user', val);
        sessionInfo.textContent = "Sesi Aktif: " + val;
        alert("Berhasil Masuk! Sesi disimpan sementara.");
    }
});

// --- 3. OFFLINE MODE DETECTION ---
function updateStatus() {
    if (navigator.onLine) {
        statusBadge.textContent = "● Online";
        statusBadge.className = "badge online";
    } else {
        statusBadge.textContent = "● Offline (Mode Hemat)";
        statusBadge.className = "badge offline";
    }
}

window.addEventListener('online', updateStatus);
window.addEventListener('offline', updateStatus);
