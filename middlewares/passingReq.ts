import { NextFunction , Request , Response } from "express";

export const PassingRq = (req: Request, res: Response , next: NextFunction) => {
 console.log(req.method, req.path)
 next()
}