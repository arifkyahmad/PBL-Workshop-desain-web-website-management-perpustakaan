
document.addEventListener('DOMContentLoaded', function () {
    const absensiForm = document.getElementById('absensi-form');
    if (absensiForm) {
        const profileCardContainer = document.getElementById('adminProfileCardContainer');
        const profileNameElement = document.getElementById('adminProfileName');
        const headerContent = document.getElementById('headerContent');

        absensiForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            const nama = document.getElementById('nama').value;
            const nrp = document.getElementById('nrp').value;
            
            if (!nrp.trim()) {
                showToast("NRP wajib diisi untuk absensi!", "error");
                return;
            }

            localStorage.setItem(`absensi_${nrp}`, 'status-green');

            profileNameElement.textContent = nama;
            profileCardContainer.style.display = 'block';
            headerContent.classList.remove('col-lg-9', 'col-md-8');
            headerContent.classList.add('col-lg-6', 'col-md-8'); 
            absensiForm.reset();
        });
    }

    const visitorsCtx = document.getElementById('visitorsChart');
    if (visitorsCtx) {
        new Chart(visitorsCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
                datasets: [{
                    label: 'Pengunjung',
                    data: [200, 300, 400, 250], 
                    borderColor: '#001bc7', 
                    backgroundColor: 'rgba(0, 27, 199, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: { responsive: true, plugins: { legend: { display: false } } }
        });
    }

    const borrowsCtx = document.getElementById('borrowsChart');
    if (borrowsCtx) {
        new Chart(borrowsCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
                datasets: [{
                    label: 'Peminjaman',
                    data: [15, 32, 10, 25], 
                    borderColor: '#ffc107', 
                    backgroundColor: 'rgba(255, 193, 7, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: { responsive: true, plugins: { legend: { display: false } } }
        });
    }

    const sidebarToggle = document.getElementById('sidebarToggle');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => document.body.classList.add('sidebar-open'));
    }
    if (overlay) {
        overlay.addEventListener('click', () => document.body.classList.remove('sidebar-open'));
    }
    const memberList = document.getElementById('memberList');
    
    if (memberList) {
        
        const modalElement = document.getElementById('tambahAnggotaModal');
        const modal = new bootstrap.Modal(modalElement);
        const modalTitle = document.getElementById('tambahAnggotaModalLabel');
        const modalButton = document.getElementById('btnSimpanAnggota');
        const formTambahAnggota = document.getElementById('formTambahAnggota');
        
        const inputNama = document.getElementById('inputNama');
        const inputNRP = document.getElementById('inputNRP');
        const inputEmail = document.getElementById('inputEmail');
        const editTargetNRP = document.getElementById('editTargetNRP');
        formTambahAnggota.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nama = inputNama.value;
            const email = inputEmail.value;
            const nrp = inputNRP.value;
            const targetNRP = editTargetNRP.value;

            if (targetNRP) {
                const liToEdit = memberList.querySelector(`li[data-nrp="${targetNRP}"]`);
                if (liToEdit) {
                    liToEdit.dataset.nama = nama;
                    liToEdit.dataset.nrp = nrp;
                    liToEdit.dataset.email = email;
                    
                    liToEdit.querySelector('.member-name-toggle').innerHTML = `
                        ${nama} <i class='bx bx-chevron-down collapse-icon'></i>
                    `;
                    const collapse = liToEdit.querySelector('.collapse');
                    const newCollapseId = "memberBooks-" + nrp;
                    liToEdit.querySelector('.member-name-toggle').href = `#${newCollapseId}`;
                    collapse.id = newCollapseId;
                }
                showToast("Data anggota berhasil diperbarui.");

            } else {
                const statusAbsensi = localStorage.getItem(`absensi_${nrp}`);
                const status = statusAbsensi || 'status-gray'; 

                const newMemberHTML = createMemberHTML(nama, email, status, nrp);
                memberList.insertAdjacentHTML('afterbegin', newMemberHTML);
                showToast("Anggota baru berhasil ditambahkan.");
            }
            
            modal.hide();
        });
        modalElement.addEventListener('hidden.bs.modal', function () {
            modalTitle.textContent = "Tambah Anggota Baru";
            modalButton.textContent = "Simpan";
            editTargetNRP.value = ""; 
            inputNRP.readOnly = false;
            formTambahAnggota.reset();
        });
        memberList.addEventListener('click', function(e) {
            const button = e.target.closest('button.action-btn');
            if (!button) return; 

            const li = e.target.closest('li');
            const nama = li.dataset.nama;
            if (button.classList.contains('btn-delete')) {
                if (confirm(`Anda yakin ingin menghapus ${nama}?`)) {
                    li.remove();
                    showToast(`${nama} telah dihapus.`);
                }
            }
            if (button.classList.contains('btn-contact')) {
                showToast(`${nama} sudah dihubungi.`);
            }
            if (button.classList.contains('btn-edit')) {
                inputNama.value = li.dataset.nama;
                inputNRP.value = li.dataset.nrp;
                inputEmail.value = li.dataset.email;
                
                editTargetNRP.value = li.dataset.nrp; 
                inputNRP.readOnly = true; 
                
                modalTitle.textContent = `Edit Anggota: ${nama}`;
                modalButton.textContent = "Update";
                
                modal.show();
            }
        });
        const searchInput = document.getElementById('searchAnggotaInput');
        searchInput.addEventListener('keyup', function(e) {
            const query = e.target.value.toLowerCase();
            const items = memberList.getElementsByTagName('li');
            
            for (let item of items) {
                const memberName = item.dataset.nama.toLowerCase(); 
                if (memberName.includes(query)) {
                    item.style.display = ""; 
                } else {
                    item.style.display = "none";
                }
            }
        });
        
        document.getElementById('searchAnggotaForm').addEventListener('submit', (e) => e.preventDefault());
    }
    const bookTableBody = document.getElementById('bookTableBody');
    if (bookTableBody) {
        
        const modalElement = document.getElementById('tambahBukuModal');
        const modal = new bootstrap.Modal(modalElement);
        const formTambahBuku = document.getElementById('formTambahBuku');
        formTambahBuku.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const judul = document.getElementById('inputJudul').value;
            const penulis = document.getElementById('inputPenulis').value;
            const lokasi = document.getElementById('inputLokasi').value;
            const tersedia = document.getElementById('inputTotalTersedia').value;
            const terpinjam = document.getElementById('inputTotalTerpinjam').value;
            const total = parseInt(tersedia) + parseInt(terpinjam);
            
            const newRowHTML = createBukuRowHTML(judul, penulis, lokasi, total, tersedia, terpinjam);
            bookTableBody.insertAdjacentHTML('afterbegin', newRowHTML);
            
            formTambahBuku.reset();
            modal.hide();
            showToast("Buku baru berhasil ditambahkan.");
        });
        const searchBukuInput = document.getElementById('searchBukuInput');
        searchBukuInput.addEventListener('keyup', function(e) {
            const query = e.target.value.toLowerCase();
            const rows = bookTableBody.getElementsByTagName('tr');
            
            for (let row of rows) {
                const textContent = row.textContent.toLowerCase();
                if (textContent.includes(query)) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            }
        });
        document.getElementById('searchBukuForm').addEventListener('submit', (e) => e.preventDefault());
        bookTableBody.addEventListener('click', function(e) {
            const deleteButton = e.target.closest('.btn-delete-book');
            if (deleteButton) {
                const row = e.target.closest('tr');
                const judul = row.dataset.judul || row.querySelector('td:first-child strong').textContent;
                
                if (confirm(`Anda yakin ingin menghapus buku "${judul}"?`)) {
                    row.remove();
                    showToast(`Buku "${judul}" telah dihapus.`);
                }
            }
        });
    }
    const peminjamanTableBody = document.getElementById('peminjamanTableBody');
    if (peminjamanTableBody) {
        
        const modalElement = document.getElementById('tambahPeminjamanModal');
        const modal = new bootstrap.Modal(modalElement);

        const formTambahPeminjaman = document.getElementById('formTambahPeminjaman');
        formTambahPeminjaman.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nama = document.getElementById('inputNamaPeminjam').value;
            const buku = document.getElementById('inputBukuPinjam').value;
            const tglPinjamString = document.getElementById('inputTanggalPinjam').value; 
            
            const tglPinjam = new Date(tglPinjamString + "T00:00:00");
            const tenggat = new Date(tglPinjam);
            tenggat.setDate(tenggat.getDate() + 7);

            const formattedTglPinjam = formatDate(tglPinjam);
            const formattedTenggat = formatDate(tenggat);
            
            const dendaInfo = calculateDenda(formattedTenggat);
            
            const newRowHTML = createPeminjamanRowHTML(nama, buku, formattedTglPinjam, formattedTenggat, dendaInfo);
            
            peminjamanTableBody.insertAdjacentHTML('afterbegin', newRowHTML);
            
            formTambahPeminjaman.reset();
            modal.hide();
            showToast("Peminjaman baru berhasil ditambahkan.");
        });
        const searchPeminjamanInput = document.getElementById('searchPeminjamanInput');
        searchPeminjamanInput.addEventListener('keyup', function(e) {
            const query = e.target.value.toLowerCase();
            const rows = peminjamanTableBody.getElementsByTagName('tr');
            
            for (let row of rows) {
                const textContent = row.textContent.toLowerCase();
                if (textContent.includes(query)) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            }
        });
        document.getElementById('searchPeminjamanForm').addEventListener('submit', (e) => e.preventDefault());
        peminjamanTableBody.addEventListener('click', function(e) {
            const deleteButton = e.target.closest('.btn-delete-peminjaman');
            if (deleteButton) {
                const row = e.target.closest('tr');
                const nama = row.querySelector('td:first-child strong').textContent;
                const buku = row.querySelector('td:nth-child(2)').textContent;
                
                if (confirm(`Anda yakin ingin menghapus data pinjaman "${buku}" oleh ${nama}?`)) {
                    row.remove();
                    showToast(`Data pinjaman telah dihapus.`);
                }
            }
        });
        function updateDendaOnLoad() {
            const rows = peminjamanTableBody.getElementsByTagName('tr');
            for (let row of rows) {
                const tenggatCell = row.querySelector('td:nth-child(4)');
                const dendaCell = row.querySelector('td:nth-child(5)');
                const tenggatString = tenggatCell.textContent;
                
                const dendaInfo = calculateDenda(tenggatString);
                
                let dotClass = "status-gray";
                if (dendaInfo.status === "terlambat") dotClass = "status-red";
                
                dendaCell.innerHTML = `
                    <div class="d-flex align-items-center">
                        <span>Rp ${dendaInfo.denda.toLocaleString('id-ID')}</span>
                        <span class="status-dot ${dotClass} ms-2"></span>
                    </div>
                `;
            }
        }
        
        updateDendaOnLoad();
    }

});
function createMemberHTML(nama, email, status, nrp) {
    const uniqueId = "memberBooks-" + (nrp || Date.now());
    let statusClass = status || "status-gray";

    return `
    <li class="list-group-item flex-column align-items-stretch" data-nrp="${nrp}" data-nama="${nama}" data-email="${email}" data-status="${statusClass}">
        <div class="d-flex w-100 justify-content-between">
            <div class="member-info">
                <i class="bx bx-user-circle"></i>
                <a class="member-name-toggle" data-bs-toggle="collapse" href="#${uniqueId}">
                    ${nama} 
                    <i class="bx bx-chevron-down collapse-icon'></i>
                </a>
            </div>
            <div class="member-actions">
                <button class="action-btn btn-contact"><i class="bx bx-phone"></i></button>
                <button class="action-btn btn-edit"><i class="bx bx-edit"></i></button>
                <button class="action-btn text-danger btn-delete"><i class="bx bx-trash"></i></button>
                <span class="status-dot ${statusClass}"></span>
            </div>
        </div>
        <div class="collapse book-sub-list" id="${uniqueId}">
            <div class="book-item">
                <span>(Tidak ada buku yang sedang dipinjam)</span>
            </div>
        </div>
    </li>
    `;
}

