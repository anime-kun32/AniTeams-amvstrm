    document.addEventListener('DOMContentLoaded', function() {
        const searchInput = document.getElementById('search-input');
        const suggestionsList = document.getElementById('suggestions-list');

        function fetchSuggestions(query) {
            if (query.length < 2) {
                suggestionsList.style.display = 'none'; // Hide list if query is too short
                return;
            }

            // Show loading spinner
            suggestionsList.innerHTML = '<li><div class="spinner"></div></li>';
            suggestionsList.style.display = 'block';

            fetch(`https://api-p1xr.vercel.app/api/v2/search?q=${query}`) // Replace with your actual API endpoint
                .then(response => response.json())
                .then(data => {
                    if (data.results.length === 0) {
                        suggestionsList.innerHTML = '<li>No results found</li>';
                        return;
                    }

                    suggestionsList.innerHTML = data.results.map(result => `
                        <li class="suggestion-item">
                            <a href="./details.html?id=${result.id}" class="suggestion-link">
                                <img src="${result.coverImage.extraLarge}" alt="${result.title.english}">
                                <div>
                                    <p><strong>${result.title.english}</strong></p>
                                    <p>${result.title.native}</p>
                                    <p>${result.genres.join(', ')}</p>
                                    <div class="suggestion-details">
                                        <span>${result.season}</span>
                                        <span>${result.seasonYear}</span>
                                        <span>${result.format}</span>
                                        <span>${result.type}</span>
                                        <span>${result.averageScore}</span>
                                    </div>
                                </div>
                            </a>
                        </li>
                    `).join('');
                })
                .catch(error => {
                    console.error('Error fetching suggestions:', error);
                    suggestionsList.innerHTML = '<li>Error fetching data</li>';
                });
        }

        searchInput.addEventListener('input', function() {
            fetchSuggestions(searchInput.value);
        });

        // Close suggestions list if clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('#search-input') && !event.target.closest('#suggestions-list')) {
                suggestionsList.style.display = 'none';
            }
        });

        // Handle click on suggestion
        suggestionsList.addEventListener('click', function(event) {
            const item = event.target.closest('li');
            if (item) {
                const link = item.querySelector('.suggestion-link');
                if (link) {
                    window.location.href = link.href; // Redirect to the link
                }
            }
        });
    });
