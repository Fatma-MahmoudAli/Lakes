import { Fill, Stroke, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";

export const styleFunction = function (feature) {
  let image;
  if (feature.values_.fishName === "Tilapia") {
    image = new CircleStyle({
      fill: new Fill({
        color: "blue",
      }),
      radius: 7,
      stroke: new Stroke({ color: "white" }),
    });
  } else if (feature.values_.fishName === "Crab") {
    image = new CircleStyle({
      fill: new Fill({
        color: "orange",
      }),
      radius: 7,
      stroke: new Stroke({ color: "white" }),
    });
  } else if (feature.values_.fishName === "Oyster") {
    image = new CircleStyle({
      fill: new Fill({
        color: "#7948DB",
      }),
      radius: 7,
      stroke: new Stroke({
        color: "white",
      }),
    });
  } else {
    image = new CircleStyle({
      fill: new Fill({
        color: "#148B40",
      }),
      radius: 7,
      stroke: new Stroke({ color: "white" }),
    });
  }
  let styles = {
    Point: new Style({
      image: image,
    }),
  };
  return styles[feature?.getGeometry()?.getType()];
};

export const getLayer = (map, title) => {
  let featuresLayer = map
    ?.getAllLayers()
    ?.find((lay) => lay?.getProperties()?.title === title);
  return featuresLayer;
};

export const getSelectedFeature = (name, map, title) => {
  let feature = getLayer(map, title)
    ?.getSource()
    ?.getFeatures()
    ?.find((feat) => {
      if (feat?.values_?.Name === name) return feat;
    });
  return feature;
};
