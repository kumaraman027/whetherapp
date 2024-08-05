const express = require("express");
const path = require("path");
const fetch = require("node-fetch"); // Include node-fetch
const app = express();
const PORT = 3000;
// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));
// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ind.html'));
});
// Route to fetch weather data    
app.get('/weather', async (req, res) => {
  const { city } = req.query;
  const apik = "3045dd712ffe6e702e3245525ac7fa38";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apik}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok){ 
      throw new Error('City not found');
    }
    const data = await response.json();
    const nameval = data.name;
    const descrip = data.weather[0].description;
    const temperature = convertion(data.main.temp);
    const windSpeed = data.wind.speed;
    const weatherInfo = {
      city: nameval,
      description: descrip,
      temperature: temperature,
      windSpeed: windSpeed
    };
    res.json(weatherInfo);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'City not found' });
  }
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// Function to convert temperature from Kelvin to Celsius
function convertion(val) {
  return (val - 273.15).toFixed(2);
}
