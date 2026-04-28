// js/core/app.js - Pusat Kontrol FIVE STAR 2 (Fix Splash Screen)
// Dikembangkan oleh: RONNY (2026)

document.addEventListener('DOMContentLoaded', () => {
    const isLoginPage = window.location.pathname.includes('index.html') || window.location.pathname === '/';
    
    // --- FUNGSI PENGHANCUR LOADING BAWAAN HTML ---
    function hapusLoadingLayar() {
        // Tepat menembak ID splashScreen sesuai file index.html
        const loadingEl = document.getElementById('splashScreen');
        if (loadingEl) {
            loadingEl.style.transition = "opacity 0.3s ease";
            loadingEl.style.opacity = "0";
            setTimeout(() => { loadingEl.style.display = 'none'; }, 300);
        }
    }

    // --- 1. SECURITY GUARD & SESSION ---
    const firebaseTimeout = setTimeout(() => {
        hapusLoadingLayar();
        if (isLoginPage) {
            if (typeof inisialisasiLogin === 'function') inisialisasiLogin();
        } else {
            console.error("Firebase tidak merespon. Cek koneksi internet.");
        }
    }, 5000);

    firebase.auth().onAuthStateChanged(async (user) => {
        clearTimeout(firebaseTimeout); 
        
        if (user) {
            console.log("Sesi Aktif: " + user.email);
            localStorage.setItem('isLoggedIn', 'true');

            if (isLoginPage) {
                window.location.href = 'dashboard.html';
            } else {
                hapusLoadingLayar(); 
                if (typeof refreshDataProfilUI === 'function') refreshDataProfilUI();
                await jalankanPolisiAbsen(user);
            }
        } else {
            console.log("Tidak ada sesi aktif.");
            localStorage.setItem('isLoggedIn', 'false');
            
            if (!isLoginPage) {
                window.location.href = "index.html"; 
            } else {
                hapusLoadingLayar(); // Hancurkan loading sebelum buka form!
                
                if (typeof inisialisasiLogin === 'function') {
                    inisialisasiLogin(); 
                } else if (typeof bukaOpsiSesi === 'function') {
                    bukaOpsiSesi();
                } else {
                    console.log("Menunggu login.js siap...");
                    let percobaan = 0;
                    const tungguLogin = setInterval(() => {
                        percobaan++;
                        if (typeof inisialisasiLogin === 'function') {
                            clearInterval(tungguLogin);
                            inisialisasiLogin();
                        } else if (percobaan > 50) {
                            clearInterval(tungguLogin);
                            console.error("FATAL: login.js tidak ditemukan di index.html!");
                        }
                    }, 100);
                }
            }
        }
    });

    // --- 2. REGISTER SERVICE WORKER (PWA) ---
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').then(reg => {
            reg.addEventListener('updatefound', () => {
                const newWorker = reg.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        tampilkanNotifUpdate(reg);
                    }
                });
            });
        }).catch(err => console.log('PWA Error:', err));

        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                window.location.reload();
                refreshing = true;
            }
        });
    }
});

// --- 3. PATROLI POLISI ABSEN ---
window.antrianAbsenBolong = [];
async function jalankanPolisiAbsen(user) {
    const tglDaftar = new Date(user.metadata.creationTime);
    tglDaftar.setHours(0, 0, 0, 0);

    const listPromises = [];
    const daftarTglLengkap = [];
    const opsi = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const waktuSekarang = new Date();

    for (let i = 7; i >= 0; i--) {
        let d = new Date();
        d.setDate(d.getDate() - i);
        d.setHours(0, 0, 0, 0);

        if (d < tglDaftar) continue;

        if (i === 0) { 
            const jam = waktuSekarang.getHours();
            const menit = waktuSekarang.getMinutes();
            if (jam < 9 || (jam === 9 && menit < 30)) continue; 
        }

        const tglFullStr = d.toLocaleDateString('id-ID', opsi); 
        const temp = tglFullStr.split(', ');
        const parts = temp[1].split(" ");
        const blnTahunId = parts[1] + "_" + parts[2]; 
        const dateId = tglFullStr.replace(', ', '_').replace(/\s/g, '_'); 

        daftarTglLengkap.push(tglFullStr);
        listPromises.push(window.firestore.collection('data').doc(user.uid).collection('absen').doc(blnTahunId).collection(dateId).doc('harian').get());
    }

    if (listPromises.length === 0) return;

    try {
        const snapshots = await Promise.all(listPromises);
        window.antrianAbsenBolong = [];
        snapshots.forEach((doc, index) => {
            if (!doc.exists) window.antrianAbsenBolong.push(daftarTglLengkap[index]);
        });

        if (window.antrianAbsenBolong.length > 0) panggilModalAntrean();
    } catch (e) { console.error("Polisi Gagal Patroli:", e); }
}

function panggilModalAntrean() {
    if (window.antrianAbsenBolong.length > 0 && typeof window.bukaMenuAbsen === 'function') {
        window.bukaMenuAbsen(null, window.antrianAbsenBolong[0], null, true); 
    }
}

window.aturNantiSemua = function() {
    window.antrianAbsenBolong = []; 
    const modal = document.getElementById('absenModal'); 
    if (modal) modal.style.display = 'none'; 
    if (typeof IOSAlert !== 'undefined') {
        IOSAlert.show("Peringatan", "Absenmu masih ada yang bolong. Jangan lupa dilengkapi nanti ya!");
    }
};

// --- 4. NOTIFIKASI UPDATE ---
function tampilkanNotifUpdate(reg) {
    if (typeof IOSAlert !== 'undefined') {
        IOSAlert.show("Update Tersedia", "Versi terbaru FIVE STAR 2 siap digunakan.", {
            teksTombol: "Segarkan",
            onConfirm: () => {
                if (reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
        });
    }
}

function tampilkanNotifNative() {
    const sudahAbsenHariIni = typeof cekStatusAbsenLokal === 'function' ? cekStatusAbsenLokal() : false; 
    if (sudahAbsenHariIni) return;

    const namaPemilik = localStorage.getItem('nama_user') || 'Rekan Five Star';

    if (Notification.permission === "granted") {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification("FIVE STAR 2 - REMINDER", {
                body: `Halo ${namaPemilik}, sudah jam 09:30 nih. Yuk absen dulu agar data tetap sinkron!`,
                icon: "assets/icon-192.png",
                badge: "assets/icon-192.png",
                vibrate: [200, 100, 200, 100, 200],
                tag: "absen-harian",
                requireInteraction: true 
            });
        });
    }
}
