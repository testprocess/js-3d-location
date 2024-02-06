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
  const [isGranted, setIsGranted] = useState(false);

  const onDevicemotion = (event: any) => {
    console.log(event);
    setAcceleration({
      x: event.acceleration.x,
      y: event.acceleration.y,
      z: event.acceleration.z,
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
          }
        })
        .catch((e: any) => {
          console.error(e);
        });
    } else {
      window.addEventListener("devicemotion", onDevicemotion);
    }
  };

  useEffect(() => {}, []);
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
          <p>x: {acceleration.x}</p>
          <p>y: {acceleration.y}</p>
          <p>z: {acceleration.z}</p>
        </>
      )}
    </p>
  );
}

export default App;
