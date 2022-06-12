// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import shell from "shelljs";

const setWindowSize = async (data: {
  id: string;
  windowWidth: number;
  windowHeight: number;
}) => {
  const res = shell.exec(
    `xdotool windowsize ${data.id} ${data.windowWidth} ${data.windowHeight}`
  );
  return res;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const data = req.body.data;
    const response = await setWindowSize(data);
    res.status(200).json({ response });
  }
}
