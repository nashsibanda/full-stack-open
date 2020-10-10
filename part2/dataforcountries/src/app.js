import Axios from "axios";
import React, { useEffect, useState } from "react";
import CountryData from "./components/countrydata";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [countries, setCountries] = useState([]);

  const editSearchQuery = e => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (searchQuery) {
      Axios.get(`http://restcountries.eu/rest/v2/name/${searchQuery}`).then(
        response => {
          console.log(response.data);
          setCountries(response.data);
        }
      );
    }
  }, [searchQuery]);

  const selectCountry = name => {
    return () => {
      setCountries(countries.filter(country => country.name === name));
      setSearchQuery("");
    };
  };

  const clearCountryData = () => {
    setCountries([]);
    setSearchQuery("");
  };

  const clearSearchQuery = () => setSearchQuery("");

  return (
    <div>
      <h1>Find Countries</h1>
      <label>
        Search: <input value={searchQuery} onChange={editSearchQuery} />
      </label>
      {searchQuery && <button onClick={clearSearchQuery}>Clear</button>}
      {countries.length > 1 ? (
        <ul>
          {countries.length > 10 ? (
            <li>Too many matches, specify another filter</li>
          ) : (
            countries.map(({ name }) => (
              <li key={name}>
                {name} <button onClick={selectCountry(name)}>Show</button>{" "}
              </li>
            ))
          )}
        </ul>
      ) : countries.length === 1 ? (
        <>
          <button onClick={clearCountryData}>Go Back</button>
          <CountryData country={countries[0]} />
        </>
      ) : (
        <p>Please enter a search query.</p>
      )}
    </div>
  );
};

export default App;
