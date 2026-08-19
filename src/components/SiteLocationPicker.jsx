// ===============================================
// KV Projects ERP
// SiteLocationPicker — small interactive map for
// Add Site / Edit Site so Owner/Admin can visually
// pin a site's GPS location (click, drag the marker,
// or search a place by name) instead of typing raw
// lat/long numbers.
//
// Controlled component: latitude/longitude/radius
// come in as props, and onChange(lat, lng) fires
// whenever the marker moves (click, drag, or a search
// result is picked) so the parent form's state stays
// the single source of truth — same pattern as every
// other input on the Add/Edit Site forms.
//
// Search uses OpenStreetMap's free Nominatim geocoder
// (same tile provider already used for the map itself,
// so no new API key/service to wire up). Typing shows
// live debounced suggestions; the Search button (and
// Enter) run an immediate, non-debounced lookup so
// there's no "nothing happened" gap while waiting on
// the debounce timer.
//
// Purely a data-entry aid. It doesn't decide
// verification on its own; that's still the
// backend's job (see verifyLocation() in
// attendanceController.js) — this map just makes it
// easy to set the coordinates that check hits.
// ===============================================

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, Loader2 } from "lucide-react";

import "./LocationMap.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Fallback center when no coordinates are set yet — Coimbatore, same
// default used by AttendanceMap.jsx, just so the map opens somewhere
// sensible in India instead of the middle of the ocean (0,0).
const DEFAULT_CENTER = [11.0168, 76.9558];

const SEARCH_DEBOUNCE_MS = 450;

