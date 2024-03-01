import React, { useRef } from "react";
import "ol/ol.css";
import Overlay from "ol/Overlay";
// import LakesDataList from "./LakesData";
import { projectContext } from "../App";
import LakesDataList from "./LakesData";
// import { projectContext } from "../../App";

const PopUpData = () => {
  const { map, setPopUp } = React.useContext(projectContext);

  let mapRef = useRef();

  let containerRef = React.useRef();
  let contentRef = React.useRef();
  let closerRef = React.useRef();

  React.useEffect(() => {
    if (map) {
      map?.setTarget(mapRef?.current);

      const overlay = new Overlay({
        element: containerRef?.current,
        autoPan: {
          animation: {
            duration: 250,
          },
        },
      });
      map?.addOverlay(overlay);

      closerRef.current.onclick = function () {
        overlay?.setPosition(undefined);
        closerRef?.current?.blur();
        return false;
      };

      const popUp = map?.on("pointermove", (e) => {
        let pixel = e?.pixel;
        let feature = map?.forEachFeatureAtPixel(pixel, function (feature) {
          return feature;
        });

        if (feature) {
          contentRef.current.innerHTML = `<ul> <h5>Lake Data</h5>
          <li> <h6> <span> Name : </span> ${feature?.values_?.Name}</h6></li>
          <li> <h6> <span> City : </span> ${feature?.values_?.City}</h6></li>
          <li> <h6> <span> Total Production : </span> ${feature?.values_?.Totalproduction}</h6></li>
          <li> <h6> <span> Common Fish : </span> ${feature?.values_?.fishName}</h6></li>
          <li> <h6> <span> Fish Count : </span> ${feature?.values_?.fishCount}</h6></li>
          <li> <h6> <span> Gear : </span>${feature?.values_?.Gear}</h6></li>
        </ul>`;
          overlay?.setPosition(e?.coordinate);
        } else {
          contentRef.current.innerHTML = "";
          overlay?.setPosition(undefined);
        }
      });
      setPopUp(popUp);
    }
  }, [map]);

  return (
    <div className="row">
      <section ref={mapRef} className="col-8"></section>

      <section className="col-4" id="list">
        <h4>Lakes : </h4>
        <LakesDataList />
      </section>
      <div ref={containerRef} className="ol-popup">
        <div ref={contentRef} id="popup"></div>
        <div ref={closerRef} className="ol-popup-closer"></div>
      </div>
    </div>
  );
};
export default PopUpData;
