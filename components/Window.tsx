/* eslint-disable react/display-name */
import React, { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { post } from "../pages/api";
import { WindowProps } from "../utils/type";

const Window = (props: WindowProps) => {
  const [clickedWindowId, setClickedWindowId] = useState<String | undefined>(
    undefined
  );

  const [windowHeight, setWindowHeight] = useState<Number | undefined>();
  const [windowWidth, setWindowWidth] = useState<Number | undefined>();
  const { id, name, width, height, scale, offset = { x: 0, y: 0 } } = props;

  useEffect(() => {
    setWindowHeight(height);
    setWindowWidth(width);
  }, [width, height]);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "window",
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const left = props.left + offset.x / scale;
  const top = props.top + offset.y / scale;

  return (
    <div
      ref={drag}
      style={{
        position: "absolute",
        display: "flex",
        top: `${scale * top}px`,
        left: `${scale * left}px`,
        width: `${scale * width}px`,
        height: `${scale * height}px`,
        boxSizing: "border-box",
        // border: `1px ${!isDragging ? "solid" : "dashed"} #cecece`,
        opacity: isDragging ? 0 : 1,
        background: "beige",
        zIndex: 2,
        // margin: "250px 300px",
        margin: "22% 25%",
        border: "2px solid tomato",
      }}
      className="card"
      onClick={() => {
        setClickedWindowId(id);
      }}
    >
      <header className="card-header">
        <p className="card-header-title">
          {props.class} | {name}
        </p>
      </header>
      <div className="card-content">
        <div className="content">
          {clickedWindowId === id && (
            <div className="card-content">
              <div className="field ">
                <div className="field-label is-small">
                  <label className="label is-small">Width</label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <div className="control">
                      <input
                        className="input is-small"
                        type="number"
                        value={windowWidth?.toString()}
                        onChange={(e) => {
                          setWindowWidth(parseInt(e.target.value, 10));
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="field-label is-small">
                  <label className="label is-small">Height</label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <div className="control">
                      <input
                        className="input is-small"
                        type="number"
                        value={windowHeight?.toString()}
                        onChange={(e) => {
                          setWindowHeight(parseInt(e.target.value, 10));
                        }}
                      />
                    </div>
                  </div>
                </div>
                <button
                  className="button my-1 is-small is-pulled-right"
                  onClick={async (e) => {
                    e.preventDefault();
                    const res = await post("window/windowSize", {
                      id,
                      windowWidth,
                      windowHeight,
                    });
                  }}
                >
                  Change
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Window;
