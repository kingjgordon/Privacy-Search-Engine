// Function to perform a DuckDuckGo search
async function performDuckDuckGoSearch(query) {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching DuckDuckGo results: ${response.statusText}`);
        }
        const data = await response.json();
        return data.RelatedTopics.map(item => ({
            title: item.Text || 'No Title',
            link: item.FirstURL || '#',
            snippet: item.FirstURL ? `Learn more about ${item.Text}` : ''
        }));
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Function to perform an OpenWeatherMap search
async function performWeatherSearch(query) {
    const apiKey = 'adc79596d4cb3d6f066e02c4d8299381'; // Your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching weather results: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.cod !== 200) {
            throw new Error(`Weather not found: ${data.message}`);
        }
        return [{
            title: `Weather in ${data.name}`,
            link: `https://openweathermap.org/city/${data.id}`,
            snippet: `Temperature: ${data.main.temp}°C, Condition: ${data.weather[0].description}.`,
            icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}.png` // Weather icon
        }];
    } catch (error) {
        console.error(error);
        return [{
            title: 'Weather Not Available',
            link: '#',
            snippet: 'Could not fetch weather data for this location.'
        }];
    }
}

// Function to perform a Pexels search for images
async function performPexelsSearch(query) {
    const apiKey = 'JkDws49MMVZSgKZYndc2IJSLxo5fNkya10Nc8omfzoCbXebWTsM7c6KI'; // Your Pexels API key
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5`;

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: apiKey
            }
        });
        if (!response.ok) {
            throw new Error(`Error fetching Pexels images: ${response.statusText}`);
        }
        const data = await response.json();
        return data.photos.map(item => ({
            title: item.alt_description || 'Image',
            link: item.url,
            snippet: 'Related image from Pexels.',
            picture: item.src.medium // Use the medium size image
        }));
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Function to perform a News API search
async function performNewsSearch(query) {
    const apiKey = '84086ac217184b93ae34a9151618ffd8'; // Your News API key
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching news results: ${response.statusText}`);
        }
        const data = await response.json();
        return data.articles.map(item => ({
            title: item.title,
            link: item.url,
            snippet: item.description
        }));
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Function to fetch random user data
async function performRandomUserSearch() {
    const url = `https://randomuser.me/api/`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching random user data: ${response.statusText}`);
        }
        const data = await response.json();
        return data.results.map(user => ({
            name: `${user.name.first} ${user.name.last}`,
            email: user.email,
            picture: user.picture.large,
            link: `https://randomuser.me/?id=${user.login.uuid}` // Link to the user's profile
        }));
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Function to handle search form submission
async function handleSearch(event) {
    event.preventDefault(); // Prevent form submission
    const query = document.getElementById('searchQuery').value;
    showLoader();

    // Perform searches
    const ddgResults = await performDuckDuckGoSearch(query);
    const weatherResults = await performWeatherSearch(query);
    const pexelsResults = await performPexelsSearch(query);
    const newsResults = await performNewsSearch(query);
    const randomUserResults = await performRandomUserSearch();

    // Display results
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results

    const allResults = {
        DuckDuckGo: ddgResults,
        Weather: weatherResults,
        Images: pexelsResults,
        News: newsResults,
        RandomUser: randomUserResults
    };

    Object.keys(allResults).forEach(source => {
        const results = allResults[source];
        if (results.length > 0) {
            const resultsHtml = results.map(result => `
                <div class="result-item">
                    <a href="${result.link}" target="_blank">${result.title || result.name}</a>
                    <p>${result.snippet || result.email || 'No additional information available.'}</p>
                    ${result.icon ? `<img src="${result.icon}" alt="Weather icon" class="result-image" />` : ''}
                    ${result.picture ? `<img src="${result.picture}" alt="${result.name}" class="result-image" />` : ''}
                </div>`).join('');
            resultsContainer.innerHTML += `<h2>${source} Results:</h2><div class="results-list">${resultsHtml}</div>`;
        } else {
            resultsContainer.innerHTML += `<h2>${source} Results:</h2><p>No results found.</p>`;
        }
    });

    hideLoader();
    saveSearchHistory(query);
}

// Function to save search history
function saveSearchHistory(query) {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!history.includes(query)) {
        history.push(query);
        localStorage.setItem('searchHistory', JSON.stringify(history));
    }
}

// Function to display search history
function displaySearchHistory() {
    const historyContainer = document.getElementById('searchHistory');
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (history.length > 0) {
        historyContainer.innerHTML = `<h2>Search History:</h2><ul>${history.map(query => `<li>${query}</li>`).join('')}</ul>`;
    } else {
        historyContainer.innerHTML = '<h2>No search history found.</h2>';
    }
}

// Function to show the loading spinner
function showLoader() {
    document.getElementById('loader').style.display = 'block';
}

// Function to hide the loading spinner
function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

// Call displaySearchHistory on page load
document.addEventListener('DOMContentLoaded', displaySearchHistory);
