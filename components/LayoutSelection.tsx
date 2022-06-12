import React from "react";
import { useState } from "react";
import { post } from "../pages/api";
import { layoutSamplesInfo, centerOfWindows } from "../utils/tile";
import { monitor, LayoutSelectionProps } from "../utils/type";
import LayoutSamples from "./LayoutSamples";

const LayoutSelection = (props: LayoutSelectionProps) => {
  const {
    firstMonitorLayoutData,
    secondMonitorLayoutData,
    setAppliedLayout,
    data,
  } = props;
  const [selectedLayout, setSelectedLayout] = useState({
    m1: { value: "" },
    m2: { value: "" },
  });
  const numberOfLayout = 3;

  const handleSelectedLayout = () => {
    const layout = {
      firstMonitorTile: layoutSamplesInfo(firstMonitorLayoutData)[
        selectedLayout[firstMonitorLayoutData.id as monitor].value
      ].info,
      secondMonitorTile: layoutSamplesInfo(secondMonitorLayoutData)[
        selectedLayout[secondMonitorLayoutData.id as monitor].value
      ].info,
    };

    setAppliedLayout(layout);

    const allTiles = Object.values(layout).flat();

    let moveWindowsOnTile: any = [];
    allTiles.map((tile: any) => {
      const centerOfWindowsOnTile = centerOfWindows(data).filter(
        (center: any) =>
          center.x >= tile.left &&
          center.x < tile.left + tile.width &&
          center.y >= tile.top &&
          center.y < tile.top + tile.height
      );

      centerOfWindowsOnTile.length > 0 &&
        centerOfWindowsOnTile.forEach((c: any) => {
          moveWindowsOnTile.push({ id: c.id, selectedTile: tile });
        });
      return moveWindowsOnTile;
    });

    const postData = {
      windowsToTileInfo: moveWindowsOnTile,
      action: "setWindowsToTile",
    };

    post("tile/window", postData);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
        }}
      >
        <div
          style={{
            width: "50%",
            border: "5px solid #4D96FF",
            padding: "10px",
          }}
        >
          <p>Monitor 1</p>
          <div style={{ display: "flex", gap: 15, marginTop: 10 }}>
            {[...Array(numberOfLayout)].map((_, index) => (
              <LayoutSamples
                key={index}
                index={index}
                selectedLayout={selectedLayout}
                setSelectedLayout={setSelectedLayout}
                monitor={firstMonitorLayoutData.id}
              />
            ))}
          </div>
        </div>
        <div
          style={{
            width: "50%",
            border: "5px solid #4D96FF",
            padding: "10px",
          }}
        >
          <p>Monitor 2</p>
          <div style={{ display: "flex", gap: 15, marginTop: 10 }}>
            {[...Array(numberOfLayout)].map((_, index) => (
              <LayoutSamples
                key={index}
                index={index}
                selectedLayout={selectedLayout}
                setSelectedLayout={setSelectedLayout}
                monitor={secondMonitorLayoutData.id}
              />
            ))}
          </div>
        </div>
      </div>
      <div style={{ textAlign: "end" }}>
        <button
          style={{
            background: "#54ad25",
            cursor: "pointer",
            color: "aliceblue",
            border: "2px solid",
            fontSize: "100%",

            width: "22%",

            height: "42px",
            borderRadius: "20px",
          }}
          onClick={() => handleSelectedLayout()}
        >
          Apply Layout
        </button>
      </div>
    </>
  );
};

export default LayoutSelection;
