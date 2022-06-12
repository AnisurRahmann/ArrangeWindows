import { post } from "../pages/api";
import { HandleTileClickProps, MonitorInfoType, TileType } from "./type";

export const windowsInfoByOrder = (data: any) => {
  const { order, windows } = data?.windows;
  return order.map((e: number) => {
    return windows.find((window: any) => e === parseInt(window.id));
  });
};

export const centerOfWindows = (data: any) => {
  return windowsInfoByOrder(data).map((e: any) => {
    return {
      id: e.id,
      x: e.width / 2 + e.left,
      y: e.height / 2 + e.top,
    };
  });
};

export const windowsOnSingleTile = (data: any, tile: TileType) => {
  const isWindowOnClickedTile = (center: {
    id: string;
    x: number;
    y: number;
  }) => {
    return (
      center.x >= tile.left &&
      center.x < tile.left + tile.width &&
      center.y >= tile.top &&
      center.y < tile.top + tile.height
    );
  };

  const windowsInSameTile = centerOfWindows(data).filter(
    (center: { id: string; x: number; y: number }) => {
      return isWindowOnClickedTile(center);
    }
  );

  const indexOfWindowsInSameTile = windowsInSameTile.map(
    (e: { id: string; x: number; y: number }) =>
      centerOfWindows(data).findIndex(
        (center: any) => JSON.stringify(center) === JSON.stringify(e)
      )
  );

  const detailsOfWindowsInSameTile = indexOfWindowsInSameTile.map((e: any) => {
    return windowsInfoByOrder(data).find(
      (window: any, index: any) => e === index
    );
  });
  return detailsOfWindowsInSameTile;
};

export const handleTileClick = async ({
  data,
  tile,
  setClickedTile,
  clickedTile,
}: HandleTileClickProps) => {
  if (!data) {
    return;
  }

  const detailsOfWindowsInSameTile = windowsOnSingleTile(data, tile);

  let activeWindow;
  if (clickedTile !== tile?.id) {
    activeWindow =
      detailsOfWindowsInSameTile[detailsOfWindowsInSameTile.length - 1];
  } else {
    // Note (Shubasish, 2022-02-09): If same tile is clicked continuously, we switch
    // the windows here from last order(first index of array. In our application,
    // window order is arranged from last index). Otherwise we can't switch all
    // windows if don't pick last order.

    activeWindow = detailsOfWindowsInSameTile[0];
  }
  setClickedTile(tile?.id);

  const postData = { windowId: activeWindow?.id, action: "activeWindow" };

  post("tile/window", postData);
};

export const layoutSamplesInfo = (monitorInfo: MonitorInfoType) => {
  const {
    id: monitorId,
    monitorLeft,
    monitorTop,
    monitorWidth,
    monitorHeight,
  } = monitorInfo;

  return {
    [`${monitorId}layout1`]: {
      info: [
        {
          id: `${monitorId}l1w1`,
          left: monitorLeft,
          top: monitorTop,
          width: monitorWidth / 2,
          height: monitorHeight,
        },
        {
          id: `${monitorId}l1w2`,
          left: monitorLeft + monitorWidth / 2,
          top: monitorTop,
          width: monitorWidth / 2,
          height: monitorHeight / 2,
        },
        {
          id: `${monitorId}l1w3`,
          left: monitorLeft + monitorWidth / 2,
          top: monitorHeight / 2,
          width: monitorWidth / 2,
          height: monitorHeight / 2,
        },
      ],
    },
    [`${monitorId}layout2`]: {
      info: [
        {
          id: `${monitorId}l2w1`,
          left: monitorLeft,
          top: monitorTop,
          width: monitorWidth,
          height: monitorHeight / 2,
        },
        {
          id: `${monitorId}l2w2`,
          left: monitorLeft,
          top: monitorHeight / 2,
          width: monitorWidth,
          height: monitorHeight / 2,
        },
      ],
    },
    [`${monitorId}layout3`]: {
      info: [
        {
          id: `${monitorId}l3w1`,
          left: monitorLeft,
          top: monitorTop,
          width: monitorWidth / 2,
          height: monitorHeight / 2,
        },
        {
          id: `${monitorId}l3w2`,
          left: monitorLeft + monitorWidth / 2,
          top: monitorTop,
          width: monitorWidth / 2,
          height: monitorHeight / 2,
        },
        {
          id: `${monitorId}l3w3`,
          left: monitorLeft,
          top: monitorHeight / 2,
          width: monitorWidth / 2,
          height: monitorHeight / 2,
        },
        {
          id: `${monitorId}l3w4`,
          left: monitorLeft + monitorWidth / 2,
          top: monitorHeight / 2,
          width: monitorWidth / 2,
          height: monitorHeight / 2,
        },
      ],
    },
  };
};
