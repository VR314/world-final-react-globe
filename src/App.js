import React from "react";
import Globe from "react-globe.gl";

const { useState, useEffect, useRef } = React;

export default function World() {
  const globeEl = useRef();
  const [colors, setColors] = useState([]);
  const [countries, setCountries] = useState({ features: [] });
  const [transitionDuration, setTransitionDuration] = useState(1000);
  const possibleYears = [
    /*
    400,
    600,
    800, */
    1000, 1279, 1492, 1530, 1650, 1715, 1783, 1815, 1880, 1914, 1920, 1938,
    1945, 1994, 2021,
  ];
  const [year, setYear] = useState(1492);
  const [stage, setStage] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
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
    // load map data
    fetch(`./world_${year}.geojson`)
      .then((res) => res.json())
      .then((countries) => {
        globeEl.current.pauseAnimation();
        setCountries(countries);

        setTimeout(() => {
          globeEl.current.resumeAnimation();
          setTransitionDuration(2000);
        }, 1500);
      });
  }, [year]);

  /*
  useEffect(() => {
    // TODO: change color source ?
    fetch(
      'https://raw.githubusercontent.com/corysimmons/colors.json/master/colors.json'
    )
      .then(res => res.json())
      .then(colors => {
        setColors(colors);
      });
  }, []);
*/

  useEffect(() => {
    globeEl.current.controls().autoRotate = true;
    globeEl.current.controls().autoRotateSpeed = 0.3;
  }, []);

  return (
    <>
      <div>
        <div
          style={{
            position: "absolute",
            height: "80vh",
            width: "30vw",
            zIndex: 1,
            backgroundColor: "rgba(0,206,209,0.25)",
          }}
        >
          <div
            style={{
              position: "absolute",
              color: "white",
              margin: "5% 10%",
            }}
          >
            <h1
              style={{
                width: "auto",
                fontFamily: "Verdana",
                fontSize: "1.75em",
              }}
            >{`The World in ${year}`}</h1>
            <p
              style={{
                position: "absolute",
                color: "white",
                marginTop: 0,
              }}
            >
              {"this is some sample text"}
            </p>
          </div>
          {year !== possibleYears[0] && (
            <button
              style={{
                position: "absolute",
                marginTop: "70vh",
                marginLeft: "2.5vw",
                height: "10%",
                width: "2.5vw",
              }}
              onClick={() =>
                setYear(possibleYears[possibleYears.indexOf(year) - 1])
              }
            >
              {"<"}
            </button>
          )}
          {year !== possibleYears[possibleYears.length - 1] && (
            <button
              style={{
                position: "absolute",
                marginTop: "70vh",
                marginLeft: "25vw",
                height: "10%",
                width: "2.5vw",
              }}
              onClick={() =>
                setYear(possibleYears[possibleYears.indexOf(year) + 1])
              }
            >
              {">"}
            </button>
          )}
        </div>
        <Globe
          ref={globeEl}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
          polygonsData={countries.features.filter(
            (d) => d.properties.ISO_A2 !== "AQ"
          )}
          polygonCapColor={({ properties: d }) => {
            if (colors) {
              if (
                d.NAME === "unclaimed" ||
                d.NAME === "Africa" ||
                d.NAME === "undefined"
              ) {
                return `rgba(1,1,1, 0.9)`;
              }
              return `hsla(${~~(360 * Math.random())},70%,70%,0.8)`;

              var keys = Object.keys(colors);
              let rgb = colors[keys[(keys.length * Math.random()) << 0]];
              return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.7)`;
            }
          }}
          polygonAltitude={0.005}
          polygonLabel={({ properties: d }) => `
        <b>${
          d.NAME === "unclaimed" ||
          d.NAME === "Africa" ||
          d.NAME === "undefined"
            ? ""
            : d.NAME
        }</b> 
      `}
          polygonsTransitionDuration={transitionDuration}
          height={height}
          width={width}
        />
      </div>
    </>
  );
}
