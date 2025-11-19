const allBookData = {
    '1': {
        title: 'Seporsi Mie Ayam Sebelum Mati',
        cover: 'MI AYAM.avif',
        author: 'Brian Khrisna',
        year: '2024',
        category: 'Fiksi Kontemporer, Drama',
        publisher: 'Gramedia Pustaka Utama',
        isbn: '978-602-424-123-4',
        location: 'Rak A-15',
        rating: '4.8',
        available: true,
        synopsis: 'Novel yang mengisahkan tentang perjalanan hidup seorang pemuda yang menemukan makna kehidupan melalui seporsi mie ayam. Cerita ini menggambarkan bagaimana hal-hal sederhana dalam hidup dapat memiliki dampak yang besar. Sebuah kisah yang menghangatkan hati tentang persahabatan, cinta, dan makna kehidupan yang sebenarnya.'
    },
    '2': {
        title: 'Horimiya 01',
        cover: '9786020421872_horimiya-01.avif',
        author: 'Hero, Daisuke Hagiwara',
        year: '2023', 
        category: 'Manga, Romance, School Life',
        publisher: 'Elex Media Komputindo',
        isbn: '978-602-042-187-2',
        location: 'Rak B-08',
        rating: '4.9',
        available: true,
        synopsis: 'Kyouko Hori adalah gadis populer dan pandai di sekolah, tetapi di rumah dia harus merawat adiknya dan mengerjakan pekerjaan rumah. Izumi Miyamura adalah cowok pendiam dan tidak menarik perhatian di sekolah, tetapi di luar sekolah dia adalah pria dengan tattoo dan piercing. Ketika rahasia mereka terbongkar, hubungan unik mereka pun dimulai.'
    },
    '3': {
        title: 'Laut Bercerita',
        cover: '9786024246945_Laut-Bercerita.avif',
        author: 'Leila S. Chudori',
        year: '2024',
        category: 'Fiksi Sejarah, Drama',
        publisher: 'Kepustakaan Populer Gramedia',
        isbn: '978-602-424-694-5', 
        location: 'Rak C-12',
        rating: '4.7',
        available: false,
        synopsis: 'Novel yang menceritakan tentang kisah keluarga yang terpisah oleh tragedi 1965. Laut menjadi saksi bisu perjalanan para eksil yang harus meninggalkan tanah air mereka. Sebuah karya sastra yang powerful tentang ingatan, pengasingan, dan kerinduan akan tanah air.'
    },
    '4': {
        title: 'Sherlock Holmes: Koleksi Kasus 1',
        cover: '9786020312910_Sherlock-Holmes_Koleksi-Kasus-1.avif',
        author: 'Arthur Conan Doyle',
        year: '2023',
        category: 'Misteri, Crime, Klasik',
        publisher: 'Bentang Pustaka',
        isbn: '978-602-031-291-0',
        location: 'Rak D-05',
        rating: '4.6',
        available: true,
        synopsis: 'Kumpulan kasus-kasus terkenal detektif legendaris Sherlock Holmes dan rekannya Dr. Watson. Dari kasus pencurian dokumen penting hingga pembunuhan misterius, ikuti petualangan Holmes dengan metode deduksinya yang terkenal. Setiap kasus menantang logika dan kecerdikan pembaca.'
    },
    '5': {
        title: 'Atomic Habits',
        cover: 'image.png',
        author: 'James Clear',
        year: '2018',
        category: 'Self-Help',
        publisher: 'Penguin Random House',
        isbn: '978-073-521-129-2',
        location: 'Rak A-01',
        rating: '4.9',
        available: true,
        synopsis: 'Perubahan kecil yang memberikan hasil luar biasa...'
    },
    '6': {
        title: 'Sejarah Dunia yang Disembunyikan',
        cover: 'lgkld.avif', 
        author: 'Jonathan Black',
        year: '2007',
        category: 'Sejarah, Non-Fiksi',
        publisher: 'Penerbit Alvabet',
        isbn: '978-602-9193-67-1',
        location: 'Rak F-04',
        rating: '4.2',
        available: true,
        synopsis: 'Buku ini mengungkap sisi lain dari sejarah dunia...'
    }
};
let bookDetailModal = null;

