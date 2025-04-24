import React, { useState, useEffect } from 'react';
import StarGlobe from './StarGlobe';

const UniverseMap = () => {
  const [galaxies, setGalaxies] = useState([]);
  const [stars, setStars] = useState([]);
  const [selectedGalaxy, setSelectedGalaxy] = useState(null);
  const [selectedStar, setSelectedStar] = useState(null);
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  // Fetch galaxies from the "Galaxies" sheet (column 'Name')
  useEffect(() => {
    fetch('https://opensheet.elk.sh/1FYk1q7Cp8hWEY0hXO83znlXzkgteNOpj-elpnj6TxzE/Galaxies')
      .then(res => res.json())
      .then(data => {
        const names = data.map(row => row["Galaxy name 2"]).filter(name => name);
        setGalaxies(names);
      })
      .catch(err => console.error("Failed to load galaxies:", err));
  }, []);

  // Fetch stars for the selected galaxy from its sheet
  const fetchStarsForGalaxy = (galaxyName) => {
    fetch(`https://opensheet.elk.sh/1FYk1q7Cp8hWEY0hXO83znlXzkgteNOpj-elpnj6TxzE/${encodeURIComponent(galaxyName)}`)
      .then(res => res.json())
      .then(data => {
        const names = data.map(row => row["Star name"]).filter(name => name);
        const starsData = names.map(name => ({
          name,
          planets: [
            { name: "Planet X", info: "Mystery world." },
            { name: "Planet Y", info: "Uncharted frontier." }
          ]
        }));
        setStars(starsData);
      })
      .catch(err => {
        console.error("Failed to load stars for galaxy:", galaxyName, err);
        setStars([]);
      });
  };

  const handleGalaxyClick = (galaxyName) => {
    setSelectedGalaxy(galaxyName);
    setSelectedStar(null);
    setSelectedPlanet(null);
    fetchStarsForGalaxy(galaxyName);
  };

  const handleStarClick = (star) => {
    setSelectedStar(star);
    setSelectedPlanet(null);
  };

  const handlePlanetClick = (planet) => {
    setSelectedPlanet(planet);
  };

  const handleBackToGalaxies = () => {
    setSelectedGalaxy(null);
    setSelectedStar(null);
    setSelectedPlanet(null);
  };

  const handleBackToStars = () => {
    setSelectedStar(null);
    setSelectedPlanet(null);
  };

  const handleBackToPlanets = () => {
    setSelectedPlanet(null);
  };

  return (
    <div>
      {selectedPlanet && (
        <button onClick={handleBackToPlanets}>Back to Planets</button>
      )}
      {selectedStar && !selectedPlanet && (
        <button onClick={handleBackToStars}>Back to Stars</button>
      )}
      {selectedGalaxy && !selectedStar && !selectedPlanet && (
        <button onClick={handleBackToGalaxies}>Back to Galaxies</button>
      )}

      {!selectedGalaxy && !selectedStar && !selectedPlanet && (
        <div>
          <h1>Choose a Galaxy</h1>
          {galaxies.map((galaxy, index) => (
            <button className="galaxy-orb" key={index} onClick={() => handleGalaxyClick(galaxy)}>
              {galaxy}
            </button>
          ))}
        </div>
      )}

      {selectedGalaxy && !selectedStar && !selectedPlanet && (
        <div>
          <h1>{selectedGalaxy} - Choose a Star</h1>
          {stars.map((star, index) => (
            <div key={index} onClick={() => handleStarClick(star)}>
            <StarGlobe />
              <p>{star.name}</p>
            </div>
          ))}
        </div>
      )}

      {selectedStar && !selectedPlanet && (
        <div>
          <h1>{selectedStar.name} - Choose a Planet</h1>
          {selectedStar.planets.map((planet, index) => (
            <button key={index} onClick={() => handlePlanetClick(planet)}>
              {planet.name}
            </button>
          ))}
        </div>
      )}

      {selectedPlanet && (
        <div>
          <h1>{selectedPlanet.name}</h1>
          <p>{selectedPlanet.info}</p>
        </div>
      )}
    </div>
  );
};


<StarGlobe />

export default UniverseMap;
