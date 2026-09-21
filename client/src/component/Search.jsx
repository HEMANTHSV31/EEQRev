import React, { useState } from "react";
function Search({ onWeather }) {
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchLocation = async () => {
    if (!location.trim()) {
      setError("Please enter a location.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          location
        )}&count=1&language=en&format=json`
      );

      if (!geoResponse.ok) {
        throw new Error("Failed to find location.");
      }

      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("Location not found.");
        return;
      }

      const place = geoData.results[0];

      const latitude = place.latitude;
      const longitude = place.longitude;

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`
      );

      if (!weatherResponse.ok) {
        throw new Error("Failed to fetch weather.");
      }

      const weatherData = await weatherResponse.json();

      onWeather({
        latitude,
        longitude,
        city: place.name,
        country: place.country,
        weather: weatherData.current,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search">

      <h3>Search Location</h3>

      <input
        type="text"
        placeholder="Enter city name"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            searchLocation();
          }
        }}
      />

      <button onClick={searchLocation}>
        {loading ? "Searching..." : "Search"}
      </button>

      {error && <p>{error}</p>}
    </div>
  );
}

export default Search;