$(document).ready(function() {
    console.log('Main JS loaded!');
    setupActiveNavigation();
    setupNavbarSearch();
    initializeModal();
    setupBookDetailsModal();
    if (isUserPage()) {
        setupUserStatistics();
        setupHeroSearch();
    }
    function setupActiveNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || "user.html";

        $('.navbar-nav .nav-link').each(function() {
            const linkPage = $(this).attr('href');
            if (linkPage === currentPage) {
                $(this).addClass('active');
            } else {
                $(this).removeClass('active');
            }
        });
    }
    function setupNavbarSearch() {
        let searchTimeout;
        
        $('.navbar .search-input').on('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const query = $(this).val().trim();
                if (query.length > 2 || query.length === 0) {
                    performGlobalSearch(query);
                }
            }, 500);
        });
        
        $('.navbar .search-icon-btn').on('click', function() {
            performGlobalSearch($('.navbar .search-input').val());
        });
    }

    function performGlobalSearch(query) {
        if (!query || query.trim() === '') {
            showAlert('Masukkan kata kunci pencarian!', 'warning');
            return;
        }
        window.location.href = `buku.html?search=${encodeURIComponent(query.trim())}`;
    }
    function setupUserStatistics() {
        initializeUserData();
        updateVisitCount();
        loadStatistics();
        animateNumbers();
    }
    
    function initializeUserData() {
        if (!localStorage.getItem('userVisits')) {
            localStorage.setItem('userVisits', '1');
        }
        if (!localStorage.getItem('userBorrowedBooks')) {
            localStorage.setItem('userBorrowedBooks', JSON.stringify([]));
        }
    }
    
    function updateVisitCount() {
        let visits = parseInt(localStorage.getItem('userVisits')) || 0;
        visits++;
        localStorage.setItem('userVisits', visits.toString());
        $('#user-visits').text(visits);
    }
    
    function loadStatistics() {
        $('#total-books').text('2.847');
        
        const borrowedBooks = JSON.parse(localStorage.getItem('userBorrowedBooks') || '[]');
        $('#user-borrowed').text(borrowedBooks.length);
        
        const visits = localStorage.getItem('userVisits') || '1';
        $('#user-visits').text(visits);
    }
    
    function animateNumbers() {
        $('.stat-card h3').each(function() {
            const $this = $(this);
            const originalText = $this.text();
            const countTo = parseInt(originalText.replace('.', ''));
            
            $({ countNum: 0 }).animate({ countNum: countTo }, {
                duration: 1500,
                easing: 'swing',
                step: function() {
                    let displayNum;
                    if (countTo > 1000) {
                        displayNum = Math.floor(this.countNum / 1000) + '.' + 
                                   Math.floor((this.countNum % 1000) / 100) + 
                                   Math.floor((this.countNum % 100) / 10);
                    } else {
                        displayNum = Math.floor(this.countNum);
                    }
                    $this.text(displayNum);
                },
                complete: function() {
                    $this.text(originalText);
                }
            });
        });
    }
    function setupHeroSearch() {
        $('.transition-search-input').on('keypress', function(e) {
            if (e.key === 'Enter') {
                performGlobalSearch($(this).val());
            }
        });
        
        $('.transition-search-btn').on('click', function() {
            performGlobalSearch($('.transition-search-input').val());
        });
    }
    function initializeModal() {
        const modalElement = document.getElementById('bookDetailModal');
        if (modalElement && !bookDetailModal) {
            bookDetailModal = new bootstrap.Modal(modalElement, {
                backdrop: true,
                keyboard: true,
                focus: true
            });
            modalElement.addEventListener('hidden.bs.modal', function() {
                $('#modalLoading').hide();
                $('#modalContent').show();
                resetModalContent();
            });
            modalElement.addEventListener('show.bs.modal', function() {
                $('#modalLoading').hide();
                $('#modalContent').show();
            });
        }
    }
    function setupBookDetailsModal() {
        $(document).on('click', '.book-card:not(.book-grid-card), .btn-detail', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const bookId = $(this).data('book-id') || $(this).closest('.book-card').data('book-id');
            if (bookId) {
                showBookDetail(bookId);
            }
        });
        $(document).on('click', '.book-grid-card', function(e) {
            if ($(e.target).is('button, a, .btn-action') || 
                $(e.target).closest('button, a, .btn-action').length) {
                return;
            }
            const bookId = $(this).data('book-id');
            if (bookId) {
                showBookDetail(bookId);
            }
        });
    }
    function resetModalContent() {
        $('#bookDetailTitle').text('Detail Buku');
        $('#bookDetailTitleText').text('');
        $('#bookDetailCover').attr('src', '').attr('alt', 'Cover Buku');
        $('#bookDetailAuthor').text('');
        $('#bookDetailYear').text('');
        $('#bookDetailCategory').text('');
        $('#bookDetailPublisher').text('');
        $('#bookDetailISBN').text('');
        $('#bookDetailLocation').text('');
        $('#bookDetailRating').text('');
        $('#bookDetailSynopsis').html('');
        $('#bookAvailability').text('Tersedia').removeClass('bg-success bg-danger bg-secondary').addClass('bg-success');
    }
    window.showBookDetail = function(bookId) {
        if (!bookDetailModal) {
            initializeModal();
        }
        $('#modalLoading').show();
        $('#modalContent').hide();
        resetModalContent();
        setTimeout(function() {
            const bookData = getBookDetailData(bookId);
            
            if (!bookData) {
                console.warn(`Data buku dengan ID ${bookId} tidak ditemukan`);
                $('#modalLoading').hide();
                $('#modalContent').show();
                $('#bookDetailTitle').text('Detail Buku');
                $('#bookDetailTitleText').text('Data tidak tersedia');
                $('#bookDetailCover').attr('src', '').attr('alt', 'Cover tidak tersedia');
                $('#bookDetailAuthor').text('-');
                $('#bookDetailYear').text('-');
                $('#bookDetailCategory').text('-');
                $('#bookDetailPublisher').text('-');
                $('#bookDetailISBN').text('-');
                $('#bookDetailLocation').text('-');
                $('#bookDetailRating').text('-');
                $('#bookDetailSynopsis').html('<p class="text-muted">Informasi detail buku tidak tersedia.</p>');
                
                $('#bookAvailability').text('Tidak Diketahui').removeClass('bg-success bg-danger').addClass('bg-secondary');
            } else {
               $('#bookDetailTitle').text(`Detail: ${bookData.title}`);
                $('#bookDetailTitleText').text(bookData.title);
                $('#bookDetailCover').attr('src', bookData.cover).attr('alt', bookData.title);
                $('#bookDetailAuthor').text(bookData.author);
                $('#bookDetailYear').text(bookData.year);
                $('#bookDetailCategory').text(bookData.category);
                $('#bookDetailPublisher').text(bookData.publisher);
                $('#bookDetailISBN').text(bookData.isbn);
                $('#bookDetailLocation').text(bookData.location);
                $('#bookDetailRating').text(bookData.rating);
                $('#bookDetailSynopsis').html(bookData.synopsis);
                
                const availabilityBadge = $('#bookAvailability');
                if (bookData.available) {
                    availabilityBadge.text('Tersedia').removeClass('bg-danger bg-secondary').addClass('bg-success');
                } else {
                    availabilityBadge.text('Sedang Dipinjam').removeClass('bg-success bg-secondary').addClass('bg-danger');
                }
            }
            
            $('#modalLoading').hide();
            $('#modalContent').show();
            if (bookDetailModal) {
                bookDetailModal.show();
            }
        }, 300);
    }
    
    function getBookDetailData(bookId) {
        const stringId = String(bookId); 
        return allBookData[stringId] || null;
    }
    function isUserPage() {
        return window.location.pathname.endsWith('user.html') || 
               window.location.pathname === '/' || 
               window.location.pathname.endsWith('index.html');
    }
    
    window.showAlert = function(message, type = 'info') {
        $('.custom-alert').remove();
        const alertClass = {
            'success': 'alert-success',
            'warning': 'alert-warning',
            'info': 'alert-info',
            'error': 'alert-danger'
        }[type] || 'alert-info';
        
        const alertHtml = `
            <div class="custom-alert alert ${alertClass} alert-dismissible fade show position-fixed" 
                 style="top: 120px; right: 20px; z-index: 9999; min-width: 300px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>`;
        
        $('body').append(alertHtml);
        
        setTimeout(() => {
            $('.custom-alert').alert('close');
        }, 3000);
    };

    window.redirectToPinjam = function() {
        window.location.href = 'pinjam.html';
    };

});