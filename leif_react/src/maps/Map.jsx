import * as GMPX from '@googlemaps/extended-component-library/react';
import React, { useState, useRef,useEffect } from 'react';
import { LocationPicker } from './Place'; // Ensure this is correctly implemented
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const DEFAULT_CENTER = { lat: 23.2599, lng: 77.4126 }; // Madhya Pradesh
const DEFAULT_ZOOM = 4.5;
const DEFAULT_ZOOM_WITH_LOCATION = 16;

// Replace with your actual API key (e.g., from environment variables)

export default function Map() {
  const [Place, setPlace] = useState(undefined); // Note: Consider renaming to 'place' (lowercase) for convention
  const [inputValue, setInputValue] = useState('');
  const overlayLayoutRef = useRef(null);


  const { role } = useAuth();
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  const [locationData, setLocationData] = useState({
    perimeter: 500, // Initial value as a number
    lat: "",
    long:""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);



  // Log Place state on every render to track updates
  console.log('Current Place state:', Place);

  // Compute location with flexible handling and debugging
  const location = (() => {
    const loc = Place?.location;
    console.log('Raw location data:', loc); // Debug raw location object
    if (!loc) return null;

    // Handle both function and plain value cases for lat/lng
    const lat = typeof loc.lat === 'function' ? loc.lat() : loc.lat;
    const lng = typeof loc.lng === 'function' ? loc.lng() : loc.lng;

    if (lat && lng) {
      return { lat, lng };
    }
    return null;
  })();

  const handleButtonClick = () => {
    console.log('Button clicked, Place:', Place); // Debug on button click
    if (!Place) {
      alert('No place selected!');
      return;
    }

    try {
      const placeId = Place.id || 'No ID available';
      const name = Place.displayName?.text ?? 'Unnamed place';
      const lat = Place.location?.lat ? (typeof Place.location.lat === 'function' ? Place.location.lat() : Place.location.lat) : 'N/A';
      const lng = Place.location?.lng ? (typeof Place.location.lng === 'function' ? Place.location.lng() : Place.location.lng) : 'N/A';

      // Log individual properties
      console.log('Place ID:', placeId);
      console.log('Name:', name);
      console.log('Latitude:', lat);
      console.log('Longitude:', lng);
      console.log('Input Value:', inputValue);

      // Show alert with details
      alert(`📍 ${name}\nLat: ${lat}\nLng: ${lng}\nInput: ${inputValue}`);
    } catch (error) {
      console.error('Error processing place:', error);
      alert('Error retrieving place details');
    }
  };

  // Check if API key is present
  if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
    console.error('API Key is missing or invalid');
    return <div>Please provide a valid Google Maps API key</div>;
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const lat = Place.location?.lat ? (typeof Place.location.lat === 'function' ? Place.location.lat() : Place.location.lat) : 'N/A';
    const lng = Place.location?.lng ? (typeof Place.location.lng === 'function' ? Place.location.lng() : Place.location.lng) : 'N/A';

    if (!lat || !lng) {
      setError("Please enter a location");
      setLoading(false);
      return;
    }

    if (locationData.perimeter <= 0) {
      setError("Perimeter must be a positive number");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'https://leif-q464.vercel.app/api/users/location-perimeter',
        {lat,lng,perimeter:locationData.perimeter},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}`
          }
        }
      );

      const result = response.data;
      // Reset both fields to empty strings
      setLocationData({ perimeter: "", location: "" });
      toast.success(
        `Location perimeter set to ${result.perimeter} meters at (Lat: ${result.latitude}, Long: ${result.longitude})`,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to save location. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (!isAuthenticated) navigate("/signin");
    else if (role !== "manager") navigate("/clock");
  }, [isAuthenticated, role, navigate]);


  return (
    <div className="App">
      <GMPX.APILoader apiKey={API_KEY} />
      <GMPX.SplitLayout rowReverse rowLayoutMinWidth="700">
        <GMPX.OverlayLayout ref={overlayLayoutRef} slot="fixed">
          <div className="MainContainer" slot="main">
            <LocationPicker
              className="LocationPicker"
              forMap="gmap"
              onPlaceChange={(place) => {
                console.log('Place selected:', place); // Debug when place changes
                setPlace(place);
              }}
            />

            {/* Input and button below the picker */}
            <div style={{ marginTop: '10px' }}>
              <input
                type="text"
                placeholder="Enter some info..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{ padding: '6px', marginRight: '10px' }}
              />
              <button
                onClick={handleButtonClick}
                style={{ padding: '6px 12px' }}
              >
                Log Place Info
              </button>
            </div>
          </div>
        </GMPX.OverlayLayout>

        <gmp-map
          id="gmap"
          slot="main"
          map-id="DEMO_MAP_ID" // Replace with your actual Map ID
          center={location ?? DEFAULT_CENTER}
          zoom={location ? DEFAULT_ZOOM_WITH_LOCATION : DEFAULT_ZOOM}
          style={{ width: '100%', height: '600px' }}
        >
          {location && (
            <gmp-advanced-marker position={location}></gmp-advanced-marker>
          )}
        </gmp-map>
      </GMPX.SplitLayout>
    </div>
  );
}