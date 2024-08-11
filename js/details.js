async function fetchAnimeDetails(id) {
    try {
        const response = await fetch(`https://api-p1xr.vercel.app/api/v2/info/${id}`); // Replace with your own deployed API
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        logError('Failed to fetch anime details: ' + error.message);
        return {}; // Return an empty object to handle the missing data gracefully
    }
}

function createAnimeDetails(data) {
    // Fallback values in case expected properties are missing
    const bannerImage = data.bannerImage || 'default-banner.jpg';
    const coverImage = data.coverImage ? data.coverImage.large : 'default-cover.jpg';
    const title = data.title?.english || data.title?.native || 'Unknown Title';
    const nativeName = data.title?.native || 'Unknown Native Name';
    const genres = data.genres ? data.genres.join(', ') : 'Unknown Genres';
    const additionalInfo = `${data.format || 'Unknown Format'} | ${data.season || 'Unknown Season'} | ${(data.score?.averageScore / 10).toFixed(1) || 'N/A'} | ${data.year || 'Unknown Year'} | ${data.episodes || 'Unknown Episodes'}`;
    const watchUrl = data.id_provider?.idGogo ? `episodes.html?id=${data.id_provider.idGogo}` : '#';
    const dubUrl = data.id_provider?.idGogoDub ? `episodes.html?id=${data.id_provider.idGogoDub}` : '#';
    const popularity = data.popularity || 'Unknown';
    const trailerId = data.trailer?.id || 'default-trailer-id';
    const trailerUrl = `https://www.youtube.com/embed/${trailerId}`;
    const trailerThumbnail = data.trailer?.thumbnail || 'default-thumbnail.jpg';

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
                    ${genres.split(', ').map(genre => `<li>${genre}</li>`).join('')}
                </ul>
            </div>
            <div class="mt-4">
                <p>${data.description || 'No description available.'}</p>
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
                <button onclick="bookmarkAnime('${data.id}', '${title}', '${coverImage}')" class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">Bookmark</button>
            </div>
            <div class="mt-4">
                <div class="relative cursor-pointer" onclick="openVideo('${trailerUrl}')">
                    <img src="${trailerThumbnail}" alt="Trailer Thumbnail" class="rounded shadow-lg">
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
    const videoFrame = document.getElementById('video-frame');
    const videoContainer = document.getElementById('video-container');
    if (videoFrame && videoContainer) {
        videoFrame.src = url;
        videoContainer.style.display = 'flex';
    } else {
        logError('Error: Video frame or container not found.');
    }
}

function closeVideo() {
    const videoFrame = document.getElementById('video-frame');
    const videoContainer = document.getElementById('video-container');
    if (videoFrame && videoContainer) {
        videoFrame.src = '';
        videoContainer.style.display = 'none';
    } else {
        logError('Error: Video frame or container not found.');
    }
}

function logError(message) {
    const animeDetailsContainer = document.getElementById('anime-details');
    if (animeDetailsContainer) {
        animeDetailsContainer.innerHTML += `<p class="text-red-500 mt-4">${message}</p>`;
    } else {
        console.error(message);
    }
}

function bookmarkAnime(id, title, coverImage) {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    bookmarks.push({ id, title, coverImage });
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    alert('Anime bookmarked!');
}

async function init() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const animeId = urlParams.get('id');
        if (!animeId) {
            throw new Error('Anime ID is missing in the URL.');
        }
        const animeData = await fetchAnimeDetails(animeId);
        document.getElementById('anime-details').innerHTML = createAnimeDetails(animeData);
    } catch (error) {
        logError(error.message);
    }
}

init();
