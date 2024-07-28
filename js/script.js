    document.addEventListener('DOMContentLoaded', function() {
        // Original Section
        const loadingSpinner = document.getElementById('loading-spinner');
        const errorMessage = document.getElementById('error-message');
        const noDataMessage = document.getElementById('no-data-message');
        const movieContainer = document.getElementById('movie-container');
        const scrollContainer = document.getElementById('scroll-container');

        // Fetch data for the original section
        function fetchOriginalData() {
            // Show loading spinner
            loadingSpinner.classList.remove('hidden');

            fetch('https://api-p1xr.vercel.app/api/v2/trending') // Replace with your actual API endpoint for the original section
                .then(response => response.json())
                .then(data => {
                    // Hide loading spinner
                    loadingSpinner.classList.add('hidden');

                    if (data.results.length === 0) {
                        noDataMessage.classList.remove('hidden');
                        return;
                    }

                    noDataMessage.classList.add('hidden');

                    data.results.forEach(movie => {
                        const card = document.createElement('div');
                        card.className = "movie-card relative bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 w-32 h-48"; // Adjusted card size

                        card.innerHTML = `
                            <a href="./details.html?id=${movie.id}" target="_blank">
                                <img src="${movie.coverImage.extraLarge}" alt="${movie.title.english}" class="movie-image w-full h-full object-cover">
                                <div class="movie-info absolute inset-0 bg-gray-900 bg-opacity-80 opacity-0 flex flex-col justify-center items-center text-center p-2 transition-opacity duration-300">
                                    <h2 class="text-xs font-bold mb-1">${movie.title.english}</h2>
                                    <p class="text-xs mb-1">${movie.genres.join(', ')}</p>
                                    <p class="text-xs">Episodes: ${movie.episodes}</p>
                                    <p class="text-xs">Season Year: ${movie.seasonYear}</p>
                                </div>
                            </a>
                        `;

                        movieContainer.appendChild(card);
                    });
                })
                .catch(error => {
                    // Hide loading spinner
                    loadingSpinner.classList.add('hidden');

                    // Show error message
                    errorMessage.classList.remove('hidden');
                    console.error('Error fetching data:', error);
                });
        }

        fetchOriginalData();

        // New Section
        const newLoadingSpinner = document.getElementById('new-loading-spinner');
        const newErrorMessage = document.getElementById('new-error-message');
        const newNoDataMessage = document.getElementById('new-no-data-message');
        const newMovieContainer = document.getElementById('new-movie-container');
        const newScrollContainer = document.getElementById('new-scroll-container');

        // Fetch data for the new section
        function fetchNewData() {
            // Show loading spinner
            newLoadingSpinner.classList.remove('hidden');

            fetch('https://api-p1xr.vercel.app/api/v2/popular') 
                .then(response => response.json())
                .then(data => {
                    // Hide loading spinner
                    newLoadingSpinner.classList.add('hidden');

                    if (data.results.length === 0) {
                        newNoDataMessage.classList.remove('hidden');
                        return;
                    }

                    newNoDataMessage.classList.add('hidden');

                    data.results.forEach(movie => {
                        const card = document.createElement('div');
                        card.className = "new-movie-card relative bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 w-32 h-48"; // Adjusted card size

                        card.innerHTML = `
                            <a href="./details.html?id=${movie.id}" target="_blank">
                                <img src="${movie.coverImage.extraLarge}" alt="${movie.title.english}" class="new-movie-image w-full h-full object-cover">
                                <div class="new-movie-info absolute inset-0 bg-gray-900 bg-opacity-80 opacity-0 flex flex-col justify-center items-center text-center p-2 transition-opacity duration-300">
                                    <h2 class="text-xs font-bold mb-1">${movie.title.english}</h2>
                                    <p class="text-xs mb-1">${movie.genres.join(', ')}</p>
                                    <p class="text-xs">Episodes: ${movie.episodes}</p>
                                    <p class="text-xs">Season Year: ${movie.seasonYear}</p>
                                </div>
                            </a>
                        `;

                        newMovieContainer.appendChild(card);
                    });
                })
                .catch(error => {
                    // Hide loading spinner
                    newLoadingSpinner.classList.add('hidden');

                    // Show error message
                    newErrorMessage.classList.remove('hidden');
                    console.error('Error fetching data:', error);
                });
        }

        fetchNewData();

        // Function to handle horizontal scroll with arrow keys
        function handleArrowKeyScroll(event) {
            if (event.target.closest('#scroll-container')) {
                const target = event.target.closest('#scroll-container');
                const scrollAmount = 100; // Amount to scroll with each key press

                switch (event.key) {
                    case 'ArrowRight':
                        target.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                        break;
                    case 'ArrowLeft':
                        target.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                        break;
                }
            }

            if (event.target.closest('#new-scroll-container')) {
                const target = event.target.closest('#new-scroll-container');
                const scrollAmount = 100; // Amount to scroll with each key press

                switch (event.key) {
                    case 'ArrowRight':
                        target.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                        break;
                    case 'ArrowLeft':
                        target.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                        break;
                }
            }
        }

        // Add event listener for arrow keys
        document.addEventListener('keydown', handleArrowKeyScroll);

        // Enable arrow key scrolling only after interaction
        document.addEventListener('mousedown', () => {
            document.removeEventListener('keydown', handleArrowKeyScroll);
            document.addEventListener('keydown', handleArrowKeyScroll);
        });
    });
