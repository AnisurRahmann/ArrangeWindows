// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import shell from "shelljs";

type Data = {
  name: string;
};

type Command = (params: {
  args?: Array<string>;
  flags?: Array<string>;
  kwargs?: Record<string, string>;
}) => string[];

// const buildCommand = (cmd: string): Command => {
//   return (params) => {};
// };

const parse = (line: string) => {
  const [matched, id, primary, width, height, left, top] =
    /([^\s]+) connected (primary )?([-\d]+)x([-\d]+)\+([-\d]+)\+([-\d]+) \((.*)\) (.*)/.exec(
      line
    ) ?? [];

  return !matched
    ? null
    : {
        id,
        primary: !!primary,
        width: Number(width),
        height: Number(height),
        left: Number(left),
        top: Number(top),
      };
};

const getMonitors = async () => {
  const { stdout } = shell
    .exec("xrandr")
    .grep("-v", "disconnected")
    .grep("connected");

  const parsed = stdout
    .split("\n")
    .map(parse)
    .filter((d) => !!d);
  return parsed;
};

const getWindows = async () => {
  const { stdout } = shell.exec("xdotool search --onlyvisible --name '.*'");

  const xprop = (id: string) =>
    Object.fromEntries(
      shell
        .exec(`xprop WM_CLASS WM_NAME -id ${id}`)
        .stdout.trim()
        .split("\n")
        .map((s) => s.match(/WM_(CLASS|NAME)\([^\s,]+\) = "([^\s,]*)/))
        .flatMap((v) =>
          v === null
            ? []
            : [[v[1].toLowerCase(), v[2].substr(0, v[2].length - 1)]]
        )
    );

  const xwininfo = (id: string) => {
    const [matched, width, height, left, top] =
      shell
        .exec(`xwininfo -id ${id}`)
        .grep("geometry")
        .stdout.trim()
        .replace(/--/g, "+")
        .replace(/-\+/g, "-")
        .replace(/\+-/g, "-")
        .match(/-geometry ([-\d]+)x([-\d]+)[+-]([-\d]+)[+-]([-\d]+)/) ?? [];

    return matched
      ? {
          matched,
          width: Number(width),
          height: Number(height),
          left: Number(left),
          top: Number(top),
        }
      : undefined;
  };

  const geometry = (id: string) => {
    const { stdout } = shell.exec(`xdotool getwindowgeometry ${id}`);
    const [position, left, top, screen] =
      stdout.match(/Position: ([-\d]+),([-\d]+) \(screen: (\d+)\)/) ?? [];
    const [dimension, width, height] =
      stdout.match(/Geometry: ([-\d]+)x([-\d]+)/) ?? [];

    return position && dimension
      ? {
          left: Number(left),
          top: Number(top),
          width: Number(width),
          height: Number(height),
        }
      : undefined;
  };

  const order = () => {
    return shell
      .exec("xprop -root _NET_CLIENT_LIST_STACKING")
      .stdout.match(/0x[0-9a-f]+/g)
      ?.map((h) => parseInt(h, 16));
  };

  const details = (id: string) => {
    return { id, ...xprop(id), ...geometry(id) };
  };

  const windows = stdout
    .trim()
    .split("\n")
    .map((id) => details(id))
    .filter((w) => w["class"] !== "gjs");

  return { windows, order: order() };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const [monitors, windows] = await Promise.all([getMonitors(), getWindows()]);

  res.status(200).json({ monitors, windows });
}
