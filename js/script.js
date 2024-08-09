document.addEventListener('DOMContentLoaded', function() {
    // Fetch data for the Trending section
    function fetchOriginalData() {
        // Show loading spinner
        loadingSpinner.classList.remove('hidden');

        fetch('https://api-p1xr.vercel.app/api/v2/trending')
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
                    card.className = "movie-card relative bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 w-32 h-48 shine-effect"; // Added shine-effect class

                    const img = new Image();
                    img.src = movie.coverImage.extraLarge;
                    img.alt = movie.title.english;
                    img.className = "movie-image w-full h-full object-cover";

                    img.onload = function() {
                        // Remove the shine effect once the image has loaded
                        card.classList.remove('shine-effect');
                    };

                    card.innerHTML = `
                        <a href="./details.html?id=${movie.id}" target="_blank">
                            <div class="image-container">${img.outerHTML}</div>
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

    // Fetch data for the Popular section
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
                    card.className = "new-movie-card relative bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 w-32 h-48 shine-effect"; // Added shine-effect class

                    const img = new Image();
                    img.src = movie.coverImage.extraLarge;
                    img.alt = movie.title.english;
                    img.className = "new-movie-image w-full h-full object-cover";

                    img.onload = function() {
                        // Remove the shine effect once the image has loaded
                        card.classList.remove('shine-effect');
                    };

                    card.innerHTML = `
                        <a href="./details.html?id=${movie.id}" target="_blank">
                            <div class="image-container">${img.outerHTML}</div>
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
});
