const bookInventoryData = {
    '1': { available: 15, borrowed: 3 },  
    '2': { available: 20, borrowed: 5 },  
    '3': { available: 12, borrowed: 8 },  
    '4': { available: 18, borrowed: 2 },  
    '5': { available: 25, borrowed: 1 },  
    '6': { available: 10, borrowed: 4 }
};

$(document).ready(function() {
    console.log('Books page specific JS loaded!');
        let currentQuery = '';
    let currentKategori = '';
    let currentStatus = '';
    let searchTimeout;
    
    function renderBooks() {
        const container = $('#book-list-container');
        const noResultsMessage = $('#no-results-message');
        const resultsInfo = $('#search-results-info');
        const resultsCount = $('#results-count');
        
        container.empty();
        noResultsMessage.hide();
        resultsInfo.hide();

        let booksFound = 0;
        let filteredBooks = [];

        $.each(allBookData, function(id, book) {
            const queryMatch = currentQuery === '' || 
                               book.title.toLowerCase().includes(currentQuery) ||
                               book.author.toLowerCase().includes(currentQuery) ||
                               book.category.toLowerCase().includes(currentQuery);
            
            const kategoriMatch = currentKategori === '' || 
                                  book.category.toLowerCase().includes(currentKategori);
            
            const statusMatch = currentStatus === '' || 
                               (currentStatus === 'tersedia' && book.available) ||
                               (currentStatus === 'dipinjam' && !book.available);

            if (queryMatch && kategoriMatch && statusMatch) {
                booksFound++;
                filteredBooks.push({ id, book });
            }
        });

     if (currentQuery || currentKategori || currentStatus) {
            resultsInfo.show();
            let infoText = `Menampilkan ${booksFound} buku`;
            
            if (currentQuery) {
                infoText += ` untuk "${currentQuery}"`;
            }
            if (currentKategori) {
                const kategoriText = $('.filter-kategori[data-kategori="' + currentKategori + '"]').text();
                infoText += ` dalam ${kategoriText}`;
            }
            if (currentStatus) {
                const statusText = $('.filter-status[data-status="' + currentStatus + '"]').text();
                infoText += ` - ${statusText}`;
            }
            
            resultsCount.text(infoText);
        }

        filteredBooks.forEach(function(item) {
            const book = item.book;
            const id = item.id;
            const inventory = bookInventoryData[id] || { available: 0, borrowed: 0 };
            
            const bookHtml = `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="book-grid-card" data-book-id="${id}">
                        <div class="book-header">
                            <span class="book-location">${book.location || 'N/A'}</span>
                            <div class="book-stats">
                                <span class="available">${inventory.available} Tersedia</span>
                                <span class="borrowed">${inventory.borrowed} Dipinjam</span>
                            </div>
                        </div>
                        <div class="book-content">
                            <div class="book-cover">
                                <img src="${book.cover}" alt="${book.title}" loading="lazy">
                            </div>
                            <div class="book-details">
                                <h4>${book.title}</h4>
                                <p class="book-author">by ${book.author}</p>
                                <p class="book-year">${book.year}</p>
                                <!-- Tombol detail dihapus, klik card langsung buka modal -->
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

    $('.section-search-input').on('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentQuery = $(this).val().toLowerCase().trim();
            renderBooks();
        }, 300);
    });

    $('.section-search-btn').on('click', function() {
        currentQuery = $('.section-search-input').val().toLowerCase().trim();
        renderBooks();
    });

    $('.section-search-input').on('keypress', function(e) {
        if (e.key === 'Enter') {
            currentQuery = $(this).val().toLowerCase().trim();
            renderBooks();
        }
    });
    $(document).on('click', '.filter-kategori', function(e) {
        e.preventDefault();
        currentKategori = $(this).data('kategori').toLowerCase();
        const filterText = $(this).text();
        $('.btn-filter').html(`<i class='bx bx-filter'></i> ${filterText}`);
        
        renderBooks();
    });
    $(document).on('click', '.filter-status', function(e) {
        e.preventDefault();
        currentStatus = $(this).data('status').toLowerCase();
        renderBooks();
    });
    $('.section-search-input').on('input', function() {
        if ($(this).val().trim() === '') {
            currentQuery = '';
            renderBooks();
        }
    });
    $(document).on('click', '.book-grid-card', function() {
        const bookId = $(this).data('book-id');
        if (bookId && typeof window.showBookDetail === 'function') {
            window.showBookDetail(bookId);
        }
    });
    function initializePage() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');

        if (searchQuery) {
            const decodedQuery = decodeURIComponent(searchQuery).toLowerCase();
            $('.section-search-input').val(decodedQuery);
            currentQuery = decodedQuery;
        }
renderBooks();
    }
    initializePage();
});