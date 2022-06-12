import { TileProps, TileType } from "../utils/type";

export const Tile = (props: TileProps) => {
  const { tile, clickedTile } = props;
  const scale = 0.2;
  const { left, top, width, height, id } = tile;

  return (
    <>
      <div
        style={{
          zIndex: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          background: "transparent",
          border:
            clickedTile === id ? "3px solid #97DBAE" : "1px solid #4D96FF",
          width: `${scale * width}px`,
          height: `${scale * height}px`,
          top: `${scale * top}px`,
          left: `${scale * left}px`,
          margin: "22% 25%",
        }}
        data-id={id}
      >
        tile {id}
      </div>
    </>
  );
};
