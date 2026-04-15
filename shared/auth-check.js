// shared/auth-check.js
(function() {
    const isLoggedIn = sessionStorage.getItem('is_logged_in');
    
    if (isLoggedIn !== 'true') {
        // Mengarahkan ke halaman login jika tidak ada sesi
        // Kita gunakan path relatif yang keluar satu tingkat ke folder modules, lalu masuk ke login
        window.location.replace('../login/login.html');
    }
})();
