const API_KEY = "63285697c2d00f21ea6f29498a722e8d"; 

async function fetchWeather() {
    const city = document.getElementById("cityInput").value;
    if (!city) {
        alert("Please enter a city name!");
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("City not found");

        const data = await response.json();
        updateWeatherUI(data);
    } catch (error) {
        alert(error.message);
    }
}

async function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;

            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error("Unable to fetch weather");

                const data = await response.json();
                updateWeatherUI(data);
            } catch (error) {
                alert(error.message);
            }
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function updateWeatherUI(data) {
    document.getElementById("weatherResult").classList.remove("hidden");
    document.getElementById("cityName").innerText = `${data.name} (${new Date().toISOString().split("T")[0]})`;
    document.getElementById("temperature").innerText = `Temperature: ${data.main.temp}°C`;
    document.getElementById("wind").innerText = `Wind: ${data.wind.speed} M/S`;
    document.getElementById("humidity").innerText = `Humidity: ${data.main.humidity}%`;
    document.getElementById("condition").innerText = data.weather[0].main;

    fetchForecast(data.coord.lat, data.coord.lon);
}

async function fetchForecast(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Unable to fetch forecast");

        const data = await response.json();
        updateForecastUI(data.list);
    } catch (error) {
        alert(error.message);
    }
}

function updateForecastUI(forecastData) {
    const forecastDiv = document.getElementById("forecast");
    forecastDiv.innerHTML = "";

    for (let i = 0; i < forecastData.length; i += 8) {
        const item = forecastData[i];
        const date = item.dt_txt.split(" ")[0];
        const temp = item.main.temp;
        const wind = item.wind.speed;
        const humidity = item.main.humidity;
        const icon = item.weather[0].icon;

        const forecastItem = `
            <div class="bg-gray-700 p-4 rounded shadow-lg text-center">
                <p class="font-bold">${date}</p>
                <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
                <p>Temp: ${temp}°C</p>
                <p>Wind: ${wind} M/S</p>
                <p>Humidity: ${humidity}%</p>
            </div>
        `;
        forecastDiv.innerHTML += forecastItem;
    }
}
