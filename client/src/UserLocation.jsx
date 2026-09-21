import React, { useState, useEffect } from "react";
import Search from "./component/Search.jsx";

function UserLocation() {
  const [position, setPosition] = useState({
    latitude: null,
    longitude: null,
  });

  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;

        setPosition({
          latitude,
          longitude,
        });

        try {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch weather.");
          }

          const data = await response.json();

          setWeather(data.current);
        } catch (err) {
          setError("Failed to fetch weather data.");
        }
      },

      (err) => {
        setError(`Error: ${err.message}`);
      }
    );
  }, []);

  const handleSearchWeather = (data) => {
    setPosition({
      latitude: data.latitude,
      longitude: data.longitude,
    });

    setCity(data.city);
    setCountry(data.country);
    setWeather(data.weather);
    setError(null);
  };

  return (
    <div className="main">

      <h2>Weather Application</h2>

      {/* Search Component */}
      <Search onWeather={handleSearchWeather} />

      {error && <p>{error}</p>}

      {/* Location */}
      {position.latitude !== null && (
        <div>
          <h3>
            {city ? `${city}, ${country}` : "Your Current Location"}
          </h3>

          <p>
            Latitude: {position.latitude}
          </p>

          <p>
            Longitude: {position.longitude}
          </p>
        </div>
      )}

      {/* Weather */}
      {weather && (
        <div>

          <h3>Current Weather</h3>

          <p>
            Temperature: {weather.temperature_2m} °C
          </p>

          <p>
            Humidity: {weather.relative_humidity_2m} %
          </p>

          <p>
            Wind Speed: {weather.wind_speed_10m} km/h
          </p>

        </div>
      )}

    </div>
  );
}

export default UserLocation;