function createBukuRowHTML(judul, penulis, lokasi, total, tersedia, terpinjam) {
    return `
    <tr data-judul="${judul}">
        <td><strong>${judul}</strong></td>
        <td>${penulis}</td>
        <td>${lokasi}</td>
        <td>${total} Buku</td>
        <td>
            <div class="status-tersedia">${tersedia} Tersedia</div>
            <div class="status-terpinjam">${terpinjam} Terpinjam</div>
        </td>
        <td class="table-actions">
            <button class="action-btn text-danger btn-delete-book" title="Hapus"><i class='bx bx-trash'></i></button>
        </td>
    </tr>
    `;
}

function createPeminjamanRowHTML(nama, buku, tglPinjam, tglTenggat, dendaInfo) {
    let dotClass = "status-gray";
    if (dendaInfo.status === "terlambat") dotClass = "status-red";
    
    return `
    <tr>
        <td><strong>${nama}</strong></td>
        <td>${buku}</td>
        <td>${tglPinjam}</td>
        <td>${tglTenggat}</td>
        <td>
            <div class="d-flex align-items-center">
                <span>Rp ${dendaInfo.denda.toLocaleString('id-ID')}</span>
                <span class="status-dot ${dotClass} ms-2"></span>
            </div>
        </td>
        <td class="table-actions">
            <button class="action-btn text-danger btn-delete-peminjaman" title="Hapus"><i class='bx bx-trash'></i></button>
        </td>
    </tr>
    `;
}

function calculateDenda(tenggatDateString) {
    try {
        const today = new Date(); 

        const [day, month, year] = tenggatDateString.split('/').map(Number);
        const tenggatDate = new Date(year, month - 1, day);
        
        today.setHours(0, 0, 0, 0);
        tenggatDate.setHours(0, 0, 0, 0);

        if (today <= tenggatDate) {
            return { denda: 0, status: 'aman' };
        }
        
        // Hitung selisih hari
        const diffTime = today.getTime() - tenggatDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const dendaAmount = diffDays * 1000;
        
        return { denda: dendaAmount, status: 'terlambat' };
        
    } catch (e) {
        console.error("Error mem-parsing tanggal:", tenggatDateString, e);
        return { denda: 0, status: 'error' };
    }
}
function formatDate(date) {
    const d = new Date(date);
    let day = '' + d.getDate();
    let month = '' + (d.getMonth() + 1);
    const year = d.getFullYear();

    if (day.length < 2) day = '0' + day;
    if (month.length < 2) month = '0' + month;

    return [day, month, year].join('/');
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    
    if (type === 'error') {
        toast.style.backgroundColor = '#dc3545';
    }

    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10); 

    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => {
            toast.remove();
        });
    }, 3000);
}