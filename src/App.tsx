/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";

import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { EventConnector } from "./event/EventConnector";
import { getLocation } from "./math/getLocation";
import { LineGraph } from "./components/Graph";

function App() {
  return <Motion></Motion>;
}

function Motion() {
  const [acceleration, setAcceleration] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [graphData, setGraphData] = useState<
    { x: number; y: number; z: number }[]
  >([]);
  const [velocity, setVelocity] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [location, setLocation] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const [rotation, setRotation] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [isGranted, setIsGranted] = useState(false);
  const [data, setData] = useState(new getLocation());

  const onDevicemotion = (event: any) => {
    setAcceleration({
      x: event.acceleration.x,
      y: event.acceleration.y,
      z: event.acceleration.z,
    });
  };
  const onDeviceRotation = (event: any) => {
    setRotation({
      x: event.alpha,
      y: event.beta,
      z: event.gamma,
    });
  };

  const handleButtonClick = () => {
    const DeviceOrientationEvent: any = window.DeviceOrientationEvent;
    const DeviceMotionEvent: any = window.DeviceMotionEvent;
    const isSafariOver13 =
      window.DeviceOrientationEvent !== undefined &&
      typeof DeviceOrientationEvent.requestPermission === "function";

    if (isSafariOver13) {
      DeviceMotionEvent.requestPermission()
        .then((state: any) => {
          if (state === "granted") {
            setIsGranted(true);
            window.addEventListener("devicemotion", onDevicemotion);
            window.addEventListener("deviceorientation", onDeviceRotation);
          }
        })
        .catch((e: any) => {
          console.error(e);
        });
    } else {
      window.addEventListener("devicemotion", onDevicemotion);
    }
  };

  useEffect(() => {
    const event = new EventConnector();

    event.send("value:rotation", {
      x: rotation.x,
      y: rotation.y,
      z: rotation.z,
    });
  }, [rotation]);

  useEffect(() => {
    const event = new EventConnector();

    data.setAcceleration({
      x: acceleration.x,
      y: acceleration.y,
      z: acceleration.z,
    });

    setGraphData([
      ...graphData,
      { x: acceleration.x, y: acceleration.y, z: acceleration.z },
    ]);

    data.getLocation();

    setVelocity({
      x: data.velocity.x,
      y: data.velocity.y,
      z: data.velocity.z,
    });

    setLocation({
      x: data.location.x,
      y: data.location.y,
      z: data.location.z,
    });

    event.send("value:location", {
      x: data.location.x,
      y: data.location.y,
      z: data.location.z,
    });
  }, [acceleration]);

  return (
    <>
      <div
        css={css({
          position: "absolute",
          left: 0,
          top: 0,
          display: isGranted ? "none" : "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#101012",
          height: "100vh",
          width: "100vw",
        })}
      >
        <p>
          <button
            css={css({
              backgroundColor: "#25252b",
              color: "#ffffff",
              border: "none",
              width: "100%",
              borderRadius: "0.6rem",
              padding: "0.6rem 1.4rem",
              fontSize: "0.8rem",
              fontWeight: 400,
              fontFamily: "'Noto Sans KR', sans-serif",
              transition: "0.2s",
              cursor: "pointer",
              ":hover": {
                backgroundColor: "#15151a",
              },
            })}
            onClick={handleButtonClick}
          >
            Enable
          </button>
        </p>
      </div>

      <div
        css={css({
          position: "absolute",
          left: 0,
          top: 0,
          display: isGranted ? "flex" : "none",
          justifyContent: "center",
          alignItems: "center",
        })}
      >
        <p css={css({ color: "#ffffff", fontSize: "0.6rem" })}>
          {isGranted && (
            <>
              <pre>
                acceleration:
                <p css={css({ margin: 0 })}>x: {acceleration.x.toFixed(0)}</p>
                <p css={css({ margin: 0 })}>y: {acceleration.y.toFixed(0)}</p>
                <p css={css({ margin: 0 })}>z: {acceleration.z.toFixed(0)}</p>
                <br />
                velocity:
                <p css={css({ margin: 0 })}>x: {velocity.x.toFixed(4)}</p>
                <p css={css({ margin: 0 })}>y: {velocity.y.toFixed(4)}</p>
                <p css={css({ margin: 0 })}>z: {velocity.z.toFixed(4)}</p>
                <br />
                location:
                <p css={css({ margin: 0 })}>x: {location.x.toFixed(4)}</p>
                <p css={css({ margin: 0 })}>y: {location.y.toFixed(4)}</p>
                <p css={css({ margin: 0 })}>z: {location.z.toFixed(4)}</p>
                <br />
                rotation:
                <p css={css({ margin: 0 })}>x: {rotation.x.toFixed(1)}</p>
                <p css={css({ margin: 0 })}>y: {rotation.y.toFixed(1)}</p>
                <p css={css({ margin: 0 })}>z: {rotation.z.toFixed(1)}</p>
              </pre>

              <LineGraph data={graphData}></LineGraph>
            </>
          )}
        </p>
      </div>
    </>
  );
}

export default App;
