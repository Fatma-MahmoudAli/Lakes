import React from "react";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
// import { projectContext } from "../../App";
// import { getSelectedFeature } from "./helperFunctions";
import "ol/ol.css";
import { projectContext } from "../App";
import { getSelectedFeature } from "./CommenFunctions";

const LakesDataList = () => {
  const { map, features } = React.useContext(projectContext);

  const handleZooming = (name) => {
    let feature = getSelectedFeature(name, map, "featuresLayer");

    let styles = {
      Point: new Style({
        image: new CircleStyle({
          fill: new Fill({
            color: "white",
          }),
          radius: 7,
          stroke: new Stroke({ color: "red", width: 3 }),
        }),
      }),
    };

    feature?.setStyle(styles[feature?.getGeometry()?.getType()]);

    map?.getView()?.fit(feature?.getGeometry(), {
      maxZoom: 8,
      size: [100, 100],
    });

  };

  return features?.map((lake) => {
    return (
      <React.Fragment>
        <div className="list">
          <ol>
            <li
              key={lake?.properties?.id}
              onClick={() => handleZooming(lake?.properties?.Name)}
            >
              lake : {lake?.properties?.Name}
              <h6>{lake?.properties?.location}</h6>
            </li>
          </ol>
        </div>
      </React.Fragment>
    );
  });
};

export default LakesDataList;
