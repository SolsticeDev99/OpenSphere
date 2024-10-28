import React, { useState } from 'react';
import axios from 'axios';
import './SearchComponentDarkTheme.css'; // Your dark theme CSS file

const SearchComponent = () => {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState('');
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!query) return;

        setError(''); // Clear previous errors
        setResult(''); // Clear previous results
        try {
            // Split the query to check for animal name and keyword
            const words = query.split(' ');
            const animalName = words.slice(0, -1).join(' ') || query; // Use entire query if there's no keyword
            const keyword = words[words.length - 1].toLowerCase(); // Last word as the keyword

            // Fetch full Wikipedia content for the animal
            const wikiResponse = await axios.get('https://en.wikipedia.org/w/api.php', {
                params: {
                    action: 'query',
                    prop: 'extracts',
                    explaintext: true,
                    titles: animalName,
                    format: 'json',
                    origin: '*', // Needed for CORS
                },
            });

            const wikiPages = wikiResponse.data.query.pages;
            if (!wikiPages) {
                throw new Error('No pages found in the response.');
            }

            const page = Object.values(wikiPages)[0]; // Get the first page

            if (page && page.extract) {
                const fullContent = page.extract;

                // If a keyword is present, check for specific keyword match
                let matchedSections = [];
                if (words.length > 1) { // Only check for keyword matches if there's more than one word
                    const sections = fullContent.split("\n\n"); // Split full content into sections
                    matchedSections = sections.filter(section => section.toLowerCase().includes(keyword));

                    // Only set result to matched sections if found
                    if (matchedSections.length > 0) {
                        setResult(`Matched Section:\n\n${matchedSections.join('\n\n')}`);
                    } else {
                        setResult(`No specific information found for the section: "${keyword}".`);
                    }
                } else {
                    // If there's no keyword, just return the full content
                    setResult(`Full Content:\n\n${fullContent}`);
                }
            } else {
                setResult('No content found for the specified animal.');
            }
        } catch (err) {
            setError('Error fetching data: ' + err.message);
            console.error(err); // Log the error for further inspection
        }
    };

    return (
        <div className="search-component">
            <h2>Search Animals</h2>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter keyword (e.g., 'Red Panda Habitat')"
            />
            <button onClick={handleSearch}>Search</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <h3>Results:</h3>
                <pre>{result}</pre>
            </div>
        </div>
    );
};

export default SearchComponent;
