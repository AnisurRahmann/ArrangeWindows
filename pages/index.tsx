import immer from "immer";
import type { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import { useDrop } from "react-dnd";
import useSWR from "swr";
import ApplyButton from "../components/buttons/ApplyButton";
import Monitor from "../components/Monitor";
import Window from "../components/Window";
import { MoveOrSwapWindow } from "../components/MoveOrSwapWindow";
import { Tile } from "../components/Tile";
import { TileButton } from "../components/buttons/TileButton";
import styles from "../styles/Home.module.css";
import { handleTileClick, layoutSamplesInfo } from "../utils/tile";
import { MonitorProps, TileType, WindowProps } from "../utils/type";
import { useActiveWindowToSetTile } from "../utils/useActiveWindowToSetTile";
import { MouseToCenter } from "../components/MouseToCenter";
import { get, post } from "./api";
import LayoutSelection from "../components/LayoutSelection";

const Home: NextPage = (props) => {
  const { data, mutate } = useSWR("hello", get, {
    refreshInterval: 200,
  });

  const [monitorPosition, setMonitorPosition] = useState<
    { id: string; top: number; left: number } | undefined
  >(undefined);

  const [windowPosition, setWindowPosition] = useState<
    { id: string; top: number; left: number } | undefined
  >(undefined);

  useEffect(() => {}, [data]);

  const scale = 0.2;

  const [firstMonitor, secondMonitor] = data?.monitors ?? [];

  const {
    width: firstMonitorWidth,
    height: firstMonitorHeight,
    left: firstMonitorLeft,
    top: firstMonitorTop,
  } = firstMonitor ?? {};

  const {
    width: secondMonitorWidth,
    height: secondMonitorHeight,
    left: secondMonitorLeft,
    top: secondMonitorTop,
  } = secondMonitor ?? {};

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ["monitor", "window"],
    hover: (item, monitor) => {
      mutate(
        immer((data) => {
          const selected = data?.monitors.find(
            (monitor: MonitorProps) => monitor.id === item.id
          );
          if (selected) {
            selected.offset = monitor.getDifferenceFromInitialOffset();
          }
        }, data)
      );
    },
    drop: (item, monitor) => {
      mutate(
        immer((data) => {
          const selected = data?.monitors.find(
            (monitor: MonitorProps) => monitor.id === item.id
          );
          if (selected) {
            selected.offset = monitor.getDifferenceFromInitialOffset();
            selected.left += selected.offset.x / scale;
            selected.top += selected.offset.y / scale;
            selected.offset = { x: 0, y: 0 };
            setMonitorPosition({
              top: selected.top,
              left: selected.left,
              id: item.id,
            });
            setWindowPosition(undefined);
          }
          const selectedWindow = data?.windows.windows.find(
            (window: WindowProps) => window.id === item.id
          );
          if (selectedWindow) {
            selectedWindow.offset = monitor.getDifferenceFromInitialOffset();
            selectedWindow.left += selectedWindow.offset.x / scale;
            selectedWindow.top += selectedWindow.offset.y / scale;
            selectedWindow.offset = { x: 0, y: 0 };
            setWindowPosition({
              top: selectedWindow.top,
              left: selectedWindow.left,
              id: item.id,
            });
            setMonitorPosition(undefined);
          }
        }, data)
      );
    },
  }));

  const firstMonitorLayoutData = useMemo(
    () => ({
      id: "m1",
      monitorLeft: firstMonitorLeft,
      monitorTop: firstMonitorTop,
      monitorWidth: firstMonitorWidth,
      monitorHeight: firstMonitorHeight,
    }),
    [firstMonitorLeft, firstMonitorTop, firstMonitorWidth, firstMonitorHeight]
  );

  const secondMonitorLayoutData = useMemo(
    () => ({
      id: "m2",
      monitorLeft: secondMonitorLeft,
      monitorTop: secondMonitorTop,
      monitorWidth: secondMonitorWidth,
      monitorHeight: secondMonitorHeight,
    }),
    [
      secondMonitorLeft,
      secondMonitorTop,
      secondMonitorWidth,
      secondMonitorHeight,
    ]
  );

  const defaultFirstMonitorTile = useMemo(
    () =>
      layoutSamplesInfo(firstMonitorLayoutData)[
        `${firstMonitorLayoutData.id}layout1`
      ]?.info,
    [firstMonitorLayoutData]
  );

  const defaultSecondMonitorTile = useMemo(
    () =>
      layoutSamplesInfo(secondMonitorLayoutData)[
        `${secondMonitorLayoutData.id}layout1`
      ]?.info,
    [secondMonitorLayoutData]
  );

  const a = useMemo(
    () => ({
      firstMonitorTile: defaultFirstMonitorTile,
      secondMonitorTile: defaultSecondMonitorTile,
    }),
    [defaultFirstMonitorTile, defaultSecondMonitorTile]
  );

  const [appliedLayout, setAppliedLayout] = useState(a);

  useEffect(() => {
    setAppliedLayout(a);
  }, [a]);

  const { clickedTile, setClickedTile, activeWindowInfo } =
    useActiveWindowToSetTile({
      data,
      appliedLayout,
    });

  return (
    <div className={styles.container}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "50px",
          marginBottom: "20px",
          gap: "20px",
        }}
      >
        <div
          ref={drop}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "90vw",
            height: "90vh",
            border: "1px solid #cecece",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              margin: "0% 25%",
              left: "0px",
              top: "5px",
            }}
          >
            <LayoutSelection
              firstMonitorLayoutData={firstMonitorLayoutData}
              secondMonitorLayoutData={secondMonitorLayoutData}
              setAppliedLayout={setAppliedLayout}
              data={data}
            />
          </div>
          <div>
            {data?.monitors.map((monitor: MonitorProps) => (
              <Monitor key={monitor.id} {...monitor} scale={scale} />
            ))}

            {data?.windows.order.map((id: string) => {
              const window = data.windows.windows.find(
                (w: WindowProps) => w.id == id
              );
              if (!window) {
              }
              return (
                window?.name &&
                window.class && (
                  <>
                    <Window key={window.id} {...window} scale={scale} />
                  </>
                )
              );
            })}
            {(monitorPosition || windowPosition) && (
              <>
                <ApplyButton
                  handleApply={async () => {
                    if (monitorPosition) {
                      const res = await post("monitor", { monitorPosition });
                      setWindowPosition(undefined);
                      setMonitorPosition(undefined);
                    }
                    if (windowPosition) {
                      const res = await post("window/windowPosition", {
                        windowPosition,
                      });
                      setWindowPosition(undefined);
                      setMonitorPosition(undefined);
                    }
                  }}
                  handleCancel={() => {
                    setMonitorPosition(undefined);
                    setWindowPosition(undefined);
                  }}
                />
              </>
            )}
            {Object.values(appliedLayout).map((tiles) =>
              tiles.map((tile, index) => (
                <Tile key={index} tile={tile} clickedTile={clickedTile} />
              ))
            )}
          </div>
          <div
            style={{
              position: "absolute",
              top: "250px",
              left: "0px",
              margin: "22% 25%",
            }}
          >
            {Object.values(appliedLayout).map((tiles, index) => (
              <div key={index} style={{ marginTop: "10px" }}>
                {tiles.map((tile: TileType, index: number) => (
                  <TileButton
                    key={index}
                    tile={tile}
                    data={data}
                    handleTileClick={() =>
                      handleTileClick({
                        data,
                        tile,
                        setClickedTile,
                        clickedTile,
                      })
                    }
                  />
                ))}
              </div>
            ))}
            <MoveOrSwapWindow
              layout={appliedLayout}
              data={data}
              prevTile={clickedTile}
              activeWindowInfo={activeWindowInfo}
            />
            <MouseToCenter activeWindow={activeWindowInfo} data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
