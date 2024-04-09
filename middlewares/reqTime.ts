import { NextFunction , Response , Request } from "express";

// middleware return date after response from server
export const time = ((req: Request, res: Response, next: NextFunction) => {
  res.on("finish", () => {
    const timeString = new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    console.log("Response sent at:", timeString);
  });
  next();
});