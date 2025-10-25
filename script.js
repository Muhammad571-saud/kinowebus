const socket = io();

// Initialize page-specific functionality
document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;

    if (path === '/') {
        initHomePage();
    } else if (path === '/search') {
        initSearchPage();
    } else if (path === '/admin') {
        initAdminPage();
    } else if (path.startsWith('/stream/')) {
        // Streaming initialization is handled in stream.html
    }
});

function initHomePage() {
    document.getElementById('search-btn').addEventListener('click', function() {
        window.location.href = '/search';
    });

    document.getElementById('admin-link').addEventListener('click', function(e) {
        e.preventDefault();
        const password = prompt('Admin parolini kiriting:');
        if (password === 'kinotop007') {
            window.location.href = '/admin';
        } else {
            alert('Noto\'g\'ri parol');
        }
    });
}

function initSearchPage() {
    document.getElementById('search-movie-btn').addEventListener('click', searchMovieByCode);

    document.getElementById('movie-code-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchMovieByCode();
        }
    });

    document.getElementById('admin-link').addEventListener('click', function(e) {
        e.preventDefault();
        const password = prompt('Admin parolini kiriting:');
        if (password === 'kinotop007') {
            window.location.href = '/admin';
        } else {
            alert('Noto\'g\'ri parol');
        }
    });
}

function initAdminPage() {
    document.getElementById('auth-btn').addEventListener('click', authenticateAdmin);
    document.getElementById('add-movie-btn').addEventListener('click', showAddMovieForm);
    document.getElementById('remove-movie-btn').addEventListener('click', showRemoveMovieForm);
    document.getElementById('submit-add-movie').addEventListener('click', addMovie);
    document.getElementById('submit-remove-movie').addEventListener('click', removeMovie);
}

function authenticateAdmin() {
    const password = document.getElementById('admin-password').value;
    if (!password) {
        alert('Parolni kiriting');
        return;
    }

    fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('auth-section').style.display = 'none';
            document.getElementById('admin-panel').style.display = 'block';
        } else {
            alert('Xatolik: ' + (data.error || 'Noto\'g\'ri parol'));
        }
    })
    .catch(error => {
        alert('Autentifikatsiya xatoligi: ' + error.message);
    });
}

function showAddMovieForm() {
    document.getElementById('add-movie-form').style.display = 'block';
    document.getElementById('remove-movie-form').style.display = 'none';
}

function showRemoveMovieForm() {
    document.getElementById('remove-movie-form').style.display = 'block';
    document.getElementById('add-movie-form').style.display = 'none';
}

function addMovie() {
    const type = document.getElementById('movie-type').value;
    const name = document.getElementById('movie-name').value;
    const code = document.getElementById('movie-code').value;
    const imageFile = document.getElementById('movie-image').files[0];

    if (!name || !type || !code || !imageFile) {
        alert('Barcha maydonlarni to\'ldiring');
        return;
    }

    // Convert image to base64 for demo purposes
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result;

        fetch('/api/movies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, type, code, image: imageData })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Kino muvaffaqiyatli qo\'shildi');
                document.getElementById('add-movie-form').style.display = 'none';
                // Reset form
                document.getElementById('movie-name').value = '';
                document.getElementById('movie-code').value = '';
                document.getElementById('movie-image').value = '';
            } else {
                alert('Kino qo\'shishda xatolik: ' + (data.error || 'Noma\'lum xatolik'));
            }
        })
        .catch(error => {
            alert('Kino qo\'shishda xatolik: ' + error.message);
        });
    };
    reader.readAsDataURL(imageFile);
}

function removeMovie() {
    const code = document.getElementById('remove-movie-code').value;
    if (!code) {
        alert('Kino kodini kiriting');
        return;
    }

    if (!confirm('Haqiqatan ham bu kinoni o\'chirmoqchimisiz?')) {
        return;
    }

    fetch(`/api/movies/${code}`, { method: 'DELETE' })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Kino muvaffaqiyatli o\'chirildi');
            document.getElementById('remove-movie-form').style.display = 'none';
            document.getElementById('remove-movie-code').value = '';
        } else {
            alert('Kino o\'chirishda xatolik: ' + (data.error || 'Kino topilmadi'));
        }
    })
    .catch(error => {
        alert('Kino o\'chirishda xatolik: ' + error.message);
    });
}

function searchMovieByCode() {
    const code = document.getElementById('movie-code-input').value.trim().toUpperCase();
    if (!code) {
        alert('Kino kodini kiriting');
        return;
    }

    fetch('/api/movies')
    .then(response => {
        if (!response.ok) {
            throw new Error('Kinolar ro\'yxatini yuklab bo\'lmadi');
        }
        return response.json();
    })
    .then(movies => {
        const movie = movies.find(m => m.code.toUpperCase() === code);
        const searchResult = document.getElementById('search-result');

        if (movie) {
            searchResult.innerHTML = `
                <div class="movie-found">
                    <img src="${movie.image}" alt="${movie.name}">
                    <h3>${movie.name}</h3>
                    <p>Turi: ${movie.type === 'movie' ? 'Kino' : 'Multfilm'}</p>
                    <p>Kod: ${movie.code}</p>
                    <button onclick="streamMovie('${movie.code}')">Tomosha qilish</button>
                </div>
            `;
            searchResult.classList.add('show');
        } else {
            searchResult.innerHTML = '<p style="color: red; text-align: center;">Bu kod bilan kino topilmadi.</p>';
            searchResult.classList.add('show');
        }
    })
    .catch(error => {
        console.error('Kino qidirishda xatolik:', error);
        const searchResult = document.getElementById('search-result');
        searchResult.innerHTML = '<p style="color: red; text-align: center;">Qidirishda xatolik yuz berdi. Keyinroq urinib ko\'ring.</p>';
        searchResult.classList.add('show');
    });
}

// Old function removed as it's no longer needed

function streamMovie(code) {
    window.location.href = `/stream/${code}`;
}

function initStreaming(movieCode) {
    socket.emit('join', { room: movieCode });

    socket.on('movie_chunk', function(data) {
        // In a real implementation, you'd append the chunk to the video element
        console.log('Received movie chunk:', data);
    });

    // Simulate streaming request
    socket.emit('stream_movie', { movie_code: movieCode });
}