
document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');
    const resultsContainer = document.getElementById('results-container');
    const loadingSpinner = document.getElementById('loading-spinner');
    const micButton = document.getElementById('mic-button');
    const micPopup = document.getElementById('mic-popup');

    // Set up Speech Recognition
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US'; // Default language

    let audioInterval;

    function startListening(language) {
        recognition.lang = language;
        recognition.start();
        micPopup.classList.add('active');

        // Animate sound waves based on actual sound
        audioInterval = setInterval(() => {
            const waves = document.querySelectorAll('.wave');
            waves.forEach(wave => {
                wave.style.height = `${30 + Math.random() * 20}px`; // Random height for simulation
            });
        }, 100);
    }

    function stopListening() {
        recognition.stop();
        micPopup.classList.remove('active');
        clearInterval(audioInterval);
    }

    micButton.addEventListener('click', () => {
        if (micPopup.classList.contains('active')) {
            stopListening();
        } else {
            startListening('en-US'); // Start with English
        }
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        searchBar.value = transcript;
        searchBar.dispatchEvent(new Event('input')); // Trigger search
        stopListening();
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        stopListening();
    };

    let noSoundTimer;
    micButton.addEventListener('click', () => {
        if (micPopup.classList.contains('active')) {
            noSoundTimer = setTimeout(() => {
                stopListening();
            }, 5000); // Hide popup after 5 seconds of no sound
        }
    });

    searchBar.addEventListener('input', async () => {
        const query = searchBar.value.trim();
        if (query === '') {
            resultsContainer.innerHTML = '';
            return;
        }
        
        loadingSpinner.style.display = 'block';

        try {
            const response = await fetch(`https://api.example.com/search?query=${query}`);
            const data = await response.json();
            
            if (data.code === 200) {
                resultsContainer.innerHTML = data.results.map(result => `
                    <a href="details.html?id=${result.id}" id="card">
                        <img src="${result.coverImage.extraLarge}" alt="${result.title.userPreferred}">
                        <div class="card-info">
                            <div class="title">${result.title.userPreferred}</div>
                            <div class="genres">${result.genres.join(', ')}</div>
                            <div class="season">${result.season}</div>
                            <div class="format">${result.format}</div>
                            <div class="season-year">${result.seasonYear}</div>
                            <div class="episodes">${result.episodes} episodes</div>
                        </div>
                    </a>
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
