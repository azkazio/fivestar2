document.getElementById('user-target').textContent = sessionStorage.getItem('session_user');

document.getElementById('logout').onclick = () => {
    sessionStorage.clear(); // Hapus Session
    window.location.href = '../login/login.html';
};
