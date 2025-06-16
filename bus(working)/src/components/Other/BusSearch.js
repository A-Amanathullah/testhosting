import React, { useState } from "react";
import axios from "axios";

const BusSearch = () => {
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Coordinates of route points (Kalmunai -> Batticaloa -> Polonnaruwa -> Colombo)
  const routeCoordinates = [
    { lat: 6.883, lon: 81.821 }, // Kalmunai
    { lat: 7.7, lon: 81.5 }, // Batticaloa
    { lat: 7.5, lon: 81.0 }, // Polonnaruwa
    { lat: 6.9, lon: 79.9 }, // Colombo
  ];

  const fetchVillages = async () => {
    setLoading(true);
    try {
      let allVillages = [];
      for (const { lat, lon } of routeCoordinates) {
        const query = `
          [out:json];
          node["place"~"village|town|city"](around:10000, ${lat}, ${lon});  // Querying villages within 10km of the coordinates
          out body;
        `;
        console.log("Querying for coordinates:", lat, lon);
        console.log("Overpass Query:", query);
        
        const res = await axios.post(
          "https://overpass-api.de/api/interpreter",
          query,
          { headers: { "Content-Type": "text/plain" } }
        );

        console.log("Overpass Response:", res.data);

        const placeNames = res.data.elements
          .map((el) => el.tags?.name)
          .filter(Boolean);

        console.log("Fetched Villages:", placeNames);
        
        allVillages = [...allVillages, ...placeNames];
      }
      
      // Remove duplicates
      const uniqueVillages = [...new Set(allVillages)];
      setVillages(uniqueVillages);

      // Save as JSON file
      saveAsJson(uniqueVillages);
    } catch (error) {
      console.error("Error fetching villages:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveAsJson = (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "villages.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <button onClick={fetchVillages} disabled={loading}>
        {loading ? "Loading..." : "Get Villages"}
      </button>
      <ul>
        {villages.map((v, i) => (
          <li key={i}>{v}</li>
        ))}
      </ul>
    </div>
  );
};

export default BusSearch;
