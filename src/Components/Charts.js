import React from "react";
import { VictoryPie } from "victory-pie";
import { VictoryBar, VictoryChart } from "victory";
// import { projectContext } from "../../App";
// import { getLayer, getSelectedFeature } from "./helperFunctions";
import { projectContext } from "../App";
import { getLayer, getSelectedFeature } from "./CommenFunctions";

function Charts() {
  const productionData = [
    { id: 1, x: "Nile River", y: 84648 },
    { id: 2, x: "Red sea", y: 43978 },
    { id: 3, x: "Mediterranean Sea", y: 73888 },
    { id: 4, x: "lakes", y: 179199 },
    { id: 5, x: "Aquaculture", y: 919585 },
  ];
  const { map, features } = React.useContext(projectContext);
  const [chartData, setChartData] = React.useState();

  React.useEffect(() => {
    if (features?.length) {
      let featuresData = features?.map((feature) => ({
        id: feature.id,
        quarter: feature.properties.Name,
        earnings: feature.properties.fishCount,
        geo: feature.geometry.coordinates,
      }));
      setChartData(featuresData);
    }
  }, [features?.length]);

  const highlightSelectedFeature = (name) => {
    let feature = getSelectedFeature(name, map, "featuresLayer");
    let highlightLayer = getLayer(map , "HighlightLayer")
    highlightLayer?.getSource()?.clear();
    let highlightedFeat = feature?.clone();
    highlightLayer?.getSource()?.addFeature(highlightedFeat);
    setTimeout(function () {
      highlightLayer?.getSource()?.clear();
    }, 2000);
  
  };


  return (
    <div className="row">
      <section style={{ height: 230 }} className="col-lg-4">
        <VictoryPie
          style={{
            data: {
              fillOpacity: 0.9,
              stroke: "white",
              strokeWidth: 1,
            },
            labels: {
              fontSize: 24,
              fill: "white",
            },
          }}
          data={productionData}
          labels={({ datum }) => `${datum.x}`}
          labelPosition={({ index }) => (index ? "centroid" : "startAngle")}
          colorScale={[
            "rgb(134, 170, 238)",
            "rgb(63, 124, 236)",
            "rgb(8, 68, 179)",
            "rgb(59, 100, 177)",
            "rgb(27, 61, 124)",
          ]}
          radius={120}
          events={[
            {
              target: "data",
              eventHandlers: {
                onMouseOver: () => {
                  return [
                    {
                      target: "data",
                      mutation: ({ style }) => {
                        return style.fill === "rgb(127, 173, 194)"
                          ? null
                          : { style: { fill: "rgb(127, 173, 194)" } };
                      },
                    },
                    {
                      target: "labels",
                      mutation: ({ datum }) => {
                        return datum === "clicked"
                          ? null
                          : { text: `${datum.x} :${datum.y}` };
                      },
                    },
                  ];
                },
                onMouseOut: () => {
                  return [
                    {
                      target: "labels",
                      mutation: ({ datum }) => {
                        return datum === "clicked"
                          ? null
                          : { text: `${datum.x}` };
                      },
                    },
                  ];
                },
              },
            },
          ]}
        />
      </section>
      <section className="col-lg-8">
        <div className="row" style={{ height: 200 }}>
          <label>Total Production</label>
          <VictoryChart domainPadding={{ x: 30 }} width={1200}>
            <VictoryBar
              data={chartData}
              labels={({ datum }) => ``}
              type={chartData?.earnings}
              x="quarter"
              y="earnings"
              style={{
                labels: { fontSize: 20, fill: "white" },
                data: { fill: "#c43a31", stroke: "white", strokeWidth: 3 },
              }}
              events={[
                {
                  target: "data",
                  eventHandlers: {
                    onMouseOver: () => {
                      return [
                        {
                          target: "labels",

                          mutation: ({ datum }) => {
                            highlightSelectedFeature(datum.quarter);
                            return datum === "clicked"
                              ? null
                              : { text: `${datum.quarter} :${datum.earnings}` };
                          },
                        },
                      ];
                    },
                    onMouseOut: () => {
                      return [
                        {
                          target: "labels",
                          mutation: () => {
                            return null;
                          },
                        },
                      ];
                    },

                    onClick: () => {
                      return [
                        {
                          target: "data",
                          mutation: (props) => {
                            const fillOpacity =
                              props.style && props.style.fillOpacity;
                            return fillOpacity === 0.7
                              ? null
                              : { style: { fill: 0.7 } };
                          },
                        },
                        {
                          target: "labels",
                          mutation: ({ datum }) => {
                            return (
                              datum === "clicked"
                                ? null
                                : { text: `${datum.earnings}` }
                            );
                          },
                        },
                      ];
                    },
                  },
                },
              ]}
            />
          </VictoryChart>
        </div>
      </section>
    </div>
  );
}

export default Charts;
