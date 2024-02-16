/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";

import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

const headerStyle = css({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#101012",
  height: "100%",
  width: "100%",
});

function App() {
  return (
    <div css={headerStyle}>
      <Motion></Motion>
    </div>
  );
}

function Motion() {
  const [acceleration, setAcceleration] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
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
    const dt = 0.02;

    const x = velocity.x * dt + location.x;
    const y = velocity.y * dt + location.y;
    const z = velocity.z * dt + location.z;

    setLocation({
      x: x,
      y: y,
      z: z,
    });
  }, [velocity]);

  useEffect(() => {
    const dt = 0.02;

    const vx = Number(acceleration.x.toFixed(0)) * dt + velocity.x;
    const vy = Number(acceleration.y.toFixed(0)) * dt + velocity.y;
    const vz = Number(acceleration.z.toFixed(0)) * dt + velocity.z;

    setVelocity({
      x: vx,
      y: vy,
      z: vz,
    });
  }, [acceleration]);

  return (
    <p css={css({ color: "#ffffff" })}>
      {" "}
      {!isGranted && (
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
      )}
      {isGranted && (
        <>
          <p>acceleration:</p>
          <p>x: {acceleration.x.toFixed(0)}</p>
          <p>y: {acceleration.y.toFixed(0)}</p>
          <p>z: {acceleration.z.toFixed(0)}</p>

          <hr />
          <p>rotation:</p>

          <p>x: {rotation.x.toFixed(4)}</p>
          <p>y: {rotation.y.toFixed(4)}</p>
          <p>z: {rotation.z.toFixed(4)}</p>

          <hr />
          <p>loc:</p>

          <p>x: {location.x.toFixed(4)}</p>
          <p>y: {location.y.toFixed(4)}</p>
          <p>z: {location.z.toFixed(4)}</p>

          <hr />
          <p>vel:</p>

          <p>x: {velocity.x.toFixed(4)}</p>
          <p>y: {velocity.y.toFixed(4)}</p>
          <p>z: {velocity.z.toFixed(4)}</p>
        </>
      )}
    </p>
  );
}

export default App;
