// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import shell from "shelljs";
import { PostDataType, TileType } from "../../../utils/type";

const getTile = (windowId: string) => {
  shell.exec(`xdotool windowactivate ${windowId}`);
};

const toggle = (windowId: string) => {
  shell.exec(`wmctrl -ir ${windowId} -b toggle,maximized_vert,maximized_horz`);
};

const remove = (windowId: string) => {
  shell.exec(`wmctrl -ir ${windowId} -b remove,maximized_vert,maximized_horz`);
};

const resize = (windowId: string, tile: TileType) => {
  const { top, left, width, height } = tile;
  shell.exec(`wmctrl -ir ${windowId} -e 0,${left},${top},${width},${height}`);
};

const moveActiveWindow = (selectedTile: TileType, windowId: string) => {
  toggle(windowId);
  remove(windowId);
  resize(windowId, selectedTile);
};

const swapWindow = (data: PostDataType) => {
  const { selectedTile, windowId, topWindow, currentTile } = data;

  moveActiveWindow(selectedTile, windowId);
  moveActiveWindow(currentTile, topWindow.id);
};

const centerMouse = (data: PostDataType) => {
  const { center, windowId } = data;

  shell.exec(`xdotool mousemove ${center?.x} ${center?.y}`);
  getTile(windowId);
};

const moveWindowsOnTile = (data: any) => {
  data.forEach((e: any) => moveActiveWindow(e.selectedTile, e.id));
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = req.body;
  const { windowId, action, selectedTile, windowsToTileInfo } = response.data;

  if (action === "activeWindow") {
    getTile(windowId);
  }
  if (action === "moveWindow") {
    moveActiveWindow(selectedTile, windowId);
  }
  if (action === "swapWindow") {
    swapWindow(response.data);
  }

  if (action === "centerMouse") {
    centerMouse(response.data);
  }

  if (action === "setWindowsToTile") {
    moveWindowsOnTile(windowsToTileInfo);
  }

  res.status(200).json({ status: "ok" });
}
