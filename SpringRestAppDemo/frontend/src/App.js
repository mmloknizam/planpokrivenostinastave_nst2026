import React, { useState, useEffect } from 'react';

const App = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Putanja je /api/city jer si u package.json već podesio proxy
    fetch('/api/city')
      .then(response => response.json())
      .then(data => {
        setCities(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Greška pri dohvatanju gradova:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Učitavanje...</p>;

  return (
    <div>
      <h2>Lista gradova</h2>
      <ul>
        {cities.map(city => (
          <li key={city.zipcode}>
            {city.name} ({city.zipcode})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;