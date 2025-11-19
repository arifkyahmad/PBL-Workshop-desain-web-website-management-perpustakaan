$(document).ready(function() {
    console.log('Profile page loaded');
    initializeProfileData();
    setupProfileEvents();
});

function initializeProfileData() {
    const profileData = {
        name: 'User EEPIS',
        email: 'user@eepis.ac.id',
        nim: '202351001',
        prodi: 'Teknik Informatika',
        angkatan: '2023',
        phone: '081234567890',
        stats: {
            totalRead: 12,
            currentBorrow: 3,
            totalBorrow: 24,
            favoriteGenre: 5
        }
    };
    updateProfileUI(profileData);
}

function updateProfileUI(data) {
    $('#profileName').text(data.name);
    $('#profileEmail').text(data.email);
    $('#profileNim').text(data.nim);
    $('#profileProdi').text(data.prodi);
    $('#profileAngkatan').text(data.angkatan);
    $('#profilePhone').text(data.phone);
    $('#totalRead').text(data.stats.totalRead);
    $('#currentBorrow').text(data.stats.currentBorrow);
    $('#totalBorrow').text(data.stats.totalBorrow);
    $('#favoriteGenre').text(data.stats.favoriteGenre);
}

function setupProfileEvents() {
    $('#editForm').on('submit', function(e) {
        e.preventDefault();
        saveEdit();
    });
}

let currentEditField = '';

function editField(field) {
    currentEditField = field;
    
    const fieldConfig = {
        name: { label: 'Nama Lengkap', value: $('#profileName').text() },
        email: { label: 'Email', value: $('#profileEmail').text() },
        nim: { label: 'NIM / ID', value: $('#profileNim').text() },
        prodi: { label: 'Program Studi', value: $('#profileProdi').text() },
        angkatan: { label: 'Angkatan', value: $('#profileAngkatan').text() },
        phone: { label: 'Nomor Telepon', value: $('#profilePhone').text() }
    };

    const config = fieldConfig[field];
    if (!config) return;

    $('#editModalTitle').text(`Edit ${config.label}`);
    $('#editLabel').text(config.label);
    $('#editField').val(config.value);
    const editModal = new bootstrap.Modal('#editModal');
    editModal.show();
    setTimeout(() => {
        $('#editField').focus();
    }, 500);
}

function saveEdit() {
    const newValue = $('#editField').val().trim();
    
    if (!newValue) {
        alert('Field tidak boleh kosong!');
        return;
    }
    switch (currentEditField) {
        case 'name':
            $('#profileName').text(newValue);
            break;
        case 'email':
            $('#profileEmail').text(newValue);
            break;
        case 'nim':
            $('#profileNim').text(newValue);
            break;
        case 'prodi':
            $('#profileProdi').text(newValue);
            break;
        case 'angkatan':
            $('#profileAngkatan').text(newValue);
            break;
        case 'phone':
            $('#profilePhone').text(newValue);
            break;
    }

    bootstrap.Modal.getInstance('#editModal').hide();
    
    showAlert('Profil berhasil diperbarui!', 'success');
}

function saveProfile() {
    $('.profile-actions .btn-primary').prop('disabled', true).html('<i class="bx bx-loader-alt bx-spin"></i> Menyimpan...');
    
    setTimeout(() => {
        showAlert('Semua perubahan profil berhasil disimpan!', 'success');
        $('.profile-actions .btn-primary').prop('disabled', false).html('<i class="bx bx-save me-2"></i>Simpan Perubahan');
    }, 1500);
}

function resetProfile() {
    if (confirm('Apakah Anda yakin ingin mengembalikan profil ke nilai default?')) {
        initializeProfileData();
        showAlert('Profil berhasil direset!', 'info');
    }
}

function showAlert(message, type) {
    $('.alert').remove();

    const alertClass = type === 'success' ? 'alert-success' : 'alert-info';
    
    const alertHtml = `
        <div class="alert ${alertClass} alert-dismissible fade show position-fixed" 
             style="top: 120px; right: 20px; z-index: 9999; min-width: 300px;">
            <i class='bx ${type === 'success' ? 'bx-check-circle' : 'bx-info-circle'} me-2'></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    $('body').append(alertHtml);
    setTimeout(() => {
        $('.alert').alert('close');
    }, 3000);
}