import React, { useState } from 'react';
import axios from 'axios';

const SearchComponent = () => {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState('');
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!query) return;

        setError(''); // Clear any previous errors
        setResult(''); // Clear previous result

        try {
            // Fetch the full Wikipedia content for the specified animal
            const animal = query.split(' ')[0]; // Get the first word as the animal name
            const wikiResponse = await axios.get('https://en.wikipedia.org/w/api.php', {
                params: {
                    action: 'query',
                    prop: 'extracts',
                    explaintext: true,
                    titles: animal,
                    format: 'json',
                    origin: '*', // Allow CORS
                },
            });

            const wikiPages = wikiResponse.data.query.pages;
            const page = Object.values(wikiPages)[0]; // Get the first (and only) page

            if (page.extract) {
                const sectionData = extractSection(page.extract, query);
                setResult(sectionData);
            } else {
                setResult('No content found for this query.');
            }
        } catch (err) {
            setError('Error fetching data: ' + err.message);
        }
    };

    const extractSection = (text, keyword) => {
        const normalizedKeyword = keyword.toLowerCase();
        const sections = text.split(/\n{2,}/); // Split by two or more newlines
        const relevantSections = sections.filter(section => section.toLowerCase().includes(normalizedKeyword));

        if (relevantSections.length > 0) {
            return relevantSections.join('\n\n'); // Join multiple found sections if any
        } else {
            return 'No specific section found for this query.';
        }
    };

    return (
        <div>
            <h2>Search Animal Information</h2>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter animal topic (e.g., 'Lion Habitat')"
            />
            <button onClick={handleSearch}>Search</button>
            
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <div>
                <h3>Relevant Information:</h3>
                <p>{result}</p>
            </div>
        </div>
    );
};

export default SearchComponent;
