// script.js
document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');
    const resultsContainer = document.getElementById('results-container');
    const loadingSpinner = document.getElementById('loading-spinner');

    searchBar.addEventListener('input', async () => {
        const query = searchBar.value.trim();
        if (query === '') {
            resultsContainer.innerHTML = '';
            return;
        }
        
        loadingSpinner.style.display = 'block';

        try {
            const response = await fetch(`https://api-p1xr.vercel.app/api/v2/search?q=${query}`);
            const data = await response.json();
            
            if (data.code === 200) {
                resultsContainer.innerHTML = data.results.map(result => `
                    <div class="card">
                        <img src="${result.coverImage.extraLarge}" alt="${result.title.userPreferred}">
                        <div class="card-info">
                            <div class="title">${result.title.userPreferred}</div>
                            <div class="genres">${result.genres.join(', ')}</div>
                            <div class="season">${result.season}</div>
                            <div class="format">${result.format}</div>
                            <div class="season-year">${result.seasonYear}</div>
                            <div class="episodes">${result.episodes} episodes</div>
                        </div>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
            resultsContainer.innerHTML = '<p>Error fetching results. Please try again.</p>';
        } finally {
            loadingSpinner.style.display = 'none';
        }
    });
});
