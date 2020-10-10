import Axios from "axios";
import React, { useEffect, useState } from "react";

const weatherstackApiKey = process.env.REACT_APP_WEATHER_API_KEY;

const CountryData = ({ country }) => {
  const { capital } = country;
  const [weather, setWeather] = useState({});

  useEffect(() => {
    Axios.get(
      `http://api.weatherstack.com/current?access_key=${weatherstackApiKey}&query=${capital}`
    ).then(response => {
      console.log(weatherstackApiKey);
      setWeather(response.data);
    });
  }, [capital]);

  return (
    <div>
      <h2>{country.name}</h2>
      <div className="country-data-body">
        <div>
          <h3>Data</h3>
          <table>
            <tbody>
              <tr>
                <td>Capital</td>
                <td>{country.capital}</td>
              </tr>
              <tr>
                <td>Population</td>
                <td>{country.population}</td>
              </tr>
            </tbody>
          </table>
          <h4>Languages</h4>
          <ul>
            {country.languages.map(lang => (
              <li key={lang.name}>{lang.name}</li>
            ))}
          </ul>
        </div>
        <img
          src={country.flag}
          alt={`Flag of ${country.name}`}
          className="country-flag"
        />
        {weather.current && (
          <div>
            <h3>Weather in {country.capital}</h3>
            <div className="weather-symbols">
              {weather.current.weather_icons.map((icon, index) => (
                <img
                  key={icon}
                  src={icon}
                  alt={weather.current.weather_descriptions[index]}
                />
              ))}
            </div>
            <table>
              <tbody>
                <tr>
                  <td>Temperature</td>
                  <td>{weather.current.temperature}°C</td>
                </tr>
                <tr>
                  <td>Wind</td>
                  <td>
                    {weather.current.speed}MPH, {weather.current.wind_dir}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountryData;
