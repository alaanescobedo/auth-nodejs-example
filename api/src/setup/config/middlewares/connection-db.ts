import type { NextFunction, Request, Response } from "express"
import { catchError } from "@error"
import { db } from "@setup/config";


export const connectionDB = catchError(async (_req: Request, res: Response, next: NextFunction) => {
  await db.connect()
  res.on("finish", async function () {
    await db.disconnect()
  });
  next()
})
