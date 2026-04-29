// kalender-absen.js - FIVE STAR 2 (ULTRA FAST + SMART ID NAVIGATION + AUTO EDIT EMPTY DAY)

window.currentKalenderDate = window.currentKalenderDate || new Date();
window.cacheAbsenBulanIni = {}; 
window.bulanIndo = window.bulanIndo || ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

// 1. INJEKSI CSS
if (!document.getElementById('kalender-css')) {
    const style = document.createElement('style');
    style.id = 'kalender-css';
    style.innerHTML = `
        .tgl-item-global { 
            cursor: pointer; position: relative; transition: transform 0.2s ease, background-color 0.2s ease;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            height: 45px; border-radius: 12px; font-size: 14px; font-weight: 700; color: var(--text-color);
            border: 2px solid transparent;
        }
        .tgl-item-global:active { transform: scale(0.88); filter: brightness(0.8); }
        .tgl-item-global.minggu { color: #FF3B30 !important; }
        .tgl-item-global.today { 
            border: 2px solid #007AFF !important; 
            background-color: rgba(0, 122, 255, 0.1);
            box-shadow: inset 0 0 0 1px #007AFF;
        }
        /* CSS Untuk Tanggal Bulan Sebelumnya & Selanjutnya */
        .tgl-item-global.disabled-day {
            opacity: 0.3 !important;
            cursor: default;
            border: none !important;
            background: transparent !important;
            pointer-events: none;
        }
        .grid-kalender-container { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; padding: 0 13px 20px 13px; min-height: 310px; align-content: start; }
    `;
    document.head.appendChild(style);
}

// 2. MODAL UTAMA KALENDER (LEVEL 1)
window.bukaKalenderAbsen = function(event) {
    if(event) event.preventDefault();
    let modal = document.getElementById('kalenderAbsenModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'kalenderAbsenModal';
        modal.className = 'ios-overlay'; 
        modal.style.zIndex = '21000';
        modal.innerHTML = `
            <div id="kotakLengkungKalender" class="ios-modal-form profile-expand-anim" style="width: 360px; max-height: 85vh; display: flex; flex-direction: column; overflow: hidden; background: var(--card-bg); border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
                
                <div class="ios-modal-header" style="display: flex; flex-direction: column; align-items: center; padding: 15px 15px 10px 15px; flex-shrink: 0; border-bottom: none;">
                    <h2 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 800; color: var(--text-primary); letter-spacing: 1px;">ABSENSI</h2>
                    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                        <button onclick="window.ubahBulanAbsenHeader(-1)" style="background: transparent; border: none; color: #007AFF; font-size: 18px; cursor: pointer; padding: 5px 15px;"><i class="fa-solid fa-chevron-left"></i></button>
                        
                        <div onclick="bukaBulanTahunPickerAbsen()" style="cursor:pointer; display:flex; align-items:center; gap:8px; padding: 6px 12px; border-radius: 8px; background: rgba(142,142,147,0.1);">
                            <span id="txtDisplayBulanTahun" style="font-size:15px; font-weight: 700; color: var(--text-primary);">Memuat...</span>
                            <i class="fa-solid fa-caret-down" style="font-size:12px; color: var(--text-primary);"></i>
                        </div>
                        
                        <button onclick="window.ubahBulanAbsenHeader(1)" style="background: transparent; border: none; color: #007AFF; font-size: 18px; cursor: pointer; padding: 5px 15px;"><i class="fa-solid fa-chevron-right"></i></button>
                    </div>
                </div>

                <div class="ios-modal-body" style="padding: 10px; overflow-y: auto; flex-grow: 1;">
                    <div style="display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; padding-bottom: 8px; border-bottom: 0.5px solid rgba(142,142,147,0.2); margin-bottom: 10px; position: sticky; top: 0; background: var(--card-bg); z-index: 5;">
                        <div style="color:#FF3B30; font-size:13px; font-weight:800;">MIN</div>
                        <div style="opacity:0.5; font-size:13px; font-weight:800; color: var(--text-primary);">SEN</div>
                        <div style="opacity:0.5; font-size:13px; font-weight:800; color: var(--text-primary);">SEL</div>
                        <div style="opacity:0.5; font-size:13px; font-weight:800; color: var(--text-primary);">RAB</div>
                        <div style="opacity:0.5; font-size:13px; font-weight:800; color: var(--text-primary);">KAM</div>
                        <div style="opacity:0.5; font-size:13px; font-weight:800; color: var(--text-primary);">JUM</div>
                        <div style="opacity:0.5; font-size:13px; font-weight:800; color: var(--text-primary);">SAB</div>
                    </div>
                    <div id="gridBodyAbsen" class="grid-kalender-container"></div>
                </div>
                <div class="ios-modal-footer" style="border-top: 0.5px solid rgba(142,142,147,0.2); flex-shrink: 0; padding: 0;">
                    <button class="btn-batal" onclick="tutupKalenderAbsen()" style="width: 100%; border: none; font-weight: 700; color: #007AFF !important; padding: 16px; text-align: center; background: transparent; font-size: 17px; cursor: pointer;">Tutup</button>
                </div>
            </div>`;
        document.body.appendChild(modal);
    }
    window.renderKalenderAbsen();
    modal.style.display = 'flex';

    // NAVIGASI ANTI-BLANK DASHBOARD: ID-nya wajib agar dikenali Dashboard
    history.pushState({ id: 'modalKalenderAbsen' }, '', ''); 
    
    window.handleBackKalenderAbsen = function(e) {
        if (!e.state || e.state.id === 'dashboardRoot') {
            const m = document.getElementById('kalenderAbsenModal');
            if (m) m.style.display = 'none';
            window.removeEventListener('popstate', window.handleBackKalenderAbsen);
        }
    };
    window.removeEventListener('popstate', window.handleBackKalenderAbsen);
    window.addEventListener('popstate', window.handleBackKalenderAbsen);
};

