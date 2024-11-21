Multi-Source Privacy Search Engine
Overview
The Multi-Source Privacy Search Engine is a privacy-focused search engine that aggregates search results from multiple sources like DuckDuckGo, Pexels (for images), OpenWeatherMap (for weather queries), News API (for news articles), and RandomUser.me (for random user data). It allows users to search across multiple platforms while ensuring privacy and minimizing tracking.

Features
Privacy-Focused: Search securely across multiple platforms without compromising privacy.
Multi-Source Results: Aggregates results from multiple sources for a comprehensive search experience.
Weather Integration: Displays weather information with temperature in Fahrenheit.
Image Search: Fetches related images from Pexels.
News Search: Fetches the latest news articles related to the search query.
Search History: Stores and displays your previous searches locally in the browser.
Technologies Used
HTML5: For structuring the content and layout of the website.
CSS3: For styling the page and ensuring responsive design.
JavaScript (ES6): For handling dynamic content and API calls.
APIs:
DuckDuckGo API for search results
Pexels API for image search
OpenWeatherMap API for weather data
News API for fetching news articles
RandomUser API for generating random user data
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/kingjgordon/Privacy-Search-Engine.git
Open the project in your preferred code editor (e.g., VS Code).

Ensure you have an internet connection to make API requests, as the application depends on third-party APIs.

Open the index.html file in a browser to view the application.

API Keys
The following APIs require keys. Please add your own API keys where indicated:

Pexels API: Pexels API Docs
OpenWeatherMap API: OpenWeatherMap API Docs
News API: News API Docs
To update API keys in the code, replace the default values in script.js with your own.

Usage
Open the search engine in your browser.
Enter a search query into the search bar.
The results will display relevant information from the following categories:
Search Results: Text-based results from DuckDuckGo.
Weather Information: Current weather conditions for a given location.
Image Search: Images related to the query from Pexels.
News Articles: Latest news articles related to the search.
Random User: Randomly generated user data from RandomUser.me.
Customization
To modify the search results sources, update the script.js file where the respective API functions are called.
The layout and styling can be adjusted in the styles.css file.
Contributing
Feel free to fork this repository, contribute improvements, or report any issues. To contribute:

Fork the repository.
Create a new branch (git checkout -b feature-name).
Make your changes.
Commit the changes (git commit -am 'Add new feature').
Push to the branch (git push origin feature-name).
Create a new pull request.
License
This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgments
Thanks to DuckDuckGo, Pexels, OpenWeatherMap, News API, and RandomUser.me for their free and publicly available APIs.
Bootstrap for responsive design.
