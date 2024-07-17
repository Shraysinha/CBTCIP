const apiKey = 'f38839830783b735341ef32b78a38659';  


const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur',
    'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara',
    'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivli', 'Vasai-Virar', 'Varanasi',
    'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad', 'Ranchi', 'Haora', 'Coimbatore', 'Jabalpur',
    'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur', 'Kota', 'Guwahati', 'Chandigarh', 'Solapur', 'Hubli-Dharwad',
    'Bareilly', 'Moradabad', 'Mysore', 'Gurgaon', 'Aligarh', 'Jalandhar', 'Tiruchirappalli', 'Bhubaneswar', 'Salem', 'Warangal',
    'Guntur', 'Bhiwandi', 'Saharanpur', 'Gorakhpur', 'Bikaner', 'Amravati', 'Noida', 'Jamshedpur', 'Bhilai', 'Cuttack', 'Firozabad',
    'Kochi', 'Nellore', 'Bhavnagar', 'Dehradun', 'Durgapur', 'Asansol', 'Rourkela', 'Nanded', 'Kolhapur', 'Ajmer', 'Akola', 'Gulbarga',
    'Jamnagar', 'Ujjain', 'Loni', 'Siliguri', 'Jhansi', 'Ulhasnagar', 'Nangi', 'Ambattur', 'Tirunelveli', 'Malegaon', 'Gaya', 'Jalgaon',
    'Udaipur', 'Maheshtala', 'Tirupur', 'Davanagere', 'Kozhikode', 'Akbarpur', 'Bilaspur', 'Shahjahanpur', 'Kurnool', 'Tiruvottiyur',
    'Mathura', 'Patiala', 'Satna', 'Sagar', 'Bijapur', 'Shambajinagar', 'Junagadh', 'Thrissur', 'Alwar', 'Barddhaman', 'Kulti', 'Kakinada',
    'Nizamabad', 'Parbhani', 'Tumkur', 'Khammam', 'Ozhukarai', 'Bihar Sharif', 'Panipat', 'Darbhanga', 'Bally', 'Aizawl', 'Dewas', 'Ichalkaranji',
    'Karnal', 'Bathinda', 'Jalna', 'Eluru', 'Barasat', 'Kirari Suleman Nagar', 'Purnia', 'Satara', 'Mau', 'Sonipat', 'Farrukhabad', 'Sagar', 'Rourkela',
    'Durg', 'Imphal', 'Ratlam', 'Hapur', 'Anantapur', 'Arrah', 'Karimnagar', 'Etawah', 'Ambarnath', 'North Dumdum', 'Bharatpur', 'Begusarai', 'New Delhi'
];


let recentSearches = [];


function initializeApp() {
    document.getElementById('get-weather-btn').addEventListener('click', handleWeatherSearch);
    document.getElementById('city-input').addEventListener('keydown', handleKeyPress);
    document.getElementById('city-input').addEventListener('input', showAutocompleteSuggestions);
}


async function handleWeatherSearch() {
    const city = document.getElementById('city-input').value.trim();
    if (city) {
        toggleLoader(true);
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.cod === 200) {
                displayWeather(data);
                changeBackground(data.weather[0].main);
                addToRecentSearches(data);
            } else {
                alert('City not found!');
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
            alert('City not found or an error occurred while fetching weather data!');
        } finally {
            toggleLoader(false);
        }
    } else {
        alert('Please enter a city name!');
    }
}


function handleKeyPress(event) {
    if (event.key === 'Enter') {
        handleWeatherSearch();
    } else if (event.key === 'Tab') {
        handleAutocomplete(event);
    }
}


function handleAutocomplete(event) {
    event.preventDefault(); 
    const cityInput = document.getElementById('city-input');
    const inputValue = cityInput.value.trim().toLowerCase();
    const matchingCities = cities.filter(city => city.toLowerCase().startsWith(inputValue));
    if (matchingCities.length > 0) {
        cityInput.value = matchingCities[0]; 
    }
}


function showAutocompleteSuggestions(event) {
    const inputValue = event.target.value.trim().toLowerCase();
    const matchingCities = cities.filter(city => city.toLowerCase().startsWith(inputValue));
    const autocompleteList = document.getElementById('autocomplete-list');
    autocompleteList.innerHTML = '';
    if (matchingCities.length > 0) {
        matchingCities.forEach(city => {
            const li = document.createElement('li');
            li.textContent = city;
            li.addEventListener('click', () => {
                document.getElementById('city-input').value = city;
                autocompleteList.classList.add('hidden');
            });
            autocompleteList.appendChild(li);
        });
        autocompleteList.classList.remove('hidden');
    } else {
        autocompleteList.classList.add('hidden');
    }
}


function displayWeather(data) {
    document.getElementById('city-name').textContent = data.name;
    document.getElementById('temperature').textContent = `Temperature: ${data.main.temp}°C`;
    document.getElementById('weather-description').textContent = data.weather[0].description;
    document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `Wind Speed: ${data.wind.speed} m/s`;
    document.getElementById('pressure').textContent = `Pressure: ${data.main.pressure} hPa`;
    document.getElementById('weather-details').classList.remove('hidden');
    document.getElementById('additional-weather-details').classList.remove('hidden');
}


function changeBackground(weatherType) {
    let backgroundImageUrl;
    switch (weatherType.toLowerCase()) {
        case 'thunderstorm':
            backgroundImageUrl = 'images/thunderstorm.jpg';
            break;
        case 'drizzle':
        case 'rain':
            backgroundImageUrl = 'images/rain.jpg';
            break;
        case 'snow':
            backgroundImageUrl = 'images/snow.jpg';
            break;
        case 'clear':
            backgroundImageUrl = 'images/clear.jpg';
            break;
        case 'clouds':
            backgroundImageUrl = 'images/clouds.jpg';
            break;
        default:
            backgroundImageUrl = 'images/default.jpg';
            break;
    }
    document.body.style.backgroundImage = `url(${backgroundImageUrl})`;
}


function addToRecentSearches(data) {
    const recentSearchesContainer = document.getElementById('recent-searches-container');
    const searchItem = document.createElement('div');
    searchItem.className = 'search-item';
    const weatherType = data.weather[0].main.toLowerCase();
    let backgroundImageUrl;

    switch (weatherType) {
        case 'thunderstorm':
            backgroundImageUrl = 'images/thunderstorm.jpg';
            break;
        case 'drizzle':
        case 'rain':
            backgroundImageUrl = 'images/rain.jpg';
            break;
        case 'snow':
            backgroundImageUrl = 'images/snow.jpg';
            break;
        case 'clear':
            backgroundImageUrl = 'images/clear.jpg';
            break;
        case 'clouds':
            backgroundImageUrl = 'images/clouds.jpg';
            break;
        default:
            backgroundImageUrl = 'images/default.jpg';
            break;
    }

    searchItem.style.backgroundImage = `url(${backgroundImageUrl})`;
    searchItem.innerHTML = `
        <h3>${data.name}</h3>
        <p>${data.main.temp}°C</p>
        <p>${data.weather[0].description}</p>
    `;

    const isDuplicate = recentSearches.some(search => search.name === data.name);

    if (!isDuplicate) {
        recentSearches.unshift(data);
        recentSearchesContainer.prepend(searchItem);
        if (recentSearches.length > 3) {
            recentSearches.pop();
            recentSearchesContainer.removeChild(recentSearchesContainer.lastChild);
        }
    }
}


function toggleLoader(show) {
    const loader = document.getElementById('loader');
    if (show) {
        loader.classList.remove('hidden');
    } else {
        loader.classList.add('hidden');
    }
}


initializeApp();