window.ubahBulanAbsenHeader = function(offset) {
    window.currentKalenderDate.setMonth(window.currentKalenderDate.getMonth() + offset);
    window.renderKalenderAbsen();
};

window.tutupKalenderAbsen = function() { 
    if (history.state && history.state.id === 'modalKalenderAbsen') {
        history.back(); // Trigger popstate
    } else {
        const modal = document.getElementById('kalenderAbsenModal');
        if (modal) modal.style.display = 'none';
        window.removeEventListener('popstate', window.handleBackKalenderAbsen);
    }
};

// 3. LOGIKA RENDER
window.renderKalenderAbsen = async function() {
    const grid = document.getElementById('gridBodyAbsen');
    const display = document.getElementById('txtDisplayBulanTahun');
    if(!grid || !display) return;

    const bln = window.currentKalenderDate.getMonth();
    const thn = window.currentKalenderDate.getFullYear();
    const blnTahunId = window.bulanIndo[bln] + "_" + thn; 
    
    display.innerText = window.bulanIndo[bln] + " " + thn;
    grid.innerHTML = '<p style="grid-column: span 7; text-align:center; padding:20px; opacity:0.5; color: var(--text-primary);">Sinkronisasi...</p>';

    const userAuth = firebase.auth().currentUser;
    if (!userAuth) return;

    try {
        let listPromises = [];
        const daysInMonth = new Date(thn, bln + 1, 0).getDate();
        const daftarTglFull = [];
        const opsi = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };

        for (let d = 1; d <= daysInMonth; d++) {
            const tempDate = new Date(thn, bln, d);
            const tglFullStr = tempDate.toLocaleDateString('id-ID', opsi); 
            daftarTglFull.push(tglFullStr);
            const dateId = tglFullStr.replace(', ', '_').replace(/\s/g, '_'); 
            listPromises.push(window.firestore.collection('data').doc(userAuth.uid).collection('absen').doc(blnTahunId).collection(dateId).doc('harian').get());
        }

        const snapshots = await Promise.all(listPromises);
        window.cacheAbsenBulanIni = {};
        snapshots.forEach((doc, index) => { if (doc.exists) window.cacheAbsenBulanIni[daftarTglFull[index]] = doc.data(); });
        
        grid.innerHTML = '';
        const firstDay = new Date(thn, bln, 1).getDay(); // 0 = Minggu
        const todayStr = typeof getTanggalHariIni === 'function' ? getTanggalHariIni() : "";

        // 1. TANGGAL BULAN SEBELUMNYA
        const prevMonthDays = new Date(thn, bln, 0).getDate(); 
        for (let i = 0; i < firstDay; i++) { 
            const prevDayNum = prevMonthDays - (firstDay - 1) + i;
            grid.innerHTML += `<div class="tgl-item-global disabled-day" style="color: var(--text-primary);">${prevDayNum}</div>`; 
        }

        // 2. TANGGAL BULAN INI
        for (let d = 1; d <= daysInMonth; d++) {
            const tglFull = daftarTglFull[d-1];
            const dataDay = window.cacheAbsenBulanIni[tglFull] || null;
            const curDateObj = new Date(thn, bln, d);
            const isMinggu = curDateObj.getDay() === 0;
            const isToday = tglFull === todayStr;

            let classes = "tgl-item-global"; 
            if (isMinggu) classes += " minggu"; 
            if (isToday) classes += " today"; 

            let customStyle = "color: var(--text-primary);";
            let statusText = "";

            if (dataDay) {
                const s = dataDay.status;
                const colors = { 'Masuk': '#34C759', 'Off': '#8E8E93', 'Libur': '#8E8E93', 'Telat': '#FF9500' };
                customStyle = `background-color: ${colors[s] || '#FF3B30'};`;
                if (!isMinggu) customStyle += " color: white;";
                if (!isToday) customStyle += " border: none;";
                statusText = `<span style="font-size:7px; font-weight:800; text-transform:uppercase; margin-top:2px;">${s.substring(0,3)}</span>`;
            }
            grid.innerHTML += `<div class="${classes}" style="${customStyle}" onclick="window.klikTglAbsen('${tglFull}')">${d}${statusText}</div>`;
        }

        // 3. TANGGAL BULAN BERIKUTNYA
        const totalCellsSoFar = firstDay + daysInMonth;
        const remainingCells = (7 - (totalCellsSoFar % 7)) % 7;
        for (let i = 1; i <= remainingCells; i++) {
            grid.innerHTML += `<div class="tgl-item-global disabled-day" style="color: var(--text-primary);">${i}</div>`; 
        }

    } catch (e) {
        grid.innerHTML = '<p style="grid-column: span 7; text-align:center; padding:20px; color:#FF3B30;">Gagal memuat data.</p>';
    }
};

