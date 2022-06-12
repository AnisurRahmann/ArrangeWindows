import { useEffect, useState } from "react";
import { post } from "../pages/api";
import { windowsOnSingleTile } from "../utils/tile";
import {
  MoveOrSwapWindowPropsType,
  PostDataType,
  TileType,
} from "../utils/type";

export const MoveOrSwapWindow = (props: MoveOrSwapWindowPropsType) => {
  const { data, layout, prevTile, activeWindowInfo } = props;

  const tileList = Object.values(layout).flat();
  const activeTile = tileList.find((tile: TileType) => tile.id === prevTile);

  const [tileId, setTileId] = useState<string>(activeTile?.id || "");
  const [windowAction, setWindowAction] = useState("move");

  useEffect(() => {
    if (activeTile) {
      setTileId(activeTile.id);
    }
  }, [activeTile]);

  const handleTileChange = (e: any) => {
    const value = e.target.value;
    setTileId(value);

    const selectedTile = tileList.find((tile) => tile.id.toString() === value);
    const currentTile = tileList.find((tile) => tile.id === prevTile);

    if (selectedTile && currentTile) {
      const windows = windowsOnSingleTile(data, selectedTile);
      const topWindow = windows[windows.length - 1];

      const postData: PostDataType = {
        windowId: activeWindowInfo.id,
        topWindow,
        currentTile,
        selectedTile: selectedTile,
        action: `${windowAction}Window`,
      };
      post("tile/window", postData);
    }
  };

  const handleActionChange = (e: any) => {
    const value = e.target.value;
    setWindowAction(value);
  };

  return (
    <div style={{ display: "flex", gap: 5, paddingTop: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <select
          value={windowAction}
          style={{
            height: "28px",
            border: "2px solid #4D96FF",
            color: "#54ad25",
            background: "transparent",
          }}
          onChange={(e) => handleActionChange(e)}
        >
          <option value="move">Move</option>
          <option value="swap">Swap</option>
        </select>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "120px",
            border: "2px solid #4D96FF",
          }}
        >
          {activeWindowInfo?.class ?? activeWindowInfo?.name}
        </div>
        to
      </div>
      <div>
        <select
          value={tileId}
          onChange={(e) => handleTileChange(e)}
          style={{
            height: "28px",
            border: "2px solid #4D96FF",
            color: "#54ad25",
            background: "transparent",
          }}
        >
          {tileList.map((tile: TileType, index: number) => (
            <option key={index} value={tile.id}>
              Tile {tile.id}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
