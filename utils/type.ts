import { Dispatch, SetStateAction } from "react";

export enum monitor {
  m1 = "m1",
  m2 = "m2",
}

export type WindowType = {
  height: number;
  id: string;
  left: number;
  name: string;
  top: number;
  width: number;
  class?: string;
};

export type TileType = {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

export type TileProps = {
  tile: TileType;
  clickedTile: string | null;
};

export type SetClickedTile = Dispatch<SetStateAction<string | null>>;
export type SetButtonDisabled = Dispatch<SetStateAction<boolean>>;

export type HandleTileClickProps = {
  data: any;
  tile: TileType;
  setClickedTile: SetClickedTile;
  setButtonDisabled?: SetButtonDisabled;
  clickedTile: string | null;
};

export type Layout = {
  firstMonitorTile: TileType[];
  secondMonitorTile: TileType[];
};

export type ActiveWindowType = {
  class: string;
  height: number;
  id: string;
  left: number;
  name: string;
  top: number;
  width: number;
};

export type TileButtonProps = {
  data: any;
  handleTileClick: Function;
  tile: TileType;
};

export type MonitorProps = {
  id: string;
  primary: boolean;
  width: number;
  height: number;
  left: number;
  top: number;
  offset?: { x: number; y: number };
  scale?: number;
};

export type WindowProps = {
  id: string;
  active?: boolean;
  width: number;
  height: number;
  left: number;
  top: number;
  offset?: { x: number; y: number };
  name?: string;
  class?: string;
  scale?: number;
};

export type ApplyButtonProps = {
  handleCancel: Function;
  handleApply: Function;
};

export type Center = {
  x: number;
  y: number;
};

export type PostDataType = {
  windowId: string;
  currentTile: TileType;
  selectedTile: TileType;
  action: string;
  topWindow: WindowType;
  center?: Center;
};

export type MoveOrSwapWindowPropsType = {
  data: any;
  layout: Layout;
  prevTile: string | null;
  activeWindowInfo: any;
};

export type MonitorInfoType = {
  id: string;
  monitorLeft: number;
  monitorTop: number;
  monitorWidth: number;
  monitorHeight: number;
};

export type SelectedLayoutType = {
  m1: { value: string };
  m2: { value: string };
};

export type LayoutSamplePropsType = {
  index: number;
  monitor: string;
  selectedLayout: SelectedLayoutType;
  setSelectedLayout: any;
};

export type LayoutSelectionProps = {
  firstMonitorLayoutData: MonitorInfoType;
  secondMonitorLayoutData: MonitorInfoType;
  setAppliedLayout: any;
  data: any;
};
