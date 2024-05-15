document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const searchInput = document.getElementById('searchInput').value;
    const typeSelect = document.getElementById('typeSelect').value;

    // Очистка предыдущих результатов
    document.getElementById('movies').innerHTML = '';
    document.getElementById('pagination').innerHTML = '';

    // запрос к API 
    fetch(`http://www.omdbapi.com/?s=${searchInput}&type=${typeSelect}&apikey=1ebf1a3c`)
    .then(response => response.json())
    .then(data => {
        if (data.Response === "True") {
            // Если фильмы найден, отображаем 
            displayMovies(data.Search, 3); 
        } else {
            document.getElementById('movies').innerText = 'Movie not found!';
        }
    })
    .catch(error => console.log('Error:', error));
});

function displayMovies(movies, itemsPerPage) {
    const moviesContainer = document.getElementById('movies');
    const totalPages = Math.ceil(movies.length / itemsPerPage); // Общее количество страниц

    let currentPage = 1; 
    displayPage(currentPage); // Отображаем текущую страницу

    function displayPage(page) {
        const startIndex = (page - 1) * itemsPerPage; // Начальный индекс для текущей страницы
        const endIndex = Math.min(startIndex + itemsPerPage, movies.length); // Конечный индекс для текущей страницы
        const pageMovies = movies.slice(startIndex, endIndex); // Фильмы для текущей страницы

        moviesContainer.innerHTML = ''; // Очистка контейнера с фильмами

        // Вывод фильма текущей страницы
        pageMovies.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie');
            movieElement.innerHTML = `
                <img src="${movie.Poster}" alt="${movie.Title}"> <!-- Добавляем постер фильма -->
                <p>${movie.Title}</p>
                <button onclick="showDetails('${movie.imdbID}')">Details</button>
            `;
            moviesContainer.appendChild(movieElement);
        });

        // пагинация
        const paginationContainer = document.getElementById('pagination');
        paginationContainer.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.addEventListener('click', () => displayPage(i));
            paginationContainer.appendChild(button);
        }
    }
}


function showDetails(imdbID) {
    // запрос к API  для получения  информации о фильме
    fetch(`http://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=1ebf1a3c`)
    .then(response => response.json())
    .then(data => {
        // Вывод информации  о фильме
        alert(`Title: ${data.Title}\nYear: ${data.Year}\nPlot: ${data.Plot}`);
    })
    .catch(error => console.log('Error:', error));
}