// 4. LOGIKA KLIK & RINCIAN 
window.klikTglAbsen = function(tglFull) {
    const existingData = window.cacheAbsenBulanIni[tglFull] || null;
    
    const temp = tglFull.split(', ');
    const tglMurni = temp[1];
    const parts = tglMurni.split(" ");
    const clickedDate = new Date(parseInt(parts[2]), window.bulanIndo.indexOf(parts[1]), parseInt(parts[0]));
    const hariIni = new Date();
    hariIni.setHours(0,0,0,0);
    
    if (existingData) {
        window.bukaRincianTglAbsen(tglFull, existingData);
    } else {
        if (clickedDate > hariIni) return IOSAlert.show("Dilarang", "Belum bisa absen untuk masa depan.");
        if (typeof window.bukaMenuAbsen === 'function') {
            window.bukaMenuAbsen(null, tglFull, null); 
        }
    }
};

window.bukaRincianTglAbsen = function(tgl, data) {
    let rincianModal = document.getElementById('rincianTglAbsenModal');
    if (!rincianModal) {
        rincianModal = document.createElement('div');
        rincianModal.id = 'rincianTglAbsenModal';
        rincianModal.className = 'ios-overlay';
        rincianModal.style.zIndex = '25000';
        document.body.appendChild(rincianModal);
    }

    let jamTampil = "N/A";
    if (data.waktu_input && typeof data.waktu_input.toDate === 'function') {
        jamTampil = data.waktu_input.toDate().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    }

    rincianModal.innerHTML = `
        <div class="ios-modal-form profile-expand-anim" style="width: 310px; background: var(--card-bg); border-radius: 16px;">
            <div class="ios-modal-header" style="border-bottom: none; padding-bottom: 0;">
                <h3 style="color: var(--text-primary);">Detail Absensi</h3>
                <p style="font-size: 13px; color: #8E8E93; margin: 5px 0 0 0;">${tgl}</p>
            </div>
            
            <div class="ios-modal-body" style="padding: 10px 15px 15px 15px;">
                <div style="background: rgba(142,142,147,0.05); border-radius: 12px; overflow: hidden; border: 1px solid rgba(142,142,147,0.12);">
                    <div style="display: flex; align-items: center; padding: 14px 15px; border-bottom: 0.5px solid rgba(142,142,147,0.2); gap: 15px;">
                        <div style="width: 32px; height: 32px; border-radius: 8px; background: #007AFF; display: flex; justify-content: center; align-items: center;"><i class="fa-solid fa-building" style="color: white; font-size: 14px;"></i></div>
                        <div style="display: flex; flex-direction: column;"><span style="font-size: 11px; color: #8E8E93; font-weight: 700;">LOKASI KANTOR</span><span style="font-size: 15px; font-weight: 600; color: var(--text-primary);">${data.kantor}</span></div>
                    </div>
                    <div style="display: flex; align-items: center; padding: 14px 15px; border-bottom: 0.5px solid rgba(142,142,147,0.2); gap: 15px;">
                        <div style="width: 32px; height: 32px; border-radius: 8px; background: #34C759; display: flex; justify-content: center; align-items: center;"><i class="fa-solid fa-check-circle" style="color: white; font-size: 14px;"></i></div>
                        <div style="display: flex; flex-direction: column;"><span style="font-size: 11px; color: #8E8E93; font-weight: 700;">STATUS</span><span style="font-size: 15px; font-weight: 600; color: var(--text-primary);">${data.status}</span></div>
                    </div>
                    <div style="display: flex; align-items: center; padding: 14px 15px; gap: 15px;">
                        <div style="width: 32px; height: 32px; border-radius: 8px; background: #FF9500; display: flex; justify-content: center; align-items: center;"><i class="fa-solid fa-clock" style="color: white; font-size: 14px;"></i></div>
                        <div style="display: flex; flex-direction: column;"><span style="font-size: 11px; color: #8E8E93; font-weight: 700;">WAKTU INPUT</span><span style="font-size: 15px; font-weight: 600; color: var(--text-primary);">${jamTampil}</span></div>
                    </div>
                </div>
                
                <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 15px; padding: 0 5px;">
                    <button class="btn-icon-edit" onclick="window.editAbsenTgl(event, '${tgl}')" style="background-color: rgba(0, 122, 255, 0.1); color: #007AFF;"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn-icon-edit" onclick="window.hapusAbsenTgl(event, '${tgl}')" style="background-color: rgba(255, 59, 48, 0.1); color: #FF3B30;"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
            
            <div style="display: flex; border-top: 0.5px solid rgba(142,142,147,0.2);">
                <button onclick="tutupRincianAbsen()" style="width: 100%; border: none; font-weight: 700; color: #007AFF !important; padding: 16px; background: transparent; font-size: 17px; cursor: pointer;">Tutup</button>
            </div>
        </div>`;
    rincianModal.style.display = 'flex';

    history.pushState({ id: 'rincianAbsen' }, '', '');

    window.handleBackRincianAbsen = function(e) {
        if (!e.state || e.state.id === 'modalKalenderAbsen') {
            const m = document.getElementById('rincianTglAbsenModal');
            if (m) m.style.display = 'none';
            window.removeEventListener('popstate', window.handleBackRincianAbsen);
        }
    };
    window.addEventListener('popstate', window.handleBackRincianAbsen);
};

