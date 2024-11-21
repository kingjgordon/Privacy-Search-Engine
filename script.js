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

        // Convert Celsius to Fahrenheit
        const temperatureFahrenheit = convertCelsiusToFahrenheit(data.main.temp);
        
        return [{
            title: `Weather in ${data.name}`,
            link: `https://openweathermap.org/city/${data.id}`,
            snippet: `Temperature: ${temperatureFahrenheit.toFixed(1)}°F, Condition: ${data.weather[0].description}.`,
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

// Convert Celsius to Fahrenheit
function convertCelsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

// Updated Function to perform a Pexels search for images
async function performPexelsSearch(query) {
    const apiKey = 'JkDws49MMVZSgKZYndc2IJSLxo5fNkya10Nc8omfzoCbXebWTsM7c6KI'; // Your Pexels API key
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=10`;

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

        return data.photos
            .filter(item => item.alt && item.alt.toLowerCase().includes(query.toLowerCase())) // Ensure alt description contains the query
            .map(item => ({
                title: item.alt || 'Image',
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
            const resultsHtml = results.map(result =>
                `<div class="result-item">
                    <a href="${result.link}" target="_blank">${result.title || result.name}</a>
                    <p>${result.snippet || result.email || 'No additional information available.'}</p>
                    ${result.icon ? `<img src="${result.icon}" alt="Weather icon">` : ''}
                    ${result.picture ? `<img src="${result.picture}" alt="${result.title}">` : ''}
                </div>`
            ).join('');
            const sectionTitle = `<h3>${source}</h3>`;
            resultsContainer.innerHTML += sectionTitle + resultsHtml;
        }
    });

    hideLoader();
    saveSearchHistory(query);
}

// Function to show the loader during search
function showLoader() {
    document.getElementById('loader').style.display = 'block';
}

// Function to hide the loader after search
function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

// Function to save search history in localStorage
function saveSearchHistory(query) {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory.push(query);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    displaySearchHistory();
}

// Function to display search history
function displaySearchHistory() {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const historyContainer = document.getElementById('searchHistory');
    historyContainer.innerHTML = `<h3>Search History</h3>`;
    searchHistory.forEach(query => {
        historyContainer.innerHTML += `<p>${query}</p>`;
    });
}

// Function to clear search results
function clearSearchResults() {
    document.getElementById('results').innerHTML = '';
    hideLoader();
}

// Function to clear search history
function clearSearchHistory() {
    localStorage.removeItem('searchHistory');
    displaySearchHistory();
}

// Display search history on page load
document.addEventListener('DOMContentLoaded', () => {
    displaySearchHistory();
});
