// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import shell from "shelljs";

const setWindowPosition = async (data: {
  id: string;
  top: number;
  left: number;
}) => {
  const res = shell.exec(
    `xdotool windowmove ${data.id} ${data.left} ${data.top}`
  );
  return res;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const data = req.body.data;
    const response = await setWindowPosition(data.windowPosition);
    res.status(200).json({ response });
  }
}
