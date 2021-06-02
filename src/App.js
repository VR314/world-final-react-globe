import React from "react";
import Globe from "react-globe.gl";
const { useState, useEffect, useRef } = React;

// TODO:
// - more error-checking and editing of the geojson files to match our known curriculum
// - remove PR, DR, Cuba, Jamaica, etc. from ancient maps
// - add good favicon
export default function World() {
  const globeEl = useRef();
  const [countries, setCountries] = useState({ features: [] });
  const [transitionDuration, setTransitionDuration] = useState(1000);
  const possibleYears = [
    0, // DONE
    1000, // DONE
    1279, // DONE
    1492, // DONE
    1650, // DONE
    1783, // DONE
    1920, // DONE
    2021,
  ];
  const [yearIndex, setYearIndex] = useState(7);
  const [year, setYear] = useState(2021);
  const [stage, setStage] = useState(0);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [items, setItems] = useState();
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  useEffect(() => {
    if (year !== 0) {
      // load map data
      fetch(`./geo/world_${year}.geojson`)
        .then((res) => res.json())
        .then((countries) => {
          // globeEl.current.pauseAnimation();
          setCountries(countries);

          setTimeout(() => {
            // globeEl.current.resumeAnimation();
            setTransitionDuration(2000);
          }, 500);
        });
    } else {
      fetch(`./geo/world_2021.geojson`)
        .then((res) => res.json())
        .then((countries) => {
          setCountries(countries);

          setTimeout(() => {
            globeEl.current.pointOfView({ lat: 45, lng: -75, altitude: 2.5 });
            setTransitionDuration(2000);
          }, 500);
        });
    }
  }, [year]);

  useEffect(() => {
    fetch(`./items.json`)
      .then((res) => res.json())
      .then((items) => {
        console.log(items);
        setItems(items);
      });
  }, []);

  useEffect(() => {
    globeEl.current.controls().autoRotate = true;
    globeEl.current.controls().autoRotateSpeed = 0.05;
  }, []);

  useEffect(() => {
    setYear(possibleYears[yearIndex]);
  }, [yearIndex]);

  //TODO: animation for changing pointOfView
  useEffect(() => {
    if (items) {
      let location = items[yearIndex].data[stage].location;
      globeEl.current.pointOfView(location);
    }
  }, [stage]);

  return (
    <>
      <div
        style={{
          display: "flex",
          color: "black",
          backgroundColor: "#000011",
          alignItems: "center",
        }}
      >
        {items && (
          <div
            style={{
              position: "relative",
              height: "90vh",
              width: "30vw",
              zIndex: 1,
              backgroundColor: "rgba(0,206,209,0.25)",
            }}
          >
            <div
              style={{
                position: "absolute",
                color: "white",
                margin: "5% 5% 5% 1.5%",
                minHeight: "100vh",
                minWidth: "100%",
                overflowY: "auto",
              }}
            >
              <h1
                style={{
                  width: "auto",
                  fontFamily: "Verdana",
                  fontSize: "1.75em",
                }}
              >
                {year !== 0 ? `The World in ${year} CE` : `Welcome!`}
              </h1>
              <p
                style={{
                  position: "absolute",
                  color: "white",
                  marginTop: 0,
                  fontFamily: "Segoe UI",
                  fontSize: "1.15em",
                  width: "auto",
                }}
              >
                {items && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: items[yearIndex].data[stage].html,
                    }}
                  ></div>
                )}
              </p>
            </div>
            {year + stage !== 0 ? (
              <button
                style={{
                  position: "absolute",
                  marginTop: "72.5vh",
                  marginLeft: "2.5vw",
                  height: "10vh",
                  width: "2.5vw",
                }}
                onClick={() => {
                  if (stage === 0) {
                    setStage(items[yearIndex - 1].data.length - 1);
                    setYearIndex(yearIndex - 1);
                  } else {
                    setStage(stage - 1);
                  }
                }}
              >
                {"<"}
              </button>
            ) : (
              <></>
            )}
            {year !== 2021 ? (
              //TODO: better button positioning
              <button
                style={{
                  position: "absolute",
                  marginTop: "72.5vh",
                  marginLeft: "22.5vw",
                  height: "10vh",
                  width: "2.5vw",
                }}
                onClick={() => {
                  if (
                    stage ===
                    items[possibleYears.indexOf(year)].data.length - 1
                  ) {
                    setStage(0);
                    setYearIndex(yearIndex + 1);
                  } else {
                    setStage(stage + 1);
                  }
                }}
              >
                {">"}
              </button>
            ) : (
              <></>
            )}
          </div>
        )}
        <Globe
          ref={globeEl}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
          polygonsData={countries.features.filter(
            (d) => d.properties.ISO_A2 !== "AQ"
          )}
          polygonCapColor={({ properties: d }) => {
            if (
              d.NAME === "unclaimed" ||
              d.NAME === "Africa" ||
              d.NAME === "undefined" ||
              d.NAME === "Unclaimed"
            ) {
              return `rgba(1,1,1, 0.9)`;
            }
            return `hsla(${~~(360 * Math.random())},${
              50 + Math.random() * 50
            },${40 + Math.random() * 40},0.9)`;
          }}
          polygonAltitude={0.005}
          polygonStrokeColor={"#FFFFFF"}
          polygonLabel={({ properties: d }) => `
        <b>${
          d.NAME === "unclaimed" ||
          d.NAME === "Africa" ||
          d.NAME === "undefined" ||
          d.NAME === "Unclaimed"
            ? ""
            : d.NAME
        }</b> 
      `}
          polygonsTransitionDuration={transitionDuration}
          height={height}
          width={width * 0.7}
        />
      </div>
    </>
  );
}
