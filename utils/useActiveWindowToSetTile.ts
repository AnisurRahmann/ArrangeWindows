import { useEffect, useState } from "react";
import { Layout, ActiveWindowType, WindowType } from "./type";

export const useActiveWindowToSetTile = ({
  data,
  appliedLayout: layout,
}: {
  data: any;
  appliedLayout: Layout;
}) => {
  const initialActiveWindow = {
    class: "",
    height: 0,
    id: "",
    left: 0,
    name: "",
    top: 0,
    width: 0,
  };

  const [clickedTile, setClickedTile] = useState<string | null>(null);
  const [activeWindowInfo, setActiveWindowInfo] =
    useState<ActiveWindowType>(initialActiveWindow);

  useEffect(() => {
    if (!data) {
      return;
    }

    const tileList = Object.values(layout).flat();

    const { order, windows } = data?.windows;
    const activeWindowId = order[order.length - 1];
    const activeWindows = windows.find(
      (window: WindowType) => activeWindowId === parseInt(window.id)
    );

    setActiveWindowInfo(activeWindows);

    let { width, height, top, left } = activeWindows ?? {};

    const centerOfActiveWindow = {
      x: width / 2 + left,
      y: height / 2 + top,
    };

    const activeWindowOnTile = tileList.find(
      (tile) =>
        centerOfActiveWindow.x >= tile.left &&
        centerOfActiveWindow.x < tile.left + tile.width &&
        centerOfActiveWindow.y >= tile.top &&
        centerOfActiveWindow.y < tile.top + tile.height
    );

    setClickedTile(() => activeWindowOnTile?.id ?? null);
  }, [data, layout, activeWindowInfo]);

  return { clickedTile, setClickedTile, activeWindowInfo };
};
