import { useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import { MMap, MMapDefaultSchemeLayer, MMapDefaultFeaturesLayer, MMapMarker, initializeMappable } from './mappable';
import type { MMapLocationRequest } from 'mappable';

// Initial map location and zoom settings
const INITIAL_LOCATION: MMapLocationRequest = {
    center: [25.229762, 55.289311],
    zoom: 9,
};

// Main React component for rendering the map and managing map interactions
export default function App() {
    const [ready, setReady] = useState(false);  // Map initialization state
    const [apiKey, setApiKey] = useState<string>('');  // API key entered by the user
    const [isApiKeySet, setIsApiKeySet] = useState(false);  // Flag indicating if API key is set
    const [location, setLocation] = useState<MMapLocationRequest>(INITIAL_LOCATION);  // Current map location
    const [searchQuery, setSearchQuery] = useState<string>('');  // Search query for suggestions
    const [suggestions, setSuggestions] = useState<any[]>([]);  // List of location suggestions
    const [error, setError] = useState<string | null>(null);  // Error messages if any

    // Check if the API key is stored in the session and initialize the map if so
    useEffect(() => {
        const checkApiKeyAndInitializeMap = async () => {
            try {
                const response = await fetch('/api/checkApiKey');
                const data = await response.json();
                if (data.apiKeyExists) {
                    setApiKey(data.apiKey);
                    setIsApiKeySet(true);
                    initializeMap();
                }
            } catch (error) {
                console.error('Error checking API key or initializing map:', error);
            }
        };
        checkApiKeyAndInitializeMap();
    }, []);

    // Dynamically load the map script and initialize map once loaded
    const initializeMap = async () => {
        const script = document.createElement('script');
        script.src = `/api/map-script`;  // Load map script from the proxy server
        script.onload = async () => {
            await initializeMappable();  // Initialize map once script loads
            setReady(true);  // Update ready state once map is ready
        };
        script.onerror = () => {
            setError('Failed to load the map script. Please check your API key.');
        };
        document.head.appendChild(script);
    };

    // Handle user API key submission, storing it in the session
    const handleApiKeySubmit = async () => {
        if (apiKey.trim() !== '') {
            try {
                const response = await fetch('/api/setApiKey', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ apiKey }),
                });

                if (response.ok) {
                    setIsApiKeySet(true);  // Mark API key as set
                    setError(null);
                    initializeMap();  // Initialize map with new API key
                } else {
                    setError('Failed to set API key. Please try again.');
                }
            } catch (error) {
                console.error('Error setting API key:', error);
                setError('Error setting API key. Please try again.');
            }
        } else {
            setError('Please enter a valid API key.');
        }
    };

    // Fetch location suggestions based on the user's search query
    const handleSearch = async (query: string) => {
        if (query.trim() === '') {
            setSuggestions([]);  // Clear suggestions if query is empty
            setSearchQuery('');
            return;
        }

        setSearchQuery(query);

        try {
            const response = await fetch('/api/suggest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });

            const data = await response.json();

            if (data && data.results) {
                setSuggestions(data.results);  // Update suggestions
            } else {
                setSuggestions([]);
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]);
        }
    };

    // Debounce search input to reduce the frequency of API calls
    const debouncedHandleSearch = debounce((query: string) => {
        handleSearch(query);
    }, 100);

    // Handle suggestion selection, setting the map location based on the selected suggestion
    const handleSuggestionClick = async (suggestion: any) => {
        if (suggestion && suggestion.uri) {
            try {
                const response = await fetch('/api/geocode', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ uri: suggestion.uri }),
                });

                const data = await response.json();

                if (
                    data &&
                    data.response &&
                    data.response.GeoObjectCollection &&
                    data.response.GeoObjectCollection.featureMember &&
                    data.response.GeoObjectCollection.featureMember.length > 0
                ) {
                    const point = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;
                    const [lng, lat] = point.split(' ').map(Number);

                    setLocation({
                        center: [lng , lat],
                        zoom: 15,
                    });

                    setSearchQuery('');  // Clear search query
                    setSuggestions([]);  // Clear suggestions
                    setReady(true);  // Ensure map is ready
                } else {
                    setError('Failed to retrieve location details. Please try again.');
                }
            } catch (error) {
                console.error('Error fetching location details:', error);
                setError('Failed to retrieve location details. Please try again.');
            }
        }
    };

    // Update map center when the map is moved
    const handleMapMove = (newCenter: [number, number]) => {
        setLocation((prevLocation) => ({
            ...prevLocation,
            center: newCenter,
        }));
    };

    // Render the API key input screen if key is not set
    if (!isApiKeySet) {
        return (
            <div style={{ textAlign: 'center', marginTop: '20%' }}>
                <h2>Please enter your API key to load the map</h2>
                <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key"
                    style={{ padding: '10px', width: '300px' }}
                />
                <br />
                <button onClick={handleApiKeySubmit} style={{ marginTop: '20px', padding: '10px 20px' }}>
                    Load Map
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        );
    }

    // Display loading indicator while the map is initializing
    if (!ready) {
        return <div>Loading...</div>;
    }

    // Render the map and search interface once everything is ready
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1000 }}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => debouncedHandleSearch(e.target.value)}
                    placeholder="Search for a location"
                    style={{ padding: '10px', width: '300px' }}
                />
                {suggestions.length > 0 && (
                    <ul
                        style={{
                            background: 'white',
                            border: '1px solid #ccc',
                            listStyleType: 'none',
                            padding: '10px',
                            margin: '5px 0',
                            width: '300px',
                            maxHeight: '150px',
                            overflowY: 'auto',
                        }}
                    >
                        {suggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                style={{
                                    padding: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                {suggestion.title.text}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <MMap
                location={location}
                onMove={(event: { center: { lat: number; lng: number } }) => {
                    const newCenter: [number, number] = [event.center.lat, event.center.lng];
                    handleMapMove(newCenter);
                }}
            >
                <MMapDefaultSchemeLayer />
                <MMapDefaultFeaturesLayer />
                {'center' in location && (
                    <MMapMarker coordinates={(location as { center: [number, number] }).center} draggable={true}>
                        <section>
                            <h1>You can drag this header</h1>
                        </section>
                    </MMapMarker>
                )}
            </MMap>
        </div>
    );
}
