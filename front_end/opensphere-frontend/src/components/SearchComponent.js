import React, { useState } from 'react';
import axios from 'axios';

const SearchComponent = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');
    const [wikiContent, setWikiContent] = useState('');

    const handleSearch = async () => {
        if (!query) return;

        setError(''); // Clear any previous errors
        try {
            // Fetch data from DuckDuckGo
            const duckDuckGoResponse = await axios.get('https://api.duckduckgo.com/', {
                params: {
                    q: query,
                    format: 'json',
                },
            });

            if (duckDuckGoResponse.data) {
                const abstract = duckDuckGoResponse.data.AbstractText || 'No abstract available.';
                setResults([{ title: query, abstract }]);
            }

            // Fetch full Wikipedia content
            const wikiResponse = await axios.get('https://en.wikipedia.org/w/api.php', {
                params: {
                    action: 'query',
                    prop: 'extracts',
                    explaintext: true,
                    titles: query,
                    format: 'json',
                },
            });

            const wikiPages = wikiResponse.data.query.pages;
            const page = Object.values(wikiPages)[0]; // Get the first (and only) page
            if (page.extract) {
                setWikiContent(page.title + ': ' + page.extract);
            } else {
                setWikiContent('No content found.');
            }
        } catch (err) {
            setError('Error fetching data: ' + err.message);
        }
    };

    return (
        <div>
            <h2>Search Animals</h2>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter animal name"
            />
            <button onClick={handleSearch}>Search</button>
            
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <div>
                <h3>DuckDuckGo Results:</h3>
                {results.map((result, index) => (
                    <div key={index}>
                        <h4>{result.title}</h4>
                        <p>{result.abstract}</p>
                    </div>
                ))}
            </div>
            
            <div>
                <h3>Wikipedia Full Content:</h3>
                <p>{wikiContent}</p>
            </div>
        </div>
    );
};

export default SearchComponent;