// Menerima event untuk stopPropagation dan TIDAK MENUTUP rincian
window.editAbsenTgl = function(event, tgl) {
    if(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const data = window.cacheAbsenBulanIni[tgl];
    if (!data) return;
    
    // Buka form absen di atas rincian (stacked mode), rincian biarkan tetap terbuka
    if (typeof window.bukaMenuAbsen === 'function') {
        window.bukaMenuAbsen(null, tgl, data);
    }
};

window.hapusAbsenTgl = function(event, tgl) {
    if(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    // Munculkan IOSAlert menumpuk di atas rincian tanpa menutup rincian terlebih dahulu
    IOSAlert.show("Hapus Absen", "Yakin ingin menghapus absen tanggal ini?", {
        teksBatal: "Batal",
        teksTombol: "Hapus",
        onConfirm: async () => {
            const userAuth = firebase.auth().currentUser;
            if (!userAuth) return;

            const temp = tgl.split(', ');
            const tglMurni = temp[1];
            const parts = tglMurni.split(" ");
            
            const blnTahunId = parts[1] + "_" + parts[2];
            const dateId = tgl.replace(', ', '_').replace(/\s/g, '_');

            try {
                await window.firestore
                    .collection('data').doc(userAuth.uid)
                    .collection('absen').doc(blnTahunId)
                    .collection(dateId).doc('harian').delete();
                
                // Setelah berhasil dihapus, tutup rincian dan segarkan kalender
                window.tutupRincianAbsen();
                window.renderKalenderAbsen();
                
                // Tambahkan jeda untuk memunculkan pesan sukses (agar tidak bentrok animasi popstate alert pertama)
                setTimeout(() => {
                    IOSAlert.show("Berhasil", "Absen berhasil dihapus.");
                }, 300);

            } catch (e) {
                IOSAlert.show("Gagal", "Error: " + e.message);
            }
        }
    });
};

window.tutupRincianAbsen = function() {
    if (history.state && history.state.id === 'rincianAbsen') {
        history.back();
    } else {
        const m = document.getElementById('rincianTglAbsenModal');
        if (m) m.style.display = 'none';
        window.removeEventListener('popstate', window.handleBackRincianAbsen);
    }
};

// 5. NAVIGASI PICKER BULAN TAHUN
window.bukaBulanTahunPickerAbsen = function() {
    let picker = document.getElementById('pickerMYAbsen');
    if (!picker) { 
        picker = document.createElement('div'); 
        picker.id = 'pickerMYAbsen'; 
        picker.className = 'ios-overlay'; 
        picker.style.zIndex = '22000'; 
        document.body.appendChild(picker); 
    }
    window.renderPickerMYInner(true); 
    picker.style.display = 'flex';

    history.pushState({ id: 'pickerBulanAbsen' }, '', '');

    window.handleBackPickerBulanAbsen = function(e) {
        if (!e.state || e.state.id === 'modalKalenderAbsen') {
            const p = document.getElementById('pickerMYAbsen');
            if (p) p.style.display = 'none';
            window.removeEventListener('popstate', window.handleBackPickerBulanAbsen);
        }
    };
    window.addEventListener('popstate', window.handleBackPickerBulanAbsen);
};

window.renderPickerMYInner = function(withAnim = false) {
    const thn = window.currentKalenderDate.getFullYear();
    const animStyle = withAnim ? '' : 'animation: none !important; transition: none !important;';
    const picker = document.getElementById('pickerMYAbsen');
    
    picker.innerHTML = `
        <div class="ios-modal-form profile-expand-anim" style="width: 320px; height: 380px; padding: 20px; box-sizing: border-box; display: flex; flex-direction: column; ${animStyle}; background: var(--card-bg); border-radius: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-shrink: 0;">
                <button class="btn-icon-edit" onclick="window.ubahThnAbsen(-1)"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 onclick="window.bukaYearPickerAbsen()" style="margin:0; cursor:pointer; color: var(--text-primary); font-size: 18px;">${thn} <i class="fa-solid fa-caret-down" style="font-size:12px;"></i></h2>
                <button class="btn-icon-edit" onclick="window.ubahThnAbsen(1)"><i class="fa-solid fa-chevron-right"></i></button>
            </div>
            <div class="grid-picker" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; flex-grow: 1; align-content: center;">
                ${window.bulanIndo.map((b, i) => `<div class="grid-item ${window.currentKalenderDate.getMonth() === i ? 'active' : ''}" onclick="window.setBlnAbsen(${i})" style="padding: 12px 0; text-align: center; border-radius: 8px;">${b.substring(0,3)}</div>`).join('')}
            </div>
            <div style="text-align: center; margin-top: auto; flex-shrink: 0; padding-top: 15px;">
                <button class="btn-text-batal" onclick="window.tutupPickerBulanAbsen()" style="width: 100%; border: none; background: transparent; color: #FF3B30; font-weight: 700; padding: 10px; font-size: 16px;">BATAL</button>
            </div>
        </div>`;
};

window.tutupPickerBulanAbsen = function() {
    if (history.state && history.state.id === 'pickerBulanAbsen') {
        history.back();
    } else {
        const p = document.getElementById('pickerMYAbsen');
        if (p) p.style.display = 'none';
        window.removeEventListener('popstate', window.handleBackPickerBulanAbsen);
    }
};

window.setBlnAbsen = function(i) { 
    window.currentKalenderDate.setMonth(i); 
    window.tutupPickerBulanAbsen();
    window.renderKalenderAbsen(); 
};

window.ubahThnAbsen = function(v, isYearOnly = false) { 
    window.currentKalenderDate.setFullYear(window.currentKalenderDate.getFullYear() + v); 
    if(isYearOnly) window.renderYearPickerInner(false); 
    else window.renderPickerMYInner(false); 
};

window.bukaYearPickerAbsen = function() {
    let yrPicker = document.getElementById('pickerYearOnlyAbsen');
    if (!yrPicker) { 
        yrPicker = document.createElement('div'); 
        yrPicker.id = 'pickerYearOnlyAbsen'; 
        yrPicker.className = 'ios-overlay'; 
        yrPicker.style.zIndex = '23000'; 
        document.body.appendChild(yrPicker); 
    }
    window.renderYearPickerInner(true); 
    yrPicker.style.display = 'flex';

    history.pushState({ id: 'pickerTahunAbsen' }, '', '');

    window.handleBackPickerTahunAbsen = function(e) {
        if (!e.state || e.state.id === 'pickerBulanAbsen') {
            const y = document.getElementById('pickerYearOnlyAbsen');
            if (y) y.style.display = 'none';
            window.removeEventListener('popstate', window.handleBackPickerTahunAbsen);
        }
    };
    window.addEventListener('popstate', window.handleBackPickerTahunAbsen);
};

window.renderYearPickerInner = function(withAnim = false) {
    const startY = window.currentKalenderDate.getFullYear() - 4;
    const endY = startY + 11;
    let yearHtml = '';
    const animStyle = withAnim ? '' : 'animation: none !important; transition: none !important;';
    
    for (let y = startY; y <= endY; y++) { 
        yearHtml += `<div class="grid-item ${y === window.currentKalenderDate.getFullYear() ? 'active' : ''}" onclick="window.setThnAbsen(${y})" style="padding: 12px 0; text-align: center; border-radius: 8px;">${y}</div>`; 
    }
    
    document.getElementById('pickerYearOnlyAbsen').innerHTML = `
        <div class="ios-modal-form profile-expand-anim" style="width: 320px; height: 380px; padding: 20px; box-sizing: border-box; display: flex; flex-direction: column; ${animStyle}; background: var(--card-bg); border-radius: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-shrink: 0;">
                <button class="btn-icon-edit" onclick="window.ubahThnAbsen(-12, true)"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 style="margin:0; font-size: 18px; color: var(--text-primary);">${startY} - ${endY}</h2>
                <button class="btn-icon-edit" onclick="window.ubahThnAbsen(12, true)"><i class="fa-solid fa-chevron-right"></i></button>
            </div>
            <div class="grid-picker" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; flex-grow: 1; align-content: center;">
                ${yearHtml}
            </div>
            <div style="text-align: center; margin-top: auto; flex-shrink: 0; padding-top: 15px;">
                <button class="btn-text-batal" onclick="window.tutupPickerTahunAbsen()" style="width: 100%; border: none; background: transparent; color: #FF3B30; font-weight: 700; padding: 10px; font-size: 16px;">BATAL</button>
            </div>
        </div>`;
};

window.tutupPickerTahunAbsen = function() {
    if (history.state && history.state.id === 'pickerTahunAbsen') {
        history.back();
    } else {
        const y = document.getElementById('pickerYearOnlyAbsen');
        if (y) y.style.display = 'none';
        window.removeEventListener('popstate', window.handleBackPickerTahunAbsen);
    }
};

window.setThnAbsen = function(y) { 
    window.currentKalenderDate.setFullYear(y); 
    window.tutupPickerTahunAbsen();
    window.renderPickerMYInner(false); 
};
