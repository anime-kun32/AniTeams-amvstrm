  document.getElementById('searchBar').addEventListener('input', async function () {
        const query = this.value;
        if (query.length < 1) {
            document.getElementById('suggestions').style.display = 'none';
            return;
        }
        const response = await fetch(`https://api-p1xr.vercel.app/api/v2/search?q=${query}`);
        const data = await response.json();
        const suggestions = data.results.map(item => `
            <a href="./details.html?id=${item.id}" class="suggestion-item">
                <img src="${item.coverImage.extraLarge}" alt="${item.title.userPreferred}">
                <div class="suggestion-details">
                    <div class="suggestion-title">${item.title.userPreferred}</div>
                    <div class="suggestion-jname">${item.title.native}</div>
                    <div class="suggestion-info">${item.genres.join(', ')}</div>
                    <div class="suggestion-info">${item.type} | ${item.format} | ${item.seasonYear} | ${(item.averageScore / 10).toFixed(1)}</div>
                </div>
            </a>
        `).join('');
        document.getElementById('suggestions').innerHTML = suggestions;
        document.getElementById('suggestions').style.display = 'block';
    });

    document.addEventListener('click', function(event) {
        const suggestions = document.getElementById('suggestions');
        const searchBar = document.getElementById('searchBar');
        if (!suggestions.contains(event.target) && !searchBar.contains(event.target)) {
            suggestions.style.display = 'none';
        }
    });

    const micButton = document.getElementById('micButton');
    const searchBar = document.getElementById('searchBar');
    const micPopup = document.getElementById('micPopup');
    let recognition;
    let noSoundTimeout;

    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
        recognition = new SpeechRecognition();
    }

    if (recognition) {
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        micButton.addEventListener('click', () => {
            recognition.start();
            micPopup.style.display = 'block';
            resetNoSoundTimeout();
        });

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            searchBar.value = transcript;
            searchBar.dispatchEvent(new Event('input'));
            micPopup.style.display = 'none';
        };

        recognition.onsoundstart = () => {
            resetNoSoundTimeout();
        };

        recognition.onsoundend = () => {
            startNoSoundTimeout();
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            micPopup.style.display = 'none';
        };
    } else {
        micButton.style.display = 'none';
        console.warn('Speech Recognition API not supported in this browser.');
    }

    function resetNoSoundTimeout() {
        clearTimeout(noSoundTimeout);
        noSoundTimeout = setTimeout(() => {
            recognition.stop();
            micPopup.style.display = 'none';
        }, 5000);
    }

    function startNoSoundTimeout() {
        noSoundTimeout = setTimeout(() => {
            recognition.stop();
            micPopup.style.display = 'none';
        }, 5000);
    }
