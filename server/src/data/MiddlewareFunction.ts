import {Request, Response, NextFunction} from "express"

export default interface MiddlewareFunction {
    (req: Request, res: Response, next: NextFunction): void;
}