const SiteLocationPicker = ({ latitude, longitude, radius, onChange }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const searchTimerRef = useRef(null);
  const searchBoxRef = useRef(null);

  // Keep the latest onChange in a ref so the Leaflet event handlers
  // (attached once, inside the init effect) always call the current
  // version without needing to be re-registered on every render.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchedOnce, setSearchedOnce] = useState(false);

  const hasPoint =
    typeof latitude === "number" && typeof longitude === "number";

  // ---- Init the map once ----
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: false,
    }).setView(
      hasPoint ? [latitude, longitude] : DEFAULT_CENTER,
      hasPoint ? 16 : 12,
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(mapRef.current);

    // Click anywhere on the map to drop/move the pin.
    mapRef.current.on("click", (event) => {
      const { lat, lng } = event.latlng;
      onChangeRef.current?.(Number(lat.toFixed(6)), Number(lng.toFixed(6)));
    });

    setTimeout(() => mapRef.current?.invalidateSize(), 100);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
      circleRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Draw / update the marker + geofence circle whenever the
  // controlled lat/lng/radius props change ----
  useEffect(() => {
    if (!mapRef.current) return;

    if (!hasPoint) {
      // No coordinates set (yet) — nothing to draw.
      if (markerRef.current) {
        mapRef.current.removeLayer(markerRef.current);
        markerRef.current = null;
      }
      if (circleRef.current) {
        mapRef.current.removeLayer(circleRef.current);
        circleRef.current = null;
      }
      return;
    }

    const latLng = [latitude, longitude];
    const effectiveRadius = radius || 200;

    if (!markerRef.current) {
      markerRef.current = L.marker(latLng, { draggable: true })
        .addTo(mapRef.current)
        .bindPopup("Site location — drag to fine-tune");

      markerRef.current.on("dragend", () => {
        const pos = markerRef.current.getLatLng();
        onChangeRef.current?.(
          Number(pos.lat.toFixed(6)),
          Number(pos.lng.toFixed(6)),
        );
      });
    } else {
      markerRef.current.setLatLng(latLng);
    }

    if (!circleRef.current) {
      circleRef.current = L.circle(latLng, {
        radius: effectiveRadius,
        color: "#f97316",
        fillColor: "#f97316",
        fillOpacity: 0.1,
        weight: 1,
      }).addTo(mapRef.current);
    } else {
      circleRef.current.setLatLng(latLng);
      circleRef.current.setRadius(effectiveRadius);
    }

    mapRef.current.setView(
      latLng,
      mapRef.current.getZoom() < 14 ? 16 : mapRef.current.getZoom(),
    );
  }, [latitude, longitude, radius, hasPoint]);

  // ---- Close the results dropdown on outside click ----
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // ---- Shared fetch against OSM Nominatim ----
  const fetchPlaces = async (text) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=5&addressdetails=1&q=${encodeURIComponent(
        text,
      )}`,
    );

    if (!response.ok) {
      throw new Error(`Search failed (${response.status})`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  };

  // ---- Live debounced suggestions while typing ----
  const runDebouncedSearch = (text) => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    if (!text || text.trim().length < 3) {
      setResults([]);
      setSearching(false);
      setSearchedOnce(false);
      return;
    }

    searchTimerRef.current = setTimeout(() => {
      performSearch(text);
    }, SEARCH_DEBOUNCE_MS);
  };

  // ---- Immediate search (Search button click / Enter key) ----
  // Bypasses the debounce timer entirely so there's no lag between
  // clicking Search and something happening.
  const performSearch = async (text) => {
    const trimmed = (text || "").trim();

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    if (trimmed.length < 3) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setSearching(true);
    setShowResults(true);

    try {
      const places = await fetchPlaces(trimmed);
      setResults(places);
      setSearchedOnce(true);
    } catch (error) {
      console.warn("Location search error:", error.message);
      setResults([]);
      setSearchedOnce(true);
    } finally {
      setSearching(false);
    }
  };

  const handleQueryChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    setSearchedOnce(false);
    runDebouncedSearch(value);
  };

  const handleSearchButtonClick = () => {
    performSearch(query);
  };

  const handleSelectResult = (result) => {
    const lat = Number(Number(result.lat).toFixed(6));
    const lng = Number(Number(result.lon).toFixed(6));

    onChangeRef.current?.(lat, lng);

    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 16);
    }

    setQuery(result.display_name);
    setResults([]);
    setShowResults(false);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      // Prevent bubbling up to the surrounding <form> (Add/Edit
      // Site) — without this, Enter here would submit the whole
      // site form instead of just running the search.
      event.preventDefault();
      event.stopPropagation();
      performSearch(query);
    } else if (event.key === "Escape") {
      setShowResults(false);
    }
  };

  return (
    <div>
      <div className="site-location-search" ref={searchBoxRef}>
        <div className="site-location-search-input-wrap">
          <Search size={16} className="site-location-search-icon" />
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleSearchKeyDown}
            onFocus={() => results.length > 0 && setShowResults(true)}
            placeholder="Search a place, address, or landmark..."
            className="site-location-search-input"
          />
          {searching && (
            <Loader2 size={15} className="spin site-location-search-spinner" />
          )}
          <button
            type="button"
            className="site-location-search-btn"
            onClick={handleSearchButtonClick}
            disabled={searching || query.trim().length < 3}
          >
            Search
          </button>
        </div>

        {showResults && (
          <ul className="site-location-search-results">
            {results.length > 0 ? (
              results.map((result) => (
                <li
                  key={result.place_id}
                  onClick={() => handleSelectResult(result)}
                >
                  {result.display_name}
                </li>
              ))
            ) : searchedOnce && !searching ? (
              <li className="site-location-search-empty">
                No matching places found
              </li>
            ) : null}
          </ul>
        )}
      </div>

      <div ref={containerRef} className="location-map site-location-picker" />
      <p
        style={{
          fontSize: "12px",
          color: "var(--text-muted, #6b7280)",
          margin: "6px 0 0",
        }}
      >
        Search above, click anywhere on the map to place the pin, or drag the
        pin to fine-tune. The orange circle shows the geofence radius.
      </p>
    </div>
  );
};

export default SiteLocationPicker;
