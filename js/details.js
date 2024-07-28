 async function fetchAnimeDetails(id) {
            const response = await fetch(`https://api-p1xr.vercel.app/api/v2/info/${id}`);
            const data = await response.json();
            return data;
        }

        function createAnimeDetails(data) {
            const bannerImage = data.bannerImage;
            const coverImage = data.coverImage.large;
            const title = data.title.userPreferred;
            const nativeName = data.title.native;
            const genres = data.genres.join(', ');
            const additionalInfo = `${data.format} | ${data.type} | ${(data.score.averageScore / 10).toFixed(1)} | ${data.year}`;
            const watchUrl = `episodes.html?id=${data.id}`;

            document.title = title; // Set document title

            return `
                <div class="banner" style="background-image: url(${bannerImage});">
                    <div class="banner-overlay"></div>
                </div>
                <div class="anime-card">
                    <img src="${coverImage}" alt="${title}" class="rounded shadow-lg">
                </div>
                <div class="anime-details container mx-auto px-4">
                    <h1 class="text-4xl font-bold">${title}</h1>
                    <h2 class="text-2xl text-gray-400">${nativeName}</h2>
                    <div class="mt-4">
                        <ul class="genre-list flex">
                            ${data.genres.map(genre => `<li>${genre}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="mt-4">
                        <p>${data.description}</p>
                    </div>
                    <div class="mt-4 text-gray-400">
                        <p>${additionalInfo}</p>
                    </div>
                    <div class="mt-4">
                        <a href="${watchUrl}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Watch Now</a>
                    </div>
                    
                </div>
            `;
        }

        async function init() {
            const urlParams = new URLSearchParams(window.location.search);
            const animeId = urlParams.get('id');
            if (animeId) {
                const animeData = await fetchAnimeDetails(animeId);
                document.getElementById('anime-details').innerHTML = createAnimeDetails(animeData);
            } else {
                document.getElementById('anime-details').innerHTML = '<p class="text-center mt-20">Anime ID is missing in the URL</p>';
            }
        }

        init();
