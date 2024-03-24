// Personal API Key for OpenWeatherMap API
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '&appid=6cba75059d83d2e44efb9a45bf56c3de&units=imperial';


const generateButton = document.getElementById('generate');
const feelings = document.getElementById('feelings');
const weatherIcon = document.querySelector(".weather-icon");

const temp = document.getElementById('temp');
const date = new Date();
const currentDate = date.toDateString();

    generateButton.addEventListener('click', (event) => {
        event.preventDefault();
        const zip = document.getElementById('zip').value;
        
        const joinedURL = `${baseUrl}${zip}${apiKey}`;

        
        getWeather(joinedURL)
        .then((data) => {
            getData(data)
            .then((info) => {
                postData("/add", info)
                .then((data) => {
                   retreiveData("/all")
                   .then((data) => {
                        updateUI(data);
                   }); 
                });
            });
        });
    });

    const getWeather = async (url) => {
        try {
            const result = await fetch(url);
            const data = await result.json();
            if(data.cod == 200){
                return data;
            }else{
                console.log(data.message);
            }
            
        }catch(error){
            console.log(error);
        }
    }

const getData = async (data) => {
    try {
            if (!data) {
                console.log("Error: No data received");
                return null;  // Or handle this case as needed
            }

            if(data.message){
                const info = data.message;
                return info;
            }else {
                const info = {
                    currentDate,
                    feelings: feelings.value,
                    city: data.name,
                    temp: Math.round(data.main.temp) + '°C',
                    status: data.weather[0].main
                };
                console.log(data);
                return info;
            }
            
    }catch(error){
        console.log(error);
    }

}

const postData = async (url = "", data = {}) => {
    try {
        const result = await fetch(url, {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return result;
    } catch (error) {
        console.log(error);
    }
}

const retreiveData = async (url) => {
    const data = await fetch(url);
    try {
        const response = await data.json();
        console.log(response);
        return response;

    }catch(error){
        console.log(error);
    }
}

const updateUI = async (data) => {
  try{
    const response = await data;
    document.getElementById('date').innerHTML = response.currentDate;
    document.getElementById('city').innerHTML = response.city;
    document.getElementById('temp').innerHTML = response.temp;
    document.getElementById('content').innerHTML = response.feelings;
    const weatherMappings = {
        "Clouds": 'clouds.png',
        "Rain": 'rain.png',
        "Snow": 'snow.png',
        "Clear": 'clear.png',
        "Drizzle": 'drizzle.png',
        "Mist": 'mist.png'
    };

    const weatherMain = response.status;
    const weatherIconPath = weatherMappings[weatherMain];

    if (weatherIconPath) {
        // Ensure that weatherIcon is defined before setting the src attribute
        if (weatherIcon) {
            weatherIcon.src = `images/${weatherIconPath}`;
        } else {
            console.log('Error: weatherIcon is undefined.');
        }
    }

  }catch(error){
    console.log("error", error);
  }
}