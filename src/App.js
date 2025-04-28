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
        const starsData = data.map(row => ({
          name: row["Star name"],
          color: row["Color"],        // <-- bring color from Excel
          size: row["Size"],          // <-- bring size from Excel
          spinSpeed: row["Rotation Speed"], // <-- bring spin speed from Excel
          planets: [
            { name: "Planet X", info: "Mystery world." },
            { name: "Planet Y", info: "Uncharted frontier." }
          ]
        })).filter(star => star.name);
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
        <div className="back-button-container">
          <button onClick={handleBackToPlanets}>Back to Planets</button>
        </div>
      )}
      {selectedStar && !selectedPlanet && (
        <div className="back-button-container">
          <button onClick={handleBackToStars}>Back to Stars</button>
        </div>
      )}
      {selectedGalaxy && !selectedStar && !selectedPlanet && (
        <div className="back-button-container">
          <button onClick={handleBackToGalaxies}>Back to Galaxies</button>
        </div>
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
            <div key={index} className="star-card" onClick={() => handleStarClick(star)}>
            <p>{star.name}</p>
            <StarGlobe 
            color={star.color}
            size={star.size}
            spinSpeed={star.spinSpeed}
            />
            
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



export default UniverseMap;
