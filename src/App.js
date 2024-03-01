import React, { createContext } from "react";
import GeoJSON from "ol/format/GeoJSON.js";
import Map from "ol/Map";
import View from "ol/View";
import XYZ from "ol/source/XYZ";
import TileLayer from "ol/layer/Tile";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Circle, Fill, Stroke, Style } from "ol/style";
// import {
//   styleFunction,
// } from "./Component/ol code/helperFunctions";
// import Charts from "./Component/ol code/Charts";
// import PopUpData from "./Component/ol code/datapopup";
import PopUpData from "./Components/DataPopUp";
import Charts from "./Components/Charts";
import "ol/ol.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { styleFunction } from "./Components/CommenFunctions";




export const projectContext = createContext();

function App() {
  const [map, setProjectMap] = React.useState();
  const [features, setFeatures] = React.useState();
  const lake = [];
  const [popUp, setPopUp] = React.useState();

  React.useEffect(() => {
    const key = "get_your_own_D6rA4zTHduk6KOKTXzGB";
    const attributions =
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
      '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

    let layer = new TileLayer({
      source: new XYZ({
        attributions: attributions,
        url: "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=" + key,
        tileSize: 512,
      }),
    });

    const projectMap = new Map({
      layers: [layer],
      target: null,
      view: new View({
        center: [3414594.9, 3209132.2],
        zoom: 5,
      }),
    });
    let highlightLayer = new VectorLayer({
      source: new VectorSource(),
      zIndex: 9999,
      style: new Style({
        image: new Circle({
          fill: new Fill({
            color: "yellow",
          }),
          radius: 10,
          stroke: new Stroke({ color: "white", width: 4 }),
        }),
      }),
    });
    highlightLayer.setProperties({ title: "HighlightLayer" });
    projectMap?.addLayer(highlightLayer);

    setProjectMap(projectMap);
  }, []);

  React.useEffect(() => {
    if (map) {
      const url = "http://localhost:8000/features";
      fetch(url)
        ?.then(function (response) {
          return response?.json();
        })
        ?.then((lakes) => {
          // convert json data to ol features
          for (var index = 0; index < lakes?.length; index++) {
            lake?.push({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [
                  lakes[index]?.geometry?.coordinates?.latitude,
                  lakes[index]?.geometry?.coordinates?.longitude,
                ],
              },
              properties: {
                Name: lakes[index]?.properties?.name,
                fishName: lakes[index]?.properties?.fish?.fishType,
                fishCount: lakes[index]?.properties?.fish?.count,
                City: lakes[index]?.properties?.City,
                Totalproduction: lakes[index]?.properties?.Totalproduction,
                Gear: lakes[index]?.properties?.Gear,
                location: lakes[index]?.properties?.location,
                id: lakes[index]?.id,
              },
            });
          }

          var geojson = {
            type: "FeatureCollection",
            crs: {
              type: "name",
              properties: {
                name: "EPSG:3857",
              },
            },
            features: lake,
          };

          const vectorSource = new VectorSource({
            features: new GeoJSON().readFeatures(geojson),
          });
          const vectorDataLayer = new VectorLayer({
            source: vectorSource,
            style: (feature) => styleFunction(feature),
          });

          map?.addLayer(vectorDataLayer);
          vectorDataLayer?.setProperties({ title: "featuresLayer" });

          setFeatures(lake);
        });
    }
  }, [map]);
  return (
    <projectContext.Provider
      value={{
        map,
        setProjectMap,
        features,
        popUp,
        setPopUp,
      }}
    >
      <div className="container-fluid ">
        <h4 style={{ textAlign: "center" }}>Egypt's lakes Dashboard</h4>
        {map && features?.length ? (
          <div>
            <div>
              <PopUpData />
            </div>
            <div>
              <Charts />
            </div>
          </div>
        ) : (
          <h6 style={{ textAlign: "center" }}>
            please upload the data using this command ' npx json-server --watch
            src/Component/data/data.json --port 8000 '
          </h6>
        )}
      </div>
    </projectContext.Provider>
  );
}

export default App;
