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
    const apiKey = 'adc79596d4cb3d6f066e02c4d8299381'; // Your API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching weather results: ${response.statusText}`);
        }
        const data = await response.json();

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

// Function to perform a Cat API search
async function performCatSearch() {
    const url = `https://api.thecatapi.com/v1/images/search?limit=3`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching cat images: ${response.statusText}`);
        }
        const data = await response.json();

        return data.map(item => ({
            title: 'Cat Image',
            link: item.url,
            snippet: 'Here is a random cat for you!'
        }));
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Function to perform a Dog API search
async function performDogSearch() {
    const url = `https://dog.ceo/api/breeds/image/random/3`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching dog images: ${response.statusText}`);
        }
        const data = await response.json();

        return data.message.map(item => ({
            title: 'Dog Image',
            link: item,
            snippet: 'Here is a random dog for you!'
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
    const catResults = await performCatSearch();
    const dogResults = await performDogSearch();

    // Display results
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results

    const allResults = {
        DuckDuckGo: ddgResults,
        Weather: weatherResults,
        Cat: catResults,
        Dog: dogResults
    };

    Object.keys(allResults).forEach(source => {
        const results = allResults[source];
        if (results.length > 0) {
            const resultsHtml = results.map(result => `
                <div class="result-item">
                    <a href="${result.link}" target="_blank">${result.title}</a>
                    <p>${result.snippet || 'No additional information available.'}</p>
                    ${result.icon ? `<img src="${result.icon}" alt="Weather icon" class="result-image" />` : ''}
                    ${result.link.endsWith('.jpg') || result.link.endsWith('.png') ? `<img src="${result.link}" alt="${result.title}" class="result-image" />` : ''}
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
