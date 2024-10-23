import React, { useState } from 'react';
import { database } from './firebase';
import { ref, get } from 'firebase/database';

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState(null);

  const handleSearch = async () => {
    const animalRef = ref(database, `animals/${searchTerm}`);
    const snapshot = await get(animalRef);

    if (snapshot.exists()) {
      setResult(snapshot.val());
    } else {
      setResult('No data found.');
    }
  };

  return (
    <div>
      <input 
        type="text" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        placeholder="Search for an animal" 
      />
      <button onClick={handleSearch}>Search</button>

      {result && <div>{JSON.stringify(result)}</div>}
    </div>
  );
};

export default SearchComponent;
