async function fetchAnimeDetails(id) {
            const response = await fetch(`https://api-p1xr.vercel.app/api/v2/info/${id}`); //replace with your own deployed api from amvstrm
            const data = await response.json();
            return data;
        }

        function createAnimeDetails(data) {
            const bannerImage = data.bannerImage;
            const coverImage = data.coverImage.large;
            const title = data.title.english;
            const nativeName = data.title.native;
            const genres = data.genres.join(', ');
            const additionalInfo = `${data.format} | ${data.season} | ${(data.score.averageScore / 10).toFixed(1)} | ${data.year} | ${data.episodes}`;
            const watchUrl = `episodes.html?id=${data.id_provider.idGogo}`;
            const dubUrl = `episodes.html?id=${data.id_provider.idGogoDub}`;
            const popularity = data.popularity;
            const trailerUrl = `https://www.youtube.com/embed/${data.trailer.id}`;

            document.title = title;

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
                        <p>Popularity: ${popularity}</p>
                    </div>
                    <div class="mt-4">
                        <a href="${watchUrl}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Watch Now</a>
                    </div>
                    <div class="mt-4">
                        <a href="${dubUrl}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Dub</a>
                    </div>
                    <div class="mt-4">
                        <div class="relative cursor-pointer" onclick="openVideo('${trailerUrl}')">
                            <img src="${data.trailer.thumbnail}" alt="Trailer Thumbnail" class="rounded shadow-lg">
                            <div class="absolute inset-0 flex items-center justify-center">
                                <svg class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4.5 3.5v13l11-6.5-11-6.5z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        function openVideo(url) {
            document.getElementById('video-frame').src = url;
            document.getElementById('video-container').style.display = 'flex';
        }

        function closeVideo() {
            document.getElementById('video-frame').src = '';
            document.getElementById('video-container').style.display = 'none';
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
