import * as GMPX from '@googlemaps/extended-component-library/react';
import React, { useState, useRef, useEffect } from 'react';
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
const API_KEY = "AIzaSyB0nNFC2pkIE5Yfmg4g8M_LSrCUIGyBZqM"; // Use env variable or fallback

export default function Map() {
  const [place, setPlace] = useState(null); // Renamed to lowercase for convention
  const [perimeter, setPerimeter] = useState(""); // Single state for perimeter input
  const overlayLayoutRef = useRef(null);

  const { role } = useAuth();
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if not authenticated or not a manager
  useEffect(() => {
    if (!isAuthenticated) navigate("/signin");
    else if (role !== "manager") navigate("/clock");
  }, [isAuthenticated, role, navigate]);

  // Compute location from selected place
  const location = place?.location
    ? {
        lat: typeof place.location.lat === 'function' ? place.location.lat() : place.location.lat,
        lng: typeof place.location.lng === 'function' ? place.location.lng() : place.location.lng,
      }
    : null;

  // Validate API key
  if (!API_KEY) {
    console.error('Google Maps API Key is missing');
    return <div>Please provide a valid Google Maps API key in environment variables</div>;
  }

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!location) {
      setError("Please select a location");
      setLoading(false);
      return;
    }

    const perimeterNum = Number(perimeter);
    if (!perimeter || perimeterNum <= 0 || isNaN(perimeterNum)) {
      setError("Perimeter must be a positive number");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError("No authentication token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/api/users/location-perimeter',
        {
          lat: location.lat,
          lng: location.lng,
          perimeter: perimeterNum,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Standard Bearer format
          },
        }
      );

      const result = response.data;
      setPerimeter(""); // Reset input
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
      console.error('Error submitting location:', err);
      setError(err.response?.data?.msg || "Failed to save location. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
                console.log('Place selected:', place);
                setPlace(place);
              }}
            />

            {/* Form for perimeter input */}
            <form onSubmit={handleFormSubmit} style={{ marginTop: '10px' }}>
              <input
                type="number"
                placeholder="Perimeter (meters)"
                value={perimeter}
                onChange={(e) => setPerimeter(e.target.value)}
                style={{ padding: '6px', marginRight: '10px' }}
                disabled={loading}
                min="1"
              />
              <button
                type="submit"
                style={{ padding: '6px 12px' }}
                disabled={loading}
              >
                {loading ? "Saving..." : "Update Location"}
              </button>
            </form>

            {/* Display error if present */}
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
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
      <ToastContainer />
    </div>
  );
}