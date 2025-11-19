const borrowingData = [
    {
        id: 1,
        bookId: '1',
        title: 'Seporsi Mie Ayam Sebelum Mati',
        cover: 'MI AYAM.avif',
        author: 'Brian Khrisna',
        year: '2024',
        location: 'Rak A-15',
        borrowDate: '18/09/2025',
        returnDate: '02/10/2025',
        status: 'borrowed'
    },
    {
        id: 2,
        bookId: '2', 
        title: 'Horimiya 01',
        cover: '9786020421872_horimiya-01.avif',
        author: 'Hero, Daisuke Hagiwara',
        year: '2023',
        location: 'Rak B-08',
        borrowDate: '03/09/2025',
        returnDate: '17/09/2025',
        status: 'overdue'
    },
    {
        id: 3,
        bookId: '3', 
        title: 'Laut Bercerita',
        cover: '9786024246945_Laut-Bercerita.avif',
        author: 'Leila S. Chudori',
        year: '2024',
        location: 'Rak C-12',
        borrowDate: '01/08/2025',
        returnDate: '15/08/2025',
        status: 'returned'
    },
    {
        id: 4,
        bookId: '4',
        title: 'Sherlock Holmes: Koleksi Kasus 1',
        cover: '9786020312910_Sherlock-Holmes_Koleksi-Kasus-1.avif',
        author: 'Arthur Conan Doyle',
        year: '2023',
        location: 'Rak D-05',
        borrowDate: '20/09/2025',
        returnDate: '04/10/2025',
        status: 'borrowed'
    },
    {
        id: 5,
        bookId: '5',
        title: 'Atomic Habits',
        cover: 'image.png',
        author: 'James Clear',
        year: '2018',
        location: 'Rak A-01',
        borrowDate: '25/08/2025',
        returnDate: '08/09/2025',
        status: 'overdue'
    },
    {
        id: 6,
        bookId: '6',
        title: 'Sejarah Dunia yang Disembunyikan',
        cover: 'lgkld.avif',
        author: 'Jonathan Black',
        year: '2007',
        location: 'Rak F-04',
        borrowDate: '10/07/2025',
        returnDate: '24/07/2025',
        status: 'returned'
    }
];

$(document).ready(function() {
    console.log('Pinjam page specific JS loaded!');
    let currentQuery = '';
    let currentFilter = 'all';
    function renderBorrowedBooks() {
        const container = $('#booksContainer');
        const noResultsMessage = $('#no-results-message');
        const resultsInfo = $('#search-results-info');
        const resultsCount = $('#results-count');
        
        container.empty();
        noResultsMessage.hide();
        resultsInfo.hide();

        let booksFound = 0;
        let filteredBooks = [];

        borrowingData.forEach(function(book) {
            const queryMatch = currentQuery === '' || 
                               book.title.toLowerCase().includes(currentQuery) ||
                               book.author.toLowerCase().includes(currentQuery);
            
            const filterMatch = currentFilter === 'all' || 
                               book.status === currentFilter;

            if (queryMatch && filterMatch) {
                booksFound++;
                filteredBooks.push(book);
            }
        });

        if (currentQuery || currentFilter !== 'all') {
            resultsInfo.show();
            let infoText = `Menampilkan ${booksFound} buku`;
            
            if (currentQuery) {
                infoText += ` untuk "${currentQuery}"`;
            }
            if (currentFilter !== 'all') {
                const filterText = getFilterText(currentFilter);
                infoText += ` - ${filterText}`;
            }
            
            resultsCount.text(infoText);
        }
        filteredBooks.forEach(function(book) {
            const statusConfig = getStatusConfig(book.status);
            const bookHtml = `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="book-grid-card" data-book-id="${book.bookId}">
                        <div class="book-header">
                            <div class="book-location">${book.location}</div>
                        </div>
                        <div class="book-content">
                            <div class="book-cover">
                                <img src="${book.cover}" alt="${book.title}" loading="lazy">
                            </div>
                            <div class="book-details">
                                <h4>${book.title}</h4>
                                <p class="book-author">by ${book.author}</p>
                                <p class="book-year">Tahun: ${book.year}</p>
                                
                                <div class="date-info">
                                    <div class="date-item">
                                        <div class="date-label">Tanggal Peminjaman</div>
                                        <div class="date-value">${book.borrowDate}</div>
                                    </div>
                                    <div class="date-item">
                                        <div class="date-label">Tanggal Pengembalian</div>
                                        <div class="date-value">${book.returnDate}</div>
                                    </div>
                                </div>
                                
                                <div class="status-indicator">
                                    <div class="status-badge ${statusConfig.badgeClass}"></div>
                                    <span class="status-text">${statusConfig.text}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.append(bookHtml);
        });

        if (booksFound === 0) {
            noResultsMessage.show();
        }
    }
    
    function getStatusConfig(status) {
        const configs = {
            'borrowed': { badgeClass: 'status-borrowed', text: 'Sedang Dipinjam' },
            'overdue': { badgeClass: 'status-overdue', text: 'Terlambat' },
            'returned': { badgeClass: 'status-returned', text: 'Sudah Dikembalikan' }
        };
        return configs[status] || configs.borrowed;
    }
    
    function getFilterText(filter) {
        const texts = {
            'all': 'Semua Status',
            'borrowed': 'Sedang Dipinjam',
            'overdue': 'Terlambat',
            'returned': 'Sudah Dikembalikan'
        };
        return texts[filter] || texts.all;
    }
    $('.section-search-btn').on('click', function() {
        currentQuery = $('.section-search-input').val().toLowerCase().trim();
        renderBorrowedBooks();
    });

    $('.section-search-input').on('keypress', function(e) {
        if (e.key === 'Enter') {
            currentQuery = $(this).val().toLowerCase().trim();
            renderBorrowedBooks();
        }
    });
    $(document).on('click', '.filter-option', function(e) {
        e.preventDefault();
        $('.filter-option').removeClass('active');
        $(this).addClass('active');
        
        currentFilter = $(this).data('filter');
        const filterText = $(this).text();
        $('.btn-filter').html(`<i class='bx bx-filter'></i> ${filterText}`);
        
        renderBorrowedBooks();
    });
    $('.section-search-input').on('input', function() {
        if ($(this).val().trim() === '') {
            currentQuery = '';
            renderBorrowedBooks();
        }
    });
    $(document).on('click', '.book-grid-card', function(e) {
        if ($(e.target).closest('.btn-action').length) {
            return;
        }
        
        const bookId = $(this).data('book-id');
        if (bookId && typeof window.showBookDetail === 'function') {
            window.showBookDetail(bookId);
        }
    });
    function initializePage() {
        renderBorrowedBooks();
    }
    initializePage();
});