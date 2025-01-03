import { Request, Response } from "express";

export const getAppInfo = (req: Request, res: Response) => {
  res.json({ message: "This is a Node.js service with TypeScript!" });
};
