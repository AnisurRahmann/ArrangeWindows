// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import shell from "shelljs";

const setMonitorPosition = async (data: {
  id: string;
  top: number;
  left: number;
}) => {
  const { stdout } = shell.exec(
    `xrandr --output ${data.id} --pos ${data.left}x${data.top}`
  );
  return stdout;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const data = req.body.data;
    const response = await setMonitorPosition(data.monitorPosition);
    res.status(200).json({ status: "ok" });
  }
}
